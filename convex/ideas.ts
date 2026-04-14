import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Idea templates based on different profiles
const ideaTemplates = [
  {
    title: "API Usage Analytics Dashboard",
    description: "A lightweight dashboard that helps developers track and visualize their API consumption across multiple services. Perfect for indie hackers managing multiple side projects.",
    category: "micro-saas",
    complexity: "simple",
    estimatedTime: "2-4 weeks",
    potentialRevenue: "$500-2,000/mo",
    targetMarket: "Independent developers and small dev teams",
    keyFeatures: ["Multi-API integration", "Usage alerts", "Cost predictions", "Export reports"],
    techStack: ["Next.js", "PostgreSQL", "Chart.js", "Stripe"],
    tags: ["technical", "solo", "bootstrap", "developer-tools"],
  },
  {
    title: "Client Feedback Portal",
    description: "A simple portal where freelancers and agencies can collect, organize, and respond to client feedback on deliverables. Reduces email chaos.",
    category: "micro-saas",
    complexity: "simple",
    estimatedTime: "3-5 weeks",
    potentialRevenue: "$1,000-5,000/mo",
    targetMarket: "Freelancers, agencies, consultants",
    keyFeatures: ["Branded portals", "Screenshot annotations", "Version history", "Approval workflows"],
    techStack: ["React", "Node.js", "MongoDB", "AWS S3"],
    tags: ["creative", "collaborative", "freelancer", "communication"],
  },
  {
    title: "Niche Job Board Builder",
    description: "A platform that lets community leaders spin up job boards for specific niches (remote ML engineers, climate tech, etc.) with built-in applicant tracking.",
    category: "saas",
    complexity: "moderate",
    estimatedTime: "2-3 months",
    potentialRevenue: "$3,000-15,000/mo",
    targetMarket: "Community builders, newsletter operators, niche recruiters",
    keyFeatures: ["Custom branding", "ATS integration", "Featured listings", "Newsletter export"],
    techStack: ["Next.js", "Prisma", "PostgreSQL", "Resend"],
    tags: ["community", "part-time", "moderate-budget", "marketplace"],
  },
  {
    title: "AI Meeting Note Summarizer",
    description: "Upload meeting recordings or transcripts and get structured summaries with action items, decisions, and follow-ups automatically extracted.",
    category: "micro-saas",
    complexity: "moderate",
    estimatedTime: "4-6 weeks",
    potentialRevenue: "$2,000-8,000/mo",
    targetMarket: "Remote teams, consultants, executives",
    keyFeatures: ["AI summarization", "Action item extraction", "Calendar integration", "Team sharing"],
    techStack: ["Python", "FastAPI", "OpenAI", "Whisper"],
    tags: ["ai", "productivity", "remote-work", "technical"],
  },
  {
    title: "Subscription Box Analytics",
    description: "Help subscription box businesses understand their churn, LTV, and product preferences through cohort analysis and predictive insights.",
    category: "saas",
    complexity: "moderate",
    estimatedTime: "2-3 months",
    potentialRevenue: "$5,000-20,000/mo",
    targetMarket: "Subscription box founders and ecommerce operators",
    keyFeatures: ["Shopify/Stripe integration", "Churn prediction", "Product affinity", "Cohort reports"],
    techStack: ["React", "Python", "PostgreSQL", "dbt"],
    tags: ["data", "ecommerce", "analytics", "funded"],
  },
  {
    title: "Content Repurposing Engine",
    description: "Turn long-form content (podcasts, videos, articles) into multiple social media posts, threads, and short clips with AI assistance.",
    category: "micro-saas",
    complexity: "moderate",
    estimatedTime: "6-8 weeks",
    potentialRevenue: "$3,000-12,000/mo",
    targetMarket: "Content creators, marketers, podcast hosts",
    keyFeatures: ["Multi-format output", "Brand voice training", "Scheduling", "Analytics"],
    techStack: ["Next.js", "FFmpeg", "OpenAI", "Buffer API"],
    tags: ["creative", "marketing", "content", "ai"],
  },
  {
    title: "Micro-Consulting Booking Platform",
    description: "A Calendly alternative specifically for consultants who offer paid micro-consultations (15-30 min calls) with built-in payments and contracts.",
    category: "micro-saas",
    complexity: "simple",
    estimatedTime: "3-4 weeks",
    potentialRevenue: "$1,500-6,000/mo",
    targetMarket: "Expert consultants, coaches, advisors",
    keyFeatures: ["Paid bookings", "Contract signing", "Video integration", "Client CRM"],
    techStack: ["Svelte", "Supabase", "Stripe", "Cal.com"],
    tags: ["consulting", "solo", "bootstrap", "services"],
  },
  {
    title: "Open Source Dependency Monitor",
    description: "Track security vulnerabilities, license changes, and maintenance status of all open source dependencies across your organization's repos.",
    category: "saas",
    complexity: "complex",
    estimatedTime: "3-4 months",
    potentialRevenue: "$10,000-50,000/mo",
    targetMarket: "Engineering teams, CTOs, security teams",
    keyFeatures: ["Multi-repo scanning", "License compliance", "Security alerts", "SBOM generation"],
    techStack: ["Go", "PostgreSQL", "Redis", "GitHub API"],
    tags: ["security", "developer-tools", "enterprise", "technical"],
  },
  {
    title: "Customer Interview Repository",
    description: "A searchable database for product teams to store, tag, and extract insights from customer interviews and user research sessions.",
    category: "saas",
    complexity: "moderate",
    estimatedTime: "2-3 months",
    potentialRevenue: "$5,000-25,000/mo",
    targetMarket: "Product managers, UX researchers, startup founders",
    keyFeatures: ["Transcript search", "Insight tagging", "Team collaboration", "Trend analysis"],
    techStack: ["React", "Elasticsearch", "PostgreSQL", "OpenAI"],
    tags: ["product", "research", "collaborative", "ux"],
  },
  {
    title: "Waitlist with Viral Mechanics",
    description: "A waitlist tool that gamifies referrals with leaderboards, milestones, and rewards to help pre-launch products build buzz organically.",
    category: "micro-saas",
    complexity: "simple",
    estimatedTime: "2-3 weeks",
    potentialRevenue: "$800-4,000/mo",
    targetMarket: "Startup founders, product launches, indie hackers",
    keyFeatures: ["Referral tracking", "Leaderboards", "Custom rewards", "Email integration"],
    techStack: ["Next.js", "Supabase", "Resend", "Vercel"],
    tags: ["marketing", "growth", "bootstrap", "viral"],
  },
  {
    title: "Freelance Contract Generator",
    description: "AI-powered contract generator that creates legally-sound freelance agreements based on project type, jurisdiction, and specific requirements.",
    category: "micro-saas",
    complexity: "moderate",
    estimatedTime: "4-6 weeks",
    potentialRevenue: "$2,000-8,000/mo",
    targetMarket: "Freelancers, small agencies, solopreneurs",
    keyFeatures: ["Template library", "AI customization", "E-signatures", "Multi-jurisdiction"],
    techStack: ["Next.js", "OpenAI", "DocuSign API", "PostgreSQL"],
    tags: ["legal", "freelancer", "ai", "solo"],
  },
  {
    title: "SaaS Pricing A/B Tester",
    description: "Help SaaS founders test different pricing strategies without engineering work. Show different prices to segments and track conversion.",
    category: "micro-saas",
    complexity: "moderate",
    estimatedTime: "5-7 weeks",
    potentialRevenue: "$3,000-15,000/mo",
    targetMarket: "SaaS founders, growth teams, indie hackers",
    keyFeatures: ["No-code setup", "Segment targeting", "Revenue tracking", "Statistical analysis"],
    techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
    tags: ["growth", "pricing", "saas", "analytics"],
  },
];

