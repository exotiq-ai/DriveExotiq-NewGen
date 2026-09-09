export type MediaKind = "hero" | "road" | "pair" | "film";

export type MediaPreferences = {
  mobile: boolean;
  saveData?: boolean;
  effectiveType?: string;
};

const slowConnections = new Set(["slow-2g", "2g", "3g"]);

export function isSlowConnection({
  saveData,
  effectiveType,
}: MediaPreferences) {
  return Boolean(
    saveData || (effectiveType && slowConnections.has(effectiveType)),
  );
}

/** Select exactly one H.264 delivery. Device pixel ratio intentionally has no role. */
export function selectMediaSource(
  kind: MediaKind,
  preferences: MediaPreferences,
) {
  const slow = isSlowConnection(preferences);
  if (kind === "hero") {
    if (!preferences.mobile) return "/media/v3/hero-landscape-1080.mp4";
    return slow || !preferences.effectiveType
      ? "/media/v3/hero-portrait-720.mp4"
      : "/media/v3/hero-portrait-1080.mp4";
  }
  if (kind === "film") {
    return slow ? "/media/v2/roadbook-720.mp4" : "/media/v2/roadbook-1080.mp4";
  }
  return kind === "pair"
    ? slow || preferences.mobile
      ? "/media/v2/telluride-720.mp4"
      : "/media/v2/telluride-1080.mp4"
    : slow || preferences.mobile
      ? "/media/v2/s8-720.mp4"
      : "/media/v2/s8-1080.mp4";
}
