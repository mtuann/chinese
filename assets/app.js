const DATA_FILES = {
  radicals: "./data/radicals.json",
  words: "./data/words.json",
  grammar: "./data/grammar.json",
  meta: "./data/meta.json",
};

const LEVELS = [1, 2, 3, 4, 5, 6, 7];
const STORAGE_KEY = "hsk_intensive_studio_v1";
const SRS_INTERVALS = [1, 3, 7, 14, 30, 45];
const VOCAB_PAGE_SIZE = 36;

const PRONUNCIATION_DATA = {
  tones: [
    {
      tone: "1st tone",
      mark: "ˉ",
      contour: "55 (high-level)",
      sample: "mā",
      vi: "Giữ cao và đều, không lên/xuống.",
      en: "Keep your pitch high and steady.",
    },
    {
      tone: "2nd tone",
      mark: "ˊ",
      contour: "35 (rising)",
      sample: "má",
      vi: "Đi từ trung bình lên cao, giống ngữ điệu hỏi ngắn.",
      en: "Rise from mid to high, similar to a short question intonation.",
    },
    {
      tone: "3rd tone",
      mark: "ˇ",
      contour: "214 (fall-rise)",
      sample: "mǎ",
      vi: "Rơi xuống rồi nhấc lên; trong câu nhanh thường chỉ đọc thấp.",
      en: "Falls then rises; in fast speech often realized as a low tone.",
    },
    {
      tone: "4th tone",
      mark: "ˋ",
      contour: "51 (falling)",
      sample: "mà",
      vi: "Rơi mạnh và dứt khoát từ cao xuống thấp.",
      en: "Sharp, strong fall from high to low.",
    },
    {
      tone: "Neutral tone",
      mark: "·",
      contour: "light",
      sample: "ma",
      vi: "Âm nhẹ, ngắn, phụ thuộc âm trước.",
      en: "Light and short; pitch depends on preceding syllable.",
    },
  ],
  initials: [
    { s: "b", vi: "Môi khép bật nhẹ, vô thanh", en: "Unaspirated voiceless bilabial stop", ex: "bā" },
    { s: "p", vi: "Như b nhưng bật hơi mạnh", en: "Aspirated bilabial stop", ex: "pā" },
    { s: "m", vi: "Mũi môi", en: "Bilabial nasal", ex: "mā" },
    { s: "f", vi: "Răng trên chạm môi dưới", en: "Labiodental fricative", ex: "fā" },
    { s: "d", vi: "Đầu lưỡi chạm lợi trên, không bật hơi", en: "Unaspirated alveolar stop", ex: "dā" },
    { s: "t", vi: "Như d nhưng bật hơi mạnh", en: "Aspirated alveolar stop", ex: "tā" },
    { s: "n", vi: "Âm mũi đầu lưỡi", en: "Alveolar nasal", ex: "nā" },
    { s: "l", vi: "Bên lưỡi", en: "Alveolar lateral", ex: "lā" },
    { s: "g", vi: "Cuống lưỡi, không bật hơi", en: "Unaspirated velar stop", ex: "gē" },
    { s: "k", vi: "Như g nhưng bật hơi", en: "Aspirated velar stop", ex: "kē" },
    { s: "h", vi: "Ma sát họng mềm", en: "Velar fricative", ex: "hē" },
    { s: "j", vi: "Mặt lưỡi trước, môi không tròn", en: "Alveolo-palatal (unaspirated)", ex: "jī" },
    { s: "q", vi: "Như j nhưng bật hơi mạnh", en: "Alveolo-palatal aspirated", ex: "qī" },
    { s: "x", vi: "Ma sát mặt lưỡi trước", en: "Alveolo-palatal fricative", ex: "xī" },
    { s: "zh", vi: "Uốn lưỡi sau, không bật hơi", en: "Retroflex affricate (unaspirated)", ex: "zhī" },
    { s: "ch", vi: "Như zh nhưng bật hơi", en: "Retroflex affricate (aspirated)", ex: "chī" },
    { s: "sh", vi: "Ma sát uốn lưỡi sau", en: "Retroflex fricative", ex: "shī" },
    { s: "r", vi: "Uốn lưỡi nhẹ, âm gần /ʐ/", en: "Voiced retroflex fricative/approximant", ex: "rì" },
    { s: "z", vi: "Đầu lưỡi, không bật hơi", en: "Alveolar affricate (unaspirated)", ex: "zī" },
    { s: "c", vi: "Như z nhưng bật hơi", en: "Alveolar affricate (aspirated)", ex: "cī" },
    { s: "s", vi: "Ma sát đầu lưỡi", en: "Alveolar fricative", ex: "sī" },
    { s: "y", vi: "Bán nguyên âm, thường trước i/ü", en: "Semivowel spelling initial", ex: "yī" },
    { s: "w", vi: "Bán nguyên âm, thường trước u", en: "Semivowel spelling initial", ex: "wū" },
  ],
  finals: [
    { s: "a", vi: "Mở rộng miệng", en: "Open central vowel", ex: "a" },
    { s: "o", vi: "Môi tròn vừa", en: "Mid-back rounded vowel", ex: "bo" },
    { s: "e", vi: "Âm giữa hơi lùi", en: "Mid central/back vowel", ex: "de" },
    { s: "i", vi: "Nguyên âm trước khép", en: "High front vowel", ex: "mi" },
    { s: "u", vi: "Môi tròn, lưỡi sau", en: "High back rounded vowel", ex: "du" },
    { s: "ü", vi: "Như i nhưng tròn môi", en: "High front rounded vowel", ex: "nǚ" },
    { s: "er", vi: "Âm /ɚ/ có màu r", en: "Rhotic vowel", ex: "ér" },
    { s: "ai", vi: "a -> i", en: "Diphthong a+i", ex: "hái" },
    { s: "ei", vi: "e -> i", en: "Diphthong e+i", ex: "wéi" },
    { s: "ao", vi: "a -> o/u", en: "Diphthong a+o", ex: "hǎo" },
    { s: "ou", vi: "o -> u", en: "Diphthong o+u", ex: "dōu" },
    { s: "an", vi: "a + n", en: "Front nasal ending -n", ex: "hàn" },
    { s: "en", vi: "e + n", en: "Front nasal ending -n", ex: "hěn" },
    { s: "ang", vi: "a + ng", en: "Back nasal ending -ng", ex: "máng" },
    { s: "eng", vi: "e + ng", en: "Back nasal ending -ng", ex: "néng" },
    { s: "ong", vi: "o + ng", en: "Back nasal ending -ng", ex: "dōng" },
    { s: "ia", vi: "i + a", en: "Medial i + a", ex: "jiā" },
    { s: "ie", vi: "i + e", en: "Medial i + e", ex: "xiè" },
    { s: "iao", vi: "i + ao", en: "Medial i + ao", ex: "xiǎo" },
    { s: "iu (iou)", vi: "i + ou (viết tắt iu)", en: "Contracted iou", ex: "liù" },
    { s: "ian", vi: "i + an", en: "Front nasal with i", ex: "tiān" },
    { s: "in", vi: "i + n", en: "Front nasal with i", ex: "xīn" },
    { s: "iang", vi: "i + ang", en: "Back nasal with i", ex: "liàng" },
    { s: "ing", vi: "i + ng", en: "Back nasal with i", ex: "míng" },
    { s: "iong", vi: "i + ong", en: "Back nasal with i", ex: "xiōng" },
    { s: "ua", vi: "u + a", en: "Medial u + a", ex: "huā" },
    { s: "uo", vi: "u + o", en: "Medial u + o", ex: "duō" },
    { s: "uai", vi: "u + ai", en: "Medial u + ai", ex: "kuài" },
    { s: "ui (uei)", vi: "u + ei (viết tắt ui)", en: "Contracted uei", ex: "duì" },
    { s: "uan", vi: "u + an", en: "Front nasal with u", ex: "huān" },
    { s: "un (uen)", vi: "u + en (viết tắt un)", en: "Contracted uen", ex: "lùn" },
    { s: "uang", vi: "u + ang", en: "Back nasal with u", ex: "guāng" },
    { s: "ueng", vi: "Hiếm, thường trong wēng", en: "Rare full form", ex: "wēng" },
    { s: "üe", vi: "ü + e", en: "Front rounded final", ex: "xué" },
    { s: "üan", vi: "ü + an", en: "Front rounded + nasal", ex: "juàn" },
    { s: "ün", vi: "ü + n", en: "Front rounded + nasal", ex: "yún" },
    { s: "-i (zhi/chi/shi/ri)", vi: "Âm i lưỡi cong", en: "Apical vowel after retroflex initials", ex: "shī" },
    { s: "-i (zi/ci/si)", vi: "Âm i đầu lưỡi trước", en: "Apical vowel after alveolar initials", ex: "sī" },
    { s: "erhua -r", vi: "Gắn -r ở cuối một số âm tiết", en: "Rhotic suffix in northern Mandarin", ex: "huār" },
  ],
  pairs: [
    {
      pair: "zh / z",
      vi: "zh: uốn lưỡi ra sau; z: đầu lưỡi trước, không uốn.",
      en: "zh is retroflex; z is alveolar.",
      ex: "zhī vs zī",
    },
    {
      pair: "ch / c",
      vi: "Cả hai bật hơi, nhưng ch uốn lưỡi sau hơn c.",
      en: "Both aspirated; ch is retroflex, c is alveolar.",
      ex: "chī vs cī",
    },
    {
      pair: "sh / s",
      vi: "sh ma sát khi lưỡi uốn; s ma sát phía trước.",
      en: "sh retroflex fricative vs s alveolar fricative.",
      ex: "shī vs sī",
    },
    {
      pair: "j/q/x vs zh/ch/sh",
      vi: "j/q/x đặt mặt lưỡi trước và môi không tròn; zh/ch/sh uốn lưỡi.",
      en: "j/q/x are alveolo-palatal; zh/ch/sh are retroflex.",
      ex: "jī qī xī vs zhī chī shī",
    },
    {
      pair: "n / ng ending",
      vi: "-n kết thúc trước (an/en/in/un), -ng kết thúc sau (ang/eng/ing/ong).",
      en: "-n front nasal, -ng back nasal.",
      ex: "ān vs āng",
    },
    {
      pair: "ü / u",
      vi: "ü: môi tròn nhưng lưỡi trước; u: môi tròn lưỡi sau.",
      en: "ü front rounded; u back rounded.",
      ex: "lǜ vs lù",
    },
    {
      pair: "b/p, d/t, g/k",
      vi: "Phân biệt bằng bật hơi, không phải hữu thanh-vô thanh.",
      en: "Contrast is aspiration, not voicing.",
      ex: "bā/pā, dā/tā, gē/kē",
    },
    {
      pair: "r / l",
      vi: "r tiếng Quan thoại khác r tiếng Việt; thường ma sát/tiệm cận uốn nhẹ.",
      en: "Mandarin r is a retroflex approximant/fricative, not English r.",
      ex: "rì vs lì",
    },
  ],
};

