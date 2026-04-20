"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

interface FloatingAudioPlayerProps {
  videoId: string;
  title: string;
  author: string;
  thumbnail: string;
  onChangeTrack: () => void;
}

export default function FloatingAudioPlayer({ videoId, title, author, thumbnail, onChangeTrack }: FloatingAudioPlayerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const videoIdRef = useRef<string>("");

  const onPlayerReady = useCallback((event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    event.target.playVideo();
    setIsPlaying(true);
  }, []);

  const onPlayerEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoId !== videoIdRef.current && playerRef.current) {
      playerRef.current.loadVideoById(videoId);
      videoIdRef.current = videoId;
      setIsPlaying(true);
    }
  }, [videoId]);

  useEffect(() => {
    videoIdRef.current = videoId;
    return () => {
      if (playerRef.current) {
        playerRef.current.pauseVideo();
      }
    };
  }, [videoId]);

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
    },
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ${
        isMinimized ? "w-14 h-14 rounded-full" : "w-80 rounded-2xl overflow-hidden"
      }`}
      style={{
        background: "linear-gradient(180deg, #001a0d 0%, #003d20 50%, #002916 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onPlayerReady}
        onEnd={onPlayerEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />

      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full h-full flex items-center justify-center text-white/70 hover:text-white active:scale-95 transition-all"
          style={{ touchAction: 'manipulation' }}
          aria-label="Buka player"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </button>
      ) : (
        <>
          <div className="p-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-white/30"}`} />
              <span className="text-white/70 text-xs">Now Playing</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onChangeTrack}
                className="p-2 text-white/50 hover:text-white active:scale-95 transition-colors rounded-lg hover:bg-white/10"
                style={{ touchAction: 'manipulation' }}
                aria-label="Ganti lagu"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 text-white/50 hover:text-white active:scale-95 transition-colors rounded-lg hover:bg-white/10"
                style={{ touchAction: 'manipulation' }}
                aria-label="Minimize"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-3 flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black/30">
              <img src={thumbnail} alt="" className="w-full h-full object-cover" />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <svg className="w-5 h-5 text-white/80 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{title}</p>
              <p className="text-white/50 text-xs truncate">{author}</p>
            </div>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white active:scale-95 hover:bg-green-500 transition-colors flex-shrink-0"
              style={{ touchAction: 'manipulation' }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}