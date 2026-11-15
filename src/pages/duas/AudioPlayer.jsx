//Provides Arabic audio recitation playback (supporting both direct MP3 URLs and the browser's native ar-SA Arabic speech synthesis fallback so every single Dua can be listened to offline or online, with playback speed control 0.75x, 1x, 1.25x).

import React, { useState, useEffect, useRef } from 'react';

export default function AudioPlayer({
  arabicText = '',
  audioUrl = '',
  title = 'Dua Recitation',
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const progressTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [arabicText, audioUrl]);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}

    if (isPlaying) {
      stopPlayback();
      return;
    }

    // 1. If an MP3 URL is provided, play native Audio
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackRate;
      audioRef.current = audio;
      setIsPlaying(true);

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress(Math.round((audio.currentTime / audio.duration) * 100));
        }
      };
      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      audio.play().catch(() => setIsPlaying(false));
      return;
    }

    // 2. Fallback: Native Arabic Voice Recitation via Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && arabicText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = playbackRate * 0.85; // Calm, measured recitation cadence

      setIsPlaying(true);
      setProgress(15);

      progressTimerRef.current = setInterval(() => {
        setProgress((prev) => (prev < 92 ? prev + 8 : prev));
      }, 450);

      utterance.onend = () => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        setProgress(100);
        setTimeout(() => {
          setIsPlaying(false);
          setProgress(0);
        }, 250);
      };

      utterance.onerror = () => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        setIsPlaying(false);
        setProgress(0);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const cycleSpeed = (e) => {
    e.stopPropagation();
    const nextSpeed = playbackRate === 1 ? 0.75 : playbackRate === 0.75 ? 1.25 : 1;
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  return (
    <div className="rounded-[14px] bg-[#EAE8D7] px-3 py-2 border border-[#D5D2BE] flex items-center justify-between gap-2.5">
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition shadow-sm ${
          isPlaying
            ? 'bg-[#DFB75A] text-[#07361D]'
            : 'bg-[#0D4A2E] text-[#F0D58C]'
        }`}
        aria-label={isPlaying ? 'Stop Recitation' : 'Play Arabic Recitation'}
      >
        {isPlaying ? '■' : '▶'}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-[11px] font-semibold text-primary mb-1">
          <span className="truncate">
            {isPlaying ? `Reciting: ${title}` : 'Listen to Arabic Recitation'}
          </span>
          <span className="text-[10px] text-secondary shrink-0 ml-1">
            {isPlaying ? 'Playing...' : 'Arabic Audio'}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#D5D2BE] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#0D4A2E] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={cycleSpeed}
        className="px-2 py-1 rounded-lg bg-[#F5F2E8] border border-[#D5D2BE] text-primary text-[10.5px] font-bold shrink-0"
      >
        {playbackRate}x
      </button>
    </div>
  );
}