const state = {
  data: {
    radicals: [],
    wordsByLevel: {},
    allWords: [],
    grammar: [],
    meta: null,
  },
  progress: null,
  currentQuiz: null,
  currentGrammarQuiz: null,
  vocab: {
    page: 1,
    totalPages: 1,
    filteredRows: [],
    flashDeck: [],
    flashIndex: 0,
    flashBack: false,
    flashOpen: false,
  },
  timer: {
    remaining: 25 * 60,
    running: false,
    intervalId: null,
  },
  pwa: {
    deferredInstallPrompt: null,
    registration: null,
  },
  audio: {
    ttsUnavailableNotified: false,
  },
};

function defaultProgress() {
  return {
    radicals: {},
    words: {},
    grammar: {},
    quizStats: {
      correct: 0,
      wrong: 0,
    },
    dailyTargets: {
      radicals: 6,
      grammar: 6,
      words: 25,
      dictation: 25,
    },
    dailyLog: {},
    mistakes: [],
    lastActivity: null,
  };
}

function mergeWithDefaults(raw) {
  const merged = defaultProgress();
  if (!raw || typeof raw !== "object") return merged;

  merged.radicals = raw.radicals || {};
  merged.words = raw.words || {};
  merged.grammar = raw.grammar || {};
  merged.quizStats = {
    ...merged.quizStats,
    ...(raw.quizStats || {}),
  };
  merged.dailyTargets = {
    ...merged.dailyTargets,
    ...(raw.dailyTargets || {}),
  };
  merged.dailyLog = raw.dailyLog || {};
  merged.mistakes = Array.isArray(raw.mistakes) ? raw.mistakes.slice(0, 120) : [];
  merged.lastActivity = raw.lastActivity || null;
  return merged;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return mergeWithDefaults(JSON.parse(raw));
  } catch (_err) {
    return defaultProgress();
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function ensureDailyLog() {
  const key = todayKey();
  if (!state.progress.dailyLog[key]) {
    state.progress.dailyLog[key] = {
      radicals: 0,
      grammar: 0,
      words: 0,
      dictation: 0,
      minutes: 0,
    };
  }
  return state.progress.dailyLog[key];
}

function addDaily(field, amount = 1) {
  const log = ensureDailyLog();
  log[field] = Math.max(0, (log[field] || 0) + amount);
  state.progress.lastActivity = new Date().toISOString();
}

function addMistake(item) {
  state.progress.mistakes.unshift({
    ...item,
    ts: new Date().toISOString(),
  });
  state.progress.mistakes = state.progress.mistakes.slice(0, 80);
}

function showToast(text) {
  const el = document.getElementById("toast");
  el.textContent = text;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 1600);
}

