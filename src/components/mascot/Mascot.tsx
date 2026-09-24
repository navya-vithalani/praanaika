interface MascotProps {
  mood?: 'curious' | 'happy' | 'sleepy' | 'thinking';
  size?: number;
}

export function Mascot({ mood = 'curious', size = 72 }: MascotProps) {
  const eyeY = mood === 'sleepy' ? 34 : 31;
  return (
    <svg className="mascot" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Pran feeling ${mood}`}>
      <circle className="mascot__glow" cx="50" cy="52" r="38" />
      <path className="mascot__body" d="M50 12c-14 9-30 18-30 42 0 20 13 33 30 33s30-13 30-33c0-24-16-33-30-42Z" />
      <circle cx="39" cy={eyeY} r="3" fill="var(--color-on-primary)" />
      <circle cx="61" cy={eyeY} r="3" fill="var(--color-on-primary)" />
      <path className="mascot__smile" d={mood === 'happy' ? 'M40 43q10 12 20 0' : 'M42 45q8 6 16 0'} />
    </svg>
  );
}
