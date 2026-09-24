interface BrandMarkProps {
  compact?: boolean;
  onDark?: boolean;
}

export function BrandMark({ compact = false, onDark = false }: BrandMarkProps) {
  return (
    <div className={`brand-mark${onDark ? ' brand-mark--dark' : ''}`} aria-label="Praanaika">
      <svg className="brand-mark__symbol" viewBox="0 0 48 48" role="img" aria-hidden="true">
        <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M24 9c-5 7-10 10-10 16a10 10 0 0 0 20 0c0-6-5-9-10-16Z" fill="currentColor" opacity=".88" />
        <circle cx="20" cy="25" r="1.5" fill="var(--color-on-primary)" />
        <circle cx="28" cy="25" r="1.5" fill="var(--color-on-primary)" />
      </svg>
      {!compact && <span className="brand-mark__word">Praanaika</span>}
    </div>
  );
}
