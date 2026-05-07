// Builds a tonal palette from a single base color (any HSL).
// Generates light or dark variants for our app's CSS variables.

export interface HSL { h: number; s: number; l: number }

export const hexToHsl = (hex: string): HSL => {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0; const l = (max + min) / 2;
  const s = max === min ? 0 : (l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min));
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / (max - min) + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / (max - min) + 2); break;
      case b: h = ((r - g) / (max - min) + 4); break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const v = ({ h, s, l }: HSL) => `${h} ${s}% ${l}%`;

export type Mode = "light" | "dark";

/**
 * Generate the full set of CSS-var values for a tonal palette derived from `base`.
 * Light mode = light surfaces with the chosen color as primary.
 * Dark mode  = dark tonal surfaces tinted with the chosen color, color brightened for primary.
 */
export const buildTonalTheme = (base: HSL, mode: Mode): Record<string, string> => {
  const { h, s } = base;
  if (mode === "light") {
    return {
      "--background": v({ h, s: Math.min(s, 30), l: 98 }),
      "--foreground": v({ h, s: Math.min(s, 30), l: 12 }),
      "--card":       v({ h, s: Math.min(s, 25), l: 100 }),
      "--card-foreground": v({ h, s: Math.min(s, 30), l: 12 }),
      "--popover":    v({ h, s: Math.min(s, 25), l: 100 }),
      "--popover-foreground": v({ h, s: Math.min(s, 30), l: 12 }),
      "--primary":    v({ h, s: Math.max(s, 55), l: Math.min(Math.max(base.l, 35), 50) }),
      "--primary-foreground": v({ h, s: 10, l: 99 }),
      "--secondary":  v({ h, s: Math.min(s, 25), l: 94 }),
      "--secondary-foreground": v({ h, s: Math.min(s, 30), l: 15 }),
      "--muted":      v({ h, s: Math.min(s, 22), l: 93 }),
      "--muted-foreground": v({ h, s: 12, l: 42 }),
      "--accent":     v({ h, s: Math.min(s, 28), l: 90 }),
      "--accent-foreground": v({ h, s: Math.min(s, 30), l: 15 }),
      "--destructive":"0 75% 50%",
      "--destructive-foreground": "0 0% 100%",
      "--success":    "142 60% 38%",
      "--warning":    "38 92% 50%",
      "--border":     v({ h, s: Math.min(s, 20), l: 88 }),
      "--input":      v({ h, s: Math.min(s, 20), l: 88 }),
      "--ring":       v({ h, s: Math.max(s, 55), l: 45 }),
      "--header":     v({ h, s: Math.max(s, 55), l: Math.min(Math.max(base.l, 30), 40) }),
      "--header-foreground": v({ h, s: 10, l: 99 }),
    };
  }
  // dark
  return {
    "--background": v({ h, s: Math.min(s, 30), l: 9 }),
    "--foreground": v({ h, s: Math.min(s, 15), l: 94 }),
    "--card":       v({ h, s: Math.min(s, 28), l: 13 }),
    "--card-foreground": v({ h, s: Math.min(s, 15), l: 94 }),
    "--popover":    v({ h, s: Math.min(s, 28), l: 13 }),
    "--popover-foreground": v({ h, s: Math.min(s, 15), l: 94 }),
    "--primary":    v({ h, s: Math.max(s, 70), l: 65 }),
    "--primary-foreground": v({ h, s: Math.min(s, 30), l: 10 }),
    "--secondary":  v({ h, s: Math.min(s, 25), l: 19 }),
    "--secondary-foreground": v({ h, s: Math.min(s, 15), l: 94 }),
    "--muted":      v({ h, s: Math.min(s, 22), l: 17 }),
    "--muted-foreground": v({ h, s: 12, l: 65 }),
    "--accent":     v({ h, s: Math.min(s, 28), l: 24 }),
    "--accent-foreground": v({ h, s: Math.min(s, 15), l: 94 }),
    "--destructive":"0 65% 50%",
    "--destructive-foreground": "0 0% 100%",
    "--success":    "142 50% 50%",
    "--warning":    "38 90% 55%",
    "--border":     v({ h, s: Math.min(s, 25), l: 22 }),
    "--input":      v({ h, s: Math.min(s, 25), l: 22 }),
    "--ring":       v({ h, s: Math.max(s, 70), l: 65 }),
    "--header":     v({ h, s: Math.min(s, 28), l: 13 }),
    "--header-foreground": v({ h, s: Math.min(s, 15), l: 94 }),
  };
};
