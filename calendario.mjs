import { getStore } from "@netlify/blobs";

const PESSOAS = ["L", "D", "J"];
const STATUS = ["p", "t", "a", "f"];
const DATA = /^\d{4}-\d{2}-\d{2}$/;
const COR = /^#[0-9a-fA-F]{6}$/;

function limpar(r) {
  if (!r || typeof r !== "object") return null;
  const o = {};
  for (const c of PESSOAS) if (STATUS.includes(r[c])) o[c] = r[c];
  if (typeof r.h === "string") o.h = r.h.slice(0, 60);
  if (typeof r.x === "string" && r.x) o.x = r.x.slice(0, 100);
  return Object.keys(o).length ? o : null;
}

export default async (req) => {
  const codigo = process.env.CODIGO_EQUIPE;
  if (codigo && req.headers.get("x-codigo") !== codigo) {
    return new Response("Código inválido", { status: 401 });
  }
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response("Método não permitido", { status: 405 });
  }

  const store = getStore({ name: "calendario", consistency: "strong" });
  const estado = (await store.get("estado", { type: "json" })) || { notas: {}, cores: {} };
  estado.notas ||= {};
  estado.cores ||= {};

  if (req.method === "POST") {
    let corpo;
    try { corpo = await req.json(); } catch { return new Response("JSON inválido", { status: 400 }); }

    for (const [k, v] of Object.entries(corpo.dias || {})) {
      if (!DATA.test(k)) continue;
      const r = limpar(v);
      if (r) estado.notas[k] = r; else delete estado.notas[k];
    }
    if (corpo.cores && typeof corpo.cores === "object") {
      for (const c of ["p", "t", "a", "f", "h"]) {
        if (COR.test(corpo.cores[c] || "")) estado.cores[c] = corpo.cores[c];
      }
    }
    await store.setJSON("estado", estado);
  }

  return Response.json(estado, { headers: { "Cache-Control": "no-store" } });
};

export const config = { path: "/api/calendario" };
