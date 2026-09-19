import React, { useState } from "react";
import { Heart, Calendar, Clock, Sparkles, MessageSquare, ArrowLeft, Send, CheckCircle2, Lock } from "lucide-react";

interface StepMessageConfirmProps {
  selectedDays: string[];
  preferredTime: string;
  preferredVibe: string;
  favoriteTreat: string;
  personalMessage: string;
  onChangeMessage: (msg: string) => void;
  contactPhone: string;
  onChangePhone: (phone: string) => void;
  onConfirm: () => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

export const StepMessageConfirm: React.FC<StepMessageConfirmProps> = ({
  selectedDays,
  preferredTime,
  preferredVibe,
  favoriteTreat,
  personalMessage,
  onChangeMessage,
  contactPhone,
  onChangePhone,
  onConfirm,
  onBack,
  isSubmitting
}) => {
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      setErrorMsg("Please go back and select at least one day you're free this week.");
      return;
    }
    setErrorMsg("");
    await onConfirm();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-6 max-w-xl mx-auto text-center">
      {/* Chapter Indicator */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/50 border border-rose-500/20 text-rose-300 text-xs uppercase tracking-widest mb-4">
        <span>Chapter 05</span>
        <span className="w-1 h-1 rounded-full bg-rose-400" />
        <span>Sealing The Invitation</span>
      </div>

      <div className="w-full romantic-card rounded-3xl p-6 sm:p-9 border border-rose-500/25 shadow-2xl relative overflow-hidden text-left">
        <div className="text-center mb-6">
          <span className="text-rose-400 font-script text-3xl sm:text-4xl block mb-1">
            Almost Set
          </span>
          <h2 className="font-serif-romantic text-2xl sm:text-3xl text-rose-100 font-semibold mb-2">
            Here's What You Chose, Amahle
          </h2>
          <p className="text-rose-200/80 text-xs sm:text-sm font-light">
            Take a look and add any special message or song you'd like playing when we meet.
          </p>
        </div>

        {/* Selected Summary Card */}
        <div className="bg-[#1c0d19]/80 border border-rose-400/25 rounded-2xl p-4 mb-6 shadow-inner space-y-2.5">
          <div className="flex items-start gap-2.5 text-xs text-rose-200">
            <Calendar className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-rose-400/80 uppercase font-semibold text-[10px] block tracking-wider">
                Free Day(s) This Week:
              </span>
              <span className="font-medium text-rose-100">
                {selectedDays.length > 0 ? selectedDays.join(" • ") : "None selected yet"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-rose-200">
            <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-rose-400/80 uppercase font-semibold text-[10px] block tracking-wider">
                Preferred Time:
              </span>
              <span className="font-medium text-rose-100">
                {preferredTime || "Flexible / Anytime"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-rose-200">
            <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 fill-rose-400/30" />
            <div>
              <span className="text-rose-400/80 uppercase font-semibold text-[10px] block tracking-wider">
                Date Atmosphere:
              </span>
              <span className="font-medium text-rose-100">
                {preferredVibe || "Cozy Intimate Dinner"}
              </span>
            </div>
          </div>

          {favoriteTreat && (
            <div className="flex items-start gap-2.5 text-xs text-rose-200">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-rose-400/80 uppercase font-semibold text-[10px] block tracking-wider">
                  Sweet Craving:
                </span>
                <span className="font-medium text-rose-100">{favoriteTreat}</span>
              </div>
            </div>
          )}
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 mb-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
              <span>A note for me or a song you want to hear:</span>
            </label>
            <textarea
              rows={3}
              value={personalMessage}
              onChange={(e) => onChangeMessage(e.target.value)}
              placeholder="Tell me anything, your reaction, a favorite playlist vibe, or how your day at Wits is going..."
              className="w-full bg-black/40 border border-rose-500/30 rounded-xl p-3 text-xs sm:text-sm text-rose-100 placeholder-rose-400/40 focus:outline-none focus:border-rose-400 transition-colors"
              id="amahle-personal-message"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 mb-1.5">
              <span>Your WhatsApp / Phone (Optional check):</span>
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => onChangePhone(e.target.value)}
              placeholder="e.g. 071 234 5678 (so I can confirm)"
              className="w-full bg-black/40 border border-rose-500/30 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-rose-100 placeholder-rose-400/40 focus:outline-none focus:border-rose-400 transition-colors"
              id="amahle-phone-confirm"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center gap-2 text-[11px] text-rose-400/80 pt-1">
            <Lock className="w-3 h-3 text-rose-400" />
            <span>Saved directly to our private date log with date & time stamp</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-rose-500/20">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-xs text-rose-300/70 hover:text-rose-200 transition-colors"
              id="back-to-planner-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-medium shadow-xl shadow-rose-950 hover:shadow-rose-600/30 transition-all duration-300 cursor-pointer disabled:opacity-50"
              id="lock-in-date-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Locking in our date...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>Lock In Our Date ❤️</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
