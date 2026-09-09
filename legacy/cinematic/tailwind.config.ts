import type { Config } from "tailwindcss";

/**
 * Drive Exotiq design system (the real one: tokens.css / CLAUDE.md).
 * Colors are CSS-var-backed so dark (default) + light themes work via
 * [data-theme="light"], and the `jewel` token flips metal <-> gold via
 * [data-variant="gold"] — that's how we preview both accent directions.
 * Rules honored: gulf = actions only; 2px corners; hairline depth, never glow.
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- Design system (var-backed; see :root in globals.css) ----
        canvas: "var(--de-bg)",
        "canvas-2": "var(--de-bg-2)",
        surface: "var(--de-surface)",
        "surface-2": "var(--de-surface-2)",
        line: "var(--de-line)",
        "line-2": "var(--de-line-2)",
        ink: "var(--de-text)",
        "ink-2": "var(--de-text-2)",
        "ink-3": "var(--de-text-3)",
        metal: "var(--de-metal)",
        gulf: "var(--de-gulf)",
        "gulf-2": "var(--de-gulf-2)",
        "gulf-soft": "var(--de-gulf-soft)",
        "on-gulf": "var(--de-on-gulf)",
        papaya: "var(--de-papaya)",
        "papaya-soft": "var(--de-papaya-soft)",
        gold: "var(--de-gold)",
        "gold-2": "var(--de-gold-2)",
        centurion: "var(--de-centurion)",
        // jewel = the precious accent slot; metal by default, gold under [data-variant="gold"]
        jewel: "var(--de-jewel)",
        "jewel-2": "var(--de-jewel-2)",

        // ---- Legacy tokens (kept so not-yet-migrated pages still compile;
        //      re-pointed onto the warm palette for visual consistency) ----
        "gulf-blue": "#6CBDE6",
        "performance-orange": "#FF5A1F",
        "deep-black": "#0B0B0C",
        "jet-grey": "#161618",
        "pure-white": "#F3F1EC",
        "metallic-silver": "#C9C6BD",
        graphite: "#3A3A40",
        "midnight-blue": "#101012",
      },
      fontFamily: {
        display: ["var(--font-display)", '"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", '"Schibsted Grotesk"', "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Spectral", "Georgia", "serif"],
      },
      letterSpacing: {
        "tight-exotiq": "-0.02em",
        "wide-exotiq": "0.20em",
        tightest: "-0.03em",
      },
      maxWidth: {
        content: "1180px",
        prose: "72ch",
      },
      spacing: {
        section: "clamp(4.5rem, 11vh, 9rem)",
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
        lg: "4px",
      },
      boxShadow: {
        // light-theme "paper" depth — one soft shadow, never glow on the brand
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.18)",
      },
      transitionTimingFunction: {
        de: "cubic-bezier(.2,.7,.2,1)",
      },
      transitionDuration: {
        250: "250ms",
        400: "400ms",
        600: "600ms",
      },
      keyframes: {
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "reveal-up": "reveal-up 0.6s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
