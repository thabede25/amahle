import { DateResponse, OrganizerConfig } from "../types";

export async function saveDateResponse(data: Partial<DateResponse>): Promise<{ success: boolean; entry?: DateResponse; message?: string }> {
  try {
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn("Backend API call failed, backing up to localStorage:", err);
    // Fallback to local storage if network glitch occurs
    const now = new Date();
    const backupEntry: DateResponse = {
      id: "local_" + Date.now(),
      name: data.name || "Amahle",
      selectedDays: data.selectedDays || [],
      preferredTime: data.preferredTime || "",
      preferredVibe: data.preferredVibe || "",
      favoriteTreat: data.favoriteTreat || "",
      personalMessage: data.personalMessage || "",
      contactPhone: data.contactPhone || "",
      answers: data.answers || {},
      timestamp: now.toISOString(),
      timestampFormattedSAST: now.toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" }),
      createdAt: now.toISOString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem("amahle_date_responses") || "[]");
      existing.unshift(backupEntry);
      localStorage.setItem("amahle_date_responses", JSON.stringify(existing));
    } catch {}
    return { success: true, entry: backupEntry, message: "Saved locally" };
  }
}

export async function fetchAllResponses(pin?: string): Promise<{ success: boolean; responses: DateResponse[]; count: number }> {
  try {
    const url = pin ? `/api/responses?pin=${encodeURIComponent(pin)}` : "/api/responses";
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Unauthorized or server error");
    }
    return await res.json();
  } catch (err) {
    // Check local fallback
    const local = JSON.parse(localStorage.getItem("amahle_date_responses") || "[]");
    return { success: true, responses: local, count: local.length };
  }
}

export async function fetchConfig(): Promise<OrganizerConfig> {
  try {
    const res = await fetch("/api/config");
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.config;
  } catch {
    return {
      organizerName: "Him",
      organizerPhone: "",
      audioTitle: "Special Song for Amahle"
    };
  }
}

export async function updateConfig(config: Partial<OrganizerConfig> & { passcode?: string }): Promise<boolean> {
  try {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveIntermediateChoice(choice: {
  stepName: string;
  choiceTitle: string;
  choiceDetail: string;
}): Promise<void> {
  try {
    await fetch("/api/choices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...choice,
        timestamp: new Date().toISOString()
      })
    });
  } catch (e) {
    console.warn("Could not record intermediate choice to server:", e);
  }
}

export async function fetchChoices(): Promise<any[]> {
  try {
    const res = await fetch("/api/choices");
    if (!res.ok) return [];
    const data = await res.json();
    return data.choices || [];
  } catch {
    return [];
  }
}

export async function deleteResponse(id: string, pin?: string): Promise<boolean> {
  try {
    const url = pin ? `/api/responses/${id}?pin=${encodeURIComponent(pin)}` : `/api/responses/${id}`;
    const res = await fetch(url, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}
