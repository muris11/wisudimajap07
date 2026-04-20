"use client";

import { useState, useCallback } from "react";
import OrnamentTop from "@/components/ornaments/ornament-top";
import OrnamentBottom from "@/components/ornaments/ornament-bottom";
import FloralDivider from "@/components/ornaments/floral-divider";
import TitleSection from "@/components/title-section";
import MusicPicker from "@/components/music-picker";
import FloatingAudioPlayer from "@/components/floating-audio-player";

interface TrackInfo {
  videoId: string;
  title: string;
  author: string;
  thumbnail: string;
}

export default function Home() {
  const [showPicker, setShowPicker] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);

  const handleSelectTrack = useCallback((videoId: string, title: string, author: string, thumbnail: string) => {
    const track: TrackInfo = { videoId, title, author, thumbnail };
    setCurrentTrack(track);
    setShowPicker(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem("majap-track", JSON.stringify(track));
    }
  }, []);

  const handleOpenPicker = useCallback(() => {
    setShowPicker(true);
  }, []);

  const handleClosePicker = useCallback(() => {
    setShowPicker(false);
  }, []);

  return (
    <>
      <MusicPicker
        isOpen={showPicker}
        onClose={handleClosePicker}
        onSelectTrack={handleSelectTrack}
      />

      <main
        className="relative min-h-screen w-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #001a0d 0%, #003d20 30%, #002916 70%, #001a0d 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pulse-glow"
          style={{ background: "radial-gradient(circle, rgba(0, 133, 63, 0.1) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pulse-glow"
          style={{ background: "radial-gradient(circle, rgba(0, 133, 63, 0.08) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
          <OrnamentTop />
          <TitleSection />
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 0,
              paddingTop: "266.6667%",
              paddingBottom: 0,
              boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
              marginTop: "1.6em",
              marginBottom: "0.9em",
              overflow: "hidden",
              borderRadius: 8,
              willChange: "transform",
            }}
          >
            <iframe
              loading="lazy"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                border: "none",
                padding: 0,
                margin: 0,
              }}
              src="https://www.canva.com/design/DAHHWpbvwZE/bNU_C6mXgcuCJVf3Cgy4Hw/view?embed"
              allowFullScreen={true}
              allow="fullscreen"
            />
          </div>
          <FloralDivider />
          <OrnamentBottom />
        </div>

        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute right-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        {currentTrack ? (
          <FloatingAudioPlayer
            videoId={currentTrack.videoId}
            title={currentTrack.title}
            author={currentTrack.author}
            thumbnail={currentTrack.thumbnail}
            onChangeTrack={handleOpenPicker}
          />
        ) : (
          <button
            onClick={handleOpenPicker}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-green-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform z-50"
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
            aria-label="Pilih lagu"
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </button>
        )}
      </main>
    </>
  );
}