function calculateMatchScore(profile: {
  skills: string[];
  interests: string[];
  experienceLevel: string;
  workStyle: string;
  riskTolerance: string;
  timeCommitment: string;
  budget: string;
  painPoints: string[];
}, idea: typeof ideaTemplates[0]): number {
  let score = 50; // Base score

  // Complexity matching based on experience
  const complexityMap: Record<string, string[]> = {
    beginner: ["simple"],
    intermediate: ["simple", "moderate"],
    expert: ["simple", "moderate", "complex"],
  };
  if (complexityMap[profile.experienceLevel]?.includes(idea.complexity)) {
    score += 15;
  }

  // Time commitment matching
  const timeMap: Record<string, string[]> = {
    "side-project": ["2-3 weeks", "2-4 weeks", "3-4 weeks", "3-5 weeks"],
    "part-time": ["2-4 weeks", "3-5 weeks", "4-6 weeks", "5-7 weeks", "6-8 weeks"],
    "full-time": ["2-3 months", "3-4 months"],
  };
  if (timeMap[profile.timeCommitment]?.some(t => idea.estimatedTime.includes(t.split("-")[0]))) {
    score += 10;
  }

  // Budget matching
  if (profile.budget === "bootstrap" && idea.category === "micro-saas") {
    score += 10;
  }
  if (profile.budget === "funded" && idea.category === "saas") {
    score += 10;
  }

  // Interest/tag matching
  const interestMatches = profile.interests.filter(interest =>
    idea.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()) ||
                         interest.toLowerCase().includes(tag.toLowerCase()))
  ).length;
  score += interestMatches * 5;

  // Work style matching
  if (profile.workStyle === "solo" && idea.tags.includes("solo")) {
    score += 8;
  }
  if (profile.workStyle === "collaborative" && idea.tags.includes("collaborative")) {
    score += 8;
  }

  // Add some randomness for variety (±10)
  score += Math.floor(Math.random() * 20) - 10;

  return Math.min(100, Math.max(0, score));
}

export const generate = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Please complete your profile first");

    // Generate 3 ideas based on profile
    const shuffled = [...ideaTemplates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    const createdIds = [];
    for (const template of selected) {
      const matchScore = calculateMatchScore(profile, template);

      const id = await ctx.db.insert("ideas", {
        userId,
        title: template.title,
        description: template.description,
        category: template.category,
        complexity: template.complexity,
        estimatedTime: template.estimatedTime,
        potentialRevenue: template.potentialRevenue,
        targetMarket: template.targetMarket,
        keyFeatures: template.keyFeatures,
        techStack: template.techStack,
        matchScore,
        status: "new",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      createdIds.push(id);
    }

    return createdIds;
  },
});

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query("ideas")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    const ideas = await query.order("desc").collect();

    if (args.status) {
      return ideas.filter(idea => idea.status === args.status);
    }

    return ideas;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("ideas"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const idea = await ctx.db.get(args.id);
    if (!idea || idea.userId !== userId) throw new Error("Not found");

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const updateNotes = mutation({
  args: {
    id: v.id("ideas"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const idea = await ctx.db.get(args.id);
    if (!idea || idea.userId !== userId) throw new Error("Not found");

    await ctx.db.patch(args.id, {
      notes: args.notes,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const idea = await ctx.db.get(args.id);
    if (!idea || idea.userId !== userId) throw new Error("Not found");

    // Delete associated progress
    const progressItems = await ctx.db
      .query("progress")
      .withIndex("by_idea", (q) => q.eq("ideaId", args.id))
      .collect();

    for (const item of progressItems) {
      await ctx.db.delete(item._id);
    }

    await ctx.db.delete(args.id);
  },
});
