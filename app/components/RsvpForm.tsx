"use client";

import { FormEvent, useState } from "react";
import { CheckIcon, EnvelopeIcon, HeartIcon, PhoneIcon, UserIcon } from "./Icons";

type Status = "idle" | "sending" | "success" | "error";

export default function RsvpForm() {
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [result, setResult] = useState<"yes" | "no">("yes");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const local: Record<string, string> = {};
    if (!attending) local.attending = "Merci de préciser si vous serez présent(e).";
    if (String(data.get("name") ?? "").trim().length < 2) local.name = "Merci d’indiquer votre nom complet.";
    if (!/^\+?[\d\s().-]{8,20}$/.test(String(data.get("phone") ?? "").trim())) local.phone = "Numéro de téléphone invalide.";
    setFields(local);
    if (Object.keys(local).length) {
      setStatus("error");
      setError("Certains champs sont à vérifier.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          attending,
          guests,
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFields(json.fields ?? {});
        throw new Error(json.error ?? "Une erreur est survenue.");
      }
      setResult(attending === "no" ? "no" : "yes");
      setStatus("success");
      form.reset();
      setAttending("");
      setGuests(1);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Une erreur est survenue, réessayez.");
    }
  }

  if (status === "success") {
    return (
      <div className="rsvp-success lux-card" role="status">
        <div className="success-seal" aria-hidden="true">
          <CheckIcon size={30} />
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} style={{ ["--a" as string]: `${i * 45}deg` }} />
          ))}
        </div>
        <p className="eyebrow">Réponse enregistrée</p>
        <h3>{result === "yes" ? <>Merci, <em>à très bientôt !</em></> : <>Merci, <em>vous nous manquerez.</em></>}</h3>
        <p>
          {result === "yes"
            ? "Votre présence est bien notée. Nous avons hâte de partager ce jour si précieux avec vous."
            : "Merci de nous avoir prévenus. Nous penserons à vous en ce jour si spécial."}
        </p>
        <button className="btn btn-ghost" onClick={() => setStatus("idle")}>
          Envoyer une autre réponse
        </button>
      </div>
    );
  }

  return (
    <form className="rsvp-form lux-card" onSubmit={submit} noValidate>
      <span className="card-corner tl" aria-hidden="true" />
      <span className="card-corner br" aria-hidden="true" />
      <div className="form-head">
        <EnvelopeIcon size={30} className="form-head-icon" />
        <p className="eyebrow">Carton réponse</p>
      </div>

      <div className="field-row">
        <div className={`field ${fields.name ? "has-error" : ""}`}>
          <label htmlFor="rsvp-name">Nom complet</label>
          <div className="input-wrap">
            <UserIcon size={17} />
            <input id="rsvp-name" name="name" autoComplete="name" placeholder="Prénom et nom" required maxLength={80} aria-invalid={!!fields.name} aria-describedby={fields.name ? "err-name" : undefined} />
          </div>
          {fields.name && <span className="field-error" id="err-name">{fields.name}</span>}
        </div>
        <div className={`field ${fields.phone ? "has-error" : ""}`}>
          <label htmlFor="rsvp-phone">Téléphone</label>
          <div className="input-wrap">
            <PhoneIcon size={17} />
            <input id="rsvp-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+225 07 00 00 00 00" required maxLength={20} aria-invalid={!!fields.phone} aria-describedby={fields.phone ? "err-phone" : undefined} />
          </div>
          {fields.phone && <span className="field-error" id="err-phone">{fields.phone}</span>}
        </div>
      </div>

      <fieldset className={`field ${fields.attending ? "has-error" : ""}`}>
        <legend>Serez-vous des nôtres ?</legend>
        <div className="choice-group">
          <label className={`choice ${attending === "yes" ? "is-selected" : ""}`}>
            <input type="radio" name="attending" value="yes" checked={attending === "yes"} onChange={() => setAttending("yes")} />
            <HeartIcon size={18} /> Oui, avec joie
          </label>
          <label className={`choice ${attending === "no" ? "is-selected" : ""}`}>
            <input type="radio" name="attending" value="no" checked={attending === "no"} onChange={() => setAttending("no")} />
            <span className="choice-dot" aria-hidden="true" /> Je ne pourrai pas venir
          </label>
        </div>
        {fields.attending && <span className="field-error">{fields.attending}</span>}
      </fieldset>

      <div className={`field guests-field ${attending === "no" ? "is-disabled" : ""}`}>
        <label id="guests-label">Nombre de personnes (vous inclus)</label>
        <div className="stepper" role="group" aria-labelledby="guests-label">
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={attending === "no" || guests <= 1} aria-label="Retirer une personne">−</button>
          <output aria-live="polite">{attending === "no" ? 0 : guests}</output>
          <button type="button" onClick={() => setGuests((g) => Math.min(10, g + 1))} disabled={attending === "no" || guests >= 10} aria-label="Ajouter une personne">+</button>
        </div>
      </div>

      <div className="field">
        <label htmlFor="rsvp-message">
          Un mot pour les mariés <span className="optional">(facultatif)</span>
        </label>
        <textarea id="rsvp-message" name="message" rows={3} maxLength={600} placeholder="Quelques mots doux…" />
      </div>

      {/* Champ piège anti-spam */}
      <input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {status === "error" && error && (
        <p className="form-feedback is-error" role="alert">
          {error}
        </p>
      )}

      <button className="btn btn-primary btn-block" type="submit" disabled={status === "sending"}>
        {status === "sending" ? <span className="btn-spinner" aria-hidden="true" /> : <EnvelopeIcon size={18} />}
        {status === "sending" ? "Envoi en cours…" : "Envoyer ma réponse"}
      </button>
    </form>
  );
}

