import React, { useState } from "react";
import { Sparkles, Heart, ArrowRight, ArrowLeft, Smile, Flame, Star, Coffee } from "lucide-react";

interface StepComplimentsProps {
  onNext: () => void;
  onBack: () => void;
}

interface CardItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  preview: string;
  revealedText: string;
  sub: string;
}

export const StepCompliments: React.FC<StepComplimentsProps> = ({ onNext, onBack }) => {
  const [openedCards, setOpenedCards] = useState<number[]>([]);

  const cards: CardItem[] = [
    {
      id: 1,
      title: "That Unforgettable Smile",
      icon: <Smile className="w-4 h-4 text-rose-400" />,
      preview: "The moment our eyes met...",
      revealedText: "It wasn't just a casual smile; it had this genuine warmth that instantly made my heart skip a beat and made campus feel completely quiet.",
      sub: "Pure magic"
    },
    {
      id: 2,
      title: "Your Quiet Poise",
      icon: <Star className="w-4 h-4 text-rose-400" />,
      preview: "Effortlessly elegant...",
      revealedText: "You don't have to try hard to be noticed. Your natural grace and calm energy turn heads without a single word.",
      sub: "Effortless beauty"
    },
    {
      id: 3,
      title: "Inhliziyo Yakho Enhle",
      icon: <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />,
      preview: "Your genuine warmth...",
      revealedText: "You have that rare kindness, gentle spirit, and emotional intelligence that makes people feel valued and peaceful around you.",
      sub: "Rare & precious"
    },
    {
      id: 4,
      title: "That Moment Yesterday",
      icon: <Sparkles className="w-4 h-4 text-rose-400" />,
      preview: "Walking over to say hi...",
      revealedText: "Getting your number yesterday made my entire week. I knew right away that talking to you wasn't just another casual interaction.",
      sub: "Best decision"
    }
  ];

  const handleCardClick = (id: number) => {
    if (!openedCards.includes(id)) {
      setOpenedCards([...openedCards, id]);
    } else {
      // Toggle
      setOpenedCards(openedCards.filter((c) => c !== id));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-6 max-w-xl mx-auto text-center">
      {/* Chapter Indicator */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/50 border border-rose-500/20 text-rose-300 text-xs uppercase tracking-widest mb-4">
        <span>Chapter 03</span>
        <span className="w-1 h-1 rounded-full bg-rose-400" />
        <span>What Caught My Attention</span>
      </div>

      <div className="w-full romantic-card rounded-3xl p-6 sm:p-9 border border-rose-500/25 shadow-2xl relative overflow-hidden">
        <span className="text-rose-400 font-script text-3xl sm:text-4xl block mb-1">
          Sweet Revelations
        </span>
        <h2 className="font-serif-romantic text-2xl sm:text-3xl text-rose-100 font-semibold mb-2">
          Four Reasons You Stood Out
        </h2>
        <p className="text-rose-300/80 text-xs sm:text-sm font-light mb-6">
          Tap each card to reveal what was running through my mind yesterday:
        </p>

        {/* 4 Interactive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
          {cards.map((c) => {
            const isOpened = openedCards.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => handleCardClick(c.id)}
                className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border text-left ${
                  isOpened
                    ? "bg-gradient-to-b from-[#2d1424] to-[#1a0c16] border-rose-400/50 shadow-lg shadow-rose-950/40"
                    : "bg-[#1b0e18]/70 hover:bg-[#251221] border-rose-500/20 hover:border-rose-400/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                    {c.icon}
                    <span>{c.title}</span>
                  </div>
                  <span className="text-[10px] text-rose-400/80 uppercase tracking-wider font-mono">
                    {isOpened ? "Revealed" : "Tap"}
                  </span>
                </div>

                {isOpened ? (
                  <p className="text-xs text-rose-100/90 leading-relaxed font-serif-romantic italic animate-fadeIn">
                    "{c.revealedText}"
                  </p>
                ) : (
                  <p className="text-xs text-rose-300/60 italic">
                    {c.preview}
                  </p>
                )}

                <div className="mt-2.5 pt-2 border-t border-rose-500/10 flex items-center justify-between text-[10px] text-rose-400/70">
                  <span>{c.sub}</span>
                  <span>{isOpened ? "✨" : "Tap to open"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status prompt */}
        <div className="text-xs text-rose-300/70 mb-6 flex items-center justify-center gap-2">
          <span>{openedCards.length} of 4 revealed</span>
          {openedCards.length === 4 && <span className="text-pink-300 font-medium">✨ You unlocked all of them!</span>}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-xs text-rose-300/70 hover:text-rose-200 transition-colors"
            id="back-to-chapter-two-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-medium shadow-lg shadow-rose-900/50 hover:shadow-rose-600/30 transition-all duration-200 cursor-pointer"
            id="to-the-big-question-btn"
          >
            <span>The Big Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
