import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor="question-search" className="sr-only">
        Search questions, topics or concepts
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted"
        aria-hidden
      />
      <input
        id="question-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search questions, topics or concepts..."
        autoComplete="off"
        maxLength={80}
        className="h-12 w-full rounded-xl border border-line-2 bg-surface pr-10 pl-11 text-[15px] text-ink shadow-soft outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-2.5 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
          aria-label="Clear search"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
