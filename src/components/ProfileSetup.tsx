import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Profile {
  name?: string;
  skills: string[];
  interests: string[];
  experienceLevel: string;
  workStyle: string;
  riskTolerance: string;
  timeCommitment: string;
  currentRole?: string;
  budget: string;
  targetAudience?: string;
  painPoints: string[];
}

const skillOptions = [
  "Frontend Development", "Backend Development", "Mobile Development", "DevOps",
  "UI/UX Design", "Data Science", "Machine Learning", "Marketing",
  "Sales", "Product Management", "Content Creation", "Community Building"
];

const interestOptions = [
  "Developer Tools", "Productivity", "E-commerce", "Education",
  "Healthcare", "Finance", "Creative Tools", "Social Media",
  "Sustainability", "AI/Automation", "Gaming", "Remote Work"
];

const painPointOptions = [
  "Time management", "Finding customers", "Building MVP fast",
  "Technical challenges", "Marketing & growth", "Pricing strategy",
  "Work-life balance", "Staying motivated", "Competition", "Funding"
];

interface Props {
  existingProfile: Profile | null;
  onComplete: () => void;
}

export default function ProfileSetup({ existingProfile, onComplete }: Props) {
  const upsertProfile = useMutation(api.profiles.upsert);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Profile>({
    name: existingProfile?.name || "",
    skills: existingProfile?.skills || [],
    interests: existingProfile?.interests || [],
    experienceLevel: existingProfile?.experienceLevel || "intermediate",
    workStyle: existingProfile?.workStyle || "solo",
    riskTolerance: existingProfile?.riskTolerance || "moderate",
    timeCommitment: existingProfile?.timeCommitment || "side-project",
    currentRole: existingProfile?.currentRole || "",
    budget: existingProfile?.budget || "bootstrap",
    targetAudience: existingProfile?.targetAudience || "",
    painPoints: existingProfile?.painPoints || [],
  });

  const toggleArrayItem = (field: "skills" | "interests" | "painPoints", item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await upsertProfile(formData);
      onComplete();
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.skills.length > 0;
      case 2: return formData.interests.length > 0;
      case 3: return true;
      case 4: return formData.painPoints.length > 0;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-rose-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">IdeaForge</span>
          </div>
        </header>

        {/* Progress */}
        <div className="px-6 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gray-800"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-500 text-sm">Step {step} of 4</p>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            {step === 1 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">What are your superpowers?</h2>
                <p className="text-gray-400 mb-8">Select the skills you bring to the table</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleArrayItem("skills", skill)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        formData.skills.includes(skill)
                          ? "bg-amber-500/10 border-amber-500/50 text-amber-300"
                          : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <span className="text-sm font-medium">{skill}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">What excites you?</h2>
                <p className="text-gray-400 mb-8">Choose domains you'd love to build in</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleArrayItem("interests", interest)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        formData.interests.includes(interest)
                          ? "bg-rose-500/10 border-rose-500/50 text-rose-300"
                          : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <span className="text-sm font-medium">{interest}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fadeIn space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Your situation</h2>
                  <p className="text-gray-400 mb-8">Help us understand your context</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Experience Level</label>
                    <div className="space-y-2">
                      {[
                        { value: "beginner", label: "Beginner", desc: "Just getting started" },
                        { value: "intermediate", label: "Intermediate", desc: "Some projects under my belt" },
                        { value: "expert", label: "Expert", desc: "Seasoned builder" },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setFormData(prev => ({ ...prev, experienceLevel: opt.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            formData.experienceLevel === opt.value
                              ? "bg-amber-500/10 border-amber-500/50"
                              : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          <span className={`text-sm font-medium ${formData.experienceLevel === opt.value ? "text-amber-300" : "text-gray-300"}`}>{opt.label}</span>
                          <span className="text-xs text-gray-500 block">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Time Commitment</label>
                    <div className="space-y-2">
                      {[
                        { value: "side-project", label: "Side Project", desc: "Few hours/week" },
                        { value: "part-time", label: "Part-time", desc: "10-20 hours/week" },
                        { value: "full-time", label: "Full-time", desc: "All in" },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setFormData(prev => ({ ...prev, timeCommitment: opt.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            formData.timeCommitment === opt.value
                              ? "bg-amber-500/10 border-amber-500/50"
                              : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          <span className={`text-sm font-medium ${formData.timeCommitment === opt.value ? "text-amber-300" : "text-gray-300"}`}>{opt.label}</span>
                          <span className="text-xs text-gray-500 block">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Work Style</label>
                    <div className="space-y-2">
                      {[
                        { value: "solo", label: "Solo", desc: "I work best alone" },
                        { value: "collaborative", label: "Collaborative", desc: "Love working with others" },
                        { value: "hybrid", label: "Hybrid", desc: "Depends on the project" },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setFormData(prev => ({ ...prev, workStyle: opt.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            formData.workStyle === opt.value
                              ? "bg-amber-500/10 border-amber-500/50"
                              : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          <span className={`text-sm font-medium ${formData.workStyle === opt.value ? "text-amber-300" : "text-gray-300"}`}>{opt.label}</span>
                          <span className="text-xs text-gray-500 block">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Budget</label>
                    <div className="space-y-2">
                      {[
                        { value: "bootstrap", label: "Bootstrap", desc: "Minimal spending" },
                        { value: "modest", label: "Modest", desc: "Some budget available" },
                        { value: "funded", label: "Funded", desc: "Ready to invest" },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setFormData(prev => ({ ...prev, budget: opt.value }))}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            formData.budget === opt.value
                              ? "bg-amber-500/10 border-amber-500/50"
                              : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          <span className={`text-sm font-medium ${formData.budget === opt.value ? "text-amber-300" : "text-gray-300"}`}>{opt.label}</span>
                          <span className="text-xs text-gray-500 block">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">What's holding you back?</h2>
                <p className="text-gray-400 mb-8">Select your biggest challenges</p>

                <div className="grid grid-cols-2 gap-3">
                  {painPointOptions.map(point => (
                    <button
                      key={point}
                      onClick={() => toggleArrayItem("painPoints", point)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        formData.painPoints.includes(point)
                          ? "bg-orange-500/10 border-orange-500/50 text-orange-300"
                          : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <span className="text-sm font-medium">{point}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      Generate Ideas
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-gray-600 text-xs">
            Requested by @web-user · Built by @clonkbot
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
