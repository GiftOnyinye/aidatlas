export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

export function validateUniversity(u) {
  const errors = [];
  if (!u) {
    errors.push('University object is missing');
    return errors;
  }
  if (!u.id) errors.push('Missing id');
  if (!u.name) errors.push('Missing name');
  if (!u.country) errors.push('Missing country');
  return errors;
}

export function validateScholarship(s) {
  const errors = [];
  if (!s) {
    errors.push('Scholarship object is missing');
    return errors;
  }
  if (!s.id) errors.push('Missing id');
  if (!s.name) errors.push('Missing name');
  return errors;
}

export function safe(value, fallback) {
  if (value === null || value === undefined || value === '') {
    return fallback || 'Data unavailable';
  }
  return value;
}