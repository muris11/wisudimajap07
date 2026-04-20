"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Track {
  videoId: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
}

interface MusicPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (videoId: string, title: string, author: string, thumbnail: string) => void;
}

export default function MusicPicker({ isOpen, onClose, onSelectTrack }: MusicPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wasOpenRef = useRef(false);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  }, [performSearch]);

  const handleSelectTrack = useCallback((track: Track) => {
    onSelectTrack(track.videoId, track.title, track.author, track.thumbnail);
  }, [onSelectTrack]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      queueMicrotask(() => {
        setSearchQuery("");
        setSearchResults([]);
        setIsSearching(false);
      });
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="music-picker-title"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden max-h-[85vh] flex flex-col"
        style={{ background: "linear-gradient(180deg, #001a0d 0%, #003d20 50%, #002916 100%)", zIndex: 101 }}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 id="music-picker-title" className="text-white text-lg font-bold">
              Pilih Lagu Yang Kamu Suka
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all active:scale-95"
              aria-label="Tutup"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari judul lagu atau artis..."
              className="w-full px-4 py-3 pl-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isSearching && (
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {searchResults.length > 0 ? (
            searchResults.map((track) => (
              <button
                key={track.videoId}
                onClick={() => handleSelectTrack(track)}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left active:scale-98 bg-white/5 hover:bg-white/10"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black/30">
                  <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{track.title}</p>
                  <p className="text-white/50 text-xs truncate">{track.author}</p>
                  {track.duration && (
                    <p className="text-white/30 text-xs">{track.duration}</p>
                  )}
                </div>
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            ))
          ) : searchQuery && !isSearching ? (
            <p className="text-white/40 text-center py-8">Tidak ditemukan</p>
          ) : !isSearching && searchQuery === "" ? (
            <p className="text-white/40 text-center py-8">Ketik untuk mencari lagu</p>
          ) : null}
        </div>

        <div className="px-6 py-4 bg-black/20 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
            <span>Power by</span>
            <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
            </svg>
            <span>YouTube</span>
          </div>
        </div>
      </div>
    </div>
  );
}