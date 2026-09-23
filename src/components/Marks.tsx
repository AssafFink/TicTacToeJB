// Neon X / O marks, drawn in a 100×100 box so they can be placed inside any SVG.

interface MarkProps {
  x?: number;
  y?: number;
  size?: number;
}

export function XMark({ x = 0, y = 0, size = 100 }: MarkProps) {
  const inset = size * 0.12;
  return (
    <path
      className="neon-x"
      d={`M${x + inset} ${y + inset}L${x + size - inset} ${y + size - inset}M${x + size - inset} ${y + inset}L${x + inset} ${y + size - inset}`}
      strokeWidth={size * 0.1}
      strokeLinecap="round"
      fill="none"
    />
  );
}

export function OMark({ x = 0, y = 0, size = 100 }: MarkProps) {
  return (
    <circle
      className="neon-o"
      cx={x + size / 2}
      cy={y + size / 2}
      r={size * 0.38}
      strokeWidth={size * 0.1}
      fill="none"
    />
  );
}
