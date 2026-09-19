// Romantic Audio Engine with Web Audio Synth Piano + HTML5 Audio streaming + local file upload

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isSynthPlaying = false;
  private synthInterval: number | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isMuted = false;
  private volume = 0.6;
  private currentMode: "synth" | "stream" | "custom" = "synth";
  private listeners: Set<(isPlaying: boolean) => void> = new Set();
  public trackTitle = "Romantic Piano Melody";

  constructor() {
    // Lazy init audio element
    if (typeof window !== "undefined") {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.volume = this.volume;
      this.audioElement.addEventListener("play", () => this.notify(true));
      this.audioElement.addEventListener("pause", () => this.notify(false));
      this.audioElement.addEventListener("error", (e) => {
        console.warn("External audio source failed, falling back to romantic piano synth:", e);
        this.fallbackToSynth();
      });
    }
  }

  private notify(isPlaying: boolean) {
    this.listeners.forEach((fn) => fn(isPlaying));
  }

  public subscribe(listener: (isPlaying: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private initAudioContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Play a single warm piano chord note
  private playPianoTone(freq: number, startTime: number, duration: number, gainValue = 0.15) {
    if (!this.ctx) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      // Soft triangle + sine combination for electric piano/music box warmth
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, startTime);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 1.002, startTime); // subtle detune chorus

      const actualGain = (this.isMuted ? 0 : this.volume) * gainValue;

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(actualGain, startTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(actualGain * 0.4, startTime + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + 0.1);
      osc2.stop(startTime + duration + 0.1);
    } catch (e) {
      console.warn("Tone error", e);
    }
  }

  // Dreamy chord progression: Dbmaj9, Bbm9, Gbmaj7, Abadd9
  private playRomanticProgression() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bpm = 68;
    const beat = 60 / bpm;

    const chords = [
      // Dbmaj9 (Db3, F3, Ab3, C4, Eb4)
      [138.59, 174.61, 207.65, 261.63, 311.13],
      // Bbm9 (Bb2, F3, Ab3, Db4, C4)
      [116.54, 174.61, 207.65, 277.18, 261.63],
      // Gbmaj9 (Gb2, Db3, F3, Bb3, Db4)
      [92.50, 138.59, 174.61, 233.08, 277.18],
      // Abadd9 (Ab2, Eb3, C4, Eb4, G4)
      [103.83, 155.56, 261.63, 311.13, 392.00]
    ];

    let chordIdx = 0;
    const step = () => {
      if (!this.isSynthPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const chord = chords[chordIdx % chords.length];

      // Play arpeggiated piano pattern
      chord.forEach((note, i) => {
        this.playPianoTone(note, t + i * 0.12, 3.2, 0.12);
      });

      // Extra gentle bell on top
      const bellNote = chord[chord.length - 1] * 2;
      this.playPianoTone(bellNote, t + 1.2, 2.0, 0.04);

      chordIdx++;
    };

    step();
    this.synthInterval = window.setInterval(step, beat * 4 * 1000);
  }

  public async startAudio(preferredUrl?: string, title?: string) {
    // Disabled: Single YouTube song player is the sole audio source
    this.stopSynth();
    return;
  }

  private fallbackToSynth() {
    this.stopSynth();
  }

  public stopSynth() {
    this.isSynthPlaying = false;
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public togglePlayPause(): boolean {
    if (this.currentMode === "stream" || this.currentMode === "custom") {
      if (this.audioElement) {
        if (this.audioElement.paused) {
          this.audioElement.play();
          this.notify(true);
          return true;
        } else {
          this.audioElement.pause();
          this.notify(false);
          return false;
        }
      }
    }

    // Synth mode
    if (this.isSynthPlaying) {
      this.stopSynth();
      this.notify(false);
      return false;
    } else {
      this.initAudioContext();
      this.fallbackToSynth();
      return true;
    }
  }

  public isPlaying(): boolean {
    if (this.currentMode === "stream" || this.currentMode === "custom") {
      return !!this.audioElement && !this.audioElement.paused;
    }
    return this.isSynthPlaying;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public getVolume() {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public loadLocalFile(file: File) {
    try {
      const url = URL.createObjectURL(file);
      if (this.audioElement) {
        this.stopSynth();
        this.audioElement.src = url;
        this.audioElement.play();
        this.currentMode = "custom";
        this.trackTitle = file.name.replace(/\.[^/.]+$/, "");
        this.notify(true);
      }
    } catch (e) {
      console.error("Failed to load local file:", e);
    }
  }
}

export const audioEngine = new RomanticAudioEngine();
