/**
 * The NxtWave mark, as used on the NxtWave Prep platform. This is the one place to swap in the
 * official logo file from the brand team (e.g. <img src="/brand/nxtwave-logo.svg" alt="NxtWave" />).
 */
export function Logo({ subtitle, inverted = false }: { subtitle?: string; inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--brand)" />
        <path d="M10 22V10h2.6l6.8 8V10H22v12h-2.6l-6.8-8v8z" fill="var(--brand-ink)" />
      </svg>
      <span
        className={`font-display text-[15px] leading-tight font-extrabold tracking-tight ${inverted ? 'text-white' : 'text-ink'}`}
      >
        NxtWave
        {subtitle && (
          <small
            className={`block font-mono text-[10px] font-medium tracking-[0.08em] uppercase ${inverted ? 'text-white/60' : 'text-muted'}`}
          >
            {subtitle}
          </small>
        )}
      </span>
    </span>
  );
}
