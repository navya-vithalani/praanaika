interface BrandMarkProps {
  compact?: boolean;
  onDark?: boolean;
}

export function BrandMark({ compact = false, onDark = false }: BrandMarkProps) {
  return (
    <div className={`brand-mark${onDark ? ' brand-mark--dark' : ''}`} aria-label="Praanaika" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img src="/assets/brand/logomark.svg" alt="Logo Mark" className="brand-mark__symbol" style={{ width: '36px', height: '36px', display: 'block' }} onError={(e) => (e.currentTarget.src = '/assets/brand/logomark.png')} />
      {!compact && <img src="/assets/brand/logo-wordmark.svg" alt="Praanaika" className="brand-mark__word" style={{ height: '24px', display: 'block' }} onError={(e) => (e.currentTarget.src = '/assets/brand/logo-wordmark.png')} />}
    </div>
  );
}
