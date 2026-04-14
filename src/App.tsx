import { useConvexAuth } from "convex/react";
import { useState } from "react";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import ProfileSetup from "./components/ProfileSetup";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const profile = useQuery(api.profiles.get);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-rose-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Loading profile
  if (profile === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-amber-500/60 font-mono text-sm tracking-wider animate-pulse">
          Loading your journey...
        </div>
      </div>
    );
  }

  // No profile yet or user wants to edit
  if (!profile || showProfileSetup) {
    return <ProfileSetup existingProfile={profile} onComplete={() => setShowProfileSetup(false)} />;
  }

  return <Dashboard onEditProfile={() => setShowProfileSetup(true)} />;
}
