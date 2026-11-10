"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowIcon, QuillIcon } from "./Icons";
import { useCarousel } from "./useCarousel";

type Wish = { id: string; name: string; message: string; createdAt: string };

const welcomeWish: Wish = {
  id: "welcome",
  name: "Stéphanie",
  message: "Vos mots doux apparaîtront ici. Merci de faire partie de notre histoire — soyez le premier à nous laisser un vœu !",
  createdAt: "",
};

export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [freshId, setFreshId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/wishes", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => active && setWishes(Array.isArray(json.wishes) ? json.wishes : []))
      .catch(() => undefined)
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const list = wishes.length ? wishes : [welcomeWish];
  const { index, next, prev, goTo, handlers } = useCarousel(list.length, { interval: 6500 });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setFeedback("");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), message: data.get("message"), website: data.get("website") }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Une erreur est survenue.");
      if (json.wish) {
        setWishes((current) => [json.wish, ...current]);
        setFreshId(json.wish.id);
        goTo(0);
      }
      form.reset();
      setStatus("success");
      setFeedback("Merci pour ce joli message ! Il illumine déjà notre mur des vœux.");
    } catch (e) {
      setStatus("error");
      setFeedback(e instanceof Error ? e.message : "Une erreur est survenue.");
    }
  }

  return (
    <div className="wishes-layout">
      <form className="wish-form lux-card" onSubmit={submit} data-reveal>
        <span className="card-corner tl" aria-hidden="true" />
        <span className="card-corner br" aria-hidden="true" />
        <h3>
          Laissez un <em>vœu</em>
        </h3>
        <div className="field">
          <label htmlFor="wish-name">Votre prénom</label>
          <input id="wish-name" name="name" required minLength={2} maxLength={60} placeholder="Comment vous appelle-t-on ?" />
        </div>
        <div className="field">
          <label htmlFor="wish-message">Votre message</label>
          <textarea id="wish-message" name="message" required minLength={3} maxLength={400} rows={4} placeholder="Un vœu, un souvenir, une bénédiction…" />
        </div>
        <input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {feedback && (
          <p className={`form-feedback ${status === "error" ? "is-error" : "is-success"}`} role={status === "error" ? "alert" : "status"}>
            {feedback}
          </p>
        )}
        <button className="btn btn-primary btn-block" type="submit" disabled={status === "sending"}>
          {status === "sending" ? <span className="btn-spinner" aria-hidden="true" /> : <QuillIcon size={18} />}
          {status === "sending" ? "Envoi…" : "Publier mon vœu"}
        </button>
      </form>

      <div className="wish-carousel" data-reveal role="region" aria-roledescription="carrousel" aria-label="Vœux des invités" tabIndex={0} {...handlers}>
        <div className="wish-viewport" aria-busy={!loaded}>
          <div className="wish-track" style={{ transform: `translate3d(${-index * 100}%,0,0)` }}>
            {list.map((wish, i) => {
              return (
                <article
                  key={wish.id}
                  className={`wish-card ${wish.id === freshId ? "is-fresh" : ""} ${i === index ? "is-active" : ""}`}
                  aria-hidden={i !== index}
                >
                  <span className="wish-quote" aria-hidden="true">“</span>
                  <p className="wish-text">{wish.message}</p>
                  <footer>
                    <span className="wish-line" aria-hidden="true" />
                    <strong>{wish.name}</strong>
                    {wish.createdAt && (
                      <time dateTime={wish.createdAt}>
                        {new Date(wish.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                      </time>
                    )}
                  </footer>
                  <QuillIcon size={30} className="wish-sticker" />
                </article>
              );
            })}
          </div>
        </div>
        {list.length > 1 && (
          <div className="carousel-nav">
            <button className="carousel-arrow" onClick={prev} aria-label="Vœu précédent">
              <ArrowIcon direction="left" size={18} />
            </button>
            <div className="carousel-dots">
              {list.slice(0, 12).map((wish, i) => (
                <button key={wish.id} aria-label={`Vœu ${i + 1}`} aria-current={i === index} className={i === index ? "is-active" : ""} onClick={() => goTo(i)} />
              ))}
            </div>
            <button className="carousel-arrow" onClick={next} aria-label="Vœu suivant">
              <ArrowIcon size={18} />
            </button>
          </div>
        )}
        <p className="wish-count">
          <QuillIcon size={14} /> {wishes.length} {wishes.length > 1 ? "vœux reçus" : "vœu reçu"}
        </p>
      </div>
    </div>
  );
}

