import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BookOpen, FileText, UserCheck, CheckCircle2, Circle, Clock, Sparkles, Loader2 } from 'lucide-react';
import { universities } from '../data/universities.js';
import { useApp } from '../context/AppContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { reviewEssayWithAI } from '../utils/ai.js';

const STATUSES = [
  { value: 'not_started', label: 'Not started', Icon: Circle, color: 'text-muted' },
  { value: 'drafting', label: 'Drafting', Icon: Clock, color: 'text-clay-500' },
  { value: 'reviewing', label: 'Reviewing', Icon: FileText, color: 'text-teal-600' },
  { value: 'complete', label: 'Complete', Icon: CheckCircle2, color: 'text-teal-500' }
];

const COMMON_ESSAYS = [
  { id: 'personal-statement', label: 'Personal Statement (Common App)', docType: 'essay' },
  { id: 'activities-list', label: 'Activities List', docType: 'list' },
  { id: 'resume', label: 'Resume / CV', docType: 'document' }
];

const UNI_DOCS = [
  { id: 'supplemental-1', label: 'Supplemental Essay #1', docType: 'essay' },
  { id: 'supplemental-2', label: 'Supplemental Essay #2', docType: 'essay' },
  { id: 'supplemental-3', label: 'Supplemental Essay #3', docType: 'essay' },
  { id: 'counselor-recommendation', label: 'Counselor Recommendation', docType: 'recommendation' },
  { id: 'teacher-recommendation-1', label: 'Teacher Recommendation #1', docType: 'recommendation' },
  { id: 'teacher-recommendation-2', label: 'Teacher Recommendation #2', docType: 'recommendation' }
];

const ESSAY_TARGETS = {
  'personal-statement': { min: 250, max: 650 },
  'supplemental-1': { min: 100, max: 400 },
  'supplemental-2': { min: 100, max: 400 },
  'supplemental-3': { min: 100, max: 400 }
};

function StatusPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1">
      {STATUSES.map(function (s) {
        const Icon = s.Icon;
        const active = value === s.value;
        return (
          <button
            key={s.value}
            onClick={function () { onChange(s.value); }}
            className={
              'inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-btn border font-semibold transition-colors ' +
              (active
                ? 'bg-clay-500 text-white border-clay-500'
                : 'bg-white text-muted border-line hover:bg-surface-tint')
            }
          >
            <Icon size={12} className={active ? 'text-white' : s.color} />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function EssayEditor({ essayKey, essayId, essayLabel }) {
  const { essayDrafts, updateEssayDraft, clearEssayDraft } = useApp();
  const [aiFeedback, setAiFeedback] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const text = (essayDrafts && essayDrafts[essayKey]) || '';
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const target = ESSAY_TARGETS[essayId] || { min: 0, max: 1000 };

  let countColor = 'text-muted';
  let countLabel = words + ' words';
  if (target.max) {
    if (words > target.max) {
      countColor = 'text-clay-600';
      countLabel = words + ' / ' + target.max + ' words — over limit';
    } else if (words >= target.min) {
      countColor = 'text-teal-600';
      countLabel = words + ' / ' + target.max + ' words — in range';
    } else if (words > 0) {
      countColor = 'text-clay-500';
      countLabel = words + ' / ' + target.max + ' words — keep going';
    }
  }

  const handleReview = async function () {
    setIsAiLoading(true);
    setAiFeedback('');
    const feedback = await reviewEssayWithAI(text, essayLabel || 'College Essay');
    setAiFeedback(feedback);
    setIsAiLoading(false);
  };

  return (
    <div className="mt-4 p-5 bg-surface-tint rounded-card border border-line">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className="text-xs font-bold text-muted uppercase tracking-wider">Draft</span>
        <div className="flex items-center gap-3">
          <span className={'text-xs font-bold ' + countColor}>{countLabel}</span>
          <span className="text-xs text-muted">· {chars} chars</span>
        </div>
      </div>
      
      <textarea
        value={text}
        onChange={function (e) { updateEssayDraft(essayKey, e.target.value); }}
        placeholder="Start writing your draft here. Everything auto-saves."
        rows={10}
        className="w-full rounded-btn border border-line px-4 py-3 text-sm text-slate focus:border-clay-500 focus:outline-none resize-y mb-3"
      ></textarea>
      
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <button
          onClick={function () {
            if (window.confirm('Clear this draft?')) {
              clearEssayDraft(essayKey);
              setAiFeedback('');
            }
          }}
          className="text-xs text-clay-600 font-semibold hover:underline"
        >
          Clear draft
        </button>

        <button
          onClick={handleReview}
          disabled={isAiLoading}
          className="btn-teal py-2 px-4 text-xs flex items-center gap-2"
        >
          {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {isAiLoading ? 'Reviewing...' : 'Review with AI'}
        </button>
      </div>

      {aiFeedback && (
        <div className="mt-4 p-4 rounded-btn bg-white border border-teal-100 shadow-soft">
          <div className="flex items-center gap-2 mb-2 text-teal-600">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">AI Feedback</span>
          </div>
          <div className="text-sm text-slate whitespace-pre-wrap leading-relaxed">
            {aiFeedback}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Essays() {
  const { savedUnis, essays, updateEssay } = useApp();
  const [tab, setTab] = useState('common');
  const [openEditor, setOpenEditor] = useState(null);

  const unis = savedUnis
    .map(function (id) {
      return universities.find(function (u) { return u.id === id; });
    })
    .filter(Boolean);

  if (unis.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-serif text-slate mb-6">Essays & Documents</h1>
        <EmptyState
          title="No universities saved"
          description="Save universities first, then track essays, recommendations, and documents here."
          action={
            <Link to="/explore" className="btn-primary">
              Explore Universities
            </Link>
          }
        />
      </div>
    );
  }

  const totalItems = COMMON_ESSAYS.length + unis.length * UNI_DOCS.length;
  const completed = Object.keys(essays || {}).filter(function (k) {
    return essays[k] === 'complete';
  }).length;
  const progress = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate mb-2">Essays & Documents</h1>
        <p className="text-muted">
          Track every essay, recommendation, and document required across your saved universities.
        </p>
      </div>

      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate">Overall progress</span>
          <span className="text-sm font-bold text-clay-600">
            {completed} / {totalItems} complete
          </span>
        </div>
        <div className="h-2.5 bg-surface-tint rounded-pill overflow-hidden">
          <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: progress + '%' }}></div>
        </div>
        <div className="text-xs text-muted font-semibold mt-2">{progress}% done</div>
      </div>

      <div className="border-b border-line mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-2" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'common'}
            onClick={function () { setTab('common'); setOpenEditor(null); }}
            className={
              'px-5 py-2.5 text-sm font-semibold rounded-pill transition-colors ' +
              (tab === 'common'
                ? 'bg-slate text-white'
                : 'bg-white text-muted border border-line hover:text-slate')
            }
          >
            Common Documents
          </button>
          {unis.map(function (u) {
            return (
              <button
                key={u.id}
                role="tab"
                aria-selected={tab === u.id}
                onClick={function () { setTab(u.id); setOpenEditor(null); }}
                className={
                  'px-5 py-2.5 text-sm font-semibold rounded-pill whitespace-nowrap transition-colors ' +
                  (tab === u.id
                    ? 'bg-slate text-white'
                    : 'bg-white text-muted border border-line hover:text-slate')
                }
              >
                {u.name}
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'common' && (
        <div className="space-y-4">
          {COMMON_ESSAYS.map(function (item) {
            const key = 'common:' + item.id;
            const status = (essays && essays[key]) || 'not_started';
            const isWriting = openEditor === key;
            const isEssay = item.docType === 'essay';

            return (
              <div key={item.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-btn bg-surface-tint flex items-center justify-center text-muted">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="font-serif text-lg text-slate">{item.label}</div>
                      <div className="text-xs text-muted font-semibold uppercase tracking-wider">{item.docType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusPicker value={status} onChange={function (v) { updateEssay(key, v); }} />
                    {isEssay && (
                      <button
                        onClick={function () { setOpenEditor(isWriting ? null : key); }}
                        className="btn-secondary py-1.5 px-3 text-xs"
                      >
                        {isWriting ? 'Close editor' : 'Write / Edit draft'}
                      </button>
                    )}
                  </div>
                </div>
                {isEssay && isWriting && (
                  <EssayEditor essayKey={key} essayId={item.id} essayLabel={item.label} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {unis.map(function (u) {
        if (tab !== u.id) return null;
        return (
          <div key={u.id} className="space-y-4">
            {UNI_DOCS.map(function (item) {
              const key = u.id + ':' + item.id;
              const status = (essays && essays[key]) || 'not_started';
              const isWriting = openEditor === key;
              const isEssay = item.docType === 'essay';

              return (
                <div key={item.id} className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-btn bg-surface-tint flex items-center justify-center text-muted">
                        {item.docType === 'recommendation' ? <UserCheck size={18} /> : <FileText size={18} />}
                      </div>
                      <div>
                        <div className="font-serif text-lg text-slate">{item.label}</div>
                        <div className="text-xs text-muted font-semibold uppercase tracking-wider">{item.docType}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusPicker value={status} onChange={function (v) { updateEssay(key, v); }} />
                      {isEssay && (
                        <button
                          onClick={function () { setOpenEditor(isWriting ? null : key); }}
                          className="btn-secondary py-1.5 px-3 text-xs"
                        >
                          {isWriting ? 'Close editor' : 'Write / Edit draft'}
                        </button>
                      )}
                    </div>
                  </div>
                  {isEssay && isWriting && (
                    <EssayEditor essayKey={key} essayId={item.id} essayLabel={item.label} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      <p className="text-xs text-muted font-medium mt-8 text-center">
        Progress and drafts are saved locally in your browser. AI review requires Ollama running locally.
      </p>
    </div>
  );
}