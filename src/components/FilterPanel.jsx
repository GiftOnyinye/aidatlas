import { X } from 'lucide-react';

export default function FilterPanel({ filters, setFilters, groups, onClear }) {
  const update = function (key, value) {
    setFilters(function (f) {
      const next = Object.assign({}, f);
      next[key] = value;
      return next;
    });
  };

  const toggleArray = function (key, val) {
    setFilters(function (f) {
      const arr = f[key] || [];
      const next = Object.assign({}, f);
      if (arr.indexOf(val) !== -1) {
        next[key] = arr.filter(function (x) { return x !== val; });
      } else {
        next[key] = arr.concat([val]);
      }
      return next;
    });
  };

  const chips = [];
  Object.keys(filters).forEach(function (k) {
    const v = filters[k];
    if (Array.isArray(v)) {
      v.forEach(function (x) { chips.push({ k: k, label: x }); });
    } else if (v === true) {
      chips.push({ k: k, label: k });
    } else if (v) {
      chips.push({ k: k, label: k + ': ' + v });
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Filters</h2>
        {chips.length > 0 && (
          <button onClick={onClear} className="text-sm text-blue-700 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map(function (c, i) {
            return (
              <button
                key={i}
                onClick={function () {
                  const current = filters[c.k];
                  if (Array.isArray(current)) {
                    toggleArray(c.k, c.label);
                  } else {
                    update(c.k, '');
                  }
                }}
                className="inline-flex items-center gap-1 rounded-full text-xs font-medium px-2 py-0.5 border bg-blue-50 text-blue-700 border-blue-200"
              >
                {c.label} <X size={12} />
              </button>
            );
          })}
        </div>
      )}

      {groups.map(function (g) {
        return (
          <details key={g.title} open className="bg-white rounded-xl border border-slate-200 p-4">
            <summary className="font-medium text-slate-800 cursor-pointer text-sm">{g.title}</summary>
            <div className="mt-3 space-y-2">
              {g.fields.map(function (f) {
                if (f.type === 'checkbox-group') {
                  return (
                    <div key={f.key}>
                      <div className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">
                        {f.label}
                      </div>
                      <div className="space-y-1.5">
                        {f.options.map(function (o) {
                          const arr = filters[f.key] || [];
                          const checked = arr.indexOf(o) !== -1;
                          return (
                            <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={function () { toggleArray(f.key, o); }}
                                className="rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                              />
                              <span className="text-slate-700">{o}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                if (f.type === 'checkbox') {
                  return (
                    <label key={f.key} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!filters[f.key]}
                        onChange={function (e) { update(f.key, e.target.checked); }}
                        className="rounded border-slate-300 text-blue-700"
                      />
                      <span className="text-slate-700">{f.label}</span>
                    </label>
                  );
                }
                if (f.type === 'number') {
                  return (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{f.label}</label>
                      <input
                        type="number"
                        value={filters[f.key] || ''}
                        onChange={function (e) {
                          update(f.key, e.target.value ? Number(e.target.value) : '');
                        }}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}