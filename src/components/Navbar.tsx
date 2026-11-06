import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';

const LINKS = [
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#practice', label: 'Practice hub' },
  { href: '#how', label: 'How it works' },
];

export function Navbar({ onStart }: { onStart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'border-b border-line bg-surface/80 shadow-[0_1px_0_rgb(11_21_38/0.02)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Main"
      >
        <a
          href="#top"
          className="rounded-lg"
          aria-label="NxtWave AI/ML Interview Prep, back to top"
        >
          <Logo subtitle="AI/ML Interview Prep" />
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-2 text-[13.5px] font-semibold text-surface transition-transform hover:-translate-y-px active:translate-y-0"
        >
          Start practicing <ArrowRight className="size-4" aria-hidden />
        </button>
      </nav>
    </header>
  );
}
