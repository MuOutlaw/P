import { v, ConvexError } from "convex/values";
import { mutation } from "../_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    priceType: v.union(v.literal("fixed"), v.literal("negotiable")),
    category: v.string(),
    subCategory: v.optional(v.string()),
    city: v.string(),
    region: v.optional(v.string()),
    imageStorageIds: v.array(v.id("_storage")),
    // Livestock-specific
    age: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("mixed"))),
    quantity: v.optional(v.number()),
    weight: v.optional(v.string()),
    breed: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });

    // Resolve storage IDs to temporary URLs
    const images: string[] = [];
    for (const storageId of args.imageStorageIds) {
      const url = await ctx.storage.getUrl(storageId);
      if (url) images.push(url);
    }

    const now = new Date().toISOString();
    const listingId = await ctx.db.insert("listings", {
      userId: user._id,
      title: args.title,
      description: args.description,
      price: args.price,
      priceType: args.priceType,
      category: args.category,
      subCategory: args.subCategory,
      city: args.city,
      region: args.region,
      images,
      status: "active",
      isFeatured: false,
      views: 0,
      age: args.age,
      gender: args.gender,
      quantity: args.quantity,
      weight: args.weight,
      breed: args.breed,
      createdAt: now,
      updatedAt: now,
    });

    return listingId;
  },
});

export const update = mutation({
  args: {
    id: v.id("listings"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    priceType: v.optional(v.union(v.literal("fixed"), v.literal("negotiable"))),
    category: v.optional(v.string()),
    city: v.optional(v.string()),
    newImageStorageIds: v.optional(v.array(v.id("_storage"))),
    existingImages: v.optional(v.array(v.string())),
    age: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("mixed"))),
    quantity: v.optional(v.number()),
    weight: v.optional(v.string()),
    breed: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });

    const listing = await ctx.db.get(args.id);
    if (!listing) throw new ConvexError({ code: "NOT_FOUND", message: "Listing not found" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user || user._id !== listing.userId) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Not authorized" });
    }

    // Merge existing + new images
    const existingImages = args.existingImages ?? listing.images;
    const newImages: string[] = [];
    for (const storageId of args.newImageStorageIds ?? []) {
      const url = await ctx.storage.getUrl(storageId);
      if (url) newImages.push(url);
    }

    const updates: Partial<typeof listing> = {
      updatedAt: new Date().toISOString(),
      images: [...existingImages, ...newImages],
    };
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.price !== undefined) updates.price = args.price;
    if (args.priceType !== undefined) updates.priceType = args.priceType;
    if (args.category !== undefined) updates.category = args.category;
    if (args.city !== undefined) updates.city = args.city;
    if (args.age !== undefined) updates.age = args.age;
    if (args.gender !== undefined) updates.gender = args.gender;
    if (args.quantity !== undefined) updates.quantity = args.quantity;
    if (args.weight !== undefined) updates.weight = args.weight;
    if (args.breed !== undefined) updates.breed = args.breed;

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });

    const listing = await ctx.db.get(args.id);
    if (!listing) throw new ConvexError({ code: "NOT_FOUND", message: "Listing not found" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user || user._id !== listing.userId) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Not authorized" });
    }

    await ctx.db.delete(args.id);
  },
});

export const incrementViews = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.id);
    if (!listing) return;
    await ctx.db.patch(args.id, { views: listing.views + 1 });
  },
});

export const markAsSold = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });

    const listing = await ctx.db.get(args.id);
    if (!listing) throw new ConvexError({ code: "NOT_FOUND", message: "Listing not found" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user || user._id !== listing.userId) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Not authorized" });
    }

    await ctx.db.patch(args.id, { status: "sold", updatedAt: new Date().toISOString() });
  },
});

export const reactivate = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });

    const listing = await ctx.db.get(args.id);
    if (!listing) throw new ConvexError({ code: "NOT_FOUND", message: "Listing not found" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user || user._id !== listing.userId) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Not authorized" });
    }

    await ctx.db.patch(args.id, { status: "active", updatedAt: new Date().toISOString() });
  },
});
