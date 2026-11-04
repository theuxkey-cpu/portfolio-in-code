// Single source of truth for background/text/border color per semantic tone
// (`neutral`/`info`/`success`/`warning`/`error`) — consumed by StatusBadge,
// Chip, and Alert, which would otherwise each reimplement the same mapping
// with their own cva. Each value here is a complete Tailwind class (never
// assembled via string interpolation) — Tailwind's scanner only generates
// CSS for tokens that appear as literal, contiguous text in some file.
export type Tone = "neutral" | "info" | "success" | "warning" | "error"

export const TONES: readonly Tone[] = ["neutral", "info", "success", "warning", "error"]

// -100 (background) / -700 (text) pair. `neutral` deliberately skips that
// pair and reuses `muted`/`secondary-foreground` instead of `muted-foreground`
// — `muted-foreground` on `bg-muted` measures under the 4.5:1 AA minimum;
// `secondary-foreground` is the accessible pairing for that same background.
export const TONE_BG_TEXT: Record<Tone, string> = {
  neutral: "bg-muted text-secondary-foreground",
  info: "bg-info-100 text-info-700",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  error: "bg-error-100 text-error-700",
}

// Tone-tinted border — opacity over the semantic token. Used by Alert.
// `neutral` uses the system's default border, not a tinted variant.
export const TONE_BORDER: Record<Tone, string> = {
  neutral: "border-border",
  info: "border-info-700/20",
  success: "border-success-700/20",
  warning: "border-warning-700/20",
  error: "border-error-700/20",
}

// Icon color for when only the icon carries the tone (Chip `emphasis="subtle"`).
// Diverges from the text color at `neutral`: the icon uses `muted-foreground`
// (an "unloaded" tone), since in that emphasis the surrounding text is
// `text-foreground`, not `secondary-foreground` (the pairing meant for a
// `bg-muted` background).
export const TONE_ICON: Record<Tone, string> = {
  neutral: "[&_svg]:text-muted-foreground",
  info: "[&_svg]:text-info-700",
  success: "[&_svg]:text-success-700",
  warning: "[&_svg]:text-warning-700",
  error: "[&_svg]:text-error-700",
}

// Text color only, no background/padding — for when a tone colors a bare
// line of text rather than a pill. Same text value as `TONE_BG_TEXT`, isolated.
export const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-secondary-foreground",
  info: "text-info-700",
  success: "text-success-700",
  warning: "text-warning-700",
  error: "text-error-700",
}
