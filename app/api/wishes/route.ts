import { connection } from "next/server";
import { addItem, clean, clientKey, isRateLimited, listItems, newId, type Wish } from "@/app/lib/storage";

export async function GET() {
  await connection();
  try {
    const wishes = await listItems<Wish>("wishes", 60);
    return Response.json({ wishes }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Wishes read failed", error);
    return Response.json({ wishes: [], error: "Lecture impossible." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (clean(body.website, 100)) return Response.json({ ok: true });

  const name = clean(body.name, 60);
  const message = clean(body.message, 400);
  if (name.length < 2) return Response.json({ error: "Merci d’indiquer votre prénom." }, { status: 422 });
  if (message.length < 3) return Response.json({ error: "Votre message est un peu court." }, { status: 422 });

  if (isRateLimited(`wish:${clientKey(request)}`, 4)) {
    return Response.json({ error: "Merci ! Patientez quelques minutes avant un nouveau message." }, { status: 429 });
  }

  try {
    const wish: Wish = { id: newId(), createdAt: new Date().toISOString(), name, message };
    await addItem("wishes", wish);
    return Response.json({ ok: true, wish }, { status: 201 });
  } catch (error) {
    console.error("Wish save failed", error);
    return Response.json({ error: "Impossible d’enregistrer votre message pour le moment." }, { status: 500 });
  }
}