function formatPct(numerator, denominator) {
  if (!denominator) return "0%";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickRandom(arr) {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function toComparable(text) {
  return (text || "")
    .toString()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[，。！？、,.!?]/g, "")
    .toLowerCase();
}

function levelLabel(level) {
  return level === 7 ? "HSK 7-9" : `HSK ${level}`;
}

function escapeHtml(text) {
  return (text ?? "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function supportsTts() {
  return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";
}

function notifyTtsUnavailable() {
  if (state.audio.ttsUnavailableNotified) return;
  state.audio.ttsUnavailableNotified = true;
  showToast("Thiết bị/trình duyệt này không hỗ trợ phát âm TTS.");
}

function pickPreferredVoice(langPrefix = "zh") {
  if (!supportsTts()) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const lower = langPrefix.toLowerCase();
  return (
    voices.find((v) => (v.lang || "").toLowerCase().startsWith(lower)) ||
    voices.find((v) => (v.lang || "").toLowerCase().startsWith("zh")) ||
    null
  );
}

function speakText(text, options = {}) {
  const content = (text || "").toString().trim();
  if (!content) return false;
  if (!supportsTts()) {
    notifyTtsUnavailable();
    return false;
  }

  const lang = options.lang || "zh-CN";
  const utter = new SpeechSynthesisUtterance(content);
  utter.lang = lang;
  utter.rate = options.rate || 0.95;
  utter.pitch = 1;
  utter.volume = 1;

  const voice = pickPreferredVoice(lang.toLowerCase().startsWith("zh") ? "zh" : lang);
  if (voice) utter.voice = voice;

  if (options.interrupt !== false) {
    window.speechSynthesis.cancel();
  }
  window.speechSynthesis.speak(utter);
  return true;
}

function speakVocabWord(word) {
  if (!word) return false;
  const text = (word.word || "").trim() || (word.pinyin || "").trim();
  return speakText(text, { lang: "zh-CN", rate: 0.9 });
}

function findWordById(wordId) {
  return allWords().find((w) => w.id === wordId) || null;
}

function fetchJson(path) {
  return fetch(path).then((r) => {
    if (!r.ok) throw new Error(`Cannot load ${path}`);
    return r.json();
  });
}

function fallbackMeta() {
  const levels = {};
  LEVELS.forEach((level) => {
    const key = String(level);
    levels[key] = {
      words: (state.data.wordsByLevel[key] || []).length,
      grammar_points: state.data.grammar.filter((g) => g.level === level).length,
      radicals_introduced: state.data.radicals.filter((r) => r.first_hsk_level === level).length,
      radicals_available_cumulative: state.data.radicals.filter(
        (r) => r.first_hsk_level !== null && r.first_hsk_level <= level
      ).length,
    };
  });

  return {
    generated_at: new Date().toISOString(),
    levels,
    totals: {
      radicals: state.data.radicals.length,
      words: allWords().length,
      grammar_points: state.data.grammar.length,
    },
  };
}

async function loadAllData() {
  const results = await Promise.allSettled([
    fetchJson(DATA_FILES.radicals),
    fetchJson(DATA_FILES.words),
    fetchJson(DATA_FILES.grammar),
    fetchJson(DATA_FILES.meta),
  ]);

  const [radicalsResult, wordsResult, grammarResult, metaResult] = results;
  const failed = [];

  if (radicalsResult.status === "fulfilled") {
    state.data.radicals = radicalsResult.value.radicals || [];
  } else {
    state.data.radicals = [];
    failed.push("radicals");
    console.error(radicalsResult.reason);
  }

  if (wordsResult.status === "fulfilled") {
    state.data.wordsByLevel = wordsResult.value.levels || {};
  } else {
    state.data.wordsByLevel = {};
    failed.push("words");
    console.error(wordsResult.reason);
  }

  state.data.allWords = LEVELS.flatMap((level) => state.data.wordsByLevel[String(level)] || []);

  if (grammarResult.status === "fulfilled") {
    state.data.grammar = grammarResult.value.points || [];
  } else {
    state.data.grammar = [];
    failed.push("grammar");
    console.error(grammarResult.reason);
  }

  if (metaResult.status === "fulfilled") {
    state.data.meta = metaResult.value || fallbackMeta();
  } else {
    state.data.meta = fallbackMeta();
    failed.push("meta");
    console.error(metaResult.reason);
  }

  if (!state.data.meta || !state.data.meta.levels) {
    state.data.meta = fallbackMeta();
  }

  return failed;
}

function setActiveTab(tab) {
  const target = document.getElementById(`tab-${tab}`) ? tab : "dashboard";
  const nav = document.getElementById("main-nav");

  nav.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === target);
  });

  document.querySelectorAll(".tab").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${target}`);
  });
}

function syncTabToUrl(tab) {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);
  window.history.replaceState({}, "", url);
}

function activateInitialTabFromUrl() {
  const url = new URL(window.location.href);
  const tab = url.searchParams.get("tab");
  if (tab) {
    setActiveTab(tab);
  }
}

function buildLevelOptions(selectEl, includeAll = true) {
  const opts = [];
  if (includeAll) {
    opts.push('<option value="all">All levels</option>');
  }
  LEVELS.forEach((level) => {
    opts.push(`<option value="${level}">${levelLabel(level)}</option>`);
  });
  selectEl.innerHTML = opts.join("");
}

function ensureReviewRecord(bucket, id) {
  if (!bucket[id]) {
    bucket[id] = {
      mastered: false,
      stage: 0,
      nextDue: null,
      lastReviewed: null,
      correct: 0,
      wrong: 0,
    };
  }
  return bucket[id];
}

function resetReviewRecord(bucket, id) {
  bucket[id] = {
    mastered: false,
    stage: 0,
    nextDue: null,
    lastReviewed: null,
    correct: 0,
    wrong: 0,
  };
}

function applyReview(record, isCorrect) {
  const now = new Date();
  if (isCorrect) {
    record.correct += 1;
    record.stage = Math.min(record.stage + 1, SRS_INTERVALS.length);
    record.mastered = record.stage >= 2;
  } else {
    record.wrong += 1;
    record.stage = Math.max(record.stage - 1, 0);
    record.mastered = false;
  }

  const dayOffset = isCorrect
    ? SRS_INTERVALS[Math.max(record.stage - 1, 0)] || 1
    : 1;

  const due = new Date(now);
  due.setDate(due.getDate() + dayOffset);
  record.nextDue = due.toISOString();
  record.lastReviewed = now.toISOString();
}

function isDue(record) {
  if (!record || !record.nextDue) return false;
  return new Date(record.nextDue).getTime() <= Date.now();
}

function streakDays() {
  const keys = Object.keys(state.progress.dailyLog).sort().reverse();
  if (!keys.length) return 0;

  let streak = 0;
  let cursor = new Date();

  for (;;) {
    const key = `${cursor.getFullYear()}-${`${cursor.getMonth() + 1}`.padStart(2, "0")}-${`${cursor.getDate()}`.padStart(2, "0")}`;
    const day = state.progress.dailyLog[key];
    if (!day) break;
    const score =
      (day.radicals || 0) +
      (day.grammar || 0) +
      (day.words || 0) +
      (day.dictation || 0) +
      (day.minutes || 0);
    if (score <= 0) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getDueItems(limit = 40) {
  const items = [];

  Object.entries(state.progress.radicals).forEach(([id, rec]) => {
    if (isDue(rec)) {
      const radical = state.data.radicals.find((r) => r.id === id);
      if (radical) {
        items.push({
          type: "radical",
          id,
          label: `${radical.ideograph} (${id})`,
          due: rec.nextDue,
        });
      }
    }
  });

  Object.entries(state.progress.grammar).forEach(([id, rec]) => {
    if (isDue(rec)) {
      const grammar = state.data.grammar.find((g) => g.id === id);
      if (grammar) {
        items.push({
          type: "grammar",
          id,
          label: `${grammar.code} ${grammar.title}`,
          due: rec.nextDue,
        });
      }
    }
  });

  Object.entries(state.progress.words).forEach(([id, rec]) => {
    if (isDue(rec)) {
      const word = allWords().find((w) => w.id === id);
      if (word) {
        items.push({
          type: "word",
          id,
          label: `${word.word} (${word.pinyin || "-"})`,
          due: rec.nextDue,
        });
      }
    }
  });

  items.sort((a, b) => new Date(a.due) - new Date(b.due));
  return items.slice(0, limit);
}

function radicalMasteredCount() {
  return Object.values(state.progress.radicals).filter((rec) => rec.mastered).length;
}

function grammarMasteredCount() {
  return Object.values(state.progress.grammar).filter((rec) => rec.mastered).length;
}

function wordMasteredCount() {
  return Object.values(state.progress.words).filter((rec) => rec.mastered).length;
}

function allWords() {
  return state.data.allWords || [];
}

function renderDashboard() {
  const stats = document.getElementById("dashboard-stats");
  const totalRadicals = state.data.radicals.length;
  const totalWords = allWords().length;
  const totalGrammar = state.data.grammar.length;
  const masteredRadicals = radicalMasteredCount();
  const masteredWords = wordMasteredCount();
  const masteredGrammar = grammarMasteredCount();
  const quizCorrect = state.progress.quizStats.correct || 0;
  const quizWrong = state.progress.quizStats.wrong || 0;
  const dueItems = getDueItems();

  stats.innerHTML = `
    <div class="stat-card">
      <div class="label">Radicals Mastered</div>
      <div class="value">${masteredRadicals}/${totalRadicals}</div>
      <div class="muted">${formatPct(masteredRadicals, totalRadicals)}</div>
    </div>
    <div class="stat-card">
      <div class="label">Grammar Mastered</div>
      <div class="value">${masteredGrammar}/${totalGrammar}</div>
      <div class="muted">${formatPct(masteredGrammar, totalGrammar)}</div>
    </div>
    <div class="stat-card">
      <div class="label">Words Mastered</div>
      <div class="value">${masteredWords}/${totalWords}</div>
      <div class="muted">${formatPct(masteredWords, totalWords)}</div>
    </div>
    <div class="stat-card">
      <div class="label">Quiz Accuracy</div>
      <div class="value">${formatPct(quizCorrect, quizCorrect + quizWrong)}</div>
      <div class="muted">${quizCorrect} correct / ${quizWrong} wrong</div>
    </div>
    <div class="stat-card">
      <div class="label">Current Streak</div>
      <div class="value">${streakDays()} days</div>
      <div class="muted">Keep daily consistency.</div>
    </div>
    <div class="stat-card">
      <div class="label">Due Reviews</div>
      <div class="value">${dueItems.length}</div>
      <div class="muted">Ready to review now.</div>
    </div>
  `;

  const levelGrid = document.getElementById("level-progress-grid");
  levelGrid.innerHTML = "";

  LEVELS.forEach((level) => {
    const key = String(level);
    const levelMeta = state.data.meta?.levels?.[key] || {
      words: (state.data.wordsByLevel[key] || []).length,
      grammar_points: state.data.grammar.filter((g) => g.level === level).length,
      radicals_introduced: state.data.radicals.filter((r) => r.first_hsk_level === level).length,
      radicals_available_cumulative: state.data.radicals.filter(
        (r) => r.first_hsk_level !== null && r.first_hsk_level <= level
      ).length,
    };

    const availableRadicals = state.data.radicals.filter(
      (r) => r.first_hsk_level !== null && r.first_hsk_level <= level
    );
    const masteredRadicalsAtLevel = availableRadicals.filter((r) => {
      const rec = state.progress.radicals[r.id];
      return rec && rec.mastered;
    }).length;

    const grammarPool = state.data.grammar.filter((g) => g.level <= level);
    const masteredGrammarAtLevel = grammarPool.filter((g) => {
      const rec = state.progress.grammar[g.id];
      return rec && rec.mastered;
    }).length;
    const wordsPool = state.data.wordsByLevel[key] || [];
    const masteredWordsAtLevel = wordsPool.filter((w) => {
      const rec = state.progress.words[w.id];
      return rec && rec.mastered;
    }).length;

    const card = document.createElement("article");
    card.className = "level-card";
    card.innerHTML = `
      <h4>${levelLabel(level)}</h4>
      <div class="small-row"><span>Words:</span><strong>${levelMeta.words}</strong></div>
      <div class="small-row"><span>Grammar points:</span><strong>${levelMeta.grammar_points}</strong></div>
      <div class="small-row"><span>Radicals introduced:</span><strong>${levelMeta.radicals_introduced}</strong></div>
      <div class="small-row"><span>Radicals mastered:</span><strong>${masteredRadicalsAtLevel}/${availableRadicals.length}</strong></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${formatPct(masteredRadicalsAtLevel, Math.max(availableRadicals.length, 1))}"></div></div>
      <div class="small-row"><span>Words mastered:</span><strong>${masteredWordsAtLevel}/${wordsPool.length}</strong></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${formatPct(masteredWordsAtLevel, Math.max(wordsPool.length, 1))}"></div></div>
      <div class="small-row"><span>Grammar mastered:</span><strong>${masteredGrammarAtLevel}/${grammarPool.length}</strong></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${formatPct(masteredGrammarAtLevel, Math.max(grammarPool.length, 1))}"></div></div>
    `;
    levelGrid.appendChild(card);
  });

  const dueList = document.getElementById("due-list");
  if (!dueItems.length) {
    dueList.innerHTML = '<p class="muted">No due items. Keep learning new content.</p>';
  } else {
    dueList.innerHTML = dueItems
      .slice(0, 14)
      .map(
        (item) => `
        <div class="due-item">
          <span>${
            item.type === "radical" ? "Radical" : item.type === "grammar" ? "Grammar" : "Word"
          }: ${item.label}</span>
          <span class="muted">${new Date(item.due).toLocaleDateString()}</span>
        </div>
      `
      )
      .join("");
  }
}

function findExamplesForLevel(radical, selectedLevel) {
  const examples = radical.examples_by_level || {};
  if (selectedLevel !== "all") {
    const direct = examples[selectedLevel] || [];
    if (direct.length) return direct.slice(0, 3);
  }

  if (radical.first_hsk_level !== null) {
    const first = String(radical.first_hsk_level);
    if ((examples[first] || []).length) {
      return examples[first].slice(0, 3);
    }
  }

  for (const lv of LEVELS.map(String)) {
    if ((examples[lv] || []).length) return examples[lv].slice(0, 3);
  }
  return [];
}

function renderRadicals() {
  const level = document.getElementById("radical-level-filter").value;
  const mode = document.getElementById("radical-view-mode").value;
  const search = document.getElementById("radical-search").value.trim().toLowerCase();
  const onlyDue = document.getElementById("radical-only-due").checked;

  let radicals = [...state.data.radicals];

  if (level !== "all") {
    const lv = Number(level);
    if (mode === "introduced") {
      radicals = radicals.filter((r) => r.first_hsk_level === lv);
    } else if (mode === "upto") {
      radicals = radicals.filter(
        (r) => r.first_hsk_level !== null && r.first_hsk_level <= lv
      );
    }
  }

  if (search) {
    radicals = radicals.filter((r) => {
      const hay = [r.id, r.ideograph, r.symbol, r.definition, r.pinyin, r.name]
        .join(" ")
        .toLowerCase();
      return hay.includes(search);
    });
  }

  if (onlyDue) {
    radicals = radicals.filter((r) => {
      const rec = state.progress.radicals[r.id];
      return isDue(rec);
    });
  }

  const grid = document.getElementById("radical-grid");
  const info = document.getElementById("radical-result-info");
  info.textContent = `${radicals.length} radicals shown.`;

  grid.innerHTML = "";

  radicals.forEach((radical) => {
    const rec = state.progress.radicals[radical.id] || null;
    const examples = findExamplesForLevel(radical, level);

    const card = document.createElement("article");
    card.className = "radical-card";
    card.innerHTML = `
      <div class="radical-head">
        <div>
          <div class="radical-title">${radical.ideograph}</div>
          <div class="radical-meta">No.${radical.id}${radical.symbol !== radical.ideograph ? ` · ${radical.symbol}` : ""}</div>
        </div>
        <div class="radical-symbol">${radical.ideograph}</div>
      </div>
      <div class="radical-meta">${radical.pinyin || "-"} · ${radical.definition || "(no definition)"}</div>
      <div class="radical-meta">Strokes: ${radical.strokes || "-"} · First seen: ${radical.first_hsk_level ? levelLabel(radical.first_hsk_level) : "Not in HSK list"}</div>
      ${
        examples.length
          ? `<ul class="examples">${examples
              .map((ex) => `<li>${ex.word} (${ex.pinyin})</li>`)
              .join("")}</ul>`
          : '<p class="muted">No sample word for this filter.</p>'
      }
      <div class="card-actions">
        <button class="btn btn-small" data-action="toggle-mastered" data-id="${radical.id}">
          ${rec && rec.mastered ? "Unmark mastered" : "Mark mastered"}
        </button>
        <button class="btn btn-secondary btn-small" data-action="review-correct" data-id="${radical.id}">+1 review</button>
      </div>
      <div class="radical-meta">${
        rec
          ? `Stage ${rec.stage} · due ${rec.nextDue ? new Date(rec.nextDue).toLocaleDateString() : "-"}`
          : "Not tracked yet"
      }</div>
    `;

    grid.appendChild(card);
  });
}

function getWordsForFilters(levelValue, radicalFilter) {
  let pool = [];
  if (levelValue === "all") {
    LEVELS.forEach((lv) => {
      pool = pool.concat(state.data.wordsByLevel[String(lv)] || []);
    });
  } else {
    pool = [...(state.data.wordsByLevel[levelValue] || [])];
  }

  if (radicalFilter !== "all") {
    pool = pool.filter((w) => (w.radical_ids || []).includes(radicalFilter));
  }

  return pool;
}

function getWordsByLevelAndMode(levelValue, mode) {
  if (levelValue === "all") {
    return [...allWords()];
  }

  const lv = Number(levelValue);
  if (mode === "upto") {
    let out = [];
    LEVELS.filter((x) => x <= lv).forEach((x) => {
      out = out.concat(state.data.wordsByLevel[String(x)] || []);
    });
    return out;
  }
  return [...(state.data.wordsByLevel[String(lv)] || [])];
}

function getRadicalIdeographById(id) {
  const r = state.data.radicals.find((x) => x.id === id);
  return r ? r.ideograph : id;
}

function refreshVocabRadicalFilter() {
  const level = document.getElementById("vocab-level-filter").value;
  const mode = document.getElementById("vocab-level-mode").value;
  const select = document.getElementById("vocab-radical-filter");
  const previous = select.value || "all";
  const pool = getWordsByLevelAndMode(level, mode);

  const used = new Set();
  pool.forEach((w) => (w.radical_ids || []).forEach((rid) => used.add(rid)));
  const options = ['<option value="all">All radicals</option>'];
  [...used]
    .sort((a, b) => a.localeCompare(b, "en"))
    .forEach((rid) => {
      options.push(`<option value="${rid}">${getRadicalIdeographById(rid)} · No.${rid}</option>`);
    });
  select.innerHTML = options.join("");
  const optionExists = [...select.options].some((o) => o.value === previous);
  select.value = optionExists ? previous : "all";
}

function getVocabColumnFilters() {
  const toNumberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };

  return {
    word: document.getElementById("vocab-col-word").value.trim().toLowerCase(),
    pinyin: document.getElementById("vocab-col-pinyin").value.trim().toLowerCase(),
    meaning: document.getElementById("vocab-col-meaning").value.trim().toLowerCase(),
    level: document.getElementById("vocab-col-level").value,
    freqMin: toNumberOrNull(document.getElementById("vocab-col-freq-min").value),
    freqMax: toNumberOrNull(document.getElementById("vocab-col-freq-max").value),
    radical: document.getElementById("vocab-col-radical").value.trim().toLowerCase(),
    mastered: document.getElementById("vocab-col-mastered").value,
  };
}

function clearVocabColumnFilters() {
  [
    "vocab-col-word",
    "vocab-col-pinyin",
    "vocab-col-meaning",
    "vocab-col-freq-min",
    "vocab-col-freq-max",
    "vocab-col-radical",
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("vocab-col-level").value = "all";
  document.getElementById("vocab-col-mastered").value = "all";
}

function applyVocabColumnFilters(rows, filters) {
  return rows.filter((w) => {
    const wordText = (w.word || "").toLowerCase();
    const pinyinText = (w.pinyin || "").toLowerCase();
    const meaningText = (w.meaning || "").toLowerCase();
    const levelValue = String(w.level || "");
    const freqValue = Number(w.frequency || 0);
    const radicalIds = w.radical_ids || [];
    const radicalText = radicalIds
      .map((rid) => `${getRadicalIdeographById(rid)} ${rid}`)
      .join(" ")
      .toLowerCase();
    const rec = state.progress.words[w.id];
    const isMastered = Boolean(rec && rec.mastered);

    if (filters.word && !wordText.includes(filters.word)) return false;
    if (filters.pinyin && !pinyinText.includes(filters.pinyin)) return false;
    if (filters.meaning && !meaningText.includes(filters.meaning)) return false;
    if (filters.level !== "all" && levelValue !== filters.level) return false;
    if (filters.freqMin !== null && freqValue < filters.freqMin) return false;
    if (filters.freqMax !== null && freqValue > filters.freqMax) return false;
    if (filters.radical && !radicalText.includes(filters.radical)) return false;
    if (filters.mastered === "yes" && !isMastered) return false;
    if (filters.mastered === "no" && isMastered) return false;
    return true;
  });
}

function syncFlashDeckWithVocabulary(rows) {
  if (!state.vocab.flashOpen) {
    return;
  }

  const byId = new Map(rows.map((w) => [w.id, w]));
  const syncedDeck = state.vocab.flashDeck
    .map((w) => byId.get(w.id))
    .filter(Boolean);

  if (syncedDeck.length) {
    state.vocab.flashDeck = syncedDeck;
  } else {
    state.vocab.flashDeck = [...rows];
    state.vocab.flashIndex = 0;
    state.vocab.flashBack = false;
  }

  if (state.vocab.flashDeck.length === 0) {
    state.vocab.flashIndex = 0;
    state.vocab.flashBack = false;
  } else {
    state.vocab.flashIndex = Math.min(state.vocab.flashIndex, state.vocab.flashDeck.length - 1);
  }
}

function getCurrentFlashWord() {
  if (!state.vocab.flashDeck.length) return null;
  return state.vocab.flashDeck[state.vocab.flashIndex] || null;
}

function isVocabAutoSpeakEnabled() {
  const checkbox = document.getElementById("vocab-audio-auto");
  return Boolean(checkbox && checkbox.checked);
}

function replayFlashcardAudio() {
  const current = getCurrentFlashWord();
  if (!current) return false;
  return speakVocabWord(current);
}

function autoSpeakFlashcard() {
  if (!isVocabAutoSpeakEnabled()) return;
  replayFlashcardAudio();
}

function openVocabFlashcards() {
  if (!state.vocab.filteredRows.length) {
    showToast("No words to build flashcards for this filter.");
    return;
  }
  state.vocab.flashDeck = [...state.vocab.filteredRows];
  state.vocab.flashIndex = 0;
  state.vocab.flashBack = false;
  state.vocab.flashOpen = true;
  renderVocabFlashcard();
  document.getElementById("vocab-flash-card").focus();
  autoSpeakFlashcard();
}

function closeVocabFlashcards() {
  state.vocab.flashOpen = false;
  if (supportsTts()) {
    window.speechSynthesis.cancel();
  }
  renderVocabFlashcard();
}

function flipVocabFlashcard() {
  if (!state.vocab.flashOpen) return;
  state.vocab.flashBack = !state.vocab.flashBack;
  renderVocabFlashcard();
}

function moveVocabFlashcard(step) {
  if (!state.vocab.flashOpen || !state.vocab.flashDeck.length) return;
  const maxIndex = state.vocab.flashDeck.length - 1;
  state.vocab.flashIndex = Math.min(maxIndex, Math.max(0, state.vocab.flashIndex + step));
  state.vocab.flashBack = false;
  renderVocabFlashcard();
  autoSpeakFlashcard();
}

function shuffleVocabFlashDeck() {
  if (!state.vocab.flashDeck.length) return;
  state.vocab.flashDeck = shuffle(state.vocab.flashDeck);
  state.vocab.flashIndex = 0;
  state.vocab.flashBack = false;
  renderVocabFlashcard();
  autoSpeakFlashcard();
}

function toggleCurrentFlashWordMastery() {
  const current = getCurrentFlashWord();
  if (!current) return;
  const rec = state.progress.words[current.id];
  toggleVocabMastery(current.id, !(rec && rec.mastered));
}

function renderVocabFlashcard() {
  const modal = document.getElementById("vocab-flash-modal");
  const startBtn = document.getElementById("vocab-flash-start");
  const cardBtn = document.getElementById("vocab-flash-card");
  const meta = document.getElementById("vocab-flash-meta");
  const front = document.getElementById("vocab-flash-front");
  const back = document.getElementById("vocab-flash-back");
  const masteredBtn = document.getElementById("vocab-flash-mastered");
  const replayBtn = document.getElementById("vocab-flash-replay");
  const showPinyin = document.getElementById("vocab-show-pinyin").checked;

  startBtn.textContent = state.vocab.flashOpen ? "Restart Flashcards" : "Start Flashcards";
  modal.classList.toggle("hidden", !state.vocab.flashOpen);
  document.body.classList.toggle("flash-modal-open", state.vocab.flashOpen);
  if (!state.vocab.flashOpen) {
    return;
  }

  const current = getCurrentFlashWord();
  if (!current) {
    meta.textContent = "Card 0 / 0";
    front.textContent = "No cards for current filters.";
    back.innerHTML = "<div class=\"muted\">Try adjusting filters.</div>";
    cardBtn.classList.remove("is-flipped");
    masteredBtn.disabled = true;
    replayBtn.disabled = true;
    document.getElementById("vocab-flash-prev").disabled = true;
    document.getElementById("vocab-flash-next").disabled = true;
    return;
  }

  const radicals = (current.radical_ids || [])
    .map((rid) => `${getRadicalIdeographById(rid)} (No.${rid})`)
    .join(" ");
  const rec = state.progress.words[current.id];
  const mastered = Boolean(rec && rec.mastered);

  meta.textContent = `Card ${state.vocab.flashIndex + 1} / ${state.vocab.flashDeck.length}`;
  front.textContent = current.word || "-";
  back.innerHTML = `
    <div class="flash-back-word">${escapeHtml(current.word || "-")}</div>
    <div><strong>Pinyin:</strong> ${showPinyin ? escapeHtml(current.pinyin || "-") : "<span class=\"muted\">Hidden</span>"}</div>
    <div><strong>Meaning:</strong> ${escapeHtml(current.meaning || "-")}</div>
    <div><strong>Level:</strong> ${current.level ? escapeHtml(levelLabel(current.level)) : "-"}</div>
    <div><strong>Frequency:</strong> ${escapeHtml(current.frequency || "-")}</div>
    <div><strong>Radicals:</strong> ${escapeHtml(radicals || "-")}</div>
  `;
  cardBtn.classList.toggle("is-flipped", state.vocab.flashBack);
  masteredBtn.disabled = false;
  replayBtn.disabled = !supportsTts();
  masteredBtn.textContent = mastered ? "Unmark mastered" : "Mark mastered";
  document.getElementById("vocab-flash-prev").disabled = state.vocab.flashIndex <= 0;
  document.getElementById("vocab-flash-next").disabled =
    state.vocab.flashIndex >= state.vocab.flashDeck.length - 1;
}

function renderVocabulary(resetPage = false) {
  const level = document.getElementById("vocab-level-filter").value;
  const mode = document.getElementById("vocab-level-mode").value;
  const radical = document.getElementById("vocab-radical-filter").value;
  const search = document.getElementById("vocab-search").value.trim().toLowerCase();
  const showPinyin = document.getElementById("vocab-show-pinyin").checked;
  const onlyUnlearned = document.getElementById("vocab-only-unlearned").checked;
  const columnFilters = getVocabColumnFilters();

  let rows = getWordsByLevelAndMode(level, mode);
  if (radical !== "all") {
    rows = rows.filter((w) => (w.radical_ids || []).includes(radical));
  }

  if (search) {
    rows = rows.filter((w) => {
      const hay = [w.word, w.pinyin, w.meaning, ...(w.radical_ids || [])].join(" ").toLowerCase();
      return hay.includes(search);
    });
  }

  if (onlyUnlearned) {
    rows = rows.filter((w) => !(state.progress.words[w.id] && state.progress.words[w.id].mastered));
  }

  rows = applyVocabColumnFilters(rows, columnFilters);

  rows = rows.sort((a, b) => {
    const aLevel = Number(a.level || 0);
    const bLevel = Number(b.level || 0);
    if (aLevel !== bLevel) return aLevel - bLevel;

    const aFreq = Number.isFinite(Number(a.frequency)) ? Number(a.frequency) : Number.MAX_SAFE_INTEGER;
    const bFreq = Number.isFinite(Number(b.frequency)) ? Number(b.frequency) : Number.MAX_SAFE_INTEGER;
    if (aFreq !== bFreq) return aFreq - bFreq;

    const aWord = (a.word || "").toString();
    const bWord = (b.word || "").toString();
    return aWord.localeCompare(bWord, "zh");
  });
  state.vocab.filteredRows = rows;
  syncFlashDeckWithVocabulary(rows);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / VOCAB_PAGE_SIZE));
  if (resetPage) {
    state.vocab.page = 1;
  } else {
    state.vocab.page = Math.min(Math.max(1, state.vocab.page), totalPages);
  }
  state.vocab.totalPages = totalPages;

  const from = (state.vocab.page - 1) * VOCAB_PAGE_SIZE;
  const to = from + VOCAB_PAGE_SIZE;
  const pageRows = rows.slice(from, to);

  const info = document.getElementById("vocab-result-info");
  info.textContent = total
    ? `${total} words found. Showing ${from + 1}-${Math.min(to, total)}.`
    : "0 words found.";

  document.getElementById("vocab-flash-start").disabled = total === 0;

  const list = document.getElementById("vocab-list");
  if (!pageRows.length) {
    list.innerHTML = '<tr><td colspan="7" class="muted">No vocabulary in this filter.</td></tr>';
  } else {
    list.innerHTML = pageRows
      .map((w) => {
        const rec = state.progress.words[w.id];
        const radicals = (w.radical_ids || [])
          .map((rid) => `${getRadicalIdeographById(rid)} (${rid})`)
          .join(" ");
        const pinyin = showPinyin ? escapeHtml(w.pinyin || "-") : '<span class="muted">Hidden</span>';
        return `
          <tr>
            <td class="vocab-cell-word">
              <div class="vocab-word-line">
                <span>${escapeHtml(w.word || "-")}</span>
                <button
                  class="btn btn-secondary btn-small vocab-audio-btn"
                  type="button"
                  data-vocab-audio-id="${w.id}"
                  ${supportsTts() ? "" : "disabled"}
                  title="Play audio"
                >
                  Audio
                </button>
              </div>
            </td>
            <td class="vocab-cell-pinyin">${pinyin}</td>
            <td>${escapeHtml(w.meaning || "-")}</td>
            <td>${escapeHtml(levelLabel(w.level || 0))}</td>
            <td>${escapeHtml(w.frequency || "-")}</td>
            <td class="vocab-cell-radicals">${escapeHtml(radicals || "-")}</td>
            <td class="vocab-cell-mastered">
              <label class="checkbox-line">
                <input type="checkbox" data-vocab-id="${w.id}" ${rec && rec.mastered ? "checked" : ""} />
                ${rec && rec.mastered ? "Yes" : "No"}
              </label>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  document.getElementById("vocab-page-info").textContent = `Page ${state.vocab.page} / ${totalPages}`;
  document.getElementById("vocab-prev-page").disabled = state.vocab.page <= 1;
  document.getElementById("vocab-next-page").disabled = state.vocab.page >= totalPages;
  renderVocabFlashcard();
}

