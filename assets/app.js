const DATA_FILES = {
  radicals: "./data/radicals.json",
  words: "./data/words.json",
  grammar: "./data/grammar.json",
  meta: "./data/meta.json",
};

const LEVELS = [1, 2, 3, 4, 5, 6, 7];
const STORAGE_KEY = "hsk_intensive_studio_v1";
const SRS_INTERVALS = [1, 3, 7, 14, 30, 45];

const state = {
  data: {
    radicals: [],
    wordsByLevel: {},
    grammar: [],
    meta: null,
  },
  progress: null,
  currentQuiz: null,
  currentGrammarQuiz: null,
  timer: {
    remaining: 25 * 60,
    running: false,
    intervalId: null,
  },
  pwa: {
    deferredInstallPrompt: null,
    registration: null,
  },
};

function defaultProgress() {
  return {
    radicals: {},
    grammar: {},
    quizStats: {
      correct: 0,
      wrong: 0,
    },
    dailyTargets: {
      radicals: 6,
      grammar: 6,
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

function fetchJson(path) {
  return fetch(path).then((r) => {
    if (!r.ok) throw new Error(`Cannot load ${path}`);
    return r.json();
  });
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
    const score = (day.radicals || 0) + (day.grammar || 0) + (day.dictation || 0) + (day.minutes || 0);
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

  items.sort((a, b) => new Date(a.due) - new Date(b.due));
  return items.slice(0, limit);
}

function radicalMasteredCount() {
  return Object.values(state.progress.radicals).filter((rec) => rec.mastered).length;
}

function grammarMasteredCount() {
  return Object.values(state.progress.grammar).filter((rec) => rec.mastered).length;
}

function renderDashboard() {
  const stats = document.getElementById("dashboard-stats");
  const totalRadicals = state.data.radicals.length;
  const totalGrammar = state.data.grammar.length;
  const masteredRadicals = radicalMasteredCount();
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
    const levelMeta = state.data.meta.levels[key];

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

    const card = document.createElement("article");
    card.className = "level-card";
    card.innerHTML = `
      <h4>${levelLabel(level)}</h4>
      <div class="small-row"><span>Words:</span><strong>${levelMeta.words}</strong></div>
      <div class="small-row"><span>Grammar points:</span><strong>${levelMeta.grammar_points}</strong></div>
      <div class="small-row"><span>Radicals introduced:</span><strong>${levelMeta.radicals_introduced}</strong></div>
      <div class="small-row"><span>Radicals mastered:</span><strong>${masteredRadicalsAtLevel}/${availableRadicals.length}</strong></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${formatPct(masteredRadicalsAtLevel, Math.max(availableRadicals.length, 1))}"></div></div>
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
          <span>${item.type === "radical" ? "Radical" : "Grammar"}: ${item.label}</span>
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

  const pool = getRadicalPoolForLevel(level);
  const opts = ['<option value="all">All radicals</option>'];
  pool.forEach((r) => {
    opts.push(
      `<option value="${r.id}">${r.ideograph} · ${r.id} · ${r.definition || ""}</option>`
    );
  });
  select.innerHTML = opts.join("");
}

function updateQuizScoreline() {
  const el = document.getElementById("quiz-scoreline");
  el.textContent = `Correct ${state.progress.quizStats.correct} | Wrong ${state.progress.quizStats.wrong}`;
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
    state.currentQuiz = { mode, radical, options };
  } else if (mode === "radical-dictation") {
    const pool = getRadicalPoolForLevel(level);
    if (!pool.length) {
      showToast("No radicals available for this filter.");
      return;
    }
    const radical = pickRandom(pool);
    state.currentQuiz = { mode, radical };
  } else {
    const pool = getWordsForFilters(level, radicalFilter);
    if (!pool.length) {
      showToast("No words for this level/radical filter.");
      return;
    }
    const word = pickRandom(pool);
    state.currentQuiz = { mode, word };
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
  if (!q || q.mode !== "radical-mc") return;

  const correct = optionId === q.radical.id;
  const feedbackEl = document.getElementById("quiz-feedback");
  const nextBtn = document.getElementById("quiz-next");

  const rec = ensureReviewRecord(state.progress.radicals, q.radical.id);
  applyReview(rec, correct);

  if (correct) {
    feedbackEl.textContent = `Correct. ${q.radical.ideograph} means: ${q.radical.definition || "-"}`;
    feedbackEl.classList.add("feedback-ok");
  } else {
    feedbackEl.textContent = `Wrong. Correct answer: ${q.radical.definition || "-"}`;
    feedbackEl.classList.add("feedback-warn");
  }

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
  if (!q) return;

  const input = document.getElementById("quiz-answer-input");
  const user = input.value.trim();
  if (!user) return;

  const feedbackEl = document.getElementById("quiz-feedback");
  const nextBtn = document.getElementById("quiz-next");

  let correct = false;
  let expected = "";

  if (q.mode === "radical-dictation") {
    const validAnswers = new Set([q.radical.ideograph, q.radical.symbol]);
    correct = validAnswers.has(user);
    expected = q.radical.ideograph;

    const rec = ensureReviewRecord(state.progress.radicals, q.radical.id);
    applyReview(rec, correct);

    if (correct) {
      feedbackEl.textContent = `Correct: ${q.radical.ideograph}`;
      feedbackEl.classList.add("feedback-ok");
    } else {
      feedbackEl.textContent = `Wrong. Correct radical: ${q.radical.ideograph}`;
      feedbackEl.classList.add("feedback-warn");
    }

    registerQuizResult(correct, {
      type: "radical-dictation",
      prompt: q.radical.definition,
      expected,
      user,
    });
  } else if (q.mode === "word-dictation") {
    expected = q.word.word;
    correct = toComparable(user) === toComparable(expected);

    (q.word.radical_ids || []).forEach((rid) => {
      const rec = ensureReviewRecord(state.progress.radicals, rid);
      applyReview(rec, correct);
    });

    if (correct) {
      feedbackEl.textContent = `Correct: ${q.word.word}`;
      feedbackEl.classList.add("feedback-ok");
    } else {
      feedbackEl.textContent = `Wrong. Correct word: ${q.word.word}`;
      feedbackEl.classList.add("feedback-warn");
    }

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
  const search = document.getElementById("grammar-search").value.trim().toLowerCase();
  const onlyUnlearned = document.getElementById("grammar-only-unlearned").checked;
  const showPinyin = document.getElementById("grammar-show-pinyin").checked;

  let points = [...state.data.grammar];
  if (level !== "all") {
    points = points.filter((p) => p.level === Number(level));
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
  let pool = [...state.data.grammar];
  if (level !== "all") {
    pool = pool.filter((g) => g.level === Number(level));
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

  state.currentGrammarQuiz = { target, options };

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
  if (!q) return;

  const correct = optionId === q.target.id;
  const feedback = document.getElementById("grammar-quiz-feedback");
  const nextBtn = document.getElementById("grammar-quiz-next");

  const rec = ensureReviewRecord(state.progress.grammar, q.target.id);
  applyReview(rec, correct);
  if (correct) {
    rec.mastered = rec.stage >= 2;
    addDaily("grammar", 1);
    feedback.textContent = `Correct: ${q.target.title}`;
    feedback.classList.add("feedback-ok");
  } else {
    feedback.textContent = `Wrong. Correct: ${q.target.title}`;
    feedback.classList.add("feedback-warn");
    addMistake({
      type: "grammar-quiz",
      prompt: q.target.examples?.[0] || q.target.code,
      expected: q.target.title,
      user: optionId,
    });
  }

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
  document.getElementById("target-dictation").value = targets.dictation;

  const targetProgress = document.getElementById("target-progress");
  const rows = [
    { key: "radicals", label: "Radicals", done: today.radicals || 0, goal: targets.radicals },
    { key: "grammar", label: "Grammar", done: today.grammar || 0, goal: targets.grammar },
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
  refreshHeaderPills();
  updateNetworkStatusPill();
  renderDashboard();
  renderRadicals();
  renderQuizQuestion();
  updateQuizScoreline();
  renderGrammar();
  renderIntensive();
  refreshQuizRadicalFilter();
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

  ["grammar-level-filter", "grammar-search", "grammar-only-unlearned", "grammar-show-pinyin"].forEach((id) => {
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

  document.getElementById("save-targets").addEventListener("click", () => {
    const radicals = Number(document.getElementById("target-radicals").value || 0);
    const grammar = Number(document.getElementById("target-grammar").value || 0);
    const dictation = Number(document.getElementById("target-dictation").value || 0);

    state.progress.dailyTargets = {
      radicals: Math.max(1, radicals || 1),
      grammar: Math.max(1, grammar || 1),
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

  const [radicalData, wordData, grammarData, metaData] = await Promise.all([
    fetchJson(DATA_FILES.radicals),
    fetchJson(DATA_FILES.words),
    fetchJson(DATA_FILES.grammar),
    fetchJson(DATA_FILES.meta),
  ]);

  state.data.radicals = radicalData.radicals || [];
  state.data.wordsByLevel = wordData.levels || {};
  state.data.grammar = grammarData.points || [];
  state.data.meta = metaData;

  buildLevelOptions(document.getElementById("radical-level-filter"));
  buildLevelOptions(document.getElementById("quiz-level"));
  buildLevelOptions(document.getElementById("grammar-level-filter"));

  setupTabSwitching();
  setupEventHandlers();
  activateInitialTabFromUrl();
  renderAll();
  await registerServiceWorker();
}

init().catch((err) => {
  console.error(err);
  showToast("Failed to initialize app data.");
});
