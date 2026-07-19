/**
 * TagMark — fiducial-style glyph in the AprilTag visual language.
 * Deterministic (seeded LCG, no Math.random) so server/client render match.
 * Decorative only: callers must pass aria-hidden via the wrapping element.
 */
type TagMarkProps = {
  size?: number;
  seed?: number;
  className?: string;
};

export function TagMark({ size = 96, seed = 11, className }: TagMarkProps) {
  // 5×5 payload inside a 1-cell quiet ring — 7×7 total, like a real tag
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const cells: Array<[number, number]> = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (rand() > 0.5) cells.push([x + 1, y + 1]);
    }
  }

  return (
    <svg
      viewBox="0 0 7 7"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden
      focusable="false"
    >
      {/* border ring */}
      <path
        d="M0 0 H7 V7 H0 Z M1 1 V6 H6 V1 Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
    </svg>
  );
}
