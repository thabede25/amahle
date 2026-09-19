import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  Calendar,
  Clock,
  Heart,
  Trash2,
  Download,
  RefreshCw,
  X,
  Phone,
  Table,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Activity,
  UserCheck
} from "lucide-react";
import { DateResponse, OrganizerConfig } from "../types";
import {
  fetchAllResponses,
  deleteResponse,
  updateConfig,
  fetchConfig,
  fetchChoices
} from "../services/api";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated
}) => {
  const [pin, setPin] = useState("1234");
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default open for ease of use
  const [activeTab, setActiveTab] = useState<"summary" | "sheet" | "activity" | "settings">("summary");
  const [responses, setResponses] = useState<DateResponse[]>([]);
  const [choices, setChoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<OrganizerConfig>({
    organizerName: "Him",
    organizerPhone: "",
    audioTitle: "Special Song for Amahle"
  });
  const [phoneInput, setPhoneInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async (currentPin = pin) => {
    setIsLoading(true);
    try {
      const cfg = await fetchConfig();
      setConfig(cfg);
      setPhoneInput(cfg.organizerPhone || "");

      const [resData, choicesData] = await Promise.all([
        fetchAllResponses(currentPin),
        fetchChoices()
      ]);

      if (resData.success) {
        setIsAuthenticated(true);
        setResponses(resData.responses);
      }
      setChoices(choicesData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this response entry from the private database?")) {
      const ok = await deleteResponse(id, pin);
      if (ok) {
        setResponses((prev) => prev.filter((r) => r.id !== id));
      }
    }
  };

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateConfig({ organizerPhone: phoneInput.trim() });
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      if (onConfigUpdated) onConfigUpdated();
    }
  };

  const exportCSV = () => {
    if (responses.length === 0) return;
    const headers = [
      "Timestamp (SAST)",
      "Name",
      "Free Days This Week",
      "Preferred Time",
      "Preferred Vibe",
      "Personal Note",
      "Contact Phone",
      "Weekday Choice",
      "Weekend Choice"
    ];
    const rows = responses.map((r) => [
      `"${r.timestampFormattedSAST || r.timestamp}"`,
      `"${r.name || "Amahle"}"`,
      `"${(r.selectedDays || []).join(", ")}"`,
      `"${r.preferredTime || ""}"`,
      `"${r.preferredVibe || ""}"`,
      `"${(r.personalMessage || "").replace(/"/g, '""')}"`,
      `"${r.contactPhone || ""}"`,
      `"${r.answers?.weekdayPreference || ""}"`,
      `"${r.answers?.weekendPreference || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `amahle_date_responses_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // Aggregate day statistics for Google Forms summary view
  const dayCounts: Record<string, number> = {};
  responses.forEach((r) => {
    (r.selectedDays || []).forEach((day) => {
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
  });

  const vibeCounts: Record<string, number> = {};
  responses.forEach((r) => {
    if (r.preferredVibe) {
      vibeCounts[r.preferredVibe] = (vibeCounts[r.preferredVibe] || 0) + 1;
    }
  });

  const latestResponse = responses[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#140c14] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Google Forms Header Banner */}
        <div className="bg-gradient-to-r from-[#51234c] via-[#6d2861] to-[#401639] p-5 sm:p-6 border-b border-rose-500/25 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/30 border border-rose-300/40 flex items-center justify-center shadow-inner">
                <FileSpreadsheet className="w-4 h-4 text-pink-200" />
              </div>
              <div>
                <span className="text-[10px] tracking-widest uppercase font-mono text-pink-300/80 block">
                  Private Database &bull; Responses
                </span>
                <h3 className="font-serif-romantic text-lg sm:text-xl font-bold text-white leading-tight">
                  Date Night with Amahle &bull; Form Responses
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-rose-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Accepting Responses</span>
              </span>
              <span className="text-pink-200/80 font-mono text-[11px]">
                {responses.length} {responses.length === 1 ? "response" : "responses"} recorded
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadData(pin)}
                className="inline-flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Refresh from server"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
              {responses.length > 0 && (
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Download CSV file"
                >
                  <Download className="w-3 h-3" />
                  <span>Download CSV</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher (Google Forms Style) */}
        <div className="flex border-b border-rose-500/20 bg-[#1c0f1b] px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "summary"
                ? "border-pink-500 text-pink-300 font-semibold"
                : "border-transparent text-rose-400/60 hover:text-rose-200"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Summary Form</span>
          </button>

          <button
            onClick={() => setActiveTab("sheet")}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "sheet"
                ? "border-pink-500 text-pink-300 font-semibold"
                : "border-transparent text-rose-400/60 hover:text-rose-200"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Spreadsheet View ({responses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "activity"
                ? "border-pink-500 text-pink-300 font-semibold"
                : "border-transparent text-rose-400/60 hover:text-rose-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Taps ({choices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "settings"
                ? "border-pink-500 text-pink-300 font-semibold"
                : "border-transparent text-rose-400/60 hover:text-rose-200"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp Settings</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: SUMMARY (GOOGLE FORM CARDS) */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              {responses.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-rose-500/25 rounded-2xl bg-[#160c15]">
                  <Calendar className="w-10 h-10 text-rose-400/40 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-rose-200 mb-1">
                    Waiting for Amahle's Response
                  </h4>
                  <p className="text-xs text-rose-400/70 max-w-sm mx-auto">
                    Once Amahle taps "Confirm Our Date Night" on the final page, her free day(s) for this week and preferred times will populate here automatically.
                  </p>
                </div>
              ) : (
                <>
                  {/* Latest Submission Banner */}
                  {latestResponse && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 to-pink-950/40 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-rose-300/80">Latest response from:</span>
                          <span className="text-sm font-bold text-pink-300">
                            {latestResponse.name || "Amahle"}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                          ⏱ {latestResponse.timestampFormattedSAST || latestResponse.timestamp}
                        </div>
                      </div>

                      {config.organizerPhone && (
                        <a
                          href={`https://wa.me/${config.organizerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hey Amahle! I just saw your response for our date on ${(latestResponse.selectedDays || []).join(", ")}. Can't wait! 😊`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer w-fit"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Reply to Her on WhatsApp</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Question 1: Free Days for this week */}
                  <div className="bg-[#1b0d19] border border-rose-500/20 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3 border-b border-rose-500/15 pb-2">
                      <span className="text-xs font-semibold text-rose-200">
                        Question 1: Which day(s) this week are you free for our date night?
                      </span>
                      <span className="text-[10px] text-rose-400 font-mono">
                        {Object.keys(dayCounts).length} day(s) chosen
                      </span>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(dayCounts).map(([day, count]) => {
                        const pct = Math.round((count / responses.length) * 100);
                        return (
                          <div key={day} className="space-y-1">
                            <div className="flex justify-between text-xs text-rose-200">
                              <span className="font-medium text-pink-300">{day}</span>
                              <span className="font-mono text-rose-400">{count} vote ({pct}%)</span>
                            </div>
                            <div className="h-2 w-full bg-rose-950/60 rounded-full overflow-hidden border border-rose-500/15">
                              <div
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question 2: Preferred Time */}
                  <div className="bg-[#1b0d19] border border-rose-500/20 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3 border-b border-rose-500/15 pb-2">
                      <span className="text-xs font-semibold text-rose-200">
                        Question 2: Preferred Date Time
                      </span>
                      <span className="text-[10px] text-rose-400 font-mono">Responses</span>
                    </div>

                    <div className="space-y-2">
                      {responses.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between text-xs bg-black/30 p-2.5 rounded-xl border border-rose-500/15"
                        >
                          <span className="text-rose-100 font-medium">
                            {r.preferredTime || "Candlelight Dinner (19:00)"}
                          </span>
                          <span className="text-[10px] text-rose-400/80 font-mono">
                            {r.timestampFormattedSAST}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Question 3: Date Vibe */}
                  <div className="bg-[#1b0d19] border border-rose-500/20 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3 border-b border-rose-500/15 pb-2">
                      <span className="text-xs font-semibold text-rose-200">
                        Question 3: Chosen Date Atmosphere / How She Deserves to be Spoiled
                      </span>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(vibeCounts).map(([vibe, count]) => (
                        <div
                          key={vibe}
                          className="flex items-center justify-between text-xs bg-black/30 p-2.5 rounded-xl border border-rose-500/15"
                        >
                          <span className="text-rose-100">{vibe}</span>
                          <span className="text-pink-300 font-mono text-[11px]">{count} count</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Question 4: Notes / Messages */}
                  <div className="bg-[#1b0d19] border border-rose-500/20 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3 border-b border-rose-500/15 pb-2">
                      <span className="text-xs font-semibold text-rose-200">
                        Question 4: Amahle's Personal Notes & Song Requests
                      </span>
                    </div>

                    <div className="space-y-2">
                      {responses.map((r) => (
                        <div
                          key={r.id}
                          className="bg-black/30 p-3 rounded-xl border border-rose-500/15 text-xs text-rose-200"
                        >
                          <p className="italic text-pink-200">
                            "{r.personalMessage || "No additional note left"}"
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-rose-400/70 mt-2 pt-1 border-t border-rose-500/10 font-mono">
                            <span>From: {r.name || "Amahle"}</span>
                            <span>{r.timestampFormattedSAST}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: SPREADSHEET (GOOGLE SHEETS TABLE VIEW) */}
          {activeTab === "sheet" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-300 font-mono">
                  Rows: {responses.length} total
                </span>
                <span className="text-[11px] text-rose-400/70">
                  Recorded in private database storage with SAST timestamp
                </span>
              </div>

              {responses.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-rose-500/25 rounded-2xl bg-[#160c15] text-xs text-rose-400">
                  No spreadsheet rows yet.
                </div>
              ) : (
                <div className="border border-rose-500/25 rounded-2xl overflow-hidden bg-black/40">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#241121] border-b border-rose-500/20 text-rose-200 font-semibold text-[11px]">
                          <th className="py-2.5 px-3">Timestamp (SAST)</th>
                          <th className="py-2.5 px-3">Name</th>
                          <th className="py-2.5 px-3">Free Days This Week</th>
                          <th className="py-2.5 px-3">Preferred Time</th>
                          <th className="py-2.5 px-3">Date Vibe</th>
                          <th className="py-2.5 px-3">Personal Note</th>
                          <th className="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-500/15 text-rose-300/90">
                        {responses.map((r) => (
                          <tr key={r.id} className="hover:bg-rose-950/25 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-400 whitespace-nowrap">
                              {r.timestampFormattedSAST || r.timestamp}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-rose-100 whitespace-nowrap">
                              {r.name || "Amahle"}
                            </td>
                            <td className="py-2.5 px-3 text-pink-300 font-semibold whitespace-nowrap">
                              {(r.selectedDays || []).join(", ") || "None"}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {r.preferredTime}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {r.preferredVibe}
                            </td>
                            <td className="py-2.5 px-3 max-w-[200px] truncate" title={r.personalMessage}>
                              {r.personalMessage || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="text-rose-400/60 hover:text-red-400 p-1 cursor-pointer"
                                title="Delete entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE ACTIVITY (INTERMEDIATE CHAPTER TAPS) */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              <p className="text-xs text-rose-300/80">
                Whenever Amahle taps a student schedule card or date atmosphere on Chapters 1, 2, or 3, it saves immediately to the private database with an instant timestamp:
              </p>

              {choices.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-rose-500/25 rounded-2xl bg-[#160c15] text-xs text-rose-400">
                  No tap events recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {choices.map((c: any) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-black/40 border border-rose-500/15 flex items-start justify-between text-xs gap-3"
                    >
                      <div>
                        <span className="text-[10px] text-pink-400 uppercase font-mono block">
                          {c.stepName}
                        </span>
                        <span className="font-semibold text-rose-100">
                          {c.choiceTitle}
                        </span>
                        {c.choiceDetail && (
                          <p className="text-[11px] text-rose-300/70 mt-0.5 font-light">
                            {c.choiceDetail}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 whitespace-nowrap bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        {c.timestampFormattedSAST || c.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS (WHATSAPP ALERT) */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="bg-[#1b0d19] border border-rose-500/20 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-200 mb-2">
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  <span>Your WhatsApp Number (For Direct Date Confirmation Alerts)</span>
                </div>
                <p className="text-xs text-rose-300/80 mb-3 font-light leading-relaxed">
                  When Amahle reaches the celebration screen and taps "Send Confirmation on WhatsApp", the website opens WhatsApp pre-filled with her chosen days and sends it directly to this number:
                </p>

                <form onSubmit={handleSavePhone} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 27712345678 (Country code + number without +)"
                    className="flex-1 bg-black/40 border border-rose-500/30 rounded-xl px-3.5 py-2.5 text-xs text-rose-100 placeholder-rose-400/30 focus:outline-none focus:border-rose-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                  >
                    {saveSuccess ? "Saved! ✓" : "Save WhatsApp Number"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#180d17] border-t border-rose-500/20 flex items-center justify-between text-xs">
          <span className="text-[11px] text-rose-400/70 font-mono">
            Private Database &bull; Status: Connected &bull; SAST Timezone
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/20 text-rose-300 text-xs transition-colors cursor-pointer"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
