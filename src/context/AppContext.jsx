import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as storage from '../utils/storage.js';

const Ctx = createContext(null);

export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(() => storage.get('profile', null));
  const [savedUnis, setSavedUnis] = useState(() => storage.get('savedUnis', []));
  const [savedScholarships, setSavedScholarships] = useState(() => storage.get('savedScholarships', []));
  const [compareList, setCompareList] = useState(() => storage.get('compareList', []));
  const [applications, setApplications] = useState(() => storage.get('applications', {}));
  const [checklist, setChecklist] = useState(() => storage.get('checklist', {}));
  const [essays, setEssays] = useState(() => storage.get('essays', {}));
  const [essayDrafts, setEssayDrafts] = useState(() => storage.get('essayDrafts', {}));
  const [toast, setToast] = useState(null);

  useEffect(() => storage.set('profile', profile), [profile]);
  useEffect(() => storage.set('savedUnis', savedUnis), [savedUnis]);
  useEffect(() => storage.set('savedScholarships', savedScholarships), [savedScholarships]);
  useEffect(() => storage.set('compareList', compareList), [compareList]);
  useEffect(() => storage.set('applications', applications), [applications]);
  useEffect(() => storage.set('checklist', checklist), [checklist]);
  useEffect(() => storage.set('essays', essays), [essays]);
  useEffect(() => storage.set('essayDrafts', essayDrafts), [essayDrafts]);

  const notify = useCallback((msg, type) => {
    setToast({ msg: msg, type: type || 'success' });
    setTimeout(function () { setToast(null); }, 2800);
  }, []);

  const toggleSaveUni = function (id) {
    setSavedUnis(function (s) {
      if (s.indexOf(id) !== -1) {
        return s.filter(function (x) { return x !== id; });
      }
      return s.concat([id]);
    });
  };

  const toggleSaveScholarship = function (id) {
    setSavedScholarships(function (s) {
      if (s.indexOf(id) !== -1) {
        return s.filter(function (x) { return x !== id; });
      }
      return s.concat([id]);
    });
  };

  const addToCompare = function (id) {
    if (compareList.indexOf(id) !== -1) return true;
    if (compareList.length >= 4) {
      notify('You can compare up to 4 universities at a time. Remove one to add another.', 'error');
      return false;
    }
    setCompareList(function (c) { return c.concat([id]); });
    return true;
  };

  const removeFromCompare = function (id) {
    setCompareList(function (c) { return c.filter(function (x) { return x !== id; }); });
  };

  const clearCompare = function () {
    setCompareList([]);
  };

  const updateApplication = function (uniId, patch) {
    setApplications(function (a) {
      const existing = a[uniId] || {};
      const merged = Object.assign(
        {
          universityId: uniId,
          status: 'researching',
          financialAidStatus: '',
          notes: '',
          documents: [],
          updatedAt: new Date().toISOString()
        },
        existing,
        patch
      );
      const next = Object.assign({}, a);
      next[uniId] = merged;
      return next;
    });
  };

  const updateChecklistItem = function (uniId, item, status) {
    setChecklist(function (c) {
      const existing = c[uniId] || {};
      const next = Object.assign({}, c);
      next[uniId] = Object.assign({}, existing, { [item]: status });
      return next;
    });
  };

  const updateEssay = function (key, status) {
    setEssays(function (e) {
      const next = Object.assign({}, e);
      next[key] = status;
      return next;
    });
  };

  const updateEssayDraft = function (key, text) {
    setEssayDrafts(function (d) {
      const next = Object.assign({}, d);
      next[key] = text;
      return next;
    });
  };

  const clearEssayDraft = function (key) {
    setEssayDrafts(function (d) {
      const next = Object.assign({}, d);
      delete next[key];
      return next;
    });
  };

  const value = {
    profile: profile,
    setProfile: setProfile,
    savedUnis: savedUnis,
    savedScholarships: savedScholarships,
    compareList: compareList,
    applications: applications,
    checklist: checklist,
    essays: essays,
    essayDrafts: essayDrafts,
    toggleSaveUni: toggleSaveUni,
    toggleSaveScholarship: toggleSaveScholarship,
    addToCompare: addToCompare,
    removeFromCompare: removeFromCompare,
    clearCompare: clearCompare,
    updateApplication: updateApplication,
    updateChecklistItem: updateChecklistItem,
    updateEssay: updateEssay,
    updateEssayDraft: updateEssayDraft,
    clearEssayDraft: clearEssayDraft,
    notify: notify,
    toast: toast
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}