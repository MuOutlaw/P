import { v, ConvexError } from "convex/values";
import { mutation } from "../_generated/server";

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
