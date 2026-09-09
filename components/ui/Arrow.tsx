export default function Arrow({
  direction = "up",
  className = "",
}: {
  direction?: "up" | "right" | "down";
  className?: string;
}) {
  return (
    <svg
      className={`site-arrow ${className}`}
      style={{
        transform:
          direction === "right"
            ? "rotate(45deg)"
            : direction === "down"
              ? "rotate(135deg)"
              : undefined,
      }}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
