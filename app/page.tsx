import Image from "next/image";
import Countdown from "./components/Countdown";
import { Ambient, CloudSeparator, Ornament, SectionTitle, WaveSeparator } from "./components/Decor";
import Gallery from "./components/Gallery";
import {
  ArrowIcon,
  CalendarIcon,
  ChampagneIcon,
  ClockIcon,
  DoveIcon,
  EnvelopeIcon,
  FloralBranch,
  FlowerIcon,
  HeartIcon,
  LeafIcon,
  PinIcon,
  RingsIcon,
  StarIcon,
} from "./components/Icons";
import InvitationIntro from "./components/InvitationIntro";
import MusicPlayer from "./components/MusicPlayer";
import RsvpForm from "./components/RsvpForm";
import SiteChrome from "./components/SiteChrome";
import Wishes from "./components/Wishes";
import { coupleNames, events, mapEmbedUrl, mapsUrl, monogram, photos, wedding } from "./lib/wedding";

// Décembre 2026 : le 1er tombe un mardi (grille commençant le lundi).
const calendarOffset = 1;
const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const weddingDay = 12;
const eventIcons = { rings: RingsIcon, dove: DoveIcon, champagne: ChampagneIcon };

export default function Home() {
  const hasPartner = Boolean(wedding.partnerName);

  return (
    <>
      <InvitationIntro />
      <a className="skip-link" href="#invitation">
        Aller au contenu
      </a>
      <Ambient />
      <SiteChrome />
      <MusicPlayer />

      <main>
        {/* ───────────── HERO ───────────── */}
        <section className="hero" id="accueil">
          <span className="glow glow-gold" data-speed="-0.08" aria-hidden="true" />
          <span className="glow glow-sage" data-speed="0.06" aria-hidden="true" />

          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <StarIcon size={12} /> Save the date <StarIcon size={12} />
            </p>
            <h1 className="hero-names">
              {hasPartner ? (
                <>
                  <span>{wedding.partnerName}</span>
                  <em className="amp">&</em>
                  <span>{wedding.brideName}</span>
                </>
              ) : (
                <span>{wedding.brideName}</span>
              )}
            </h1>
            <p className="hero-tagline">{hasPartner ? "se disent oui" : "se marie"}</p>
            <div className="hero-date">
              <span className="hero-date-line" aria-hidden="true" />
              <p>
                <strong>{wedding.dateLabel}</strong>
                <span>{wedding.city}</span>
              </p>
              <span className="hero-date-line" aria-hidden="true" />
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#rsvp">
                <EnvelopeIcon size={18} /> Confirmer ma présence
              </a>
              <a className="btn btn-ghost" href="#programme">
                Le programme <ArrowIcon direction="down" size={16} />
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="arch-frame" data-speed="-0.04">
              <div className="arch-photo">
                <Image src={photos.hero} alt="Des mariés dans un jardin lumineux" fill priority sizes="(max-width: 900px) 78vw, 36vw" />
              </div>
              <span className="arch-outline" aria-hidden="true" />
            </div>
            <FloralBranch className="hero-branch branch-top" />
            <FloralBranch className="hero-branch branch-bottom" />
            <span className="sticker st-rings" aria-hidden="true"><RingsIcon size={30} /></span>
            <span className="sticker st-dove" aria-hidden="true"><DoveIcon size={30} /></span>
            <span className="sticker st-heart" aria-hidden="true"><HeartIcon size={20} /></span>
            <span className="date-badge" aria-hidden="true">
              <small>Déc.</small>
              <b>12</b>
              <small>2026</small>
            </span>
          </div>

        </section>

        <WaveSeparator />

        {/* ───────────── INVITATION ───────────── */}
        <section className="invitation section" id="invitation">
          <div className="container invitation-grid">
            <div className="invitation-photo" data-reveal>
              <div className="soft-frame">
                <Image src={photos.intro} alt="Les mariés, complices" fill sizes="(max-width: 900px) 90vw, 40vw" />
              </div>
              <span className="photo-tag">
                <HeartIcon size={14} /> Avec amour
              </span>
              <span className="sticker st-leaf" aria-hidden="true"><LeafIcon size={28} /></span>
            </div>
            <div className="invitation-copy" data-reveal>
              <SectionTitle eyebrow="À nos familles & amis" title="Une invitation" accent="du cœur" align="left" icon="heart" />
              <p className="lead">
                C’est avec une immense joie que {hasPartner ? "nous vous invitons" : "Stéphanie vous invite"} à partager
                l’un des plus beaux jours de {hasPartner ? "notre" : "sa"} vie.
              </p>
              <p>
                Votre présence, vos sourires et vos prières rendront ce moment encore plus précieux. Rejoignez-nous le{" "}
                <strong>samedi 12 décembre 2026</strong> à Cocody pour célébrer l’amour, l’engagement et la promesse d’une
                vie à deux.
              </p>
              <blockquote className="verse">
                « L’amour est patient, l’amour est bon. »
                <cite>1 Corinthiens 13:4</cite>
              </blockquote>
              <p className="signature">{coupleNames}</p>
            </div>
          </div>
        </section>

        {/* ───────────── COMPTE À REBOURS & PROGRAMME ───────────── */}
        <section className="countdown-section section tinted" id="programme" aria-labelledby="countdown-title">
          <CloudSeparator />
          <div className="container">
            <header className="section-title" data-reveal>
              <p className="eyebrow">Le grand jour approche</p>
              <h2 id="countdown-title">
                Plus que <em>quelques instants</em>
              </h2>
              <Ornament icon="star" />
            </header>
            <Countdown />
            <p className="countdown-date" data-reveal>
              <CalendarIcon size={16} /> {wedding.dateLabel} · 12h15
            </p>

            <div className="programme-block" data-reveal>
              <SectionTitle eyebrow="Le déroulé" title="Le programme" accent="de la journée">
                Deux moments forts, un seul et même bonheur. Voici où et quand nous retrouver.
              </SectionTitle>
            </div>

            <div className="programme-grid">
              <div className="calendar-card lux-card" data-reveal aria-label="Calendrier de décembre 2026">
                <span className="card-corner tl" aria-hidden="true" />
                <span className="card-corner br" aria-hidden="true" />
                <div className="calendar-head">
                  <FlowerIcon size={22} />
                  <div>
                    <p className="eyebrow">Notre rendez-vous</p>
                    <h3>
                      Décembre <em>2026</em>
                    </h3>
                  </div>
                  <span className="mini-mono">{monogram}</span>
                </div>
                <div className="calendar-grid weekdays" aria-hidden="true">
                  {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </div>
                <div className="calendar-grid days">
                  {Array.from({ length: calendarOffset }, (_, i) => (
                    <span key={`e${i}`} />
                  ))}
                  {calendarDays.map((day) =>
                    day === weddingDay ? (
                      <span key={day} className="is-wedding" aria-label="Samedi 12 décembre : jour du mariage">
                        <b>{day}</b>
                        <HeartIcon size={11} />
                      </span>
                    ) : (
                      <span key={day}>{day}</span>
                    ),
                  )}
                </div>
                <p className="calendar-caption">
                  <HeartIcon size={13} /> Samedi 12 — le grand jour
                </p>
              </div>

              <ol className="timeline">
                {events.map((event, i) => {
                  const Icon = eventIcons[event.icon];
                  return (
                    <li className="timeline-item" key={event.id} data-reveal style={{ transitionDelay: `${i * 120}ms` }}>
                      <span className="timeline-node" aria-hidden="true">
                        <Icon size={22} />
                      </span>
                      <article className="event-card lux-card">
                        <span className="card-corner tl" aria-hidden="true" />
                        <span className="card-corner br" aria-hidden="true" />
                        <p className="event-time">
                          <ClockIcon size={16} /> {event.time}
                        </p>
                        <h3>{event.title}</h3>
                        <p className="event-venue">
                          <PinIcon size={16} />
                          <span>
                            <strong>{event.venue}</strong>
                            <small>{event.area}</small>
                          </span>
                        </p>
                        <p className="event-desc">{event.description}</p>
                        <div className="event-map">
                          <iframe
                            title={`Plan — ${event.venue}`}
                            src={mapEmbedUrl(event.mapQuery)}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                        <a className="text-link" href={mapsUrl(event.mapQuery)} target="_blank" rel="noreferrer">
                          Itinéraire <ArrowIcon direction="up-right" size={15} />
                        </a>
                      </article>
                    </li>
                  );
                })}
                <li className="timeline-item timeline-end" data-reveal>
                  <span className="timeline-node" aria-hidden="true">
                    <ChampagneIcon size={22} />
                  </span>
                  <p className="timeline-end-text">
                    Puis place aux félicitations, aux photos et à la joie partagée <HeartIcon size={14} />
                  </p>
                </li>
              </ol>
            </div>
          </div>
          <CloudSeparator flip />
        </section>

        {/* ───────────── DRESS CODE ───────────── */}
        <section className="dress section" id="dresscode">
          <div className="container dress-simple">
            <div data-reveal>
              <SectionTitle eyebrow="Dress code" title="Code couleur">
                {wedding.dressCode.shades}
              </SectionTitle>
            </div>
            <p className="dress-lead" data-reveal>
              {wedding.dressCode.lead}
            </p>
            <ul className="dress-swatches" data-reveal>
              {wedding.dressCode.colors.map((color) => (
                <li key={color.name}>
                  <span className="dress-swatch" style={{ background: color.hex }} role="img" aria-label={color.name} />
                </li>
              ))}
            </ul>
            <p className="dress-note">{wedding.dressCode.note}</p>
          </div>
        </section>

        {/* ───────────── GALERIE ───────────── */}
        <section className="gallery-section section tinted" id="galerie">
          <div className="container">
            <div data-reveal>
              <SectionTitle eyebrow="Quelques instants" title="Notre galerie" accent="d’amour" icon="heart">
                De petits fragments de bonheur en attendant le grand jour.
              </SectionTitle>
            </div>
            <div data-reveal>
              <Gallery />
            </div>
          </div>
        </section>

        <WaveSeparator flip tint="gold" />

        {/* ───────────── RSVP ───────────── */}
        <section className="rsvp section" id="rsvp">
          <span className="glow glow-gold rsvp-glow" aria-hidden="true" />
          <div className="container rsvp-grid">
            <div className="rsvp-copy" data-reveal>
              <SectionTitle eyebrow="Répondez s’il vous plaît" title="Serez-vous" accent="des nôtres ?" align="left" icon="heart" />
              <p className="lead">{wedding.rsvpNote}</p>
              <FloralBranch className="rsvp-branch" />
            </div>
            <div data-reveal>
              <RsvpForm />
            </div>
          </div>
        </section>

        <CloudSeparator />

        {/* ───────────── VŒUX ───────────── */}
        <section className="wishes section tinted" id="voeux">
          <div className="container">
            <div data-reveal>
              <SectionTitle eyebrow="Le mur des vœux" title="Vos mots" accent="doux" icon="quill">
                Un souhait, un souvenir, une bénédiction : laissez un message qui restera gravé dans nos cœurs.
              </SectionTitle>
            </div>
            <Wishes />
          </div>
        </section>
      </main>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="footer">
        <CloudSeparator flip />
        <div className="footer-inner">
          <span className="footer-mono">{monogram}</span>
          <p className="footer-names">{coupleNames}</p>
          <Ornament icon="heart" />
          <p className="footer-date">{wedding.dateShort} · Cocody, Abidjan</p>
          <p className="footer-note">Avec tout notre amour, merci d’être à nos côtés.</p>
        </div>
      </footer>

    </>
  );
}
