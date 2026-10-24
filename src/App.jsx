import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import UniversityDetails from './pages/UniversityDetails.jsx';
import Scholarships from './pages/Scholarships.jsx';
import ScholarshipDetails from './pages/ScholarshipDetails.jsx';
import Compare from './pages/Compare.jsx';
import MyList from './pages/MyList.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import ApplicationTracker from './pages/ApplicationTracker.jsx';
import Essays from './pages/Essays.jsx';
import Export from './pages/Export.jsx';
import { useApp } from './context/AppContext.jsx';

function ScrollToTop() {
  const location = useLocation();
  useEffect(function () {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const tone = toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900';
  return (
    <div
      role="status"
      aria-live="polite"
      className={'fixed bottom-4 left-1/2 -translate-x-1/2 ' + tone + ' text-white px-4 py-2.5 rounded-lg shadow-lg text-sm z-50'}
    >
      {toast.msg}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/university/:id" element={<UniversityDetails />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/scholarship/:id" element={<ScholarshipDetails />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tracker" element={<ApplicationTracker />} />
          <Route path="/essays" element={<Essays />} />
          <Route path="/export" element={<Export />} />
          <Route
            path="*"
            element={
              <div className="max-w-3xl mx-auto p-12 text-center">
                <h1 className="text-2xl font-bold">Page not found</h1>
                <p className="text-slate-500 mt-2">The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Toast />
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-sm text-slate-500 flex flex-col sm:flex-row gap-3 justify-between">
          <div>© {new Date().getFullYear()} AidAtlas — Financial-aid-aware university discovery.</div>
          <div>All figures should be verified on official university websites.</div>
        </div>
      </footer>
    </div>
  );
}