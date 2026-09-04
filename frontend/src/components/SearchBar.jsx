import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by parking name or city"
        aria-label="Search parking locations by name or city"
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
      {value.trim() && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear parking search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
