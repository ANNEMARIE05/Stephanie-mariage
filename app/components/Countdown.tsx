"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/app/lib/wedding";
import { ChampagneIcon, HeartIcon } from "./Icons";

const target = new Date(wedding.dateISO).getTime();

function Digit({ value }: { value: string }) {
  // La clé change avec la valeur → relance l'animation d'entrée du chiffre.
  return (
    <span className="digit" key={value}>
      {value}
    </span>
  );
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = now === null ? null : target - now;

  if (diff !== null && diff <= 0) {
    return (
      <div className="celebration" role="status">
        <span className="celebration-burst" aria-hidden="true" />
        <ChampagneIcon size={54} className="celebration-icon" />
        <p className="eyebrow">C’est aujourd’hui</p>
        <h3>
          Le grand jour <em>est arrivé !</em>
        </h3>
        <p>Merci d’être à nos côtés pour célébrer cet amour. Que la fête commence !</p>
        <HeartIcon size={22} className="celebration-heart" />
      </div>
    );
  }

  const total = diff === null ? null : Math.floor(diff / 1000);
  const units: [string, string][] = [
    ["Jours", total === null ? "--" : String(Math.floor(total / 86400)).padStart(2, "0")],
    ["Heures", total === null ? "--" : String(Math.floor((total % 86400) / 3600)).padStart(2, "0")],
    ["Minutes", total === null ? "--" : String(Math.floor((total % 3600) / 60)).padStart(2, "0")],
    ["Secondes", total === null ? "--" : String(total % 60).padStart(2, "0")],
  ];

  return (
    <div
      className="countdown"
      role="timer"
      aria-label={
        total === null
          ? "Compte à rebours"
          : `${units[0][1]} jours, ${units[1][1]} heures, ${units[2][1]} minutes avant le mariage`
      }
    >
      {units.map(([label, value], i) => (
        <div className="count-card lux-card" key={label} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
          <span className="count-value" aria-hidden="true">
            {value.split("").map((d, idx) => (
              <span className="digit-slot" key={idx}>
                <Digit value={d} />
              </span>
            ))}
          </span>
          <span className="count-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
