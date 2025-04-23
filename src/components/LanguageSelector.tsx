import React, { useState } from "react";
import { translateText } from "@/services/translate";

// --- Debounce utility ---
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: any[];
  const debounced = (...args: any[]) => {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...lastArgs), delay);
  };
  return debounced as T;
}

// --- Concurrency limiter ---
function createConcurrencyLimiter(max: number) {
  let active = 0;
  const queue: (() => void)[] = [];
  async function runWithLimit<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= max) {
      await new Promise<void>(resolve => queue.push(resolve));
    }
    active++;
    try {
      const result = await fn();
      return result;
    } finally {
      active--;
      if (queue.length) {
        const next = queue.shift();
        if (next) next();
      }
    }
  }
  return runWithLimit;
}
const runWithLimit = createConcurrencyLimiter(3); // Allow 3 concurrent API calls


interface LanguageSelectorProps {
  name: string;
  description: string;
  materials: string[];
  certifications: string[];
  onTranslate?: (fields: {
    name: string;
    description: string;
    materials: string[];
    certifications: string[];
  }) => void;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
  { code: "ta", label: "Tamil" },
  { code: "bn", label: "Bengali" },
  { code: "ja", label: "Japanese" },
  { code: "ar", label: "Arabic" },
  { code: "ru", label: "Russian" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ name, description, materials, certifications, onTranslate }) => {
  // Add error state
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("en");
  const [translated, setTranslated] = useState({
    name,
    description,
    materials,
    certifications,
  });
  const [loading, setLoading] = useState(false);

  // Translation cache: localStorage and in-memory
const LS_KEY = 'ecocart_translation_cache';
function getCache() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function setCache(cache: any) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cache));
  } catch {}
}
function getCachedTranslation(text: string, lang: string) {
  const cache = getCache();
  return cache[lang]?.[text];
}
function setCachedTranslation(text: string, lang: string, value: string) {
  const cache = getCache();
  if (!cache[lang]) cache[lang] = {};
  cache[lang][text] = value;
  setCache(cache);
}

const translateWithCache = async (text: string, lang: string, source?: string): Promise<string> => {
  if (!text) return '';
  const cached = getCachedTranslation(text, lang);
  if (cached) return cached;
  const result = await runWithLimit(() => translateText(text, lang, source));
  setCachedTranslation(text, lang, result);
  return result;
};

const debouncedTranslate = debounce(async (lang: string) => {
  setLoading(true);
  setError(null);
  try {
    // Only translate non-empty fields
    const [tName, tDesc, tMats, tCerts] = await Promise.all([
      name ? translateWithCache(name, lang, "en") : '',
      description ? translateWithCache(description, lang, "en") : '',
      Array.isArray(materials) && materials.length > 0 ? Promise.all(materials.map(m => m ? translateWithCache(m, lang, "en") : '')) : [],
      Array.isArray(certifications) && certifications.length > 0 ? Promise.all(certifications.map(c => c ? translateWithCache(c, lang, "en") : '')) : [],
    ]);
    setTranslated({ name: tName, description: tDesc, materials: tMats, certifications: tCerts });
    if (onTranslate) {
      onTranslate({ name: tName, description: tDesc, materials: tMats, certifications: tCerts });
    }
  } catch (err) {
    setError('Translation failed. Please try again later.');
    setTranslated({ name, description, materials, certifications });
  }
  setLoading(false);
}, 350);

const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const lang = e.target.value;
  setSelected(lang);
  if (lang === "en") {
    setTranslated({ name, description, materials, certifications });
    if (onTranslate) {
      onTranslate({ name, description, materials, certifications });
    }
    setLoading(false);
    return;
  }
  debouncedTranslate(lang);
};

  return (
    <div className="mb-2 p-3 bg-gray-50 rounded shadow-sm max-h-[180px] overflow-y-auto w-full min-w-[200px]">
      <label className="mr-2 font-medium">🌐 Language:</label>
      <select
        value={selected}
        onChange={handleChange}
        className="border rounded px-2 py-1 bg-gray-100 text-gray-900 focus:bg-white focus:border-green-500 font-medium shadow-sm"
        style={{ color: '#222', background: '#f8f9fa', fontWeight: 500 }}
      >
        {LANGUAGES.map((l) => (
          <option
            key={l.code}
            value={l.code}
            className="text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100"
            style={{ color: '#222', background: '#fff' }}
          >
            {l.label}
          </option>
        ))}
      </select>
      <div className="mt-2 text-gray-700 min-h-[2em] break-words">
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
        {loading ? (
          <span className="italic text-gray-400">Translating...</span>
        ) : (
          <>
            <div><b>Name:</b> {translated.name || '-'}</div>
            <div><b>Description:</b> {translated.description || '-'}</div>
            <div><b>Materials:</b> {Array.isArray(translated.materials) && translated.materials.length > 0 ? translated.materials.join(", ") : '-'}</div>
            <div><b>Certifications:</b> {Array.isArray(translated.certifications) && translated.certifications.length > 0 ? translated.certifications.join(", ") : '-'}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
