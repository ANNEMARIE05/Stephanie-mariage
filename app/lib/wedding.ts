/**
 * Configuration centrale du mariage.
 * Modifiez ce fichier pour personnaliser les noms, horaires, lieux, photos et musique.
 */

export const wedding = {
  brideName: "Stéphanie",
  /** Prénom du marié (fictif, modifiable à tout moment) */
  partnerName: "Alexandre",
  /** Fuseau d'Abidjan : GMT+0 toute l'année. */
  dateISO: "2026-12-12T12:15:00Z",
  endISO: "2026-12-12T18:00:00Z",
  dateLabel: "Samedi 12 décembre 2026",
  dateShort: "12 · 12 · 2026",
  city: "Abidjan, Côte d’Ivoire",
  rsvpNote: "Merci de nous confirmer votre présence dès que possible.",
  dressCode: {
    shades: "ivoire, sauge & beige",
    lead: "Vous pouvez choisir l’une des couleurs suivantes pour votre tenue : ivoire, sauge, beige ou un ton clair.",
    note: "Le blanc reste réservé aux mariés.",
    colors: [
      { name: "Ivoire", hex: "#f4efe6" },
      { name: "Sauge", hex: "#7d966e" },
      { name: "Beige", hex: "#e4d5c3" },
      { name: "Ton clair", hex: "#f7faf6" },
    ],
  },
  music: {
    /** Identifiant de la vidéo YouTube utilisée comme chant. */
    youtubeId: "QuninwvvrJ4",
    title: "L’Éternel est bon",
    artist: "Dena Mwana",
  },
};

export const coupleNames = wedding.partnerName
  ? `${wedding.partnerName} et ${wedding.brideName}`
  : wedding.brideName;

export const monogram = wedding.partnerName
  ? `${wedding.partnerName[0]} & ${wedding.brideName[0]}`
  : wedding.brideName[0];

export type WeddingEvent = {
  id: string;
  time: string;
  title: string;
  venue: string;
  area: string;
  description: string;
  icon: "rings" | "dove" | "champagne";
  mapQuery: string;
};

export const events: WeddingEvent[] = [
  {
    id: "civil",
    time: "12h15",
    title: "Mariage civil",
    venue: "Hôtel communal de Cocody",
    area: "Mairie de Cocody · Abidjan",
    description: "L’échange des consentements devant l’officier d’état civil.",
    icon: "rings",
    mapQuery: "Hôtel communal de Cocody, Abidjan",
  },
  {
    id: "discours",
    time: "13h30",
    title: "Discours de mariage",
    venue: "Salle du Royaume des Témoins de Jéhovah",
    area: "Cocody Danga · Abidjan",
    description: "Un moment de recueillement et de partage autour du discours de mariage.",
    icon: "dove",
    mapQuery: "Salle du Royaume des Témoins de Jéhovah, Cocody Danga, Abidjan",
  },
];

export const mapsUrl = (query: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

export const mapEmbedUrl = (query: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&hl=fr&output=embed`;

export const googleCalendarUrl = () => {
  const fmt = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Mariage de ${coupleNames}`,
    dates: `${fmt(wedding.dateISO)}/${fmt(wedding.endISO)}`,
    details: events.map((e) => `${e.time} — ${e.title} : ${e.venue}`).join("\n"),
    location: events[0].mapQuery,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const icsDataUrl = () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mariage Stephanie//Invitation//FR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:mariage-stephanie-20261212@invitation",
    "DTSTAMP:20261110T120000Z",
    "DTSTART:20261212T121500Z",
    "DTEND:20261212T180000Z",
    `SUMMARY:Mariage de ${coupleNames}`,
    "LOCATION:Hôtel communal de Cocody\\, Abidjan",
    "DESCRIPTION:12h15 — Mariage civil (Hôtel communal de Cocody)\\n13h30 — Discours de mariage (Salle du Royaume\\, Cocody Danga)",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Mariage demain !",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
};

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const photos = {
  hero: u("1519741497674-611481863552", 1200),
  intro: u("1537633552985-df8429e8048b", 1000),
  gallery: [
    { src: u("1465495976277-4387d4b0b4c6"), alt: "Un couple de mariés main dans la main", caption: "Main dans la main" },
    { src: u("1469371670807-013ccf25f16a"), alt: "Un bouquet de fleurs blanches", caption: "Les fleurs" },
    { src: u("1515934751635-c81c6bc9a2d8"), alt: "Des alliances posées délicatement", caption: "Les alliances" },
    { src: u("1522673607200-164d1b6ce486"), alt: "Un couple heureux en plein air", caption: "Nous deux" },
    { src: u("1511795409834-ef04bbd61622"), alt: "Une table de réception élégamment dressée", caption: "La fête" },
    { src: u("1523438885200-e635ba2c371e"), alt: "Des fleurs délicates pour la décoration", caption: "Les détails" },
  ],
};
