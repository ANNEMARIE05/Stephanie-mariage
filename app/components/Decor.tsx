import type { ReactNode } from "react";
import { FlowerIcon, HeartIcon, QuillIcon, StarIcon } from "./Icons";

/** Pétales flottants + étincelles dorées (100 % CSS, transform/opacity uniquement). */
export function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={`p${i}`}
          className={`petal petal-${i % 3}`}
          style={{
            left: `${(i * 41 + 6) % 100}%`,
            animationDelay: `${-(i * 2.3).toFixed(1)}s`,
            animationDuration: `${16 + (i % 5) * 3}s`,
            ["--drift" as string]: `${(i % 2 ? 1 : -1) * (40 + (i % 4) * 25)}px`,
            ["--size" as string]: `${10 + (i % 4) * 3}px`,
          }}
        />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={`s${i}`}
          className="sparkle"
          style={{
            left: `${(i * 29 + 11) % 97}%`,
            top: `${(i * 53 + 7) % 95}%`,
            animationDelay: `${-(i * 0.7).toFixed(1)}s`,
            ["--size" as string]: `${6 + (i % 3) * 4}px`,
          }}
        />
      ))}
    </div>
  );
}

/** Bande festonnée : crête claire sur un aplat sauge. */
export function WaveSeparator({ flip = false }: { flip?: boolean; tint?: "sage" | "gold" }) {
  return <div className={`wave-sep ${flip ? "is-flipped" : ""}`} aria-hidden="true" />;
}

/** Même vague, posée en bord de section. */
export function CloudSeparator({ flip = false }: { flip?: boolean }) {
  return <div className={`cloud-sep ${flip ? "is-flipped" : ""}`} aria-hidden="true" />;
}

/** Ornement fin : ligne + flèches zigzag (pseudo-éléments) + fleur centrale. */
export function Ornament({ icon = "flower" }: { icon?: "flower" | "heart" | "star" | "quill" }) {
  const Icon = { flower: FlowerIcon, heart: HeartIcon, star: StarIcon, quill: QuillIcon }[icon];
  return (
    <div className="ornament" aria-hidden="true">
      <Icon size={22} />
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  accent,
  children,
  icon = "flower",
  align = "center",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  children?: ReactNode;
  icon?: "flower" | "heart" | "star" | "quill";
  align?: "center" | "left";
}) {
  return (
    <header className={`section-title align-${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>
        {title} {accent && <em>{accent}</em>}
      </h2>
      <Ornament icon={icon} />
      {children && <p className="section-lead">{children}</p>}
    </header>
  );
}
