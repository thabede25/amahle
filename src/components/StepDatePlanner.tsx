import React, { useMemo } from "react";
import { Calendar, Clock, Sparkles, Heart, UtensilsCrossed, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { DayOption } from "../types";

interface StepDatePlannerProps {
  selectedDays: string[];
  onChangeDays: (days: string[]) => void;
  preferredTime: string;
  onChangeTime: (time: string) => void;
  preferredVibe: string;
  onChangeVibe: (vibe: string) => void;
  favoriteTreat: string;
  onChangeTreat: (treat: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepDatePlanner: React.FC<StepDatePlannerProps> = ({
  selectedDays,
  onChangeDays,
  preferredTime,
  onChangeTime,
  preferredVibe,
  onChangeVibe,
  favoriteTreat,
  onChangeTreat,
  onNext,
  onBack
}) => {
  // Generate the upcoming days of this week dynamically based on current date
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
      const isWeekend = d.getDay() === 0 || d.getDay() === 6 || d.getDay() === 5; // Fri, Sat, Sun

      let label = `${dayName}, ${dateNum} ${month}`;
      if (i === 0) label = `Today (${dayName})`;
      if (i === 1) label = `Tomorrow (${dayName})`;

      days.push({
        dayName,
        formattedDate: label,
        isWeekend,
        label
      });
    }
    return days;
  }, []);

  const timeSlots = [
    { id: "sunset", label: "Sunset Golden Hour (17:30)", desc: "Catching the Joburg golden hour glow" },
    { id: "dinner", label: "Candlelight Dinner (19:00)", desc: "Intimate vibes & delicious food" },
    { id: "afternoon", label: "Afternoon Coffee & Stroll (15:00)", desc: "Sweet dessert & relaxing chats" },
    { id: "night", label: "Late Evening & Drinks (20:30)", desc: "Skyline views and unwinding" }
  ];

  const vibes = [
    {
      id: "intimate-dinner",
      title: "Cozy Candlelight Dinner",
      desc: "Warm lighting, soft music, great food, and unhurried conversation just getting to know each other."
    },
    {
      id: "scenic-dessert",
      title: "Scenic Views & Sweet Treats",
      desc: "A beautiful vantage point overlooking the city lights with delicious desserts and drinks."
    },
    {
      id: "campus-escape",
      title: "Relaxing Coffee & Pastry Break",
      desc: "Taking a well-deserved breather from university classes and Focus 1 residence life."
    },
    {
      id: "surprise",
      title: "Surprise Me",
      desc: "You plan everything down to the smallest detail, I'll just show up and look gorgeous."
    }
  ];

  const treats = [
    "Warm Chocolate Lava Cake",
    "Artisanal Gelato / Ice Cream",
    "Belgian Waffles & Coffee",
    "Savory Tapas & Mocktails",
    "Cocktails & Good Food",
    "You choose for me 🍰"
  ];

  const handleToggleDay = (label: string) => {
    if (selectedDays.includes(label)) {
      onChangeDays(selectedDays.filter((d) => d !== label));
    } else {
      onChangeDays([...selectedDays, label]);
    }
  };

  const isFormValid = selectedDays.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-6 max-w-xl mx-auto text-center">
      {/* Chapter Indicator */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/50 border border-rose-500/20 text-rose-300 text-xs uppercase tracking-widest mb-4">
        <span>Chapter 04</span>
        <span className="w-1 h-1 rounded-full bg-rose-400" />
        <span>The Date Night Invitation</span>
      </div>

      <div className="w-full romantic-card rounded-3xl p-6 sm:p-9 border border-rose-500/25 shadow-2xl relative overflow-hidden text-left">
        <div className="text-center mb-6">
          <span className="text-rose-400 font-script text-3xl sm:text-4xl block mb-1">
            Dear Amahle...
          </span>
          <h2 className="font-serif-romantic text-2xl sm:text-3xl text-rose-100 font-semibold mb-2">
            When Are You Free This Week?
          </h2>
          <p className="text-rose-200/80 text-xs sm:text-sm font-light max-w-md mx-auto">
            I’d love nothing more than to take you out, listen to your stories about Durban, and treat you like a queen.
          </p>
        </div>

        {/* Section 1: Days of This Week */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>1. Which day(s) this week work best for you?</span>
            </label>
            <span className="text-[11px] text-rose-400/80 italic">Select one or more</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {weekDays.map((day) => {
              const isSelected = selectedDays.includes(day.label);
              return (
                <button
                  key={day.label}
                  type="button"
                  onClick={() => handleToggleDay(day.label)}
                  className={`relative p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-rose-600/30 border-rose-400 text-rose-100 shadow-md shadow-rose-950/40"
                      : "bg-[#1b0d18]/60 hover:bg-[#261222] border-rose-500/20 text-rose-300/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{day.dayName}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-rose-400/80 block mt-0.5">{day.label}</span>
                </button>
              );
            })}
          </div>
          {selectedDays.length === 0 && (
            <p className="text-[11px] text-rose-400/70 mt-1.5 italic">
              * Please choose at least one day you're free so I can organize everything around you.
            </p>
          )}
        </div>

        {/* Section 2: Preferred Time */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 mb-2.5">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>2. What time of day fits your schedule?</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const isSelected = preferredTime === slot.label;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onChangeTime(slot.label)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-rose-600/30 border-rose-400 text-rose-100 shadow-md"
                      : "bg-[#1b0d18]/60 hover:bg-[#261222] border-rose-500/20 text-rose-300/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-rose-200">{slot.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                  <span className="text-[10px] text-rose-400/70 block mt-0.5">{slot.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Date Atmosphere / Vibe */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 mb-2.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>3. What kind of date vibe sounds most fun?</span>
          </label>
          <div className="space-y-2">
            {vibes.map((v) => {
              const isSelected = preferredVibe === v.title;
              return (
                <div
                  key={v.id}
                  onClick={() => onChangeVibe(v.title)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-rose-900/40 via-pink-900/30 to-rose-900/40 border-rose-400 text-rose-100 shadow-md"
                      : "bg-[#1b0d18]/60 hover:bg-[#261222] border-rose-500/20 text-rose-300/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium text-rose-200">{v.title}</span>
                    {isSelected && <span className="text-rose-400 text-xs font-medium">Selected ❤️</span>}
                  </div>
                  <p className="text-xs text-rose-300/70 font-light leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Favorite Treat */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 mb-2.5">
            <UtensilsCrossed className="w-3.5 h-3.5 text-rose-400" />
            <span>4. Any sweet treat you're craving?</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {treats.map((item) => {
              const isSelected = favoriteTreat === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onChangeTreat(item)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-rose-500 text-white font-medium shadow-md shadow-rose-950/40"
                      : "bg-[#1d0e1b] hover:bg-[#2a1427] border border-rose-500/20 text-rose-300"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-rose-500/20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-xs text-rose-300/70 hover:text-rose-200 transition-colors"
            id="back-to-chapter-three-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            disabled={!isFormValid}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-medium shadow-lg transition-all duration-200 cursor-pointer ${
              isFormValid
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 hover:shadow-rose-600/30"
                : "bg-rose-950/40 text-rose-400/40 border border-rose-500/10 cursor-not-allowed"
            }`}
            id="to-confirm-page-btn"
          >
            <span>Review & Personal Note</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
