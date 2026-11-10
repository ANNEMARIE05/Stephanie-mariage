"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/app/lib/wedding";
import { MusicIcon, PauseIcon, PlayIcon } from "./Icons";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
};

type YTStateEvent = { data: number; target: YTPlayer };

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: YTStateEvent) => void;
            onError?: () => void;
          };
        },
      ) => YTPlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;

let youtubeApi: Promise<void> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApi) return youtubeApi;
  youtubeApi = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
  return youtubeApi;
}

function ChevronIcon({ up }: { up?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={up ? "M6 14.5 12 8.5l6 6" : "M6 9.5 12 15.5l6-6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function MusicPlayer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const volumeRef = useRef(0.2);
  const pendingPlay = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [closed, setClosed] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(0.2);

  volumeRef.current = volume;

  useEffect(() => {
    const saved = Number(window.localStorage.getItem("wedding-volume"));
    /* eslint-disable react-hooks/set-state-in-effect -- préférence lue une seule fois côté client */
    if (saved >= 0 && saved <= 1) setVolume(saved);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const mount = document.createElement("div");
    host.appendChild(mount);
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(mount, {
        videoId: wedding.music.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          loop: 1,
          playlist: wedding.music.youtubeId,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(Math.round(volumeRef.current * 100));
            if (pendingPlay.current) event.target.playVideo();
          },
          onStateChange: (event) => {
            setPlaying(event.data === (window.YT?.PlayerState.PLAYING ?? PLAYING));
            setError(false);
          },
          onError: () => {
            setPlaying(false);
            setError(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      mount.remove();
    };
  }, []);

  useEffect(() => {
    playerRef.current?.setVolume(Math.round(volume * 100));
    window.localStorage.setItem("wedding-volume", String(volume));
  }, [volume]);

  function play() {
    setClosed(false);
    setError(false);
    pendingPlay.current = true;
    const player = playerRef.current;
    if (!player?.playVideo) return;
    player.setVolume(Math.round(volumeRef.current * 100));
    player.playVideo();
  }

  function pause() {
    pendingPlay.current = false;
    playerRef.current?.pauseVideo();
  }

  useEffect(() => {
    const onOpen = () => play();
    window.addEventListener("invitation-open", onOpen);
    return () => window.removeEventListener("invitation-open", onOpen);
  }, []);

  function toggle() {
    const player = playerRef.current;
    if (player?.getPlayerState && player.getPlayerState() === PLAYING) {
      pause();
      return;
    }
    play();
  }

  function nudge(delta: number) {
    setVolume((current) => Math.min(1, Math.max(0, Math.round((current + delta) * 20) / 20)));
  }

  function close() {
    pause();
    setExpanded(false);
    setClosed(true);
  }

  const percent = Math.round(volume * 100);

  return (
    <>
      <div
        className="yt-host"
        ref={hostRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: 320,
          height: 180,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      />

      {closed ? (
        <button type="button" className="mp-reopen" onClick={() => setClosed(false)}>
          <MusicIcon size={18} />
          Musique
        </button>
      ) : (
        <aside className={`music-player ${playing ? "is-playing" : ""} ${expanded ? "is-expanded" : ""}`} aria-label="Lecteur de musique">
          <div className="mp-main">
            <span className="mp-disc" aria-hidden="true">
              <span className="mp-disc-inner">
                <MusicIcon size={15} />
              </span>
            </span>

            {expanded ? (
              <div className="mp-info">
                <strong className="mp-title">{wedding.music.title}</strong>
                <span className="mp-artist">{wedding.music.artist}</span>
                {error && <span className="mp-status">Lecture indisponible</span>}
              </div>
            ) : (
              <span className="mp-wave" aria-hidden="true">
                {Array.from({ length: 4 }, (_, i) => (
                  <i key={i} />
                ))}
              </span>
            )}

            <button
              type="button"
              className="mp-play"
              onClick={toggle}
              aria-label={playing ? "Mettre en pause" : "Lancer la musique"}
              aria-pressed={playing}
            >
              {playing ? <PauseIcon size={16} /> : <PlayIcon size={15} />}
            </button>
            <button
              type="button"
              className="mp-ghost"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              aria-label={expanded ? "Réduire le lecteur" : "Déplier le lecteur"}
            >
              <ChevronIcon up={!expanded} />
            </button>
            <button type="button" className="mp-ghost" onClick={close} aria-label="Fermer le lecteur">
              <CloseIcon />
            </button>
          </div>

          {expanded && (
            <div className="mp-volume-row">
              <button type="button" className="mp-step" onClick={() => nudge(-0.05)} aria-label="Baisser le volume">
                −
              </button>
              <input
                className="mp-volume"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
                aria-valuetext={`${percent} pour cent`}
                style={{ ["--fill" as string]: `${percent}%` }}
              />
              <button type="button" className="mp-step" onClick={() => nudge(0.05)} aria-label="Augmenter le volume">
                +
              </button>
              <span className="mp-pct">{percent}%</span>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
