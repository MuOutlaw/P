import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    // Profile fields
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    // Trust system
    isVerified: v.boolean(),
    rating: v.number(),
    ratingCount: v.number(),
    // Timestamps
    joinedAt: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
