const filters = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'full', label: 'Full' },
];

export default function FilterPills({ selectedFilter, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter parking availability">
      {filters.map((filter) => {
        const isActive = selectedFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            aria-pressed={isActive}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              isActive
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
