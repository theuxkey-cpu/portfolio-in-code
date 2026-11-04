import type { Args, ArgsOf, ControlDef, ControlSchema } from "@/lib/registry/types"

export function defaultArgs<S extends ControlSchema>(schema: S): ArgsOf<S> {
  const result: Record<string, Args[string]> = {}
  for (const key of Object.keys(schema)) {
    result[key] = schema[key].default
  }
  return result as ArgsOf<S>
}

export function coerceArg(def: ControlDef, raw: unknown): Args[string] {
  switch (def.type) {
    case "boolean":
      return raw === true || raw === "true"
    case "number": {
      const value = typeof raw === "number" ? raw : Number(raw)
      return Number.isFinite(value) ? value : def.default
    }
    case "select":
    case "radio":
    case "text":
      return typeof raw === "string" ? raw : def.default
  }
}

/**
 * Isomorphic base64url JSON codec (works in the Node.js server runtime and
 * in the browser) — used both by the server page reading the initial
 * `?a=` query param and by the client bridge encoding live arg updates.
 * `atob`/`btoa` are stable Node.js globals (18+) and standard in browsers,
 * so this avoids a `Buffer`-only path that would break in a client bundle.
 */
export function encodeArgs(args: Args): string {
  const json = JSON.stringify(args)
  const bytes = new TextEncoder().encode(json)
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function decodeArgs(encoded: string | undefined, schema: ControlSchema): Args {
  const fallback = defaultArgs(schema)
  if (!encoded) return fallback

  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed: unknown = JSON.parse(json)

    if (typeof parsed !== "object" || parsed === null) return fallback

    const out: Record<string, Args[string]> = { ...fallback }
    for (const [key, def] of Object.entries(schema)) {
      const raw = (parsed as Record<string, unknown>)[key]
      if (raw !== undefined) out[key] = coerceArg(def, raw)
    }
    return out
  } catch {
    return fallback
  }
}
