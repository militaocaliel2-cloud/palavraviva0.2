import { LITURGY as FALLBACK_CONTENT } from "@/constants/content";

const API_BASE = "https://liturgia.up.railway.app/v2/";

export type LiturgyReading = {
  referencia?: string;
  titulo?: string;
  texto?: string;
  refrao?: string;
};

export type LiturgyDay = {
  data: string;
  liturgia: string;
  cor?: string;
  leituras: {
    primeiraLeitura: LiturgyReading[];
    salmo: LiturgyReading[];
    segundaLeitura: LiturgyReading[];
    evangelho: LiturgyReading[];
    extras: LiturgyReading[];
  };
  oracoes?: {
    coleta?: string;
    oferendas?: string;
    comunhao?: string;
    extras?: Array<{ titulo?: string; texto?: string }>;
  };
  antifonas?: { entrada?: string; comunhao?: string };
};

function toArray(value: unknown): LiturgyReading[] {
  if (Array.isArray(value)) return value as LiturgyReading[];
  if (value && typeof value === "object") return [value as LiturgyReading];
  if (typeof value === "string") return [{ texto: value }];
  return [];
}

function normalize(payload: Record<string, unknown>): LiturgyDay {
  const readings = (payload.leituras ?? payload) as Record<string, unknown>;
  const oracoes = (payload.oracoes ?? {}) as LiturgyDay["oracoes"];
  return {
    data: String(payload.data ?? ""),
    liturgia: String(payload.liturgia ?? "Liturgia diária"),
    cor: typeof payload.cor === "string" ? payload.cor : undefined,
    leituras: {
      primeiraLeitura: toArray(readings.primeiraLeitura ?? payload.primeiraLeitura),
      salmo: toArray(readings.salmo ?? payload.salmo),
      segundaLeitura: toArray(readings.segundaLeitura ?? payload.segundaLeitura),
      evangelho: toArray(readings.evangelho ?? payload.evangelho),
      extras: toArray(readings.extras),
    },
    oracoes,
    antifonas: payload.antifonas as LiturgyDay["antifonas"],
  };
}

function fallback(): LiturgyDay {
  return {
    data: FALLBACK_CONTENT.dateLabel.split(", ").pop()?.replace(/ de /g, "/") ?? "",
    liturgia: FALLBACK_CONTENT.season,
    cor: "Verde",
    leituras: {
      primeiraLeitura: [{ referencia: FALLBACK_CONTENT.readings[0].reference, titulo: FALLBACK_CONTENT.readings[0].label, texto: FALLBACK_CONTENT.readings[0].text }],
      salmo: [{ referencia: FALLBACK_CONTENT.readings[1].reference, titulo: FALLBACK_CONTENT.readings[1].label, texto: FALLBACK_CONTENT.readings[1].text }],
      segundaLeitura: [],
      evangelho: [{ referencia: FALLBACK_CONTENT.readings[2].reference, titulo: FALLBACK_CONTENT.readings[2].label, texto: FALLBACK_CONTENT.readings[2].text }],
      extras: [],
    },
  };
}

export function formatApiDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return { day, month, year: String(date.getFullYear()) };
}

export function formatReadableDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

export async function fetchLiturgy(date: Date): Promise<LiturgyDay> {
  const { day, month, year } = formatApiDate(date);
  const url = `${API_BASE}?dia=${day}&mes=${month}&ano=${year}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Liturgia indisponível (${response.status})`);
    const payload = (await response.json()) as Record<string, unknown>;
    if (payload.erro) throw new Error(String(payload.erro));
    return normalize(payload);
  } catch (error) {
    if (date.toDateString() === new Date().toDateString()) return fallback();
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
