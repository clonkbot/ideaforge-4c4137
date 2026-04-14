import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByIdea = query({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("progress")
      .withIndex("by_idea", (q) => q.eq("ideaId", args.ideaId))
      .order("asc")
      .collect();
  },
});

export const add = mutation({
  args: {
    ideaId: v.id("ideas"),
    milestone: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const idea = await ctx.db.get(args.ideaId);
    if (!idea || idea.userId !== userId) throw new Error("Not found");

    return await ctx.db.insert("progress", {
      userId,
      ideaId: args.ideaId,
      milestone: args.milestone,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const toggle = mutation({
  args: { id: v.id("progress") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new Error("Not found");

    await ctx.db.patch(args.id, {
      completed: !item.completed,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("progress") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== userId) throw new Error("Not found");

    await ctx.db.delete(args.id);
  },
});