function toggleVocabMastery(wordId, checked) {
  if (checked) {
    const rec = ensureReviewRecord(state.progress.words, wordId);
    applyReview(rec, true);
    rec.mastered = true;
    addDaily("words", 1);
  } else {
    resetReviewRecord(state.progress.words, wordId);
  }
  saveProgress();
  renderVocabulary();
  renderDashboard();
  renderIntensive();
}

function renderPronunciation() {
  const section = document.getElementById("pron-section-filter").value;
  const search = document.getElementById("pron-search").value.trim().toLowerCase();

  const renderList = (containerId, items, mapper, sectionName) => {
    const wrap = document.getElementById(containerId);
    const cardWrap = document.getElementById(`${containerId.replace("-list", "-wrap")}`);

    const visibleBySection = section === "all" || section === sectionName;
    cardWrap.classList.toggle("hidden", !visibleBySection);
    if (!visibleBySection) {
      return;
    }

    const filtered = items.filter((item) => {
      if (!search) return true;
      return mapper(item).toLowerCase().includes(search);
    });

    if (!filtered.length) {
      wrap.innerHTML = '<p class="muted">No match in this section.</p>';
      return;
    }

    wrap.innerHTML = filtered
      .map((item) => {
        if (sectionName === "tones") {
          return `
            <div class="pron-item">
              <div class="pron-title">${item.tone} (${item.mark}) · ${item.sample}</div>
              <div class="pron-sub">${item.contour}</div>
              <div class="muted">VI: ${item.vi}</div>
              <div class="muted">EN: ${item.en}</div>
            </div>
          `;
        }
        if (sectionName === "pairs") {
          return `
            <div class="pron-item">
              <div class="pron-title">${item.pair} · ${item.ex}</div>
              <div class="muted">VI: ${item.vi}</div>
              <div class="muted">EN: ${item.en}</div>
            </div>
          `;
        }
        return `
          <div class="pron-item">
            <div class="pron-title">${item.s} · ${item.ex}</div>
            <div class="muted">VI: ${item.vi}</div>
            <div class="muted">EN: ${item.en}</div>
          </div>
        `;
      })
      .join("");
  };

  renderList(
    "pron-tones-list",
    PRONUNCIATION_DATA.tones,
    (x) => `${x.tone} ${x.mark} ${x.sample} ${x.contour} ${x.vi} ${x.en}`,
    "tones"
  );
  renderList(
    "pron-initials-list",
    PRONUNCIATION_DATA.initials,
    (x) => `${x.s} ${x.ex} ${x.vi} ${x.en}`,
    "initials"
  );
  renderList(
    "pron-finals-list",
    PRONUNCIATION_DATA.finals,
    (x) => `${x.s} ${x.ex} ${x.vi} ${x.en}`,
    "finals"
  );
  renderList(
    "pron-pairs-list",
    PRONUNCIATION_DATA.pairs,
    (x) => `${x.pair} ${x.ex} ${x.vi} ${x.en}`,
    "pairs"
  );
}

