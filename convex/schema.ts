import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles with character and situation info
  profiles: defineTable({
    userId: v.id("users"),
    name: v.optional(v.string()),
    // Character traits
    skills: v.array(v.string()),
    interests: v.array(v.string()),
    experienceLevel: v.string(), // beginner, intermediate, expert
    workStyle: v.string(), // solo, collaborative, hybrid
    riskTolerance: v.string(), // conservative, moderate, aggressive
    timeCommitment: v.string(), // side-project, part-time, full-time
    // Situation
    currentRole: v.optional(v.string()),
    budget: v.string(), // bootstrap, modest, funded
    targetAudience: v.optional(v.string()),
    painPoints: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Generated SaaS ideas
  ideas: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    category: v.string(), // micro-saas, saas, both
    complexity: v.string(), // simple, moderate, complex
    estimatedTime: v.string(),
    potentialRevenue: v.string(),
    targetMarket: v.string(),
    keyFeatures: v.array(v.string()),
    techStack: v.array(v.string()),
    matchScore: v.number(), // 0-100 how well it matches user's profile
    status: v.string(), // new, saved, in-progress, completed, archived
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_user_score", ["userId", "matchScore"]),

  // Progress tracking for ideas user is working on
  progress: defineTable({
    userId: v.id("users"),
    ideaId: v.id("ideas"),
    milestone: v.string(),
    completed: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_idea", ["ideaId"])
    .index("by_user", ["userId"]),
});
