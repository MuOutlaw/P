import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isVerified: v.boolean(),
    rating: v.number(),
    ratingCount: v.number(),
    joinedAt: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  listings: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    price: v.number(),
    priceType: v.union(v.literal("fixed"), v.literal("negotiable")),
    category: v.string(),   // camels | sheep | cattle | goats | feed | farms | services | transport
    subCategory: v.optional(v.string()),
    city: v.string(),
    region: v.optional(v.string()),
    images: v.array(v.string()),
    status: v.union(v.literal("active"), v.literal("sold"), v.literal("draft")),
    isFeatured: v.boolean(),
    views: v.number(),
    // Livestock-specific
    age: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("mixed"))),
    quantity: v.optional(v.number()),
    weight: v.optional(v.string()),
    breed: v.optional(v.string()),
    // Timestamps
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_category", ["category"])
    .index("by_city", ["city"])
    .index("by_status", ["status"])
    .index("by_status_and_category", ["status", "category"])
    .index("by_status_and_city", ["status", "city"])
    .index("by_featured", ["isFeatured"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["category", "city", "status"],
    }),

  // Conversation between two users (possibly about a listing)
  conversations: defineTable({
    participantIds: v.array(v.id("users")), // always exactly 2
    listingId: v.optional(v.id("listings")),
    lastMessageAt: v.string(),
    lastMessageText: v.optional(v.string()),
    // unread counts per participant stored as a record
    unreadCounts: v.record(v.string(), v.number()),
  })
    .index("by_lastMessageAt", ["lastMessageAt"])
    .index("by_listing", ["listingId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
    isRead: v.boolean(),
    sentAt: v.string(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_and_sentAt", ["conversationId", "sentAt"]),
});