function getRadicalPoolForLevel(levelValue) {
  if (levelValue === "all") {
    return state.data.radicals.filter((r) => r.first_hsk_level !== null);
  }
  const lv = Number(levelValue);
  return state.data.radicals.filter(
    (r) => r.first_hsk_level !== null && r.first_hsk_level <= lv
  );
}

function refreshQuizRadicalFilter() {
  const level = document.getElementById("quiz-level").value;
  const select = document.getElementById("quiz-radical-filter");
  const previous = select.value || "all";

  const pool = getRadicalPoolForLevel(level);
  const opts = ['<option value="all">All radicals</option>'];
  pool.forEach((r) => {
    opts.push(
      `<option value="${r.id}">${r.ideograph} · ${r.id} · ${r.definition || ""}</option>`
    );
  });
  select.innerHTML = opts.join("");
  const optionExists = [...select.options].some((o) => o.value === previous);
  select.value = optionExists ? previous : "all";
}

function updateQuizScoreline() {
  const el = document.getElementById("quiz-scoreline");
  el.textContent = `Correct ${state.progress.quizStats.correct} | Wrong ${state.progress.quizStats.wrong}`;
}

function setFeedbackState(el, correct, text) {
  el.textContent = text;
  el.className = "quiz-feedback";
  el.classList.add(correct ? "feedback-ok" : "feedback-warn");
}

