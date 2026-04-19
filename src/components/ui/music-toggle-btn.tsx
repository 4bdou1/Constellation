"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import useSound from "use-sound";

import { attachAnalyser, resumeAnalyser, suspendAnalyser } from "@/lib/audio-beat";

const AUDIO_SRC = "/Ayra Starr - Rush.mp3";

const Skiper25 = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="text-foreground absolute top-[20%] grid content-start justify-items-center gap-6 py-20 text-center">
        <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
          Click to play the music
        </span>
      </div>
      <MusicToggleButton />
    </div>
  );
};

export { Skiper25 };

export const MusicToggleButton = () => {
  const bars = 5;

  const getRandomHeights = () =>
    Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);

  const [heights, setHeights] = useState(getRandomHeights());
  const [isPlaying, setIsPlaying] = useState(false);
  const analyserAttachedRef = useRef(false);

  const [play, { pause, sound }] = useSound(AUDIO_SRC, {
    loop: true,
    html5: false,
    volume: 0.3,
    onplay: () => {
      setIsPlaying(true);
      resumeAnalyser();
    },
    onend: () => setIsPlaying(false),
    onpause: () => {
      setIsPlaying(false);
      suspendAnalyser();
    },
    onstop: () => {
      setIsPlaying(false);
      suspendAnalyser();
    },
    soundEnabled: true,
  });

  // Hook an analyser into Howler's master gain once a sound exists.
  useEffect(() => {
    if (!sound || analyserAttachedRef.current) return;
    const HowlerGlobal = (window as any).Howler;
    if (!HowlerGlobal?.ctx || !HowlerGlobal?.masterGain) return;
    try {
      if (HowlerGlobal.ctx.state === "suspended") HowlerGlobal.ctx.resume();
      attachAnalyser(HowlerGlobal.ctx as AudioContext, HowlerGlobal.masterGain as AudioNode);
      analyserAttachedRef.current = true;
    } catch {
      // ignore — analyser is a nice-to-have
    }
  }, [sound]);

  // Autoplay: try immediately, then fall back to the first user interaction.
  useEffect(() => {
    if (!sound) return;
    let cancelled = false;

    const tryPlay = () => {
      if (cancelled || isPlaying) return;
      try {
        play();
      } catch {
        // ignore
      }
    };

    tryPlay();

    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
      "wheel",
    ];
    const onInteract = () => {
      tryPlay();
      events.forEach((e) => window.removeEventListener(e, onInteract));
    };
    events.forEach((e) => window.addEventListener(e, onInteract, { passive: true }));

    return () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, onInteract));
    };
  }, [sound, play, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const waveformIntervalId = setInterval(() => {
        setHeights(getRandomHeights());
      }, 100);

      return () => {
        clearInterval(waveformIntervalId);
      };
    }
    setHeights(Array(bars).fill(0.1));
  }, [isPlaying]);

  const handleClick = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
      return;
    }
    play();
    setIsPlaying(true);
  };

  return (
    <motion.div
      onClick={handleClick}
      key="audio"
      initial={{ padding: "14px 14px " }}
      whileHover={{ padding: "18px 22px " }}
      whileTap={{ padding: "18px 22px " }}
      transition={{ duration: 1, bounce: 0.6, type: "spring" }}
      className="bg-background cursor-pointer rounded-full p-2"
      aria-label={isPlaying ? "Pause music" : "Play music"}
      role="button"
    >
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ type: "spring", bounce: 0.35 }}
        className="flex h-[18px] w-full items-center gap-1 rounded-full"
      >
        {heights.map((height, index) => (
          <motion.div
            key={index}
            className="bg-foreground w-[1px] rounded-full"
            initial={{ height: 1 }}
            animate={{ height: Math.max(4, height * 14) }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
