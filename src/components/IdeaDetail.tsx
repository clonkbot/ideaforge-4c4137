import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

type Milestone = {
  _id: Id<"progress">;
  milestone: string;
  completed: boolean;
};

interface Props {
  idea: Doc<"ideas">;
  onClose: () => void;
}

const statusOptions = [
  { value: "new", label: "New", color: "amber" },
  { value: "saved", label: "Saved", color: "blue" },
  { value: "in-progress", label: "In Progress", color: "purple" },
  { value: "completed", label: "Completed", color: "emerald" },
  { value: "archived", label: "Archived", color: "gray" },
];

export default function IdeaDetail({ idea, onClose }: Props) {
  const updateStatus = useMutation(api.ideas.updateStatus);
  const updateNotes = useMutation(api.ideas.updateNotes);
  const removeIdea = useMutation(api.ideas.remove);
  const addMilestone = useMutation(api.progress.add);
  const toggleMilestone = useMutation(api.progress.toggle);
  const removeMilestone = useMutation(api.progress.remove);

  const milestones = useQuery(api.progress.listByIdea, { ideaId: idea._id });

  const [notes, setNotes] = useState(idea.notes || "");
  const [newMilestone, setNewMilestone] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = async (status: string) => {
    await updateStatus({ id: idea._id, status });
  };

  const handleSaveNotes = async () => {
    await updateNotes({ id: idea._id, notes });
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    await addMilestone({ ideaId: idea._id, milestone: newMilestone.trim() });
    setNewMilestone("");
  };

  const handleDelete = async () => {
    await removeIdea({ id: idea._id });
    onClose();
  };

  const completedCount = milestones?.filter((m: Milestone) => m.completed).length || 0;
  const totalCount = milestones?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-3xl max-h-[90vh] bg-[#0d0d12] sm:rounded-2xl overflow-hidden border-t sm:border border-gray-800/50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0d0d12] border-b border-gray-800/50 px-4 sm:px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  idea.category === "micro-saas"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {idea.category === "micro-saas" ? "MicroSaaS" : "SaaS"}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  idea.complexity === "simple" ? "bg-green-500/10 text-green-400" :
                  idea.complexity === "moderate" ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-red-500/10 text-red-400"
                }`}>
                  {idea.complexity}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{idea.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors shrink-0"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
          {/* Match score banner */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-800" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="url(#gradientDetail)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${idea.matchScore * 1.76} 176`} />
                <defs>
                  <linearGradient id="gradientDetail" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-amber-400">{idea.matchScore}</span>
              </div>
            </div>
            <div>
              <div className="text-amber-300 font-semibold">Match Score</div>
              <div className="text-amber-200/60 text-sm">Based on your profile</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
            <p className="text-gray-200 leading-relaxed">{idea.description}</p>
          </div>

          {/* Grid info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
              <div className="text-gray-500 text-xs mb-1">Time to Build</div>
              <div className="text-white font-semibold">{idea.estimatedTime}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
              <div className="text-gray-500 text-xs mb-1">Revenue Potential</div>
              <div className="text-emerald-400 font-semibold">{idea.potentialRevenue}</div>
            </div>
          </div>

          {/* Target market */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Target Market</h3>
            <p className="text-gray-200">{idea.targetMarket}</p>
          </div>

          {/* Key features */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {idea.keyFeatures.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-gray-200">
                  <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Suggested Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {idea.techStack.map((tech: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-lg text-sm border border-gray-700/50">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    idea.status === opt.value
                      ? opt.color === "amber" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                        opt.color === "blue" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                        opt.color === "purple" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                        opt.color === "emerald" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                        "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress milestones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Progress Milestones</h3>
              {totalCount > 0 && (
                <span className="text-xs text-gray-500">{completedCount}/{totalCount} completed</span>
              )}
            </div>

            <form onSubmit={handleAddMilestone} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newMilestone}
                onChange={e => setNewMilestone(e.target.value)}
                placeholder="Add a milestone..."
                className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                type="submit"
                disabled={!newMilestone.trim()}
                className="px-4 py-2.5 bg-amber-500/20 text-amber-300 rounded-lg text-sm font-medium hover:bg-amber-500/30 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </form>

            {milestones && milestones.length > 0 ? (
              <div className="space-y-2">
                {milestones.map((m: Milestone) => (
                  <div
                    key={m._id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      m.completed ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-gray-800/30 border border-gray-700/30"
                    }`}
                  >
                    <button
                      onClick={() => toggleMilestone({ id: m._id })}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                        m.completed ? "bg-emerald-500 border-emerald-500" : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      {m.completed && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${m.completed ? "text-gray-400 line-through" : "text-gray-200"}`}>
                      {m.milestone}
                    </span>
                    <button
                      onClick={() => removeMilestone({ id: m._id })}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No milestones yet. Add your first one!</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={handleSaveNotes}
              placeholder="Add your thoughts, ideas, or plans..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>

          {/* Delete */}
          <div className="pt-4 border-t border-gray-800/50">
            {showDeleteConfirm ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <span className="text-red-300 text-sm flex-1">Delete this idea permanently?</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 sm:flex-none px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-gray-500 hover:text-red-400 text-sm transition-colors"
              >
                Delete this idea
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