function markChoiceButtons(containerSelector, optionAttr, correctValue, selectedValue) {
  const buttons = [...document.querySelectorAll(`${containerSelector} button[${optionAttr}]`)];
  buttons.forEach((btn) => {
    const value = btn.getAttribute(optionAttr);
    btn.disabled = true;
    btn.classList.remove("answer-correct", "answer-wrong");

    if (value === String(correctValue)) {
      btn.classList.add("answer-correct");
    } else if (value === String(selectedValue)) {
      btn.classList.add("answer-wrong");
    }
  });
}

function renderQuizQuestion() {
  const wrap = document.getElementById("quiz-question-wrap");
  const q = state.currentQuiz;
  if (!q) {
    wrap.classList.add("hidden");
    return;
  }

  wrap.classList.remove("hidden");
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const inputWrap = document.getElementById("quiz-input-wrap");
  const feedbackEl = document.getElementById("quiz-feedback");
  const nextBtn = document.getElementById("quiz-next");
  const answerInput = document.getElementById("quiz-answer-input");

  feedbackEl.textContent = "";
  feedbackEl.className = "quiz-feedback";
  nextBtn.classList.add("hidden");

  if (q.mode === "radical-mc") {
    questionEl.innerHTML = `What is the meaning of radical <strong class="radical-title">${q.radical.ideograph}</strong> (No.${q.radical.id})?`;
    optionsEl.innerHTML = "";
    inputWrap.classList.add("hidden");
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-secondary";
      btn.dataset.option = opt.id;
      btn.textContent = `${opt.definition || "(no definition)"} · ${opt.pinyin || ""}`;
      optionsEl.appendChild(btn);
    });
  } else if (q.mode === "radical-dictation") {
    questionEl.innerHTML = `Type the radical for: <strong>${q.radical.definition || "(definition missing)"}</strong><br/><span class="muted">Hint pinyin: ${q.radical.pinyin || "-"}; Level: ${q.radical.first_hsk_level ? levelLabel(q.radical.first_hsk_level) : "N/A"}</span>`;
    optionsEl.innerHTML = "";
    inputWrap.classList.remove("hidden");
    answerInput.value = "";
    answerInput.focus();
  } else {
    const radHint = (q.word.radical_ids || [])
      .slice(0, 3)
      .map((rid) => {
        const r = state.data.radicals.find((x) => x.id === rid);
        return r ? r.ideograph : rid;
      })
      .join(" ");

    questionEl.innerHTML = `Dictation: <strong>${q.word.pinyin || "(no pinyin)"}</strong><br/><span class="muted">Meaning: ${q.word.meaning || "-"}; HSK ${q.word.level}; radicals: ${radHint || "-"}</span>`;
    optionsEl.innerHTML = "";
    inputWrap.classList.remove("hidden");
    answerInput.value = "";
    answerInput.focus();
  }
}

function newQuizQuestion() {
  const mode = document.getElementById("quiz-mode").value;
  const level = document.getElementById("quiz-level").value;
  const radicalFilter = document.getElementById("quiz-radical-filter").value;

  if (mode === "radical-mc") {
    const pool = getRadicalPoolForLevel(level);
    if (pool.length < 4) {
      showToast("Not enough radicals in this filter.");
      return;
    }
    const radical = pickRandom(pool);
    const distractors = shuffle(pool.filter((x) => x.id !== radical.id)).slice(0, 3);
    const options = shuffle([radical, ...distractors]);
    state.currentQuiz = { mode, radical, options, answered: false };
  } else if (mode === "radical-dictation") {
    const pool = getRadicalPoolForLevel(level);
    if (!pool.length) {
      showToast("No radicals available for this filter.");
      return;
    }
    const radical = pickRandom(pool);
    state.currentQuiz = { mode, radical, answered: false };
  } else {
    const pool = getWordsForFilters(level, radicalFilter);
    if (!pool.length) {
      showToast("No words for this level/radical filter.");
      return;
    }
    const word = pickRandom(pool);
    state.currentQuiz = { mode, word, answered: false };
  }

  renderQuizQuestion();
}

function registerQuizResult(correct, payload) {
  if (correct) {
    state.progress.quizStats.correct += 1;
    addDaily("dictation", 1);
  } else {
    state.progress.quizStats.wrong += 1;
    addMistake(payload);
  }

  saveProgress();
  updateQuizScoreline();
  renderDashboard();
  renderIntensive();
}

function handleOptionAnswer(optionId) {
  const q = state.currentQuiz;
  if (!q || q.mode !== "radical-mc" || q.answered) return;

  q.answered = true;
  const correct = optionId === q.radical.id;
  const feedbackEl = document.getElementById("quiz-feedback");
  const nextBtn = document.getElementById("quiz-next");

  const rec = ensureReviewRecord(state.progress.radicals, q.radical.id);
  applyReview(rec, correct);

  setFeedbackState(
    feedbackEl,
    correct,
    correct
      ? `Correct. ${q.radical.ideograph} means: ${q.radical.definition || "-"}`
      : `Wrong. Correct answer: ${q.radical.definition || "-"}`
  );
  markChoiceButtons("#quiz-options", "data-option", q.radical.id, optionId);

  registerQuizResult(correct, {
    type: "radical-mc",
    prompt: `${q.radical.ideograph} meaning`,
    expected: q.radical.definition,
    user: optionId,
  });

  nextBtn.classList.remove("hidden");
  renderRadicals();
}

function handleTextAnswer() {
  const q = state.currentQuiz;
  if (!q || q.answered) return;

  const input = document.getElementById("quiz-answer-input");
  const user = input.value.trim();
  if (!user) return;

  const feedbackEl = document.getElementById("quiz-feedback");
  const nextBtn = document.getElementById("quiz-next");

  let correct = false;
  let expected = "";

  if (q.mode === "radical-dictation") {
    q.answered = true;
    const validAnswers = new Set([q.radical.ideograph, q.radical.symbol]);
    correct = validAnswers.has(user);
    expected = q.radical.ideograph;

    const rec = ensureReviewRecord(state.progress.radicals, q.radical.id);
    applyReview(rec, correct);

    setFeedbackState(
      feedbackEl,
      correct,
      correct ? `Correct: ${q.radical.ideograph}` : `Wrong. Correct radical: ${q.radical.ideograph}`
    );

    registerQuizResult(correct, {
      type: "radical-dictation",
      prompt: q.radical.definition,
      expected,
      user,
    });
  } else if (q.mode === "word-dictation") {
    q.answered = true;
    expected = q.word.word;
    correct = toComparable(user) === toComparable(expected);

    const wordRec = ensureReviewRecord(state.progress.words, q.word.id);
    applyReview(wordRec, correct);
    if (correct && wordRec.stage >= 2) {
      wordRec.mastered = true;
      addDaily("words", 1);
    }

    (q.word.radical_ids || []).forEach((rid) => {
      const rec = ensureReviewRecord(state.progress.radicals, rid);
      applyReview(rec, correct);
    });

    setFeedbackState(
      feedbackEl,
      correct,
      correct ? `Correct: ${q.word.word}` : `Wrong. Correct word: ${q.word.word}`
    );

    registerQuizResult(correct, {
      type: "word-dictation",
      prompt: `${q.word.pinyin} / ${q.word.meaning}`,
      expected,
      user,
    });
  }

  nextBtn.classList.remove("hidden");
  renderRadicals();
}

