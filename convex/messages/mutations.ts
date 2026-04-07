import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel.d.ts";

// Start or get existing conversation, return conversationId
export const startConversation = mutation({
  args: {
    otherUserId: v.id("users"),
    listingId: v.optional(v.id("listings")),
    initialMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ message: "غير مصرح", code: "UNAUTHENTICATED" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ message: "المستخدم غير موجود", code: "NOT_FOUND" });

    if (user._id === args.otherUserId) {
      throw new ConvexError({ message: "لا يمكنك مراسلة نفسك", code: "BAD_REQUEST" });
    }

    // Check if conversation already exists
    let conversationId: Id<"conversations"> | null = null;
    if (args.listingId) {
      const candidates = await ctx.db
        .query("conversations")
        .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
        .collect();
      const existing = candidates.find(
        (c) =>
          c.participantIds.includes(user._id) &&
          c.participantIds.includes(args.otherUserId)
      );
      if (existing) conversationId = existing._id;
    }

    const now = new Date().toISOString();

    if (!conversationId) {
      // Create new conversation
      conversationId = await ctx.db.insert("conversations", {
        participantIds: [user._id, args.otherUserId],
        listingId: args.listingId,
        lastMessageAt: now,
        lastMessageText: args.initialMessage,
        unreadCounts: { [args.otherUserId]: 1 },
      });
    }

    // Insert the first message
    await ctx.db.insert("messages", {
      conversationId: conversationId as Id<"conversations">,
      senderId: user._id,
      text: args.initialMessage,
      isRead: false,
      sentAt: now,
    });

    // Update conversation metadata
    const conv = await ctx.db.get(conversationId as Id<"conversations">);
    if (conv && "unreadCounts" in conv) {
      const newUnread = { ...conv.unreadCounts };
      newUnread[args.otherUserId] = (newUnread[args.otherUserId] ?? 0) + 1;
      await ctx.db.patch(conversationId as Id<"conversations">, {
        lastMessageAt: now,
        lastMessageText: args.initialMessage,
        unreadCounts: newUnread,
      });
    }

    return conversationId;
  },
});

// Send a message in an existing conversation
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ message: "غير مصرح", code: "UNAUTHENTICATED" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ message: "المستخدم غير موجود", code: "NOT_FOUND" });

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.participantIds.includes(user._id)) {
      throw new ConvexError({ message: "غير مصرح بالوصول", code: "FORBIDDEN" });
    }

    const now = new Date().toISOString();
    const otherId = conversation.participantIds.find((id) => id !== user._id);

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: user._id,
      text: args.text,
      isRead: false,
      sentAt: now,
    });

    // Update conversation
    const newUnread = { ...conversation.unreadCounts };
    if (otherId) {
      newUnread[otherId] = (newUnread[otherId] ?? 0) + 1;
    }
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: now,
      lastMessageText: args.text,
      unreadCounts: newUnread,
    });
  },
});

// Mark all messages in a conversation as read for current user
export const markConversationRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.participantIds.includes(user._id)) return;

    const newUnread = { ...conversation.unreadCounts };
    newUnread[user._id] = 0;
    await ctx.db.patch(args.conversationId, { unreadCounts: newUnread });

    // Mark all unread messages as read
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    for (const msg of unreadMessages) {
      if (!msg.isRead && msg.senderId !== user._id) {
        await ctx.db.patch(msg._id, { isRead: true });
      }
    }
  },
});
