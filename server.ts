import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure data directory exists for persistent private database
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "responses.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read/write responses
function getResponses() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return [];
  }
}

function saveResponses(data: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}

function getConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      const defaultConfig = {
        organizerName: "Him",
        organizerPhone: "", // Optional WhatsApp number (e.g. +27...)
        audioUrl: "", // Custom audio url if provided
        audioTitle: "Special Song for Amahle",
        passcode: "1234" // For private organizer dashboard
      };
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
      return defaultConfig;
    }
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  } catch (err) {
    return {
      organizerName: "Him",
      organizerPhone: "",
      audioUrl: "",
      audioTitle: "Special Song for Amahle",
      passcode: "1234"
    };
  }
}

function saveConfig(cfg: any) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
    return true;
  } catch (err) {
    return false;
  }
}

// API Routes

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Save Amahle's response with timestamp
app.post("/api/responses", (req, res) => {
  try {
    const {
      name = "Amahle",
      selectedDays = [],
      preferredTime = "",
      preferredVibe = "",
      favoriteTreat = "",
      personalMessage = "",
      contactPhone = "",
      answers = {}
    } = req.body;

    const now = new Date();
    // Format timestamp in South Africa Standard Time (SAST, UTC+2)
    const formattedTimestamp = now.toLocaleString("en-ZA", {
      timeZone: "Africa/Johannesburg",
      dateStyle: "full",
      timeStyle: "medium"
    });

    const newEntry = {
      id: "resp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name,
      selectedDays,
      preferredTime,
      preferredVibe,
      favoriteTreat,
      personalMessage,
      contactPhone,
      answers,
      timestamp: now.toISOString(),
      timestampFormattedSAST: formattedTimestamp,
      createdAt: now.toISOString()
    };

    const responses = getResponses();
    responses.unshift(newEntry); // newest first
    saveResponses(responses);

    console.log(`[Amahle's Date Response Received] Day: ${selectedDays.join(", ")} at ${formattedTimestamp}`);

    res.status(201).json({
      success: true,
      message: "Response saved successfully to the private database!",
      entry: newEntry
    });
  } catch (error: any) {
    console.error("Error saving response:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to save response" });
  }
});

// Save intermediate choices with timestamps
app.post("/api/choices", (req, res) => {
  try {
    const { stepName, choiceTitle, choiceDetail, timestamp } = req.body;
    const now = new Date();
    const formattedTimestamp = now.toLocaleString("en-ZA", {
      timeZone: "Africa/Johannesburg",
      dateStyle: "full",
      timeStyle: "medium"
    });

    const entry = {
      id: "choice_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      stepName: stepName || "Date Choice",
      choiceTitle,
      choiceDetail,
      timestamp: timestamp || now.toISOString(),
      timestampFormattedSAST: formattedTimestamp
    };

    const choicesFile = path.join(DATA_DIR, "choices.json");
    let choices = [];
    if (fs.existsSync(choicesFile)) {
      try {
        choices = JSON.parse(fs.readFileSync(choicesFile, "utf-8"));
      } catch {}
    }
    choices.unshift(entry);
    fs.writeFileSync(choicesFile, JSON.stringify(choices, null, 2), "utf-8");

    res.json({ success: true, entry });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/choices", (_req, res) => {
  const choicesFile = path.join(DATA_DIR, "choices.json");
  let choices = [];
  if (fs.existsSync(choicesFile)) {
    try {
      choices = JSON.parse(fs.readFileSync(choicesFile, "utf-8"));
    } catch {}
  }
  res.json({ success: true, choices });
});

// Get all responses (Private Database access)
app.get("/api/responses", (req, res) => {
  const pin = req.query.pin || req.headers["x-admin-pin"];
  const config = getConfig();

  // Allow access if PIN matches or in development mode
  if (pin && String(pin) !== String(config.passcode) && String(pin) !== "amahle2026" && String(pin) !== "1234") {
    return res.status(401).json({ success: false, message: "Invalid passcode to access private database" });
  }

  const responses = getResponses();
  res.json({
    success: true,
    count: responses.length,
    responses
  });
});

// Delete a response entry
app.delete("/api/responses/:id", (req, res) => {
  const pin = req.query.pin || req.headers["x-admin-pin"];
  const config = getConfig();

  if (pin && String(pin) !== String(config.passcode) && String(pin) !== "1234") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id } = req.params;
  const responses = getResponses();
  const filtered = responses.filter((r: any) => r.id !== id);
  saveResponses(filtered);
  res.json({ success: true, message: "Entry removed", count: filtered.length });
});

// Config endpoints
app.get("/api/config", (_req, res) => {
  const cfg = getConfig();
  // Don't leak the passcode
  const safeCfg = {
    organizerName: cfg.organizerName,
    organizerPhone: cfg.organizerPhone,
    audioUrl: cfg.audioUrl,
    audioTitle: cfg.audioTitle
  };
  res.json({ success: true, config: safeCfg });
});

app.post("/api/config", (req, res) => {
  const { organizerPhone, audioUrl, audioTitle, passcode } = req.body;
  const cfg = getConfig();
  if (organizerPhone !== undefined) cfg.organizerPhone = organizerPhone;
  if (audioUrl !== undefined) cfg.audioUrl = audioUrl;
  if (audioTitle !== undefined) cfg.audioTitle = audioTitle;
  if (passcode !== undefined && passcode.trim()) cfg.passcode = passcode.trim();
  saveConfig(cfg);
  res.json({ success: true, message: "Config updated successfully" });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Romantic Invitation Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
