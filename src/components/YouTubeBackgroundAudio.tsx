import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, Music, Tv, Sparkles, ExternalLink } from "lucide-react";

interface YouTubeBackgroundAudioProps {
  videoId?: string;
  autoPlayTrigger?: boolean;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
  }
}

export const YouTubeBackgroundAudio: React.FC<YouTubeBackgroundAudioProps> = ({
  videoId = "T8pHl2o_g1k",
  autoPlayTrigger = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showVideo, setShowVideo] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame Player API script if not loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      try {
        playerRef.current = new window.YT.Player("yt-player-frame", {
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            rel: 0,
            modestbranding: 1
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              event.target.setVolume(80);
            },
            onStateChange: (event: any) => {
              // 1 = playing, 2 = paused, 0 = ended
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            }
          }
        });
      } catch (err) {
        console.warn("YouTube player init warning:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      // cleanup if needed
    };
  }, [videoId]);

  // Handle external play trigger (e.g. when Amahle taps "Start")
  useEffect(() => {
    if (autoPlayTrigger && playerRef.current) {
      try {
        if (typeof playerRef.current.playVideo === "function") {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch (e) {
        console.warn("Could not autoplay youtube:", e);
      }
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn("Error toggling YouTube audio:", e);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (e) {}
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setVolume(v);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(v);
      if (isMuted && v > 0) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  return (
    <>
      {/* Floating Audio Pill at top right */}
      <div className="fixed top-4 right-4 z-40">
        <div className="flex items-center gap-2 bg-[#1a0f17]/90 backdrop-blur-md border border-rose-500/25 rounded-full px-3.5 py-2 shadow-lg shadow-black/40">
          {/* Animated Equalizer */}
          <div className="flex items-end gap-0.5 h-3.5 w-3.5 px-0.5">
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
            onClick={togglePlay}
            className="p-1.5 rounded-full hover:bg-rose-500/20 text-rose-200 transition-colors cursor-pointer"
            title={isPlaying ? "Pause Song" : "Play Song"}
            id="yt-play-toggle-btn"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Song Name Label */}
          <div className="hidden sm:flex flex-col max-w-[130px] truncate text-left">
            <span className="text-[9px] uppercase tracking-wider text-rose-300/70 font-medium">Ingoma Yakho</span>
            <span className="text-xs text-rose-100 font-serif-romantic italic truncate">Special Song for Amahle</span>
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
            id="yt-mute-btn"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400/60" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Mini Volume Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            className="hidden md:block w-14 accent-rose-500 h-1 bg-rose-950/60 rounded-lg cursor-pointer"
            title={`Volume: ${volume}%`}
          />

          {/* Toggle Video Modal */}
          <button
            onClick={() => setShowVideo(!showVideo)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showVideo ? "bg-rose-500/30 text-rose-100" : "hover:bg-rose-500/20 text-rose-300/80"
            }`}
            title="Toggle Music Video"
            id="toggle-yt-video-btn"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video Popover / Picture-in-picture view */}
        {showVideo && (
          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#1e111b] border border-rose-500/30 rounded-2xl p-3 shadow-2xl backdrop-blur-xl z-50 text-rose-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-500/20 text-xs">
              <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-rose-400" />
                <span>Our Soundtrack</span>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-rose-400 hover:text-rose-200 flex items-center gap-1"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>Open in YouTube</span>
                </a>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-xs text-rose-400 hover:text-rose-200"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-[11px] text-rose-300/80 mb-2 italic">
              Playing in the background for you, Amahle 🌹
            </p>
          </div>
        )}
      </div>

      {/* Persistent Hidden/Mini YouTube iframe container */}
      <div
        className={`fixed transition-all duration-300 z-30 ${
          showVideo
            ? "bottom-4 right-4 w-72 h-44 sm:w-80 sm:h-48 rounded-2xl overflow-hidden border-2 border-rose-500/40 shadow-2xl bg-black"
            : "top-[-9999px] left-[-9999px] w-1 h-1 opacity-0 pointer-events-none"
        }`}
      >
        <div id="yt-player-frame" className="w-full h-full" />
      </div>
    </>
  );
};
