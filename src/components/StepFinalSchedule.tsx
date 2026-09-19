import React, { useState, useMemo, useEffect, useRef } from "react";
import { Calendar, Heart, Sparkles, CheckCircle2, MessageSquare, ArrowRight, ArrowLeft } from "lucide-react";
import { DayOption } from "../types";

interface StepFinalScheduleProps {
  selectedDays: string[];
  onChangeDays: (days: string[]) => void;
  personalMessage: string;
  onChangeMessage: (msg: string) => void;
  onAutoSubmit: (days: string[], message?: string) => Promise<void>;
  onProceedToSuccess: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const StepFinalSchedule: React.FC<StepFinalScheduleProps> = ({
  selectedDays,
  onChangeDays,
  personalMessage,
  onChangeMessage,
  onAutoSubmit,
  onProceedToSuccess,
  onBack,
  isSubmitting
}) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<string | null>(null);
  const [autoSaveTime, setAutoSaveTime] = useState<string | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamically calculate days of this week
  const weekDays: DayOption[] = useMemo(() => {
    const today = new Date();
    const days: DayOption[] = [];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayName = dayNames[d.getDay()];
      const dateNum = d.getDate();
      const month = monthNames[d.getMonth()];
      const isWeekend = d.getDay() === 0 || d.getDay() === 6 || d.getDay() === 5;

      const label = `${dayName}, ${dateNum} ${month}`;
      let tag = "";
      if (d.getDay() === 5) tag = "After Classes 🍷";
      else if (d.getDay() === 6) tag = "Skyline Night ✨";
      else if (d.getDay() === 0) tag = "Sunday Calm ☕";
      else if (d.getDay() === 4) tag = "Mid-week Breather 🍰";

      days.push({
        dayName,
        formattedDate: label,
        isWeekend,
        label,
        tag
      });
    }
    return days;
  }, []);

  // Handle instant selection and auto-submit
  const handleSelectDay = async (dayLabel: string) => {
    let updated: string[];
    if (selectedDays.includes(dayLabel)) {
      updated = selectedDays.filter((d) => d !== dayLabel);
    } else {
      updated = [...selectedDays, dayLabel];
    }
    onChangeDays(updated);

    if (updated.length > 0) {
      setAutoSaveStatus("saving");
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-ZA", {
        timeZone: "Africa/Johannesburg",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      try {
        await onAutoSubmit(updated, personalMessage);
        setAutoSaveTime(timeStr);
        setAutoSaveStatus("saved");

        // Clear previous timer if any
        if (autoAdvanceTimerRef.current) {
          clearTimeout(autoAdvanceTimerRef.current);
        }

        // Set a gentle auto-advance timer to celebration screen (1.8s) so she sees it auto-saved
        autoAdvanceTimerRef.current = setTimeout(() => {
          onProceedToSuccess();
        }, 1800);
      } catch (err) {
        setAutoSaveStatus("error");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const handleManualProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    if (selectedDays.length === 0) {
      alert("Please choose at least one day this week! 😊");
      return;
    }
    onAutoSubmit(selectedDays, personalMessage).then(() => {
      onProceedToSuccess();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-6 max-w-xl mx-auto text-center">
      {/* Decorative badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/25 text-rose-300 text-xs uppercase tracking-widest mb-4 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
        <span>Date Night Invitation</span>
      </div>

      <div className="w-full romantic-card rounded-3xl p-6 sm:p-9 border border-rose-500/25 shadow-2xl relative overflow-hidden text-left">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-rose-400 font-script text-3xl sm:text-4xl block mb-1">
            Dear Amahle,
          </span>
          <h2 className="font-serif-romantic text-2xl sm:text-3xl text-rose-100 font-semibold mb-2">
            When Are You Free This Week?
          </h2>
          <p className="text-rose-200/85 text-xs sm:text-sm font-light max-w-md mx-auto">
            Walking you from Wits Main to Focus 1 res yesterday made my entire week. Tap the day that works best for you — it auto-saves immediately into our private form!
          </p>
        </div>

        {/* Live Auto-Save Google Form Status Pill */}
        {autoSaveStatus === "saved" && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 flex items-center justify-between text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">
                Auto-saved to Google Form! ({autoSaveTime} SAST)
              </span>
            </div>
            <button
              onClick={onProceedToSuccess}
              className="text-[11px] underline font-semibold text-emerald-300 hover:text-white cursor-pointer"
            >
              Continue Now &rarr;
            </button>
          </div>
        )}

        {autoSaveStatus === "saving" && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-950/70 border border-rose-500/30 text-rose-200 flex items-center gap-2 text-xs">
            <div className="w-3.5 h-3.5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
            <span>Auto-saving your date to the database...</span>
          </div>
        )}

        <form onSubmit={handleManualProceed} className="space-y-6">
          {/* Day selection grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>Select Your Free Day(s) This Week:</span>
              </label>
              <span className="text-[10px] text-rose-400/80 italic">Tap to select & auto-save</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {weekDays.map((day) => {
                const isSelected = selectedDays.includes(day.label);
                return (
                  <button
                    key={day.label}
                    type="button"
                    onClick={() => handleSelectDay(day.label)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-rose-600/50 via-pink-600/40 to-rose-600/50 border-rose-400 text-rose-100 shadow-lg shadow-rose-950/70 scale-[1.02]"
                        : "bg-[#1c0d18]/60 hover:bg-[#281324] border-rose-500/20 text-rose-300/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-semibold text-rose-100 truncate block">
                        {day.dayName}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-rose-300" />
                      ) : (
                        day.tag && (
                          <span className="text-[9px] text-pink-300/90 font-serif-romantic italic">
                            {day.tag.split(" ")[0]}
                          </span>
                        )
                      )}
                    </div>
                    <span className="text-[11px] text-rose-300/70 block truncate">
                      {day.label.split(", ")[1] || day.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note / Song request */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
              <span>A note for me or a song request for the car (optional):</span>
            </label>
            <textarea
              rows={2}
              value={personalMessage}
              onChange={(e) => onChangeMessage(e.target.value)}
              placeholder="Tell me a song you want playing, or anything that makes you smile..."
              className="w-full bg-[#180b15]/70 border border-rose-500/25 rounded-xl p-3 text-xs text-rose-100 placeholder:text-rose-400/40 focus:outline-none focus:border-rose-400 transition-colors resize-none"
            />
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || selectedDays.length === 0}
              id="confirm-date-night-btn"
              className="w-full relative group inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-sm sm:text-base shadow-xl shadow-rose-950/80 hover:shadow-rose-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 text-rose-200 fill-rose-200/50 group-hover:scale-110 transition-transform" />
                  <span>
                    {selectedDays.length > 0
                      ? `Confirm For ${selectedDays.join(", ")} ❤️`
                      : "Select a Day Above 🌹"}
                  </span>
                </>
              )}
            </button>
            <p className="text-[11px] text-rose-400/70 text-center mt-2 italic">
              (Auto-fills and stores into the private Google Form responses with exact timestamp)
            </p>
          </div>
        </form>

        {/* Back button */}
        <div className="flex items-center justify-start pt-4 border-t border-rose-500/20 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-rose-300/70 hover:text-rose-200 transition-colors cursor-pointer"
            id="back-to-cover-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Intro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
