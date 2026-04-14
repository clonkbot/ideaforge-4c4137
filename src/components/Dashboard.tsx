import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import IdeaCard from "./IdeaCard";
import IdeaDetail from "./IdeaDetail";
import { Id, Doc } from "../../convex/_generated/dataModel";

interface Props {
  onEditProfile: () => void;
}

type IdeaStatus = "all" | "new" | "saved" | "in-progress" | "completed" | "archived";

type Idea = Doc<"ideas">;

export default function Dashboard({ onEditProfile }: Props) {
  const { signOut } = useAuthActions();
  const profile = useQuery(api.profiles.get);
  const ideas = useQuery(api.ideas.list, {});
  const generateIdeas = useMutation(api.ideas.generate);

  const [filter, setFilter] = useState<IdeaStatus>("all");
  const [selectedIdeaId, setSelectedIdeaId] = useState<Id<"ideas"> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateIdeas();
    } catch (error) {
      console.error("Failed to generate ideas:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredIdeas = ideas?.filter((idea: Idea) =>
    filter === "all" ? true : idea.status === filter
  ) || [];

  const selectedIdea = ideas?.find((i: Idea) => i._id === selectedIdeaId);

  const statusCounts = {
    all: ideas?.length || 0,
    new: ideas?.filter((i: Idea) => i.status === "new").length || 0,
    saved: ideas?.filter((i: Idea) => i.status === "saved").length || 0,
    "in-progress": ideas?.filter((i: Idea) => i.status === "in-progress").length || 0,
    completed: ideas?.filter((i: Idea) => i.status === "completed").length || 0,
    archived: ideas?.filter((i: Idea) => i.status === "archived").length || 0,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-rose-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white hidden sm:block">IdeaForge</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={onEditProfile}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 bg-[#0a0a0f]/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => { onEditProfile(); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome section */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Here are SaaS ideas tailored to your unique profile
          </p>
        </div>

        {/* Generate button */}
        <div className="mb-8">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-70 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              {isGenerating ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm sm:text-base">Generating Ideas...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm sm:text-base">Generate New Ideas</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max">
            {(["all", "new", "saved", "in-progress", "completed", "archived"] as IdeaStatus[]).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  filter === status
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-gray-900/50 text-gray-400 border border-gray-800 hover:border-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                <span className={`ml-1.5 sm:ml-2 ${filter === status ? "text-amber-400" : "text-gray-500"}`}>
                  {statusCounts[status]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ideas grid */}
        {ideas === undefined ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-amber-500/60 font-mono text-sm tracking-wider animate-pulse">
              Loading ideas...
            </div>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gray-800/50 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No ideas yet</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6">
              {filter === "all"
                ? "Generate your first batch of personalized ideas!"
                : `No ${filter} ideas. Change filter or generate new ones.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea: Idea, index: number) => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                index={index}
                onClick={() => setSelectedIdeaId(idea._id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-gray-800/30 mt-12">
        <p className="text-gray-600 text-xs">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>

      {/* Idea detail modal */}
      {selectedIdea && (
        <IdeaDetail
          idea={selectedIdea}
          onClose={() => setSelectedIdeaId(null)}
        />
      )}
    </div>
  );
}
