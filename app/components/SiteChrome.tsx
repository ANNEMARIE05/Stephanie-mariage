"use client";

import { useEffect, useState } from "react";
import { monogram } from "@/app/lib/wedding";
import { ArrowIcon, EnvelopeIcon } from "./Icons";

const links = [
  { href: "#invitation", label: "Invitation" },
  { href: "#programme", label: "Programme" },
  { href: "#dresscode", label: "Dress code" },
  { href: "#galerie", label: "Galerie" },
  { href: "#voeux", label: "Vœux" },
];

/** Barre de navigation + effets globaux (apparition au scroll, parallaxe). */
export default function SiteChrome() {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Apparition des éléments au scroll.
    const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    revealEls.forEach((el) => (reduce ? el.classList.add("is-visible") : io.observe(el)));

    // Parallaxe légère (rAF, transform uniquement).
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-speed]"));
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 40);
      setShowTop(y > 520);
      if (reduce || window.matchMedia("(max-width: 900px)").matches) return;
      const vh = window.innerHeight;
      for (const el of parallaxEls) {
        const rect = el.parentElement?.getBoundingClientRect();
        if (!rect || rect.bottom < -200 || rect.top > vh + 200) continue;
        const speed = Number(el.dataset.speed) || 0;
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <header
      className={`topbar ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}
      style={scrolled ? { background: "#fff", zIndex: 80 } : undefined}
    >
      <a className="monogram" href="#accueil" aria-label="Retour à l’accueil">
        <span>{monogram}</span>
      </a>
      <nav id="main-nav" className="main-nav" aria-label="Navigation principale">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a className="nav-cta" href="#rsvp" onClick={() => setOpen(false)}>
          <EnvelopeIcon size={16} /> Confirmer ma présence
        </a>
      </nav>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>
    </header>
    <button
      type="button"
      className={`to-top ${showTop ? "is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Revenir en haut de la page"
    >
      <ArrowIcon direction="up" size={18} />
    </button>
    </>
  );
}
