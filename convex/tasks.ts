import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: { text: v.string() },
    handler: async (ctx, args) => {
      // Trim whitespace and check if empty
      const text = args.text.trim();
      if (text.length === 0) {
        throw new Error("Task cannot be empty");
      }
      await ctx.db.insert("tasks", { text });
    },
  });


export const get = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("tasks").collect()).reverse();
  },
});

export const remove = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
    },
  });