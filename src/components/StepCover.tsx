import React from "react";
import { Heart, Sparkles, Music, MapPin } from "lucide-react";

interface StepCoverProps {
  onStart: () => void;
}

export const StepCover: React.FC<StepCoverProps> = ({ onStart }) => {
  const handleStart = () => {
    // Only triggers onStart (which starts the single YouTube song in App.tsx)
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[78vh] text-center px-4 py-8 max-w-xl mx-auto">
      {/* Decorative floating badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs tracking-wider uppercase mb-6 backdrop-blur-md shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
        <span>For Amahle • Sthandwa Sami</span>
      </div>

      {/* Main romantic envelope / card */}
      <div className="relative w-full romantic-card rounded-3xl p-8 sm:p-10 border border-rose-500/25 shadow-2xl overflow-hidden">
        {/* Ambient radial glow inside card */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Wax seal heart icon */}
        <div className="relative mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-tr from-rose-900 via-rose-700 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-900/50 border-2 border-rose-300/40 animate-pulse-soft">
          <Heart className="w-9 h-9 text-rose-100 fill-rose-100/90 drop-shadow-md" />
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400/90 flex items-center justify-center text-[10px] text-amber-950 font-bold border border-amber-200">
            ✨
          </div>
        </div>

        {/* Personalized Callout */}
        <span className="text-rose-400 font-script text-3xl sm:text-4xl block mb-1">
          Sawubona,
        </span>
        <h2 className="font-script text-4xl sm:text-5xl text-rose-300 mb-1 drop-shadow-md">
          Amahle
        </h2>
        <h1 className="font-serif-romantic text-2xl sm:text-3xl text-rose-100 font-semibold tracking-wide mb-4">
          Walking You to Res Yesterday
        </h1>

        <p className="text-rose-200/85 text-sm sm:text-base leading-relaxed mb-6 font-light max-w-md mx-auto">
          Walking you yesterday from <span className="text-rose-200 font-medium">Wits Main to your res (Focus 1)</span> was easily the best part of my week. From Chatsworth to Jozi, your warmth and gentle smile made such an impression on me. I made this invitation because I’d really love to take you out this week.
        </p>

        {/* Personal tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs text-rose-300/80">
          <span className="flex items-center gap-1 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/20">
            <MapPin className="w-3 h-3 text-rose-400" />
            Chatsworth, Durban
          </span>
          <span className="flex items-center gap-1 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/20">
            <Sparkles className="w-3 h-3 text-rose-400" />
            Wits Main Campus
          </span>
          <span className="flex items-center gap-1 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/20">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
            Focus 1 Res
          </span>
        </div>

        {/* The Start Button */}
        <button
          onClick={handleStart}
          id="start-experience-btn"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white font-medium text-base shadow-xl shadow-rose-950/80 hover:shadow-rose-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-rose-400/30 cursor-pointer"
        >
          <Music className="w-4 h-4 text-rose-200 group-hover:animate-bounce" />
          <span>Open With Music</span>
          <span className="text-rose-200">🌹</span>
        </button>

        <p className="text-[11px] text-rose-400/70 mt-4 italic">
          (Playing your special song in the background)
        </p>
      </div>
    </div>
  );
};
