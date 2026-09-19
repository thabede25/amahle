import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FloatingPetals } from "./components/FloatingPetals";
import { YouTubeBackgroundAudio } from "./components/YouTubeBackgroundAudio";
import { StepCover } from "./components/StepCover";
import { StepFinalSchedule } from "./components/StepFinalSchedule";
import { StepSuccess } from "./components/StepSuccess";
import { AdminModal } from "./components/AdminModal";
import { DateResponse, OrganizerConfig } from "./types";
import { saveDateResponse, fetchConfig } from "./services/api";
import { Lock, Heart, Sparkles } from "lucide-react";

export default function App() {
  // Navigation steps:
  // 0: Cover (Walk from Wits Main to Focus 1 & Song)
  // 1: Date Night Free Day Selection (Auto-saves to Google Form)
  // 2: Date Confirmed (VIP Pass & Celebration)
  const [currentStep, setCurrentStep] = useState(0);

  // Audio trigger
  const [musicTriggered, setMusicTriggered] = useState(false);

  // Date selection state
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [personalMessage, setPersonalMessage] = useState<string>("");

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedEntry, setSavedEntry] = useState<DateResponse | null>(null);

  // Admin & Google Form Responses modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [config, setConfig] = useState<OrganizerConfig>({
    organizerName: "Him",
    organizerPhone: "",
    audioTitle: "Special Song for Amahle"
  });

  useEffect(() => {
    fetchConfig().then(setConfig).catch(() => {});
  }, []);

  const handleStartExperience = () => {
    setMusicTriggered(true);
    setCurrentStep(1);
  };

  // Auto-submits immediately to the private Google Form database when she taps a date
  const handleAutoSubmit = async (days: string[], message?: string) => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const payload: Partial<DateResponse> = {
        name: "Amahle",
        selectedDays: days,
        preferredTime: "Flexible Evening",
        preferredVibe: "Date Night",
        favoriteTreat: "Dinner & Treats",
        personalMessage: message !== undefined ? message : personalMessage,
        contactPhone: "",
        answers: {
          campus: "Wits Main Campus",
          residence: "Focus 1 Residence",
          hometown: "Chatsworth, Durban",
          memory: "Walked together from Wits Main to Focus 1 Residence yesterday"
        }
      };

      const res = await saveDateResponse(payload);
      if (res.success && res.entry) {
        setSavedEntry(res.entry);
      } else {
        setSavedEntry({
          id: "resp_" + Date.now(),
          name: "Amahle",
          selectedDays: days,
          preferredTime: "Flexible Evening",
          preferredVibe: "Date Night",
          favoriteTreat: "Dinner & Treats",
          personalMessage: message || personalMessage,
          contactPhone: "",
          answers: payload.answers || {},
          timestamp: now.toISOString(),
          timestampFormattedSAST: now.toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" }),
          createdAt: now.toISOString()
        });
      }
    } catch (err) {
      console.error("Auto-submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToSuccess = () => {
    setCurrentStep(2);
  };

  const handleRestart = () => {
    setCurrentStep(0);
  };

  const stepLabels = [
    "Welcome",
    "Choose Your Day (Auto-Saved)",
    "Date Confirmed"
  ];

  return (
    <div className="relative min-h-screen bg-[#0c080b] text-[#f7eef2] overflow-x-hidden flex flex-col justify-between selection:bg-rose-500/30 selection:text-rose-200">
      {/* Ambient background rose glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-rose-950/25 via-pink-950/15 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[400px] bg-rose-900/15 blur-3xl pointer-events-none z-0" />

      {/* Atmospheric falling rose petals */}
      <FloatingPetals count={22} />

      {/* Background YouTube Song Player with Video ID requested: T8pHl2o_g1k */}
      <YouTubeBackgroundAudio
        videoId="T8pHl2o_g1k"
        autoPlayTrigger={musicTriggered}
      />

      {/* Progress indicator bar (visible on step 1) */}
      {currentStep === 1 && (
        <header className="relative z-30 pt-4 px-4 max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between text-[11px] text-rose-300/80 mb-2 font-mono">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400/40" />
              <span>For Amahle</span>
            </span>
            <span className="text-pink-300/90 font-serif-romantic italic">
              {stepLabels[currentStep]}
            </span>
          </div>

          <div className="h-1.5 w-full bg-rose-950/50 rounded-full overflow-hidden border border-rose-500/15">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-rose-400 transition-all duration-500 rounded-full"
              style={{ width: "65%" }}
            />
          </div>
        </header>
      )}

      {/* Main Multi-Page Transitions */}
      <main className="relative z-20 flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <StepCover onStart={handleStartExperience} />
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <StepFinalSchedule
                selectedDays={selectedDays}
                onChangeDays={setSelectedDays}
                personalMessage={personalMessage}
                onChangeMessage={setPersonalMessage}
                onAutoSubmit={handleAutoSubmit}
                onProceedToSuccess={handleProceedToSuccess}
                onBack={() => setCurrentStep(0)}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <StepSuccess
                responseEntry={savedEntry}
                organizerPhone={config.organizerPhone}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Romantic subtle footer with Google Form responses button */}
      <footer className="relative z-30 py-4 px-6 text-center text-[11px] text-rose-400/60 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-400/60" />
          <span>Made for Amahle &bull; Intombi YaseThekwini</span>
        </div>

        {/* Button to open Google Form responses */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="inline-flex items-center gap-1.5 text-[11px] bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-500/30 px-3 py-1.5 rounded-full transition-colors cursor-pointer shadow-sm"
          title="Open Google Form Responses Dashboard"
          id="open-google-form-responses-btn"
        >
          <Lock className="w-3 h-3 text-pink-400" />
          <span>📊 Responses (Google Form View)</span>
        </button>
      </footer>

      {/* Private Database & Config Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onConfigUpdated={() => fetchConfig().then(setConfig).catch(() => {})}
      />
    </div>
  );
}
