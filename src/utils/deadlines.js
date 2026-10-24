export function getDeadlineStatus(deadline) {
  if (!deadline) {
    return { status: 'unknown', daysRemaining: null, label: 'Date unavailable', urgency: 'gray' };
  }

  const d = new Date(deadline + 'T23:59:59');
  if (isNaN(d)) {
    return { status: 'unknown', daysRemaining: null, label: 'Date unavailable', urgency: 'gray' };
  }

  const now = new Date();
  const days = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { status: 'closed', daysRemaining: days, label: 'Closed', urgency: 'red' };
  }
  if (days <= 14) {
    return { status: 'closing-soon', daysRemaining: days, label: `${days} day${days === 1 ? '' : 's'} left`, urgency: 'red' };
  }
  if (days <= 30) {
    return { status: 'closing-soon', daysRemaining: days, label: `${days} days left`, urgency: 'amber' };
  }
  if (days <= 60) {
    return { status: 'open', daysRemaining: days, label: `${days} days left`, urgency: 'amber' };
  }
  return { status: 'open', daysRemaining: days, label: `${days} days left`, urgency: 'green' };
}

export function formatDate(iso) {
  if (!iso) return 'Date unavailable';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return 'Date unavailable';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}