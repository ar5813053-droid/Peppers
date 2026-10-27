import { CONFIG } from '../data/config.js';

const PREFIX = CONFIG.storagePrefix;

function key(name) {
  return PREFIX + name;
}

export function getItem(name, fallback = null) {
  try {
    const raw = localStorage.getItem(key(name));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setItem(name, value) {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeItem(name) {
  try {
    localStorage.removeItem(key(name));
  } catch {}
}

export function clearAllDemoData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keysToRemove.push(k);
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
