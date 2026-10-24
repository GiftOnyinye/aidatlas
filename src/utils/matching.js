const hasTestOptional = (u) =>
  /optional|not required|not considered/i.test(u.testing?.sat || '') ||
  /optional/i.test(u.testing?.act || '');

function getClassSize(uni) {
  const e = uni.enrollment;
  if (!e) return null;
  if (e < 2000) return 'small';
  if (e < 10000) return 'medium';
  return 'large';
}

export function calculateAidAtlasMatch(university, profile) {
  const reasons = [];
  const concerns = [];
  let academicFit = 0;
  let financialFit = 0;
  let internationalFit = 0;
  let majorFit = 0;
  let applicationFit = 0;
  let preferencesFit = 0;

  if (!profile) {
    const m = university.majors && university.majors.length ? 10 : 0;
    const i = ['available', 'limited'].includes(university.internationalAid) ? 10 : 0;
    return {
      score: Math.min(20 + m + i, 100),
      academicFit: 0,
      financialFit: 0,
      internationalFit: i,
      majorFit: m,
      applicationFit: 0,
      preferencesFit: 0,
      reasons: ['Add your profile for a personalized match'],
      concerns: []
    };
  }

  // ========== 1. ACADEMIC (25) ==========
  const gpa = Number(profile.gpa) || null;
  if (gpa !== null) {
    if (gpa >= 3.8 || (gpa >= 90 && gpa <= 100)) {
      academicFit += 22;
      reasons.push('Strong academic profile');
    } else if (gpa >= 3.4) {
      academicFit += 15;
      reasons.push('Competitive academic range');
    } else if (gpa >= 3.0) {
      academicFit += 8;
    } else {
      academicFit += 3;
      concerns.push('Academic profile may be below typical range');
    }
  } else {
    academicFit += 10;
  }

  if (profile.classRank && /top 5|top 10|1st|2nd|3rd/i.test(profile.classRank)) {
    academicFit = Math.min(academicFit + 3, 25);
    reasons.push('Strong class rank');
  }

  // ========== 2. FINANCIAL (30) ==========
  const international = ['available', 'limited'].includes(university.internationalAid);
  if (profile.needFullFunding) {
    if (university.fullRide === 'possible' || university.fullRide === 'available') {
      financialFit += 18;
      reasons.push('Full-ride opportunity possible');
    }
    if (university.needBasedAid === 'available') {
      financialFit += 10;
      reasons.push('Need-based aid available');
    }
    if (!international && university.internationalAid !== 'available') {
      concerns.push('Institutional aid for internationals limited or unavailable');
    }
  } else {
    if (university.meritAid === 'available') {
      financialFit += 15;
      reasons.push('Merit scholarships available');
    }
    if (university.needBasedAid === 'available') {
      financialFit += 10;
    }
    if (university.fullTuition === 'possible' || university.fullTuition === 'available') {
      financialFit += 5;
      reasons.push('Full-tuition awards possible');
    }
  }
  financialFit = Math.min(financialFit, 30);

  // ========== 3. INTERNATIONAL (20) ==========
  if (university.internationalStudents) {
    internationalFit += 10;
    reasons.push('International students accepted');
  }
  if (university.internationalAid === 'available') {
    internationalFit += 10;
    reasons.push('International students eligible for aid');
  } else if (university.internationalAid === 'limited') {
    internationalFit += 5;
    concerns.push('International aid is limited');
  } else {
    concerns.push('International financial aid not confirmed');
  }

  // ========== 4. MAJOR (15) ==========
  const intended = (profile.intendedMajor || '').toLowerCase();
  if (
    intended &&
    university.majors &&
    university.majors.some(function (m) {
      return (
        m.name.toLowerCase().indexOf(intended) !== -1 ||
        intended.indexOf(m.name.toLowerCase()) !== -1
      );
    })
  ) {
    majorFit = 15;
    reasons.push(profile.intendedMajor + ' is available');
  } else if (intended) {
    concerns.push(profile.intendedMajor + ' not listed');
  } else {
    majorFit = 5;
  }

  // ========== 5. APPLICATION (10) ==========
  if (hasTestOptional(university)) {
    applicationFit += 4;
    reasons.push('Test-optional');
  } else if (!profile.sat && !profile.act) {
    concerns.push('SAT/ACT required and not yet taken');
  }
  if (/yes|available/i.test((university.application && university.application.feeWaiver) || '')) {
    applicationFit += 3;
    reasons.push('Application fee waiver available');
  }
  if (university.deadlines && university.deadlines.regularDecision) {
    applicationFit += 3;
  }
  applicationFit = Math.min(applicationFit, 10);

  // ========== 6. PREFERENCES (10) ==========
  if (profile.preferredClassSize) {
    const size = getClassSize(university);
    if (size === profile.preferredClassSize) {
      preferencesFit += 5;
      reasons.push('Class size matches your preference');
    } else if (size) {
      concerns.push('Class size differs from your preference');
    }
  } else {
    preferencesFit += 2;
  }

  if (profile.preferredLocation) {
    const loc = (university.locationType || '').toLowerCase();
    if (loc === profile.preferredLocation) {
      preferencesFit += 5;
      reasons.push('Location type matches your preference');
    } else if (loc) {
      concerns.push('Location type differs from your preference');
    }
  } else {
    preferencesFit += 2;
  }
  preferencesFit = Math.min(preferencesFit, 10);

  // ========== POST-HOC CONCERNS ==========
  if (university.cssProfileRequired === 'Required') {
    concerns.push('CSS Profile required');
  }
  if (
    university.deadlines &&
    university.deadlines.financialAid &&
    university.deadlines.regularDecision &&
    new Date(university.deadlines.financialAid) <
      new Date(university.deadlines.regularDecision)
  ) {
    concerns.push('Financial-aid deadline is earlier than admission deadline');
  }

  // ========== TOTAL (max 110 -> normalized to 100) ==========
  const raw =
    academicFit +
    financialFit +
    internationalFit +
    majorFit +
    applicationFit +
    preferencesFit;
  const score = Math.round((raw / 110) * 100);

  return {
    score: score,
    academicFit: academicFit,
    financialFit: financialFit,
    internationalFit: internationalFit,
    majorFit: majorFit,
    applicationFit: applicationFit,
    preferencesFit: preferencesFit,
    reasons: reasons,
    concerns: concerns
  };
}

export function matchLabel(score) {
  if (score >= 80) return { label: 'Strong Match', tone: 'green' };
  if (score >= 65) return { label: 'Good Match', tone: 'blue' };
  if (score >= 50) return { label: 'Possible Match', tone: 'amber' };
  if (score >= 30) return { label: 'Weak Match', tone: 'gray' };
  return { label: 'Poor Match', tone: 'red' };
}