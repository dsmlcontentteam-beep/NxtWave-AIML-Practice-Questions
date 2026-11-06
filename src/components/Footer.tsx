import { ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Logo subtitle="AI/ML Interview Prep" />
        <div className="flex flex-col gap-2 text-[13px] md:items-end">
          <a
            href="https://learning.ccbp.in/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 font-semibold text-ink hover:text-brand-deep"
          >
            Go to NxtWave Academy <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <span className="text-muted">© {new Date().getFullYear()} NxtWave</span>
        </div>
      </div>
    </footer>
  );
}
