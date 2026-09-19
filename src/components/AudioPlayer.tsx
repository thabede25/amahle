import React, { useState, useEffect, useRef } from "react";
import { audioEngine } from "../services/audioEngine";
import { Volume2, VolumeX, Play, Pause, Music, Settings, Sparkles, Upload } from "lucide-react";

interface AudioPlayerProps {
  customTitle?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ customTitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [showSettings, setShowSettings] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [trackName, setTrackName] = useState(customTitle || audioEngine.trackTitle);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((playing) => {
      setIsPlaying(playing);
      setTrackName(audioEngine.trackTitle);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleTogglePlay = () => {
    audioEngine.togglePlayPause();
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
    if (isMuted && val > 0) {
      audioEngine.toggleMute();
      setIsMuted(false);
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      audioEngine.startAudio(customUrl.trim(), "Custom Song For Amahle");
      setTrackName("Custom Song For Amahle");
      setShowSettings(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audioEngine.loadLocalFile(file);
      setTrackName(file.name.replace(/\.[^/.]+$/, ""));
      setShowSettings(false);
    }
  };

  const handleSwitchToSynth = () => {
    audioEngine.startAudio();
    setShowSettings(false);
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="flex items-center gap-2 bg-[#1a0f17]/90 backdrop-blur-md border border-rose-500/25 rounded-full px-3.5 py-2 shadow-lg shadow-black/40">
        {/* Equalizer indicator */}
        <div className="flex items-end gap-0.5 h-3.5 w-3.5 px-0.5" title={isPlaying ? "Playing" : "Paused"}>
          <span
            className={`w-0.5 bg-rose-400 rounded-full transition-all duration-300 ${
              isPlaying ? "animate-pulse h-3" : "h-1"
            }`}
          />
          <span
            className={`w-0.5 bg-rose-300 rounded-full transition-all duration-200 ${
              isPlaying ? "animate-pulse h-3.5" : "h-1.5"
            }`}
            style={{ animationDelay: "150ms" }}
          />
          <span
            className={`w-0.5 bg-pink-400 rounded-full transition-all duration-300 ${
              isPlaying ? "animate-pulse h-2" : "h-1"
            }`}
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="p-1.5 rounded-full hover:bg-rose-500/20 text-rose-200 transition-colors"
          title={isPlaying ? "Pause music" : "Play music"}
          id="audio-play-pause-btn"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Track Title */}
        <div className="hidden sm:flex flex-col max-w-[140px] truncate text-left">
          <span className="text-[10px] uppercase tracking-wider text-rose-300/70 font-medium">Soundtrack</span>
          <span className="text-xs text-rose-100 font-serif-romantic italic truncate">{trackName}</span>
        </div>

        {/* Volume Mute */}
        <button
          onClick={handleToggleMute}
          className="p-1.5 rounded-full hover:bg-rose-500/20 text-rose-300 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
          id="audio-mute-toggle-btn"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400/60" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Mini volume slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="hidden md:block w-14 accent-rose-500 h-1 bg-rose-950/60 rounded-lg cursor-pointer"
          title={`Volume: ${Math.round(volume * 100)}%`}
        />

        {/* Song Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded-full hover:bg-rose-500/20 text-rose-300/80 hover:text-rose-100 transition-colors"
          title="Audio Options & Song Settings"
          id="audio-settings-btn"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Audio Options Modal */}
      {showSettings && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1e111b] border border-rose-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 text-rose-100">
          <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-semibold tracking-wide">Romantic Soundtrack</h4>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs text-rose-400 hover:text-rose-200"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-rose-300/80 mb-3 leading-relaxed">
            Playing romantic ambient melodies for Amahle. You can also play your own song file or audio link.
          </p>

          <div className="space-y-2.5">
            <button
              onClick={handleSwitchToSynth}
              className="w-full text-left px-3 py-2 text-xs rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/20 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Romantic Piano Chords (Built-in)</span>
              </div>
              <span className="text-[10px] text-rose-400 font-medium">Ambient</span>
            </button>

            {/* Custom File Upload */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-file-input"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-left px-3 py-2 text-xs rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/20 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-rose-400" />
                  <span>Choose MP3 / Audio from device</span>
                </div>
                <span className="text-[10px] text-rose-300/70">Upload</span>
              </button>
            </div>

            {/* Audio URL Input */}
            <div className="pt-1">
              <label className="text-[11px] text-rose-300/90 mb-1 block">Or paste direct audio URL:</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="https://.../song.mp3"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 bg-black/40 border border-rose-500/30 rounded-lg px-2 py-1 text-xs text-rose-100 placeholder-rose-500/40 focus:outline-none focus:border-rose-400"
                />
                <button
                  onClick={handleApplyUrl}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
