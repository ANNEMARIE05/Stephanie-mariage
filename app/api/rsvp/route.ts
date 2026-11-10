import { addItem, clean, clientKey, isRateLimited, listItems, newId, type Rsvp } from "@/app/lib/storage";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ piège anti-robots : invisible pour les humains.
  if (clean(body.website, 100)) return Response.json({ ok: true });

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 30);
  const attending = body.attending === true || body.attending === "yes";
  const guests = attending ? Math.min(10, Math.max(1, Number.parseInt(String(body.guests ?? 1), 10) || 1)) : 0;
  const message = clean(body.message, 600);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Merci d’indiquer votre nom complet.";
  if (!/^\+?[\d\s().-]{8,20}$/.test(phone)) errors.phone = "Merci d’indiquer un numéro de téléphone valide.";
  if (body.attending !== "yes" && body.attending !== "no" && typeof body.attending !== "boolean") {
    errors.attending = "Merci de préciser si vous serez présent(e).";
  }
  if (Object.keys(errors).length) {
    return Response.json({ error: "Certains champs sont à vérifier.", fields: errors }, { status: 422 });
  }

  if (isRateLimited(`rsvp:${clientKey(request)}`)) {
    return Response.json({ error: "Trop d’envois successifs, merci de réessayer dans quelques minutes." }, { status: 429 });
  }

  try {
    const rsvp: Rsvp = { id: newId(), createdAt: new Date().toISOString(), name, phone, attending, guests, message };
    await addItem("rsvps", rsvp);
    return Response.json({ ok: true, attending }, { status: 201 });
  } catch (error) {
    console.error("RSVP save failed", error);
    return Response.json({ error: "Impossible d’enregistrer votre réponse pour le moment. Réessayez un peu plus tard." }, { status: 500 });
  }
}

/**
 * Consultation des réponses par les mariés :
 *   /api/rsvp?key=VOTRE_CLE            → JSON
 *   /api/rsvp?key=VOTRE_CLE&format=csv → fichier CSV (Excel)
 * La clé est définie par la variable d'environnement ADMIN_KEY.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || url.searchParams.get("key") !== adminKey) {
    return Response.json({ error: "Accès réservé." }, { status: 403 });
  }

  const rsvps = await listItems<Rsvp>("rsvps", 5000);
  const summary = {
    responses: rsvps.length,
    attending: rsvps.filter((r) => r.attending).length,
    declined: rsvps.filter((r) => !r.attending).length,
    totalGuests: rsvps.reduce((sum, r) => sum + (r.attending ? r.guests : 0), 0),
  };

  if (url.searchParams.get("format") === "csv") {
    const escape = (v: string | number | boolean) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [
      ["Date", "Nom", "Téléphone", "Présent", "Nombre de personnes", "Message"],
      ...rsvps.map((r) => [r.createdAt, r.name, r.phone, r.attending ? "Oui" : "Non", r.guests, r.message]),
    ];
    const csv = "\uFEFF" + rows.map((row) => row.map(escape).join(";")).join("\r\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="reponses-mariage.csv"',
      },
    });
  }

  return Response.json({ summary, rsvps });
}
