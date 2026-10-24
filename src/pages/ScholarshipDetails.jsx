import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Bookmark, ShieldCheck, Calendar, Award, AlertTriangle } from 'lucide-react';
import { scholarships } from '../data/scholarships.js';
import { universities } from '../data/universities.js';
import { useApp } from '../context/AppContext.jsx';
import Badge from '../components/Badge.jsx';
import { getDeadlineStatus, formatDate } from '../utils/deadlines.js';

function Section({ title, children }) {
  return (
    <section className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="font-semibold text-slate-900 mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Info({ label, value }) {
  let shown = value;
  if (value === null || value === undefined || value === '') shown = 'Data unavailable';
  if (Array.isArray(value)) shown = value.length > 0 ? value.join(', ') : 'Data unavailable';
  return (
    <div className="p-3 bg-slate-50 rounded-lg">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm text-slate-800 mt-0.5">{shown}</div>
    </div>
  );
}

export default function ScholarshipDetails() {
  const { id } = useParams();
  const s = scholarships.find(function (x) { return x.id === id; });
  const { savedScholarships, toggleSaveScholarship } = useApp();

  if (!s) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold">Scholarship not found</h1>
        <Link to="/scholarships" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium">
          Back to Scholarships
        </Link>
      </div>
    );
  }

  const saved = savedScholarships.indexOf(s.id) !== -1;
  const status = getDeadlineStatus(s.deadline);
  const toneMap = {
    open: 'green',
    'closing-soon': 'amber',
    closed: 'red',
    unknown: 'gray'
  };
  const tone = toneMap[status.status] || 'gray';

  const linkedUni = s.universityId ? universities.find(function (u) { return u.id === s.universityId; }) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge tone={tone}>{status.label}</Badge>
          <Badge tone="blue">{s.fundingType}</Badge>
          {s.country && <Badge tone="gray">{s.country}</Badge>}
          {s.aidType === 'institutional_need_based' && <Badge tone="green">Institutional Need-Based Aid</Badge>}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{s.name}</h1>
        <div className="text-slate-500 mt-1">
          Provided by {s.provider}
          {s.university && ' · ' + s.university}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <a
            href={s.applicationURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
          >
            Apply / Learn More <ExternalLink size={16} />
          </a>
          <button
            onClick={function () { toggleSaveScholarship(s.id); }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
          </button>
          {linkedUni && (
            <Link
              to={'/university/' + linkedUni.id}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              View University
            </Link>
          )}
        </div>
      </div>

      {s.aidType === 'institutional_need_based' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
          <AlertTriangle size={20} className="text-blue-700 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-800">
            <strong className="font-semibold">This is institutional need-based aid, not a merit scholarship.</strong>{' '}
            It is awarded based on demonstrated financial need after admission and is not automatic. Amounts and coverage
            are determined by the university's financial-aid office.
          </div>
        </div>
      )}

      <Section title="Award">
        <p className="text-sm text-slate-700 flex items-start gap-2">
          <Award size={16} className="mt-0.5 text-slate-400" />
          <span>
            {s.award ||
              (s.aidType === 'institutional_need_based'
                ? 'No fixed amount — determined by demonstrated need after admission.'
                : 'Award amount not published.')}
          </span>
        </p>
      </Section>

      <Section title="Eligibility">
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <Info label="Undergraduate eligible" value={s.undergraduateEligible === true ? 'Yes' : s.undergraduateEligible === false ? 'No' : 'Unknown'} />
          <Info label="First-year eligible" value={s.firstYearEligible === true ? 'Yes' : s.firstYearEligible === false ? 'No' : 'Unknown'} />
          <Info label="International eligible" value={s.internationalEligible === true ? 'Yes' : s.internationalEligible === false ? 'No' : 'Unknown'} />
          <Info label="Nigeria eligibility" value={s.nigerianEligibility || 'Not explicitly verified'} />
          <Info label="Eligible countries" value={s.eligibleCountries} />
          <Info label="Eligible degrees" value={s.eligibleDegrees} />
          <Info label="Eligible fields" value={s.eligibleFields} />
        </div>
      </Section>

      <Section title="Coverage">
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <Info label="Funding type" value={s.fundingType} />
          <Info label="Renewable" value={s.renewable} />
          <Info label="Full tuition possible" value={s.fullTuitionPossible === true ? 'Yes' : s.fullTuitionPossible === false ? 'No' : 'Unknown'} />
          <Info label="Full ride possible" value={s.fullRidePossible === true ? 'Yes' : s.fullRidePossible === false ? 'No' : 'Unknown'} />
          <Info label="Need based" value={s.needBased === true ? 'Yes' : s.needBased === false ? 'No' : 'Unknown'} />
          <Info label="Merit based" value={s.meritBased === true ? 'Yes' : s.meritBased === false ? 'No' : 'Unknown'} />
          <Info label="Automatic consideration" value={s.automaticConsideration === true ? 'Yes' : s.automaticConsideration === false ? 'No' : 'Unknown — see official page'} />
          <Info label="Separate application" value={s.separateApplication} />
          <Info label="Nomination required" value={s.nominationRequired === true ? 'Yes' : s.nominationRequired === false ? 'No' : 'Unknown'} />
        </div>
      </Section>

      <Section title="Deadline">
        <p className="text-sm text-slate-700 flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          {formatDate(s.deadline)}
        </p>
      </Section>

      {s.notes && (
        <Section title="Important note">
          <p className="text-sm text-slate-700">{s.notes}</p>
        </Section>
      )}

      <Section title="Official source">
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck size={16} className="text-emerald-600" />
          <a
            href={s.officialSource}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline break-all"
          >
            {s.officialSource}
          </a>
        </div>
        {s.sources && s.sources.length > 0 && (
          <div className="mt-3 text-xs text-slate-500">
            Last verified: {s.sources[0].lastVerified}
          </div>
        )}
      </Section>
    </div>
  );
}