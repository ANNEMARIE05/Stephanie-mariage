// Module serveur uniquement : importé exclusivement par les Route Handlers de /app/api.
import { promises as fs } from "fs";
import path from "path";

/**
 * Stockage persistant des réponses (RSVP) et des vœux.
 *
 * - Si les variables UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (ou KV_REST_API_URL / KV_REST_API_TOKEN)
 *   sont définies, les données sont enregistrées dans Redis (idéal pour un hébergement serverless type Vercel).
 * - Sinon, elles sont enregistrées dans des fichiers JSON du dossier /data (hébergement classique / local).
 */

export type Rsvp = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  attending: boolean;
  guests: number;
  message: string;
};

export type Wish = {
  id: string;
  createdAt: string;
  name: string;
  message: string;
};

type Collection = "rsvps" | "wishes";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const useRedis = Boolean(redisUrl && redisToken);
const dataDir = process.env.WEDDING_DATA_DIR ?? path.join(process.cwd(), "data");

async function redis(command: (string | number)[]) {
  const res = await fetch(redisUrl!, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  const json = (await res.json()) as { result: unknown };
  return json.result;
}

// Sérialise les écritures fichier pour éviter les pertes lors d'envois simultanés.
let writeQueue: Promise<unknown> = Promise.resolve();

async function readFile<T>(collection: Collection): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(dataDir, `${collection}.json`), "utf8");
    return JSON.parse(raw) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function addItem<T extends { id: string }>(collection: Collection, item: T): Promise<T> {
  if (useRedis) {
    await redis(["LPUSH", `wedding:${collection}`, JSON.stringify(item)]);
    return item;
  }
  const task = writeQueue.then(async () => {
    await fs.mkdir(dataDir, { recursive: true });
    const items = await readFile<T>(collection);
    items.unshift(item);
    const file = path.join(dataDir, `${collection}.json`);
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(items, null, 2), "utf8");
    await fs.rename(tmp, file);
  });
  writeQueue = task.catch(() => undefined);
  await task;
  return item;
}

/** Retourne les éléments du plus récent au plus ancien. */
export async function listItems<T>(collection: Collection, limit = 500): Promise<T[]> {
  if (useRedis) {
    const result = (await redis(["LRANGE", `wedding:${collection}`, 0, limit - 1])) as string[] | null;
    return (result ?? []).map((entry) => JSON.parse(entry) as T);
  }
  const items = await readFile<T>(collection);
  return items.slice(0, limit);
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Limitation simple du nombre d'envois par adresse IP (mémoire du processus). */
const hits = new Map<string, number[]>();
export function isRateLimited(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}
