import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Globe2,
  Wallet,
  Compass,
  Heart,
  Trophy,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { universities } from '../data/universities.js';
import { scholarships } from '../data/scholarships.js';
import { formatDate } from '../utils/deadlines.js';

/* ─────────────── Helpers ─────────────── */

function getCountryCode(country) {
  const map = {
    'United States': 'US', 'Canada': 'CA', 'United Kingdom': 'UK',
    'Germany': 'DE', 'Netherlands': 'NL', 'Ireland': 'IE',
    'France': 'FR', 'Spain': 'ES', 'Australia': 'AU'
  };
  return map[country] || (country ? country.slice(0, 2).toUpperCase() : 'XX');
}

function stableIndex(id) {
  let hash = 0;
  const str = String(id || '');
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff;
  }
  return String((hash % 999) + 1).padStart(3, '0');
}

/* ─────────────── Main Component ─────────────── */

export default function Home() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const scholarshipCount = scholarships.length;
    const universityCount = universities.length;
    const countries = new Set();
    universities.forEach(u => countries.add(u.country));
    const needBasedCount = scholarships.filter(s => s.needBased === true).length;

    return {
      scholarships: String(scholarshipCount).padStart(2, '0'),
      universities: String(universityCount).padStart(2, '0'),
      countries: String(countries.size).padStart(2, '0'),
      needBased: String(needBasedCount).padStart(2, '0')
    };
  }, []);

  const countryList = useMemo(() => {
    const map = new Map();
    universities.forEach(u => map.set(u.country, (map.get(u.country) || 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([country, count]) => ({ country, code: getCountryCode(country), count }));
  }, []);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const items = [];
    universities.forEach(u => {
      const d = u.deadlines && u.deadlines.regularDecision;
      if (!d) return;
      const date = new Date(d + 'T00:00:00');
      if (isNaN(date) || date < now) return;
      items.push({ date, title: u.name });
    });
    scholarships.forEach(s => {
      if (!s.deadline) return;
      const date = new Date(s.deadline + 'T00:00:00');
      if (isNaN(date) || date < now) return;
      items.push({ date, title: s.name });
    });
    items.sort((a, b) => a.date - b.date);

    const grouped = new Map();
    items.forEach(item => {
      const key = item.date.toISOString().slice(0, 7);
      if (!grouped.has(key)) {
        grouped.set(key, {
          month: item.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
          year: item.date.getFullYear(),
          count: 0
        });
      }
      grouped.get(key).count += 1;
    });
    return Array.from(grouped.values()).slice(0, 4);
  }, []);

  const featured = useMemo(() => scholarships.slice(0, 3), []);

  const submit = function (e) {
    e.preventDefault();
    if (q.trim()) navigate('/explore?q=' + encodeURIComponent(q.trim()));
  };

  return (
    <div className="bg-sand">
      {/* HERO */}
      <section className="relative overflow-hidden bg-sand pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-white border border-line shadow-soft mb-6">
              <Sparkles size={14} className="text-clay-500" />
              <span className="text-xs font-bold text-slate tracking-tight">
                Financial aid made simple
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-slate leading-[1.05] mb-6">
              Find your route to an{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-clay-500 italic">affordable</span>
                <span className="absolute left-0 right-0 bottom-1 h-3 -z-0 rounded-pill bg-clay-100" aria-hidden="true"></span>
              </span>{' '}
              education.
            </h1>

            <p className="text-lg sm:text-xl text-muted leading-relaxed mb-8 max-w-2xl">
              Explore scholarships, universities, and funding opportunities — organized around
              what you can actually afford and where you can go.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link to="/explore" className="btn-primary">
                Explore opportunities
                <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="btn-secondary">
                How AidAtlas works
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted">
              <Heart size={14} className="text-clay-500" />
              <span>Free · No signup · Built for international students</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={GraduationCap} color="clay" value={stats.scholarships} label="Scholarships" suffix="tracked" />
          <StatCard icon={Compass} color="teal" value={stats.universities} label="Universities" suffix="tracked" />
          <StatCard icon={Globe2} color="clay" value={stats.countries} label="Countries" suffix="covered" />
          <StatCard icon={Wallet} color="teal" value={stats.needBased} label="Need-based" suffix="aid records" />
        </div>
      </section>

      {/* SEARCH */}
      <section className="bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="card p-6 sm:p-10">
            <div className="mb-6">
              <div className="label text-clay-500">Search</div>
              <h2 className="text-2xl sm:text-3xl font-serif text-slate">
                Where are you trying to go?
              </h2>
            </div>

            <form onSubmit={submit} className="mb-5">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  value={q}
                  onChange={function (e) { setQ(e.target.value); }}
                  placeholder="Search scholarships, universities, countries..."
                  aria-label="Search"
                  className="input pl-12 pr-32 text-base"
                />
                <button type="submit" className="btn-primary absolute right-2 top-1/2 -translate-y-1/2" style={{ paddingTop: '0.625rem', paddingBottom: '0.625rem' }}>
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted mr-1">Popular:</span>
              <Link to="/explore?q=Computer%20Science" className="chip">💻 Computer Science</Link>
              <Link to="/scholarships" className="chip">💰 Full funding</Link>
              <Link to="/explore" className="chip">🇺🇸 United States</Link>
              <Link to="/explore" className="chip">🍁 Canada</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
            <div>
              <div className="label text-clay-500">Featured</div>
              <h2 className="text-2xl sm:text-3xl font-serif text-slate">Opportunities worth investigating</h2>
            </div>
            <Link to="/scholarships" className="inline-flex items-center gap-1.5 text-sm font-bold text-clay-600 hover:text-clay-700">
              Browse all <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {featured.map(function (s, i) {
              return <FeaturedCard key={s.id} scholarship={s} featured={i === 0} />;
            })}
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <section className="bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="card p-6 sm:p-10">
            <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
              <div>
                <div className="label text-teal-500">Destinations</div>
                <h2 className="text-2xl sm:text-3xl font-serif text-slate">Where can you go?</h2>
              </div>
              <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700">
                All universities <ChevronRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {countryList.map(function (c) {
                return (
                  <Link key={c.country} to={'/explore?q=' + encodeURIComponent(c.country)} className="group flex items-center gap-3 p-4 rounded-btn border border-line hover:border-teal-500 hover:bg-teal-50/50 transition-all">
                    <div className="w-10 h-10 rounded-btn bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors">
                      <MapPin size={18} className="text-teal-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate text-sm truncate">{c.country}</div>
                      <div className="text-xs text-muted font-medium">{c.count} {c.count === 1 ? 'university' : 'universities'}</div>
                    </div>
                    <ChevronRight size={16} className="text-muted group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* DEADLINES */}
      {upcomingDeadlines.length > 0 && (
        <section className="bg-sand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
            <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
              <div>
                <div className="label text-clay-500">Deadlines</div>
                <h2 className="text-2xl sm:text-3xl font-serif text-slate">What's coming up?</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingDeadlines.map(function (d, i) {
                return (
                  <div key={i} className="card card-hover p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={14} className="text-clay-500" />
                      <span className="text-xs font-bold text-muted tracking-wide">{d.month} {d.year}</span>
                    </div>
                    <div className="text-3xl font-serif text-slate mb-2">{String(d.count).padStart(2, '0')}</div>
                    <div className="text-xs font-semibold text-muted">{d.count === 1 ? 'deadline' : 'deadlines'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="label text-clay-500">Method</div>
            <h2 className="text-2xl sm:text-3xl font-serif text-slate mb-4">How AidAtlas works</h2>
            <p className="text-muted text-base sm:text-lg">A four-step route from research to application.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StepCard number="01" icon={Compass} title="Chart your profile" desc="Enter your academics, testing, funding needs, and destination preferences." color="clay" />
            <StepCard number="02" icon={GraduationCap} title="Explore the atlas" desc="Filter by what you actually qualify for — not what a directory decides to show." color="teal" />
            <StepCard number="03" icon={Trophy} title="Compare routes" desc="See cost, aid policies, deadlines, and match score side by side." color="clay" />
            <StepCard number="04" icon={Sparkles} title="Apply with confidence" desc="Track documents, deadlines, essays, and application status." color="teal" />
          </div>

          <div className="mt-12 text-center">
            <Link to="/profile" className="btn-primary">Chart your profile <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────── Sub-components ─────────────── */

function StatCard({ icon: Icon, color, value, label, suffix }) {
  const colors = {
    clay: { bg: 'bg-clay-50', fg: 'text-clay-600' },
    teal: { bg: 'bg-teal-50', fg: 'text-teal-600' }
  };
  const c = colors[color] || colors.clay;

  return (
    <div className="card card-hover p-5">
      <div className={'w-10 h-10 rounded-btn ' + c.bg + ' flex items-center justify-center mb-4'}>
        <Icon size={18} className={c.fg} />
      </div>
      <div className="text-3xl font-serif text-slate mb-1">{value}</div>
      <div className="text-sm font-bold text-slate">{label}</div>
      <div className="text-xs text-muted font-medium">{suffix}</div>
    </div>
  );
}

function StepCard({ number, icon: Icon, title, desc, color }) {
  const colors = { clay: 'bg-clay-50 text-clay-600', teal: 'bg-teal-50 text-teal-600' };
  const c = colors[color] || colors.clay;

  return (
    <div className="card card-hover p-6">
      <div className={'w-12 h-12 rounded-btn ' + c + ' flex items-center justify-center mb-5'}>
        <Icon size={22} />
      </div>
      <div className="text-xs font-bold text-muted tracking-wide mb-2">STEP {number}</div>
      <h3 className="text-lg font-serif text-slate mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{desc}</p>
    </div>
  );
}

function FeaturedCard({ scholarship: s, featured }) {
  const countryCode = getCountryCode(s.country);
  const index = stableIndex(s.id);
  const deadlineDisplay = s.deadline ? formatDate(s.deadline) : 'Not yet published';
  const isFullRide = (s.fundingType || '').toLowerCase().indexOf('full ride') !== -1;
  const isNeedBased = s.aidType === 'institutional_need_based';

  return (
    <Link to={'/scholarship/' + s.id} className={'card card-hover overflow-hidden flex flex-col ' + (featured ? 'lg:col-span-2' : '')}>
      {/* Top accent stripe */}
      <div className="h-1.5" style={{ background: featured ? 'linear-gradient(90deg, #E07A5F 0%, #0F766E 100%)' : 'linear-gradient(90deg, #0F766E 0%, #E07A5F 100%)' }}></div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <span className="text-[11px] font-bold text-muted tracking-wider font-mono">
            ATLAS / {countryCode} / UG / {index}
          </span>
          {featured && (
            <span className="badge-clay">
              <Sparkles size={11} /> Featured
            </span>
          )}
        </div>

        <h3 className={'font-serif text-slate mb-2 ' + (featured ? 'text-2xl' : 'text-lg')}>
          {s.name}
        </h3>
        <p className="text-sm text-muted mb-5">{s.provider}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {isNeedBased && <span className="badge-teal">Need-based</span>}
          {isFullRide && <span className="badge-clay">Full ride</span>}
          {s.country && <span className="badge-gray">{s.country}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line mb-5">
          <div>
            <div className="label">Funding</div>
            <div className="text-sm font-semibold text-slate truncate">{s.fundingType || 'Not specified'}</div>
          </div>
          <div>
            <div className="label">Deadline</div>
            <div className="text-sm font-semibold text-slate truncate">{deadlineDisplay}</div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-clay-600 group-hover:text-clay-700">
          View opportunity
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}