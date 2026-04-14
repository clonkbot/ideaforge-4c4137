import { Doc } from "../../convex/_generated/dataModel";

interface Props {
  idea: Doc<"ideas">;
  index: number;
  onClick: () => void;
}

const categoryColors = {
  "micro-saas": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  "saas": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  "both": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
};

const complexityColors = {
  "simple": "text-green-400",
  "moderate": "text-yellow-400",
  "complex": "text-red-400",
};

const statusBadges: Record<string, { bg: string; text: string }> = {
  "new": { bg: "bg-amber-500/20", text: "text-amber-300" },
  "saved": { bg: "bg-blue-500/20", text: "text-blue-300" },
  "in-progress": { bg: "bg-purple-500/20", text: "text-purple-300" },
  "completed": { bg: "bg-emerald-500/20", text: "text-emerald-300" },
  "archived": { bg: "bg-gray-500/20", text: "text-gray-400" },
};

export default function IdeaCard({ idea, index, onClick }: Props) {
  const category = categoryColors[idea.category as keyof typeof categoryColors] || categoryColors["micro-saas"];
  const status = statusBadges[idea.status] || statusBadges["new"];

  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-b from-gray-900/80 to-gray-900/40 border border-gray-800/50 rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300 hover:border-gray-700/50 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Match score indicator */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-gray-800"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${idea.matchScore * 2.83} 283`}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-amber-400">{idea.matchScore}</span>
          </div>
        </div>
      </div>

      {/* Category & Status */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${category.bg} ${category.text} ${category.border} border`}>
          {idea.category === "micro-saas" ? "MicroSaaS" : "SaaS"}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
          {idea.status.replace("-", " ")}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 pr-12 sm:pr-14 group-hover:text-amber-200 transition-colors">
        {idea.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {idea.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {idea.estimatedTime}
        </span>
        <span className={`flex items-center gap-1.5 ${complexityColors[idea.complexity as keyof typeof complexityColors]}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {idea.complexity}
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {idea.potentialRevenue}
        </span>
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  );
}
