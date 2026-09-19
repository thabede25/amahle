import React, { useState } from "react";
import { Heart, Sparkles, CheckCircle2, MessageCircle, Copy, Calendar, Clock, Ticket, Share2 } from "lucide-react";
import { DateResponse } from "../types";

interface StepSuccessProps {
  responseEntry: DateResponse | null;
  organizerPhone?: string;
  onRestart: () => void;
}

export const StepSuccess: React.FC<StepSuccessProps> = ({ responseEntry, organizerPhone, onRestart }) => {
  const [copied, setCopied] = useState(false);

  const selectedDaysStr = responseEntry?.selectedDays.join(", ") || "this week";
  const timeFormatted = responseEntry?.timestampFormattedSAST || "Logged in database";

  // Pre-filled WhatsApp message
  const waMessage = `Hey! It's Amahle 🥰 I just saw your date invitation! I'm free on ${selectedDaysStr} for our date night! Looking forward to it 💕`;

  const cleanPhone = (organizerPhone || "").replace(/[^0-9]/g, "");
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(waMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 max-w-xl mx-auto text-center">
      {/* Celebration badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs tracking-wider uppercase mb-5 backdrop-blur-md">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Date Night Confirmed!</span>
      </div>

      <div className="w-full romantic-card rounded-3xl p-7 sm:p-9 border border-rose-500/30 shadow-2xl relative overflow-hidden text-left">
        {/* Confetti / heart shower background bursts */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-44 h-44 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 mx-auto flex items-center justify-center shadow-lg shadow-rose-900/60 mb-3 animate-pulse-soft">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <span className="text-rose-400 font-script text-3xl sm:text-4xl block mb-1">
            Siyabonga Kakhulu,
          </span>
          <h2 className="font-serif-romantic text-2xl sm:text-3xl text-rose-100 font-semibold mb-1">
            It's a Date, Amahle!
          </h2>
          <p className="font-serif-romantic text-sm sm:text-base text-pink-200/90 italic">
            "Ngijabule kakhulu, see you soon!"
          </p>
        </div>

        {/* Personalized VIP Digital Date Pass */}
        <div className="relative border border-dashed border-rose-400/40 rounded-2xl bg-gradient-to-br from-[#24111f] to-[#160a14] p-5 mb-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-3">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider">
              <Ticket className="w-4 h-4 text-rose-400" />
              <span>VIP Date Night Pass</span>
            </div>
            <span className="text-[10px] text-rose-400/80 font-mono bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/20">
              #AMAHLE-{new Date().getFullYear()}
            </span>
          </div>

          <div className="space-y-2 text-xs text-rose-200/90">
            <div className="flex justify-between">
              <span className="text-rose-400/70">Guest of Honor:</span>
              <span className="font-bold text-rose-100">Amahle (Chatsworth ➔ Focus 1 Res)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-400/70">Memory:</span>
              <span className="text-rose-200 font-medium">Walked from Wits Main to Focus 1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-400/70">Free Day(s) This Week:</span>
              <span className="font-semibold text-pink-300">{selectedDaysStr}</span>
            </div>
            {responseEntry?.personalMessage && (
              <div className="flex justify-between">
                <span className="text-rose-400/70">Your Note:</span>
                <span className="font-medium text-rose-100 max-w-[200px] truncate">{responseEntry.personalMessage}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-rose-500/20 flex items-center justify-between text-[11px] text-rose-400/70">
            <span>Auto-Saved in Private DB:</span>
            <span className="font-mono text-emerald-400">{timeFormatted}</span>
          </div>
        </div>

        {/* WhatsApp Send Call-to-Action */}
        <div className="space-y-3">
          <p className="text-xs text-rose-200/80 text-center font-light">
            Your answer is saved in the database! You can also tap below to send it to him directly on WhatsApp:
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm shadow-xl shadow-emerald-950/60 hover:shadow-emerald-600/30 transition-all duration-200 cursor-pointer"
            id="whatsapp-send-btn"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Send Confirmation on WhatsApp 💬</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/25 text-rose-300 text-xs transition-colors cursor-pointer"
            id="copy-confirmation-btn"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Message Copied! ✨" : "Or Copy Message to Clipboard"}</span>
          </button>
        </div>

        {/* Sweet closing note */}
        <p className="text-center text-xs text-rose-400/70 mt-6 font-serif-romantic italic">
          "See you soon, Amahle. Get ready to be treated like the queen you are."
        </p>

        <div className="text-center mt-4">
          <button
            onClick={onRestart}
            className="text-[11px] text-rose-500/60 hover:text-rose-400 underline underline-offset-4"
          >
            View Invitation from the Beginning
          </button>
        </div>
      </div>
    </div>
  );
};
