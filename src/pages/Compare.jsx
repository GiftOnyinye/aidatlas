import { Link } from 'react-router-dom';
import { Trash2, X } from 'lucide-react';
import { universities } from '../data/universities.js';
import { useApp } from '../context/AppContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { calculateAidAtlasMatch } from '../utils/matching.js';
import { formatDate } from '../utils/deadlines.js';

function CellValue({ value }) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-400">Data unavailable</span>;
  }
  return <span className="text-slate-800">{value}</span>;
}

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare, profile } = useApp();

  const list = compareList
    .map(function (id) {
      return universities.find(function (u) { return u.id === id; });
    })
    .filter(Boolean);

  if (list.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Compare Universities</h1>
        <EmptyState
          title="No universities selected"
          description="Add up to 4 universities to compare cost, aid, deadlines, and match."
          action={
            <Link
              to="/explore"
              className="rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
            >
              Explore Universities
            </Link>
          }
        />
      </div>
    );
  }

  const rows = [
    {
      label: 'Country',
      get: function (u) { return u.country; }
    },
    {
      label: 'Type',
      get: function (u) { return u.type; }
    },
    {
      label: 'Tuition',
      get: function (u) {
        return u.costs && u.costs.tuition
          ? 'USD ' + u.costs.tuition.toLocaleString()
          : null;
      }
    },
    {
      label: 'Total estimated cost',
      get: function (u) {
        return u.costs && u.costs.totalEstimated
          ? u.costs.currency + ' ' + u.costs.totalEstimated.toLocaleString()
          : null;
      }
    },
    {
      label: 'International aid',
      get: function (u) { return u.internationalAid || null; }
    },
    {
      label: 'Need-based aid',
      get: function (u) { return u.needBasedAid || null; }
    },
    {
      label: 'Merit scholarships',
      get: function (u) { return u.meritAid || null; }
    },
    {
      label: 'Full-ride',
      get: function (u) { return u.fullRide || null; }
    },
    {
      label: 'Need-blind (international)',
      get: function (u) {
        if (u.needBlindInternational === true) return 'Yes';
        if (u.needBlindInternational === false) return 'No';
        return null;
      }
    },
    {
      label: 'Meets 100% demonstrated need',
      get: function (u) {
        if (u.meetsFullDemonstratedNeed === true) return 'Yes';
        if (u.meetsFullDemonstratedNeed === false) return 'No';
        return null;
      }
    },
    {
      label: 'SAT policy',
      get: function (u) { return u.testing && u.testing.sat; }
    },
    {
      label: 'ACT policy',
      get: function (u) { return u.testing && u.testing.act; }
    },
    {
      label: 'English test policy',
      get: function (u) { return u.testing && u.testing.englishTest; }
    },
    {
      label: 'Application platform',
      get: function (u) { return u.application && u.application.platform; }
    },
    {
      label: 'Application fee',
      get: function (u) {
        if (u.application && u.application.fee !== null && u.application.fee !== undefined) {
          return 'USD ' + u.application.fee;
        }
        return null;
      }
    },
    {
      label: 'Fee waiver',
      get: function (u) { return u.application && u.application.feeWaiver; }
    },
    {
      label: 'Application deadline',
      get: function (u) {
        if (u.deadlines && u.deadlines.regularDecision) {
          return formatDate(u.deadlines.regularDecision);
        }
        return 'Not yet published for Fall 2027';
      }
    },
    {
      label: 'Financial-aid deadline',
      get: function (u) {
        if (u.deadlines && u.deadlines.financialAid) {
          return u.deadlines.financialAid;
        }
        return 'Not yet published for Fall 2027';
      }
    },
    {
      label: 'AidAtlas Match',
      get: function (u) {
        return calculateAidAtlasMatch(u, profile).score + '%';
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compare Universities</h1>
          <p className="text-slate-500 text-sm mt-1">
            {list.length} of 4 universities selected
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          <Trash2 size={16} /> Clear all
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left p-4 font-semibold text-slate-700 sticky left-0 bg-slate-50 min-w-[180px]">
                  Attribute
                </th>
                {list.map(function (u) {
                  return (
                    <th key={u.id} className="text-left p-4 font-semibold text-slate-900 min-w-[220px]">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={'/university/' + u.id} className="hover:text-blue-700">
                          {u.name}
                        </Link>
                        <button
                          onClick={function () { removeFromCompare(u.id); }}
                          className="text-slate-400 hover:text-red-600"
                          aria-label={'Remove ' + u.name + ' from comparison'}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map(function (r, i) {
                return (
                  <tr key={r.label} className={i % 2 ? 'bg-slate-50/40' : ''}>
                    <td className="p-4 text-slate-600 sticky left-0 bg-white font-medium">
                      {r.label}
                    </td>
                    {list.map(function (u) {
                      return (
                        <td key={u.id} className="p-4">
                          <CellValue value={r.get(u)} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {list.length < 4 && (
        <div className="mt-4 text-sm text-slate-600">
          You can add {4 - list.length} more {4 - list.length === 1 ? 'university' : 'universities'} to this comparison.{' '}
          <Link to="/explore" className="text-blue-700 hover:underline">
            Find more →
          </Link>
        </div>
      )}
    </div>
  );
}