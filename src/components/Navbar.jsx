import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Bookmark, GraduationCap, Compass, Info } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const NAV_LINKS = [
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/scholarships', label: 'Scholarships', icon: GraduationCap },
  { to: '/my-list', label: 'My List', icon: Bookmark },
  { to: '/profile', label: 'About', icon: Info }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { savedUnis, savedScholarships } = useApp();

  const savedCount = savedUnis.length + savedScholarships.length;

  const submit = function (e) {
    e.preventDefault();
    if (q.trim()) {
      navigate('/explore?q=' + encodeURIComponent(q.trim()));
      setOpen(false);
      setSearchOpen(false);
      setQ('');
    }
  };

  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-40 bg-sand/90 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">
          {/* Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="AidAtlas home"
          >
            <AidAtlasMark />
            <span className="text-xl font-serif font-normal tracking-tight text-slate">
              Aid<span className="text-clay-500">Atlas</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-6" aria-label="Primary">
            {NAV_LINKS.map(function (l) {
              const active = currentPath === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={
                    'px-3.5 py-2 rounded-btn text-sm font-semibold transition-all ' +
                    (active
                      ? 'bg-clay-50 text-clay-600'
                      : 'text-muted hover:text-slate hover:bg-surface-tint')
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Inline search (desktop) */}
            <form onSubmit={submit} className="hidden md:block relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                value={q}
                onChange={function (e) { setQ(e.target.value); }}
                placeholder="Search..."
                aria-label="Search"
                className="w-56 bg-white border border-line rounded-pill pl-9 pr-4 py-2 text-sm text-slate placeholder:text-muted focus:border-clay-500 focus:ring-4 focus:ring-clay-500/10 focus:outline-none transition-all shadow-soft"
              />
            </form>

            {/* Mobile search toggle */}
            <button
              onClick={function () { setSearchOpen(!searchOpen); }}
              className="md:hidden w-10 h-10 rounded-pill flex items-center justify-center text-muted hover:text-clay-600 hover:bg-clay-50 transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Saved counter */}
            <Link
              to="/my-list"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 h-10 rounded-pill bg-white border border-line shadow-soft text-sm font-semibold text-slate hover:border-clay-500 hover:text-clay-500 transition-colors"
              aria-label="Saved list"
            >
              <Bookmark size={15} />
              <span className="hidden lg:inline">Saved</span>
              {savedCount > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-pill bg-clay-500 text-white text-[11px] font-bold">
                  {savedCount}
                </span>
              ) : (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-pill bg-clay-50 text-clay-500 text-[11px] font-bold">
                  0
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={function () { setOpen(!open); }}
              className="lg:hidden w-10 h-10 rounded-pill flex items-center justify-center text-muted hover:text-clay-600 hover:bg-clay-50 transition-colors"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="md:hidden border-t border-line bg-sand">
          <div className="px-4 sm:px-6 py-3">
            <form onSubmit={submit} className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                autoFocus
                value={q}
                onChange={function (e) { setQ(e.target.value); }}
                placeholder="Search universities, scholarships..."
                className="w-full bg-white border border-line rounded-pill pl-10 pr-4 py-3 text-sm text-slate placeholder:text-muted focus:border-clay-500 focus:outline-none shadow-soft"
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-line bg-sand">
          <nav className="px-4 sm:px-6 py-4 grid gap-1.5">
            {NAV_LINKS.map(function (l) {
              const Icon = l.icon;
              const active = currentPath === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={function () { setOpen(false); }}
                  className={
                    'flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-semibold transition-colors ' +
                    (active
                      ? 'bg-clay-50 text-clay-600'
                      : 'text-slate hover:bg-surface-tint')
                  }
                >
                  <Icon size={18} />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

function AidAtlasMark() {
  return (
    <div
      className="w-9 h-9 rounded-btn flex items-center justify-center shrink-0"
      style={{
        background: 'linear-gradient(135deg, #E07A5F 0%, #0F766E 100%)',
        boxShadow: '0 4px 12px rgba(224, 122, 95, 0.3)'
      }}
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 16 L10 4 L16 16"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="12" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}