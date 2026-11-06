import { ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-2">
          <Logo subtitle="Career Preparation Program" />
          <p className="max-w-md text-[13px] leading-relaxed text-muted">
            Built to take you through the NxtWave learning portal, so your basics are clear before
            interview preparation starts. Every question opens on NxtWave Academy, where you solve
            it and keep your progress. More roles and features are on the way.
          </p>
        </div>
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
