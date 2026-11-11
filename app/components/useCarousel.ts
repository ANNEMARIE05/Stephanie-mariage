"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/app/lib/motion";

/** Logique commune aux carrousels : navigation, défilement auto, swipe tactile, clavier. */
export function useCarousel(count: number, { interval = 5500, autoplay = true } = {}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  useEffect(() => {
    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(hover: none)"),
      window.matchMedia("(max-width: 900px)"),
    ];
    const sync = () => setReduced(prefersReducedMotion());
    sync();
    queries.forEach((mq) => mq.addEventListener("change", sync));
    return () => queries.forEach((mq) => mq.removeEventListener("change", sync));
  }, []);

  const goTo = useCallback((i: number) => setIndex(count ? ((i % count) + count) % count : 0), [count]);
  const next = useCallback(() => setIndex((i) => (count ? (i + 1) % count : 0)), [count]);
  const prev = useCallback(() => setIndex((i) => (count ? (i - 1 + count) % count : 0)), [count]);

  useEffect(() => {
    if (!autoplay || paused || reduced || count < 2) return;
    const id = window.setInterval(next, interval);
    return () => window.clearInterval(id);
  }, [autoplay, paused, reduced, count, interval, next, index]);

  const safeIndex = count ? Math.min(index, count - 1) : 0;

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      startX.current = e.clientX;
      deltaX.current = 0;
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (startX.current !== null) deltaX.current = e.clientX - startX.current;
    },
    onPointerUp: () => {
      if (Math.abs(deltaX.current) > 45) (deltaX.current < 0 ? next : prev)();
      startX.current = null;
      deltaX.current = 0;
    },
    onPointerCancel: () => {
      startX.current = null;
    },
    onMouseEnter: () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setPaused(true);
    },
    onMouseLeave: () => setPaused(false),
    onFocus: () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setPaused(true);
    },
    onBlur: () => setPaused(false),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    },
  };

  return { index: safeIndex, next, prev, goTo, handlers };
}