function renderGrammar() {
  const level = document.getElementById("grammar-level-filter").value;
  const mode = document.getElementById("grammar-level-mode").value;
  const search = document.getElementById("grammar-search").value.trim().toLowerCase();
  const onlyUnlearned = document.getElementById("grammar-only-unlearned").checked;
  const showPinyin = document.getElementById("grammar-show-pinyin").checked;

  let points = [...state.data.grammar];
  if (level !== "all") {
    const lv = Number(level);
    points = points.filter((p) => (mode === "upto" ? p.level <= lv : p.level === lv));
  }

  if (search) {
    points = points.filter((p) => {
      const hay = [
        p.code,
        p.title,
        p.title_pinyin || "",
        p.category,
        ...(p.examples || []),
        ...(p.examples_pinyin || []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(search);
    });
  }

  if (onlyUnlearned) {
    points = points.filter((p) => {
      const rec = state.progress.grammar[p.id];
      return !(rec && rec.mastered);
    });
  }

  const list = document.getElementById("grammar-list");
  const info = document.getElementById("grammar-result-info");
  info.textContent = `${points.length} grammar points shown.`;

  list.innerHTML = "";

  points.forEach((point) => {
    const rec = state.progress.grammar[point.id] || null;
    const card = document.createElement("article");
    card.className = "grammar-card";
    card.innerHTML = `
      <div class="grammar-head">
        <div>
          <div class="grammar-code">${point.code} · ${levelLabel(point.level)}</div>
          <div class="grammar-title">${point.title}</div>
          ${
            showPinyin && point.title_pinyin
              ? `<div class="pinyin-line">${point.title_pinyin}</div>`
              : ""
          }
          <div class="muted">${point.category || "Uncategorized"}</div>
        </div>
        <label class="checkbox-line">
          <input type="checkbox" data-grammar-id="${point.id}" ${rec && rec.mastered ? "checked" : ""} />
          Mastered
        </label>
      </div>
      ${
        point.examples && point.examples.length
          ? `<ul class="grammar-examples">${point.examples
              .map((e, i) => {
                const py = (point.examples_pinyin || [])[i] || "";
                return `<li><div class="example-zh">${e}</div>${
                  showPinyin && py ? `<div class="example-pinyin">${py}</div>` : ""
                }</li>`;
              })
              .join("")}</ul>`
          : '<p class="muted">No examples extracted.</p>'
      }
      <a class="muted" target="_blank" rel="noreferrer" href="${point.source}">source</a>
      <div class="muted">${
        rec
          ? `Stage ${rec.stage} · due ${rec.nextDue ? new Date(rec.nextDue).toLocaleDateString() : "-"}`
          : "Not tracked yet"
      }</div>
    `;
    list.appendChild(card);
  });
}

function toggleGrammarMastery(grammarId, checked) {
  if (checked) {
    const rec = ensureReviewRecord(state.progress.grammar, grammarId);
    applyReview(rec, true);
    rec.mastered = true;
    addDaily("grammar", 1);
  } else {
    resetReviewRecord(state.progress.grammar, grammarId);
  }
  saveProgress();
  renderGrammar();
  renderDashboard();
  renderIntensive();
}

function newGrammarQuizQuestion() {
  const level = document.getElementById("grammar-level-filter").value;
  const mode = document.getElementById("grammar-level-mode").value;
  let pool = [...state.data.grammar];
  if (level !== "all") {
    const lv = Number(level);
    pool = pool.filter((g) => (mode === "upto" ? g.level <= lv : g.level === lv));
  }
  if (pool.length < 4) {
    showToast("Not enough grammar points for quiz.");
    return;
  }

  const target = pickRandom(pool);
  const options = shuffle([
    target,
    ...shuffle(pool.filter((x) => x.id !== target.id)).slice(0, 3),
  ]);

  state.currentGrammarQuiz = { target, options, answered: false };

  const wrap = document.getElementById("grammar-quiz-wrap");
  const qEl = document.getElementById("grammar-quiz-question");
  const optionsEl = document.getElementById("grammar-quiz-options");
  const feedback = document.getElementById("grammar-quiz-feedback");
  const nextBtn = document.getElementById("grammar-quiz-next");

  wrap.classList.remove("hidden");
  feedback.textContent = "";
  feedback.className = "quiz-feedback";
  nextBtn.classList.add("hidden");

  const example = (target.examples || [])[0] || "";
  const examplePinyin = (target.examples_pinyin || [])[0] || "";
  qEl.innerHTML = `Which grammar point best matches this sentence?<br/><strong>${example}</strong>${
    examplePinyin ? `<br/><span class="pinyin-line">${examplePinyin}</span>` : ""
  }`;
  optionsEl.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-secondary";
    btn.dataset.grammarOption = opt.id;
    btn.textContent = `${opt.code} ${opt.title}`;
    optionsEl.appendChild(btn);
  });
}

function handleGrammarQuizOption(optionId) {
  const q = state.currentGrammarQuiz;
  if (!q || q.answered) return;

  q.answered = true;
  const correct = optionId === q.target.id;
  const feedback = document.getElementById("grammar-quiz-feedback");
  const nextBtn = document.getElementById("grammar-quiz-next");

  const rec = ensureReviewRecord(state.progress.grammar, q.target.id);
  applyReview(rec, correct);
  if (correct) {
    rec.mastered = rec.stage >= 2;
    addDaily("grammar", 1);
    setFeedbackState(feedback, true, `Correct: ${q.target.title}`);
  } else {
    setFeedbackState(feedback, false, `Wrong. Correct: ${q.target.title}`);
    addMistake({
      type: "grammar-quiz",
      prompt: q.target.examples?.[0] || q.target.code,
      expected: q.target.title,
      user: optionId,
    });
  }

  markChoiceButtons("#grammar-quiz-options", "data-grammar-option", q.target.id, optionId);

  saveProgress();
  renderGrammar();
  renderDashboard();
  renderIntensive();
  nextBtn.classList.remove("hidden");
}

function renderIntensive() {
  const targets = state.progress.dailyTargets;
  const today = ensureDailyLog();

  document.getElementById("target-radicals").value = targets.radicals;
  document.getElementById("target-grammar").value = targets.grammar;
  document.getElementById("target-words").value = targets.words;
  document.getElementById("target-dictation").value = targets.dictation;

  const targetProgress = document.getElementById("target-progress");
  const rows = [
    { key: "radicals", label: "Radicals", done: today.radicals || 0, goal: targets.radicals },
    { key: "grammar", label: "Grammar", done: today.grammar || 0, goal: targets.grammar },
    { key: "words", label: "Words", done: today.words || 0, goal: targets.words },
    { key: "dictation", label: "Dictation", done: today.dictation || 0, goal: targets.dictation },
  ];

  targetProgress.innerHTML = rows
    .map((row) => {
      const pct = Math.min(100, Math.round((row.done / Math.max(row.goal, 1)) * 100));
      return `
        <div class="target-line">
          <div class="small-row"><span>${row.label}</span><strong>${row.done}/${row.goal}</strong></div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
      `;
    })
    .join("");

  const mistakes = document.getElementById("mistake-list");
  if (!state.progress.mistakes.length) {
    mistakes.innerHTML = '<p class="muted">No mistakes logged yet.</p>';
  } else {
    mistakes.innerHTML = state.progress.mistakes
      .slice(0, 24)
      .map(
        (m) => `
          <div class="mistake-item">
            <div><strong>${m.type || "practice"}</strong> · ${new Date(m.ts).toLocaleString()}</div>
            <div>Prompt: ${m.prompt || "-"}</div>
            <div>Your answer: <strong>${m.user || "(empty)"}</strong></div>
            <div>Correct: <strong>${m.expected || "-"}</strong></div>
          </div>
        `
      )
      .join("");
  }

  updateTimerDisplay();
}

function updateTimerDisplay() {
  const el = document.getElementById("timer-display");
  const min = Math.floor(state.timer.remaining / 60)
    .toString()
    .padStart(2, "0");
  const sec = (state.timer.remaining % 60).toString().padStart(2, "0");
  el.textContent = `${min}:${sec}`;
}

function startTimer() {
  if (state.timer.running) return;
  state.timer.running = true;
  state.timer.intervalId = window.setInterval(() => {
    state.timer.remaining -= 1;
    if (state.timer.remaining <= 0) {
      state.timer.remaining = 0;
      pauseTimer();
      addDaily("minutes", 25);
      saveProgress();
      renderIntensive();
      showToast("Pomodoro complete. Great focus block.");
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  if (state.timer.intervalId) {
    window.clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
  }
  state.timer.running = false;
}

function resetTimer() {
  pauseTimer();
  state.timer.remaining = 25 * 60;
  updateTimerDisplay();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(state.progress, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hsk-progress-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importProgress(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  state.progress = mergeWithDefaults(parsed);
  saveProgress();
  renderAll();
  showToast("Progress imported.");
}

function refreshHeaderPills() {
  document.getElementById("pill-radical-count").textContent = `${state.data.radicals.length} radicals`;
  document.getElementById("pill-word-count").textContent = `${allWords().length.toLocaleString()} words`;
  document.getElementById("pill-grammar-count").textContent = `${state.data.grammar.length} grammar points`;
}

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function setInstallButtonVisible(visible) {
  const btn = document.getElementById("install-app-btn");
  btn.classList.toggle("hidden", !visible || isStandaloneMode());
}

function updateNetworkStatusPill() {
  const online = navigator.onLine;
  const pill = document.getElementById("pill-network-status");
  pill.textContent = online ? "Online" : "Offline";
  pill.classList.toggle("online", online);
  pill.classList.toggle("offline", !online);
}

function showUpdateBanner(show) {
  const banner = document.getElementById("update-banner");
  banner.classList.toggle("hidden", !show);
}

async function promptInstall() {
  const deferred = state.pwa.deferredInstallPrompt;
  if (deferred) {
    deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      showToast("Đã gửi yêu cầu cài đặt ứng dụng.");
    } else {
      showToast("Bạn có thể cài lại bất cứ lúc nào.");
    }
    state.pwa.deferredInstallPrompt = null;
    setInstallButtonVisible(false);
    return;
  }

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  if (isIOS) {
    showToast("iPhone/iPad: Safari -> Share -> Add to Home Screen.");
  } else {
    showToast("Trình duyệt hiện tại không hỗ trợ install prompt.");
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("./service-worker.js");
    state.pwa.registration = registration;

    if (registration.waiting) {
      showUpdateBanner(true);
    }

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          showUpdateBanner(true);
          showToast("Có bản cập nhật mới cho ứng dụng.");
        }
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  } catch (err) {
    console.error("Service Worker registration failed", err);
  }
}

function setupPwaLifecycle() {
  updateNetworkStatusPill();
  window.addEventListener("online", updateNetworkStatusPill);
  window.addEventListener("offline", updateNetworkStatusPill);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.pwa.deferredInstallPrompt = event;
    setInstallButtonVisible(true);
  });

  window.addEventListener("appinstalled", () => {
    state.pwa.deferredInstallPrompt = null;
    setInstallButtonVisible(false);
    showToast("Ứng dụng đã được cài đặt.");
  });

  const displayModeQuery = window.matchMedia("(display-mode: standalone)");
  const onDisplayModeChange = () => {
    setInstallButtonVisible(Boolean(state.pwa.deferredInstallPrompt));
  };
  if (displayModeQuery.addEventListener) {
    displayModeQuery.addEventListener("change", onDisplayModeChange);
  } else if (displayModeQuery.addListener) {
    displayModeQuery.addListener(onDisplayModeChange);
  }
}

function renderAll() {
  const safeRender = (label, fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`Render failed: ${label}`, err);
    }
  };

  safeRender("header", refreshHeaderPills);
  safeRender("network", updateNetworkStatusPill);
  safeRender("dashboard", renderDashboard);
  safeRender("radicals", renderRadicals);
  safeRender("vocab-radical-filter", refreshVocabRadicalFilter);
  safeRender("vocabulary", () => renderVocabulary(true));
  safeRender("quiz-question", renderQuizQuestion);
  safeRender("quiz-score", updateQuizScoreline);
  safeRender("grammar", renderGrammar);
  safeRender("pronunciation", renderPronunciation);
  safeRender("intensive", renderIntensive);
  safeRender("quiz-radical-filter", refreshQuizRadicalFilter);
}

