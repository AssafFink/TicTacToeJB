import { OMark, XMark } from './Marks';

// Decorative neon board for the home page (mirrors the mockup layout).
const ART_BOARD = ['X', 'O', 'O', 'X', 'O', null, 'O', 'X', 'X'] as const;
const CELL = 100;
const MARK = 76;
const OFFSET = (CELL - MARK) / 2;

export default function NeonBoardArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-10 -10 320 320" aria-hidden="true" focusable="false">
      <g className="neon-o" fill="none" strokeWidth={5}>
        <rect x="0" y="0" width="300" height="300" rx="16" />
        <path d="M100 0V300M200 0V300M0 100H300M0 200H300" />
      </g>
      {ART_BOARD.map((value, index) => {
        const x = (index % 3) * CELL + OFFSET;
        const y = Math.floor(index / 3) * CELL + OFFSET;
        if (value === 'X') return <XMark key={index} x={x} y={y} size={MARK} />;
        if (value === 'O') return <OMark key={index} x={x} y={y} size={MARK} />;
        return null;
      })}
      <path className="neon-o" d="M22 278L278 22" strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
}
