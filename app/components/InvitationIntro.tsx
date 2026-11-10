"use client";

import { useEffect, useRef, useState } from "react";
import { monogram, wedding } from "@/app/lib/wedding";
import { FloralBranch } from "./Icons";

type Phase = "loading" | "sealed" | "opening" | "exit" | "done";

const LOAD_MS = 2200;
const REVEAL_MS = 2500;
const EXIT_MS = 900;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Remonte tout de suite, même si le navigateur voulait un défilement doux ou une ancre. */
function jumpToTop(clearHash = false) {
  const root = document.documentElement;
  if (clearHash && window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  root.style.scrollBehavior = previous;
}

/** Écran d’arrivée : sceau, puis enveloppe dont la carte sort au clic. */
export default function InvitationIntro() {
  const [phase, setPhase] = useState<Phase>("loading");
  const pinTop = useRef(true);
  const hasPartner = Boolean(wedding.partnerName);
  const open = phase === "opening" || phase === "exit";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("intro-open");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    jumpToTop();
    const pin = () => {
      if (pinTop.current && window.scrollY !== 0) jumpToTop();
    };
    window.addEventListener("scroll", pin, { passive: true });
    const delay = prefersReducedMotion() ? 400 : LOAD_MS;
    const timer = window.setTimeout(() => setPhase("sealed"), delay);
    return () => {
      pinTop.current = false;
      window.removeEventListener("scroll", pin);
      root.classList.remove("intro-open");
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "opening") return;
    const timer = window.setTimeout(() => setPhase("exit"), prefersReducedMotion() ? 40 : REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const timer = window.setTimeout(() => setPhase("done"), prefersReducedMotion() ? 160 : EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    document.documentElement.classList.remove("intro-open");
    jumpToTop(true);
    const frame = window.requestAnimationFrame(() => jumpToTop());
    const release = window.setTimeout(() => {
      jumpToTop();
      pinTop.current = false;
    }, 150);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(release);
    };
  }, [phase]);

  if (phase === "done") return null;

  function openEnvelope() {
    if (phase !== "sealed") return;
    jumpToTop(true);
    window.dispatchEvent(new Event("invitation-open"));
    setPhase(prefersReducedMotion() ? "exit" : "opening");
  }

  function skip() {
    if (phase === "exit" || phase === "done") return;
    jumpToTop(true);
    setPhase("exit");
  }

  const status =
    phase === "loading"
      ? "Votre invitation se prépare"
      : phase === "sealed"
        ? "L’enveloppe est prête. Cliquez pour l’ouvrir."
        : "La carte sort de l’enveloppe";

  return (
    <div className={`invite-intro phase-${phase}`} role="dialog" aria-modal="true" aria-label="Ouverture de l’invitation">
      <FloralBranch className="intro-branch intro-branch-left" />
      <FloralBranch className="intro-branch intro-branch-right" />

      <button type="button" className="intro-skip" onClick={skip}>
        Passer
      </button>

      <p className="intro-live" aria-live="polite">
        {status}
      </p>

      <div className="intro-loader" aria-hidden={phase !== "loading"}>
        <div className="intro-seal">
          <svg className="intro-ring" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="54" />
            <circle className="intro-ring-draw" cx="60" cy="60" r="46" />
          </svg>
          <span className="intro-seal-mark">{monogram}</span>
        </div>
        <p className="intro-script">
          {hasPartner ? (
            <>
              {wedding.partnerName} <em className="join">&</em> {wedding.brideName}
            </>
          ) : (
            wedding.brideName
          )}
        </p>
        <p className="intro-loader-date">{wedding.dateLabel}</p>
        <span className="intro-progress" aria-hidden="true">
          <span />
        </span>
        <p className="intro-loader-caption">Votre invitation se prépare</p>
      </div>

      <div className="intro-stage">
        <p className="intro-kicker">Pour vous</p>
        <div className="env-levitate">
          <button
            type="button"
            className="env"
            onClick={openEnvelope}
            disabled={phase !== "sealed"}
            aria-label="Ouvrir l’enveloppe"
          >
            <span className="env-ground" aria-hidden="true" />
            <span className={`env-shell ${open ? "is-open" : ""}`}>
              <span className="env-lining" aria-hidden="true" />
              <span className="env-card-window">
                <span className="env-card">
                  <span className="env-card-inner">
                    <span className="env-card-kicker">Vous êtes invités</span>
                    <span className="env-card-names">
                      {hasPartner ? (
                        <>
                          <span>{wedding.partnerName}</span>
                          <i className="join">&</i>
                          <span>{wedding.brideName}</span>
                        </>
                      ) : (
                        <span>{wedding.brideName}</span>
                      )}
                    </span>
                    <span className="env-card-rule" aria-hidden="true" />
                    <span className="env-card-date">{wedding.dateLabel}</span>
                    <span className="env-card-place">{wedding.city}</span>
                  </span>
                </span>
              </span>
              <span className="env-pocket" aria-hidden="true" />
              <span className="env-flap" aria-hidden="true" />
              <span className="wax" aria-hidden="true">
                <span className="wax-mark">{monogram}</span>
              </span>
            </span>
          </button>
        </div>
        <p className="intro-hint">Cliquez sur l’enveloppe</p>
      </div>
    </div>
  );
}