function setupTabSwitching() {
  const nav = document.getElementById("main-nav");
  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab]");
    if (!btn) return;
    const tab = btn.dataset.tab;
    setActiveTab(tab);
    syncTabToUrl(tab);
  });
}

function setupEventHandlers() {
  [
    "radical-level-filter",
    "radical-view-mode",
    "radical-search",
    "radical-only-due",
  ].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderRadicals);
    document.getElementById(id).addEventListener("change", renderRadicals);
  });

  document.getElementById("radical-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "toggle-mastered") {
      const rec = ensureReviewRecord(state.progress.radicals, id);
      if (rec.mastered) {
        resetReviewRecord(state.progress.radicals, id);
      } else {
        applyReview(rec, true);
        rec.mastered = true;
        addDaily("radicals", 1);
      }
      saveProgress();
      renderRadicals();
      renderDashboard();
      renderIntensive();
    } else if (action === "review-correct") {
      const rec = ensureReviewRecord(state.progress.radicals, id);
      applyReview(rec, true);
      saveProgress();
      renderRadicals();
      renderDashboard();
      showToast("Review saved.");
    }
  });

  ["quiz-mode", "quiz-level"].forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
      refreshQuizRadicalFilter();
      state.currentQuiz = null;
      renderQuizQuestion();
    });
  });

  document.getElementById("quiz-radical-filter").addEventListener("change", () => {
    state.currentQuiz = null;
    renderQuizQuestion();
  });

  document.getElementById("quiz-start").addEventListener("click", () => {
    newQuizQuestion();
  });

  document.getElementById("quiz-options").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-option]");
    if (!btn) return;
    handleOptionAnswer(btn.dataset.option);
  });

  document.getElementById("quiz-submit").addEventListener("click", handleTextAnswer);
  document.getElementById("quiz-answer-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTextAnswer();
    }
  });

  document.getElementById("quiz-next").addEventListener("click", () => {
    newQuizQuestion();
  });

  ["vocab-level-filter", "vocab-level-mode"].forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
      refreshVocabRadicalFilter();
      renderVocabulary(true);
    });
  });

  ["vocab-radical-filter", "vocab-search", "vocab-show-pinyin", "vocab-only-unlearned"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => renderVocabulary(true));
    document.getElementById(id).addEventListener("change", () => renderVocabulary(true));
  });

  [
    "vocab-col-word",
    "vocab-col-pinyin",
    "vocab-col-meaning",
    "vocab-col-level",
    "vocab-col-freq-min",
    "vocab-col-freq-max",
    "vocab-col-radical",
    "vocab-col-mastered",
  ].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => renderVocabulary(true));
    document.getElementById(id).addEventListener("change", () => renderVocabulary(true));
  });

  document.getElementById("vocab-clear-col-filters").addEventListener("click", () => {
    clearVocabColumnFilters();
    renderVocabulary(true);
  });

  document.getElementById("vocab-flash-start").addEventListener("click", () => {
    openVocabFlashcards();
  });
  document.getElementById("vocab-flash-close").addEventListener("click", () => {
    closeVocabFlashcards();
  });
  document.getElementById("vocab-flash-shuffle").addEventListener("click", () => {
    shuffleVocabFlashDeck();
  });
  document.getElementById("vocab-flash-prev").addEventListener("click", () => {
    moveVocabFlashcard(-1);
  });
  document.getElementById("vocab-flash-next").addEventListener("click", () => {
    moveVocabFlashcard(1);
  });
  document.getElementById("vocab-flash-flip").addEventListener("click", () => {
    flipVocabFlashcard();
  });
  document.getElementById("vocab-flash-replay").addEventListener("click", () => {
    replayFlashcardAudio();
  });
  document.getElementById("vocab-flash-card").addEventListener("click", () => {
    flipVocabFlashcard();
  });
  document.getElementById("vocab-flash-mastered").addEventListener("click", () => {
    toggleCurrentFlashWordMastery();
  });
  document.getElementById("vocab-flash-modal").addEventListener("click", (e) => {
    if (!e.target.closest("[data-flash-close]")) return;
    closeVocabFlashcards();
  });
  document.addEventListener("keydown", (e) => {
    if (!state.vocab.flashOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeVocabFlashcards();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveVocabFlashcard(-1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveVocabFlashcard(1);
      return;
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      flipVocabFlashcard();
    }
  });

  document.getElementById("vocab-list").addEventListener("change", (e) => {
    const input = e.target.closest("input[data-vocab-id]");
    if (!input) return;
    toggleVocabMastery(input.dataset.vocabId, input.checked);
  });
  document.getElementById("vocab-list").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-vocab-audio-id]");
    if (!btn) return;
    const word = findWordById(btn.dataset.vocabAudioId);
    speakVocabWord(word);
  });

  document.getElementById("vocab-prev-page").addEventListener("click", () => {
    state.vocab.page = Math.max(1, state.vocab.page - 1);
    renderVocabulary();
  });

  document.getElementById("vocab-next-page").addEventListener("click", () => {
    state.vocab.page = Math.min(state.vocab.totalPages, state.vocab.page + 1);
    renderVocabulary();
  });

  ["grammar-level-filter", "grammar-level-mode", "grammar-search", "grammar-only-unlearned", "grammar-show-pinyin"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderGrammar);
    document.getElementById(id).addEventListener("change", renderGrammar);
  });

  document.getElementById("grammar-list").addEventListener("change", (e) => {
    const input = e.target.closest("input[data-grammar-id]");
    if (!input) return;
    toggleGrammarMastery(input.dataset.grammarId, input.checked);
  });

  document.getElementById("grammar-quiz-start").addEventListener("click", () => {
    newGrammarQuizQuestion();
  });
  document.getElementById("grammar-quiz-next").addEventListener("click", () => {
    newGrammarQuizQuestion();
  });
  document.getElementById("grammar-quiz-options").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-grammar-option]");
    if (!btn) return;
    handleGrammarQuizOption(btn.dataset.grammarOption);
  });

  ["pron-section-filter", "pron-search"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderPronunciation);
    document.getElementById(id).addEventListener("change", renderPronunciation);
  });

  document.getElementById("save-targets").addEventListener("click", () => {
    const radicals = Number(document.getElementById("target-radicals").value || 0);
    const grammar = Number(document.getElementById("target-grammar").value || 0);
    const words = Number(document.getElementById("target-words").value || 0);
    const dictation = Number(document.getElementById("target-dictation").value || 0);

    state.progress.dailyTargets = {
      radicals: Math.max(1, radicals || 1),
      grammar: Math.max(1, grammar || 1),
      words: Math.max(1, words || 1),
      dictation: Math.max(1, dictation || 1),
    };
    saveProgress();
    renderIntensive();
    showToast("Daily targets updated.");
  });

  document.getElementById("timer-start").addEventListener("click", startTimer);
  document.getElementById("timer-pause").addEventListener("click", pauseTimer);
  document.getElementById("timer-reset").addEventListener("click", resetTimer);

  document.getElementById("export-progress").addEventListener("click", exportProgress);
  document.getElementById("import-progress").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      await importProgress(file);
    } catch (_err) {
      showToast("Failed to import progress file.");
    }
    e.target.value = "";
  });

  document.getElementById("install-app-btn").addEventListener("click", () => {
    promptInstall();
  });

  document.getElementById("update-reload-btn").addEventListener("click", () => {
    const reg = state.pwa.registration;
    if (reg && reg.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
      showToast("Đang cập nhật ứng dụng...");
    } else {
      window.location.reload();
    }
  });
}

async function init() {
  state.progress = loadProgress();
  setupPwaLifecycle();
  const failed = await loadAllData();

  buildLevelOptions(document.getElementById("radical-level-filter"));
  buildLevelOptions(document.getElementById("vocab-level-filter"));
  buildLevelOptions(document.getElementById("vocab-col-level"));
  buildLevelOptions(document.getElementById("quiz-level"));
  buildLevelOptions(document.getElementById("grammar-level-filter"));

  setupTabSwitching();
  setupEventHandlers();
  activateInitialTabFromUrl();
  renderAll();
  await registerServiceWorker();

  if (failed.length) {
    showToast(`Cảnh báo tải dữ liệu: ${failed.join(", ")}`);
  }
}

init().catch((err) => {
  console.error(err);
  showToast("Failed to initialize app data.");
});
