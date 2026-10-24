const PREFIX = 'aidatlas:';

export const get = (key, fallback) => {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const set = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
};

export const remove = (key) => {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
};