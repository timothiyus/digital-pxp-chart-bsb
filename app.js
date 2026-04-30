const STORAGE_KEY = "pxp-baseball-chart-v1";
const STORAGE_META_KEY = `${STORAGE_KEY}:savedAt`;
const STATE_DB_NAME = "pxp-baseball-workspace";
const STATE_DB_STORE = "snapshots";
const STATE_DB_RECORD_ID = "workspace";
const APP_VERSION = "v30";
const CLIENT_ID = (() => {
  let id = localStorage.getItem("pxp.clientId");
  if (!id) {
    id = `c-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
    try { localStorage.setItem("pxp.clientId", id); } catch (_) { /* ignore */ }
  }
  return id;
})();
const SUPABASE_URL = window.PXP_SUPABASE_URL;
const SUPABASE_ANON_KEY = window.PXP_SUPABASE_ANON_KEY;
const supabaseClient = window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, storage: window.localStorage },
    })
  : null;
let supabaseSession = null;
let realtimeChannel = null;
let pushTimer = null;
let lastPushedSerialized = null;
let lastSyncedAt = 0;

const emptyStats = () => ({
  GP: 0,
  PA: 0,
  AB: 0,
  H: 0,
  "2B": 0,
  "3B": 0,
  HR: 0,
  RBI: 0,
  R: 0,
  BB: 0,
  SO: 0,
  HBP: 0,
  SF: 0,
  SB: 0,
  CS: 0,
  TB: 0,
  IP: 0,
  ERA: 0,
  WHIP: 0,
  W: 0,
  L: 0,
  GS: 0,
  BF: 0,
  BAA: 0,
  P_GP: 0,
  Pitches: 0,
  Strikes: 0,
  BK: 0,
  P_H: 0,
  P_R: 0,
  P_ER: 0,
  P_HR: 0,
  P_2B: 0,
  P_3B: 0,
  P_BB: 0,
  P_SO: 0,
  P_BK: 0,
  P_HBP: 0,
  P_WP: 0,
  P_AB: 0,
  CG: 0,
  SHO: 0,
  SV: 0,
  SFA: 0,
  SHA: 0,
  TC: 0,
  PO: 0,
  A: 0,
  E: 0,
  F_PCT: 0,
  DP: 0,
  SBA: 0,
  RCS: 0,
  RCS_PCT: 0,
  PB: 0,
  CI: 0
});

const state = loadState();

function emptyBaseState() {
  return { first: "", second: "", third: "" };
}

const els = {
  appShell: document.querySelector("#appShell"),
  collapseSetupButton: document.querySelector("#collapseSetupButton"),
  csvInput: document.querySelector("#csvInput"),
  gcConferenceCsvInput: document.querySelector("#gcConferenceCsvInput"),
  gcBoxScoreInput: document.querySelector("#gcBoxScoreInput"),
  teamProfilePanel: document.querySelector("#teamProfilePanel"),
  exportButton: document.querySelector("#exportButton"),
  importJsonInput: document.querySelector("#importJsonInput"),
  clearImportsButton: document.querySelector("#clearImportsButton"),
  resetButton: document.querySelector("#resetButton"),
  saveState: document.querySelector("#saveState"),
  teamName: document.querySelector("#teamName"),
  opponentName: document.querySelector("#opponentName"),
  gameDate: document.querySelector("#gameDate"),
  gameType: document.querySelector("#gameType"),
  gameLocation: document.querySelector("#gameLocation"),
  gameVenue: document.querySelector("#gameVenue"),
  gameFieldName: document.querySelector("#gameFieldName"),
  firstPitchTime: document.querySelector("#firstPitchTime"),
  firstPitchWeather: document.querySelector("#firstPitchWeather"),
  umpireHp: document.querySelector("#umpireHp"),
  umpireFirst: document.querySelector("#umpireFirst"),
  umpireSecond: document.querySelector("#umpireSecond"),
  umpireThird: document.querySelector("#umpireThird"),
  gameNotes: document.querySelector("#gameNotes"),
  showAtBatControls: document.querySelector("#showAtBatControls"),
  showFocusControls: document.querySelector("#showFocusControls"),
  showStatExplanations: document.querySelector("#showStatExplanations"),
  playerCount: document.querySelector("#playerCount"),
  sourceList: document.querySelector("#sourceList"),
  inningCount: document.querySelector("#inningCount"),
  currentInning: document.querySelector("#currentInning"),
  pitchingChangeButton: document.querySelector("#pitchingChangeButton"),
  chartHud: document.querySelector("#chartHud"),
  statHud: document.querySelector("#statHud"),
  clearScorecardButton: document.querySelector("#clearScorecardButton"),
  pinChartButton: document.querySelector("#pinChartButton"),
  toggleFullChartButton: document.querySelector("#toggleFullChartButton"),
  inningTotals: document.querySelector("#inningTotals"),
  diamondLineScore: document.querySelector("#diamondLineScore"),
  inningEditBanner: document.querySelector("#inningEditBanner"),
  inningCompleteOverlay: document.querySelector("#inningCompleteOverlay"),
  upNextStrip: document.querySelector("#upNextStrip"),
  prevInningButton: document.querySelector("#prevInningButton"),
  nextInningButton: document.querySelector("#nextInningButton"),
  scorecardGrid: document.querySelector("#scorecardGrid"),
  fullScorecardPanel: document.querySelector("#fullScorecardPanel"),
  fullChartToolbar: document.querySelector("#fullChartToolbar"),
  fullChartLineScore: document.querySelector("#fullChartLineScore"),
  fullScorecardGrid: document.querySelector("#fullScorecardGrid"),
  defenseEditor: document.querySelector("#defenseEditor"),
  defensePopupPanel: document.querySelector("#defensePopupPanel"),
  lineupSlots: document.querySelector("#lineupSlots"),
  autoLineupButton: document.querySelector("#autoLineupButton"),
  spotlightSelect: document.querySelector("#spotlightSelect"),
  spotlightCard: document.querySelector("#spotlightCard"),
  playerSearch: document.querySelector("#playerSearch"),
  playerTable: document.querySelector("#playerTable"),
  playerForm: document.querySelector("#playerForm"),
  newPlayerButton: document.querySelector("#newPlayerButton"),
  prevPlayerButton: document.querySelector("#prevPlayerButton"),
  nextPlayerButton: document.querySelector("#nextPlayerButton"),
  closePlayerModalButton: document.querySelector("#closePlayerModalButton"),
  editingId: document.querySelector("#editingId"),
  rosterCards: document.querySelector("#rosterCards"),
  rosterSummary: document.querySelector("#rosterSummary"),
  eventForm: document.querySelector("#eventForm"),
  eventPlayer: document.querySelector("#eventPlayer"),
  eventList: document.querySelector("#eventList"),
  clearEventsButton: document.querySelector("#clearEventsButton"),
  activePitcher: document.querySelector("#activePitcher"),
  startingPitcher: document.querySelector("#startingPitcher"),
  bullpenSelect: document.querySelector("#bullpenSelect"),
  addBullpenButton: document.querySelector("#addBullpenButton"),
  resetPitchingButton: document.querySelector("#resetPitchingButton"),
  activePitcherLabel: document.querySelector("#activePitcherLabel"),
  pitcherCards: document.querySelector("#pitcherCards"),
  pitchLog: document.querySelector("#pitchLog"),
  pitchLogSummary: document.querySelector("#pitchLogSummary"),
  dataSourceList: document.querySelector("#dataSourceList"),
  boxScoreInput: document.querySelector("#boxScoreInput"),
  boxScoreTxtInput: document.querySelector("#boxScoreTxtInput"),
  pdfBridgeStatus: document.querySelector("#pdfBridgeStatus"),
  pdfBridgeUrlInput: document.querySelector("#pdfBridgeUrlInput"),
  pdfBridgeSaveButton: document.querySelector("#pdfBridgeSaveButton"),
  pdfBridgeClearButton: document.querySelector("#pdfBridgeClearButton"),
  pdfBridgeConfig: document.querySelector("#pdfBridgeConfig"),
  boxScoreDate: document.querySelector("#boxScoreDate"),
  boxScoreOpponent: document.querySelector("#boxScoreOpponent"),
  boxScoreResultNote: document.querySelector("#boxScoreResultNote"),
  boxScoreList: document.querySelector("#boxScoreList"),
  notationDocs: document.querySelector("#notationDocs"),
  appPromptOverlay: document.querySelector("#appPromptOverlay"),
  appPromptTitle: document.querySelector("#appPromptTitle"),
  appPromptMessage: document.querySelector("#appPromptMessage"),
  appPromptChoices: document.querySelector("#appPromptChoices"),
  appPromptInput: document.querySelector("#appPromptInput"),
  appPromptCancel: document.querySelector("#appPromptCancel"),
  appPromptConfirm: document.querySelector("#appPromptConfirm")
};

function emptyUmpires() {
  return { hp: "", first: "", second: "", third: "" };
}

function defaultGameInfo() {
  return {
    teamName: "Garden City CC",
    opponentName: "",
    gameDate: new Date().toISOString().slice(0, 10),
    gameType: "nonconference",
    location: "",
    venue: "",
    fieldName: "",
    firstPitchTime: "",
    firstPitchWeather: "",
    umpires: emptyUmpires(),
    notes: ""
  };
}

function newGameEntry(label) {
  return {
    id: uid("game"),
    label: label || "Game 1",
    game: defaultGameInfo(),
    inningCount: 9,
    charts: {
      home: newChartState(),
      away: newChartState()
    },
    teamMeta: {
      home: emptyTeamMeta(),
      away: emptyTeamMeta()
    }
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_META_KEY);
    }
  }

  return {
    games: [newGameEntry("Game 1")],
    activeGameIndex: 0,
    activeSide: "away",
    teamMeta: {
      home: emptyTeamMeta(),
      away: emptyTeamMeta()
    },
    settings: {
      showAtBatControls: false,
      showFocusControls: false
    },
    players: [],
    events: [],
    sources: [],
    boxScores: []
  };
}

function localStateSavedAt() {
  return toNumber(localStorage.getItem(STORAGE_META_KEY));
}

function openStateDatabase() {
  if (!("indexedDB" in window)) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(STATE_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STATE_DB_STORE)) {
        db.createObjectStore(STATE_DB_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveStateToIndexedDb(serialized, savedAt) {
  try {
    const db = await openStateDatabase();
    if (!db) return false;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STATE_DB_STORE, "readwrite");
      tx.objectStore(STATE_DB_STORE).put({
        id: STATE_DB_RECORD_ID,
        serialized,
        savedAt
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    db.close();
    return true;
  } catch (error) {
    console.warn("Could not write IndexedDB state backup:", error?.message || error);
    return false;
  }
}

async function readStateFromIndexedDb() {
  try {
    const db = await openStateDatabase();
    if (!db) return null;
    const record = await new Promise((resolve, reject) => {
      const tx = db.transaction(STATE_DB_STORE, "readonly");
      const request = tx.objectStore(STATE_DB_STORE).get(STATE_DB_RECORD_ID);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return record;
  } catch (error) {
    console.warn("Could not read IndexedDB state backup:", error?.message || error);
    return null;
  }
}

function persistStateSnapshot(serialized, savedAt = Date.now()) {
  let localSaved = false;
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(STORAGE_META_KEY, String(savedAt));
    localSaved = true;
  } catch (error) {
    console.warn("Could not save local state:", error?.message || error);
  }
  saveStateToIndexedDb(serialized, savedAt);
  return localSaved;
}

function emptyTeamMeta() {
  return {
    logo: "",
    abbreviation: "",
    mascot: "",
    ranking: "",
    conferenceName: "",
    leagueName: "",
    overallRecord: "",
    conferenceRecord: "",
    location: "",
    institutionInfo: "",
    primaryColor: "#167052",
    showSnapshot: true,
    showRecords: true,
    showCoaches: true,
    records: [],
    coaches: []
  };
}

function newChartState() {
  return {
    lineup: Array.from({ length: 9 }, () => ""),
    lineupPositions: Array.from({ length: 9 }, () => ""),
    scorecard: {},
    substitutions: {},
    batterNotes: {},
    activePitcherId: "",
    startingPitcherId: "",
    bullpenIds: [],
    pitchCounts: {},
    pitchingLines: {},
    pitchLog: [],
    currentInning: 1,
    currentSlot: 1,
    inningStatus: "pregame",
    inningTotals: {},
    completedInnings: {},
    editingCompletedInnings: {},
    extraAbs: {},
    selectedAbs: {},
    baseStates: {},
    baseState: { first: "", second: "", third: "" },
    hud: {
      bullpen: "",
      defenseNotes: "",
      chartNotes: "",
      defense: {
        P: "",
        C: "",
        "1B": "",
        "2B": "",
        "3B": "",
        SS: "",
        LF: "",
        CF: "",
        RF: ""
      }
    }
  };
}

function normalizeCharts(charts) {
  if (!charts.home) charts.home = newChartState();
  if (!charts.away) charts.away = newChartState();
  charts.home = { ...newChartState(), ...charts.home };
  charts.away = { ...newChartState(), ...charts.away };
  Object.values(charts).forEach((chart) => {
    chart.substitutions = chart.substitutions || {};
    Object.keys(chart.substitutions).forEach((slotIndex) => {
      chart.substitutions[slotIndex] = normalizeSubstitutionEntry(chart.substitutions[slotIndex]);
    });
    chart.batterNotes = chart.batterNotes || {};
    chart.bullpenIds = chart.bullpenIds || [];
    chart.pitchingLines = chart.pitchingLines || {};
    chart.currentInning = chart.currentInning || 1;
    chart.currentSlot = Number(chart.currentSlot) || 1;
    chart.viewMode = chart.viewMode || "all";
    chart.inningStatus = chart.inningStatus || "pregame";
    chart.inningTotals = chart.inningTotals || {};
    chart.completedInnings = chart.completedInnings || {};
    chart.editingCompletedInnings = chart.editingCompletedInnings || {};
    chart.extraAbs = chart.extraAbs || {};
    chart.selectedAbs = chart.selectedAbs || {};
    chart.baseStates = chart.baseStates || {};
    chart.baseState = chart.baseState || { first: "", second: "", third: "" };
    chart.baseStates[chart.currentInning] = chart.baseStates[chart.currentInning] || { ...chart.baseState };
    chart.baseState = { ...chart.baseStates[chart.currentInning] };
    chart.hud = {
      ...newChartState().hud,
      ...(chart.hud || {}),
      defense: {
        ...newChartState().hud.defense,
        ...(chart.hud?.defense || {})
      }
    };
  });
}

function normalizeTeamMeta(teamMeta) {
  const result = {
    home: { ...emptyTeamMeta(), ...(teamMeta?.home || {}) },
    away: { ...emptyTeamMeta(), ...(teamMeta?.away || {}) }
  };
  ["home", "away"].forEach((side) => {
    result[side].records = Array.from({ length: 10 }, (_, index) => ({
      season: "",
      overall: "",
      conference: "",
      ...((result[side].records || [])[index] || {})
    }));
    result[side].coaches = (result[side].coaches || []).map((coach) => ({
      id: coach.id || uid("coach"),
      name: "",
      title: "",
      bio: "",
      image: "",
      ...coach
    }));
  });
  return result;
}

function cloneTeamMeta(teamMeta) {
  return JSON.parse(JSON.stringify(normalizeTeamMeta(teamMeta)));
}

function recordHasData(row = {}) {
  return Boolean(row.season || row.overall || row.conference);
}

function mergeTeamMetaCandidate(target, candidate) {
  if (!candidate) return;
  const normalized = normalizeTeamMeta(candidate);
  const textFields = [
    "logo",
    "abbreviation",
    "mascot",
    "ranking",
    "conferenceName",
    "leagueName",
    "overallRecord",
    "conferenceRecord",
    "location",
    "institutionInfo",
    "primaryColor"
  ];
  ["home", "away"].forEach((side) => {
    textFields.forEach((field) => {
      const value = normalized[side]?.[field];
      if (String(value || "").trim()) target[side][field] = value;
    });
    if ((normalized[side]?.records || []).some(recordHasData)) {
      target[side].records = normalized[side].records.map((row) => ({ ...row }));
    }
    if ((normalized[side]?.coaches || []).length) {
      target[side].coaches = normalized[side].coaches.map((coach) => ({ ...coach }));
    }
  });
}

function consolidatedTeamMeta() {
  const result = normalizeTeamMeta();
  const activeMeta = state.games?.[state.activeGameIndex ?? 0]?.teamMeta;
  const candidates = [
    state.teamMeta,
    ...(state.games || []).map((game) => game.teamMeta)
  ];
  candidates.forEach((candidate) => mergeTeamMetaCandidate(result, candidate));

  const booleanSource = normalizeTeamMeta(activeMeta || state.teamMeta);
  ["home", "away"].forEach((side) => {
    ["showSnapshot", "showRecords", "showCoaches"].forEach((field) => {
      result[side][field] = Boolean(booleanSource[side][field]);
    });
  });
  return result;
}

function syncSharedTeamMetaToGames() {
  if (!Array.isArray(state.games)) return;
  state.teamMeta = cloneTeamMeta(state.teamMeta);
  state.games.forEach((entry) => {
    entry.teamMeta = cloneTeamMeta(state.teamMeta);
  });
}

function normalizeGameInfo(game = {}) {
  const normalized = {
    ...defaultGameInfo(),
    ...(game || {})
  };
  normalized.gameType = normalizeGameType(normalized.gameType);
  normalized.umpires = {
    ...emptyUmpires(),
    ...(game?.umpires || {})
  };
  return normalized;
}

function sharedTeamNameFromGames(key, fallback) {
  const activeValue = state.games?.[state.activeGameIndex ?? 0]?.game?.[key] || "";
  const newestNonDefault = [...(state.games || [])]
    .reverse()
    .map((game) => String(game.game?.[key] || "").trim())
    .find((value) => value && value !== fallback);
  return newestNonDefault || activeValue || fallback;
}

function syncSharedTeamNames() {
  const homeName = sharedTeamNameFromGames("teamName", "Garden City CC");
  const awayName = sharedTeamNameFromGames("opponentName", "");
  (state.games || []).forEach((entry) => {
    entry.game.teamName = homeName;
    entry.game.opponentName = awayName;
  });
}

function normalizeState() {
  state.activeSide = state.activeSide || "away";

  // Migrate old single-game state format to games array
  if (!state.games) {
    const charts = state.charts || {
      home: {
        ...newChartState(),
        lineup: state.lineup || Array.from({ length: 9 }, () => ""),
        lineupPositions: state.lineupPositions || Array.from({ length: 9 }, () => ""),
        scorecard: state.scorecard || {}
      },
      away: newChartState()
    };
    state.games = [{
      id: uid("game"),
      label: "Game 1",
      game: normalizeGameInfo(state.game),
      inningCount: state.inningCount || 9,
      charts,
      teamMeta: state.teamMeta || { home: emptyTeamMeta(), away: emptyTeamMeta() }
    }];
    delete state.game;
    delete state.inningCount;
    delete state.charts;
    delete state.teamMeta;
    delete state.lineup;
    delete state.lineupPositions;
    delete state.scorecard;
  }

  state.activeGameIndex = Math.min(state.activeGameIndex ?? 0, state.games.length - 1);

  state.games.forEach((entry, i) => {
    entry.id = entry.id || uid("game");
    entry.label = entry.label || `Game ${i + 1}`;
    entry.game = normalizeGameInfo(entry.game);
    entry.inningCount = entry.inningCount || 9;
    entry.charts = entry.charts || { home: newChartState(), away: newChartState() };
    normalizeCharts(entry.charts);
    entry.teamMeta = normalizeTeamMeta(entry.teamMeta);
  });
  syncSharedTeamNames();
  state.teamMeta = consolidatedTeamMeta();
  syncSharedTeamMetaToGames();

  state.sources = state.sources || [];
  state.boxScores = state.boxScores || [];
  state.events = state.events || [];
  const fallbackGameId = state.games[state.activeGameIndex ?? 0]?.id || state.games[0]?.id || "";
  state.events.forEach((event) => {
    event.gameId = event.gameId || fallbackGameId;
    event.gameType = normalizeGameType(event.gameType || state.games.find((game) => game.id === event.gameId)?.game?.gameType);
  });
  state.fullChartSide = state.fullChartSide || state.activeSide || "away";
  state.settings = {
    showAtBatControls: false,
    showFocusControls: false,
    showStatExplanations: true,
    lineScoreExpandedTeam: "",
    expandedTeamRecords: {},
    ...(state.settings || {})
  };
  if (state.settings.statExplanationDefaulted !== "v23") {
    state.settings.showStatExplanations = true;
    state.settings.statExplanationDefaulted = "v23";
  }
  state.settings.expandedTeamRecords = {
    home: false,
    away: false,
    ...(state.settings.expandedTeamRecords || {})
  };
  state.hudStatScopes = {
    batter: "overall",
    pitcher: "overall",
    ...(state.hudStatScopes || {})
  };
  ["batter", "pitcher"].forEach((kind) => {
    if (!["overall", "conference", "nonconference", "currentgame", "series"].includes(state.hudStatScopes[kind])) {
      state.hudStatScopes[kind] = "overall";
    }
  });
  state.hudStatViews = {
    batter: "basic",
    pitcher: "basic",
    ...(state.hudStatViews || {})
  };
  ["batter", "pitcher"].forEach((kind) => {
    if (!["basic", "advanced"].includes(state.hudStatViews[kind])) state.hudStatViews[kind] = "basic";
  });
  state.pinStatHud = state.pinStatHud ?? Boolean(state.pinScorecard);
  state.players = state.players || [];
  state.players.forEach((player) => {
    player.side = player.side || "home";
    player.hometown = player.hometown || "";
    player.height = player.height || "";
    player.weight = player.weight || "";
    player.handedness = player.handedness || "";
    player.stats = { ...emptyStats(), ...(player.stats || {}) };
    player.confStats = { ...emptyStats(), ...(player.confStats || {}) };
  });
  mergeDuplicatePlayers();
}

function saveState() {
  syncSharedTeamMetaToGames();
  const serialized = JSON.stringify(state);
  const localSaved = persistStateSnapshot(serialized);
  if (!localSaved) {
    setCloudSyncStatus(supabaseSession ? "Cloud save pending; local backup pending" : "Local backup pending");
  }
  if (els.saveState) {
    els.saveState.textContent = `${localSaved ? "Saved" : "Backup pending"} ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  schedulePushState();
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function toNumber(value) {
  if (value === undefined || value === null || value === "" || value === "-" || value === "'-") return 0;
  const normalized = String(value).replace(/^'/, "").replace("%", "");
  if (normalized === "-" || normalized === "") return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatRate(value) {
  if (!Number.isFinite(value)) return ".000";
  const fixed = value.toFixed(3);
  return fixed.startsWith("0") ? fixed.slice(1) : fixed;
}

function formatFixed(value, digits = 2) {
  const n = toNumber(value);
  return n.toFixed(digits);
}

function ipToOuts(value) {
  if (value === undefined || value === null || value === "") return 0;
  const text = String(value).trim();
  if (!text) return 0;
  const [wholeRaw, partialRaw = "0"] = text.split(".");
  const whole = toNumber(wholeRaw);
  const partial = Math.min(2, Math.max(0, toNumber(partialRaw.slice(0, 1))));
  return whole * 3 + partial;
}

function outsToIpValue(outs) {
  const safeOuts = Math.max(0, Math.round(toNumber(outs)));
  return Number(`${Math.floor(safeOuts / 3)}.${safeOuts % 3}`);
}

function formatIpValue(value) {
  return formatIpFromOuts(ipToOuts(value));
}

function activeGame() {
  return state.games[state.activeGameIndex ?? 0];
}

function activeChart() {
  return activeGame().charts[state.activeSide];
}

function normalizeGameType(value) {
  return value === "conference" ? "conference" : "nonconference";
}

function activeGameType() {
  return normalizeGameType(activeGame()?.game?.gameType);
}

function statBucketsForGameType(gameType = activeGameType()) {
  return normalizeGameType(gameType) === "conference" ? ["stats", "confStats"] : ["stats"];
}

function eventBelongsToGame(event, gameId = activeGame()?.id) {
  return (event?.gameId || gameId) === gameId;
}

function activeGameEvents() {
  const gameId = activeGame()?.id;
  return (state.events || []).filter((event) => eventBelongsToGame(event, gameId));
}

function applyRunnerStatDeltaToBuckets(item, direction, buckets) {
  const player = state.players.find((candidate) => candidate.id === item.playerId);
  if (!player) return;
  buckets.forEach((bucket) => {
    const stats = ensureStatBucket(player, bucket);
    stats[item.key] = Math.max(0, toNumber(stats[item.key]) + toNumber(item.value) * direction);
  });
}

function migrateActiveGameConferenceStats(oldType, nextType) {
  if (oldType === nextType) return;
  const direction = nextType === "conference" ? 1 : -1;
  const confOnly = ["confStats"];
  activeGameEvents().forEach((event) => {
    applyEventToBuckets(event, direction, confOnly);
    event.gameType = nextType;
  });
  Object.values(activeGame().charts || {}).forEach((chart) => {
    Object.entries(chart.pitchingLines || {}).forEach(([pitcherId, line]) => {
      applyPitchingStatUpdatesToBuckets(pitcherId, line, confOnly, direction);
    });
    Object.values(chart.scorecard || {}).forEach((cell) => {
      cell.gameType = nextType;
      (cell.pitchDeltas || []).forEach((pitch) => { pitch.gameType = nextType; });
      (cell.runnerPitcherDeltas || []).forEach((delta) => { delta.gameType = nextType; });
      (cell.runnerStatDeltas || []).forEach((delta) => {
        applyRunnerStatDeltaToBuckets(delta, direction, confOnly);
        delta.gameType = nextType;
      });
    });
  });
}

function setActiveGameType(value) {
  const game = activeGame();
  const oldType = activeGameType();
  const nextType = normalizeGameType(value);
  if (oldType === nextType) {
    game.game.gameType = nextType;
    return;
  }
  migrateActiveGameConferenceStats(oldType, nextType);
  game.game.gameType = nextType;
}

function cleanSubText(value) {
  return String(value || "").trim();
}

function normalizeSubstitutionEntry(entry = {}) {
  const normalized = {
    batterPlayerId: "",
    batterText: "",
    runnerPlayerId: "",
    runnerText: ""
  };
  if (!entry || typeof entry !== "object") return normalized;
  if (
    Object.prototype.hasOwnProperty.call(entry, "batterPlayerId")
    || Object.prototype.hasOwnProperty.call(entry, "batterText")
    || Object.prototype.hasOwnProperty.call(entry, "runnerPlayerId")
    || Object.prototype.hasOwnProperty.call(entry, "runnerText")
  ) {
    return {
      ...normalized,
      ...entry,
      batterText: cleanSubText(entry.batterText),
      runnerText: cleanSubText(entry.runnerText)
    };
  }

  const legacyType = String(entry.type || "").toUpperCase();
  if (/(PR|CR|COURTESY)/.test(legacyType)) {
    normalized.runnerPlayerId = entry.playerId || "";
    normalized.runnerText = cleanSubText(entry.text);
    return normalized;
  }

  normalized.batterPlayerId = entry.playerId || "";
  normalized.batterText = cleanSubText(entry.text);
  return normalized;
}

function getSlotSubstitution(slotIndex, chart = activeChart()) {
  chart.substitutions = chart.substitutions || {};
  chart.substitutions[slotIndex] = normalizeSubstitutionEntry(chart.substitutions[slotIndex]);
  return chart.substitutions[slotIndex];
}

function lineupPlayerIdAtSlot(slot) {
  return activeChart().lineup[slot - 1] || "";
}

function batterIdAtSlot(slot) {
  const sub = getSlotSubstitution(slot - 1);
  return sub.batterPlayerId || lineupPlayerIdAtSlot(slot);
}

function runnerIdAtSlot(slot) {
  const sub = getSlotSubstitution(slot - 1);
  return sub.runnerPlayerId || batterIdAtSlot(slot);
}

function playerById(playerId) {
  return playerId ? state.players.find((item) => item.id === playerId) : null;
}

function playerAtSlot(slot) {
  return playerById(batterIdAtSlot(slot));
}

function runnerPlayerAtSlot(slot) {
  return playerById(runnerIdAtSlot(slot));
}

function formatPlayerLabel(player, { short = false } = {}) {
  if (!player) return "";
  const name = short ? (player.last || fullName(player)) : fullName(player);
  return `#${player.number} ${name}`.trim();
}

function batterDisplayLabelAtSlot(slot, opts = {}) {
  const override = cleanSubText(getSlotSubstitution(slot - 1).batterText);
  if (override) return override;
  const player = playerAtSlot(slot);
  return player ? formatPlayerLabel(player, opts) : `Lineup ${slot}`;
}

function runnerDisplayLabelAtSlot(slot, opts = {}) {
  const override = cleanSubText(getSlotSubstitution(slot - 1).runnerText);
  if (override) return override;
  const player = runnerPlayerAtSlot(slot);
  if (player) return formatPlayerLabel(player, opts);
  return batterDisplayLabelAtSlot(slot, opts);
}

function slotForRunnerId(runnerId) {
  if (!runnerId) return 0;
  for (let slot = 1; slot <= lineupLength(); slot += 1) {
    if (runnerIdAtSlot(slot) === runnerId) return slot;
  }
  return 0;
}

function baseOccupantLabel(base) {
  const runnerId = activeChart().baseState[base];
  if (!runnerId) return "--";
  const slot = slotForRunnerId(runnerId);
  if (slot) return runnerDisplayLabelAtSlot(slot, { short: true });
  const player = playerById(runnerId);
  return player ? formatPlayerLabel(player, { short: true }) : "--";
}

function activePlayers() {
  return state.players.filter((player) => (player.side || "home") === state.activeSide);
}

function activeSideName() {
  return teamAbbreviation(state.activeSide);
}

function oppositeSide() {
  return state.activeSide === "home" ? "away" : "home";
}

function playersForSide(side) {
  return state.players
    .filter((player) => (player.side || "home") === side)
    .sort((a, b) => {
      const aNum = Number(a.number);
      const bNum = Number(b.number);
      if (Number.isFinite(aNum) && Number.isFinite(bNum)) return aNum - bNum;
      return fullName(a).localeCompare(fullName(b));
    });
}

function battingPlateAppearances(stats = {}) {
  return toNumber(stats.PA) || toNumber(stats.AB) + toNumber(stats.BB) + toNumber(stats.HBP) + toNumber(stats.SF);
}

function battingExtraBaseHits(stats = {}) {
  return toNumber(stats["2B"]) + toNumber(stats["3B"]) + toNumber(stats.HR);
}

function battingSingles(stats = {}) {
  return Math.max(0, toNumber(stats.H) - battingExtraBaseHits(stats));
}

function battingTotalBases(stats = {}) {
  const derived = battingSingles(stats) + toNumber(stats["2B"]) * 2 + toNumber(stats["3B"]) * 3 + toNumber(stats.HR) * 4;
  return derived || toNumber(stats.TB);
}

function formatRatio(numerator, denominator, digits = 2) {
  const denom = toNumber(denominator);
  return denom ? formatFixed(toNumber(numerator) / denom, digits) : "-";
}

function calcStats(stats) {
  const singles = battingSingles(stats);
  const totalBases = battingTotalBases(stats);
  const ab = toNumber(stats.AB);
  const h = toNumber(stats.H);
  const bb = toNumber(stats.BB);
  const hbp = toNumber(stats.HBP);
  const sf = toNumber(stats.SF);
  const obpDenom = ab + bb + hbp + sf;
  const avg = ab ? h / ab : 0;
  const obp = obpDenom ? (h + bb + hbp) / obpDenom : 0;
  const slg = ab ? totalBases / ab : 0;
  return {
    AVG: formatRate(avg),
    OBP: formatRate(obp),
    SLG: formatRate(slg),
    OPS: formatRate(obp + slg),
    TB: totalBases,
    singles
  };
}

function advancedStats(stats) {
  const rates = calcStats(stats);
  const paDenom = battingPlateAppearances(stats);
  const iso = (toNumber(rates.SLG) - toNumber(rates.AVG)).toFixed(3).replace(/^0/, "");
  const bbPct = paDenom ? `${((toNumber(stats.BB) / paDenom) * 100).toFixed(1)}%` : "--";
  const kPct = paDenom ? `${((toNumber(stats.SO) / paDenom) * 100).toFixed(1)}%` : "--";
  const babipDenom = toNumber(stats.AB) - toNumber(stats.SO) - toNumber(stats.HR) + toNumber(stats.SF);
  const babip = babipDenom > 0 ? formatRate((toNumber(stats.H) - toNumber(stats.HR)) / babipDenom) : ".000";
  const xbh = battingExtraBaseHits(stats);
  return {
    ...rates,
    ISO: iso,
    BBP: bbPct,
    KP: kPct,
    BBK: formatRatio(stats.BB, stats.SO),
    BABIP: babip,
    XBH: xbh,
    XBH_PA: percentValue(xbh, paDenom),
    HR_PA: percentValue(stats.HR, paDenom),
    RUN_PRODUCTION: Math.max(0, toNumber(stats.R) + toNumber(stats.RBI) - toNumber(stats.HR))
  };
}

function fullName(player) {
  return [player.first, player.last].filter(Boolean).join(" ") || "Unnamed player";
}

const positionLabels = {
  1: "P",
  2: "C",
  3: "1B",
  4: "2B",
  5: "3B",
  6: "SS",
  7: "LF",
  8: "CF",
  9: "RF",
  DH: "DH",
  DP: "DP",
  FLEX: "FLEX"
};

function displayPosition(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw
    .split(/[\/, ]+/)
    .filter(Boolean)
    .map((part) => positionLabels[part.toUpperCase()] || positionLabels[part] || part.toUpperCase())
    .join(" / ");
}

function sortedPlayers() {
  return playersForSide(state.activeSide);
}

let rosterEditModalOpen = false;
let rosterEditPlayerId = "";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((item) => item.some((value) => value.trim() !== ""));
}

function normalizedHeaderName(value) {
  return String(value || "").trim().toLowerCase();
}

function rowHasHeaders(row, names) {
  const normalized = row.map(normalizedHeaderName);
  return names.every((name) => normalized.includes(normalizedHeaderName(name)));
}

function headerIndex(headers, name, occurrence = 1) {
  const target = normalizedHeaderName(name);
  let seen = 0;
  for (let i = 0; i < headers.length; i += 1) {
    if (normalizedHeaderName(headers[i]) === target) {
      seen += 1;
      if (seen === occurrence) return i;
    }
  }
  return -1;
}

function valueFrom(row, headers, name, occurrence = 1) {
  const index = headerIndex(headers, name, occurrence);
  return index >= 0 ? row[index] : "";
}

function valueFromFirst(row, headers, lookups) {
  for (const lookup of lookups) {
    const name = Array.isArray(lookup) ? lookup[0] : lookup;
    const occurrence = Array.isArray(lookup) ? lookup[1] : 1;
    const value = valueFrom(row, headers, name, occurrence);
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return "";
}

function gameChangerStatsFromRow(row, headers) {
  const pitchesRaw = toNumber(valueFromFirst(row, headers, ["#P", "NumberOfPitches", "Number Of Pitches", "Pitches", "NP"]));
  const strikePctRaw = toNumber(valueFrom(row, headers, "S%", 1));
  const strikesDerived = pitchesRaw && strikePctRaw ? Math.round(pitchesRaw * strikePctRaw / 100) : 0;
  const balks = toNumber(valueFromFirst(row, headers, ["BK", "Balks", "BalksAgainst"]));

  return {
    ...emptyStats(),
    GP: toNumber(valueFrom(row, headers, "GP", 1)),
    PA: toNumber(valueFrom(row, headers, "PA")),
    AB: toNumber(valueFrom(row, headers, "AB")),
    H: toNumber(valueFrom(row, headers, "H", 1)),
    "2B": toNumber(valueFrom(row, headers, "2B")),
    "3B": toNumber(valueFrom(row, headers, "3B")),
    HR: toNumber(valueFrom(row, headers, "HR", 1)),
    RBI: toNumber(valueFrom(row, headers, "RBI")),
    R: toNumber(valueFrom(row, headers, "R")),
    BB: toNumber(valueFrom(row, headers, "BB", 1)),
    SO: toNumber(valueFrom(row, headers, "SO", 1)),
    HBP: toNumber(valueFrom(row, headers, "HBP", 1)),
    SF: toNumber(valueFrom(row, headers, "SF")),
    SB: toNumber(valueFrom(row, headers, "SB", 1)),
    CS: toNumber(valueFrom(row, headers, "CS", 1)),
    TB: toNumber(valueFrom(row, headers, "TB")),
    IP: toNumber(valueFromFirst(row, headers, ["IP", "InningsPitched", "Innings Pitched"])),
    P_GP: toNumber(valueFromFirst(row, headers, [["GP", 2], "App", "APP", "Apps", "Appearances"])),
    GS: toNumber(valueFrom(row, headers, "GS")),
    BF: toNumber(valueFromFirst(row, headers, ["BF", "BattersFaced", "Batters Faced"])),
    W: toNumber(valueFrom(row, headers, "W")),
    L: toNumber(valueFrom(row, headers, "L")),
    Pitches: pitchesRaw,
    Strikes: strikesDerived,
    ERA: toNumber(valueFrom(row, headers, "ERA")),
    WHIP: toNumber(valueFrom(row, headers, "WHIP")),
    BAA: toNumber(valueFrom(row, headers, "BAA")),
    BK: balks,
    P_HR: toNumber(valueFromFirst(row, headers, [["HR", 2], "HomeRunsAgainst", "Home Runs Against", "HRA"])),
    P_2B: toNumber(valueFromFirst(row, headers, [["2B", 2], "DoublesAgainst", "Doubles Against"])),
    P_3B: toNumber(valueFromFirst(row, headers, [["3B", 2], "TriplesAgainst", "Triples Against"])),
    P_BB: toNumber(valueFromFirst(row, headers, [["BB", 2], "BaseOnBallsAgainst", "Base On Balls Against", "WalksAgainst", "Walks Against"])),
    P_SO: toNumber(valueFromFirst(row, headers, [["SO", 2], "BattersStruckOut", "Batters Struck Out", ["K", 2], "StrikeoutsAgainst"])),
    P_H: toNumber(valueFromFirst(row, headers, [["H", 2], "HitsAgainst", "Hits Against", "HA"])),
    P_R: toNumber(valueFromFirst(row, headers, [["R", 2], "RunsAgainst", "Runs Against", "RA"])),
    P_ER: toNumber(valueFromFirst(row, headers, ["ER", "EarnedRuns", "Earned Runs"])),
    P_BK: balks,
    P_HBP: toNumber(valueFromFirst(row, headers, [["HBP", 2], "HitBatter", "Hit Batter", "HitBatters", "HB"])),
    P_WP: toNumber(valueFromFirst(row, headers, ["WP", "WildPitches", "Wild Pitches"])),
    P_AB: toNumber(valueFromFirst(row, headers, [["AB", 2], "AtBatsAgainst", "At Bats Against", "ABAgainst"])),
    CG: toNumber(valueFromFirst(row, headers, ["CG", "CompleteGames", "Complete Games"])),
    SHO: toNumber(valueFromFirst(row, headers, ["SHO", "Shutouts"])),
    SV: toNumber(valueFromFirst(row, headers, ["SV", "Saves"])),
    SFA: toNumber(valueFromFirst(row, headers, ["SFA", "SacFliesAgainst", "Sac Flies Against"])),
    SHA: toNumber(valueFromFirst(row, headers, ["SHA", "SacHitsAgainst", "Sac Hits Against"])),
    TC: toNumber(valueFrom(row, headers, "TC")),
    PO: toNumber(valueFrom(row, headers, "PO")),
    A: toNumber(valueFrom(row, headers, "A")),
    E: toNumber(valueFrom(row, headers, "E")),
    F_PCT: toNumber(valueFromFirst(row, headers, ["FPCT", "F%"])),
    DP: toNumber(valueFrom(row, headers, "DP")),
    SBA: toNumber(valueFromFirst(row, headers, ["SBATT", "SBA"])),
    RCS: toNumber(valueFrom(row, headers, "CS", 3)),
    RCS_PCT: toNumber(valueFromFirst(row, headers, ["CS%", "RCS%"])),
    PB: toNumber(valueFrom(row, headers, "PB")),
    CI: toNumber(valueFrom(row, headers, "CI", 2))
  };
}

function importPlayersFromCsv(text, filename, scope = "overall") {
  const rows = parseCsv(text);
  const headerRowIndex = rows.findIndex((row) => rowHasHeaders(row, ["Number", "Last", "First"]));
  if (headerRowIndex < 0) {
    throw new Error("Could not find a roster/stat header row with Number, Last, and First columns.");
  }

  const headers = rows[headerRowIndex].map((header) => header.trim());
  const imported = [];
  const bucket = scope === "conference" ? "confStats" : "stats";

  rows.slice(headerRowIndex + 1).forEach((row) => {
    const number = valueFrom(row, headers, "Number").trim();
    const last = valueFrom(row, headers, "Last").trim();
    const first = valueFrom(row, headers, "First").trim();
    if (!number && !last && !first) return;
    const parsedStats = gameChangerStatsFromRow(row, headers);

    imported.push({
      id: uid("player"),
      number,
      first,
      last,
      pronunciation: "",
      position: "",
      hometown: valueFrom(row, headers, "Hometown").trim(),
      classYear: "",
      height: valueFrom(row, headers, "Height").trim() || valueFrom(row, headers, "Ht").trim(),
      weight: valueFrom(row, headers, "Weight").trim() || valueFrom(row, headers, "Wt").trim(),
      notes: "",
      side: state.activeSide,
      stats: bucket === "stats" ? parsedStats : {},
      confStats: bucket === "confStats" ? parsedStats : {}
    });
  });

  mergePlayers(imported);

  state.sources.unshift({
    id: uid("source"),
    type: "csv",
    name: filename,
    importedAt: new Date().toISOString(),
    detail: `${imported.length} player rows`,
    source: "gamechanger",
    scope,
    variant: "season"
  });

  if (!activeChart().lineup.some(Boolean)) autoFillLineup();
  saveState();
  render();
}

function mergePlayers(imported) {
  const byJersey = new Map();
  state.players.forEach((player) => {
    if (!player.number) return;
    byJersey.set(`${player.side || "home"}-${String(player.number).trim().toLowerCase()}`, player);
  });
  const byKey = new Map(state.players.map((player) => [`${player.side || "home"}-${player.number}-${player.first}-${player.last}`.toLowerCase(), player]));
  const byName = new Map();
  state.players.forEach((player) => {
    playerNameMergeKeys(player).forEach((key) => {
      if (!byName.has(key)) byName.set(key, player);
    });
  });

  imported.forEach((player) => {
    const fullKey = `${player.side}-${player.number}-${player.first}-${player.last}`.toLowerCase();
    const jerseyKey = player.number ? `${player.side}-${String(player.number).trim().toLowerCase()}` : "";
    const nameKeys = playerNameMergeKeys(player);
    const existingByName = nameKeys.map((key) => byName.get(key)).find(Boolean) || null;
    const existingByJersey = jerseyKey ? byJersey.get(jerseyKey) : null;
    const existing = byKey.get(fullKey)
      || (existingByJersey && existingByName && existingByJersey !== existingByName && !playersNameCompatible(existingByJersey, player) ? existingByName : null)
      || existingByJersey
      || existingByName;
    if (existing) {
      const mergedStats = { ...existing.stats, ...(player.stats || {}) };
      const mergedConf = { ...(existing.confStats || emptyStats()), ...(player.confStats || {}) };
      Object.assign(existing, {
        ...player,
        id: existing.id,
        pronunciation: existing.pronunciation || player.pronunciation || "",
        hometown: existing.hometown || player.hometown || "",
        position: existing.position || player.position || "",
        classYear: existing.classYear || player.classYear || "",
        height: existing.height || player.height || "",
        weight: existing.weight || player.weight || "",
        notes: existing.notes || "",
        handedness: existing.handedness || player.handedness || "",
        stats: mergedStats,
        confStats: mergedConf
      });
      byKey.set(fullKey, existing);
      if (jerseyKey) byJersey.set(jerseyKey, existing);
      nameKeys.forEach((key) => byName.set(key, existing));
    } else {
      const filled = {
        ...player,
        stats: { ...emptyStats(), ...(player.stats || {}) },
        confStats: { ...emptyStats(), ...(player.confStats || {}) }
      };
      state.players.push(filled);
      byKey.set(fullKey, filled);
      if (jerseyKey) byJersey.set(jerseyKey, filled);
      nameKeys.forEach((key) => byName.set(key, filled));
    }
  });

  mergeDuplicatePlayers();
}

function playerNameMergeKey(player = {}) {
  return playerNameMergeKeys(player)[0] || "";
}

function playerNameMergeKeys(player = {}) {
  const side = player.side || "home";
  const values = new Set();
  const addName = (value) => {
    const normalized = normalizeBoxScoreName(value);
    if (normalized && normalized.split(/\s+/).length >= 2) values.add(`${side}|${normalized}`);
  };

  const first = String(player.first || "").trim();
  const last = String(player.last || "").trim();
  addName([first, last].filter(Boolean).join(" "));
  addName(fullName(player));

  [first, last].forEach((part) => {
    const text = String(part || "").trim();
    if (!text.includes(",")) return;
    const [left, ...rest] = text.split(",");
    addName(`${rest.join(" ").trim()} ${left.trim()}`);
  });

  if (!first && last) {
    const pieces = last.split(/\s+/).filter(Boolean);
    if (pieces.length === 2) addName(`${pieces[1]} ${pieces[0]}`);
  }
  if (first && !last) {
    const pieces = first.split(/\s+/).filter(Boolean);
    if (pieces.length === 2) addName(`${pieces[1]} ${pieces[0]}`);
  }
  if (first && last) {
    addName(`${last} ${first}`);
  }

  return [...values];
}

function playersNameCompatible(left = {}, right = {}) {
  const leftKeys = playerNameMergeKeys(left);
  const rightKeys = new Set(playerNameMergeKeys(right));
  if (!leftKeys.length || !rightKeys.size) return true;
  return leftKeys.some((key) => rightKeys.has(key));
}

function playerNumberMergeKey(player = {}) {
  const number = cleanBoxScoreNumber(player.number);
  return number ? `${player.side || "home"}|${number}` : "";
}

function playerDataWeight(player = {}) {
  const statWeight = (line) => Object.values(line || {}).reduce((sum, value) => sum + (toNumber(value) ? 1 : 0), 0);
  return statWeight(player.stats) + statWeight(player.confStats) + [player.number, player.position, player.hometown, player.height, player.weight, player.handedness, player.notes].filter(Boolean).length;
}

function referencedPlayerIds() {
  const ids = new Set();
  const add = (id) => { if (id) ids.add(id); };
  (state.events || []).forEach((event) => {
    add(event.playerId);
    add(event.pitcherId);
  });
  (state.boxScores || []).forEach((box) => {
    (box.lines || []).forEach((line) => add(line.playerId));
  });
  (state.games || []).forEach((game) => {
    Object.values(game.charts || {}).forEach((chart) => {
      (chart.lineup || []).forEach(add);
      add(chart.activePitcherId);
      add(chart.startingPitcherId);
      (chart.bullpenIds || []).forEach(add);
      Object.values(chart.baseState || {}).forEach(add);
      Object.values(chart.baseStates || {}).forEach((baseState) => Object.values(baseState || {}).forEach(add));
      Object.values(chart.scorecard || {}).forEach((cell) => {
        add(cell.runnerId);
        add(cell.pitcherId);
        Object.values(cell.baseStateBefore || {}).forEach(add);
        (cell.runnerStatDeltas || []).forEach((item) => add(item.playerId));
        (cell.runnerPitcherDeltas || []).forEach((item) => add(item.pitcherId));
        (cell.pitchDeltas || []).forEach((item) => add(item.pitcherId));
        (cell.runnerDiamondBefore || []).forEach((item) => add(item.runnerId));
      });
    });
  });
  return ids;
}

function mergeDuplicateStatLine(target = {}, source = {}) {
  const merged = { ...emptyStats(), ...(target || {}) };
  Object.entries(source || {}).forEach(([key, value]) => {
    const incoming = toNumber(value);
    const current = toNumber(merged[key]);
    if (incoming || !current) merged[key] = value;
  });
  return merged;
}

function mergePlayerIdentity(target, source) {
  ["number", "first", "last", "pronunciation", "position", "hometown", "classYear", "height", "weight", "handedness", "notes"].forEach((field) => {
    if (!String(target[field] || "").trim() && String(source[field] || "").trim()) target[field] = source[field];
  });
  target.stats = mergeDuplicateStatLine(target.stats, source.stats);
  target.confStats = mergeDuplicateStatLine(target.confStats, source.confStats);
}

function replacePlayerIdInBaseState(baseState, fromId, toId) {
  if (!baseState) return;
  ["first", "second", "third"].forEach((base) => {
    if (baseState[base] === fromId) baseState[base] = toId;
  });
}

function remapPlayerReferences(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return;
  const swap = (id) => id === fromId ? toId : id;
  (state.events || []).forEach((event) => {
    event.playerId = swap(event.playerId);
    event.pitcherId = swap(event.pitcherId);
  });
  (state.boxScores || []).forEach((box) => {
    (box.lines || []).forEach((line) => { line.playerId = swap(line.playerId); });
  });
  (state.games || []).forEach((game) => {
    Object.values(game.charts || {}).forEach((chart) => {
      chart.lineup = (chart.lineup || []).map(swap);
      chart.activePitcherId = swap(chart.activePitcherId);
      chart.startingPitcherId = swap(chart.startingPitcherId);
      chart.bullpenIds = [...new Set((chart.bullpenIds || []).map(swap).filter(Boolean))];
      replacePlayerIdInBaseState(chart.baseState, fromId, toId);
      Object.values(chart.baseStates || {}).forEach((baseState) => replacePlayerIdInBaseState(baseState, fromId, toId));
      if (chart.pitchingLines?.[fromId]) {
        chart.pitchingLines[toId] = { ...blankPitchingLine(), ...(chart.pitchingLines[toId] || {}) };
        addLivePitchingLineToLine(chart.pitchingLines[toId], chart.pitchingLines[fromId]);
        delete chart.pitchingLines[fromId];
      }
      if (chart.pitchCounts?.[fromId]) {
        chart.pitchCounts[toId] = toNumber(chart.pitchCounts[toId]) + toNumber(chart.pitchCounts[fromId]);
        delete chart.pitchCounts[fromId];
      }
      (chart.pitchLog || []).forEach((pitch) => { pitch.pitcherId = swap(pitch.pitcherId); });
      Object.values(chart.scorecard || {}).forEach((cell) => {
        cell.runnerId = swap(cell.runnerId);
        cell.pitcherId = swap(cell.pitcherId);
        replacePlayerIdInBaseState(cell.baseStateBefore, fromId, toId);
        (cell.runnerStatDeltas || []).forEach((item) => { item.playerId = swap(item.playerId); });
        (cell.runnerPitcherDeltas || []).forEach((item) => { item.pitcherId = swap(item.pitcherId); });
        (cell.pitchDeltas || []).forEach((item) => { item.pitcherId = swap(item.pitcherId); });
        (cell.runnerDiamondBefore || []).forEach((item) => { item.runnerId = swap(item.runnerId); });
      });
    });
  });
}

function mergeDuplicatePlayerGroup(group, referencedIds) {
  if (group.length < 2) return null;
  const indexed = group.map((player, index) => ({ player, index }));
  indexed.sort((a, b) => {
    const refDelta = Number(referencedIds.has(b.player.id)) - Number(referencedIds.has(a.player.id));
    if (refDelta) return refDelta;
    const dataDelta = playerDataWeight(b.player) - playerDataWeight(a.player);
    if (dataDelta) return dataDelta;
    return a.index - b.index;
  });
  const target = indexed[0].player;
  indexed.slice(1).forEach(({ player }) => {
    mergePlayerIdentity(target, player);
    remapPlayerReferences(player.id, target.id);
  });
  return target.id;
}

function mergeDuplicatePlayers() {
  if (!Array.isArray(state.players) || state.players.length < 2) return;
  const referenced = referencedPlayerIds();
  const removeIds = new Set();
  const byNumber = new Map();
  state.players.forEach((player) => {
    const key = playerNumberMergeKey(player);
    if (!key) return;
    if (!byNumber.has(key)) byNumber.set(key, []);
    byNumber.get(key).push(player);
  });

  byNumber.forEach((group) => {
    const alive = group.filter((player) => !removeIds.has(player.id));
    if (alive.length < 2) return;
    const targetId = mergeDuplicatePlayerGroup(alive, referenced);
    if (targetId) {
      alive.forEach((player) => { if (player.id !== targetId) removeIds.add(player.id); });
    }
  });

  const byName = new Map();
  state.players.forEach((player) => {
    if (removeIds.has(player.id)) return;
    playerNameMergeKeys(player).forEach((key) => {
      if (!byName.has(key)) byName.set(key, []);
      const group = byName.get(key);
      if (!group.includes(player)) group.push(player);
    });
  });

  byName.forEach((group) => {
    if (group.length < 2) return;
    const numberBuckets = new Map();
    const withoutNumber = [];
    group.forEach((player) => {
      const numberKey = playerNumberMergeKey(player);
      if (!numberKey) {
        withoutNumber.push(player);
        return;
      }
      if (!numberBuckets.has(numberKey)) numberBuckets.set(numberKey, []);
      numberBuckets.get(numberKey).push(player);
    });

    numberBuckets.forEach((bucket) => {
      const targetId = mergeDuplicatePlayerGroup(bucket, referenced);
      if (targetId) {
        bucket.forEach((player) => { if (player.id !== targetId) removeIds.add(player.id); });
      }
    });

    if (numberBuckets.size === 1 && withoutNumber.length) {
      const bucket = [...numberBuckets.values()][0].filter((player) => !removeIds.has(player.id));
      const targetId = mergeDuplicatePlayerGroup([...bucket, ...withoutNumber], referenced);
      if (targetId) {
        [...bucket, ...withoutNumber].forEach((player) => { if (player.id !== targetId) removeIds.add(player.id); });
      }
    } else if (!numberBuckets.size && withoutNumber.length > 1) {
      const targetId = mergeDuplicatePlayerGroup(withoutNumber, referenced);
      if (targetId) {
        withoutNumber.forEach((player) => { if (player.id !== targetId) removeIds.add(player.id); });
      }
    }
  });

  if (removeIds.size) {
    state.players = state.players.filter((player) => !removeIds.has(player.id));
  }
}

function detectPrestoVariant(headers) {
  const lower = headers.map((h) => String(h || "").trim().toLowerCase());
  const has = (col) => lower.includes(col);
  if (has("era") && has("whip")) return "pitching";
  if (has("tc") && has("f%")) return "fielding";
  if (has("tb") && has("sb") && !has("ab")) return "baserunning";
  if (has("ab") && (has("avg") || has("obp"))) return "hitting";
  return null;
}

function isPrestoCsvHeader(headers) {
  const trimmed = headers.map((h) => String(h || "").trim());
  return rowHasHeaders(trimmed, ["#", "Name"]) && Boolean(detectPrestoVariant(trimmed));
}

function splitPrestoName(value) {
  const collapsed = String(value || "").replace(/\s+/g, " ").trim();
  if (!collapsed) return { first: "", last: "" };
  const idx = collapsed.indexOf(" ");
  if (idx < 0) return { first: "", last: collapsed };
  return { first: collapsed.slice(0, idx).trim(), last: collapsed.slice(idx + 1).trim() };
}

const prestoStatMaps = {
  hitting: (row, headers) => ({
    GP: toNumber(valueFrom(row, headers, "gp")),
    PA: toNumber(valueFrom(row, headers, "pa")),
    AB: toNumber(valueFrom(row, headers, "ab")),
    H: toNumber(valueFrom(row, headers, "h")),
    "2B": toNumber(valueFrom(row, headers, "2b")),
    "3B": toNumber(valueFrom(row, headers, "3b")),
    HR: toNumber(valueFrom(row, headers, "hr")),
    RBI: toNumber(valueFrom(row, headers, "rbi")),
    BB: toNumber(valueFrom(row, headers, "bb")),
    SO: toNumber(valueFrom(row, headers, "k")),
    HBP: toNumber(valueFrom(row, headers, "hbp")),
    SF: toNumber(valueFrom(row, headers, "sf"))
  }),
  baserunning: (row, headers) => ({
    R: toNumber(valueFrom(row, headers, "r")),
    TB: toNumber(valueFrom(row, headers, "tb")),
    SB: toNumber(valueFrom(row, headers, "sb")),
    CS: toNumber(valueFrom(row, headers, "cs"))
  }),
  pitching: (row, headers) => ({
    ERA: toNumber(valueFrom(row, headers, "era")),
    W: toNumber(valueFrom(row, headers, "w")),
    L: toNumber(valueFrom(row, headers, "l")),
    P_GP: toNumber(valueFromFirst(row, headers, ["app", "apps", "gp", "appearances"])),
    GS: toNumber(valueFrom(row, headers, "gs")),
    IP: toNumber(valueFrom(row, headers, "ip")),
    P_H: toNumber(valueFrom(row, headers, "h")),
    P_R: toNumber(valueFrom(row, headers, "r")),
    P_ER: toNumber(valueFrom(row, headers, "er")),
    P_BB: toNumber(valueFrom(row, headers, "bb")),
    P_SO: toNumber(valueFrom(row, headers, "k")),
    P_HR: toNumber(valueFrom(row, headers, "hr")),
    P_2B: toNumber(valueFrom(row, headers, "2b")),
    P_3B: toNumber(valueFrom(row, headers, "3b")),
    WHIP: toNumber(valueFrom(row, headers, "whip")),
    BF: toNumber(valueFrom(row, headers, "bf")),
    P_WP: toNumber(valueFrom(row, headers, "wp")),
    P_HBP: toNumber(valueFrom(row, headers, "hbp")),
    P_AB: toNumber(valueFrom(row, headers, "ab")),
    CG: toNumber(valueFrom(row, headers, "cg")),
    SHO: toNumber(valueFrom(row, headers, "sho")),
    SV: toNumber(valueFrom(row, headers, "sv")),
    SFA: toNumber(valueFrom(row, headers, "sfa")),
    SHA: toNumber(valueFrom(row, headers, "sha"))
  }),
  fielding: (row, headers) => ({
    TC: toNumber(valueFrom(row, headers, "tc")),
    PO: toNumber(valueFrom(row, headers, "po")),
    A: toNumber(valueFrom(row, headers, "a")),
    E: toNumber(valueFrom(row, headers, "e")),
    F_PCT: toNumber(valueFrom(row, headers, "f%")),
    DP: toNumber(valueFrom(row, headers, "dp")),
    SBA: toNumber(valueFrom(row, headers, "sba")),
    RCS: toNumber(valueFrom(row, headers, "rcs")),
    RCS_PCT: toNumber(valueFrom(row, headers, "rcs%")),
    PB: toNumber(valueFrom(row, headers, "pb")),
    CI: toNumber(valueFrom(row, headers, "ci"))
  })
};

function importPrestoStatsFromCsv(text, filename, scope = "overall") {
  const rows = parseCsv(text);
  const headerRowIndex = rows.findIndex((row) => rowHasHeaders(row, ["#", "Name"]));
  if (headerRowIndex < 0) {
    throw new Error("Could not find a PrestoSports header row (#, Name, ...).");
  }
  const headers = rows[headerRowIndex].map((header) => String(header).trim());
  const variant = detectPrestoVariant(headers);
  if (!variant) {
    throw new Error("Could not detect PrestoSports CSV variant (hitting / baserunning / pitching / fielding).");
  }
  const statMapper = prestoStatMaps[variant];
  const bucket = scope === "conference" ? "confStats" : "stats";

  const imported = [];
  rows.slice(headerRowIndex + 1).forEach((row) => {
    const number = String(valueFrom(row, headers, "#") || "").trim();
    const rawName = valueFrom(row, headers, "Name");
    const { first, last } = splitPrestoName(rawName);
    if (!number && !first && !last) return;

    const partial = statMapper(row, headers);
    const player = {
      id: uid("player"),
      number,
      first,
      last,
      pronunciation: "",
      position: String(valueFrom(row, headers, "Pos") || "").trim(),
      hometown: "",
      classYear: String(valueFrom(row, headers, "Yr") || "").trim(),
      height: "",
      weight: "",
      notes: "",
      handedness: "",
      side: state.activeSide,
      stats: bucket === "stats" ? partial : {},
      confStats: bucket === "confStats" ? partial : {}
    };
    imported.push(player);
  });

  mergePlayers(imported);

  state.sources.unshift({
    id: uid("source"),
    type: "csv",
    name: filename,
    importedAt: new Date().toISOString(),
    detail: `${imported.length} ${variant} rows (${scope})`,
    source: "presto",
    scope,
    variant
  });

  if (!activeChart().lineup.some(Boolean)) autoFillLineup();
  saveState();
  render();
}

function importPrestoRosterFromTrx(text, filename) {
  const lines = String(text || "").split(/\r?\n/);
  const imported = [];
  lines.forEach((rawLine) => {
    if (!rawLine.trim()) return;
    const fields = rawLine.split("@").map((f) => f.trim());
    if (fields.length < 6) return;
    const jersey = fields[1] || "";
    const fullName = fields[4] || "";
    const position = fields[5] || "";
    const height = fields[6] || "";
    const weight = fields[7] || "";
    const hometown = fields[8] || "";
    if (!jersey && !fullName) return;
    const { first, last } = splitPrestoName(fullName);
    let handedness = "";
    if (/^LHP/i.test(position)) handedness = "L";
    else if (/^RHP/i.test(position)) handedness = "R";
    imported.push({
      id: uid("player"),
      number: jersey,
      first,
      last,
      pronunciation: "",
      position,
      hometown,
      classYear: "",
      height,
      weight,
      notes: "",
      handedness,
      side: state.activeSide,
      stats: {},
      confStats: {}
    });
  });

  if (!imported.length) {
    throw new Error("No roster rows parsed from this TRX file.");
  }

  mergePlayers(imported);

  state.sources.unshift({
    id: uid("source"),
    type: "trx",
    name: filename,
    importedAt: new Date().toISOString(),
    detail: `${imported.length} roster rows`,
    source: "presto",
    scope: "roster",
    variant: "roster"
  });

  if (!activeChart().lineup.some(Boolean)) autoFillLineup();
  saveState();
  render();
}

const boxScoreLineStats = [
  "AB", "H", "2B", "3B", "HR", "BB", "SO", "RBI", "R", "SB", "CS", "HBP",
  "IP", "P_H", "P_R", "P_ER", "P_HR", "P_BB", "P_SO", "P_HBP", "P_WP", "BF", "Pitches"
];
const boxScoreStatAliases = {
  AB: "AB",
  ATBATS: "AB",
  R: "R",
  RUN: "R",
  RUNS: "R",
  H: "H",
  HIT: "H",
  HITS: "H",
  "2B": "2B",
  DOUBLE: "2B",
  DOUBLES: "2B",
  "3B": "3B",
  TRIPLE: "3B",
  TRIPLES: "3B",
  HR: "HR",
  HRS: "HR",
  HOMERUN: "HR",
  HOMERUNS: "HR",
  RBI: "RBI",
  RBIS: "RBI",
  RUNBATTEDIN: "RBI",
  RUNSBATTEDIN: "RBI",
  BB: "BB",
  BASEONBALLS: "BB",
  WALK: "BB",
  WALKS: "BB",
  SO: "SO",
  K: "SO",
  KS: "SO",
  STRUCKOUT: "SO",
  STRIKEOUT: "SO",
  STRIKEOUTS: "SO",
  SB: "SB",
  STOLENBASE: "SB",
  STOLENBASES: "SB",
  CS: "CS",
  CAUGHTSTEALING: "CS",
  HBP: "HBP",
  HP: "HBP",
  HITBYPITCH: "HBP",
  IP: "IP",
  INNINGSPITCHED: "IP"
};
const boxScoreNumberHeaders = new Set(["#", "NO", "NUM", "NUMBER", "JERSEY", "JERSEYNUMBER"]);
const boxScoreNameHeaders = new Set(["PLAYER", "PLAYERS", "NAME", "PLAYERNAME", "BATTER", "BATTERS", "HITTER", "HITTERS"]);
const boxScoreFirstHeaders = new Set(["FIRST", "FIRSTNAME"]);
const boxScoreLastHeaders = new Set(["LAST", "LASTNAME"]);
const boxScorePositionTokens = new Set(["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "OF", "IF", "DH", "DP", "FLEX", "PH", "PR", "CR", "UTIL", "UTL"]);
const boxScorePitchingStatHeaders = {
  EARNEDRUNS: "P_ER",
  RUNSAGAINST: "P_R",
  HOMERUNSAGAINST: "P_HR",
  BATTERSFACED: "BF",
  BATTERSSTRUCKOUT: "P_SO",
  BASEONBALLSAGAINST: "P_BB",
  HITSAGAINST: "P_H",
  HITBATTER: "P_HBP",
  HITBATTERS: "P_HBP",
  WILDPITCHES: "P_WP",
  NUMBEROFPITCHES: "Pitches"
};

function normalizeBoxScoreHeader(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[.:]/g, "")
    .replace(/\s+/g, " ");
}

function compactBoxScoreHeader(value) {
  return normalizeBoxScoreHeader(value).replace(/[^A-Z0-9#]/g, "");
}

function canonicalBoxScoreStat(value) {
  const normalized = normalizeBoxScoreHeader(value).replace(/[']/g, "");
  const compact = normalized.replace(/[^A-Z0-9]/g, "");
  return boxScoreStatAliases[normalized] || boxScoreStatAliases[compact] || "";
}

function cleanBoxScoreNumber(value) {
  const match = String(value || "").match(/\d{1,3}/);
  return match ? match[0] : "";
}

function normalizeBoxScoreName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function boxScoreTextCells(line) {
  const trimmed = String(line || "").replace(/\u00a0/g, " ").trim();
  if (!trimmed) return { cells: [], mode: "empty" };
  if (trimmed.includes("|")) {
    return { cells: trimmed.split("|").map((cell) => cell.trim()), mode: "pipe" };
  }
  if (trimmed.includes("\t")) {
    return { cells: trimmed.split("\t").map((cell) => cell.trim()), mode: "tab" };
  }
  const wideCells = trimmed.split(/\s{2,}/).map((cell) => cell.trim()).filter(Boolean);
  if (wideCells.length > 1) return { cells: wideCells, mode: "wide" };
  return { cells: trimmed.split(/\s+/).map((cell) => cell.trim()).filter(Boolean), mode: "word" };
}

function isBoxScoreNumberHeader(value) {
  const normalized = normalizeBoxScoreHeader(value);
  const compact = compactBoxScoreHeader(value);
  return boxScoreNumberHeaders.has(normalized) || boxScoreNumberHeaders.has(compact);
}

function isBoxScoreNameHeader(value) {
  const normalized = normalizeBoxScoreHeader(value);
  const compact = compactBoxScoreHeader(value);
  return boxScoreNameHeaders.has(normalized) || boxScoreNameHeaders.has(compact);
}

function isBoxScoreFirstHeader(value) {
  const normalized = normalizeBoxScoreHeader(value);
  const compact = compactBoxScoreHeader(value);
  return boxScoreFirstHeaders.has(normalized) || boxScoreFirstHeaders.has(compact);
}

function isBoxScoreLastHeader(value) {
  const normalized = normalizeBoxScoreHeader(value);
  const compact = compactBoxScoreHeader(value);
  return boxScoreLastHeaders.has(normalized) || boxScoreLastHeaders.has(compact);
}

function boxScoreHeaderFromTxtLine(line) {
  const parsed = boxScoreTextCells(line);
  if (!parsed.cells.length) return null;

  const columns = parsed.cells.map((raw) => {
    const stat = canonicalBoxScoreStat(raw);
    return {
      raw,
      stat,
      number: isBoxScoreNumberHeader(raw),
      name: isBoxScoreNameHeader(raw),
      first: isBoxScoreFirstHeader(raw),
      last: isBoxScoreLastHeader(raw)
    };
  });
  const statSet = new Set(columns.map((column) => column.stat).filter(Boolean));
  const firstStatIndex = columns.findIndex((column) => Boolean(column.stat));
  if (firstStatIndex < 0 || !statSet.has("AB") || !(statSet.has("H") || statSet.has("R") || statSet.has("RBI"))) {
    return null;
  }

  return {
    ...parsed,
    columns,
    firstStatIndex,
    trailingColumns: columns.slice(firstStatIndex),
    numberIndex: columns.findIndex((column) => column.number),
    nameIndex: columns.findIndex((column) => column.name),
    firstIndex: columns.findIndex((column) => column.first),
    lastIndex: columns.findIndex((column) => column.last)
  };
}

function isBoxScoreJunkTxtLine(line) {
  const trimmed = String(line || "").trim();
  if (!trimmed) return true;
  if (/^(totals?|team totals?|opponent totals?|batting totals?|pitching totals?|fielding totals?)\b/i.test(trimmed)) return true;
  if (/^(batting|pitching|fielding|scoring|gamechanger|maxpreps)\b/i.test(trimmed) && !/\bAB\b/i.test(trimmed)) return true;
  return false;
}

function isBoxScoreNumericToken(value) {
  const trimmed = String(value || "").trim();
  return trimmed === "-" || /^-?(?:\d+|\d*\.\d+)$/.test(trimmed);
}

function trimBoxScoreNameDecorations(value) {
  let text = String(value || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const pieces = text.split(/\s+/);
  while (pieces.length > 1) {
    const tail = pieces[pieces.length - 1].replace(/[.,;:]/g, "").toUpperCase();
    const positionPieces = tail.split(/[\/-]/).filter(Boolean);
    if (!positionPieces.length || !positionPieces.every((piece) => boxScorePositionTokens.has(piece))) break;
    pieces.pop();
  }
  text = pieces.join(" ");
  return text.replace(/\s+/g, " ").trim();
}

function splitBoxScoreName(rawName, fallbackNumber = "") {
  let text = trimBoxScoreNameDecorations(rawName);
  let number = cleanBoxScoreNumber(fallbackNumber);
  const leadingNumber = text.match(/^#?\s*(\d{1,3})(?:[.)-]\s*|\s+)(.+)$/);
  if (leadingNumber) {
    number = number || leadingNumber[1];
    text = leadingNumber[2].trim();
  }
  const trailingNumber = text.match(/^(.+?)\s+#?(\d{1,3})$/);
  if (trailingNumber && !number) {
    text = trailingNumber[1].trim();
    number = trailingNumber[2];
  }
  text = trimBoxScoreNameDecorations(text);

  if (text.includes(",")) {
    const [last, ...rest] = text.split(",");
    return {
      number,
      first: rest.join(",").trim(),
      last: last.trim(),
      rawName: text
    };
  }

  const pieces = text.split(/\s+/).filter(Boolean);
  return {
    number,
    first: pieces.length > 1 ? pieces[0] : "",
    last: pieces.length > 1 ? pieces.slice(1).join(" ") : (pieces[0] || ""),
    rawName: text
  };
}

function findBoxScorePlayer({ number, first, last, rawName }) {
  const players = activePlayers();
  const cleanNumber = cleanBoxScoreNumber(number);
  const wantedFull = normalizeBoxScoreName([first, last].filter(Boolean).join(" "));
  const wantedLastFirst = normalizeBoxScoreName([last, first].filter(Boolean).join(" "));
  const wantedRaw = normalizeBoxScoreName(rawName);
  const wantedLast = normalizeBoxScoreName(last);
  const wantedFirst = normalizeBoxScoreName(first);

  const sameName = (player) => {
    const playerFull = normalizeBoxScoreName(fullName(player));
    const playerLast = normalizeBoxScoreName(player.last);
    const playerFirst = normalizeBoxScoreName(player.first);
    return (
      (wantedFull && playerFull === wantedFull)
      || (wantedLastFirst && playerFull === wantedLastFirst)
      || (wantedRaw && playerFull === wantedRaw)
      || (wantedLast && playerLast === wantedLast && (!wantedFirst || playerFirst === wantedFirst))
    );
  };

  if (cleanNumber) {
    const sameNumber = players.filter((player) => cleanBoxScoreNumber(player.number) === cleanNumber);
    const numberAndName = sameNumber.find(sameName);
    if (numberAndName) return numberAndName;
    if (sameNumber.length === 1) return sameNumber[0];
  }

  const nameMatches = players.filter(sameName);
  return nameMatches.length === 1 ? nameMatches[0] : null;
}

function boxScoreStatsFromColumns(columns, values) {
  const stats = {};
  let partialInning = "";
  let stolenBaseAttempts = "";
  columns.forEach((column, index) => {
    const compactHeader = compactBoxScoreHeader(column.raw);
    if (compactHeader === "PARTIALINNINGPITCHED") partialInning = values[index];
    if (compactHeader === "STOLENBASEATTEMPTS") stolenBaseAttempts = values[index];
    if (boxScorePitchingStatHeaders[compactHeader]) stats[boxScorePitchingStatHeaders[compactHeader]] = values[index];
    if (!column.stat || Object.prototype.hasOwnProperty.call(stats, column.stat)) return;
    const value = values[index];
    if (value !== undefined && value !== "") stats[column.stat] = value;
  });
  if (Object.prototype.hasOwnProperty.call(stats, "IP") && partialInning !== "" && partialInning !== undefined) {
    stats.IP = `${toNumber(stats.IP)}.${toNumber(partialInning)}`;
  }
  if (!Object.prototype.hasOwnProperty.call(stats, "CS") && stolenBaseAttempts !== "" && stolenBaseAttempts !== undefined) {
    stats.CS = Math.max(0, toNumber(stolenBaseAttempts) - toNumber(stats.SB));
  }
  return stats;
}

function makeBoxScoreLine({ number = "", first = "", last = "", rawName = "", stats = {} }) {
  let parsedName = splitBoxScoreName(rawName, number);
  let cleanNumber = cleanBoxScoreNumber(number) || parsedName.number;
  let cleanFirst = String(first || "").trim();
  let cleanLast = String(last || "").trim();
  if (!cleanFirst && !cleanLast) {
    cleanFirst = parsedName.first;
    cleanLast = parsedName.last;
  }
  parsedName = splitBoxScoreName([cleanFirst, cleanLast].filter(Boolean).join(" "), cleanNumber);
  cleanFirst = cleanFirst || parsedName.first;
  cleanLast = cleanLast || parsedName.last;
  cleanNumber = cleanNumber || parsedName.number;

  if (!cleanNumber && !cleanFirst && !cleanLast) return null;

  const existing = findBoxScorePlayer({
    number: cleanNumber,
    first: cleanFirst,
    last: cleanLast,
    rawName
  });
  const line = {
    playerId: existing ? existing.id : "",
    number: cleanNumber || existing?.number || "",
    first: cleanFirst || existing?.first || "",
    last: cleanLast || existing?.last || ""
  };

  boxScoreLineStats.forEach((stat) => {
    line[stat] = toNumber(stats[stat]);
  });
  return line;
}

function boxScoreImportKey(box) {
  return [
    box.side || state.activeSide,
    String(box.gameDate || "").trim(),
    String(box.opponent || "").trim().toLowerCase(),
    String(box.filename || "").trim().toLowerCase(),
    String(box.format || "").trim().toLowerCase()
  ].join("|");
}

function saveImportedBoxScore(lines, filename, meta = {}, sourceFormat = "CSV") {
  if (!lines.length) {
    throw new Error(`No player rows found in this ${sourceFormat} box score.`);
  }

  const format = sourceFormat.toLowerCase();
  const box = {
    id: uid("box"),
    side: state.activeSide,
    gameDate: meta.gameDate || new Date().toISOString().slice(0, 10),
    opponent: meta.opponent || "",
    resultNote: meta.resultNote || "",
    filename,
    format,
    importedAt: new Date().toISOString(),
    lines
  };
  const importKey = boxScoreImportKey(box);
  box.importKey = importKey;
  state.boxScores = (state.boxScores || []).filter((item) => boxScoreImportKey(item) !== importKey);
  state.boxScores.unshift(box);

  state.sources = (state.sources || []).filter((source) => source.boxImportKey !== importKey);
  state.sources.unshift({
    id: uid("source"),
    type: "box-score",
    name: filename,
    importedAt: box.importedAt,
    detail: `${lines.length} players, ${box.opponent || "opponent unknown"} ${box.gameDate}`,
    source: "gamechanger",
    scope: "box-score",
    variant: format,
    boxImportKey: importKey
  });

  saveState();
  render();
}

function importBoxScoreFromCsv(text, filename, meta = {}) {
  const rows = parseCsv(text);
  const headerRowIndex = rows.findIndex((row) => rowHasHeaders(row, ["Number", "Last", "First"]));
  if (headerRowIndex < 0) {
    throw new Error("Could not find a header row with Number, Last, and First columns.");
  }
  const headers = rows[headerRowIndex].map((header) => header.trim());
  const lines = rows.slice(headerRowIndex + 1)
    .map((row) => {
      const number = valueFrom(row, headers, "Number").trim();
      const last = valueFrom(row, headers, "Last").trim();
      const first = valueFrom(row, headers, "First").trim();
      if (!number && !last && !first) return null;
      return makeBoxScoreLine({
        number,
        first,
        last,
        rawName: [first, last].filter(Boolean).join(" "),
        stats: {
          AB: valueFrom(row, headers, "AB"),
          H: valueFrom(row, headers, "H", 1),
          "2B": valueFrom(row, headers, "2B"),
          "3B": valueFrom(row, headers, "3B"),
          HR: valueFrom(row, headers, "HR", 1),
          BB: valueFrom(row, headers, "BB", 1),
          SO: valueFrom(row, headers, "SO", 1),
          RBI: valueFrom(row, headers, "RBI"),
          R: valueFrom(row, headers, "R"),
          SB: valueFrom(row, headers, "SB", 1),
          CS: valueFrom(row, headers, "CS", 1),
          HBP: valueFrom(row, headers, "HBP", 1),
          IP: valueFrom(row, headers, "IP")
        }
      });
    })
    .filter(Boolean);

  saveImportedBoxScore(lines, filename, meta, "CSV");
}

function parseBoxScoreTxtDelimitedRow(line, header) {
  const parsed = boxScoreTextCells(line);
  if (parsed.mode === "word" || parsed.cells.length < header.firstStatIndex + 1) return null;

  const stats = boxScoreStatsFromColumns(header.columns, parsed.cells);
  let number = header.numberIndex >= 0 ? cleanBoxScoreNumber(parsed.cells[header.numberIndex]) : "";
  let first = header.firstIndex >= 0 ? parsed.cells[header.firstIndex].trim() : "";
  let last = header.lastIndex >= 0 ? parsed.cells[header.lastIndex].trim() : "";
  let rawName = header.nameIndex >= 0 ? parsed.cells[header.nameIndex] : "";
  if (!rawName && (!first || !last)) {
    rawName = parsed.cells
      .slice(0, header.firstStatIndex)
      .filter((_, index) => ![header.numberIndex, header.firstIndex, header.lastIndex].includes(index))
      .join(" ");
  }
  if (!number && rawName) number = splitBoxScoreName(rawName).number;
  if (!Object.keys(stats).length) return null;
  return makeBoxScoreLine({ number, first, last, rawName, stats });
}

function parseBoxScoreTxtSuffixRow(line, header) {
  const tokens = String(line || "").replace(/\u00a0/g, " ").trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;

  const numericSuffix = [];
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    if (!isBoxScoreNumericToken(tokens[index])) break;
    numericSuffix.unshift(tokens[index]);
  }
  if (!numericSuffix.length) return null;

  const valueTokens = numericSuffix.slice(-header.trailingColumns.length);
  const playerTokens = tokens.slice(0, tokens.length - valueTokens.length);
  if (!playerTokens.length) return null;

  const columns = header.trailingColumns.slice(0, valueTokens.length);
  const stats = boxScoreStatsFromColumns(columns, valueTokens);
  if (!Object.keys(stats).length) return null;
  return makeBoxScoreLine({ rawName: playerTokens.join(" "), stats });
}

function parseBoxScoreTxtRow(line, header) {
  if (isBoxScoreJunkTxtLine(line) || boxScoreHeaderFromTxtLine(line)) return null;
  const direct = parseBoxScoreTxtDelimitedRow(line, header);
  if (direct) return direct;
  return parseBoxScoreTxtSuffixRow(line, header);
}

function importBoxScoreFromTxt(text, filename, meta = {}) {
  const lines = [];
  let currentHeader = null;

  String(text || "").split(/\r?\n/).forEach((line) => {
    const nextHeader = boxScoreHeaderFromTxtLine(line);
    if (nextHeader) {
      currentHeader = nextHeader;
      return;
    }
    if (!currentHeader) return;
    const parsed = parseBoxScoreTxtRow(line, currentHeader);
    if (parsed) lines.push(parsed);
  });

  saveImportedBoxScore(lines, filename, meta, "TXT");
}

function resolvePdfBridgeUrl() {
  try {
    const override = localStorage.getItem("pxp.pdfBridgeUrl");
    if (override && override.trim()) return override.trim().replace(/\/+$/, "");
  } catch (_) { /* localStorage may be blocked; fall through */ }
  const host = location.hostname;
  if (!host || host === "localhost" || host === "127.0.0.1") {
    return "http://127.0.0.1:8766";
  }
  // tailscale serve typically reverse-proxies /api on the .ts.net origin to the local bridge.
  if (host.endsWith(".ts.net")) {
    return `${location.origin}/api`;
  }
  // Anywhere else (e.g. GitHub Pages) — the user must configure the bridge URL via the Data tab.
  return "";
}
let PDF_BRIDGE_URL = resolvePdfBridgeUrl();

async function pingPdfBridge() {
  if (!PDF_BRIDGE_URL) return false;
  try {
    const res = await fetch(`${PDF_BRIDGE_URL}/health`, { cache: "no-store" });
    return res.ok;
  } catch (_) {
    return false;
  }
}

function setPdfBridgeStatus(status, message) {
  if (!els.pdfBridgeStatus) return;
  els.pdfBridgeStatus.dataset.status = status;
  els.pdfBridgeStatus.textContent = message;
}

function pdfBridgeOfflineHint() {
  if (!PDF_BRIDGE_URL) {
    return "PDF bridge: not configured — paste your tailnet bridge URL below (e.g. https://your-pc.tail-xxxx.ts.net/api)";
  }
  const isLocal = PDF_BRIDGE_URL.startsWith("http://127.0.0.1") || PDF_BRIDGE_URL.startsWith("http://localhost");
  if (isLocal) {
    return "PDF bridge: offline — start it with `python -m pdf_to_csv.server` from tools/pdf_to_csv";
  }
  return `PDF bridge: offline at ${PDF_BRIDGE_URL} — wake the PC, start the bridge, and ensure 'tailscale serve' is routing /api/`;
}

function savePdfBridgeUrl(rawValue) {
  const trimmed = (rawValue || "").trim().replace(/\/+$/, "");
  try {
    if (trimmed) localStorage.setItem("pxp.pdfBridgeUrl", trimmed);
    else localStorage.removeItem("pxp.pdfBridgeUrl");
  } catch (_) { /* ignore storage errors */ }
  PDF_BRIDGE_URL = resolvePdfBridgeUrl();
  return refreshPdfBridgeStatus();
}

async function refreshPdfBridgeStatus() {
  setPdfBridgeStatus("busy", "PDF bridge: checking…");
  const ok = await pingPdfBridge();
  if (ok) {
    setPdfBridgeStatus("ready", `PDF bridge: ready (${PDF_BRIDGE_URL})`);
  } else {
    setPdfBridgeStatus("offline", pdfBridgeOfflineHint());
  }
  return ok;
}

async function uploadPdfToBridge(file, kindHint) {
  const formData = new FormData();
  formData.append("file", file);
  if (kindHint) formData.append("kind", kindHint);

  const res = await fetch(`${PDF_BRIDGE_URL}/parse`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch (_) { /* keep statusText */ }
    throw new Error(`bridge ${res.status}: ${detail}`);
  }

  return res.json();
}

async function importPdfViaBridge(file, options = {}) {
  setPdfBridgeStatus("busy", `PDF bridge: parsing ${file.name}…`);
  let payload;
  try {
    payload = await uploadPdfToBridge(file, options.kindHint);
  } catch (error) {
    setPdfBridgeStatus(
      "offline",
      `PDF bridge: ${error.message}`
    );
    throw error;
  }

  const filename = payload.filename || file.name;
  if (payload.kind === "box_score") {
    importBoxScoreFromCsv(payload.csv, filename, options.boxMeta || {});
  } else {
    importPlayersFromCsv(payload.csv, filename);
  }

  const warnNote = payload.warnings?.length
    ? ` (${payload.warnings.length} warning${payload.warnings.length === 1 ? "" : "s"})`
    : "";
  setPdfBridgeStatus(
    "ready",
    `PDF bridge: imported ${payload.rows} ${payload.kind === "box_score" ? "box-score lines" : "rows"} from ${filename}${warnNote}`
  );
  return payload;
}

function bindPdfBridge() {
  return false;
}

function boxScoreLinesForPlayer(playerId) {
  const out = [];
  state.boxScores.forEach((box) => {
    const line = box.lines.find((l) => l.playerId === playerId);
    if (line) out.push({ box, line });
  });
  out.sort((a, b) => (a.box.gameDate < b.box.gameDate ? 1 : -1));
  return out;
}

function autoFillLineup() {
  const candidates = [...activePlayers()].sort((a, b) => {
    const bCalc = calcStats(b.stats);
    const aCalc = calcStats(a.stats);
    return toNumber(bCalc.OPS) - toNumber(aCalc.OPS);
  });
  activeChart().lineup = Array.from({ length: 9 }, (_, index) => candidates[index]?.id || "");
  activeChart().lineupPositions = Array.from({ length: 9 }, (_, index) => activeChart().lineupPositions[index] || "");
}

function eventDelta(result) {
  const delta = emptyStats();
  delta.PA = 1;

  if (["single", "double", "triple", "hr", "strikeout", "out", "reachedError", "fieldersChoice"].includes(result)) {
    delta.AB = 1;
  }
  if (result === "single") delta.H = 1;
  if (result === "double") {
    delta.H = 1;
    delta["2B"] = 1;
  }
  if (result === "triple") {
    delta.H = 1;
    delta["3B"] = 1;
  }
  if (result === "hr") {
    delta.H = 1;
    delta.HR = 1;
    delta.R = 1;
  }
  if (result === "walk") delta.BB = 1;
  if (result === "hbp") delta.HBP = 1;
  if (result === "strikeout") delta.SO = 1;
  if (result === "sacFly") delta.SF = 1;
  if (result === "balk") delta.BK = 1;

  return delta;
}

function ensureStatBucket(player, bucket) {
  player[bucket] = { ...emptyStats(), ...(player[bucket] || {}) };
  return player[bucket];
}

function applyStatDeltaToBuckets(player, delta, direction, buckets) {
  buckets.forEach((bucket) => {
    const stats = ensureStatBucket(player, bucket);
    Object.entries(delta).forEach(([key, value]) => {
      stats[key] = Math.max(0, toNumber(stats[key]) + toNumber(value) * direction);
    });
  });
}

function applySingleStatDeltaToPlayer(player, key, delta, gameType = activeGameType()) {
  if (!player || !key || !toNumber(delta)) return;
  statBucketsForGameType(gameType).forEach((bucket) => {
    const stats = ensureStatBucket(player, bucket);
    stats[key] = Math.max(0, toNumber(stats[key]) + toNumber(delta));
  });
}

function applyEventToBuckets(event, direction = 1, buckets = statBucketsForGameType(event.gameType)) {
  const player = state.players.find((item) => item.id === event.playerId);
  if (!player) return;
  const delta = eventDelta(event.result);
  applyStatDeltaToBuckets(player, delta, direction, buckets);
  buckets.forEach((bucket) => {
    const stats = ensureStatBucket(player, bucket);
    stats.RBI = Math.max(0, toNumber(stats.RBI) + toNumber(event.rbi) * direction);
    stats.SB = Math.max(0, toNumber(stats.SB) + toNumber(event.sb) * direction);
    stats.CS = Math.max(0, toNumber(stats.CS) + toNumber(event.cs) * direction);
  });
}

function applyEvent(event, direction = 1) {
  event.gameType = normalizeGameType(event.gameType || activeGameType());
  applyEventToBuckets(event, direction, statBucketsForGameType(event.gameType));
}

function resultLabel(result) {
  return {
    single: "Single",
    double: "Double",
    triple: "Triple",
    hr: "Home run",
    walk: "Walk",
    hbp: "Hit by pitch",
    balk: "Balk",
    strikeout: "Strikeout",
    out: "Out in play",
    sacFly: "Sac fly",
    reachedError: "Reached on error",
    fieldersChoice: "Fielder's choice"
  }[result] || result;
}

const notationStatMap = {
  "1B": "1B", "2B": "2B", "3B": "3B", "HR": "HR",
  "BB": "BB", "IBB": "IBB", "K": "K", "KC": "KC", "KL": "KC", "KPB": "KPB", "K PB": "KPB", "KWP": "KWP", "K WP": "KWP",
  "HBP": "HBP", "BI": "BI", "CI": "CI", "BK": "BALK", "BALK": "BALK", "ROE": "ROE", "E": "ERR", "ERR": "ERR",
  "FC": "FC", "SF": "SF",
  "SAC": "SF", "SH": "SF"
};

const notationSuggestions = [
  "1B", "2B", "3B", "HR", "BB", "IBB", "HBP", "K", "Kc", "K PB", "K WP", "BI", "CI", "BK",
  "ROE", "E", "FC", "SF", "SAC", "SH",
  "F7", "F8", "F9", "L7", "L8", "L9",
  "G1", "G3", "G4", "G5", "G6",
  "P3", "P4", "P5", "P6",
  "1-3", "3-1", "3-U", "4-3", "5-3", "6-3", "U-3",
  "6-4-3", "4-6-3", "5-4-3", "DP", "TP",
  "SB2", "SB3", "SB H",
  "CS2", "CS3", "CS H",
  "WP", "PB", "BK", "PO",
  "FO", "GO", "LO", "SAC bunt", "SAC fly"
];

function normalizedNotation(text) {
  return String(text || "").trim().toUpperCase();
}

function compactPlayNotation(text) {
  return normalizedNotation(text)
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^([FGLP])\s+([1-9])/, "$1$2");
}

function isThrowSequenceNotation(text) {
  const compact = compactPlayNotation(text);
  return /^(?:[1-9]|U)(?:-(?:[1-9]|U))+$/.test(compact)
    || /^[1-9]U$/.test(compact)
    || /^U[1-9]$/.test(compact)
    || /^U-[1-9]$/.test(compact);
}

function isBattedOutNotation(text) {
  const compact = compactPlayNotation(text);
  return /^[FGLP][1-9](?:-(?:[1-9]|U))*$/.test(compact)
    || isThrowSequenceNotation(compact)
    || /^[1-9]$/.test(compact);
}

function notationActionKey(text) {
  const normalized = normalizedNotation(text);
  const compact = compactPlayNotation(text);
  if (/^FC\b/.test(normalized)) return "FC";
  if (/^E[1-9]?\b/.test(normalized)) return "ROE";
  if (isBattedOutNotation(compact)) return "OUT";
  if (/^K\s+[1-9](?:-[1-9U])+$/.test(normalized)) return "K";
  if (/^(?:DP|TP)\b/.test(compact)) return "OUT";
  if (["FO", "GO", "LO", "DP", "TP", "PO"].includes(compact)) return "OUT";
  return notationStatMap[normalized] || "";
}

const chartActions = {
  BB: { label: "BB", result: "walk", notation: "BB", pitcher: { BB: 1, BF: 1 } },
  IBB: { label: "IBB", result: "walk", notation: "IBB", pitcher: { BB: 1, BF: 1 } },
  K: { label: "K", result: "strikeout", notation: "K", pitcher: { K: 1, BF: 1 } },
  KC: { label: "Kc", result: "strikeout", notation: "Kc", pitcher: { K: 1, KC: 1, BF: 1 } },
  KPB: { label: "K PB", result: "strikeout", notation: "K PB", pitcher: { K: 1, BF: 1 } },
  KWP: { label: "K WP", result: "strikeout", notation: "K WP", pitcher: { K: 1, WP: 1, BF: 1 } },
  "1B": { label: "1B", result: "single", notation: "1B", pitcher: { H: 1, BF: 1 } },
  "2B": { label: "2B", result: "double", notation: "2B", pitcher: { H: 1, "2B": 1, BF: 1 } },
  "3B": { label: "3B", result: "triple", notation: "3B", pitcher: { H: 1, "3B": 1, BF: 1 } },
  HR: { label: "Hr", result: "hr", notation: "HR", pitcher: { H: 1, HR: 1, R: 1, ER: 1, BF: 1 } },
  OUT: { label: "Out", result: "out", notation: "OUT", pitcher: { BF: 1 } },
  HBP: { label: "HBP", result: "hbp", notation: "HBP", pitcher: { HBP: 1, BF: 1 } },
  BI: { label: "BI", result: "out", notation: "BI", pitcher: { BF: 1 } },
  CI: { label: "CI", result: "catcherInterference", notation: "CI", pitcher: { BF: 1 } },
  BALK: { label: "Balk", result: "balk", notation: "BK", pitcher: {}, noPlateAppearance: true, advanceBatter: false },
  SF: { label: "SF", result: "sacFly", notation: "SF", pitcher: { BF: 1 } },
  ROE: { label: "ROE", result: "reachedError", notation: "ROE", pitcher: { BF: 1 }, inning: { E: 1 } },
  ERR: { label: "E", result: "out", notation: "E", pitcher: {}, inning: { E: 1 } },
  FC: { label: "FC", result: "fieldersChoice", notation: "FC", pitcher: { BF: 1 } }
};

const defaultEarnedRunActions = new Set(["1B", "2B", "3B", "HR", "BB", "IBB", "HBP", "SF", "BI", "FC", "KWP"]);

function pitcherRunsForAction(actionKey, rbi) {
  const actionRuns = toNumber(chartActions[actionKey]?.pitcher?.R);
  return Math.max(actionRuns, toNumber(rbi));
}

function pitcherEarnedRunsForAction(actionKey, rbi) {
  const actionEarnedRuns = toNumber(chartActions[actionKey]?.pitcher?.ER);
  if (!defaultEarnedRunActions.has(actionKey)) return actionEarnedRuns;
  return Math.max(actionEarnedRuns, toNumber(rbi));
}

function syncPitcherRunsFromRbi(cell, actionKey, oldRbi, nextRbi) {
  const pitcherId = cell.pitcherId;
  if (!pitcherId) return;

  const oldRunValue = pitcherRunsForAction(actionKey, oldRbi);
  const nextRunValue = pitcherRunsForAction(actionKey, nextRbi);
  if (toNumber(cell.pitcherUpdates?.R) === oldRunValue) {
    setPitcherUpdateValue(cell, pitcherId, "R", nextRunValue);
  }

  const oldEarnedValue = pitcherEarnedRunsForAction(actionKey, oldRbi);
  const nextEarnedValue = pitcherEarnedRunsForAction(actionKey, nextRbi);
  if (toNumber(cell.pitcherUpdates?.ER) === oldEarnedValue) {
    setPitcherUpdateValue(cell, pitcherId, "ER", nextEarnedValue);
  }
}

function setCellRbi(cellKey, value) {
  const cell = getScoreCellFromKey(cellKey);
  const oldRbi = toNumber(cell.rbi);
  const nextRbi = Math.max(0, toNumber(value));
  if (oldRbi === nextRbi) return;

  cell.rbi = nextRbi || "";
  if (!cell.eventId) return;

  const event = state.events.find((item) => item.id === cell.eventId);
  if (event) {
    const batter = state.players.find((item) => item.id === event.playerId);
    const oldEventRbi = toNumber(event.rbi);
    const delta = nextRbi - oldEventRbi;
    applySingleStatDeltaToPlayer(batter, "RBI", delta, event.gameType || cell.gameType || activeGameType());
    event.rbi = nextRbi;
    syncPitcherRunsFromRbi(cell, cell.actionKey || notationActionKey(cell.notation), oldEventRbi, nextRbi);
  }
}

const basePathForResult = {
  "1B": ["toFirst"],
  BB: ["toFirst"],
  IBB: ["toFirst"],
  HBP: ["toFirst"],
  CI: ["toFirst"],
  KPB: ["toFirst"],
  KWP: ["toFirst"],
  ROE: ["toFirst"],
  FC: ["toFirst"],
  "2B": ["toFirst", "toSecond"],
  "3B": ["toFirst", "toSecond", "toThird"],
  HR: ["toFirst", "toSecond", "toThird", "toHome"]
};

const diamondBaseOrder = ["toFirst", "toSecond", "toThird", "toHome"];

function diamondPathThrough(base) {
  const index = diamondBaseOrder.indexOf(base);
  return Object.fromEntries(diamondBaseOrder.map((item, itemIndex) => [item, index >= 0 && itemIndex <= index]));
}

function emptyDiamondPath() {
  return diamondPathThrough("");
}

function activeDiamondTerminal(bases = {}) {
  return [...diamondBaseOrder].reverse().find((base) => bases[base]) || "";
}

function scoringPathActive(bases = {}) {
  const terminal = activeDiamondTerminal(bases);
  return terminal === "toSecond" || terminal === "toThird";
}

const diamondCornerPoints = {
  toHome: "50,92",
  toFirst: "92,50",
  toSecond: "50,8",
  toThird: "8,50"
};

function diamondPathPoints(terminal) {
  if (!terminal) return "";
  const order = ["toFirst", "toSecond", "toThird", "toHome"];
  const stopAt = order.indexOf(terminal);
  if (stopAt < 0) return "";
  const points = [diamondCornerPoints.toHome];
  for (let i = 0; i <= stopAt; i += 1) {
    points.push(diamondCornerPoints[order[i]]);
  }
  return points.join(" ");
}

function diamondSvg(bases) {
  const terminal = activeDiamondTerminal(bases);
  const activePoints = diamondPathPoints(terminal);
  return `
    <svg class="diamond-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <polygon class="diamond-frame-shape" points="50,92 92,50 50,8 8,50" />
      ${activePoints ? `<polyline class="diamond-path-active" points="${activePoints}" />` : ""}
    </svg>
  `;
}

function baseLabelShort(terminal) {
  if (terminal === "toFirst") return "1B";
  if (terminal === "toSecond") return "2B";
  if (terminal === "toThird") return "3B";
  if (terminal === "toHome") return "H";
  return "";
}

function terminalEventLabel(prefix, terminal) {
  const base = terminal === "toHome" ? "HP" : baseLabelShort(terminal);
  return `${prefix}${base}`;
}

function addRunnerStatDelta(cell, playerId, key, value) {
  const player = state.players.find((item) => item.id === playerId);
  if (!player) return;
  const gameType = activeGameType();
  statBucketsForGameType(gameType).forEach((bucket) => {
    const stats = ensureStatBucket(player, bucket);
    stats[key] = Math.max(0, toNumber(stats[key]) + value);
  });
  cell.runnerStatDeltas = cell.runnerStatDeltas || [];
  cell.runnerStatDeltas.push({ playerId, key, value, gameType });
}

function addRunnerPitcherOut(cell) {
  addRunnerPitcherDelta(cell, { outs: 1 });
}

function addRunnerPitcherDelta(cell, updates) {
  const chart = activeChart();
  if (!chart.activePitcherId) return;
  const gameType = cell.gameType || activeGameType();
  addToPitchingLine(chart.activePitcherId, updates, gameType);
  cell.runnerPitcherDeltas = cell.runnerPitcherDeltas || [];
  cell.runnerPitcherDeltas.push({ pitcherId: chart.activePitcherId, updates: { ...updates }, gameType });
}

function reverseRunnerPitcherDelta(item) {
  const updates = item.updates || { outs: toNumber(item.outs) };
  const reverseUpdates = {};
  Object.entries(updates).forEach(([key, value]) => {
    reverseUpdates[key] = -toNumber(value);
  });
  addToPitchingLine(item.pitcherId, reverseUpdates, item.gameType || activeGameType());
}

function addRunnerInningDelta(cell, inning, updates) {
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates || {}).filter(([, value]) => toNumber(value))
  );
  if (!Object.keys(cleanUpdates).length) return;
  addToInningTotals(inning, cleanUpdates, 1);
  cell.runnerInning = inning;
  cell.runnerInningUpdates = cell.runnerInningUpdates || {};
  Object.entries(cleanUpdates).forEach(([key, value]) => {
    cell.runnerInningUpdates[key] = toNumber(cell.runnerInningUpdates[key]) + toNumber(value);
  });
}

function reverseRunnerInningDelta(cell) {
  if (cell.runnerInning && cell.runnerInningUpdates) {
    addToInningTotals(cell.runnerInning, cell.runnerInningUpdates, -1);
  }
  delete cell.runnerInning;
  delete cell.runnerInningUpdates;
}

function addRunnerDefensiveInningDelta(cell, inning, updates) {
  const defensiveSide = oppositeSide();
  const defensiveChart = activeGame().charts[defensiveSide];
  if (!defensiveChart) return;
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates || {}).filter(([, value]) => toNumber(value))
  );
  if (!Object.keys(cleanUpdates).length) return;
  addToChartInningTotals(defensiveChart, inning, cleanUpdates, 1);
  cell.runnerDefensiveInning = inning;
  cell.runnerDefensiveInningSide = defensiveSide;
  cell.runnerDefensiveInningUpdates = cell.runnerDefensiveInningUpdates || {};
  Object.entries(cleanUpdates).forEach(([key, value]) => {
    cell.runnerDefensiveInningUpdates[key] = toNumber(cell.runnerDefensiveInningUpdates[key]) + toNumber(value);
  });
}

function reverseRunnerDefensiveInningDelta(cell) {
  if (cell.runnerDefensiveInning && cell.runnerDefensiveInningSide && cell.runnerDefensiveInningUpdates) {
    const defensiveChart = activeGame().charts[cell.runnerDefensiveInningSide];
    if (defensiveChart) {
      addToChartInningTotals(defensiveChart, cell.runnerDefensiveInning, cell.runnerDefensiveInningUpdates, -1);
    }
  }
  delete cell.runnerDefensiveInning;
  delete cell.runnerDefensiveInningSide;
  delete cell.runnerDefensiveInningUpdates;
}

function clearRunnerOutcome(cell) {
  reverseRunnerInningDelta(cell);
  reverseRunnerDefensiveInningDelta(cell);
  if (cell.runnerStatDeltas) {
    cell.runnerStatDeltas.forEach((item) => {
      const player = state.players.find((candidate) => candidate.id === item.playerId);
      if (player) {
        statBucketsForGameType(item.gameType || activeGameType()).forEach((bucket) => {
          const stats = ensureStatBucket(player, bucket);
          stats[item.key] = Math.max(0, toNumber(stats[item.key]) - toNumber(item.value));
        });
      }
    });
  }
  if (cell.runnerPitcherDeltas) {
    cell.runnerPitcherDeltas.forEach((item) => {
      reverseRunnerPitcherDelta(item);
    });
  }
  delete cell.runnerStatDeltas;
  delete cell.runnerPitcherDeltas;
  delete cell.outOverlay;
  delete cell.scoredOverlay;
}

function defaultCsSequence(terminal) {
  return {
    toFirst: "2-3",
    toSecond: "2-4",
    toThird: "2-5",
    toHome: "2-1"
  }[terminal] || "2-4";
}

function defaultPickSequence(terminal) {
  return {
    toFirst: "1-3",
    toSecond: "1-4",
    toThird: "1-5",
    toHome: "1-2"
  }[terminal] || "1-3";
}

function defaultForceSequence(terminal) {
  return {
    toFirst: "4-3",
    toSecond: "6-4",
    toThird: "5-6",
    toHome: "5-2"
  }[terminal] || "6-4";
}

function defaultTagSequence(terminal) {
  return {
    toFirst: "1-3",
    toSecond: "9-6",
    toThird: "8-5",
    toHome: "7-2"
  }[terminal] || "9-6";
}

const runnerEventOptions = [
  { value: "FC_OUT", label: "FC out", prefix: "FC", mode: "out", target: "next", defaultKind: "force" },
  { value: "FORCE_OUT", label: "Force out", prefix: "FO", mode: "out", target: "next", defaultKind: "force" },
  { value: "TAG_OUT", label: "Tag out", prefix: "TO", mode: "out", target: "next", defaultKind: "tag" },
  { value: "ADV_OUT", label: "Out advancing", prefix: "OA", mode: "out", target: "next", defaultKind: "tag" },
  { value: "DP_OUT", label: "Double play", prefix: "DP", mode: "out", target: "next", defaultKind: "force" },
  { value: "TP_OUT", label: "Triple play", prefix: "TP", mode: "out", target: "next", defaultKind: "force" },
  { value: "APPEAL_OUT", label: "Appeal out", prefix: "AP", mode: "out", target: "current", defaultKind: "current" },
  { value: "RI_OUT", label: "Runner INT", prefix: "RI", mode: "out", target: "current", defaultKind: "current" },
  { value: "CS", label: "Caught stealing", prefix: "CS", mode: "out", target: "next", defaultKind: "cs", runnerStat: "CS" },
  { value: "PO", label: "Pickoff", prefix: "PO", mode: "out", target: "current", defaultKind: "pick" },
  { value: "POCS", label: "Pickoff CS", prefix: "POCS", mode: "out", target: "next", defaultKind: "pick", runnerStat: "CS" },
  { value: "SB", label: "Stolen base", prefix: "SB", mode: "advance", target: "next", runnerStat: "SB" },
  { value: "DI", label: "Def. indiff.", prefix: "DI", mode: "advance", target: "next" },
  { value: "WP_ADV", label: "Wild pitch", prefix: "WP", mode: "advance", target: "next", pitcher: { WP: 1 } },
  { value: "PB_ADV", label: "Passed ball", prefix: "PB", mode: "advance", target: "next" },
  { value: "BK_ADV", label: "Balk advance", prefix: "BK", mode: "advance", target: "next", pitcher: { BK: 1 } },
  { value: "ADV_THROW", label: "Adv. throw", prefix: "AOT", mode: "advance", target: "next" },
  { value: "ADV_ERROR", label: "Adv. error", prefix: "E", mode: "advance", target: "next", defensive: { E: 1 } },
  { value: "ADV_HIT", label: "Adv. hit", prefix: "ADV", mode: "advance", target: "next" },
  { value: "ADV_FC", label: "Adv. FC", prefix: "FC", mode: "advance", target: "next" },
  { value: "SCORED", label: "Scored", prefix: "R", mode: "score", target: "home" },
  { value: "OTHER_SAFE", label: "Other safe", prefix: "", mode: "advance", target: "next" },
  { value: "OTHER_OUT", label: "Other out", prefix: "", mode: "out", target: "next", defaultKind: "tag" }
];

function runnerEventByValue(value) {
  return runnerEventOptions.find((option) => option.value === value);
}

function runnerEventOptionsHtml(placeholder = "Runner play") {
  return [`<option value="">${escapeHtml(placeholder)}</option>`]
    .concat(runnerEventOptions.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`))
    .join("");
}

function terminalForRunnerCell(cellKey, cell) {
  const terminal = activeDiamondTerminal(cell.bases || emptyDiamondPath());
  if (terminal) return terminal;
  const { slot } = parseScoreCellKey(cellKey);
  const runnerId = cell.runnerId || runnerIdAtSlot(slot);
  const chart = activeChart();
  if (runnerId && chart.baseState.first === runnerId) return "toFirst";
  if (runnerId && chart.baseState.second === runnerId) return "toSecond";
  if (runnerId && chart.baseState.third === runnerId) return "toThird";
  return "";
}

function runnerIdForCell(cellKey, cell) {
  const { slot } = parseScoreCellKey(cellKey);
  return cell.runnerId || runnerIdAtSlot(slot);
}

function targetTerminalForRunnerEvent(option, currentTerminal, laneTerminal = "") {
  if (laneTerminal) return laneTerminal;
  if (option.target === "home") return "toHome";
  if (option.target === "current") return currentTerminal || "toFirst";
  return nextTerminalFrom(currentTerminal || "toFirst") || currentTerminal || "toFirst";
}

function defaultRunnerEventInput(option, terminal) {
  if (option.defaultKind === "cs") return defaultCsSequence(terminal);
  if (option.defaultKind === "pick") return defaultPickSequence(terminal);
  if (option.defaultKind === "force") return defaultForceSequence(terminal);
  if (option.defaultKind === "tag") return defaultTagSequence(terminal);
  if (option.defaultKind === "current") return baseLabelShort(terminal) || "";
  if (option.mode === "score") return "R";
  if (option.runnerStat === "SB") return terminalEventLabel("SB", terminal);
  if (option.prefix) return option.prefix;
  return option.label;
}

function formatRunnerEventNotation(option, rawValue, terminal) {
  const typed = compactPlayNotation(rawValue || defaultRunnerEventInput(option, terminal));
  if (!typed) return option.label;
  if (!option.prefix) return typed;
  if (typed === option.prefix || typed.startsWith(`${option.prefix} `) || typed.startsWith(`${option.prefix}-`)) return typed;
  if (option.runnerStat === "SB" && typed.startsWith("SB")) return typed;
  return `${option.prefix} ${typed}`.trim();
}

async function promptThrowSequence(title, defaultValue) {
  const value = await showAppPrompt({
    title,
    message: "Enter the throw sequence for the notation.",
    defaultValue,
    inputLabel: defaultValue
  });
  return (value || defaultValue).trim();
}

function syncRunnerRunStatForMovement(cell, runnerId, oldBases, newBases) {
  if (!runnerId) return;
  const wasScored = activeDiamondTerminal(oldBases) === "toHome";
  const isScored = activeDiamondTerminal(newBases) === "toHome";
  if (wasScored === isScored) return;
  addRunnerStatDelta(cell, runnerId, "R", isScored ? 1 : -1);
}

function applyTerminalChange(cellKey, newTerminal) {
  const chart = activeChart();
  const cell = getScoreCellFromKey(cellKey);
  const { slot, inning } = parseScoreCellKey(cellKey);
  const effectiveInning = cellActualInning(cell, inning);
  const runnerId = cell.runnerId || runnerIdAtSlot(slot);
  const oldBases = { ...(cell.bases || emptyDiamondPath()) };
  const oldTerminal = activeDiamondTerminal(oldBases);
  const newBases = newTerminal ? diamondPathThrough(newTerminal) : emptyDiamondPath();
  const inningUpdates = {};

  if (!cell.baseStateBefore) cell.baseStateBefore = { ...chart.baseState };
  cell.bases = newBases;
  cell.inning = effectiveInning;
  cell.inningUpdates = cell.inningUpdates || {};

  if (scoringPathActive(oldBases) !== scoringPathActive(newBases)) {
    inningUpdates.RISP = scoringPathActive(newBases) ? 1 : -1;
  }
  if (oldTerminal !== "toHome" && newTerminal === "toHome") inningUpdates.R = 1;
  if (oldTerminal === "toHome" && newTerminal !== "toHome") inningUpdates.R = -1;
  cell.scoredOverlay = newTerminal === "toHome";
  if (newTerminal !== "toHome") delete cell.scoredOverlay;

  addToInningTotals(effectiveInning, inningUpdates, 1);
  Object.entries(inningUpdates).forEach(([key, value]) => {
    cell.inningUpdates[key] = toNumber(cell.inningUpdates[key]) + value;
  });
  syncRunnerRunStatForMovement(cell, runnerId, oldBases, newBases);
  if (runnerId) {
    cell.runnerId = runnerId;
    setBatterBaseState(chart, runnerId, newTerminal);
  }
  if (!newTerminal && !cell.result && !cell.notation) delete cell.runnerId;
}

function nextTerminalFrom(terminal) {
  if (terminal === "toFirst") return "toSecond";
  if (terminal === "toSecond") return "toThird";
  if (terminal === "toThird") return "toHome";
  return terminal;
}

function syncCurrentBaseState(chart = activeChart()) {
  chart.baseStates = chart.baseStates || {};
  chart.baseStates[Number(chart.currentInning || 1)] = { ...(chart.baseState || emptyBaseState()) };
}

function loadBaseStateForInning(chart, inning) {
  chart.baseStates = chart.baseStates || {};
  chart.baseState = { ...(chart.baseStates[Number(inning)] || emptyBaseState()) };
}

function setChartInning(chart, inning) {
  syncCurrentBaseState(chart);
  chart.currentInning = Math.min(Number(activeGame().inningCount || 9), Math.max(1, Number(inning) || 1));
  loadBaseStateForInning(chart, chart.currentInning);
}

function setBatterBaseState(chart, batterId, terminalBase) {
  ["first", "second", "third"].forEach((base) => {
    if (chart.baseState[base] === batterId) chart.baseState[base] = "";
  });
  if (terminalBase === "toFirst") chart.baseState.first = batterId;
  if (terminalBase === "toSecond") chart.baseState.second = batterId;
  if (terminalBase === "toThird") chart.baseState.third = batterId;
  syncCurrentBaseState(chart);
}

const baseToTerminal = {
  first: "toFirst",
  second: "toSecond",
  third: "toThird"
};

function terminalAfterAdvancement(base, basesToAdvance) {
  const baseOrder = ["first", "second", "third"];
  const nextIndex = baseOrder.indexOf(base) + basesToAdvance;
  return nextIndex >= baseOrder.length ? "toHome" : baseToTerminal[baseOrder[nextIndex]];
}

function runnerAutoAdvancementForAction(actionKey, baseStateBefore) {
  const runners = ["third", "second", "first"]
    .map((base) => ({ base, runnerId: baseStateBefore[base] }))
    .filter((item) => item.runnerId);

  if (actionKey === "1B") {
    return runners.map((runner) => ({ ...runner, target: terminalAfterAdvancement(runner.base, 1) }));
  }
  if (actionKey === "2B") {
    return runners.map((runner) => ({ ...runner, target: terminalAfterAdvancement(runner.base, 2) }));
  }
  if (["3B", "HR"].includes(actionKey)) {
    return runners.map((runner) => ({ ...runner, target: "toHome" }));
  }
  if (["BB", "IBB", "HBP", "CI", "KPB", "KWP", "ROE"].includes(actionKey)) {
    const moves = [];
    if (baseStateBefore.first && baseStateBefore.second && baseStateBefore.third) {
      moves.push({ base: "third", runnerId: baseStateBefore.third, target: "toHome" });
    }
    if (baseStateBefore.first && baseStateBefore.second) {
      moves.push({ base: "second", runnerId: baseStateBefore.second, target: "toThird" });
    }
    if (baseStateBefore.first) {
      moves.push({ base: "first", runnerId: baseStateBefore.first, target: "toSecond" });
    }
    return moves.filter((item) => item.runnerId);
  }
  return [];
}

function applyAutomaticRunnerAdvancements(sourceCell, sourceCellKey, actionKey, baseStateBefore, effectiveInning) {
  const chart = activeChart();
  runnerAutoAdvancementForAction(actionKey, baseStateBefore).forEach(({ runnerId, target }) => {
    const runnerCellKey = findLatestScoreCellKeyForRunner(runnerId, sourceCellKey);
    if (!runnerCellKey || !chart.scorecard[runnerCellKey]) return;
    const runnerCell = chart.scorecard[runnerCellKey];
    const oldBases = { ...(runnerCell.bases || emptyDiamondPath()) };
    const currentBase = Object.keys(baseToTerminal).find((base) => baseStateBefore[base] === runnerId);
    const oldTerminal = activeDiamondTerminal(oldBases) || baseToTerminal[currentBase] || "";
    const oldPath = oldTerminal ? diamondPathThrough(oldTerminal) : oldBases;
    const nextBases = target ? diamondPathThrough(target) : emptyDiamondPath();
    if (oldTerminal === target) return;

    rememberRunnerCellState(sourceCell, runnerCellKey);
    runnerCell.bases = nextBases;
    runnerCell.runnerId = runnerId;
    runnerCell.scoredOverlay = target === "toHome";
    if (!runnerCell.scoredOverlay) delete runnerCell.scoredOverlay;
    addRunnerInningDelta(sourceCell, effectiveInning, runnerMovementUpdates(oldPath, nextBases));
    syncRunnerRunStatForMovement(sourceCell, runnerId, oldPath, nextBases);
    setBatterBaseState(chart, runnerId, target === "toHome" ? "" : target);
  });
}

function blankPitchingLine() {
  return { outs: 0, H: 0, R: 0, ER: 0, BB: 0, K: 0, KC: 0, HR: 0, "2B": 0, "3B": 0, HBP: 0, WP: 0, BF: 0, pitches: 0, strikes: 0, balls: 0, fouls: 0, twoStrikePitches: 0, BK: 0 };
}

const pitchingLiveToSeasonStat = {
  H: "P_H",
  R: "P_R",
  ER: "P_ER",
  BB: "P_BB",
  K: "P_SO",
  HR: "P_HR",
  "2B": "P_2B",
  "3B": "P_3B",
  HBP: "P_HBP",
  WP: "P_WP",
  BF: "BF",
  pitches: "Pitches",
  strikes: "Strikes",
  BK: "P_BK"
};

function applyPitchingStatUpdateToStats(stats, key, value) {
  const delta = toNumber(value);
  if (!delta) return;
  if (key === "outs") {
    stats.IP = outsToIpValue(Math.max(0, ipToOuts(stats.IP) + Math.round(delta)));
    return;
  }
  const seasonKey = pitchingLiveToSeasonStat[key];
  if (!seasonKey) return;
  stats[seasonKey] = Math.max(0, toNumber(stats[seasonKey]) + delta);
}

function signedUpdates(updates, direction = 1) {
  return Object.fromEntries(Object.entries(updates || {}).map(([key, value]) => [key, toNumber(value) * direction]));
}

function applyPitchingStatUpdatesToBuckets(pitcherId, updates, buckets = statBucketsForGameType(activeGameType()), direction = 1) {
  if (!pitcherId) return;
  const pitcher = state.players.find((player) => player.id === pitcherId);
  if (!pitcher) return;
  const adjusted = direction === 1 ? updates : signedUpdates(updates, direction);
  buckets.forEach((bucket) => {
    const stats = ensureStatBucket(pitcher, bucket);
    Object.entries(adjusted || {}).forEach(([key, value]) => {
      applyPitchingStatUpdateToStats(stats, key, value);
    });
    calculatePitchingRates(stats);
  });
}

function applyPitchingStatUpdates(pitcherId, updates, gameType = activeGameType()) {
  applyPitchingStatUpdatesToBuckets(pitcherId, updates, statBucketsForGameType(gameType));
}

function formatIpFromOuts(outs) {
  return `${Math.floor(outs / 3)}.${outs % 3}`;
}

function pitchingOuts(value = {}) {
  return Object.prototype.hasOwnProperty.call(value, "outs") ? toNumber(value.outs) : ipToOuts(value.IP);
}

function formatRatioValue(numerator, denominator, digits = 2) {
  const denom = toNumber(denominator);
  return denom ? formatFixed(toNumber(numerator) / denom, digits) : "-";
}

function formatPerNine(numerator, outs) {
  const innings = toNumber(outs) / 3;
  return innings ? formatFixed((toNumber(numerator) * 9) / innings, 2) : "-";
}

function formatPerInning(numerator, outs) {
  const innings = toNumber(outs) / 3;
  return innings ? formatFixed(toNumber(numerator) / innings, 2) : "-";
}

function livePitchingRates(line) {
  const outs = pitchingOuts(line);
  const innings = outs / 3;
  const era = outs ? (toNumber(line.ER) * 9) / innings : 0;
  const whip = outs ? (toNumber(line.BB) + toNumber(line.H)) / innings : 0;
  const avgDenom = Math.max(0, toNumber(line.BF) - toNumber(line.BB) - toNumber(line.HBP));
  const baa = avgDenom ? toNumber(line.H) / avgDenom : 0;
  return {
    ERA: formatFixed(era, 2),
    WHIP: formatFixed(whip, 2),
    BAA: formatRate(baa)
  };
}

function getPitchingLine(chart, pitcherId = chart.activePitcherId) {
  if (!pitcherId) return blankPitchingLine();
  chart.pitchingLines[pitcherId] = { ...blankPitchingLine(), ...(chart.pitchingLines[pitcherId] || {}) };
  return chart.pitchingLines[pitcherId];
}

function addToPitchingLine(pitcherId, updates, gameType = activeGameType()) {
  if (!pitcherId) return;
  const line = getPitchingLine(activeChart(), pitcherId);
  Object.entries(updates).forEach(([key, value]) => {
    line[key] = Math.max(0, toNumber(line[key]) + toNumber(value));
  });
  applyPitchingStatUpdates(pitcherId, updates, gameType);
}

const pitcherAdjustmentFields = [
  { key: "outs", label: "OUT" },
  { key: "H", label: "H" },
  { key: "R", label: "R" },
  { key: "ER", label: "ER" },
  { key: "BB", label: "BB" },
  { key: "K", label: "K" },
  { key: "KC", label: "Kc" },
  { key: "HR", label: "HR" },
  { key: "2B", label: "2B" },
  { key: "3B", label: "3B" },
  { key: "HBP", label: "HBP" },
  { key: "WP", label: "WP" },
  { key: "BF", label: "BF" },
  { key: "BK", label: "BK" }
];

function setPitcherUpdateValue(cell, pitcherId, key, value) {
  if (!pitcherId) return;
  cell.pitcherId = pitcherId;
  cell.pitcherUpdates = cell.pitcherUpdates || {};
  const oldValue = toNumber(cell.pitcherUpdates[key]);
  const nextValue = Math.max(0, toNumber(value));
  const delta = nextValue - oldValue;
  if (!delta) return;
  addToPitchingLine(pitcherId, { [key]: delta }, cell.gameType || activeGameType());
  if (nextValue) cell.pitcherUpdates[key] = nextValue;
  else delete cell.pitcherUpdates[key];
  if (!Object.keys(cell.pitcherUpdates).length) delete cell.pitcherUpdates;
}

function setCellPitcherUpdate(cellKey, key, value) {
  const chart = activeChart();
  const cell = getScoreCellFromKey(cellKey);
  const pitcherId = cell.pitcherId || chart.activePitcherId;
  if (!pitcherId) return;
  setPitcherUpdateValue(cell, pitcherId, key, value);
}

function addToInningTotals(inning, updates, direction = 1) {
  addToChartInningTotals(activeChart(), inning, updates, direction);
}

function reverseChartCell(cellKey, options = {}) {
  const chart = activeChart();
  const cell = chart.scorecard[cellKey];
  if (!cell) return;

  if (cell.eventId) {
    const event = state.events.find((item) => item.id === cell.eventId);
    if (event) applyEvent(event, -1);
    state.events = state.events.filter((item) => item.id !== cell.eventId);
  }
  if (cell.pitcherId && cell.pitcherUpdates) {
    const reversePitcher = {};
    Object.entries(cell.pitcherUpdates).forEach(([key, value]) => {
      reversePitcher[key] = -value;
    });
    addToPitchingLine(cell.pitcherId, reversePitcher, cell.gameType || activeGameType());
  }
  if (!options.preservePitches && cell.pitchDeltas) {
    cell.pitchDeltas.forEach((pitch) => {
      if (pitch.pitcherId) {
        if (pitch.updates) {
          const reverseUpdates = {};
          Object.entries(pitch.updates).forEach(([key, value]) => {
            reverseUpdates[key] = -toNumber(value);
          });
          addToPitchingLine(pitch.pitcherId, reverseUpdates, pitch.gameType || cell.gameType || activeGameType());
          if (pitch.type !== "balk") chart.pitchCounts[pitch.pitcherId] = Math.max(0, toNumber(chart.pitchCounts[pitch.pitcherId]) - 1);
        } else {
          const line = getPitchingLine(chart, pitch.pitcherId);
          if (pitch.type === "balk") {
            line.BK = Math.max(0, toNumber(line.BK) - 1);
          } else {
            chart.pitchCounts[pitch.pitcherId] = Math.max(0, toNumber(chart.pitchCounts[pitch.pitcherId]) - 1);
            line.pitches = Math.max(0, toNumber(line.pitches) - 1);
            if (pitch.type === "strike" || pitch.type === "foul") line.strikes = Math.max(0, toNumber(line.strikes) - 1);
          }
        }
      }
      if (pitch.id) chart.pitchLog = chart.pitchLog.filter((item) => item.id !== pitch.id);
    });
  }
  if (cell.inning && cell.inningUpdates) {
    addToInningTotals(cell.inning, cell.inningUpdates, -1);
  }
  if (cell.inning && cell.defensiveInningSide && cell.defensiveInningUpdates) {
    const defensiveChart = activeGame().charts[cell.defensiveInningSide];
    if (defensiveChart) addToChartInningTotals(defensiveChart, cell.inning, cell.defensiveInningUpdates, -1);
  }
  if (cell.runnerStatDeltas) {
    cell.runnerStatDeltas.forEach((item) => {
      const player = state.players.find((candidate) => candidate.id === item.playerId);
      if (player) {
        statBucketsForGameType(item.gameType || cell.gameType || activeGameType()).forEach((bucket) => {
          const stats = ensureStatBucket(player, bucket);
          stats[item.key] = Math.max(0, toNumber(stats[item.key]) - toNumber(item.value));
        });
      }
    });
  }
  if (cell.runnerPitcherDeltas) {
    cell.runnerPitcherDeltas.forEach((item) => {
      reverseRunnerPitcherDelta(item);
    });
  }
  reverseRunnerInningDelta(cell);
  reverseRunnerDefensiveInningDelta(cell);
  if (cell.runnerDiamondBefore) {
    cell.runnerDiamondBefore.forEach((item) => {
      const targetCell = chart.scorecard[item.key];
      if (!targetCell) return;
      targetCell.bases = { ...item.bases };
      if ("outOverlay" in item) {
        if (item.outOverlay) targetCell.outOverlay = true;
        else delete targetCell.outOverlay;
      }
      if ("scoredOverlay" in item) {
        if (item.scoredOverlay) targetCell.scoredOverlay = true;
        else delete targetCell.scoredOverlay;
      }
      if ("runnerId" in item) {
        if (item.runnerId) targetCell.runnerId = item.runnerId;
        else delete targetCell.runnerId;
      }
      if ("runnerNote" in item) {
        if (item.runnerNote) targetCell.runnerNote = item.runnerNote;
        else delete targetCell.runnerNote;
      }
    });
  }
  if (cell.baseStateBefore) {
    chart.baseState = { ...cell.baseStateBefore };
    syncCurrentBaseState(chart);
  }

  delete cell.eventId;
  delete cell.pitcherId;
  delete cell.pitcherUpdates;
  if (!options.preservePitches) delete cell.pitchDeltas;
  delete cell.runnerDiamondBefore;
  delete cell.inning;
  delete cell.inningUpdates;
  delete cell.defensiveInningSide;
  delete cell.defensiveInningUpdates;
  delete cell.baseStateBefore;
  delete cell.actionKey;
  delete cell.gameType;
  delete cell.runnerStatDeltas;
  delete cell.runnerPitcherDeltas;
  delete cell.runnerInning;
  delete cell.runnerInningUpdates;
  delete cell.runnerDefensiveInning;
  delete cell.runnerDefensiveInningSide;
  delete cell.runnerDefensiveInningUpdates;
  delete cell.runnerId;
  delete cell.runnerNote;
  delete cell.outOverlay;
  delete cell.scoredOverlay;
}

function microRundown(player) {
  const stats = player.stats;
  const rates = calcStats(stats);
  const details = [];
  const avg = toNumber(rates.AVG);
  const ops = toNumber(rates.OPS);

  if (ops >= 1) details.push("middle-of-the-order damage profile");
  else if (avg >= 0.3) details.push("steady contact bat");
  else if (stats.BB >= stats.SO && stats.PA > 0) details.push("patient, strike-zone aware plate appearance");
  else details.push("track the matchup and recent swings");

  if (stats.HR || stats["2B"] + stats["3B"] >= 3) details.push(`${stats.HR} HR and ${stats["2B"] + stats["3B"]} extra-base hits`);
  if (stats.SB) details.push(`${stats.SB} stolen bases`);
  if (stats.RBI) details.push(`${stats.RBI} RBI`);
  if (stats.IP) details.push(`${formatIpValue(stats.IP)} IP on the mound`);

  return `${fullName(player)} is a ${details.join(", ")}. Current line: ${rates.AVG}/${rates.OBP}/${rates.SLG}, ${stats.H} H in ${stats.AB} AB.`;
}

function teamSetupHtml(side) {
  const meta = teamMetaForSide(side);
  return `
    <div class="panel-heading">
      <h2>Team Snapshot Setup</h2>
      <span>${escapeHtml(sideLabel(side))}</span>
    </div>
    <div class="team-setup-grid" style="${teamColorStyle(side)}">
      <label class="team-logo-uploader">
        <span>Logo</span>
        <div class="setup-logo-preview">
          ${meta.logo ? `<img src="${escapeHtml(meta.logo)}" alt="${escapeHtml(sideLabel(side))} logo" />` : `<strong>${escapeHtml(teamInitials(sideLabel(side)))}</strong>`}
        </div>
        <input type="file" accept="image/*" data-team-logo="${side}" />
      </label>
      <div class="team-setup-fields">
        <label>Mascot <input type="text" data-team-meta-side="${side}" data-team-meta-field="mascot" value="${escapeHtml(meta.mascot)}" placeholder="Broncbusters" /></label>
        <label>Ranking <input type="text" data-team-meta-side="${side}" data-team-meta-field="ranking" value="${escapeHtml(meta.ranking)}" placeholder="#7 / RV / No. 12" /></label>
        <label>Abbrev <input type="text" data-team-meta-side="${side}" data-team-meta-field="abbreviation" value="${escapeHtml(meta.abbreviation)}" placeholder="GCCC" /></label>
        <label>Location <input type="text" data-team-meta-side="${side}" data-team-meta-field="location" value="${escapeHtml(meta.location)}" placeholder="Garden City, KS" /></label>
        <label>Conference <input type="text" data-team-meta-side="${side}" data-team-meta-field="conferenceName" value="${escapeHtml(meta.conferenceName)}" placeholder="KJCCC" /></label>
        <label>League <input type="text" data-team-meta-side="${side}" data-team-meta-field="leagueName" value="${escapeHtml(meta.leagueName)}" placeholder="NJCAA" /></label>
        <label>Overall record <input type="text" data-team-meta-side="${side}" data-team-meta-field="overallRecord" value="${escapeHtml(meta.overallRecord)}" placeholder="21-31" /></label>
        <label>Conference record <input type="text" data-team-meta-side="${side}" data-team-meta-field="conferenceRecord" value="${escapeHtml(meta.conferenceRecord)}" placeholder="13-14" /></label>
        <label>Primary color <input type="color" data-team-meta-side="${side}" data-team-meta-field="primaryColor" value="${escapeHtml(safeHex(meta.primaryColor, "#167052"))}" /></label>
      </div>
    </div>
    <label>Institution info
      <textarea data-team-meta-side="${side}" data-team-meta-field="institutionInfo" rows="4" placeholder="Institution notes, league context, campus, program identity...">${escapeHtml(meta.institutionInfo)}</textarea>
    </label>
    <div class="setup-toggle-grid">
      <label class="setting-toggle"><input type="checkbox" data-team-toggle="${side}" data-team-meta-field="showSnapshot" ${meta.showSnapshot ? "checked" : ""} /> Show team stat snapshot</label>
      <label class="setting-toggle"><input type="checkbox" data-team-toggle="${side}" data-team-meta-field="showRecords" ${meta.showRecords ? "checked" : ""} /> Show decade records</label>
      <label class="setting-toggle"><input type="checkbox" data-team-toggle="${side}" data-team-meta-field="showCoaches" ${meta.showCoaches ? "checked" : ""} /> Show coaching staff</label>
    </div>
    <label>HUD notes
      <textarea data-chart-hud-field="chartNotes" rows="3" placeholder="Broadcast notes to keep near the chart...">${escapeHtml(activeChart().hud.chartNotes)}</textarea>
    </label>
    <label>Defense notes
      <textarea data-chart-hud-field="defenseNotes" rows="3" placeholder="Defensive tendencies, shifts, catcher notes...">${escapeHtml(activeChart().hud.defenseNotes)}</textarea>
    </label>
    <div class="setup-subsection">
      <div class="mini-section-title"><strong>Previous Records</strong><span>Last decade</span></div>
      <div class="setup-record-grid">
        ${meta.records.map((row, index) => `
          <input data-team-record-side="${side}" data-team-record-index="${index}" data-team-record-field="season" value="${escapeHtml(row.season)}" placeholder="2025" />
          <input data-team-record-side="${side}" data-team-record-index="${index}" data-team-record-field="overall" value="${escapeHtml(row.overall)}" placeholder="21-31" />
          <input data-team-record-side="${side}" data-team-record-index="${index}" data-team-record-field="conference" value="${escapeHtml(row.conference)}" placeholder="13-14" />
        `).join("")}
      </div>
    </div>
    <div class="setup-subsection">
      <div class="mini-section-title">
        <strong>Coaching Staff</strong>
        <button type="button" data-add-coach="${side}">Add Coach</button>
      </div>
      <div class="coach-setup-list">
        ${meta.coaches.map((coach, index) => `
          <article class="coach-setup-card">
            <label class="coach-image-uploader">
              ${coach.image ? `<img src="${escapeHtml(coach.image)}" alt="${escapeHtml(coach.name || "Coach")}" />` : `<span>Photo</span>`}
              <input type="file" accept="image/*" data-coach-image-side="${side}" data-coach-index="${index}" />
            </label>
            <div>
              <input data-coach-side="${side}" data-coach-index="${index}" data-coach-field="name" value="${escapeHtml(coach.name)}" placeholder="Name" />
              <input data-coach-side="${side}" data-coach-index="${index}" data-coach-field="title" value="${escapeHtml(coach.title)}" placeholder="Title" />
              <textarea data-coach-side="${side}" data-coach-index="${index}" data-coach-field="bio" rows="2" placeholder="Bio / notes">${escapeHtml(coach.bio)}</textarea>
            </div>
            <button type="button" class="danger" data-delete-coach="${side}" data-coach-index="${index}">Delete</button>
          </article>
        `).join("") || `<p class="meta">Add coaches, photos, titles, and notes here.</p>`}
      </div>
    </div>
  `;
}

function renderSetup() {
  document.querySelectorAll(".side-tab").forEach((tab) => {
    applySideTabColors(tab);
    tab.classList.toggle("active", tab.dataset.side === state.activeSide);
    const role = tab.dataset.side === "home" ? "Home" : "Away";
    tab.textContent = `${role}: ${sideLabel(tab.dataset.side)}`;
  });
  const gameInfo = activeGame().game;
  els.teamName.value = gameInfo.teamName;
  els.opponentName.value = gameInfo.opponentName;
  els.gameDate.value = gameInfo.gameDate;
  if (els.gameType) els.gameType.value = activeGameType();
  if (els.gameLocation) els.gameLocation.value = gameInfo.location || "";
  if (els.gameVenue) els.gameVenue.value = gameInfo.venue || "";
  if (els.gameFieldName) els.gameFieldName.value = gameInfo.fieldName || "";
  if (els.firstPitchTime) els.firstPitchTime.value = gameInfo.firstPitchTime || "";
  if (els.firstPitchWeather) els.firstPitchWeather.value = gameInfo.firstPitchWeather || "";
  if (els.umpireHp) els.umpireHp.value = gameInfo.umpires?.hp || "";
  if (els.umpireFirst) els.umpireFirst.value = gameInfo.umpires?.first || "";
  if (els.umpireSecond) els.umpireSecond.value = gameInfo.umpires?.second || "";
  if (els.umpireThird) els.umpireThird.value = gameInfo.umpires?.third || "";
  els.gameNotes.value = gameInfo.notes;
  if (els.teamProfilePanel) els.teamProfilePanel.innerHTML = teamSetupHtml(state.activeSide);
  if (els.showAtBatControls) els.showAtBatControls.checked = Boolean(state.settings.showAtBatControls);
  if (els.showFocusControls) els.showFocusControls.checked = Boolean(state.settings.showFocusControls);
  if (els.showStatExplanations) els.showStatExplanations.checked = Boolean(state.settings.showStatExplanations);
  if (!state.settings.showFocusControls) {
    Object.values(activeGame().charts).forEach((chart) => {
      chart.viewMode = "all";
    });
  }
  const players = activePlayers();
  els.playerCount.textContent = `${activeSideName()}: ${players.length} player${players.length === 1 ? "" : "s"}`;
  els.rosterSummary.textContent = players.length ? `${players.length} editable player cards` : "No players yet";
  els.inningCount.innerHTML = Array.from({ length: 18 }, (_, index) => {
    const value = index + 3;
    return `<option value="${value}" ${value === Number(activeGame().inningCount) ? "selected" : ""}>${value}</option>`;
  }).join("");
  els.inningCount.value = String(activeGame().inningCount);
  els.currentInning.innerHTML = Array.from({ length: Number(activeGame().inningCount || 9) }, (_, index) => {
    const value = index + 1;
    return `<option value="${value}" ${value === Number(activeChart().currentInning) ? "selected" : ""}>${value}</option>`;
  }).join("");
  if (els.statHud) {
    const isPinned = Boolean(state.pinStatHud);
    els.statHud.classList.toggle("is-pinned", isPinned);
    els.statHud.classList.remove("is-compact");
    els.statHud.dataset.hudMode = "compact";
  }
  if (els.pinChartButton) {
    const isPinned = Boolean(state.pinStatHud);
    els.pinChartButton.classList.toggle("active", isPinned);
    els.pinChartButton.textContent = isPinned ? "Unpinned HUD" : "Pinned HUD";
  }

  els.sourceList.innerHTML = state.sources.length
    ? state.sources.map((source) => `
      <div class="source-item">
        <strong>${escapeHtml(source.name)}</strong>
        <p class="meta">${escapeHtml(source.type.toUpperCase())} - ${escapeHtml(source.detail || "Attached")} - ${new Date(source.importedAt).toLocaleString()}</p>
      </div>
    `).join("")
    : `<p class="meta">Import a season, conference, or box-score CSV to track your prep sources.</p>`;
}

function scoreCellKey(slotIndex, inning, abIndex = 0) {
  return abIndex ? `${slotIndex + 1}-${inning}-${abIndex + 1}` : `${slotIndex + 1}-${inning}`;
}

function getScoreCell(slotIndex, inning, abIndex = 0) {
  const key = scoreCellKey(slotIndex, inning, abIndex);
  const chart = activeChart();
  chart.scorecard[key] = chart.scorecard[key] || {
    count: "",
    result: "",
    rbi: "",
    notes: "",
    bases: {
      toFirst: false,
      toSecond: false,
      toThird: false,
      toHome: false
    }
  };
  return chart.scorecard[key];
}

function getScoreCellFromKey(key) {
  const [slot, inning, abNumber] = key.split("-").map(Number);
  return activeChart().scorecard[key] || getScoreCell(slot - 1, inning, abNumber ? abNumber - 1 : 0);
}

function parseScoreCellKey(key) {
  const [slot = 0, inning = 0, abNumber = 1] = key.split("-").map(Number);
  return { slot, inning, abNumber: abNumber || 1 };
}

function lineupLength() {
  const chart = activeChart();
  return Math.max(9, chart.lineup.length);
}

function getCurrentSlot() {
  const slot = Number(activeChart().currentSlot) || 1;
  const len = lineupLength();
  return ((slot - 1) % len + len) % len + 1;
}

function slotAfter(slot, offset = 1) {
  const len = lineupLength();
  return ((slot - 1 + offset) % len + len) % len + 1;
}

function abCountForSlotInning(slotIndex, inning, chart = activeChart()) {
  return 1 + toNumber(chart.extraAbs[scoreCellKey(slotIndex, inning)] || 0);
}

function selectedAbForSlotInning(slotIndex, inning, chart = activeChart()) {
  chart.selectedAbs = chart.selectedAbs || {};
  const baseKey = scoreCellKey(slotIndex, inning);
  const maxIndex = Math.max(0, abCountForSlotInning(slotIndex, inning, chart) - 1);
  const selected = Math.min(maxIndex, Math.max(0, toNumber(chart.selectedAbs[baseKey])));
  if (selected) chart.selectedAbs[baseKey] = selected;
  else delete chart.selectedAbs[baseKey];
  return selected;
}

function setSelectedAbForSlotInning(slotIndex, inning, abIndex, chart = activeChart()) {
  chart.selectedAbs = chart.selectedAbs || {};
  const baseKey = scoreCellKey(slotIndex, inning);
  const maxIndex = Math.max(0, abCountForSlotInning(slotIndex, inning, chart) - 1);
  const selected = Math.min(maxIndex, Math.max(0, toNumber(abIndex)));
  if (selected) chart.selectedAbs[baseKey] = selected;
  else delete chart.selectedAbs[baseKey];
  return selected;
}

function addExtraAbForSlotInning(slotIndex, inning, chart = activeChart()) {
  const baseKey = scoreCellKey(slotIndex, inning);
  chart.extraAbs[baseKey] = toNumber(chart.extraAbs[baseKey]) + 1;
  return setSelectedAbForSlotInning(slotIndex, inning, chart.extraAbs[baseKey], chart);
}

function cellHasResult(cell) {
  return Boolean(cell && (cell.result || cell.notation));
}

function cellActualInning(cell, fallbackInning) {
  if (!cell) return fallbackInning;
  return Number(cell.actualInning) || fallbackInning;
}

function getActiveCellLocation() {
  const chart = activeChart();
  const currentInning = Number(chart.currentInning || 1);
  const slotIndex = getCurrentSlot() - 1;
  const abIndex = selectedAbForSlotInning(slotIndex, currentInning, chart);
  return { key: scoreCellKey(slotIndex, currentInning, abIndex), column: currentInning, abIndex, displaced: false };
}

function ensureActiveCellExists() {
  const chart = activeChart();
  const loc = getActiveCellLocation();
  const cell = chart.scorecard[loc.key] = chart.scorecard[loc.key] || {
    count: "",
    result: "",
    rbi: "",
    notes: "",
    bases: emptyDiamondPath()
  };
  return loc;
}

function visibleColumnsForView() {
  return [Number(activeChart().currentInning || 1)];
}

function slotNeedsExtraAb(slot, inning) {
  const chart = activeChart();
  const slotIndex = slot - 1;
  const abCount = abCountForSlotInning(slotIndex, inning);
  const lastCell = chart.scorecard[scoreCellKey(slotIndex, inning, abCount - 1)];
  return Boolean(lastCell && (lastCell.result || lastCell.notation));
}

function advanceBatter() {
  const chart = activeChart();
  const fromSlot = getCurrentSlot();
  const nextSlot = slotAfter(fromSlot, 1);
  chart.currentSlot = nextSlot;
  ensureActiveCellExists();
}

function rewindBatter() {
  const chart = activeChart();
  const fromSlot = getCurrentSlot();
  const prevSlot = slotAfter(fromSlot, -1);
  chart.currentSlot = prevSlot;
}

function sortScoreCellKeysNewestFirst(leftKey, rightKey) {
  const left = parseScoreCellKey(leftKey);
  const right = parseScoreCellKey(rightKey);
  return right.inning - left.inning || right.slot - left.slot || right.abNumber - left.abNumber;
}

function findLatestScoreCellKeyForRunner(playerId, exceptKey = "") {
  const chart = activeChart();
  const directMatch = Object.keys(chart.scorecard)
    .filter((key) => {
      if (key === exceptKey) return false;
      const cell = chart.scorecard[key];
      return cell?.runnerId === playerId;
    })
    .sort(sortScoreCellKeysNewestFirst)[0];
  if (directMatch) return directMatch;

  const slot = slotForRunnerId(playerId);
  if (slot) return findLiveRunnerCellKeyForSlot(slot) || findLatestScoreCellKeyForSlot(slot);

  return Object.keys(chart.scorecard)
    .filter((key) => {
      if (key === exceptKey) return false;
      const parsed = parseScoreCellKey(key);
      return chart.lineup[parsed.slot - 1] === playerId;
    })
    .sort(sortScoreCellKeysNewestFirst)[0] || "";
}

function findLiveRunnerCellKeyForSlot(slot) {
  const chart = activeChart();
  return Object.keys(chart.scorecard)
    .filter((key) => {
      const parsed = parseScoreCellKey(key);
      if (parsed.slot !== slot) return false;
      const terminal = activeDiamondTerminal(chart.scorecard[key]?.bases || emptyDiamondPath());
      return terminal && terminal !== "toHome";
    })
    .sort(sortScoreCellKeysNewestFirst)[0] || "";
}

function findLatestScoreCellKeyForSlot(slot) {
  const chart = activeChart();
  return Object.keys(chart.scorecard)
    .filter((key) => parseScoreCellKey(key).slot === slot)
    .sort(sortScoreCellKeysNewestFirst)[0] || "";
}

function liveRunnerIdForSlot(slotIndex, chart = activeChart()) {
  const liveCellKey = findLiveRunnerCellKeyForSlot(slotIndex + 1);
  if (!liveCellKey || !chart.scorecard[liveCellKey]) return "";
  return chart.scorecard[liveCellKey].runnerId || "";
}

function updateLiveRunnerAssignmentForSlot(slotIndex, previousRunnerId, nextRunnerId) {
  const chart = activeChart();
  const slot = slotIndex + 1;
  const liveCellKey = findLiveRunnerCellKeyForSlot(slot);
  if (liveCellKey && chart.scorecard[liveCellKey]) {
    if (nextRunnerId) chart.scorecard[liveCellKey].runnerId = nextRunnerId;
    else delete chart.scorecard[liveCellKey].runnerId;
  }
  if (!previousRunnerId || previousRunnerId === nextRunnerId) return;
  ["first", "second", "third"].forEach((base) => {
    if (chart.baseState[base] === previousRunnerId) chart.baseState[base] = nextRunnerId || "";
  });
  syncCurrentBaseState(chart);
}

function updateRunnerDiamond(playerId, terminalBase, exceptKey = "") {
  const key = findLatestScoreCellKeyForRunner(playerId, exceptKey);
  if (!key) return null;
  const cell = activeChart().scorecard[key];
  if (!cell) return null;
  const previous = { key, bases: { ...(cell.bases || emptyDiamondPath()) } };
  cell.bases = terminalBase ? diamondPathThrough(terminalBase) : emptyDiamondPath();
  return previous;
}

function blankInningTotals() {
  return { H: 0, R: 0, E: 0, LOB: 0, RISP: 0 };
}

function getChartInningTotals(chart, inning = chart.currentInning) {
  chart.inningTotals[inning] = chart.inningTotals[inning] || blankInningTotals();
  return chart.inningTotals[inning];
}

function getInningTotals(inning = activeChart().currentInning) {
  return getChartInningTotals(activeChart(), inning);
}

function addToChartInningTotals(chart, inning, updates, direction = 1) {
  if (!chart) return;
  const totals = getChartInningTotals(chart, inning);
  Object.entries(updates || {}).forEach(([key, value]) => {
    totals[key] = Math.max(0, toNumber(totals[key]) + toNumber(value) * direction);
  });
}

function countBaseStateRunners(baseState = {}) {
  return ["first", "second", "third"].filter((base) => Boolean(baseState[base])).length;
}

function countBaseStateRisp(baseState = {}) {
  return ["second", "third"].filter((base) => Boolean(baseState[base])).length;
}

function syncInningBaseTotals(chart, inning) {
  const baseState = Number(chart.currentInning || 1) === Number(inning)
    ? chart.baseState
    : (chart.baseStates?.[Number(inning)] || emptyBaseState());
  const totals = getChartInningTotals(chart, inning);
  totals.LOB = countBaseStateRunners(baseState);
  totals.RISP = countBaseStateRisp(baseState);
}

function tonightLineForPlayer(playerId) {
  const tonightEvents = activeGameEvents().filter((event) => event.playerId === playerId);
  const line = { PA: 0, AB: 0, H: 0, "2B": 0, "3B": 0, HR: 0, BB: 0, SO: 0, HBP: 0, RBI: 0, R: 0 };
  tonightEvents.forEach((event) => {
    const delta = eventDelta(event.result);
    Object.entries(delta).forEach(([key, value]) => {
      if (line[key] !== undefined) line[key] += value;
    });
    line.RBI += toNumber(event.rbi);
  });
  return { line, events: tonightEvents };
}

function currentGameBatterStats(playerId) {
  const stats = emptyStats();
  if (!playerId) return stats;
  const gameIds = new Set();
  activeGameEvents()
    .filter((event) => event.playerId === playerId)
    .forEach((event) => {
      gameIds.add(event.gameId || activeGame().id);
      const delta = eventDelta(event.result);
      Object.entries(delta).forEach(([key, value]) => {
        stats[key] = Math.max(0, toNumber(stats[key]) + toNumber(value));
      });
      stats.RBI = Math.max(0, toNumber(stats.RBI) + toNumber(event.rbi));
      stats.SB = Math.max(0, toNumber(stats.SB) + toNumber(event.sb));
      stats.CS = Math.max(0, toNumber(stats.CS) + toNumber(event.cs));
    });
  Object.values(activeGame().charts || {}).forEach((chart) => {
    Object.values(chart.scorecard || {}).forEach((cell) => {
      (cell.runnerStatDeltas || []).forEach((item) => {
        if (item.playerId !== playerId) return;
        gameIds.add(activeGame().id);
        stats[item.key] = Math.max(0, toNumber(stats[item.key]) + toNumber(item.value));
      });
    });
  });
  stats.GP = gameIds.size ? 1 : 0;
  return stats;
}

function addEventStats(stats, event) {
  const delta = eventDelta(event.result);
  Object.entries(delta).forEach(([key, value]) => {
    stats[key] = Math.max(0, toNumber(stats[key]) + toNumber(value));
  });
  stats.RBI = Math.max(0, toNumber(stats.RBI) + toNumber(event.rbi));
  stats.SB = Math.max(0, toNumber(stats.SB) + toNumber(event.sb));
  stats.CS = Math.max(0, toNumber(stats.CS) + toNumber(event.cs));
}

function seriesBatterStats(playerId) {
  const stats = emptyStats();
  if (!playerId) return stats;
  const gameIds = new Set();
  (state.events || [])
    .filter((event) => event.playerId === playerId)
    .forEach((event) => {
      addEventStats(stats, event);
      if (event.gameId) gameIds.add(event.gameId);
    });

  (state.games || []).forEach((game) => {
    Object.values(game.charts || {}).forEach((chart) => {
      Object.values(chart.scorecard || {}).forEach((cell) => {
        (cell.runnerStatDeltas || []).forEach((item) => {
          if (item.playerId !== playerId) return;
          stats[item.key] = Math.max(0, toNumber(stats[item.key]) + toNumber(item.value));
          if (game.id) gameIds.add(game.id);
        });
      });
    });
  });
  stats.GP = gameIds.size;
  return stats;
}

function livePitchingLineHasData(line = {}) {
  return ["outs", "H", "R", "ER", "BB", "K", "HR", "2B", "3B", "HBP", "WP", "BF", "pitches", "strikes", "BK"]
    .some((key) => toNumber(line[key]) > 0);
}

function addLivePitchingLineToStats(stats, line = {}) {
  stats.IP = outsToIpValue(ipToOuts(stats.IP) + toNumber(line.outs));
  stats.P_H = Math.max(0, toNumber(stats.P_H) + toNumber(line.H));
  stats.P_R = Math.max(0, toNumber(stats.P_R) + toNumber(line.R));
  stats.P_ER = Math.max(0, toNumber(stats.P_ER) + toNumber(line.ER));
  stats.P_BB = Math.max(0, toNumber(stats.P_BB) + toNumber(line.BB));
  stats.P_SO = Math.max(0, toNumber(stats.P_SO) + toNumber(line.K));
  stats.P_HR = Math.max(0, toNumber(stats.P_HR) + toNumber(line.HR));
  stats.P_2B = Math.max(0, toNumber(stats.P_2B) + toNumber(line["2B"]));
  stats.P_3B = Math.max(0, toNumber(stats.P_3B) + toNumber(line["3B"]));
  stats.P_HBP = Math.max(0, toNumber(stats.P_HBP) + toNumber(line.HBP));
  stats.P_WP = Math.max(0, toNumber(stats.P_WP) + toNumber(line.WP));
  stats.P_BK = Math.max(0, toNumber(stats.P_BK) + toNumber(line.BK));
  stats.BK = Math.max(0, toNumber(stats.BK) + toNumber(line.BK));
  stats.BF = Math.max(0, toNumber(stats.BF) + toNumber(line.BF));
  stats.Pitches = Math.max(0, toNumber(stats.Pitches) + toNumber(line.pitches));
  stats.Strikes = Math.max(0, toNumber(stats.Strikes) + toNumber(line.strikes));
}

function addLivePitchingLineToLine(target, line = {}) {
  Object.keys(blankPitchingLine()).forEach((key) => {
    target[key] = Math.max(0, toNumber(target[key]) + toNumber(line[key]));
  });
}

function seriesPitchingLine(playerId) {
  const line = blankPitchingLine();
  if (!playerId) return line;
  (state.games || []).forEach((game) => {
    Object.values(game.charts || {}).forEach((chart) => {
      const chartLine = chart.pitchingLines?.[playerId];
      if (!chartLine) return;
      addLivePitchingLineToLine(line, chartLine);
    });
  });
  return line;
}

function seriesPitcherStats(playerId) {
  const stats = emptyStats();
  if (!playerId) return stats;
  const gameIds = new Set();
  (state.games || []).forEach((game) => {
    Object.values(game.charts || {}).forEach((chart) => {
      const line = chart.pitchingLines?.[playerId];
      if (!line || !livePitchingLineHasData(line)) return;
      addLivePitchingLineToStats(stats, line);
      if (game.id) gameIds.add(game.id);
    });
  });
  stats.P_GP = gameIds.size;
  calculatePitchingRates(stats);
  return stats;
}

function seriesStatsFor(player, kind) {
  return kind === "pitcher" ? seriesPitcherStats(player?.id) : seriesBatterStats(player?.id);
}

function hasSeriesStats(player, kind) {
  if (!player?.id) return false;
  const stats = seriesStatsFor(player, kind);
  return hasStatData(stats, kind === "pitcher" ? pitcherStatKeys : batterStatKeys);
}

function gameLineForPlayer(playerId, gameId) {
  const line = { PA: 0, AB: 0, H: 0, "2B": 0, "3B": 0, HR: 0, BB: 0, SO: 0, HBP: 0, RBI: 0, SB: 0, CS: 0 };
  const events = (state.events || []).filter((event) => event.gameId === gameId && event.playerId === playerId);
  events.forEach((event) => {
    const delta = eventDelta(event.result);
    Object.entries(delta).forEach(([key, value]) => {
      if (line[key] !== undefined) line[key] += toNumber(value);
    });
    line.RBI += toNumber(event.rbi);
    line.SB += toNumber(event.sb);
    line.CS += toNumber(event.cs);
  });
  return { line, events };
}

function chartedRecentGamesForPlayer(playerId) {
  return (state.games || [])
    .map((game, index) => ({ game, index, ...gameLineForPlayer(playerId, game.id) }))
    .filter((item) => item.index !== state.activeGameIndex && item.events.length)
    .sort((a, b) => b.index - a.index)
    .map((item) => ({
      source: "chart",
      order: item.index,
      date: item.game.game?.gameDate || "",
      opponent: item.game.game?.opponentName || "",
      label: item.game.label || `Game ${item.index + 1}`,
      line: item.line
    }));
}

function recentGamesForPlayer(playerId) {
  const boxGames = boxScoreLinesForPlayer(playerId).map(({ box, line }) => ({
    source: "box",
    order: Number.MAX_SAFE_INTEGER,
    date: box.gameDate || "",
    opponent: box.opponent || "",
    label: box.gameDate ? formatBoxDate(box.gameDate) : "Box",
    line
  }));
  return [...chartedRecentGamesForPlayer(playerId), ...boxGames]
    .sort((a, b) => {
      if (a.source !== b.source) return a.source === "chart" ? -1 : 1;
      if (a.source === "chart") return b.order - a.order;
      return String(b.date).localeCompare(String(a.date));
    });
}

function currentInningOuts(inning = activeChart().currentInning) {
  const chart = activeChart();
  return Object.entries(chart.scorecard || {}).reduce((outs, [key, cell]) => {
    const { inning: cellColumn } = parseScoreCellKey(key);
    if (cellActualInning(cell, cellColumn) !== Number(inning)) return outs;
    if (cell.outOverlay || ["OUT", "K", "Kc", "SF", "BI"].includes(cell.result) || ["OUT", "K", "KC", "SF", "BI"].includes(cell.actionKey)) return outs + 1;
    return outs;
  }, 0);
}

function eventInningText(event) {
  const match = String(event?.context || "").match(/Inning\s+(\d+)/i);
  return match ? `Inn ${match[1]}` : "Inn ?";
}

function recentPaText(events, limit = 4) {
  const items = events.slice(0, limit).map((event) => {
    const label = event.context?.split(": ").pop() || resultLabel(event.result);
    return `${eventInningText(event)} ${label.replace("strikeout", "K")}`;
  });
  return items.length ? items.join(" / ") : "No PA yet";
}

function inningOrdinal(value) {
  const n = Math.max(1, Number(value || 1));
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th");
  return `${n}${suffix} inning`;
}

function scoreCellPitchTotal(cell = {}) {
  return (cell.pitchDeltas || []).filter((pitch) => pitch.type !== "balk").length;
}

function scoreCellPlayText(cell = {}, event = {}) {
  const contextText = String(event.context || "").split(": ").pop();
  return cell.notation || cell.result || contextText || resultLabel(event.result) || "PA";
}

function completedPaItemsForPlayer(playerId, game = activeGame()) {
  if (!playerId || !game) return [];
  const eventsById = new Map((state.events || []).filter((event) => eventBelongsToGame(event, game.id)).map((event) => [event.id, event]));
  return Object.values(game.charts || {})
    .flatMap((chart) => chartEventCells(chart, eventsById).filter((item) => item.event?.playerId === playerId))
    .sort(scoreCellSortChronological);
}

function paDetailText(item) {
  const parsed = parseScoreCellKey(item.key);
  const inning = cellActualInning(item.cell, parsed.inning);
  const details = [];
  const count = item.cell?.count || item.event?.count || "";
  const pitches = scoreCellPitchTotal(item.cell);
  const rbi = toNumber(item.event?.rbi || item.cell?.rbi);
  if (count) details.push(`${count} count`);
  if (pitches) details.push(`${pitches} total ${pitches === 1 ? "pitch" : "pitches"}`);
  if (rbi) details.push(`${rbi} RBI`);
  if (item.cell?.runnerNote) details.push(item.cell.runnerNote);
  return `${inningOrdinal(inning)}: ${scoreCellPlayText(item.cell, item.event)}${details.length ? `, ${details.join(", ")}` : ""}`;
}

function batterLineSummary(line = {}) {
  const extras = [];
  if (line.RBI) extras.push(`${line.RBI} RBI`);
  if (line.BB) extras.push(`${line.BB} BB`);
  if (line.HBP) extras.push(`${line.HBP} HBP`);
  if (line.SO) extras.push(`${line.SO} K`);
  return `${line.H || 0}/${line.AB || 0}${extras.length ? `, ${extras.join(", ")}` : ""}, ${line.PA || 0} PA`;
}

function currentPaDetailForPlayer(player) {
  if (!player || playerAtSlot(getCurrentSlot())?.id !== player.id) return "This player is not the active batter right now.";
  const location = getActiveCellLocation();
  const cell = activeChart().scorecard[location.key] || {};
  const details = [`Count ${cell.count || "0-0"}`];
  const pitches = scoreCellPitchTotal(cell);
  details.push(`${pitches} total ${pitches === 1 ? "pitch" : "pitches"}`);
  if (cell.notation || cell.result) details.unshift(scoreCellPlayText(cell, {}));
  if (toNumber(cell.rbi)) details.push(`${toNumber(cell.rbi)} RBI selected`);
  return details.join(", ");
}

function recentGameDetailText(item) {
  const line = item.line || {};
  const opponentText = item.opponent ? ` vs ${item.opponent}` : "";
  const extras = [];
  if (line.RBI) extras.push(`${line.RBI} RBI`);
  if (line.BB) extras.push(`${line.BB} BB`);
  if (line.SO) extras.push(`${line.SO} K`);
  if (line.HR) extras.push(`${line.HR} HR`);
  if (line.SB) extras.push(`${line.SB} SB`);
  if (line.CS) extras.push(`${line.CS} CS`);
  return `${item.label}${opponentText}: ${line.H || 0}/${line.AB || 0}${extras.length ? `, ${extras.join(", ")}` : ""}`;
}

function hudContextInfo(playerId, type) {
  const player = playerById(playerId);
  const { line } = tonightLineForPlayer(playerId);
  const paItems = completedPaItemsForPlayer(playerId, activeGame());
  if (type === "current") {
    return {
      title: "Current PA Info",
      summary: `Today: ${batterLineSummary(line)}.`,
      items: [
        currentPaDetailForPlayer(player),
        ...(paItems.length ? paItems.map(paDetailText) : ["No completed PA in this game yet."])
      ]
    };
  }
  if (type === "previous") {
    const previous = paItems.slice(-6);
    return {
      title: "Previous At-Bat Info",
      summary: previous.length ? "Most recent completed plate appearances in this game." : "No previous completed plate appearance in this game yet.",
      items: previous.length ? previous.map(paDetailText) : ["Once a result is entered, this will show inning, play, count, pitch total, RBI, and runner notes."]
    };
  }
  const recentGames = recentGamesForPlayer(playerId).slice(0, 6);
  return {
    title: "Recent Game Info",
    summary: recentGames.length ? "Recent charted games and imported box-score lines." : "No recent game line is available yet.",
    items: recentGames.length ? recentGames.map(recentGameDetailText) : ["Chart another game or import a box score to populate this view."]
  };
}

function hudStatClass(value, type = "neutral") {
  if (value === undefined || value === null || value === "" || value === "-" || String(value).includes("--")) return "stat-neutral";
  const n = toNumber(value);
  if (type === "avg") return n >= 0.3 ? "stat-good" : n >= 0.24 ? "stat-average" : "stat-bad";
  if (type === "obp") return n >= 0.38 ? "stat-good" : n >= 0.32 ? "stat-average" : "stat-bad";
  if (type === "slg") return n >= 0.48 ? "stat-good" : n >= 0.36 ? "stat-average" : "stat-bad";
  if (type === "ops") return n >= 0.85 ? "stat-good" : n >= 0.68 ? "stat-average" : "stat-bad";
  if (type === "iso") return n >= 0.18 ? "stat-good" : n >= 0.1 ? "stat-average" : "stat-bad";
  if (type === "bbp") return n >= 10 ? "stat-good" : n >= 6 ? "stat-average" : "stat-bad";
  if (type === "kp") return n <= 15 ? "stat-good" : n <= 25 ? "stat-average" : "stat-bad";
  if (type === "pkp") return n >= 25 ? "stat-good" : n >= 18 ? "stat-average" : "stat-bad";
  if (type === "pkbbp") return n >= 18 ? "stat-good" : n >= 10 ? "stat-average" : "stat-bad";
  if (type === "pbbp") return n <= 6 ? "stat-good" : n <= 10 ? "stat-average" : "stat-bad";
  if (type === "pk9") return n >= 9 ? "stat-good" : n >= 6 ? "stat-average" : "stat-bad";
  if (type === "pbb9") return n <= 3 ? "stat-good" : n <= 5 ? "stat-average" : "stat-bad";
  if (type === "ph9") return n <= 7 ? "stat-good" : n <= 10 ? "stat-average" : "stat-bad";
  if (type === "phr9") return n <= 0.8 ? "stat-good" : n <= 1.5 ? "stat-average" : "stat-bad";
  if (type === "strikep") return n >= 64 ? "stat-good" : n >= 58 ? "stat-average" : "stat-bad";
  if (type === "ballp") return n <= 32 ? "stat-good" : n <= 38 ? "stat-average" : "stat-bad";
  if (type === "ratioHigh") return n >= 3 ? "stat-good" : n >= 1.8 ? "stat-average" : "stat-bad";
  if (type === "era") return n <= 3 ? "stat-good" : n <= 5 ? "stat-average" : "stat-bad";
  if (type === "whip") return n <= 1.25 ? "stat-good" : n <= 1.6 ? "stat-average" : "stat-bad";
  if (type === "baa") return n <= 0.23 ? "stat-good" : n <= 0.3 ? "stat-average" : "stat-bad";
  if (type === "count") return n > 0 ? "stat-good" : "stat-neutral";
  return "stat-neutral";
}

function hudStatSizeClass(label, value) {
  const valueText = String(value ?? "");
  const labelText = String(label ?? "");
  const classes = [];
  if (valueText.length >= 9) classes.push("stat-value-xlong");
  else if (valueText.length >= 6 || (valueText.endsWith("%") && valueText.length >= 5)) classes.push("stat-value-long");
  if (labelText.length >= 8) classes.push("stat-label-long");
  if (labelText.length >= 14) classes.push("stat-label-xlong");
  return classes.join(" ");
}

function hudStatChip(label, value, type = "neutral") {
  return `<span class="hud-stat-chip ${hudStatClass(value, type)} ${hudStatSizeClass(label, value)}"><b>${escapeHtml(String(value))}</b><i>${escapeHtml(label)}</i></span>`;
}

const statExplanationData = {
  PA: { title: "PA", formula: "Plate appearances are AB + BB + HBP + SF when an explicit PA total is not available.", example: "Example: 40 AB, 8 BB, 2 HBP, and 1 SF is 51 PA." },
  AB: { title: "AB", formula: "Official at-bats exclude walks, hit by pitch, sacrifice flies, and some other plate appearances.", example: "Example: a walk counts as a PA but not an AB." },
  AVG: { title: "AVG", formula: "Hits divided by at-bats.", example: "Example: 3 hits in 10 at-bats is .300." },
  HIT: { title: "H", formula: "Hits recorded by a batter.", example: "Example: a single, double, triple, and homer each add one hit." },
  RUN: { title: "R", formula: "Runs scored by the batter/runner.", example: "Example: crossing home safely adds one run." },
  RBI: { title: "RBI", formula: "Runs batted in credited to the hitter.", example: "Example: a single that scores two runners adds 2 RBI." },
  OBP: { title: "OBP", formula: "(Hits + walks + hit by pitch) divided by (AB + BB + HBP + SF).", example: "Example: 2 H, 1 BB, 1 HBP in 10 AB plus 1 SF is 4 / 13, or .308." },
  SLG: { title: "SLG", formula: "Total bases divided by at-bats.", example: "Example: a single, double, and homer is 7 total bases. In 10 AB, SLG is .700." },
  OPS: { title: "OPS", formula: "On-base percentage plus slugging percentage.", example: "Example: .380 OBP plus .520 SLG equals a .900 OPS." },
  ONEB: { title: "1B", formula: "Hits minus doubles, triples, and home runs.", example: "Example: 20 H minus 4 doubles, 1 triple, and 2 HR gives 13 singles." },
  TWOB: { title: "2B", formula: "Doubles hit.", example: "Example: a ball that puts the batter safely on second as the result of the hit adds one double." },
  THREEB: { title: "3B", formula: "Triples hit.", example: "Example: a ball that puts the batter safely on third as the result of the hit adds one triple." },
  HRCOUNT: { title: "HR", formula: "Home runs hit by the batter.", example: "Example: a solo homer adds one HR, one R, one RBI, and four total bases." },
  TB: { title: "TB", formula: "Singles + 2 times doubles + 3 times triples + 4 times home runs.", example: "Example: 10 singles, 4 doubles, 1 triple, and 2 HR is 29 total bases." },
  XBHCOUNT: { title: "XBH", formula: "Doubles plus triples plus home runs.", example: "Example: 4 doubles, 1 triple, and 2 HR is 7 extra-base hits." },
  ISO: { title: "ISO", formula: "Slugging percentage minus batting average.", example: "Example: .520 SLG minus .300 AVG equals .220 ISO." },
  BABIP: { title: "BABIP", formula: "(Hits - home runs) divided by (AB - strikeouts - HR + SF).", example: "Example: 30 non-HR hits on 90 balls in play is .333." },
  KP: { title: "K%", formula: "Strikeouts divided by plate appearances.", example: "Example: 12 strikeouts in 60 PA is 20.0%." },
  BBP: { title: "BB%", formula: "Walks divided by plate appearances.", example: "Example: 9 walks in 60 PA is 15.0%." },
  XBH: { title: "XBH%", formula: "Extra-base hits divided by total hits.", example: "Example: 6 extra-base hits among 20 hits is 30.0%." },
  XBHPA: { title: "XBH/PA", formula: "Extra-base hits divided by plate appearances.", example: "Example: 6 extra-base hits in 75 PA is 8.0%." },
  HRPA: { title: "HR/PA", formula: "Home runs divided by plate appearances.", example: "Example: 3 home runs in 75 PA is 4.0%." },
  HRP: { title: "HR%", formula: "Home runs divided by at-bats.", example: "Example: 3 home runs in 50 AB is 6.0%." },
  SBCOUNT: { title: "SB", formula: "Stolen bases.", example: "Example: a successful steal of second adds one SB." },
  SBP: { title: "SB%", formula: "Stolen bases divided by stolen-base attempts.", example: "Example: 8 steals in 10 tries is 80.0%." },
  SBCS: { title: "SB/CS", formula: "Stolen bases compared to caught stealing.", example: "Example: 8/2 means eight steals and two times caught stealing." },
  BBCOUNT: { title: "BB", formula: "Walks drawn by a batter.", example: "Example: a four-pitch walk adds one BB and one PA, but not an AB." },
  KCOUNT: { title: "SO/K", formula: "Strikeouts by a batter.", example: "Example: a swinging, looking, or dropped-third strikeout all add one strikeout." },
  HBP: { title: "HBP", formula: "Hit by pitch.", example: "Example: a batter hit by a pitch is credited with one HBP and one PA, but not an AB." },
  BBK: { title: "BB/K", formula: "Walks divided by strikeouts.", example: "Example: 12 walks and 8 strikeouts is a 1.50 BB/K." },
  RRBIHR: { title: "R+RBI-HR", formula: "Runs plus RBI minus home runs, avoiding double-counting a player's own homer.", example: "Example: 30 R plus 28 RBI minus 5 HR is 53 run-production events." },
  PAAB: { title: "PA/AB", formula: "Plate appearances compared to official at-bats.", example: "Example: walks, HBP, and sac flies count as PA but not AB." },
  AVGWRISP: { title: "Current AVG w/RISP", formula: "Current-game hits divided by at-bats when a runner was on second or third before the play.", example: "Example: 2 hits in 5 RISP at-bats is .400." },
  TWOOUTPA: { title: "Current 2-Out PA", formula: "Current-game plate appearances that began with two outs.", example: "Example: three trips with two outs gives 3 current 2-out PA." },
  TWOOUTAVG: { title: "Current 2-Out AVG", formula: "Current-game two-out hits divided by current-game two-out at-bats.", example: "Example: 2 hits in 6 two-out at-bats is .333." },
  TWOOUTOBP: { title: "Current 2-Out OBP", formula: "Current-game two-out times on base divided by current-game two-out PA.", example: "Example: 3 times on base in 8 two-out PA is .375." },
  TWOOUTHIT: { title: "Current 2-Out Hit", formula: "Current-game hits recorded in plate appearances that began with two outs.", example: "Example: a two-out single and a two-out double gives 2 two-out hits." },
  TWOOUTRBI: { title: "Current 2-Out RBI", formula: "Current-game RBI recorded in plate appearances that began with two outs.", example: "Example: a two-out, two-run double adds 2 current 2-out RBI." },
  GP: { title: "GP/GS", formula: "Games played compared to games started.", example: "Example: 21/19 means 21 appearances and 19 starts." },
  APP: { title: "App/GS", formula: "Pitching appearances compared to games started.", example: "Example: 7/3 means seven mound appearances and three starts." },
  WL: { title: "W/L", formula: "Pitching wins compared to pitching losses.", example: "Example: 4/2 means four wins and two losses." },
  ERA: { title: "ERA", formula: "Earned runs times 9, divided by innings pitched.", example: "Example: 6 ER in 18 IP gives a 3.00 ERA." },
  GERA: { title: "Game ERA", formula: "Current-game earned runs times 9, divided by current-game innings pitched.", example: "Example: 1 ER in 3 IP is a 3.00 game ERA." },
  WHIP: { title: "WHIP", formula: "(Walks + hits allowed) divided by innings pitched.", example: "Example: 12 H plus 4 BB in 16 IP is a 1.00 WHIP." },
  GWHIP: { title: "Game WHIP", formula: "Current-game walks plus hits allowed, divided by current-game innings pitched.", example: "Example: 4 baserunners in 3 IP is a 1.33 game WHIP." },
  BAA: { title: "AVG / BAA", formula: "Hits allowed divided by at-bats against.", example: "Example: 5 hits allowed in 25 AB against is a .200 opponent average." },
  GAVG: { title: "Game AVG Against", formula: "Current-game hits allowed divided by estimated at-bats against.", example: "Example: 3 hits in 15 AB against is .200." },
  PH: { title: "H Allowed", formula: "Hits allowed by the pitcher.", example: "Example: a single, double, triple, or homer against the pitcher adds one hit allowed." },
  PR: { title: "R Allowed", formula: "Runs charged to the pitcher.", example: "Example: if two charged runners score, the pitcher is charged with 2 R." },
  ER: { title: "ER", formula: "Earned runs charged to the pitcher.", example: "Example: a run that scores without an error extending the inning is usually earned." },
  P2B: { title: "2B Allowed", formula: "Doubles allowed by the pitcher.", example: "Example: a double against the pitcher adds one 2B allowed." },
  P3B: { title: "3B Allowed", formula: "Triples allowed by the pitcher.", example: "Example: a triple against the pitcher adds one 3B allowed." },
  PHR: { title: "HR Allowed", formula: "Home runs allowed by the pitcher.", example: "Example: two opponent homers add 2 HR allowed." },
  PBB: { title: "BB Allowed", formula: "Walks issued by the pitcher.", example: "Example: 3 walks to 20 batters faced is a 15.0% walk rate." },
  PSO: { title: "SO / K", formula: "Strikeouts recorded by the pitcher.", example: "Example: swinging, looking, and dropped-third strikeouts all add one pitching strikeout." },
  KLOOK: { title: "K/ꓘ", formula: "Total strikeouts compared to looking strikeouts.", example: "Example: 7/2 means seven total strikeouts, two of them looking." },
  PHBP: { title: "HBP Allowed", formula: "Batters hit by pitch.", example: "Example: hitting one batter adds one HBP allowed." },
  PWP: { title: "WP", formula: "Wild pitches charged to the pitcher.", example: "Example: a pitch that gets away and lets a runner advance can add one WP." },
  PBK: { title: "Bk", formula: "Balks charged to the pitcher.", example: "Example: a balk that advances runners adds one Bk." },
  BF: { title: "BF", formula: "Batters faced by the pitcher.", example: "Example: five plate appearances against a pitcher adds 5 BF." },
  K9: { title: "K/9", formula: "Strikeouts times 9, divided by innings pitched.", example: "Example: 8 K in 6 IP is 12.00 K/9." },
  BB9: { title: "BB/9", formula: "Walks times 9, divided by innings pitched.", example: "Example: 2 BB in 6 IP is 3.00 BB/9." },
  H9: { title: "H/9", formula: "Hits allowed times 9, divided by innings pitched.", example: "Example: 4 H in 6 IP is 6.00 H/9." },
  HR9: { title: "HR/9", formula: "Home runs allowed times 9, divided by innings pitched.", example: "Example: 1 HR in 6 IP is 1.50 HR/9." },
  PKP: { title: "Pitcher K%", formula: "Pitching strikeouts divided by batters faced.", example: "Example: 6 K against 24 BF is 25.0%." },
  PBBP: { title: "Pitcher BB%", formula: "Walks issued divided by batters faced.", example: "Example: 3 BB against 24 BF is 12.5%." },
  KBBP: { title: "K-BB%", formula: "Pitcher K% minus pitcher BB%.", example: "Example: 25.0% K% minus 8.0% BB% is 17.0%." },
  KBB: { title: "K/BB", formula: "Pitching strikeouts divided by walks.", example: "Example: 8 K and 2 BB is a 4.00 K/BB." },
  PIP: { title: "P/IP", formula: "Total pitches divided by innings pitched.", example: "Example: 72 pitches in 6 IP is 12.00 P/IP." },
  PBF: { title: "P/BF", formula: "Total pitches divided by batters faced.", example: "Example: 72 pitches to 24 BF is 3.00 P/BF." },
  STRIKEP: { title: "Strike%", formula: "Strikes divided by total pitches.", example: "Example: 45 strikes on 72 pitches is 62.5%." },
  BALLP: { title: "Ball%", formula: "Balls divided by total pitches.", example: "Example: 27 balls on 72 pitches is 37.5%." },
  FOULP: { title: "Foul%", formula: "Fouls divided by total pitches.", example: "Example: 12 fouls on 72 pitches is 16.7%." },
  GBP: { title: "Game BB%", formula: "Current-game walks divided by batters faced.", example: "Example: 2 walks against 20 batters faced is 10.0%." },
  G2STR: { title: "Game Two-Strike%", formula: "Two-strike pitches divided by total pitches.", example: "Example: 18 two-strike pitches out of 72 pitches is 25.0%." },
  LRA: { title: "Leadoff Runner Allowed", formula: "First batter faced by the pitcher in an inning who reaches base.", example: "Example: 2/5 means two leadoff runners allowed in five pitcher-innings." },
  FBOIR: { title: "First Batter of Inning Reached", formula: "The official first batter of an inning reaches base against that pitcher.", example: "Example: if the first batter of the third walks, FBoIR adds one." },
  ONE23I: { title: "1-2-3 Inning", formula: "A pitcher faces three batters in an inning and allows no traffic.", example: "Example: three up, three down adds one 123I." },
  TR: { title: "Traffic Rate", formula: "Baserunners allowed divided by innings pitched.", example: "Example: 6 baserunners in 4 IP is a 1.50 traffic rate." },
  PSBF: { title: "P/S/B/F", formula: "Total pitches, strikes, balls, and fouls in the current game.", example: "Example: 72/45/27/12 means 72 pitches, 45 strikes, 27 balls, 12 fouls." },
  IP: { title: "IP", formula: "Innings pitched, shown as innings.outs.", example: "Example: 5.2 means five innings and two outs, not five and two-thirds as a decimal." },
  PLAYERS: { title: "Players", formula: "Number of roster players currently included for that team.", example: "Example: 31 roster cards gives 31 players." },
  STAFFERA: { title: "Staff ERA", formula: "Team earned runs allowed times 9, divided by team innings pitched.", example: "Example: 12 ER in 36 IP gives a 3.00 staff ERA." },
  PAVG: { title: "P AVG", formula: "Opponent batting average against the pitching staff.", example: "Example: 40 hits allowed in 160 at-bats against is .250." },
  SV: { title: "SV", formula: "Pitching saves.", example: "Example: closing a qualifying win while preserving the lead adds one save." },
  CG: { title: "CG", formula: "Complete games pitched.", example: "Example: one pitcher throwing every inning of a regulation game adds one CG." },
  SHO: { title: "SHO", formula: "Shutouts pitched or credited in the imported pitching stats.", example: "Example: a complete game with no runs allowed can add one SHO." },
  BK: { title: "BK", formula: "Balks charged to the pitcher or pitching staff.", example: "Example: a balk that advances runners adds one BK." },
  CS: { title: "CS", formula: "Times caught stealing as a runner.", example: "Example: thrown out trying to steal second adds one CS." },
  SBA: { title: "SBA", formula: "Stolen-base attempts against the defense or catcher, depending on the imported source.", example: "Example: if opponents try to steal 12 times, SBA is 12." },
  RCS: { title: "RCS", formula: "Runners caught stealing by the defense or catcher.", example: "Example: throwing out three attempted steals gives 3 RCS." },
  RCSP: { title: "RCS%", formula: "Runners caught stealing divided by stolen-base attempts against.", example: "Example: 3 caught stealing on 12 attempts against is 25.0%." },
  FPCT: { title: "F%", formula: "(Total chances minus errors) divided by total chances.", example: "Example: 100 chances and 4 errors gives a .960 fielding percentage." },
  TC: { title: "TC", formula: "Total chances: putouts plus assists plus errors.", example: "Example: 40 PO, 55 A, and 5 E gives 100 TC." },
  PO: { title: "PO", formula: "Putouts recorded by the fielder or team.", example: "Example: catching a fly ball adds one PO." },
  ASSIST: { title: "A", formula: "Fielding assists.", example: "Example: a shortstop throw to first on a groundout adds one assist." },
  FIELDERR: { title: "E", formula: "Fielding errors.", example: "Example: a misplay that allows a batter or runner to advance can add one E." },
  FDP: { title: "DP", formula: "Double plays turned by the fielder or team.", example: "Example: a 6-4-3 double play adds one DP." },
  PB: { title: "PB", formula: "Passed balls charged to the catcher or team.", example: "Example: a catchable pitch that gets by and advances a runner can add one PB." },
  FCI: { title: "CI", formula: "Catcher interference.", example: "Example: batter awarded first on catcher interference adds one CI." },
  SFA: { title: "SFA", formula: "Sacrifice flies allowed by a pitcher or staff.", example: "Example: a fly ball that scores a runner and is scored SF adds one SFA." },
  SHA: { title: "SHA", formula: "Sacrifice hits or bunts allowed by a pitcher or staff.", example: "Example: a scored sacrifice bunt against the pitcher adds one SHA." }
};

function statExplanationKey(label) {
  const raw = String(label || "").trim().toUpperCase();
  if (raw === "K%") return "KP";
  if (raw === "BB%") return "BBP";
  if (raw === "HR%") return "HRP";
  if (raw === "SB%") return "SBP";
  if (raw === "XBH%") return "XBH";
  if (raw === "STRIKE%") return "STRIKEP";
  if (raw === "BALL%") return "BALLP";
  if (raw === "FOUL%") return "FOULP";
  if (raw === "K-BB%") return "KBBP";
  if (raw === "2-STRIKE PITCH%") return "G2STR";
  const compact = String(label || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const aliases = {
    SLG: "SLG",
    SLG2: "SLG",
    SLGPC: "SLG",
    SLGPCT: "SLG",
    K: "KCOUNT",
    SO: "KCOUNT",
    SOK: "KCOUNT",
    KPCT: "KP",
    BB: "BBCOUNT",
    BBPCT: "BBP",
    XBH: "XBHCOUNT",
    XBHPCT: "XBH",
    HR: "HRCOUNT",
    HRPCT: "HRP",
    H: "HIT",
    R: "RUN",
    RBI: "RBI",
    AB: "AB",
    PA: "PA",
    "1B": "ONEB",
    "2B": "TWOB",
    "3B": "THREEB",
    SB: "SBCOUNT",
    SBPCT: "SBP",
    SBCS: "SBCS",
    BBK: "BBK",
    PAAB: "PAAB",
    XBHPA: "XBHPA",
    HRPA: "HRPA",
    RRBIHR: "RRBIHR",
    AVGWRISP: "AVGWRISP",
    "2OUTPA": "TWOOUTPA",
    "2OUTAVG": "TWOOUTAVG",
    "2OUTOBP": "TWOOUTOBP",
    "2OUTHIT": "TWOOUTHIT",
    "2OUTRBI": "TWOOUTRBI",
    GPGS: "GP",
    APPGS: "APP",
    WL: "WL",
    AVG: "AVG",
    WHIP: "WHIP",
    ERA: "ERA",
    BF: "BF",
    HBP: "HBP",
    WP: "WP",
    BK: "BK",
    PLAYERS: "PLAYERS",
    STAFFERA: "STAFFERA",
    PAVG: "PAVG",
    SV: "SV",
    CG: "CG",
    SHO: "SHO",
    CS: "CS",
    SBA: "SBA",
    RCS: "RCS",
    RCSPCT: "RCSP",
    FPCT: "FPCT",
    F: "FPCT",
    TC: "TC",
    PO: "PO",
    A: "ASSIST",
    E: "FIELDERR",
    DP: "FDP",
    PB: "PB",
    CI: "FCI",
    SFA: "SFA",
    SHA: "SHA",
    PIP: "PIP",
    PBF: "PBF",
    K9: "K9",
    BB9: "BB9",
    H9: "H9",
    HR9: "HR9",
    KBB: "KBB",
    LRA: "LRA",
    FBOIR: "FBOIR",
    "123I": "ONE23I",
    TR: "TR",
    GAVG: "GAVG",
    GBB: "GBP",
    GBBPCT: "GBP",
    G2STR: "G2STR",
    G2STRPCT: "G2STR",
    PSBF: "PSBF"
  };
  return aliases[compact] || compact;
}

function statExplanationFor(label) {
  return statExplanationData[statExplanationKey(label)] || null;
}

function ensureStatExplanation(explainKey, label) {
  if (!explainKey) return null;
  if (!statExplanationData[explainKey]) {
    statExplanationData[explainKey] = {
      title: String(label || explainKey),
      formula: "Tracked count or rate shown by this stat chip.",
      example: "This chip updates from imported statistics or live charted data when available."
    };
  }
  return statExplanationData[explainKey];
}

function statPill({ label, value, type = "neutral", show = true, className = "", explain = "", span = 1 }) {
  const classes = ["hud-stat-chip", hudStatClass(value, type), hudStatSizeClass(label, value), className].filter(Boolean).join(" ");
  const explainKey = statExplanationKey(explain || label);
  const canExplain = Boolean(state.settings?.showStatExplanations && ensureStatExplanation(explainKey, explain || label));
  const explainAttrs = canExplain
    ? ` data-stat-explain="${escapeHtml(explainKey)}" role="button" tabindex="0" title="Tap for stat explanation"`
    : "";
  const spanStyle = toNumber(span) > 1 ? ` style="grid-column:span ${Math.min(4, toNumber(span))}"` : "";
  return show ? `<span class="${classes}${canExplain ? " is-explainable" : ""}"${explainAttrs}${spanStyle}><b>${escapeHtml(String(value))}</b><i>${escapeHtml(label)}</i></span>` : "";
}

function pillSpan(pill = {}) {
  if (toNumber(pill.span) > 1) return toNumber(pill.span);
  return String(pill.className || "").includes("pitch-count-chip") ? 2 : 1;
}

function renderPillGroups(groups) {
  return groups
    .filter((group) => group.some((pill) => pill.show !== false))
    .map((group) => `<div class="hud-pill-group" style="--pill-count:${group.reduce((sum, pill) => sum + pillSpan(pill), 0)}">${group.map(statPill).join("")}</div>`)
    .join("");
}

function renderPillRow(groups, className = "") {
  const normalizedGroups = Array.isArray(groups?.[0]) ? groups : [groups];
  return `<div class="compact-stat-row ${className}">${renderPillGroups(normalizedGroups)}</div>`;
}

function percentValue(numerator, denominator) {
  const denom = toNumber(denominator);
  return denom ? `${((toNumber(numerator) / denom) * 100).toFixed(1)}%` : "-";
}

function calculatedPercentPill(label, numerator, denominator, type = "neutral", className = "", explain = "") {
  return {
    label,
    value: percentValue(numerator, denominator),
    type,
    className,
    explain
  };
}

function chunkPills(pills, size) {
  const rows = [];
  for (let i = 0; i < pills.length; i += size) {
    rows.push(pills.slice(i, i + size));
  }
  return rows;
}

const batterStatKeys = ["GP", "PA", "AB", "H", "2B", "3B", "HR", "RBI", "R", "BB", "SO", "HBP", "SF", "SB", "CS", "TB"];
const pitcherStatKeys = ["P_GP", "IP", "ERA", "WHIP", "W", "L", "GS", "BF", "BAA", "Pitches", "P_H", "P_R", "P_ER", "P_HR", "P_BB", "P_SO", "P_BK", "P_HBP", "P_WP"];
const nonConferenceSubtractKeys = [
  "GP", "PA", "AB", "H", "2B", "3B", "HR", "RBI", "R", "BB", "SO", "HBP", "SF", "SB", "CS", "TB",
  "P_GP", "W", "L", "GS", "BF", "Pitches", "Strikes", "BK", "P_H", "P_R", "P_ER", "P_HR", "P_2B", "P_3B", "P_BB", "P_SO", "P_BK", "P_HBP", "P_WP", "P_AB", "CG", "SHO", "SV", "SFA", "SHA",
  "TC", "PO", "A", "E", "DP", "SBA", "RCS", "PB", "CI"
];

function hasStatData(stats = {}, keys = []) {
  return keys.some((key) => toNumber(stats[key]) > 0);
}

function hasConferenceStats(player, kind) {
  if (!player?.confStats) return false;
  return hasStatData(player.confStats, kind === "pitcher" ? pitcherStatKeys : batterStatKeys);
}

function hasOverallStats(player, kind) {
  if (!player?.stats) return false;
  return hasStatData(player.stats, kind === "pitcher" ? pitcherStatKeys : batterStatKeys);
}

function hasNonConferenceStats(player, kind) {
  return hasOverallStats(player, kind) && hasConferenceStats(player, kind);
}

function hasPitchingStats(stats = {}) {
  return hasStatData(stats, pitcherStatKeys);
}

function calculatePitchingRates(stats) {
  const outs = ipToOuts(stats.IP);
  const innings = outs / 3;
  if (outs > 0) {
    stats.ERA = (toNumber(stats.P_ER) * 9) / innings;
    stats.WHIP = (toNumber(stats.P_BB) + toNumber(stats.P_H)) / innings;
  } else {
    stats.ERA = 0;
    stats.WHIP = 0;
  }
  const avgDenom = toNumber(stats.P_AB) || Math.max(0, toNumber(stats.BF) - toNumber(stats.P_BB) - toNumber(stats.P_HBP));
  stats.BAA = avgDenom ? toNumber(stats.P_H) / avgDenom : 0;
}

function nonConferenceStatsFor(player) {
  const overall = { ...emptyStats(), ...(player?.stats || {}) };
  const conference = { ...emptyStats(), ...(player?.confStats || {}) };
  const out = emptyStats();

  nonConferenceSubtractKeys.forEach((key) => {
    out[key] = Math.max(0, toNumber(overall[key]) - toNumber(conference[key]));
  });
  out.IP = outsToIpValue(ipToOuts(overall.IP) - ipToOuts(conference.IP));
  calculatePitchingRates(out);
  return out;
}

function formatPitchingStatsLineValue(key, value) {
  if (key === "IP") return formatIpValue(value);
  if (key === "ERA" || key === "WHIP") return formatFixed(value, 2);
  if (key === "BAA") return formatRate(toNumber(value));
  return value || 0;
}

function pitcherAppearanceCount(stats = {}) {
  const explicitApps = toNumber(stats.P_GP);
  if (explicitApps > 0) return explicitApps;
  const starts = toNumber(stats.GS);
  return starts > 0 ? starts : 0;
}

function pitcherAppearanceDisplay(stats = {}) {
  const explicitApps = toNumber(stats.P_GP);
  if (explicitApps > 0) return String(explicitApps);
  const starts = toNumber(stats.GS);
  if (starts > 0) return String(starts);
  return hasPitchingStats(stats) ? "-" : "0";
}

function pitchingStatsLine(stats = {}) {
  const line = { ...emptyStats(), ...(stats || {}) };
  return `P ${line.Pitches || 0} - W-L ${line.W || 0}-${line.L || 0} - ERA ${formatPitchingStatsLineValue("ERA", line.ERA)} - G/GS ${pitcherAppearanceDisplay(line)}/${line.GS || 0} - IP ${formatPitchingStatsLineValue("IP", line.IP)} - H ${line.P_H || 0} - R ${line.P_R || 0} - ER ${line.P_ER || 0} - HR ${line.P_HR || 0} - BB ${line.P_BB || 0} - K ${line.P_SO || 0} - HBP ${line.P_HBP || 0} - WP ${line.P_WP || 0} - BK ${line.P_BK || 0} - WHIP ${formatPitchingStatsLineValue("WHIP", line.WHIP)} - AVG ${formatPitchingStatsLineValue("BAA", line.BAA)}`;
}

function batterHudPills(stats, rates, advanced) {
  const pa = battingPlateAppearances(stats);
  const obpDenom = toNumber(stats.AB) + toNumber(stats.BB) + toNumber(stats.HBP) + toNumber(stats.SF);
  const sbAttempts = stats.SB + stats.CS;
  const singles = battingSingles(stats);
  const xbh = battingExtraBaseHits(stats);
  const totalBases = battingTotalBases(stats);
  const basicPills = [
    { label: "PA", value: pa },
    { label: "AB", value: stats.AB || 0 },
    { label: "AVG", value: stats.AB > 0 ? rates.AVG : "-", type: "avg" },
    { label: "OBP", value: obpDenom > 0 ? rates.OBP : "-", type: "obp" },
    { label: "SLG%", value: stats.AB > 0 ? rates.SLG : "-", type: "slg" },
    { label: "OPS", value: obpDenom > 0 && stats.AB > 0 ? rates.OPS : "-", type: "ops" },
    { label: "R", value: stats.R, type: "count" },
    { label: "H", value: stats.H, type: "count" },
    { label: "1B", value: singles, type: "count", explain: "ONEB" },
    { label: "2B", value: stats["2B"], type: "count" },
    { label: "3B", value: stats["3B"], type: "count" },
    { label: "HR", value: stats.HR, type: "count" },
    { label: "RBI", value: stats.RBI, type: "count" },
    { label: "TB", value: totalBases, type: "count" },
    { label: "XBH", value: xbh, type: "count", explain: "XBHCOUNT" },
    { label: "BB", value: stats.BB },
    { label: "HBP", value: stats.HBP },
    { label: "SO/K", value: stats.SO },
    { label: "SB/CS", value: `${stats.SB || 0}/${stats.CS || 0}`, explain: "SB/CS" },
    calculatedPercentPill("SB%", stats.SB, sbAttempts, "count")
  ];
  const advancedPills = [
    { label: "K%", value: pa > 0 ? advanced.KP : "-", type: "kp" },
    { label: "BB%", value: pa > 0 ? advanced.BBP : "-", type: "bbp" },
    { label: "BB/K", value: advanced.BBK },
    { label: "ISO", value: stats.AB > 0 ? advanced.ISO : "-", type: "iso" },
    calculatedPercentPill("XBH%", xbh, stats.H, "iso"),
    calculatedPercentPill("XBH/PA", xbh, pa, "iso"),
    calculatedPercentPill("HR/PA", stats.HR, pa, "iso"),
    { label: "BABIP", value: stats.AB > 0 ? advanced.BABIP : "-", type: "avg" },
    { label: "R+RBI-HR", value: advanced.RUN_PRODUCTION, type: "count" }
  ];
  return [chunkPills(basicPills, 5), chunkPills(advancedPills, 3)];
}

function scoreCellSortChronological(left, right) {
  const a = parseScoreCellKey(left.key);
  const b = parseScoreCellKey(right.key);
  const aInning = cellActualInning(left.cell, a.inning);
  const bInning = cellActualInning(right.cell, b.inning);
  return aInning - bInning || new Date(left.event?.createdAt || 0) - new Date(right.event?.createdAt || 0) || a.slot - b.slot || a.abNumber - b.abNumber;
}

function cellRecordsOut(cell) {
  return Boolean(cell && (cell.outOverlay || ["OUT", "K", "Kc", "SF", "BI"].includes(cell.result) || ["OUT", "K", "KC", "SF", "BI"].includes(cell.actionKey)));
}

function emptyBatterLeverageLine() {
  return {
    rispAb: 0,
    rispH: 0,
    twoOutH: 0,
    twoOutAb: 0,
    twoOutPa: 0,
    twoOutObpEvents: 0,
    twoOutRbi: 0
  };
}

function chartEventCells(chart, eventsById) {
  const eventCells = Object.entries(chart.scorecard || {})
    .map(([key, cell]) => ({ key, cell, event: eventsById.get(cell.eventId) }))
    .filter((item) => item.event)
    .sort(scoreCellSortChronological);
  return eventCells;
}

function addChartBatterLeverage(line, chart, eventsById, playerId) {
  const outsByInning = {};
  chartEventCells(chart, eventsById).forEach((item) => {
    const parsed = parseScoreCellKey(item.key);
    const inning = cellActualInning(item.cell, parsed.inning);
    const outsBefore = outsByInning[inning] || 0;
    if (item.event.playerId === playerId) {
      const delta = eventDelta(item.event.result);
      const hadRisp = Boolean(item.cell.baseStateBefore?.second || item.cell.baseStateBefore?.third);
      if (hadRisp && delta.AB) {
        line.rispAb += delta.AB;
        line.rispH += delta.H || 0;
      }
      if (outsBefore >= 2) {
        const paDelta = delta.AB || delta.BB || delta.HBP || delta.SF;
        line.twoOutPa += paDelta ? 1 : 0;
        line.twoOutAb += delta.AB || 0;
        line.twoOutH += delta.H || 0;
        line.twoOutObpEvents += (delta.H || 0) + (delta.BB || 0) + (delta.HBP || 0);
        line.twoOutRbi += toNumber(item.event.rbi);
      }
    }
    if (cellRecordsOut(item.cell)) outsByInning[inning] = outsBefore + 1;
  });
}

function batterLeveragePills(playerId, scope = "currentgame") {
  const line = emptyBatterLeverageLine();
  if (!playerId) return [];
  if (scope === "series") {
    const eventsById = new Map((state.events || []).map((event) => [event.id, event]));
    (state.games || []).forEach((game) => {
      Object.values(game.charts || {}).forEach((chart) => addChartBatterLeverage(line, chart, eventsById, playerId));
    });
  } else {
    const eventsById = new Map(activeGameEvents().map((event) => [event.id, event]));
    addChartBatterLeverage(line, activeChart(), eventsById, playerId);
  }
  return [
    { label: "AVG w/RISP", value: line.rispAb ? formatRate(line.rispH / line.rispAb) : "-", type: "avg", className: "game-context-chip" },
    { label: "2-Out PA", value: line.twoOutPa, className: "game-context-chip" },
    { label: "2-Out AVG", value: line.twoOutAb ? formatRate(line.twoOutH / line.twoOutAb) : "-", type: "avg", className: "game-context-chip" },
    { label: "2-Out OBP", value: line.twoOutPa ? formatRate(line.twoOutObpEvents / line.twoOutPa) : "-", type: "obp", className: "game-context-chip" },
    { label: "2-Out Hit", value: line.twoOutH, type: "count", className: "game-context-chip" },
    { label: "2-Out RBI", value: line.twoOutRbi, type: "count", className: "game-context-chip" }
  ];
}

function batterLeverageRows(playerId, scope = "currentgame") {
  return chunkPills(batterLeveragePills(playerId, scope), 3);
}

function pitchingPercentage(numerator, denominator) {
  return percentValue(numerator, denominator);
}

function pitchingPercentageDiff(leftNumerator, leftDenominator, rightNumerator, rightDenominator) {
  const leftDenom = toNumber(leftDenominator);
  const rightDenom = toNumber(rightDenominator);
  if (!leftDenom || !rightDenom) return "-";
  return `${(((toNumber(leftNumerator) / leftDenom) - (toNumber(rightNumerator) / rightDenom)) * 100).toFixed(1)}%`;
}

function pitcherReachedBase(event) {
  return ["single", "double", "triple", "hr", "walk", "hbp", "reachedError", "catcherInterference", "fieldersChoice"].includes(event?.result);
}

function pitcherMatchesCell(item, pitcherId) {
  return Boolean(pitcherId && (item.cell?.pitcherId === pitcherId || item.event?.pitcherId === pitcherId));
}

function emptyPitcherContextLine() {
  return { lra: 0, lraOpps: 0, fboir: 0, fboirOpps: 0, oneTwoThree: 0, traffic: 0 };
}

function addPitcherContextFromChart(context, chart, eventsById, pitcherId) {
  const innings = new Map();
  chartEventCells(chart, eventsById).forEach((item) => {
    const parsed = parseScoreCellKey(item.key);
    const inning = cellActualInning(item.cell, parsed.inning);
    if (!innings.has(inning)) innings.set(inning, []);
    innings.get(inning).push(item);
  });

  innings.forEach((items) => {
    const sorted = items.sort(scoreCellSortChronological);
    const firstInningItem = sorted[0];
    const pitcherItems = sorted.filter((item) => pitcherMatchesCell(item, pitcherId));
    if (!pitcherItems.length) return;

    if (pitcherMatchesCell(firstInningItem, pitcherId)) {
      context.fboirOpps += 1;
      if (pitcherReachedBase(firstInningItem.event)) context.fboir += 1;
    }

    context.lraOpps += 1;
    if (pitcherReachedBase(pitcherItems[0].event)) context.lra += 1;

    const traffic = pitcherItems.filter((item) => pitcherReachedBase(item.event)).length;
    const recordedOuts = pitcherItems.filter((item) => cellRecordsOut(item.cell)).length;
    context.traffic += traffic;
    if (pitcherItems.length === 3 && recordedOuts >= 3 && traffic === 0) context.oneTwoThree += 1;
  });
}

function pitcherContextLine(playerId, scope = "currentgame") {
  const context = emptyPitcherContextLine();
  if (!playerId) return context;
  const games = scope === "series" ? (state.games || []) : [activeGame()];
  games.forEach((game) => {
    const eventsById = new Map((state.events || []).filter((event) => eventBelongsToGame(event, game.id)).map((event) => [event.id, event]));
    Object.values(game.charts || {}).forEach((chart) => addPitcherContextFromChart(context, chart, eventsById, playerId));
  });
  return context;
}

function livePitcherBasicRows(line) {
  const rates = livePitchingRates(line);
  return [
    [
      { label: "P/S/B/F", value: `${line.pitches}/${line.strikes}/${line.balls}/${line.fouls}`, className: "pitch-count-chip", span: 2, explain: "P/S/B/F" },
      { label: "IP", value: formatIpFromOuts(line.outs) },
      { label: "H", value: line.H, explain: "PH" },
      { label: "R", value: line.R, explain: "PR" },
      { label: "ER", value: line.ER, explain: "ER" },
      { label: "K/ꓘ", value: `${line.K || 0}/${line.KC || 0}`, type: "count", explain: "KLOOK" },
      { label: "BB", value: line.BB, explain: "PBB" }
    ],
    [
      { label: "BF", value: line.BF, explain: "BF" },
      { label: "2B", value: line["2B"], explain: "P2B" },
      { label: "3B", value: line["3B"], explain: "P3B" },
      { label: "HR", value: line.HR, explain: "PHR" },
      { label: "HBP", value: line.HBP, explain: "PHBP" },
      { label: "ERA", value: line.outs ? rates.ERA : "-", type: "era" },
      { label: "AVG", value: line.BF ? rates.BAA : "-", type: "baa", explain: "BAA" },
      { label: "WHIP", value: line.outs ? rates.WHIP : "-", type: "whip" }
    ]
  ];
}

function livePitcherAdvancedRows(line, context) {
  const outs = pitchingOuts(line);
  const traffic = toNumber(context.traffic) || toNumber(line.H) + toNumber(line.BB) + toNumber(line.HBP);
  const pills = [
    { label: "K%", value: pitchingPercentage(line.K, line.BF), type: "pkp", explain: "PKP" },
    { label: "BB%", value: pitchingPercentage(line.BB, line.BF), type: "pbbp", explain: "PBBP" },
    { label: "K-BB%", value: pitchingPercentageDiff(line.K, line.BF, line.BB, line.BF), type: "pkbbp", explain: "KBBP" },
    { label: "P/IP", value: formatPerInning(line.pitches, outs), explain: "PIP" },
    { label: "P/BF", value: formatRatioValue(line.pitches, line.BF), explain: "PBF" },
    { label: "Strike%", value: pitchingPercentage(line.strikes, line.pitches), type: "strikep", explain: "STRIKEP" },
    { label: "Ball%", value: pitchingPercentage(line.balls, line.pitches), type: "ballp", explain: "BALLP" },
    { label: "Foul%", value: pitchingPercentage(line.fouls, line.pitches), explain: "FOULP" },
    { label: "2-Strike Pitch%", value: pitchingPercentage(line.twoStrikePitches, line.pitches), type: "strikep", explain: "G2STR" },
    { label: "LRA", value: `${context.lra || 0}/${context.lraOpps || 0}`, explain: "LRA" },
    { label: "FBoIR", value: `${context.fboir || 0}/${context.fboirOpps || 0}`, explain: "FBOIR" },
    { label: "123I", value: context.oneTwoThree || 0, explain: "ONE23I" },
    { label: "TR", value: formatPerInning(traffic, outs), explain: "TR" }
  ];
  return chunkPills(pills, 5);
}

function seasonPitcherBasicRows(stats) {
  const apps = pitcherAppearanceDisplay(stats);
  const avgDenom = toNumber(stats.P_AB) || Math.max(0, toNumber(stats.BF) - toNumber(stats.P_BB) - toNumber(stats.P_HBP));
  const hasIp = ipToOuts(stats.IP) > 0;
  return [
    [
      { label: "IP", value: formatIpValue(stats.IP) },
      { label: "ERA", value: hasIp ? formatFixed(stats.ERA, 2) : "-", type: "era" },
      { label: "W/L", value: `${stats.W || 0}/${stats.L || 0}`, explain: "WL" },
      { label: "App/GS", value: `${apps}/${stats.GS || 0}`, explain: "APP" },
      { label: "H", value: stats.P_H || 0, explain: "PH" },
      { label: "R", value: stats.P_R || 0, explain: "PR" },
      { label: "ER", value: stats.P_ER || 0, explain: "ER" },
      { label: "HR", value: stats.P_HR || 0, explain: "PHR" }
    ],
    [
      { label: "BB", value: stats.P_BB || 0, explain: "PBB" },
      { label: "HBP", value: stats.P_HBP || 0, explain: "PHBP" },
      { label: "SO", value: stats.P_SO || 0, explain: "PSO" },
      { label: "BF", value: stats.BF || 0, explain: "BF" },
      { label: "AVG", value: avgDenom ? formatRate(toNumber(stats.BAA)) : "-", type: "baa", explain: "BAA" },
      { label: "WHIP", value: hasIp ? formatFixed(stats.WHIP, 2) : "-", type: "whip" },
      { label: "WP", value: stats.P_WP || 0, explain: "PWP" },
      { label: "Bk", value: stats.P_BK || 0, explain: "PBK" }
    ]
  ];
}

function seasonPitcherAdvancedRows(stats) {
  const outs = ipToOuts(stats.IP);
  const pills = [
    { label: "K/9", value: formatPerNine(stats.P_SO, outs), type: "pk9", explain: "K9" },
    { label: "BB/9", value: formatPerNine(stats.P_BB, outs), type: "pbb9", explain: "BB9" },
    { label: "H/9", value: formatPerNine(stats.P_H, outs), type: "ph9", explain: "H9" },
    { label: "HR/9", value: formatPerNine(stats.P_HR, outs), type: "phr9", explain: "HR9" },
    { label: "K%", value: pitchingPercentage(stats.P_SO, stats.BF), type: "pkp", explain: "PKP" },
    { label: "BB%", value: pitchingPercentage(stats.P_BB, stats.BF), type: "pbbp", explain: "PBBP" },
    { label: "K/BB", value: formatRatioValue(stats.P_SO, stats.P_BB), type: "ratioHigh", explain: "KBB" }
  ];
  return [pills.slice(0, 3), pills.slice(3)];
}

function pitcherHudRows({ scope, view, liveLine, pitcherStats, pitcherId }) {
  if (scope === "currentgame" || scope === "series") {
    const line = scope === "series" ? seriesPitchingLine(pitcherId) : liveLine;
    return view === "advanced"
      ? livePitcherAdvancedRows(line, pitcherContextLine(pitcherId, scope))
      : livePitcherBasicRows(line);
  }
  const stats = pitcherStats || emptyStats();
  return view === "advanced" ? seasonPitcherAdvancedRows(stats) : seasonPitcherBasicRows(stats);
}

function aggregateTeamStats(side) {
  const players = playersForSide(side);
  const stats = emptyStats();
  let inferredPitcherApps = 0;
  players.forEach((player) => {
    const playerStats = { ...emptyStats(), ...(player.stats || {}) };
    [...new Set([...batterStatKeys, ...pitcherStatKeys, "P_2B", "P_3B", "P_AB", "CG", "SHO", "SV", "SFA", "SHA", "TC", "PO", "A", "E", "DP", "SBA", "RCS", "PB", "CI"])].forEach((key) => {
      if (key === "IP") return;
      stats[key] = toNumber(stats[key]) + toNumber(playerStats[key]);
    });
    if (hasPitchingStats(playerStats)) inferredPitcherApps += pitcherAppearanceCount(playerStats);
    stats.IP = outsToIpValue(ipToOuts(stats.IP) + ipToOuts(playerStats.IP));
  });
  stats.P_GP = inferredPitcherApps;
  const battingRates = calcStats(stats);
  calculatePitchingRates(stats);
  return { stats, battingRates, players };
}

function teamMetaForSide(side) {
  state.teamMeta = normalizeTeamMeta(state.teamMeta);
  return state.teamMeta[side];
}

function teamInitials(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("") || "TEAM";
}

function teamAbbreviation(side) {
  const meta = teamMetaForSide(side);
  return meta.abbreviation || teamInitials(sideLabel(side));
}

function safeHex(value, fallback) {
  const text = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
}

function teamColorStyle(side) {
  const meta = teamMetaForSide(side);
  const primary = safeHex(meta.primaryColor, "#167052");
  return `--team-primary:${primary}`;
}

function applyActiveTeamColors() {
  const meta = teamMetaForSide(state.activeSide);
  const primary = safeHex(meta.primaryColor, "#167052");
  document.documentElement.style.setProperty("--active-team-primary", primary);
}

function applySideTabColors(tab) {
  if (!tab?.dataset?.side) return;
  const meta = teamMetaForSide(tab.dataset.side);
  const primary = safeHex(meta.primaryColor, "#167052");
  tab.style.setProperty("--side-primary", primary);
}

function teamRecordTableHtml(side, compact = false) {
  const rows = teamMetaForSide(side).records || [];
  const visibleRows = rows
    .filter((row) => row.season || row.overall || row.conference)
    .map((row, index) => ({ ...row, originalIndex: index }))
    .sort((a, b) => {
      const yearA = Number(String(a.season || "").match(/\d{4}/)?.[0] || 0);
      const yearB = Number(String(b.season || "").match(/\d{4}/)?.[0] || 0);
      return yearB - yearA || a.originalIndex - b.originalIndex;
    });
  if (!visibleRows.length) return compact ? "" : `<p class="meta">Add prior records in Setup.</p>`;
  const expanded = Boolean(state.settings.expandedTeamRecords?.[side]);
  const displayRows = compact && !expanded ? visibleRows.slice(0, 1) : visibleRows;
  return `
    <div class="team-record-history ${compact ? "compact-record-history" : ""}">
      <table>
        <thead><tr><th>Season</th><th>Overall</th><th>Conference</th></tr></thead>
        <tbody>
          ${displayRows.map((row) => `<tr><td>${escapeHtml(row.season)}</td><td>${escapeHtml(row.overall)}</td><td>${escapeHtml(row.conference)}</td></tr>`).join("")}
        </tbody>
      </table>
      ${compact && visibleRows.length > 1 ? `
        <button type="button" class="record-expand-toggle" data-toggle-records="${side}">
          ${expanded ? "Show fewer seasons" : "Expand to see more seasons"}
        </button>
      ` : ""}
    </div>
  `;
}

function teamCoachesHtml(side) {
  const coaches = teamMetaForSide(side).coaches || [];
  if (!coaches.length) return "";
  return `
    <div class="team-coach-strip">
      ${coaches.map((coach) => `
        <article class="team-coach-card">
          <div class="coach-photo">${coach.image ? `<img src="${escapeHtml(coach.image)}" alt="${escapeHtml(coach.name || "Coach")}" />` : `<span>${escapeHtml(teamInitials(coach.name || "Coach"))}</span>`}</div>
          <div class="team-coach-main">
            <strong>${escapeHtml(coach.name || "Coach")}</strong>
            <span>${escapeHtml(coach.title || "")}</span>
          </div>
          ${coach.bio ? `<details class="coach-bio-details"><summary>Bio</summary><div class="coach-bio-copy">${paragraphTextHtml(coach.bio)}</div></details>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function teamSnapshotHeaderHtml(side) {
  const meta = teamMetaForSide(side);
  const name = sideLabel(side);
  const title = [name, meta.mascot].filter(Boolean).join(" ");
  const affiliations = [meta.conferenceName, meta.leagueName].filter(Boolean).join(" | ");
  const rankLine = meta.ranking ? `<span class="team-ranking">${escapeHtml(meta.ranking)}</span>` : "";
  return `
    <div class="team-snapshot-identity" style="${teamColorStyle(side)}">
      <div class="team-logo-box display-only">
        ${meta.logo
          ? `<img src="${escapeHtml(meta.logo)}" alt="${escapeHtml(name)} logo" />`
          : `<span>${escapeHtml(teamInitials(name))}</span>`}
      </div>
      <div class="team-snapshot-copy">
        <strong>${escapeHtml(title || name)}</strong>
        ${rankLine}
        <span>${escapeHtml([meta.location, meta.abbreviation].filter(Boolean).join(" | "))}</span>
        ${affiliations ? `<span>${escapeHtml(affiliations)}</span>` : ""}
        <em>${escapeHtml([meta.overallRecord, meta.conferenceRecord ? `(${meta.conferenceRecord})` : ""].filter(Boolean).join(" ") || "Record not set")}</em>
        ${meta.institutionInfo ? `<p>${escapeHtml(meta.institutionInfo)}</p>` : ""}
      </div>
    </div>
  `;
}

function gameContextHtml() {
  const game = activeGame().game || {};
  const site = [game.location, game.venue, game.fieldName].filter(Boolean).join(" | ");
  const firstPitch = [game.firstPitchTime, game.firstPitchWeather].filter(Boolean).join(" | ");
  const umpires = game.umpires || {};
  const umpireLine = [
    umpires.hp ? `HP ${umpires.hp}` : "",
    umpires.first ? `1B ${umpires.first}` : "",
    umpires.second ? `2B ${umpires.second}` : "",
    umpires.third ? `3B ${umpires.third}` : ""
  ].filter(Boolean).join(" | ");
  const gameLabel = state.games.length > 1 ? (activeGame().label || `Game ${(state.activeGameIndex ?? 0) + 1}`) : "";
  const rows = [
    gameLabel ? ["Game", gameLabel] : null,
    game.gameDate ? ["Date", game.gameDate] : null,
    site ? ["Site", site] : null,
    firstPitch ? ["First pitch", firstPitch] : null,
    umpireLine ? ["Umpires", umpireLine] : null
  ].filter(Boolean);
  if (!rows.length) return "";
  return `
    <div class="game-context-strip">
      ${rows.map(([label, value]) => `<span><b>${escapeHtml(label)}</b>${escapeHtml(value)}</span>`).join("")}
    </div>
  `;
}

function teamSnapshotGroups(side) {
  const { stats, battingRates, players } = aggregateTeamStats(side);
  const errors = toNumber(stats.E);
  const obpDenom = stats.AB + stats.BB + stats.HBP + stats.SF;
  const fieldingPctDenom = toNumber(stats.TC);
  const fieldingPct = fieldingPctDenom ? formatRate((fieldingPctDenom - errors) / fieldingPctDenom) : "-";
  const hasStaffPitching = hasPitchingStats(stats);
  const pa = stats.PA || stats.AB + stats.BB + stats.HBP + stats.SF;
  const sbAttempts = stats.SB + stats.CS;
  const caughtStealAttempts = stats.SBA + stats.RCS;
  const iso = stats.AB ? (toNumber(battingRates.SLG) - toNumber(battingRates.AVG)).toFixed(3).replace(/^0/, "") : "-";
  return [
    {
      title: "Batting",
      pills: [
        { label: "Players", value: players.length, explain: "PLAYERS" },
        { label: "AVG", value: stats.AB ? battingRates.AVG : "-", type: "avg" },
        { label: "OBP", value: obpDenom ? battingRates.OBP : "-", type: "obp" },
        { label: "SLG%", value: stats.AB ? battingRates.SLG : "-", type: "slg" },
        { label: "OPS", value: stats.AB && obpDenom ? battingRates.OPS : "-", type: "ops" },
        { label: "PA", value: pa },
        { label: "AB", value: stats.AB },
        { label: "R", value: stats.R, type: "count" },
        { label: "H", value: stats.H, type: "count" },
        { label: "2B", value: stats["2B"], type: "count", explain: "TWOB" },
        { label: "3B", value: stats["3B"], type: "count", explain: "THREEB" },
        { label: "HR", value: stats.HR, type: "count", explain: "HRCOUNT" },
        { label: "RBI", value: stats.RBI, type: "count" },
        { label: "BB", value: stats.BB },
        { label: "SO", value: stats.SO, explain: "KCOUNT" },
        { label: "HBP", value: stats.HBP },
        { label: "K%", value: pa ? percentValue(stats.SO, pa) : "-", type: "kp" },
        { label: "BB%", value: pa ? percentValue(stats.BB, pa) : "-", type: "bbp" },
        { label: "ISO", value: iso, type: "iso" }
      ]
    },
    {
      title: "Pitching",
      pills: [
        { label: "IP", value: hasStaffPitching ? formatIpValue(stats.IP) : "-" },
        { label: "Staff ERA", value: hasStaffPitching && ipToOuts(stats.IP) ? formatFixed(stats.ERA, 2) : "-", type: "era", explain: "STAFFERA" },
        { label: "WHIP", value: hasStaffPitching && ipToOuts(stats.IP) ? formatFixed(stats.WHIP, 2) : "-", type: "whip" },
        { label: "P AVG", value: hasStaffPitching && (stats.P_AB || stats.BF) ? formatRate(toNumber(stats.BAA)) : "-", type: "baa", explain: "PAVG" },
        { label: "SV", value: stats.SV || 0, explain: "SV" },
        { label: "CG", value: stats.CG || 0, explain: "CG" },
        { label: "SHO", value: stats.SHO || 0, explain: "SHO" },
        { label: "H", value: stats.P_H || 0, explain: "PH" },
        { label: "R", value: stats.P_R || 0, explain: "PR" },
        { label: "ER", value: stats.P_ER || 0, explain: "ER" },
        { label: "BB", value: stats.P_BB || 0, explain: "PBB" },
        { label: "SO", value: stats.P_SO || 0, explain: "PSO" },
        { label: "HR", value: stats.P_HR || 0, explain: "PHR" },
        { label: "HBP", value: stats.P_HBP || 0, explain: "PHBP" },
        { label: "WP", value: stats.P_WP || 0, explain: "PWP" },
        { label: "BK", value: stats.P_BK || 0, explain: "PBK" }
      ]
    },
    {
      title: "Base Running",
      pills: [
        { label: "SB", value: stats.SB || 0, explain: "SBCOUNT" },
        { label: "CS", value: stats.CS || 0, explain: "CS" },
        { label: "SB%", value: sbAttempts ? percentValue(stats.SB, sbAttempts) : "-", explain: "SBP" },
        { label: "SBA", value: stats.SBA || 0, explain: "SBA" },
        { label: "RCS", value: stats.RCS || 0, explain: "RCS" },
        { label: "RCS%", value: caughtStealAttempts ? percentValue(stats.RCS, caughtStealAttempts) : "-", explain: "RCSP" }
      ]
    },
    {
      title: "Fielding",
      pills: [
        { label: "F%", value: fieldingPct, explain: "FPCT" },
        { label: "TC", value: stats.TC || 0, explain: "TC" },
        { label: "PO", value: stats.PO || 0, explain: "PO" },
        { label: "A", value: stats.A || 0, explain: "ASSIST" },
        { label: "E", value: errors, explain: "FIELDERR" },
        { label: "DP", value: stats.DP || 0, explain: "FDP" },
        { label: "PB", value: stats.PB || 0, explain: "PB" },
        { label: "CI", value: stats.CI || 0, explain: "FCI" }
      ]
    }
  ];
}

function teamSnapshotGroupsHtml(side) {
  return teamSnapshotGroups(side).map((group) => `
    <div class="team-snapshot-stat-group team-snapshot-stat-${group.title.toLowerCase().replace(/\s+/g, "-")}">
      <h3>${escapeHtml(group.title)}</h3>
      <div class="hud-stats team-snapshot-pills">
        ${group.pills.map(statPill).join("")}
      </div>
    </div>
  `).join("");
}

function selectedHudStatScope(kind, player) {
  const requested = state.hudStatScopes?.[kind] || "overall";
  if (requested === "currentgame") return "currentgame";
  if (requested === "series" && hasSeriesStats(player, kind)) return "series";
  if (requested === "conference" && hasConferenceStats(player, kind)) return "conference";
  if (requested === "nonconference" && hasNonConferenceStats(player, kind)) return "nonconference";
  return "overall";
}

function hudStatsFor(player, kind) {
  const scope = selectedHudStatScope(kind, player);
  if (scope === "currentgame" && kind === "batter") return currentGameBatterStats(player?.id);
  if (scope === "series") return seriesStatsFor(player, kind);
  if (scope === "nonconference") return nonConferenceStatsFor(player);
  const source = scope === "conference" ? player?.confStats : player?.stats;
  return { ...emptyStats(), ...(source || {}) };
}

function selectedHudStatView(kind) {
  const requested = state.hudStatViews?.[kind] || "basic";
  return requested === "advanced" ? "advanced" : "basic";
}

function hudScopeToggleHtml(kind, player) {
  const selected = selectedHudStatScope(kind, player);
  const canUseConference = hasConferenceStats(player, kind);
  const canUseNonConference = hasNonConferenceStats(player, kind);
  const canUseSeries = hasSeriesStats(player, kind);
  const label = kind === "pitcher" ? "Pitcher stats scope" : "Batter stats scope";
  const side = player?.side || state.activeSide;
  return `
    <div class="hud-scope-toggle" role="group" aria-label="${label}" style="${teamColorStyle(side)}">
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-scope="currentgame" class="${selected === "currentgame" ? "active" : ""}">CG</button>
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-scope="series" class="${selected === "series" ? "active" : ""}" ${canUseSeries ? "" : "disabled"} title="${canUseSeries ? "Show charted series stats" : "No charted series stats yet"}">SERIES</button>
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-scope="overall" class="${selected === "overall" ? "active" : ""}">OVERALL</button>
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-scope="conference" class="${selected === "conference" ? "active" : ""}" ${canUseConference ? "" : "disabled"} title="${canUseConference ? "Show conference stats" : "No conference stats imported"}">CONF</button>
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-scope="nonconference" class="${selected === "nonconference" ? "active" : ""}" ${canUseNonConference ? "" : "disabled"} title="${canUseNonConference ? "Show overall minus conference stats" : "Overall and conference stats are needed"}">NON-CONF</button>
    </div>
  `;
}

function hudViewToggleHtml(kind, side = state.activeSide) {
  const selected = selectedHudStatView(kind);
  const label = kind === "pitcher" ? "Pitcher HUD view" : "Batter HUD view";
  return `
    <div class="hud-view-toggle" role="group" aria-label="${label}" style="${teamColorStyle(side)}">
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-view="basic" class="${selected === "basic" ? "active" : ""}">BASIC</button>
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-view="advanced" class="${selected === "advanced" ? "active" : ""}">ADV</button>
    </div>
  `;
}

function hudControlsHtml(kind, player, side = player?.side || state.activeSide) {
  return `
    <div class="hud-control-row">
      ${hudScopeToggleHtml(kind, player)}
      ${hudViewToggleHtml(kind, side)}
    </div>
  `;
}

function applyHudStatScopeFromEvent(event) {
  const button = event.target.closest("[data-hud-stat-scope]");
  if (!button || button.disabled) return false;
  const kind = button.dataset.hudStatKind;
  const scope = button.dataset.hudStatScope;
  if (!["batter", "pitcher"].includes(kind) || !["overall", "conference", "nonconference", "currentgame", "series"].includes(scope)) return false;
  closeStatExplanation();
  closeHudContextPopover();
  state.hudStatScopes = state.hudStatScopes || { batter: "overall", pitcher: "overall" };
  state.hudStatScopes[kind] = scope;
  saveState();
  renderInningTotals();
  renderChartHud();
  return true;
}

function applyHudStatViewFromEvent(event) {
  const button = event.target.closest("[data-hud-stat-view]");
  if (!button || button.disabled) return false;
  const kind = button.dataset.hudStatKind;
  const view = button.dataset.hudStatView;
  if (!["batter", "pitcher"].includes(kind) || !["basic", "advanced"].includes(view)) return false;
  closeStatExplanation();
  closeHudContextPopover();
  state.hudStatViews = state.hudStatViews || { batter: "basic", pitcher: "basic" };
  state.hudStatViews[kind] = view;
  saveState();
  renderInningTotals();
  renderChartHud();
  return true;
}

function limitWords(text, limit = 250) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "No notes provided";
  return words.length > limit ? `${words.slice(0, limit).join(" ")}...` : words.join(" ");
}

function hudContextButtonsHtml(player, tonightSummary, events, recentGameText) {
  const playerId = escapeHtml(player?.id || "");
  const previousSummary = recentPaText(events, 2);
  return `
    <button type="button" class="hud-context-chip" data-hud-context="current" data-player-id="${playerId}" title="See current PA info">
      <b>See current PA info</b>
      <i>${escapeHtml(tonightSummary)}</i>
    </button>
    <button type="button" class="hud-context-chip" data-hud-context="previous" data-player-id="${playerId}" title="See previous at-bat info">
      <b>See previous at-bat info</b>
      <i>${escapeHtml(previousSummary)}</i>
    </button>
    <button type="button" class="hud-context-chip" data-hud-context="recent" data-player-id="${playerId}" title="See recent game info">
      <b>See recent game info</b>
      <i>${escapeHtml(recentGameText)}</i>
    </button>
  `;
}

function batterDetailHtml() {
  const slot = getCurrentSlot();
  const player = playerAtSlot(slot);
  const displayName = batterDisplayLabelAtSlot(slot);
  if (!player) {
    return `
      <div class="batter-detail-card empty">
        <div class="totals-label">Active Batter</div>
        <strong>${escapeHtml(displayName)}</strong>
        <p class="meta">Assign a roster player in the lineup or Sub/PH dropdown to unlock HUD stats.</p>
      </div>
    `;
  }
  const stats = hudStatsFor(player, "batter");
  const rates = calcStats(stats);
  const advanced = advancedStats(stats);
  const batterPillRows = batterHudPills(stats, rates, advanced);
  const batterScope = selectedHudStatScope("batter", player);
  const batterView = selectedHudStatView("batter");
  let visibleBatterRows = batterView === "advanced" ? batterPillRows[1] : batterPillRows[0];
  if (batterView === "advanced" && batterScope === "currentgame") {
    visibleBatterRows = [...visibleBatterRows, ...batterLeverageRows(player.id, "currentgame")];
  } else if (batterView === "advanced" && batterScope === "series") {
    visibleBatterRows = [...visibleBatterRows, ...batterLeverageRows(player.id, "series")];
  }
  const visibleBatterRowsHtml = visibleBatterRows
    .map((row, index) => renderPillRow(row, `batter-season-row batter-${batterView}-row batter-row-${index + 1}`))
    .join("");
  const positionText = displayPosition(activeChart().lineupPositions?.[slot - 1] || player.position) || "POS --";
  const physicalText = [player.weight ? `Wt ${player.weight}` : "", player.height ? `Ht ${player.height}` : ""].filter(Boolean).join(" | ");
  const playerMeta = [positionText, player.classYear, physicalText].filter(Boolean).join(" | ");
  const singles = Math.max(0, stats.H - stats["2B"] - stats["3B"] - stats.HR);
  const iso = (toNumber(rates.SLG) - toNumber(rates.AVG)).toFixed(3).replace(/^0/, "");
  const paDenom = stats.AB + stats.BB + stats.HBP + stats.SF;
  const bbPct = paDenom ? `${((stats.BB / paDenom) * 100).toFixed(1)}%` : "—";
  const kPct = paDenom ? `${((stats.SO / paDenom) * 100).toFixed(1)}%` : "—";
  const babipDenom = stats.AB - stats.SO - stats.HR + stats.SF;
  const babip = babipDenom > 0 ? formatRate((stats.H - stats.HR) / babipDenom) : ".000";
  const xbh = stats["2B"] + stats["3B"] + stats.HR;
  const sbAttempts = stats.SB + stats.CS;

  const { line, events } = tonightLineForPlayer(player.id);
  const recentEvents = events.slice(0, 4);
  const recentGames = recentGamesForPlayer(player.id).slice(0, 3);
  const recentGameText = recentGames.length
    ? recentGames.map((item) => `${item.label} ${item.line.H}/${item.line.AB}${item.line.HR ? ` ${item.line.HR}HR` : ""}${item.line.RBI ? ` ${item.line.RBI}RBI` : ""}`).join(" | ")
    : "No recent games";

  const tonightSummary = line.PA > 0
    ? `${line.H}/${line.AB}, ${line.RBI} RBI, ${line.BB} BB, ${line.SO} K`
    : `0 PA tonight`;
  const contextButtons = hudContextButtonsHtml(player, tonightSummary, events, recentGameText);

  return `
    <div class="batter-detail-card" style="${teamColorStyle(player.side || state.activeSide)}">
      <div class="compact-player-identity">
        <div class="compact-player-name-block">
          <strong>${escapeHtml(displayName)}</strong>
          ${player.pronunciation ? `<span class="compact-pronunciation">${escapeHtml(player.pronunciation)}</span>` : `<span class="compact-pronunciation is-empty">&nbsp;</span>`}
          <span>${escapeHtml(playerMeta)}</span>
          <span>${escapeHtml(player.hometown || "No hometown provided")}</span>
        </div>
        ${hudControlsHtml("batter", player, player.side || state.activeSide)}
      </div>
      <div class="compact-batter-line">
        ${visibleBatterRowsHtml}
      </div>
      <div class="compact-storyline-line">
        ${contextButtons}
      </div>
      <div class="compact-notes-box">${escapeHtml(limitWords(player.notes, 250))}</div>
      <div class="batter-detail-head">
        <div class="batter-detail-title">
          <span class="batter-detail-slot">SLOT ${slot}</span>
          <strong>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}</strong>
          <span class="batter-detail-meta">${escapeHtml([player.position, player.classYear].filter(Boolean).join(" / ") || "—")}</span>
        </div>
        ${player.pronunciation ? `<div class="batter-pronunciation">${escapeHtml(player.pronunciation)}</div>` : ""}
        ${hudControlsHtml("batter", player, player.side || state.activeSide)}
      </div>
      <div class="batter-slash">
        <span><b>${rates.AVG}</b><i>AVG</i></span>
        <span><b>${rates.OBP}</b><i>OBP</i></span>
        <span><b>${rates.SLG}</b><i>SLG</i></span>
        <span><b>${rates.OPS}</b><i>OPS</i></span>
      </div>
      <div class="batter-advanced">
        <span><b>${iso}</b><i>ISO</i></span>
        <span><b>${bbPct}</b><i>BB%</i></span>
        <span><b>${kPct}</b><i>K%</i></span>
        <span><b>${babip}</b><i>BABIP</i></span>
        <span><b>${stats.GP || 0}/${stats.GS || 0}</b><i>GP/GS</i></span>
        <span><b>${stats.HR}</b><i>HR</i></span>
        <span><b>${xbh}</b><i>XBH</i></span>
        <span><b>${stats.RBI}</b><i>RBI</i></span>
        <span><b>${stats.SB}/${stats.SB + stats.CS}</b><i>SB</i></span>
      </div>
      <div class="batter-tonight">
        <div class="batter-tonight-head">
          <span class="totals-label small">Tonight</span>
          <span class="batter-tonight-summary">${escapeHtml(tonightSummary)}</span>
        </div>
        ${recentEvents.length ? `
          <ul class="batter-tonight-list">
            ${recentEvents.map((event) => `<li><b>${escapeHtml(resultLabel(event.result))}</b>${event.rbi ? ` &middot; ${event.rbi} RBI` : ""}${event.context ? ` &middot; <span class="batter-tonight-context">${escapeHtml(event.context)}</span>` : ""}</li>`).join("")}
          </ul>
        ` : ""}
      </div>
      ${recentBoxScoresHtml(player.id)}
      ${player.notes ? `<div class="batter-notes"><span class="totals-label small">Notes</span><p>${escapeHtml(player.notes)}</p></div>` : ""}
    </div>
  `;
}

function recentBoxScoresHtml(playerId) {
  const games = recentGamesForPlayer(playerId).slice(0, 5);
  if (!games.length) return "";
  return `
    <div class="batter-recent-games">
      <span class="totals-label small">Recent Games</span>
      <ul class="batter-recent-list">
        ${games.map(({ label, opponent, line, source }) => {
          const opponentText = opponent ? `vs ${escapeHtml(opponent)}` : "vs ?";
          const slash = `${line.H}/${line.AB}`;
          const extras = [];
          if (line.HR) extras.push(`${line.HR} HR`);
          if (line.RBI) extras.push(`${line.RBI} RBI`);
          if (line.BB) extras.push(`${line.BB} BB`);
          if (line.SO) extras.push(`${line.SO} K`);
          if (line.SB) extras.push(`${line.SB} SB`);
          return `<li><b>${escapeHtml(label)}</b> <span>${opponentText}</span> <em>${slash}</em>${source === "chart" ? ` &middot; charted` : ""}${extras.length ? ` &middot; ${escapeHtml(extras.join(", "))}` : ""}</li>`;
        }).join("")}
      </ul>
    </div>
  `;
}

function formatBoxDate(iso) {
  const parts = String(iso).split("-");
  if (parts.length === 3) return `${Number(parts[1])}/${Number(parts[2])}`;
  return iso;
}

function renderInningTotals() {
  const inning = Number(activeChart().currentInning || 1);
  const chart = activeChart();
  const activeCellLocation = getActiveCellLocation();
  const activeCell = chart.scorecard[activeCellLocation.key] || {};
  const activeCount = activeCell.count || "0-0";
  const runners = ["first", "second", "third"].map((base) => {
    const runnerId = chart.baseState[base];
    const slot = slotForRunnerId(runnerId);
    const player = playerById(runnerId);
    return { base, player, runnerId, slot };
  });
  const pitcher = state.players.find((player) => player.id === chart.activePitcherId);
  const liveLine = getPitchingLine(chart);
  const pitcherStats = pitcher ? hudStatsFor(pitcher, "pitcher") : null;
  const pitcherScope = pitcher ? selectedHudStatScope("pitcher", pitcher) : "overall";
  const pitcherView = selectedHudStatView("pitcher");
  const pitcherRows = pitcher ? pitcherHudRows({ scope: pitcherScope, view: pitcherView, liveLine, pitcherStats, pitcherId: pitcher.id }) : [];
  const pitcherRowsHtml = pitcherRows.map((row, index) => renderPillRow(row, `pitcher-${pitcherView}-row pitcher-row-${index + 1}`)).join("");
  const outs = currentInningOuts(inning);
  const pitcherBio = pitcher
    ? [pitcher.classYear, pitcher.weight ? `Wt ${pitcher.weight}` : "", pitcher.height ? `Ht ${pitcher.height}` : "", pitcher.hometown].filter(Boolean).join(" | ")
    : "";
  const pitcherCard = pitcher
    ? `
      <div class="compact-pitcher-card ${pitcherScope === "currentgame" ? "current-game-pitcher-card" : "season-pitcher-card"}" style="${teamColorStyle(pitcher.side || oppositeSide())}">
        <div class="compact-pitcher-title">
          <strong>P #${escapeHtml(pitcher.number)} ${escapeHtml(fullName(pitcher))}</strong>
          ${pitcherBio ? `<span class="pitcher-meta">${escapeHtml(pitcherBio)}</span>` : ""}
        </div>
        ${hudControlsHtml("pitcher", pitcher, pitcher.side || oppositeSide())}
        <div class="compact-pitcher-stats">${pitcherRowsHtml}</div>
      </div>
    `
    : `<div class="compact-pitcher-card empty">P --</div>`;
  const compactBases = runners.map(({ base, player }) => {
    const label = base === "first" ? "1B" : base === "second" ? "2B" : "3B";
    return `${label} ${baseOccupantLabel(base)}`;
  }).join(" | ");
  els.inningTotals.innerHTML = `
    ${batterDetailHtml()}
    <div class="base-state-card">
      <div class="totals-label">Bases</div>
      <div class="compact-run-state">
        <div class="compact-bases-line">${escapeHtml(compactBases)}</div>
        <div class="compact-count-line">Count ${escapeHtml(activeCount)} | Outs ${Math.min(3, outs)}/3 | ${liveLine.pitches} P | ${liveLine.BK} Bk</div>
      </div>
      <div class="mini-diamond">
        <svg class="mini-diamond-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <polygon class="diamond-frame-shape" points="50,92 92,50 50,8 8,50" />
          ${chart.baseState.first ? `<line class="mini-path" x1="50" y1="92" x2="92" y2="50" />` : ""}
          ${chart.baseState.second ? `<line class="mini-path" x1="92" y1="50" x2="50" y2="8" />` : ""}
          ${chart.baseState.third ? `<line class="mini-path" x1="50" y1="8" x2="8" y2="50" />` : ""}
        </svg>
        ${runners.map(({ base, player, slot, runnerId }) => {
          const baseClass = base === "first" ? "mini-base-first" : base === "second" ? "mini-base-second" : "mini-base-third";
          return `<button type="button" class="mini-base ${baseClass} ${runnerId ? "occupied" : ""}" data-clear-base="${base}" title="${runnerId ? `Clear ${base}` : `${base} empty`}">
            <span class="mini-base-mark"></span>
            <span class="mini-base-label">${player || slot ? escapeHtml(slot ? runnerDisplayLabelAtSlot(slot, { short: true }) : formatPlayerLabel(player, { short: true })) : escapeHtml(base[0].toUpperCase() + base.slice(1))}</span>
          </button>`;
        }).join("")}
      </div>
      ${pitcherCard}
    </div>
  `;
  els.inningTotals.style.setProperty("--innings", Number(activeGame().inningCount || 9) + 1);
}

function sideLabel(side) {
  return side === "home" ? (activeGame().game.teamName || "Home Team") : (activeGame().game.opponentName || "Away Team");
}

const lineScoreSideOrder = ["away", "home"];

function lineScoreHtml({ inning = Number(activeChart().currentInning || 1), highlightedSide = state.activeSide } = {}) {
  const innings = Number(activeGame().inningCount || 9);
  const totalKeys = ["R", "H", "E", "LOB", "RISP"];
  const expandedTeam = ["home", "away"].includes(state.settings?.lineScoreExpandedTeam)
    ? state.settings.lineScoreExpandedTeam
    : "";
  const sideLineTotals = (chart) => Array.from({ length: innings }, (_, index) => getChartInningTotals(chart, index + 1))
    .reduce((acc, item) => {
      totalKeys.forEach((key) => {
        acc[key] = toNumber(acc[key]) + toNumber(item[key]);
      });
      return acc;
    }, blankInningTotals());
  const detailRows = (chart, side) => side === expandedTeam ? totalKeys.map((key) => `
    <tr class="line-score-detail-row ${side === highlightedSide ? "active-side" : ""}">
      <th>${escapeHtml(key)}</th>
      ${Array.from({ length: innings }, (_, index) => {
        const item = getChartInningTotals(chart, index + 1);
        return `<td class="${index + 1 === inning ? "active" : ""}">${item[key] || 0}</td>`;
      }).join("")}
      <td class="metric-total detail-empty" colspan="${totalKeys.length}"></td>
    </tr>
  `).join("") : "";

  return `
    <div class="traditional-line-score ${expandedTeam ? "is-expanded" : ""}">
      <table>
        <thead>
          <tr>
            <th>Team</th>
            ${Array.from({ length: innings }, (_, index) => `<th class="${index + 1 === inning ? "active" : ""}">${index + 1}</th>`).join("")}
            ${totalKeys.map((key) => `<th class="metric-total">${key}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${lineScoreSideOrder.map((side) => {
            const chart = activeGame().charts[side];
            const lineTotals = sideLineTotals(chart);
            return `
              <tr class="${side === highlightedSide ? "active-side" : ""}">
                <th><button type="button" class="line-score-team-toggle ${expandedTeam === side ? "is-expanded" : ""}" style="${teamColorStyle(side)}" data-line-score-toggle="${side}" title="Show inning detail">${escapeHtml(sideLabel(side))}</button></th>
                ${Array.from({ length: innings }, (_, index) => {
                  const item = getChartInningTotals(chart, index + 1);
                  return `<td class="${index + 1 === inning ? "active" : ""}">${item.R || 0}</td>`;
                }).join("")}
                ${totalKeys.map((key) => `<td class="metric-total">${lineTotals[key] || 0}</td>`).join("")}
              </tr>
              ${detailRows(chart, side)}
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDiamondLineScore() {
  if (!els.diamondLineScore) return;
  const inning = Number(activeChart().currentInning || 1);
  const totals = getInningTotals(inning);

  els.diamondLineScore.innerHTML = `
    ${lineScoreHtml({ inning, highlightedSide: state.activeSide })}
    <details class="diamond-inning-editor">
      <summary>Edit Inning ${inning}</summary>
      <div class="diamond-edit-fields">
        ${["H", "R", "E", "LOB", "RISP"].map((key) => `
          <label>${key}<select data-inning-total="${key}">
            ${Array.from({ length: 21 }, (_, value) => `<option value="${value}" ${value === toNumber(totals[key]) ? "selected" : ""}>${value}</option>`).join("")}
          </select></label>
        `).join("")}
      </div>
    </details>
  `;
}

function toggleLineScoreExpanded(side) {
  state.settings = state.settings || {};
  state.settings.lineScoreExpandedTeam = state.settings.lineScoreExpandedTeam === side ? "" : side;
  saveState();
  renderDiamondLineScore();
  renderFullScorecard();
}

function upNextEntryHtml(slot, label, modifier) {
  const player = playerAtSlot(slot);
  const rates = player ? calcStats(player.stats) : null;
  const position = player ? displayPosition(activeChart().lineupPositions?.[slot - 1] || player.position) : "";
  const nameLine = `${escapeHtml(batterDisplayLabelAtSlot(slot))}${position ? ` (${escapeHtml(position)})` : ""}`;
  const ratesLine = player
    ? `<span>AVG ${rates.AVG}</span><span>OBP ${rates.OBP}</span><span>OPS ${rates.OPS}</span><span>SLG ${rates.SLG}</span>`
    : "";
  return `
    <div class="up-next-entry up-next-${modifier}">
      <div class="up-next-name">${nameLine}</div>
      ${ratesLine ? `<div class="up-next-rates">${ratesLine}</div>` : ""}
      <div class="up-next-tag">${escapeHtml(label)}</div>
    </div>
  `;
}

function renderUpNextStrip() {
  if (!els.upNextStrip) return;
  const currentSlot = getCurrentSlot();
  const onDeckSlot = slotAfter(currentSlot, 1);
  const inHoleSlot = slotAfter(currentSlot, 2);
  const inning = Number(activeChart().currentInning || 1);

  els.upNextStrip.innerHTML = `
    <div class="up-next-meta">
      <span class="up-next-inning">Inning ${inning}</span>
      <span class="up-next-side">${escapeHtml(activeSideName())}</span>
    </div>
    <div class="up-next-row">
      ${upNextEntryHtml(currentSlot, "AT BAT", "now")}
      ${upNextEntryHtml(onDeckSlot, "ON DECK", "deck")}
      ${upNextEntryHtml(inHoleSlot, "IN HOLE", "hole")}
    </div>
    <div class="up-next-actions">
      ${state.settings.showAtBatControls ? `
        <button type="button" id="prevAtBatButton" class="muted" title="Step pointer back">&larr; Prev</button>
        <button type="button" id="nextAtBatButton" class="next-ab-button">Next AB &rarr;</button>
      ` : ""}
      ${state.settings.showFocusControls ? `
        <div class="segmented-toggle" role="group" aria-label="Visible batters">
          <button type="button" data-view-mode="focused" class="${activeChart().viewMode !== "all" ? "is-on" : ""}" title="Show only the active and adjacent batters">FOCUS 3</button>
          <button type="button" data-view-mode="all" class="${activeChart().viewMode === "all" ? "is-on" : ""}" title="Show every batter for editing">EDIT ALL</button>
        </div>
      ` : ""}
      <button id="pinChartButton" type="button" class="muted ${Boolean(state.pinStatHud) ? "active" : ""}">${Boolean(state.pinStatHud) ? "Unpinned HUD" : "Pinned HUD"}</button>
      <button id="toggleDefenseButton" type="button" class="muted">${state.showDefensePopup ? "Hide Defense" : "Show Defense"}</button>
      <button id="toggleFullChartButton" type="button" class="muted">${els.fullScorecardPanel?.hidden === false ? "Hide Full Chart" : "Show Full Chart"}</button>
    </div>
  `;
}

function renderScoreCellHtml(slotIndex, column, abIndex, opts = {}) {
  const chart = activeChart();
  const cell = getScoreCell(slotIndex, column, abIndex);
  const cellKey = scoreCellKey(slotIndex, column, abIndex);
  const cellResult = cell.result || cell.notation || "";
  const cellTerminal = activeDiamondTerminal(cell.bases);
  const isOnBase = cellTerminal && cellTerminal !== "toHome";
  const actualInning = column;
  const isDisplaced = false;
  const cellClasses = ["score-cell"];
  if (isOnBase) cellClasses.push("has-runner");
  if (cellTerminal === "toHome") cellClasses.push("has-scored");
  if (isDisplaced) cellClasses.push("is-displaced");
  if (opts.isActive) cellClasses.push("is-active-cell");
  if (opts.isCompact) cellClasses.push("is-compact");
  if (cell.outOverlay) cellClasses.push("is-out");
  if (cell.scoredOverlay) cellClasses.push("is-scored-status");

  const runnerControls = "";
  const stealControls = "";

  const actionButtonHtml = (key) => {
    const action = chartActions[key];
    return `
      <button type="button" data-chart-action="${key}" ${action.detail ? `title="${escapeHtml(`${action.label} (${action.detail})`)}"` : ""}>
        <span class="result-main">${escapeHtml(action.label)}</span>
      </button>
    `;
  };

  const displacedBadge = isDisplaced ? `<div class="displaced-tag">FROM INN ${actualInning}</div>` : "";
  const pitchTotal = (cell.pitchDeltas || []).filter((pitch) => pitch.type !== "balk").length;
  const balkTotal = (cell.pitchDeltas || []).filter((pitch) => pitch.type === "balk").length;
  const rbiButtons = [1, 2, 3, 4].map((value) => `
    <button
      type="button"
      class="${toNumber(cell.rbi) === value ? "is-on" : ""}"
      data-rbi="${value}"
      aria-pressed="${toNumber(cell.rbi) === value ? "true" : "false"}"
    >${value} RBI</button>
  `).join("");

  const entrySurface = opts.isCompact ? "" : `
    <div class="score-count-row">
      <div class="count-card">
        <span>${escapeHtml(cell.count || "0-0")} | ${pitchTotal} P | ${balkTotal} Bk</span>
      </div>
      <div class="rbi-buttons" role="group" aria-label="Runs batted in">${rbiButtons}</div>
    </div>
  `;

  const fullEntry = (opts.isActive || !opts.isCompact) ? `
    <div class="pitch-buttons">
      <div class="pitch-button-row pitch-button-row-3">
        <button type="button" data-pitch="ball">Ball</button>
        <button type="button" data-pitch="ball-wp">Ball WP</button>
        <button type="button" data-pitch="ball-pb">Ball PB</button>
      </div>
      <div class="pitch-button-row pitch-button-row-4">
        <button type="button" data-pitch="strike">Strike</button>
        <button type="button" data-pitch="strike-swinging">Swing</button>
        <button type="button" data-pitch="strike-looking">Look</button>
        <button type="button" data-pitch="foul">Foul</button>
      </div>
      <div class="pitch-button-row pitch-button-row-1">
        <button type="button" class="muted undo-pitch-button" data-undo-pitch="${cellKey}" ${pitchTotal || balkTotal ? "" : "disabled"}>Undo Pitch</button>
      </div>
    </div>
    <div class="result-buttons">
      <div class="result-button-row result-button-row-4">
        ${["HBP", "KWP", "KPB", "CI"].map(actionButtonHtml).join("")}
      </div>
      <div class="result-button-row result-button-row-3">
        ${["BI", "BALK", "OUT"].map(actionButtonHtml).join("")}
      </div>
    </div>
    <details class="pitcher-adjuster">
      <summary>Pitcher line</summary>
      <div class="pitcher-adjust-grid">
        ${pitcherAdjustmentFields.map(({ key, label }) => `
          <label>
            <span>${label}</span>
            <input type="number" min="0" max="9" step="1" value="${toNumber(cell.pitcherUpdates?.[key])}" data-pitcher-update="${cellKey}" data-pitcher-update-key="${key}" />
          </label>
        `).join("")}
      </div>
    </details>
    <div class="control-spacer" aria-hidden="true"></div>
    <button type="button" data-clear-cell="${cellKey}" class="danger clear-action-button" title="Clear cell">Clear AB Data</button>
    ${abIndex > 0 ? `<div class="score-result-row"><button type="button" data-remove-ab="${cellKey}" class="muted remove-ab-button" title="Remove extra at-bat">Remove AB</button></div>` : ""}
  ` : "";

  const notationValue = cell.notation || cell.result || "";
  const knownNotation = notationValue && (notationActionKey(notationValue) || notationSuggestions.some((token) => normalizedNotation(token) === normalizedNotation(notationValue)));
  const noteInputClasses = ["diamond-result-input"];
  if (notationValue && !knownNotation) noteInputClasses.push("is-unknown");
  const abCount = abCountForSlotInning(slotIndex, column);
  const baseCellKey = scoreCellKey(slotIndex, column);
  const abSelector = abCount > 1 ? `
    <select data-select-ab="${baseCellKey}" aria-label="Select at-bat">
      ${Array.from({ length: abCount }, (_, index) => `<option value="${index}" ${index === abIndex ? "selected" : ""}>AB ${index + 1}</option>`).join("")}
    </select>
  ` : "";
  const runnerLaneLabels = { toFirst: "1B play", toSecond: "2B play", toThird: "3B play", toHome: "HP play" };
  const runnerLaneSelects = `
    <div class="runner-lane-selects" aria-label="Runner lane plays">
      ${diamondBaseOrder.map((terminal) => `
        <select class="runner-event-select runner-lane-select runner-lane-${terminal}" data-runner-event="${cellKey}" data-runner-lane="${terminal}" aria-label="${runnerLaneLabels[terminal]}">
          ${runnerEventOptionsHtml(runnerLaneLabels[terminal])}
        </select>
      `).join("")}
    </div>
  `;

  return `
    <div class="${cellClasses.join(" ")}" data-score-cell="${cellKey}">
      ${displacedBadge}
      <div class="score-ab-controls">
        <div class="ab-control-row">
          <button type="button" class="muted add-ab-button" data-add-ab-for="${baseCellKey}" title="Add extra at-bat for this inning">+ AB</button>
          ${abSelector}
        </div>
      </div>
      ${entrySurface}
      <div class="score-cell-body">
        <div class="diamond" aria-label="Runner diamond">
          ${diamondSvg(cell.bases)}
          ${stealControls}
          ${runnerLaneSelects}
          <div class="diamond-result">
            <input
              class="${noteInputClasses.join(" ")}"
              data-score-field="notation"
              data-notation-cell="${cellKey}"
              type="text"
              inputmode="text"
              autocomplete="off"
              value="${escapeHtml(notationValue)}"
              placeholder="-"
              aria-label="Play notation"
            />
          </div>
          ${cell.runnerNote ? `<div class="diamond-context-note">${escapeHtml(cell.runnerNote)}</div>` : ""}
          ${["toFirst", "toSecond", "toThird", "toHome"].map((base) => `
            <button type="button" class="base-toggle ${base} ${cell.bases?.[base] ? "active" : ""}" data-base="${base}" aria-label="${base.replace("to", "")}"><span class="base-marker"></span></button>
          `).join("")}
        </div>
        <div class="score-action-panel">
          ${fullEntry}
        </div>
      </div>
      ${runnerControls}
      ${cell.outOverlay ? `<div class="out-overlay">OUT</div>` : ""}
      ${!cell.outOverlay && cell.scoredOverlay ? `<div class="scored-overlay">SCORED</div>` : ""}
    </div>
  `;
}

function rowRunnerTerminalForSlot(slotIndex) {
  const chart = activeChart();
  const runnerId = runnerIdAtSlot(slotIndex + 1);
  if (!runnerId) return "";
  if (chart.baseState.first === runnerId) return "toFirst";
  if (chart.baseState.second === runnerId) return "toSecond";
  if (chart.baseState.third === runnerId) return "toThird";
  return "";
}

function renderScorecard() {
  const chart = activeChart();
  const visibleCols = visibleColumnsForView();
  const slotCount = Math.max(9, chart.lineup.length);
  const currentSlot = getCurrentSlot();
  const onDeckSlot = slotAfter(currentSlot, 1);
  const inHoleSlot = slotAfter(currentSlot, 2);
  const focusMode = Boolean(state.settings.showFocusControls) && chart.viewMode !== "all";

  els.scorecardGrid.style.setProperty("--columns", visibleCols.length);

  const header = [`<div class="score-head score-team-head">${escapeHtml(activeSideName())}</div>`]
    .concat(visibleCols.map((col) => {
      const isCurrent = col === Number(chart.currentInning || 1);
      return `<div class="score-head ${isCurrent ? "is-current-col" : ""}">Inning ${col}</div>`;
    })).join("");

  const rows = Array.from({ length: slotCount }, (_, slotIndex) => {
    const slotNumber = slotIndex + 1;
    const player = playerAtSlot(slotNumber);
    const sub = getSlotSubstitution(slotIndex, chart);
    const batterSubPlayer = playerById(sub.batterPlayerId);
    const runnerSubPlayer = playerById(sub.runnerPlayerId);
    const batterSubOptions = [`<option value="">Sub / PH</option>`]
      .concat(sortedPlayers().map((item) => `<option value="${item.id}" ${item.id === sub.batterPlayerId ? "selected" : ""}>#${escapeHtml(item.number)} ${escapeHtml(fullName(item))}</option>`))
      .join("");
    const runnerSubOptions = [`<option value="">PR / CR</option>`]
      .concat(sortedPlayers().map((item) => `<option value="${item.id}" ${item.id === sub.runnerPlayerId ? "selected" : ""}>#${escapeHtml(item.number)} ${escapeHtml(fullName(item))}</option>`))
      .join("");
    const playerLabel = batterDisplayLabelAtSlot(slotNumber);
    const batterNote = chart.batterNotes?.[slotIndex] || "";
    const playerMeta = player
      ? [
        player.pronunciation,
        displayPosition(chart.lineupPositions?.[slotIndex] || player.position),
        player.classYear,
        player.weight ? `${player.weight}` : "",
        player.height
      ].filter(Boolean).join(" | ")
      : "Select player in Lineup Board";

    const isActive = slotNumber === currentSlot;
    const isOnDeck = !isActive && slotNumber === onDeckSlot;
    const isInHole = !isActive && !isOnDeck && slotNumber === inHoleSlot;
    const rowRunnerTerminal = rowRunnerTerminalForSlot(slotIndex);
    const hasRunner = Boolean(rowRunnerTerminal);

    const isHidden = focusMode && !isActive && !isOnDeck && !isInHole && !hasRunner;
    if (isHidden) return "";

    const rowClasses = ["score-row"];
    if (isActive) rowClasses.push("is-active");
    if (isOnDeck) rowClasses.push("is-on-deck");
    if (isInHole) rowClasses.push("is-in-hole");
    if (hasRunner) rowClasses.push("has-runner-on-base");

    const statusPill = isActive
      ? `<span class="slot-pill pill-active">AT BAT</span>`
      : isOnDeck
        ? `<span class="slot-pill pill-on-deck">ON DECK</span>`
        : isInHole
          ? `<span class="slot-pill pill-in-hole">IN HOLE</span>`
          : "";
    const runnerPill = rowRunnerTerminal ? `<span class="slot-pill pill-runner">ON ${baseLabelShort(rowRunnerTerminal)}</span>` : "";

    const activeLoc = isActive ? getActiveCellLocation() : null;

    const cellRowsByColumn = visibleCols.map((col) => {
      const abCount = abCountForSlotInning(slotIndex, col);
      const selectedAb = selectedAbForSlotInning(slotIndex, col, chart);
      const isThisActiveCell = isActive && activeLoc && activeLoc.column === col && activeLoc.abIndex === selectedAb;
      const isCompactCell = focusMode && !isActive && !hasRunner;
      const cell = renderScoreCellHtml(slotIndex, col, selectedAb, {
        isActive: isThisActiveCell,
        isCompact: isCompactCell
      });
      return `<div class="ab-cell-row" data-column="${col}" style="--ab-count:${abCount}">${cell}</div>`;
    }).join("");

    return `
      <div class="${rowClasses.join(" ")}" data-slot="${slotNumber}">
        <div class="score-player">
          <div class="player-pill-row">${statusPill}${runnerPill}</div>
          <div class="score-player-head">
            <button type="button" class="batting-order-badge" data-focus-slot="${slotNumber}" title="Make at-bat">${slotNumber}</button>
            <div class="score-player-headline">
              <strong>${escapeHtml(playerLabel)}</strong>
              <span class="score-player-meta">${escapeHtml(playerMeta)}</span>
            </div>
          </div>
          <div class="sub-grid">
            <label class="sub-block">
              <span>Sub / Pinch Hitter</span>
              <select data-sub-batter-player="${slotIndex}">${batterSubOptions}</select>
              <input data-sub-batter-text="${slotIndex}" value="${escapeHtml(sub.batterText || "")}" placeholder="write-in sub / PH" />
            </label>
            <label class="sub-block">
              <span>Pinch Runner / Courtesy</span>
              <select data-sub-runner-player="${slotIndex}">${runnerSubOptions}</select>
              <input data-sub-runner-text="${slotIndex}" value="${escapeHtml(sub.runnerText || "")}" placeholder="write-in PR / CR" />
            </label>
          </div>
          ${(batterSubPlayer || cleanSubText(sub.batterText) || runnerSubPlayer || cleanSubText(sub.runnerText)) ? `
            <div class="sub-card-stack">
              ${(batterSubPlayer || cleanSubText(sub.batterText)) ? `
                <div class="sub-card">
                  <strong>SUB / PH</strong>
                  <span>${escapeHtml(cleanSubText(sub.batterText) || formatPlayerLabel(batterSubPlayer))}</span>
                </div>
              ` : ""}
              ${(runnerSubPlayer || cleanSubText(sub.runnerText)) ? `
                <div class="sub-card">
                  <strong>PR / CR</strong>
                  <span>${escapeHtml(cleanSubText(sub.runnerText) || formatPlayerLabel(runnerSubPlayer))}</span>
                </div>
              ` : ""}
            </div>
          ` : ""}
          <label class="batter-note-box">
            <span>At-bat notes</span>
            <textarea data-batter-note="${slotIndex}" rows="2" placeholder="Situational notes, approach, broadcast reminder...">${escapeHtml(batterNote)}</textarea>
          </label>
        </div>
        ${cellRowsByColumn}
      </div>
    `;
  }).join("");

  els.scorecardGrid.innerHTML = header + rows;
  renderFullScorecard();
  renderInningCompletion();
}

function blankScoreCell() {
  return {
    count: "",
    result: "",
    notation: "",
    rbi: "",
    bases: emptyDiamondPath()
  };
}

function readChartScoreCell(chart, slotIndex, inning, abIndex = 0) {
  return chart.scorecard[scoreCellKey(slotIndex, inning, abIndex)] || blankScoreCell();
}

function scoreSummaryHtml(cell) {
  const pitchTotal = (cell.pitchDeltas || []).filter((pitch) => pitch.type !== "balk").length;
  const balkTotal = (cell.pitchDeltas || []).filter((pitch) => pitch.type === "balk").length;
  const pitchText = pitchTotal || balkTotal ? `${pitchTotal} P${balkTotal ? ` | ${balkTotal} Bk` : ""}` : "";
  const playText = cell.notation || cell.result || "";
  const summaryText = [playText, cell.runnerNote, cell.count ? `(${cell.count})` : "", pitchText, cell.rbi ? `${cell.rbi} RBI` : ""].filter(Boolean).join(" ");
  const center = playText || "-";
  return `
    <div class="score-cell score-cell-summary ${cell.outOverlay ? "is-out" : ""} ${cell.scoredOverlay ? "is-scored-status" : ""}">
      <div class="summary-diamond-shell">
        ${diamondSvg(cell.bases || emptyDiamondPath())}
        <strong>${escapeHtml(center)}</strong>
      </div>
      <div class="summary-result">${escapeHtml(summaryText || "-")}</div>
    </div>
  `;
}

function fullChartSummaryStackHtml(chart, slotIndex, inning) {
  const abCount = 1 + toNumber(chart.extraAbs[scoreCellKey(slotIndex, inning)] || 0);
  const selectedAb = Math.min(abCount - 1, Math.max(0, toNumber(chart.selectedAbs?.[scoreCellKey(slotIndex, inning)])));
  const selector = abCount > 1 ? `
    <select data-full-chart-ab="${scoreCellKey(slotIndex, inning)}" aria-label="Select full chart at-bat">
      ${Array.from({ length: abCount }, (_, index) => `<option value="${index}" ${index === selectedAb ? "selected" : ""}>AB ${index + 1}</option>`).join("")}
    </select>
  ` : "";
  return `
    <div class="summary-stack">
      ${selector}
      ${scoreSummaryHtml(readChartScoreCell(chart, slotIndex, inning, selectedAb))}
    </div>
  `;
}

function renderFullScorecard() {
  if (!els.fullScorecardGrid) return;
  const side = state.fullChartSide || state.activeSide;
  const chart = activeGame().charts[side] || activeChart();
  const innings = Number(activeGame().inningCount || 9);
  const lastLineupIndex = chart.lineup.reduce((last, playerId, index) => playerId ? index : last, -1);
  const slotCount = Math.max(9, lastLineupIndex + 1);
  els.fullScorecardGrid.style.setProperty("--innings", innings);
  if (els.fullChartToolbar) {
    els.fullChartToolbar.innerHTML = `
      <div class="segmented-toggle" role="group" aria-label="Full chart team">
        ${lineScoreSideOrder.map((item) => `
          <button type="button" data-full-chart-side="${item}" class="${item === side ? "is-on" : ""}">${escapeHtml(sideLabel(item))}</button>
        `).join("")}
      </div>
    `;
  }
  if (els.fullChartLineScore) {
    els.fullChartLineScore.innerHTML = lineScoreHtml({ highlightedSide: side });
  }
  const header = [`<div class="score-head score-team-head">${escapeHtml(teamAbbreviation(side))}</div>`]
    .concat(Array.from({ length: innings }, (_, index) => `<div class="score-head">${index + 1}</div>`))
    .join("");
  const rows = Array.from({ length: slotCount }, (_, slotIndex) => {
    const player = state.players.find((item) => item.id === chart.lineup[slotIndex]);
    const playerLabel = player ? `#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}` : `Lineup ${slotIndex + 1}`;
    const cells = Array.from({ length: innings }, (_, inningIndex) => fullChartSummaryStackHtml(chart, slotIndex, inningIndex + 1)).join("");
    return `<div class="score-player summary-player"><strong>${playerLabel}</strong></div>${cells}`;
  }).join("");
  els.fullScorecardGrid.innerHTML = header + rows;
}

function renderInningCompletion() {
  if (!els.inningCompleteOverlay || !els.inningEditBanner) return;
  const chart = activeChart();
  const inning = Number(chart.currentInning || 1);
  const outs = currentInningOuts(inning);
  const canMoveNext = inning < Number(activeGame().inningCount || 9);

  if (outs < 3) {
    els.inningCompleteOverlay.hidden = true;
    els.inningEditBanner.hidden = true;
    delete chart.completedInnings[inning];
    delete chart.editingCompletedInnings[inning];
    return;
  }
  syncInningBaseTotals(chart, inning);

  if (chart.editingCompletedInnings[inning]) {
    els.inningCompleteOverlay.hidden = true;
    els.inningEditBanner.hidden = false;
    els.inningEditBanner.innerHTML = `
      <strong>Editing completed inning ${inning}</strong>
      <span>Make corrections on the diamonds, then lock it back in.</span>
      <button type="button" data-confirm-inning="${inning}">Confirm edits</button>
      ${canMoveNext ? `<button type="button" data-move-next-inning="${inning}">Move to next inning</button>` : ""}
    `;
    return;
  }

  if (chart.completedInnings[inning]) {
    els.inningEditBanner.hidden = true;
    els.inningCompleteOverlay.hidden = false;
    els.inningCompleteOverlay.innerHTML = `
      <div class="inning-complete-card">
        <strong>Inning ${inning} locked.</strong>
        <span>${Math.min(3, outs)} outs logged. Edit only when you need to correct this inning.</span>
        <div class="inning-complete-actions">
          ${canMoveNext ? `<button type="button" data-move-next-inning="${inning}">Move to next inning</button>` : ""}
          <button type="button" class="muted" data-edit-completed-inning="${inning}">Edit inning</button>
        </div>
      </div>
    `;
    return;
  }

  els.inningEditBanner.hidden = true;
  els.inningCompleteOverlay.hidden = false;
  els.inningCompleteOverlay.innerHTML = `
    <div class="inning-complete-card">
      <strong>Inning ${inning} completed.</strong>
      <span>Do you wish to edit before locking this inning?</span>
      <div class="inning-complete-actions">
        ${canMoveNext ? `<button type="button" data-move-next-inning="${inning}">Move to next inning</button>` : ""}
        <button type="button" class="muted" data-continue-inning-edit="${inning}">Continue editing</button>
      </div>
    </div>
  `;
}

function renderChartHud() {
  const snapshotSide = state.activeSide;
  const meta = teamMetaForSide(snapshotSide);

  els.chartHud.innerHTML = `
    <section class="hud-panel team-snapshot-hud" style="${teamColorStyle(snapshotSide)}">
      <div class="hud-title">
        <h2>Team Snapshot</h2>
      </div>
      ${teamSnapshotHeaderHtml(snapshotSide)}
      ${gameContextHtml()}
      <div class="team-snapshot-divider"></div>
      ${meta.showRecords ? teamRecordTableHtml(snapshotSide, true) : ""}
      ${meta.showCoaches ? teamCoachesHtml(snapshotSide) : ""}
    </section>
    ${meta.showSnapshot ? `
      <section class="hud-panel team-stats-hud" style="${teamColorStyle(snapshotSide)}">
        <div class="hud-title">
          <h2>Team Stats</h2>
        </div>
        <div class="team-snapshot-stat-groups">${teamSnapshotGroupsHtml(snapshotSide)}</div>
      </section>
    ` : ""}
  `;
}

const defensePositions = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"];
const defensivePositionSet = new Set(defensePositions);

function defensePlayerLabel(playerId) {
  const player = state.players.find((item) => item.id === playerId);
  return player ? `#${player.number} ${fullName(player)}` : "--";
}

function fieldPositionFromText(value) {
  const tokens = String(value || "")
    .toUpperCase()
    .split(/[\/,\s-]+/)
    .map((token) => positionLabels[token] || token)
    .filter(Boolean);
  return tokens.find((token) => defensivePositionSet.has(token)) || "";
}

function autoDefenseAssignments() {
  const fieldingChart = activeGame().charts[oppositeSide()] || newChartState();
  const assignments = {};
  (fieldingChart.lineup || []).forEach((playerId, index) => {
    if (!playerId) return;
    const player = state.players.find((item) => item.id === playerId);
    const pos = fieldPositionFromText(fieldingChart.lineupPositions?.[index] || player?.position || "");
    if (!pos || pos === "P" || assignments[pos]) return;
    assignments[pos] = playerId;
  });
  return assignments;
}

function defenseSelectionForPosition(pos, autoDefense = autoDefenseAssignments()) {
  if (pos === "P") return activeChart().activePitcherId;
  return activeChart().hud.defense[pos] || autoDefense[pos] || "";
}

function clearManualDefenseAssignments() {
  const chart = activeChart();
  chart.hud.defense = { ...newChartState().hud.defense };
}

function defenseOptionsHtml(selected) {
  const players = playersForSide(oppositeSide());
  return [`<option value="">--</option>`]
    .concat(players.map((player) => `<option value="${player.id}" ${player.id === selected ? "selected" : ""}>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}</option>`))
    .join("");
}

function defenseDiamondHtml({ editable = false } = {}) {
  const chart = activeChart();
  const activePitcher = chart.activePitcherId;
  const autoDefense = autoDefenseAssignments();
  return `
    <div class="defense-diamond ${editable ? "editable" : "display"}">
      ${defensePositions.map((pos) => {
        const selected = defenseSelectionForPosition(pos, autoDefense);
        const isAuto = pos !== "P" && !chart.hud.defense[pos] && autoDefense[pos];
        const label = pos === "P" ? defensePlayerLabel(activePitcher) : defensePlayerLabel(selected);
        return `
          <label class="def-pos pos-${pos.replace("1", "one").replace("2", "two").replace("3", "three")} ${isAuto ? "is-auto" : ""}">
            ${pos}
            ${editable && pos !== "P"
              ? `<select data-defense-pos="${pos}">${defenseOptionsHtml(selected)}</select>`
              : `<span>${escapeHtml(label)}</span>`}
          </label>
        `;
      }).join("")}
    </div>
  `;
}

function renderDefense() {
  if (!els.defenseEditor) return;
  els.defenseEditor.innerHTML = `
    <div class="defense-editor-head">
      <strong>${escapeHtml(sideLabel(oppositeSide()))} in the field</strong>
      <span>Lineup positions auto-fill the chart; dropdowns override spots when needed.</span>
      <button type="button" class="muted" data-reset-defense-auto>Use lineup positions</button>
    </div>
    ${defenseDiamondHtml({ editable: true })}
    <label>Defense notes<textarea data-chart-hud-field="defenseNotes" rows="4">${escapeHtml(activeChart().hud.defenseNotes)}</textarea></label>
  `;
}

function renderDefensePopup() {
  if (!els.defensePopupPanel) return;
  els.defensePopupPanel.hidden = !state.showDefensePopup;
  if (els.defensePopupPanel.hidden) return;
  els.defensePopupPanel.innerHTML = `
    <div class="section-title compact-title">
      <h2>Current Defense</h2>
      <button type="button" class="muted" data-close-defense-popup>Close</button>
    </div>
    <div class="defense-popup-body">
      <strong>${escapeHtml(sideLabel(oppositeSide()))}</strong>
      ${defenseDiamondHtml({ editable: false })}
      ${activeChart().hud.defenseNotes ? `<p>${escapeHtml(activeChart().hud.defenseNotes)}</p>` : ""}
    </div>
  `;
}

function renderLineup() {
  const players = sortedPlayers();
  const chart = activeChart();
  els.lineupSlots.innerHTML = Array.from({ length: Math.max(9, chart.lineup.length) }, (_, index) => {
    const selected = chart.lineup[index] || "";
    const options = [`<option value="">Select player</option>`]
      .concat(players.map((player) => `<option value="${player.id}" ${player.id === selected ? "selected" : ""}>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}</option>`))
      .join("");
    return `
      <div class="lineup-slot">
        <div class="slot-number">${index + 1}</div>
        <select data-lineup-index="${index}" aria-label="Lineup spot ${index + 1}">${options}</select>
        <input data-lineup-pos="${index}" type="text" placeholder="POS/#" value="${escapeHtml(chart.lineupPositions?.[index] || "")}" />
        <button type="button" class="move-lineup muted" data-move-lineup="${index}" data-direction="-1" title="Move up">^</button>
        <button type="button" class="move-lineup muted" data-move-lineup="${index}" data-direction="1" title="Move down">v</button>
      </div>
    `;
  }).join("");
}

function renderPlayerSelects() {
  const players = sortedPlayers();
  const options = players.map((player) => `<option value="${player.id}">#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}</option>`).join("");
  const currentSpotlight = els.spotlightSelect.value || players[0]?.id || "";
  els.spotlightSelect.innerHTML = options || `<option value="">No players</option>`;
  els.eventPlayer.innerHTML = options || `<option value="">No players</option>`;
  if (players.some((player) => player.id === currentSpotlight)) {
    els.spotlightSelect.value = currentSpotlight;
  }
}

function renderSpotlight() {
  const player = state.players.find((item) => item.id === els.spotlightSelect.value) || sortedPlayers()[0];
  if (!player) {
    els.spotlightCard.className = "spotlight-card empty";
    els.spotlightCard.textContent = "Import a CSV or add a player to begin.";
    return;
  }

  els.spotlightSelect.value = player.id;
  const rates = calcStats(player.stats);
  els.spotlightCard.className = "spotlight-card";
  els.spotlightCard.innerHTML = `
    <div>
      <h3>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}</h3>
      <p class="meta">${escapeHtml([player.position, player.classYear, player.pronunciation].filter(Boolean).join(" - ") || "Add position, class, and pronunciation in Roster.")}</p>
    </div>
    <div class="stat-pills">
      <div class="pill"><b>${rates.AVG}</b><span>AVG</span></div>
      <div class="pill"><b>${rates.OBP}</b><span>OBP</span></div>
      <div class="pill"><b>${rates.OPS}</b><span>OPS</span></div>
      <div class="pill"><b>${player.stats.RBI}</b><span>RBI</span></div>
    </div>
    <p class="micro-copy">${escapeHtml(microRundown(player))}</p>
    <p>${escapeHtml(player.notes || "No custom broadcast note yet.")}</p>
  `;
}

function renderPlayerTable() {
  if (!els.playerSearch || !els.playerTable) return;
  const query = els.playerSearch.value.trim().toLowerCase();
  const rows = sortedPlayers().filter((player) => {
    const haystack = `${player.number} ${fullName(player)} ${player.pronunciation} ${player.notes}`.toLowerCase();
    return haystack.includes(query);
  });

  els.playerTable.innerHTML = rows.length
    ? rows.map((player) => {
      const rates = calcStats(player.stats);
      return `
        <tr>
          <td>${escapeHtml(player.number)}</td>
          <td><button class="player-link" type="button" data-edit-player="${player.id}">${escapeHtml(fullName(player))}</button></td>
          <td>${escapeHtml(player.pronunciation || "")}</td>
          <td>${rates.AVG}</td>
          <td>${rates.OBP}</td>
          <td>${rates.OPS}</td>
          <td>${player.stats.AB}</td>
          <td>${player.stats.H}</td>
          <td>${player.stats.RBI}</td>
          <td>${player.stats.BB}</td>
          <td>${player.stats.SO}</td>
          <td>${escapeHtml(player.notes || "")}</td>
        </tr>
      `;
    }).join("")
    : `<tr><td colspan="12">No players match that search.</td></tr>`;
}

function renderRosterCards() {
  els.rosterCards.innerHTML = sortedPlayers().map((player) => {
    const rates = calcStats(player.stats);
    const pitchingLine = hasPitchingStats(player.stats)
      ? `<p class="meta roster-pitching-line">${escapeHtml(pitchingStatsLine(player.stats))}</p>`
      : "";
    return `
      <article class="roster-card">
        <div class="number-badge">${escapeHtml(player.number || "-")}</div>
        <div class="card-main">
          <h3>${escapeHtml(fullName(player))}</h3>
          <p>${escapeHtml([player.position, player.classYear, player.pronunciation].filter(Boolean).join(" - ") || "No profile details yet")}</p>
          <p class="meta">BAT ${rates.AVG}/${rates.OBP}/${rates.SLG} - ${player.stats.H} H, ${player.stats.RBI} RBI, ${player.stats.BB} BB, ${player.stats.SO} K</p>
          ${pitchingLine}
        </div>
        <div class="card-actions">
          <button type="button" data-edit-player="${player.id}">Edit</button>
          <button type="button" class="danger" data-delete-player="${player.id}">Delete</button>
        </div>
      </article>
    `;
  }).join("") || `<p class="meta">No players yet. Import a CSV or create one manually.</p>`;
}

function renderEvents() {
  const events = activeGameEvents();
  els.eventList.innerHTML = events.length
    ? events.map((event, index) => {
      const player = state.players.find((item) => item.id === event.playerId);
      return `
        <article class="event-card">
          <h3>${events.length - index}. ${escapeHtml(player ? fullName(player) : "Deleted player")} - ${escapeHtml(resultLabel(event.result))}</h3>
          <p>RBI ${event.rbi || 0}, SB ${event.sb || 0}, CS ${event.cs || 0}</p>
          <p>${escapeHtml(event.context || "")}</p>
          <button type="button" class="danger" data-delete-event="${event.id}">Remove</button>
        </article>
      `;
    }).join("")
    : `<p class="meta">Game events will appear here as you log plate appearances.</p>`;
}

const notationDocsData = [
  { token: "1B / 2B / 3B / HR", desc: "Single, double, triple, home run", stat: true },
  { token: "BB / IBB", desc: "Walk / intentional walk", stat: true },
  { token: "HBP", desc: "Hit by pitch", stat: true },
  { token: "K", desc: "Strikeout (swinging)", stat: true },
  { token: "Kc / KL", desc: "Strikeout looking", stat: true },
  { token: "ROE", desc: "Reached on error", stat: true },
  { token: "E / ERR", desc: "Error (out, no AB credit on E charged)", stat: true },
  { token: "FC", desc: "Fielder's choice", stat: true },
  { token: "SF / SAC", desc: "Sacrifice fly / bunt", stat: true },
  { token: "F1-F9 / L1-L9 / G1-G9", desc: "Fly / line / ground out, by position", stat: true },
  { token: "P3-P6", desc: "Popup, by position", stat: true },
  { token: "1-3 / 6-3 / 4-3 / 5-3", desc: "Groundout, fielding sequence", stat: true },
  { token: "6-4-3 / 4-6-3", desc: "Double play, fielding sequence", stat: true },
  { token: "DP / TP", desc: "Double play / triple play modifier", stat: true },
  { token: "SB2 / SB3 / SB H", desc: "Stolen base — 2nd, 3rd, home", stat: false },
  { token: "CS2 / CS3 / CS H", desc: "Caught stealing", stat: false },
  { token: "WP / PB / BK", desc: "Wild pitch / passed ball / balk", stat: false },
  { token: "SAC bunt 1-3", desc: "Free-form annotation; anything not in the list above is recorded as flavor text only", stat: false }
];

function renderDataView() {
  if (els.dataSourceList) {
    const gcSources = state.sources.filter((s) => (s.source || "gamechanger") === "gamechanger");
    if (gcSources.length) {
      els.dataSourceList.innerHTML = gcSources.map((source) => `
        <div class="source-item">
          <strong>${escapeHtml(source.name)}</strong>
          <p class="meta">${escapeHtml((source.type || "csv").toUpperCase())} &middot; ${escapeHtml(source.scope || "")} &middot; ${escapeHtml(source.detail || "")} &middot; ${new Date(source.importedAt).toLocaleString()}</p>
        </div>
      `).join("");
    } else {
      els.dataSourceList.innerHTML = `<p class="meta">No GameChanger imports yet.</p>`;
    }
  }

  const prestoList = document.querySelector("#prestoSourceList");
  if (prestoList) {
    const prestoSources = state.sources.filter((s) => s.source === "presto");
    if (prestoSources.length) {
      prestoList.innerHTML = prestoSources.map((source) => `
        <div class="source-item">
          <strong>${escapeHtml(source.name)}</strong>
          <p class="meta">${escapeHtml((source.variant || source.type || "csv").toUpperCase())} &middot; ${escapeHtml(source.scope || "")} &middot; ${escapeHtml(source.detail || "")} &middot; ${new Date(source.importedAt).toLocaleString()}</p>
        </div>
      `).join("");
    } else {
      prestoList.innerHTML = `<p class="meta">No PrestoSports imports yet. Drop a TRX roster, then any of the eight stat CSVs.</p>`;
    }
  }

  if (els.boxScoreList) {
    const boxes = state.boxScores.filter((b) => (b.side || "home") === state.activeSide);
    if (boxes.length) {
      els.boxScoreList.innerHTML = boxes.map((box) => `
        <div class="source-item">
          <strong>${escapeHtml(box.opponent || "Opponent unknown")} &middot; ${escapeHtml(box.gameDate || "no date")}</strong>
          <p class="meta">${box.lines.length} player rows${box.resultNote ? ` &middot; ${escapeHtml(box.resultNote)}` : ""} &middot; <span class="source-action" data-delete-box="${box.id}">delete</span></p>
        </div>
      `).join("");
    } else {
      els.boxScoreList.innerHTML = `<p class="meta">No box scores imported for this side yet. Use the form above to import a per-game CSV or TXT.</p>`;
    }
  }

  if (els.notationDocs) {
    els.notationDocs.innerHTML = `
      <table class="notation-table">
        <thead><tr><th>Token</th><th>Meaning</th><th>Updates stats?</th></tr></thead>
        <tbody>
          ${notationDocsData.map((row) => `
            <tr>
              <td><code>${escapeHtml(row.token)}</code></td>
              <td>${escapeHtml(row.desc)}</td>
              <td>${row.stat ? `<span class="notation-stat-yes">YES</span>` : `<span class="notation-stat-no">no</span>`}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
}

function addGame() {
  const current = activeGame();
  const usedLabels = new Set((state.games || []).map((game) => String(game.label || "").trim()));
  let gameNum = state.games.length + 1;
  while (usedLabels.has(`Game ${gameNum}`)) gameNum += 1;
  const entry = newGameEntry(`Game ${gameNum}`);
  entry.game.teamName = current.game.teamName;
  entry.game.opponentName = current.game.opponentName;
  entry.game.gameDate = current.game.gameDate;
  entry.game.gameType = normalizeGameType(current.game.gameType);
  entry.game.location = current.game.location || "";
  entry.game.venue = current.game.venue || "";
  entry.game.fieldName = current.game.fieldName || "";
  entry.game.firstPitchTime = current.game.firstPitchTime || "";
  entry.game.firstPitchWeather = current.game.firstPitchWeather || "";
  entry.game.umpires = { ...emptyUmpires(), ...(current.game.umpires || {}) };
  entry.inningCount = current.inningCount;
  entry.teamMeta = cloneTeamMeta(state.teamMeta);
  ["home", "away"].forEach((side) => {
    const src = current.charts[side];
    const dst = entry.charts[side];
    dst.lineup = [...src.lineup];
    dst.lineupPositions = [...src.lineupPositions];
    dst.startingPitcherId = src.startingPitcherId;
    dst.activePitcherId = src.startingPitcherId;
    dst.bullpenIds = [...src.bullpenIds];
    dst.hud = JSON.parse(JSON.stringify(src.hud));
  });
  state.games.push(entry);
  state.activeGameIndex = state.games.length - 1;
  state.activeSide = "away";
  state.fullChartSide = "away";
  saveState();
  render();
}

function reverseGameDataForRemoval(gameIndex) {
  const previousGameIndex = state.activeGameIndex;
  const previousSide = state.activeSide;
  const previousFullChartSide = state.fullChartSide;
  const game = state.games[gameIndex];
  if (!game) return;

  try {
    state.activeGameIndex = gameIndex;
    ["home", "away"].forEach((side) => {
      state.activeSide = side;
      Object.keys(activeChart().scorecard || {}).forEach((cellKey) => {
        reverseChartCell(cellKey);
      });
    });

    const gameId = game.id;
    state.events.forEach((event) => {
      if (eventBelongsToGame(event, gameId)) applyEvent(event, -1);
    });
    state.events = state.events.filter((event) => !eventBelongsToGame(event, gameId));
  } finally {
    state.activeGameIndex = previousGameIndex;
    state.activeSide = previousSide;
    state.fullChartSide = previousFullChartSide;
  }
}

async function removeGameFlow() {
  if ((state.games || []).length <= 1) return;
  const choices = state.games.slice(1).map((game, index) => {
    const gameIndex = index + 1;
    return {
      label: game.label || `Game ${gameIndex + 1}`,
      value: String(gameIndex),
      detail: `${game.game?.gameDate || "No date"} ${game.game?.opponentName ? `vs ${game.game.opponentName}` : ""}`.trim()
    };
  });
  const selectedIndexRaw = await showAppPrompt({
    title: "Remove game",
    message: "Choose the extra game you want to remove. Game 1 cannot be deleted here; reset it from the chart if needed.",
    choices,
    requireChoice: true
  });
  const selectedIndex = Number(selectedIndexRaw);
  if (!Number.isInteger(selectedIndex) || selectedIndex < 1 || selectedIndex >= state.games.length) return;

  const game = state.games[selectedIndex];
  const confirmation = await showAppPrompt({
    title: `Remove ${game.label || `Game ${selectedIndex + 1}`}?`,
    message: "This permanently deletes that game's chart, pitch log, live events, and stat updates. This cannot be undone.",
    choices: [
      { label: "Yes, remove game", value: "yes", detail: "Permanent deletion" },
      { label: "Cancel", value: "no", detail: "Keep this game" }
    ],
    requireChoice: true
  });
  if (confirmation !== "yes") return;

  reverseGameDataForRemoval(selectedIndex);
  const deletingActiveGame = selectedIndex === state.activeGameIndex;
  state.games.splice(selectedIndex, 1);
  if (deletingActiveGame) {
    state.activeGameIndex = Math.min(selectedIndex, state.games.length - 1);
    state.activeSide = "away";
    state.fullChartSide = "away";
  } else if (state.activeGameIndex > selectedIndex) {
    state.activeGameIndex -= 1;
  }
  saveState();
  render();
}

function renderGameSwitcher() {
  const el = document.querySelector("#gameSwitcher");
  if (!el) return;
  el.innerHTML = state.games.map((entry, i) => `
    <button class="game-tab${i === state.activeGameIndex ? " active" : ""}" data-game-index="${i}">${escapeHtml(entry.label)}</button>
  `).join("") + `
    <button class="game-tab game-tab-add" id="addGameButton">+ Add Game</button>
    ${state.games.length > 1 ? `<button class="game-tab game-tab-remove danger" id="removeGameButton">Remove Game</button>` : ""}
  `;
}

function render() {
  applyActiveTeamColors();
  renderGameSwitcher();
  renderSetup();
  renderChartHud();
  renderUpNextStrip();
  renderInningTotals();
  renderScorecard();
  renderDiamondLineScore();
  renderDataView();
  renderLineup();
  renderPlayerSelects();
  renderSpotlight();
  renderPlayerTable();
  renderRosterCards();
  renderEvents();
  renderPitching();
  renderDefense();
  renderDefensePopup();
}

function renderPitching() {
  const chart = activeChart();
  const players = playersForSide(oppositeSide());
  const allPitcherOptions = [`<option value="">Select pitcher</option>`]
    .concat(players.map((player) => `<option value="${player.id}" ${player.id === chart.activePitcherId ? "selected" : ""}>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}</option>`))
    .join("");
  els.activePitcher.innerHTML = allPitcherOptions;
  els.startingPitcher.innerHTML = allPitcherOptions;
  els.startingPitcher.value = chart.startingPitcherId || "";
  els.bullpenSelect.innerHTML = allPitcherOptions;

  const active = state.players.find((player) => player.id === chart.activePitcherId);
  const activeLine = getPitchingLine(chart);
  els.activePitcherLabel.textContent = active ? `${fullName(active)} - ${activeLine.pitches} P | ${activeLine.BK} Bk` : "No active pitcher";

  const selectedPitcherIds = [...new Set([chart.startingPitcherId, chart.activePitcherId, ...chart.bullpenIds].filter(Boolean))];
  const selectedPitchers = selectedPitcherIds.map((id) => state.players.find((player) => player.id === id)).filter(Boolean);
  els.pitcherCards.innerHTML = selectedPitchers.map((player) => {
    const line = getPitchingLine(chart, player.id);
    const isBullpen = chart.bullpenIds.includes(player.id);
    const seasonPitchingLine = pitchingStatsLine(player.stats);
    return `
      <article class="pitcher-card ${player.id === chart.activePitcherId ? "active" : ""}">
        <div>
          <strong>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}${player.id === chart.startingPitcherId ? " - SP" : ""}${isBullpen ? " - BP" : ""}</strong>
          <p class="meta">${escapeHtml(seasonPitchingLine)}</p>
          <p class="meta">Today: IP ${formatIpFromOuts(line.outs)} H ${line.H} R ${line.R} ER ${line.ER} HR ${line.HR} BB ${line.BB} K ${line.K} HBP ${line.HBP} WP ${line.WP} BK ${line.BK} BF ${line.BF} P/S ${line.pitches}/${line.strikes}</p>
          <textarea data-prev-starts="${player.id}" rows="2" placeholder="Previous starts: IP, H, R, ER, HR, BB, K, BF, P/S">${escapeHtml(player.previousStarts || "")}</textarea>
        </div>
        <div class="number-badge">${line.pitches}</div>
      </article>
    `;
  }).join("") || `<p class="meta">Choose a starter or add bullpen arms from the dropdown. Only selected pitchers show here.</p>`;

  els.pitchLogSummary.textContent = `${chart.pitchLog.length} pitch${chart.pitchLog.length === 1 ? "" : "es"}`;
  els.pitchLog.innerHTML = chart.pitchLog.length
    ? chart.pitchLog.slice(0, 40).map((pitch, index) => {
      const pitcher = state.players.find((player) => player.id === pitch.pitcherId);
      return `
        <article class="event-card">
          <h3>${chart.pitchLog.length - index}. ${escapeHtml(pitch.type.toUpperCase())} - ${escapeHtml(pitch.cellKey)}</h3>
          <p>${escapeHtml(pitcher ? fullName(pitcher) : "No pitcher")} - count after pitch: ${escapeHtml(pitch.count || "")}</p>
        </article>
      `;
    }).join("")
    : `<p class="meta">Pitch buttons in the diamond chart will build this log.</p>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function paragraphTextHtml(value) {
  const paragraphs = String(value || "")
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
}

function showAppPrompt({
  title,
  message = "",
  defaultValue = "",
  choices = [],
  inputLabel = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  requireChoice = false
} = {}) {
  if (!els.appPromptOverlay) return Promise.resolve(defaultValue);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      els.appPromptOverlay.hidden = true;
      els.appPromptConfirm.onclick = null;
      els.appPromptCancel.onclick = null;
      els.appPromptInput.onkeydown = null;
      els.appPromptChoices.onclick = null;
      els.appPromptConfirm.hidden = false;
      els.appPromptConfirm.textContent = "Confirm";
      els.appPromptCancel.textContent = "Cancel";
      resolve(value);
    };

    els.appPromptTitle.textContent = title || "Chart input";
    els.appPromptMessage.textContent = message;
    els.appPromptInput.value = defaultValue || "";
    els.appPromptInput.placeholder = inputLabel || "";
    els.appPromptInput.hidden = Boolean(choices.length);
    els.appPromptConfirm.textContent = confirmLabel;
    els.appPromptCancel.textContent = cancelLabel;
    els.appPromptConfirm.hidden = Boolean(choices.length && requireChoice);
    els.appPromptChoices.innerHTML = choices.map((choice) => `
      <button type="button" data-prompt-choice="${escapeHtml(choice.value)}">
        <strong>${escapeHtml(choice.label)}</strong>
        ${choice.detail ? `<span>${escapeHtml(choice.detail)}</span>` : ""}
      </button>
    `).join("");
    els.appPromptOverlay.hidden = false;

    els.appPromptChoices.onclick = (event) => {
      const choice = event.target.closest("[data-prompt-choice]");
      if (choice) finish(choice.dataset.promptChoice);
    };
    els.appPromptConfirm.onclick = () => finish(els.appPromptInput.value);
    els.appPromptCancel.onclick = () => finish(null);
    els.appPromptInput.onkeydown = (event) => {
      if (event.key === "Enter") finish(els.appPromptInput.value);
      if (event.key === "Escape") finish(null);
    };
    if (!choices.length) {
      window.setTimeout(() => els.appPromptInput.focus(), 0);
    }
  });
}

function fillPlayerForm(player) {
  const stats = player?.stats || emptyStats();
  els.editingId.value = player?.id || "";
  rosterEditPlayerId = player?.id || "";
  document.querySelector("#playerNumber").value = player?.number || "";
  document.querySelector("#playerFirst").value = player?.first || "";
  document.querySelector("#playerLast").value = player?.last || "";
  document.querySelector("#playerPronunciation").value = player?.pronunciation || "";
  document.querySelector("#playerHometown").value = player?.hometown || "";
  document.querySelector("#playerPosition").value = player?.position || "";
  document.querySelector("#playerClass").value = player?.classYear || "";
  document.querySelector("#playerHeight").value = player?.height || "";
  document.querySelector("#playerWeight").value = player?.weight || "";
  document.querySelector("#playerNotes").value = player?.notes || "";
  ["AB", "H", "2B", "3B", "HR", "BB", "HBP", "SF", "RBI", "SO", "SB", "CS"].forEach((key) => {
    document.querySelector(`#stat${CSS.escape(key)}`).value = stats[key] || 0;
  });
  ["IP", "ERA", "WHIP", "P_GP", "W", "L", "GS", "BF", "P_H", "P_R", "P_ER", "P_HR", "P_BB", "P_SO", "P_HBP", "P_WP", "P_BK", "BAA", "Pitches"].forEach((key) => {
    const input = document.querySelector(`#stat${CSS.escape(key)}`);
    if (input) input.value = stats[key] || 0;
  });
  updateRosterModalControls();
}

function rosterEditList() {
  return sortedPlayers();
}

function updateRosterModalControls() {
  if (!els.playerForm) return;
  els.playerForm.classList.toggle("is-modal-edit", rosterEditModalOpen);
  document.body.classList.toggle("player-modal-open", rosterEditModalOpen);
  const list = rosterEditList();
  const currentIndex = list.findIndex((player) => player.id === rosterEditPlayerId);
  const hasCycle = rosterEditModalOpen && list.length > 1 && currentIndex >= 0;
  if (els.prevPlayerButton) els.prevPlayerButton.disabled = !hasCycle;
  if (els.nextPlayerButton) els.nextPlayerButton.disabled = !hasCycle;
  if (els.closePlayerModalButton) els.closePlayerModalButton.disabled = !rosterEditModalOpen;
}

function openPlayerEditModal(playerId) {
  const player = state.players.find((item) => item.id === playerId);
  if (!player) return;
  rosterEditModalOpen = true;
  fillPlayerForm(player);
  document.querySelector('[data-view="rosterView"]')?.click();
  window.setTimeout(() => document.querySelector("#playerNumber")?.focus(), 0);
}

function closePlayerEditModal() {
  rosterEditModalOpen = false;
  rosterEditPlayerId = "";
  updateRosterModalControls();
}

function cycleRosterEditPlayer(direction) {
  if (!rosterEditModalOpen) return;
  const list = rosterEditList();
  if (!list.length) return;
  const currentIndex = Math.max(0, list.findIndex((player) => player.id === rosterEditPlayerId));
  const nextIndex = (currentIndex + direction + list.length) % list.length;
  fillPlayerForm(list[nextIndex]);
}

function savePlayerFromForm(event) {
  event.preventDefault();
  const closeAfterSave = rosterEditModalOpen;
  const id = els.editingId.value || uid("player");
  const existing = state.players.find((player) => player.id === id);
  const stats = { ...(existing?.stats || emptyStats()) };
  ["AB", "H", "2B", "3B", "HR", "BB", "HBP", "SF", "RBI", "SO", "SB", "CS"].forEach((key) => {
    stats[key] = toNumber(document.querySelector(`#stat${CSS.escape(key)}`).value);
  });
  ["IP", "ERA", "WHIP", "P_GP", "W", "L", "GS", "BF", "P_H", "P_R", "P_ER", "P_HR", "P_BB", "P_SO", "P_HBP", "P_WP", "P_BK", "BAA", "Pitches"].forEach((key) => {
    const input = document.querySelector(`#stat${CSS.escape(key)}`);
    if (input) stats[key] = toNumber(input.value);
  });

  const player = {
    id,
    number: document.querySelector("#playerNumber").value.trim(),
    first: document.querySelector("#playerFirst").value.trim(),
    last: document.querySelector("#playerLast").value.trim(),
    pronunciation: document.querySelector("#playerPronunciation").value.trim(),
    hometown: document.querySelector("#playerHometown").value.trim(),
    position: document.querySelector("#playerPosition").value.trim(),
    classYear: document.querySelector("#playerClass").value.trim(),
    height: document.querySelector("#playerHeight").value.trim(),
    weight: document.querySelector("#playerWeight").value.trim(),
    notes: document.querySelector("#playerNotes").value.trim(),
    handedness: existing?.handedness || "",
    side: existing?.side || state.activeSide,
    stats,
    confStats: existing?.confStats || emptyStats()
  };

  if (existing) Object.assign(existing, player);
  else state.players.push(player);

  saveState();
  if (closeAfterSave) closePlayerEditModal();
  fillPlayerForm(null);
  render();
}

async function strikeThreeChoice(cellKey, options = {}) {
  const choice = await showAppPrompt({
    title: "Strike three",
    message: "How should the strikeout be recorded?",
    choices: [
      { label: "K", value: "K", detail: "Swinging strikeout" },
      { label: "Kc", value: "KC", detail: "Looking strikeout" },
      { label: "K dropped", value: "KD", detail: "Out recorded after dropped strike three" }
    ]
  }) || "K";

  if (choice === "KC") {
    applyChartAction(cellKey, "KC", options);
    const cell = getScoreCellFromKey(cellKey);
    cell.outOverlay = true;
    return;
  }

  applyChartAction(cellKey, "K", options);
  const cell = getScoreCellFromKey(cellKey);
  if (choice === "KD") {
    const putoutRaw = await showAppPrompt({
      title: "Dropped strike three",
      message: "Enter the putout sequence.",
      defaultValue: "2-3",
      inputLabel: "2-3"
    });
    const putout = (putoutRaw || "2-3").trim();
    cell.notation = `K ${putout}`;
    cell.result = cell.notation;
  }
  cell.outOverlay = true;
}

async function addPitchToCell(cellKey, type) {
  const chart = activeChart();
  const cell = getScoreCellFromKey(cellKey);
  const gameType = cell.gameType || activeGameType();
  const beforeCount = cell.count || "0-0";
  const [ballsRaw, strikesRaw] = String(beforeCount).split("-").map(toNumber);
  const pitchKind = type.startsWith("ball") ? "ball" : type.startsWith("strike") ? "strike" : type;
  let balls = ballsRaw;
  let strikes = strikesRaw;

  if (pitchKind === "ball") balls = Math.min(3, balls + 1);
  if (pitchKind === "strike") strikes = Math.min(2, strikes + 1);
  if (pitchKind === "foul") strikes = strikes < 2 ? strikes + 1 : strikes;
  if (type !== "balk") cell.count = `${balls}-${strikes}`;

  let pitchDelta = null;
  if (chart.activePitcherId) {
    const updates = {};
    if (type === "balk") {
      updates.BK = 1;
    } else {
      chart.pitchCounts[chart.activePitcherId] = (chart.pitchCounts[chart.activePitcherId] || 0) + 1;
      updates.pitches = 1;
      if (pitchKind === "ball") updates.balls = 1;
      if (type === "ball-wp") updates.WP = 1;
      if (pitchKind === "foul") updates.fouls = 1;
      if (pitchKind === "strike" || pitchKind === "foul") updates.strikes = 1;
      if (strikesRaw >= 2) updates.twoStrikePitches = 1;
    }
    addToPitchingLine(chart.activePitcherId, updates, gameType);
    cell.pitchDeltas = cell.pitchDeltas || [];
    pitchDelta = { pitcherId: chart.activePitcherId, type, updates, gameType, beforeCount, afterCount: cell.count || beforeCount };
    cell.pitchDeltas.push(pitchDelta);
  }

  const pitchEvent = {
    id: uid("pitch"),
    pitcherId: chart.activePitcherId,
    type,
    cellKey,
    count: cell.count || "0-0",
    beforeCount,
    afterCount: cell.count || beforeCount,
    gameId: activeGame().id,
    gameType,
    createdAt: new Date().toISOString()
  };
  chart.pitchLog.unshift(pitchEvent);
  cell.pitchDeltas = cell.pitchDeltas || [];
  if (pitchDelta) pitchDelta.id = pitchEvent.id;
  else {
    pitchDelta = { id: pitchEvent.id, pitcherId: chart.activePitcherId, type, gameType, beforeCount, afterCount: cell.count || beforeCount };
    cell.pitchDeltas.push(pitchDelta);
  }

  if (type === "balk") return;

  const canAutoLogResult = !cell.actionKey && !cell.eventId && !cell.notation && !cell.result;
  if (canAutoLogResult && pitchKind === "ball" && ballsRaw >= 3) {
    cell.count = `3-${strikes}`;
    if (pitchDelta) pitchDelta.autoAppliedAction = "BB";
    applyChartAction(cellKey, "BB", { skipResultPitch: true });
  }
  if (canAutoLogResult && pitchKind === "strike" && strikesRaw >= 2) {
    cell.count = `${balls}-2`;
    if (type === "strike-looking") {
      if (pitchDelta) pitchDelta.autoAppliedAction = "KC";
      applyChartAction(cellKey, "KC", { skipResultPitch: true });
    }
    else if (type === "strike-swinging") {
      if (pitchDelta) pitchDelta.autoAppliedAction = "K";
      applyChartAction(cellKey, "K", { skipResultPitch: true });
    }
    else {
      if (pitchDelta) pitchDelta.autoAppliedAction = "K";
      await strikeThreeChoice(cellKey, { skipResultPitch: true });
    }
  }
}

function fallbackCountBeforeUndo(count, type) {
  const [ballsRaw, strikesRaw] = String(count || "0-0").split("-").map(toNumber);
  const pitchKind = type.startsWith("ball") ? "ball" : type.startsWith("strike") ? "strike" : type;
  let balls = ballsRaw;
  let strikes = strikesRaw;
  if (pitchKind === "ball") balls = Math.max(0, balls - 1);
  if (pitchKind === "strike") strikes = Math.max(0, strikes - 1);
  if (pitchKind === "foul" && strikesRaw < 2) strikes = Math.max(0, strikes - 1);
  return `${balls}-${strikes}`;
}

function lastUndoablePitchIndex(cell) {
  const pitches = cell.pitchDeltas || [];
  for (let index = pitches.length - 1; index >= 0; index -= 1) {
    if (!pitches[index]?.autoResult && pitches[index]?.type !== "result") return index;
  }
  return -1;
}

function undoLastPitchForCell(cellKey) {
  const chart = activeChart();
  const cell = getScoreCellFromKey(cellKey);
  const index = lastUndoablePitchIndex(cell);
  if (index < 0) return false;
  const pitch = cell.pitchDeltas[index];

  if (pitch.autoAppliedAction && cell.actionKey) {
    reverseChartCell(cellKey, { preservePitches: true });
    cell.result = "";
    cell.notation = "";
    cell.bases = emptyDiamondPath();
    cell.rbi = "";
  }

  if (pitch.pitcherId) {
    if (pitch.updates) {
      const reverseUpdates = {};
      Object.entries(pitch.updates).forEach(([key, value]) => {
        reverseUpdates[key] = -toNumber(value);
      });
      addToPitchingLine(pitch.pitcherId, reverseUpdates, pitch.gameType || cell.gameType || activeGameType());
      if (pitch.type !== "balk" && toNumber(pitch.updates.pitches)) {
        chart.pitchCounts[pitch.pitcherId] = Math.max(0, toNumber(chart.pitchCounts[pitch.pitcherId]) - toNumber(pitch.updates.pitches));
      }
    } else {
      const line = getPitchingLine(chart, pitch.pitcherId);
      if (pitch.type === "balk") line.BK = Math.max(0, toNumber(line.BK) - 1);
      else {
        chart.pitchCounts[pitch.pitcherId] = Math.max(0, toNumber(chart.pitchCounts[pitch.pitcherId]) - 1);
        line.pitches = Math.max(0, toNumber(line.pitches) - 1);
      }
    }
  }

  if (pitch.id) chart.pitchLog = chart.pitchLog.filter((item) => item.id !== pitch.id);
  cell.pitchDeltas.splice(index, 1);
  if (!cell.pitchDeltas.length) delete cell.pitchDeltas;
  if (pitch.type !== "balk") cell.count = pitch.beforeCount || fallbackCountBeforeUndo(cell.count, pitch.type);
  return true;
}

function addResultPitchToCell(cellKey, cell, actionKey, gameType) {
  if ((cell.pitchDeltas || []).some((pitch) => pitch.autoResult)) return;
  const chart = activeChart();
  const pitcherId = chart.activePitcherId;
  const updates = {};
  if (pitcherId) {
    chart.pitchCounts[pitcherId] = toNumber(chart.pitchCounts[pitcherId]) + 1;
    updates.pitches = 1;
    addToPitchingLine(pitcherId, updates, gameType);
  }
  const pitchEvent = {
    id: uid("pitch"),
    pitcherId,
    type: "result",
    actionKey,
    cellKey,
    count: cell.count || "0-0",
    beforeCount: cell.count || "0-0",
    afterCount: cell.count || "0-0",
    gameId: activeGame().id,
    gameType,
    autoResult: true,
    createdAt: new Date().toISOString()
  };
  chart.pitchLog.unshift(pitchEvent);
  cell.pitchDeltas = cell.pitchDeltas || [];
  cell.pitchDeltas.push({ id: pitchEvent.id, pitcherId, type: "result", actionKey, updates, gameType, autoResult: true, beforeCount: cell.count || "0-0", afterCount: cell.count || "0-0" });
}

function applyChartAction(cellKey, actionKey, options = {}) {
  const chart = activeChart();
  const [slot, inning, abNumber] = cellKey.split("-").map(Number);
  const batterId = batterIdAtSlot(slot);
  const action = chartActions[actionKey];
  if (!action || !batterId) return;

  const cell = chart.scorecard[cellKey] || getScoreCell(slot - 1, inning, abNumber ? abNumber - 1 : 0);
  reverseChartCell(cellKey, { preservePitches: true });

  const effectiveInning = cellActualInning(cell, inning);
  const gameType = activeGameType();
  const baseStateBefore = { ...chart.baseState };
  if (actionKey === "HR" && !toNumber(cell.rbi)) cell.rbi = 1;
  cell.result = action.notation;
  cell.notation = action.notation;
  cell.actionKey = actionKey;
  cell.gameType = gameType;
  cell.outOverlay = ["OUT", "K", "KC", "SF", "BI"].includes(actionKey);
  cell.baseStateBefore = baseStateBefore;
  cell.bases = emptyDiamondPath();
  (basePathForResult[actionKey] || []).forEach((base) => {
    cell.bases[base] = true;
  });
  cell.scoredOverlay = activeDiamondTerminal(cell.bases) === "toHome";
  if (!cell.scoredOverlay) delete cell.scoredOverlay;

  const inningUpdates = { ...(action.inning || {}) };
  const defensiveInningUpdates = {};
  if (inningUpdates.E) {
    defensiveInningUpdates.E = inningUpdates.E;
    delete inningUpdates.E;
  }
  if (["1B", "2B", "3B", "HR"].includes(actionKey)) inningUpdates.H = (inningUpdates.H || 0) + 1;
  if (actionKey === "HR") inningUpdates.R = (inningUpdates.R || 0) + 1;
  if (["2B", "3B"].includes(actionKey)) inningUpdates.RISP = (inningUpdates.RISP || 0) + 1;

  const batterTerminal = activeDiamondTerminal(cell.bases);
  applyAutomaticRunnerAdvancements(cell, cellKey, actionKey, baseStateBefore, effectiveInning);
  const liveRunnerId = batterTerminal && batterTerminal !== "toHome" ? (runnerIdAtSlot(slot) || batterId) : batterId;
  if (liveRunnerId) cell.runnerId = liveRunnerId;
  else delete cell.runnerId;
  setBatterBaseState(chart, liveRunnerId, batterTerminal === "toHome" ? "" : batterTerminal);

  addToInningTotals(effectiveInning, inningUpdates, 1);
  if (Object.keys(defensiveInningUpdates).length) {
    const defensiveSide = oppositeSide();
    addToChartInningTotals(activeGame().charts[defensiveSide], effectiveInning, defensiveInningUpdates, 1);
    cell.defensiveInningSide = defensiveSide;
    cell.defensiveInningUpdates = defensiveInningUpdates;
  }
  if (!options.skipResultPitch && !action.noPlateAppearance) {
    addResultPitchToCell(cellKey, cell, actionKey, gameType);
  }

  let event = null;
  if (!action.noPlateAppearance) {
    event = {
      id: uid("chart-event"),
      playerId: batterId,
      pitcherId: chart.activePitcherId,
      gameId: activeGame().id,
      gameType,
      result: action.result,
      rbi: toNumber(cell.rbi),
      sb: 0,
      cs: 0,
      context: `Inning ${effectiveInning}: ${action.notation}`,
      createdAt: new Date().toISOString()
    };
    applyEvent(event, 1);
    state.events.unshift(event);
  }

  const pitcherUpdates = { ...(action.pitcher || {}) };
  if (["OUT", "K", "KC", "SF", "BI"].includes(actionKey)) pitcherUpdates.outs = (pitcherUpdates.outs || 0) + 1;
  if (event) {
    const chargedRuns = pitcherRunsForAction(actionKey, event.rbi);
    const earnedRuns = pitcherEarnedRunsForAction(actionKey, event.rbi);
    if (chargedRuns) pitcherUpdates.R = chargedRuns;
    if (earnedRuns) pitcherUpdates.ER = earnedRuns;
  }
  addToPitchingLine(chart.activePitcherId, pitcherUpdates, gameType);
  if (event) cell.eventId = event.id;
  cell.pitcherId = chart.activePitcherId;
  cell.pitcherUpdates = pitcherUpdates;
  cell.inning = effectiveInning;
  cell.inningUpdates = inningUpdates;

  if (action.advanceBatter !== false && slot === getCurrentSlot() && effectiveInning === Number(chart.currentInning || 1)) {
    advanceBatter();
  }
}

function fielderChoiceSequenceFromNotation(notation) {
  return String(notation || "").replace(/^FC\b[\s:,-]*/i, "").trim();
}

function fielderChoiceDefaultSequence(base) {
  return {
    first: "6-4",
    second: "5-4",
    third: "5-2"
  }[base] || "6-4";
}

function updateCellEventContext(cell, notation) {
  if (!cell.eventId) return;
  const event = state.events.find((item) => item.id === cell.eventId);
  if (!event) return;
  event.context = `Inning ${cell.inning || activeChart().currentInning}: ${notation}`;
}

function rememberRunnerCellState(sourceCell, targetKey) {
  const targetCell = activeChart().scorecard[targetKey];
  if (!targetCell) return;
  sourceCell.runnerDiamondBefore = sourceCell.runnerDiamondBefore || [];
  if (sourceCell.runnerDiamondBefore.some((item) => item.key === targetKey)) return;
  sourceCell.runnerDiamondBefore.push({
    key: targetKey,
    bases: { ...(targetCell.bases || emptyDiamondPath()) },
    outOverlay: Boolean(targetCell.outOverlay),
    scoredOverlay: Boolean(targetCell.scoredOverlay),
    runnerId: targetCell.runnerId || "",
    runnerNote: targetCell.runnerNote || ""
  });
}

function markRunnerOutFromLinkedPlay(sourceCell, sourceCellKey, runnerId, note) {
  const chart = activeChart();
  const runnerCellKey = findLatestScoreCellKeyForRunner(runnerId, sourceCellKey);
  if (!runnerCellKey || !chart.scorecard[runnerCellKey]) return;
  rememberRunnerCellState(sourceCell, runnerCellKey);
  const runnerCell = chart.scorecard[runnerCellKey];
  const oldBases = { ...(runnerCell.bases || emptyDiamondPath()) };
  if (scoringPathActive(oldBases)) {
    const inning = sourceCell.inning || Number(chart.currentInning || 1);
    const update = { RISP: -1 };
    addToInningTotals(inning, update, 1);
    sourceCell.inningUpdates = sourceCell.inningUpdates || {};
    sourceCell.inningUpdates.RISP = toNumber(sourceCell.inningUpdates.RISP) - 1;
  }
  runnerCell.bases = emptyDiamondPath();
  runnerCell.outOverlay = true;
  runnerCell.runnerNote = note;
  delete runnerCell.scoredOverlay;
  setBatterBaseState(chart, runnerId, "");
  addRunnerPitcherOut(sourceCell);
}

async function applyFielderChoice(cellKey, typedNotation = "") {
  const defaultSequence = fielderChoiceSequenceFromNotation(typedNotation) || "6-4";
  const outcome = await showAppPrompt({
    title: "Fielder's choice",
    message: "Did the batter reach first, or was the batter out on this FC?",
    choices: [
      { label: "Reach 1B", value: "reach", detail: "Batter reaches first; no hit is credited" },
      { label: "Batter out", value: "out", detail: "Record an out with FC notation" }
    ],
    requireChoice: true
  });
  if (!outcome) return false;
  const sequenceRaw = await showAppPrompt({
    title: "Fielder's choice play",
    message: "Enter the play or throw sequence.",
    defaultValue: defaultSequence,
    inputLabel: defaultSequence
  });
  const sequence = (sequenceRaw || defaultSequence).trim();
  const notation = sequence ? `FC ${sequence}` : "FC";
  applyChartAction(cellKey, outcome === "reach" ? "FC" : "OUT");
  const cell = getScoreCellFromKey(cellKey);
  cell.notation = notation;
  cell.result = notation;
  cell.outOverlay = outcome === "out";
  if (outcome !== "out") delete cell.outOverlay;
  updateCellEventContext(cell, notation);
  return true;
}

function runnerMovementUpdates(oldBases, newBases) {
  const updates = {};
  const oldTerminal = activeDiamondTerminal(oldBases);
  const newTerminal = activeDiamondTerminal(newBases);
  if (scoringPathActive(oldBases) !== scoringPathActive(newBases)) {
    updates.RISP = scoringPathActive(newBases) ? 1 : -1;
  }
  if (oldTerminal !== "toHome" && newTerminal === "toHome") updates.R = 1;
  if (oldTerminal === "toHome" && newTerminal !== "toHome") updates.R = -1;
  return updates;
}

function applyRunnerSafeEvent(cellKey, cell, runnerId, targetTerminal, oldBases) {
  const chart = activeChart();
  const { inning } = parseScoreCellKey(cellKey);
  const effectiveInning = cellActualInning(cell, inning);
  const newBases = targetTerminal ? diamondPathThrough(targetTerminal) : emptyDiamondPath();

  if (!cell.baseStateBefore) cell.baseStateBefore = { ...chart.baseState };
  cell.bases = newBases;
  cell.inning = effectiveInning;
  cell.scoredOverlay = targetTerminal === "toHome";
  if (!cell.scoredOverlay) delete cell.scoredOverlay;
  addRunnerInningDelta(cell, effectiveInning, runnerMovementUpdates(oldBases, newBases));
  syncRunnerRunStatForMovement(cell, runnerId, oldBases, newBases);

  if (runnerId) {
    cell.runnerId = runnerId;
    setBatterBaseState(chart, runnerId, targetTerminal === "toHome" ? "" : targetTerminal);
  }
}

function applyRunnerOutEvent(cellKey, cell, runnerId, targetTerminal, oldBases) {
  const chart = activeChart();
  const { inning } = parseScoreCellKey(cellKey);
  const effectiveInning = cellActualInning(cell, inning);
  const updates = {};

  if (!cell.baseStateBefore) cell.baseStateBefore = { ...chart.baseState };
  if (scoringPathActive(oldBases)) updates.RISP = -1;
  if (activeDiamondTerminal(oldBases) === "toHome") updates.R = -1;
  addRunnerInningDelta(cell, effectiveInning, updates);
  syncRunnerRunStatForMovement(cell, runnerId, oldBases, emptyDiamondPath());

  cell.bases = targetTerminal ? diamondPathThrough(targetTerminal) : emptyDiamondPath();
  cell.inning = effectiveInning;
  cell.outOverlay = true;
  delete cell.scoredOverlay;
  if (runnerId) {
    cell.runnerId = runnerId;
    setBatterBaseState(chart, runnerId, "");
  }
  addRunnerPitcherOut(cell);
}

async function applyRunnerEvent(cellKey, eventValue, laneTerminal = "") {
  const option = runnerEventByValue(eventValue);
  if (!option) return false;

  const cell = getScoreCellFromKey(cellKey);
  const runnerId = runnerIdForCell(cellKey, cell);
  const currentTerminal = terminalForRunnerCell(cellKey, cell);
  const targetTerminal = targetTerminalForRunnerEvent(option, currentTerminal, laneTerminal);
  const defaultInput = defaultRunnerEventInput(option, targetTerminal);
  const rawNote = await showAppPrompt({
    title: `${option.label} play`,
    message: option.mode === "out"
      ? "Enter the putout, relay, or play sequence."
      : "Enter the runner notation for this play.",
    defaultValue: defaultInput,
    inputLabel: defaultInput
  });
  if (rawNote === null) return false;

  const oldBases = { ...(cell.bases || emptyDiamondPath()) };
  const notation = formatRunnerEventNotation(option, rawNote || defaultInput, targetTerminal);
  clearRunnerOutcome(cell);

  if (option.mode === "out") {
    applyRunnerOutEvent(cellKey, cell, runnerId, targetTerminal, oldBases);
  } else {
    applyRunnerSafeEvent(cellKey, cell, runnerId, targetTerminal, oldBases);
  }

  if (runnerId && option.runnerStat) {
    addRunnerStatDelta(cell, runnerId, option.runnerStat, 1);
  }
  if (option.pitcher) {
    addRunnerPitcherDelta(cell, option.pitcher);
  }
  if (option.defensive) {
    const { inning } = parseScoreCellKey(cellKey);
    addRunnerDefensiveInningDelta(cell, cellActualInning(cell, inning), option.defensive);
  }

  cell.runnerNote = notation;
  if (!cell.notation && !cell.result) cell.notation = notation;
  return true;
}

function removeExtraAtBat(cellKey) {
  const chart = activeChart();
  const { slot, inning, abNumber } = parseScoreCellKey(cellKey);
  if (abNumber <= 1) return;

  const baseKey = scoreCellKey(slot - 1, inning);
  const extraCount = toNumber(chart.extraAbs[baseKey]);
  const totalAbs = 1 + extraCount;
  if (abNumber > totalAbs) return;

  reverseChartCell(cellKey);
  delete chart.scorecard[cellKey];

  for (let currentAb = abNumber + 1; currentAb <= totalAbs; currentAb += 1) {
    const fromKey = scoreCellKey(slot - 1, inning, currentAb - 1);
    const toKey = scoreCellKey(slot - 1, inning, currentAb - 2);
    if (chart.scorecard[fromKey]) chart.scorecard[toKey] = chart.scorecard[fromKey];
    else delete chart.scorecard[toKey];
  }
  delete chart.scorecard[scoreCellKey(slot - 1, inning, totalAbs - 1)];
  chart.extraAbs[baseKey] = Math.max(0, extraCount - 1);
  if (!chart.extraAbs[baseKey]) delete chart.extraAbs[baseKey];
  setSelectedAbForSlotInning(slot - 1, inning, Math.max(0, abNumber - 2), chart);
}

function clearActiveChartData() {
  const chart = activeChart();
  const gameId = activeGame().id;
  Object.keys(chart.scorecard || {}).forEach((cellKey) => {
    reverseChartCell(cellKey);
  });
  const remainingEvents = [];
  state.events.forEach((event) => {
    if (eventBelongsToGame(event, gameId)) applyEvent(event, -1);
    else remainingEvents.push(event);
  });
  state.events = remainingEvents;
  chart.scorecard = {};
  chart.extraAbs = {};
  chart.selectedAbs = {};
  chart.inningTotals = {};
  chart.completedInnings = {};
  chart.editingCompletedInnings = {};
  chart.pitchCounts = {};
  chart.pitchingLines = {};
  chart.pitchLog = [];
  chart.baseStates = {};
  chart.baseState = emptyBaseState();
}

function currentBoxScoreMeta() {
  return {
    gameDate: els.boxScoreDate?.value || "",
    opponent: els.boxScoreOpponent?.value || "",
    resultNote: els.boxScoreResultNote?.value || ""
  };
}

function clearBoxScoreTextFields() {
  if (els.boxScoreOpponent) els.boxScoreOpponent.value = "";
  if (els.boxScoreResultNote) els.boxScoreResultNote.value = "";
}

function importWorkspaceJson(text, filename = "workspace JSON") {
  let nextState;
  try {
    nextState = JSON.parse(text);
  } catch {
    throw new Error("That JSON file could not be parsed.");
  }
  if (!nextState || typeof nextState !== "object" || (!Array.isArray(nextState.games) && !Array.isArray(nextState.players))) {
    throw new Error("That JSON file does not look like a PxP Baseball workspace export.");
  }
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, nextState);
  normalizeState();
  saveState();
  render();
  alert(`Imported ${filename}.`);
}

let activeStatExplanationAnchor = null;
let activeHudContextAnchor = null;

function closeStatExplanation() {
  document.querySelector("#statExplanationPopover")?.remove();
  activeStatExplanationAnchor = null;
}

function closeHudContextPopover() {
  document.querySelector("#hudContextPopover")?.remove();
  activeHudContextAnchor = null;
}

function positionStatExplanation(popover, anchor) {
  const rect = anchor.getBoundingClientRect();
  const width = Math.min(320, window.innerWidth - 16);
  const left = Math.min(window.innerWidth - width - 8, Math.max(8, rect.left));
  const height = Math.min(popover.offsetHeight || 160, window.innerHeight - 16);
  const top = rect.bottom + 8 + height > window.innerHeight
    ? Math.max(8, rect.top - height - 8)
    : rect.bottom + 8;
  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
  popover.style.width = `${width}px`;
}

function toggleStatExplanation(anchor) {
  const key = anchor?.dataset?.statExplain;
  const info = statExplanationData[key];
  if (!info) return false;
  const existing = document.querySelector("#statExplanationPopover");
  if (existing && activeStatExplanationAnchor === anchor) {
    closeStatExplanation();
    return true;
  }
  closeStatExplanation();
  closeHudContextPopover();
  const popover = document.createElement("div");
  popover.id = "statExplanationPopover";
  popover.className = "stat-explanation-popover";
  popover.dataset.statExplain = key;
  popover.innerHTML = `
    <strong>${escapeHtml(info.title)}</strong>
    <p><b>Formula:</b> ${escapeHtml(info.formula)}</p>
    <p><b>Example:</b> ${escapeHtml(info.example)}</p>
  `;
  document.body.appendChild(popover);
  activeStatExplanationAnchor = anchor;
  positionStatExplanation(popover, anchor);
  return true;
}

function toggleHudContextPopover(anchor) {
  const playerId = anchor?.dataset?.playerId;
  const type = anchor?.dataset?.hudContext;
  if (!playerId || !type) return false;
  const existing = document.querySelector("#hudContextPopover");
  if (existing && activeHudContextAnchor === anchor) {
    closeHudContextPopover();
    return true;
  }
  closeHudContextPopover();
  closeStatExplanation();
  const info = hudContextInfo(playerId, type);
  const popover = document.createElement("div");
  popover.id = "hudContextPopover";
  popover.className = "stat-explanation-popover hud-context-popover";
  popover.innerHTML = `
    <strong>${escapeHtml(info.title)}</strong>
    <p>${escapeHtml(info.summary)}</p>
    <ul>
      ${info.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
  document.body.appendChild(popover);
  activeHudContextAnchor = anchor;
  positionStatExplanation(popover, anchor);
  return true;
}

function setupEvents() {
  if (els.collapseSetupButton) {
    els.collapseSetupButton.addEventListener("click", () => {
      els.appShell.classList.toggle("setup-collapsed");
      els.collapseSetupButton.textContent = els.appShell.classList.contains("setup-collapsed") ? "Expand" : "Collapse";
    });
  }

  document.querySelectorAll(".side-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.activeSide = tab.dataset.side;
      state.fullChartSide = state.activeSide;
      document.querySelectorAll(".side-tab").forEach((item) => item.classList.toggle("active", item === tab));
      saveState();
      render();
    });
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".view").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.view}`).classList.add("active");
    });
  });

  ["teamName", "opponentName"].forEach((key) => {
    els[key].addEventListener("input", () => {
      state.games.forEach((entry) => {
        entry.game[key] = els[key].value;
      });
      saveState();
      document.querySelectorAll(".side-tab").forEach((tab) => {
        applySideTabColors(tab);
        const role = tab.dataset.side === "home" ? "Home" : "Away";
        tab.textContent = `${role}: ${sideLabel(tab.dataset.side)}`;
      });
      renderGameSwitcher();
      renderChartHud();
      renderInningTotals();
      renderDiamondLineScore();
      renderFullScorecard();
    });
  });

  const gameFieldMap = {
    gameDate: "gameDate",
    gameLocation: "location",
    gameVenue: "venue",
    gameFieldName: "fieldName",
    firstPitchTime: "firstPitchTime",
    firstPitchWeather: "firstPitchWeather",
    gameNotes: "notes"
  };
  Object.entries(gameFieldMap).forEach(([key, field]) => {
    if (!els[key]) return;
    els[key].addEventListener("input", () => {
      activeGame().game[field] = els[key].value;
      saveState();
      renderChartHud();
    });
  });

  [
    ["umpireHp", "hp"],
    ["umpireFirst", "first"],
    ["umpireSecond", "second"],
    ["umpireThird", "third"]
  ].forEach(([key, field]) => {
    if (!els[key]) return;
    els[key].addEventListener("input", () => {
      activeGame().game.umpires = { ...emptyUmpires(), ...(activeGame().game.umpires || {}) };
      activeGame().game.umpires[field] = els[key].value;
      saveState();
      renderChartHud();
    });
  });

  if (els.gameType) {
    els.gameType.addEventListener("change", () => {
      setActiveGameType(els.gameType.value);
      saveState();
      render();
    });
  }

  ["showAtBatControls", "showFocusControls", "showStatExplanations"].forEach((key) => {
    if (!els[key]) return;
    els[key].addEventListener("change", () => {
      state.settings[key] = els[key].checked;
      if (key === "showFocusControls" && !els[key].checked) {
        Object.values(activeGame().charts).forEach((chart) => {
          chart.viewMode = "all";
        });
      }
      if (key === "showStatExplanations" && !els[key].checked) closeStatExplanation();
      saveState();
      render();
    });
  });

  if (els.teamProfilePanel) {
    els.teamProfilePanel.addEventListener("input", (event) => {
      const metaSide = event.target.dataset.teamMetaSide;
      const metaField = event.target.dataset.teamMetaField;
      const recordSide = event.target.dataset.teamRecordSide;
      const coachSide = event.target.dataset.coachSide;
      const chartHudField = event.target.dataset.chartHudField;
      if (metaSide && metaField) {
        teamMetaForSide(metaSide)[metaField] = event.target.value;
        if (metaField === "primaryColor") {
          applyActiveTeamColors();
          document.querySelectorAll(".side-tab").forEach(applySideTabColors);
        }
      }
      if (recordSide) {
        const record = teamMetaForSide(recordSide).records[toNumber(event.target.dataset.teamRecordIndex)];
        if (record) record[event.target.dataset.teamRecordField] = event.target.value;
      }
      if (coachSide) {
        const coach = teamMetaForSide(coachSide).coaches[toNumber(event.target.dataset.coachIndex)];
        if (coach) coach[event.target.dataset.coachField] = event.target.value;
      }
      if (chartHudField) activeChart().hud[chartHudField] = event.target.value;
      saveState();
      renderChartHud();
      renderUpNextStrip();
    });

    els.teamProfilePanel.addEventListener("change", (event) => {
      const toggleSide = event.target.dataset.teamToggle;
      const logoSide = event.target.dataset.teamLogo;
      const coachImageSide = event.target.dataset.coachImageSide;
      if (toggleSide) {
        teamMetaForSide(toggleSide)[event.target.dataset.teamMetaField] = event.target.checked;
        saveState();
        render();
        return;
      }
      if (logoSide || coachImageSide) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          if (logoSide) teamMetaForSide(logoSide).logo = String(reader.result || "");
          if (coachImageSide) {
            const coach = teamMetaForSide(coachImageSide).coaches[toNumber(event.target.dataset.coachIndex)];
            if (coach) coach.image = String(reader.result || "");
          }
          saveState();
          render();
        };
        reader.readAsDataURL(file);
      }
    });

    els.teamProfilePanel.addEventListener("click", (event) => {
      const addSide = event.target.closest("[data-add-coach]")?.dataset.addCoach;
      const deleteSide = event.target.closest("[data-delete-coach]")?.dataset.deleteCoach;
      if (addSide) {
        teamMetaForSide(addSide).coaches.push({ id: uid("coach"), name: "", title: "", bio: "", image: "" });
        saveState();
        renderSetup();
        renderChartHud();
      }
      if (deleteSide) {
        const index = toNumber(event.target.closest("[data-delete-coach]").dataset.coachIndex);
        teamMetaForSide(deleteSide).coaches.splice(index, 1);
        saveState();
        renderSetup();
        renderChartHud();
      }
    });
  }

  els.csvInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      importPlayersFromCsv(await file.text(), file.name, "overall");
    } catch (error) {
      alert(error.message);
    } finally {
      event.target.value = "";
    }
  });

  if (els.gcConferenceCsvInput) {
    els.gcConferenceCsvInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        importPlayersFromCsv(await file.text(), file.name, "conference");
      } catch (error) {
        alert(error.message);
      } finally {
        event.target.value = "";
      }
    });
  }

  if (els.gcBoxScoreInput) {
    els.gcBoxScoreInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        importBoxScoreFromCsv(await file.text(), file.name, currentBoxScoreMeta());
        clearBoxScoreTextFields();
      } catch (error) {
        alert(error.message);
      } finally {
        event.target.value = "";
      }
    });
  }

  if (els.boxScoreInput) {
    els.boxScoreInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        importBoxScoreFromCsv(await file.text(), file.name, currentBoxScoreMeta());
        clearBoxScoreTextFields();
      } catch (error) {
        alert(error.message);
      } finally {
        event.target.value = "";
      }
    });
  }

  if (els.boxScoreTxtInput) {
    els.boxScoreTxtInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        importBoxScoreFromTxt(await file.text(), file.name, currentBoxScoreMeta());
        clearBoxScoreTextFields();
      } catch (error) {
        alert(error.message);
      } finally {
        event.target.value = "";
      }
    });
  }

  const prestoRosterInput = document.querySelector("#prestoRosterInput");
  if (prestoRosterInput) {
    prestoRosterInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const lower = file.name.toLowerCase();
        if (lower.endsWith(".tro")) {
          alert("TRO is index-only — drop the matching .TRX instead.");
          return;
        }
        if (!lower.endsWith(".trx")) {
          alert("Roster file must be .trx (or .tro index, which will be skipped).");
          return;
        }
        importPrestoRosterFromTrx(await file.text(), file.name);
      } catch (error) {
        alert(error.message);
      } finally {
        event.target.value = "";
      }
    });
  }

  document.querySelectorAll('input[data-presto-scope]').forEach((input) => {
    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const scope = event.target.dataset.prestoScope || "overall";
      try {
        importPrestoStatsFromCsv(await file.text(), file.name, scope);
      } catch (error) {
        alert(error.message);
      } finally {
        event.target.value = "";
      }
    });
  });

  document.querySelector("#gameSwitcher")?.addEventListener("click", async (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    if (btn.id === "addGameButton") { addGame(); return; }
    if (btn.id === "removeGameButton") { await removeGameFlow(); return; }
    const idx = Number(btn.dataset.gameIndex);
    if (!Number.isNaN(idx) && idx !== state.activeGameIndex) {
      state.activeGameIndex = idx;
      saveState();
      render();
    }
  });

  document.querySelectorAll(".data-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".data-tab").forEach((t) => t.classList.toggle("active", t === tab));
      const target = tab.dataset.dataSection;
      document.querySelectorAll(".data-section").forEach((section) => {
        section.classList.toggle("active", section.id === target);
      });
    });
  });

  if (els.boxScoreList) {
    els.boxScoreList.addEventListener("click", (event) => {
      const deleteId = event.target.closest("[data-delete-box]")?.dataset.deleteBox;
      if (deleteId && confirm("Delete this box score?")) {
        state.boxScores = state.boxScores.filter((b) => b.id !== deleteId);
        saveState();
        render();
      }
    });
  }

  els.exportButton.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `pxp-baseball-${activeGame().game.teamName || "team"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  });

  if (els.importJsonInput) {
    els.importJsonInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        if (!confirm("Import this workspace JSON and replace the current local workspace?")) return;
        importWorkspaceJson(await file.text(), file.name);
      } catch (error) {
        alert(error.message);
      } finally {
        event.target.value = "";
      }
    });
  }

  if (els.clearImportsButton) {
    els.clearImportsButton.addEventListener("click", () => {
      const sourceCount = (state.sources || []).length;
      const boxCount = (state.boxScores || []).length;
      if (!sourceCount && !boxCount && !state.players.some((p) => Object.keys(p.stats || {}).length || Object.keys(p.confStats || {}).length)) {
        alert("No imported documents to clear.");
        return;
      }
      if (!confirm(`Clear ${sourceCount} import source(s) and ${boxCount} box score(s), and reset every player's stat lines? Roster identity and live scorecard data will be kept.`)) return;
      state.sources = [];
      state.boxScores = [];
      state.players.forEach((player) => {
        player.stats = emptyStats();
        player.confStats = emptyStats();
      });
      saveState();
      render();
    });
  }

  els.resetButton.addEventListener("click", () => {
    if (!confirm("Reset this local chart workspace?")) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });

  els.autoLineupButton.addEventListener("click", () => {
    autoFillLineup();
    saveState();
    render();
  });

  document.querySelector("#addLineupSlotButton").addEventListener("click", () => {
    activeChart().lineup.push("");
    activeChart().lineupPositions.push("SUB");
    saveState();
    render();
  });

  els.startingPitcher.addEventListener("change", () => {
    const chart = activeChart();
    chart.startingPitcherId = els.startingPitcher.value;
    if (!chart.activePitcherId) chart.activePitcherId = els.startingPitcher.value;
    saveState();
    render();
  });

  els.pitchingChangeButton.addEventListener("click", () => {
    const chart = activeChart();
    chart.activePitcherId = els.activePitcher.value;
    if (chart.activePitcherId && !chart.bullpenIds.includes(chart.activePitcherId) && chart.activePitcherId !== chart.startingPitcherId) {
      chart.bullpenIds.push(chart.activePitcherId);
    }
    saveState();
    render();
  });

  els.resetPitchingButton.addEventListener("click", () => {
    if (!confirm("Reset live pitching counts, lines, and pitch log for this chart side?")) return;
    const chart = activeChart();
    chart.pitchCounts = {};
    chart.pitchingLines = {};
    chart.pitchLog = [];
    chart.activePitcherId = chart.startingPitcherId || "";
    saveState();
    render();
  });

  els.addBullpenButton.addEventListener("click", () => {
    const chart = activeChart();
    const id = els.bullpenSelect.value;
    if (id && !chart.bullpenIds.includes(id)) chart.bullpenIds.push(id);
    saveState();
    render();
  });

  els.pitcherCards.addEventListener("input", (event) => {
    const playerId = event.target.dataset.prevStarts;
    if (!playerId) return;
    const player = state.players.find((item) => item.id === playerId);
    if (player) player.previousStarts = event.target.value;
    saveState();
  });

  els.chartHud.addEventListener("input", (event) => {
    const chart = activeChart();
    const hudField = event.target.dataset.hudField;
    const defensePos = event.target.dataset.defensePos;
    const teamMetaSide = event.target.dataset.teamMetaSide;
    const teamMetaField = event.target.dataset.teamMetaField;
    if (hudField) chart.hud[hudField] = event.target.value;
    if (defensePos) chart.hud.defense[defensePos] = event.target.value;
    if (teamMetaSide && teamMetaField) teamMetaForSide(teamMetaSide)[teamMetaField] = event.target.value;
    saveState();
  });

  if (els.defenseEditor) {
    els.defenseEditor.addEventListener("click", (event) => {
      if (!event.target.closest("[data-reset-defense-auto]")) return;
      clearManualDefenseAssignments();
      saveState();
      renderDefense();
      renderDefensePopup();
    });
    els.defenseEditor.addEventListener("input", (event) => {
      const defensePos = event.target.dataset.defensePos;
      const chartHudField = event.target.dataset.chartHudField;
      if (defensePos) activeChart().hud.defense[defensePos] = event.target.value;
      if (chartHudField) activeChart().hud[chartHudField] = event.target.value;
      saveState();
      renderDefensePopup();
    });
    els.defenseEditor.addEventListener("change", (event) => {
      const defensePos = event.target.dataset.defensePos;
      if (!defensePos) return;
      activeChart().hud.defense[defensePos] = event.target.value;
      saveState();
      renderDefensePopup();
    });
  }

  els.chartHud.addEventListener("change", (event) => {
    const defensePos = event.target.dataset.defensePos;
    const logoSide = event.target.dataset.teamLogo;
    if (defensePos) {
      activeChart().hud.defense[defensePos] = event.target.value;
      saveState();
      return;
    }
    if (logoSide) {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        teamMetaForSide(logoSide).logo = String(reader.result || "");
        saveState();
        renderChartHud();
      };
      reader.readAsDataURL(file);
    }
  });

  els.chartHud.addEventListener("click", (event) => {
    const hudContext = event.target.closest("[data-hud-context]");
    if (hudContext) {
      toggleHudContextPopover(hudContext);
      return;
    }
    const statExplain = event.target.closest("[data-stat-explain]");
    if (statExplain) {
      toggleStatExplanation(statExplain);
      return;
    }
    const recordSide = event.target.closest("[data-toggle-records]")?.dataset.toggleRecords;
    if (recordSide) {
      state.settings.expandedTeamRecords = state.settings.expandedTeamRecords || {};
      state.settings.expandedTeamRecords[recordSide] = !state.settings.expandedTeamRecords[recordSide];
      saveState();
      renderChartHud();
      return;
    }
    if (applyHudStatScopeFromEvent(event)) return;
    applyHudStatViewFromEvent(event);
  });

  els.inningTotals.addEventListener("input", (event) => {
    const key = event.target.dataset.inningTotal;
    if (!key) return;
    getInningTotals()[key] = toNumber(event.target.value);
    saveState();
  });

  els.diamondLineScore.addEventListener("input", (event) => {
    const key = event.target.dataset.inningTotal;
    if (!key) return;
    getInningTotals()[key] = toNumber(event.target.value);
    saveState();
    renderDiamondLineScore();
  });

  els.diamondLineScore.addEventListener("click", (event) => {
    const toggleSide = event.target.closest("[data-line-score-toggle]")?.dataset.lineScoreToggle;
    if (!toggleSide) return;
    toggleLineScoreExpanded(toggleSide);
  });

  els.inningTotals.addEventListener("click", (event) => {
    const hudContext = event.target.closest("[data-hud-context]");
    if (hudContext) {
      toggleHudContextPopover(hudContext);
      return;
    }
    const statExplain = event.target.closest("[data-stat-explain]");
    if (statExplain) {
      toggleStatExplanation(statExplain);
      return;
    }
    if (applyHudStatScopeFromEvent(event)) return;
    if (applyHudStatViewFromEvent(event)) return;
    const clearBase = event.target.closest("[data-clear-base]")?.dataset.clearBase;
    const steal = event.target.closest("[data-steal]")?.dataset.steal;
    const chart = activeChart();
    if (clearBase) {
      if (chart.baseState[clearBase]) updateRunnerDiamond(chart.baseState[clearBase], "");
      chart.baseState[clearBase] = "";
      syncCurrentBaseState(chart);
      saveState();
      render();
    }
    if (steal === "second" && chart.baseState.first) {
      const runnerId = chart.baseState.first;
      chart.baseState.first = "";
      chart.baseState.second = runnerId;
      updateRunnerDiamond(runnerId, "toSecond");
      syncCurrentBaseState(chart);
      getInningTotals().RISP = toNumber(getInningTotals().RISP) + 1;
      const runner = state.players.find((player) => player.id === runnerId);
      if (runner) runner.stats.SB = toNumber(runner.stats.SB) + 1;
      saveState();
      render();
    }
    if (steal === "third" && chart.baseState.second) {
      const runnerId = chart.baseState.second;
      chart.baseState.second = "";
      chart.baseState.third = runnerId;
      updateRunnerDiamond(runnerId, "toThird");
      syncCurrentBaseState(chart);
      const runner = state.players.find((player) => player.id === runnerId);
      if (runner) runner.stats.SB = toNumber(runner.stats.SB) + 1;
      saveState();
      render();
    }
  });

  els.inningCount.addEventListener("change", () => {
    activeGame().inningCount = Number(els.inningCount.value);
    saveState();
    render();
  });

  els.currentInning.addEventListener("change", () => {
    setChartInning(activeChart(), Number(els.currentInning.value));
    saveState();
    renderScorecard();
    renderInningTotals();
    renderDiamondLineScore();
    renderUpNextStrip();
  });

  if (els.upNextStrip) {
    els.upNextStrip.addEventListener("click", (event) => {
      const target = event.target.closest("button");
      if (!target) return;
      if (target.id === "nextAtBatButton") {
        advanceBatter();
        saveState();
        render();
      } else if (target.id === "prevAtBatButton") {
        rewindBatter();
        saveState();
        render();
      } else if (target.dataset.viewMode) {
        const chart = activeChart();
        chart.viewMode = target.dataset.viewMode === "all" ? "all" : "focused";
        saveState();
        render();
      } else if (target.id === "pinChartButton") {
        state.pinStatHud = !state.pinStatHud;
        saveState();
        render();
      } else if (target.id === "toggleFullChartButton") {
        els.fullScorecardPanel.hidden = !els.fullScorecardPanel.hidden;
        if (!els.fullScorecardPanel.hidden) renderFullScorecard();
        renderUpNextStrip();
      } else if (target.id === "toggleDefenseButton") {
        state.showDefensePopup = !state.showDefensePopup;
        renderDefensePopup();
        renderUpNextStrip();
      }
    });
  }

  els.prevInningButton.addEventListener("click", () => {
    const chart = activeChart();
    setChartInning(chart, Number(chart.currentInning || 1) - 1);
    saveState();
    render();
  });

  els.nextInningButton.addEventListener("click", () => {
    const chart = activeChart();
    setChartInning(chart, Number(chart.currentInning || 1) + 1);
    saveState();
    render();
  });

  els.pinChartButton?.addEventListener("click", () => {
    state.pinStatHud = !state.pinStatHud;
    saveState();
    renderSetup();
  });

  els.clearScorecardButton.addEventListener("click", () => {
    if (!confirm("Clear the full chart, live game log, pitch log, and live pitching totals?")) return;
    clearActiveChartData();
    saveState();
    render();
  });

  els.toggleFullChartButton?.addEventListener("click", () => {
    els.fullScorecardPanel.hidden = !els.fullScorecardPanel.hidden;
    els.toggleFullChartButton.textContent = els.fullScorecardPanel.hidden ? "Show Full Chart" : "Hide Full Chart";
    if (!els.fullScorecardPanel.hidden) renderFullScorecard();
  });

  els.fullScorecardPanel?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-full-chart]")) {
      els.fullScorecardPanel.hidden = true;
      renderUpNextStrip();
      return;
    }
    const toggleSide = event.target.closest("[data-line-score-toggle]")?.dataset.lineScoreToggle;
    if (toggleSide) {
      toggleLineScoreExpanded(toggleSide);
      return;
    }
    const side = event.target.closest("[data-full-chart-side]")?.dataset.fullChartSide;
    if (!side) return;
    state.fullChartSide = side;
    saveState();
    renderFullScorecard();
  });

  els.fullScorecardPanel?.addEventListener("change", (event) => {
    const fullChartAb = event.target.dataset.fullChartAb;
    if (!fullChartAb) return;
    const { slot, inning } = parseScoreCellKey(fullChartAb);
    const chart = activeGame().charts[state.fullChartSide || state.activeSide] || activeChart();
    setSelectedAbForSlotInning(slot - 1, inning, event.target.value, chart);
    saveState();
    renderFullScorecard();
  });

  els.defensePopupPanel?.addEventListener("click", (event) => {
    if (!event.target.closest("[data-close-defense-popup]")) return;
    state.showDefensePopup = false;
    renderDefensePopup();
    renderUpNextStrip();
  });

  [els.inningCompleteOverlay, els.inningEditBanner].forEach((container) => {
    container?.addEventListener("click", (event) => {
      const chart = activeChart();
      const confirmInning = event.target.closest("[data-confirm-inning]")?.dataset.confirmInning;
      const moveNextInning = event.target.closest("[data-move-next-inning]")?.dataset.moveNextInning;
      const continueEdit = event.target.closest("[data-continue-inning-edit]")?.dataset.continueInningEdit;
      const editCompleted = event.target.closest("[data-edit-completed-inning]")?.dataset.editCompletedInning;
      if (confirmInning) {
        syncInningBaseTotals(chart, confirmInning);
        chart.completedInnings[confirmInning] = true;
        delete chart.editingCompletedInnings[confirmInning];
      }
      if (moveNextInning) {
        syncInningBaseTotals(chart, moveNextInning);
        chart.completedInnings[moveNextInning] = true;
        delete chart.editingCompletedInnings[moveNextInning];
        if (Number(moveNextInning) < Number(activeGame().inningCount || 9)) {
          setChartInning(chart, Number(moveNextInning) + 1);
        }
      }
      if (continueEdit || editCompleted) {
        const inning = continueEdit || editCompleted;
        chart.editingCompletedInnings[inning] = true;
        delete chart.completedInnings[inning];
      }
      if (confirmInning || moveNextInning || continueEdit || editCompleted) {
        saveState();
        render();
      }
    });
  });

  els.scorecardGrid.addEventListener("input", (event) => {
    const cellEl = event.target.closest("[data-score-cell]");
    const field = event.target.dataset.scoreField;
    const selectAb = event.target.dataset.selectAb;
    const batterSubPlayer = event.target.dataset.subBatterPlayer;
    const batterSubText = event.target.dataset.subBatterText;
    const runnerSubPlayer = event.target.dataset.subRunnerPlayer;
    const runnerSubText = event.target.dataset.subRunnerText;
    const batterNote = event.target.dataset.batterNote;
    const pitcherUpdateCell = event.target.dataset.pitcherUpdate;
    const pitcherUpdateKey = event.target.dataset.pitcherUpdateKey;
    if (selectAb) {
      const { slot, inning } = parseScoreCellKey(selectAb);
      setSelectedAbForSlotInning(slot - 1, inning, event.target.value);
      saveState();
      renderScorecard();
      return;
    }
    if (batterNote !== undefined) {
      const chart = activeChart();
      chart.batterNotes = chart.batterNotes || {};
      chart.batterNotes[batterNote] = event.target.value;
      saveState();
      return;
    }
    if (pitcherUpdateCell && pitcherUpdateKey) {
      setCellPitcherUpdate(pitcherUpdateCell, pitcherUpdateKey, event.target.value);
      saveState();
      return;
    }
    if (batterSubPlayer !== undefined || batterSubText !== undefined || runnerSubPlayer !== undefined || runnerSubText !== undefined) {
      const slotIndex = batterSubPlayer ?? batterSubText ?? runnerSubPlayer ?? runnerSubText;
      const chart = activeChart();
      if (runnerSubPlayer !== undefined || runnerSubText !== undefined) {
        event.target.dataset.prevRunnerId = liveRunnerIdForSlot(Number(slotIndex), chart);
      }
      const sub = getSlotSubstitution(Number(slotIndex), chart);
      if (batterSubPlayer !== undefined) sub.batterPlayerId = event.target.value;
      if (batterSubText !== undefined) sub.batterText = cleanSubText(event.target.value);
      if (runnerSubPlayer !== undefined) sub.runnerPlayerId = event.target.value;
      if (runnerSubText !== undefined) sub.runnerText = cleanSubText(event.target.value);
      saveState();
      return;
    }
    if (!cellEl || !field) return;
    const cell = getScoreCellFromKey(cellEl.dataset.scoreCell);
    cell[field] = event.target.value;
    saveState();
  });

  els.scorecardGrid.addEventListener("change", async (event) => {
    const selectAb = event.target.dataset.selectAb;
    if (selectAb) {
      const { slot, inning } = parseScoreCellKey(selectAb);
      setSelectedAbForSlotInning(slot - 1, inning, event.target.value);
      saveState();
      renderScorecard();
      return;
    }
    const runnerEvent = event.target.dataset.runnerEvent;
    if (runnerEvent !== undefined) {
      const applied = await applyRunnerEvent(runnerEvent, event.target.value, event.target.dataset.runnerLane || "");
      if (applied) saveState();
      render();
      return;
    }
    const batterSubPlayer = event.target.dataset.subBatterPlayer;
    const batterSubText = event.target.dataset.subBatterText;
    const runnerSubPlayer = event.target.dataset.subRunnerPlayer;
    const runnerSubText = event.target.dataset.subRunnerText;
    if (batterSubPlayer !== undefined || batterSubText !== undefined || runnerSubPlayer !== undefined || runnerSubText !== undefined) {
      const slotIndex = Number(batterSubPlayer ?? batterSubText ?? runnerSubPlayer ?? runnerSubText);
      const chart = activeChart();
      const previousRunnerId = event.target.dataset.prevRunnerId || liveRunnerIdForSlot(slotIndex, chart);
      const sub = getSlotSubstitution(slotIndex, chart);
      if (batterSubPlayer !== undefined) sub.batterPlayerId = event.target.value;
      if (batterSubText !== undefined) sub.batterText = cleanSubText(event.target.value);
      if (runnerSubPlayer !== undefined) sub.runnerPlayerId = event.target.value;
      if (runnerSubText !== undefined) sub.runnerText = cleanSubText(event.target.value);
      if (runnerSubPlayer !== undefined || runnerSubText !== undefined) {
        const nextRunnerId = runnerIdAtSlot(slotIndex + 1);
        updateLiveRunnerAssignmentForSlot(slotIndex, previousRunnerId, nextRunnerId);
      }
      delete event.target.dataset.prevRunnerId;
      saveState();
      render();
      return;
    }
    const cellEl = event.target.closest("[data-score-cell]");
    const field = event.target.dataset.scoreField;
    if (!cellEl || field !== "notation") return;
    const cell = getScoreCellFromKey(cellEl.dataset.scoreCell);
    const typedNotation = event.target.value.trim();
    cell.notation = typedNotation;
    const actionKey = notationActionKey(typedNotation);
    if (actionKey && cell.actionKey !== actionKey) {
      if (actionKey === "BALK") {
        await addPitchToCell(cellEl.dataset.scoreCell, "balk");
        getScoreCellFromKey(cellEl.dataset.scoreCell).notation = typedNotation;
        saveState();
        render();
        return;
      }
      if (actionKey === "FC") {
        await applyFielderChoice(cellEl.dataset.scoreCell, typedNotation);
        saveState();
        render();
        return;
      }
      applyChartAction(cellEl.dataset.scoreCell, actionKey);
      getScoreCellFromKey(cellEl.dataset.scoreCell).notation = typedNotation;
      saveState();
      render();
      return;
    }
    saveState();
    render();
  });

  els.scorecardGrid.addEventListener("click", async (event) => {
    const baseTarget = event.target.closest("[data-base]");
    const base = baseTarget?.dataset.base;
    const clearKey = event.target.dataset.clearCell;
    const pitch = event.target.dataset.pitch;
    const undoPitch = event.target.dataset.undoPitch;
    const rbiValue = event.target.dataset.rbi;
    const chartAction = event.target.dataset.chartAction;
    const addAbFor = event.target.closest("[data-add-ab-for]")?.dataset.addAbFor;
    const removeAb = event.target.dataset.removeAb;
    const runnerAdvanceKey = event.target.closest("[data-runner-advance]")?.dataset.runnerAdvance;
    const runnerScoreKey = event.target.closest("[data-runner-score]")?.dataset.runnerScore;
    const runnerOutKey = event.target.closest("[data-runner-out]")?.dataset.runnerOut;
    const stealCellKey = event.target.closest("[data-steal-cell]")?.dataset.stealCell;
    const stealTerminal = event.target.closest("[data-steal-cell]")?.dataset.stealTerminal;
    const csCellKey = event.target.closest("[data-cs-cell]")?.dataset.csCell;
    const csTerminal = event.target.closest("[data-cs-cell]")?.dataset.csTerminal;
    const pickCellKey = event.target.closest("[data-pick-cell]")?.dataset.pickCell;
    const pickTerminal = event.target.closest("[data-pick-cell]")?.dataset.pickTerminal;
    const riCellKey = event.target.closest("[data-ri-cell]")?.dataset.riCell;
    const riTerminal = event.target.closest("[data-ri-cell]")?.dataset.riTerminal;
    const wpCellKey = event.target.closest("[data-wp-cell]")?.dataset.wpCell;
    const focusSlot = event.target.closest("[data-focus-slot]")?.dataset.focusSlot;
    if (focusSlot) {
      const chart = activeChart();
      chart.currentSlot = Number(focusSlot);
      ensureActiveCellExists();
      saveState();
      render();
      return;
    }
    if (base) {
      const cellEl = event.target.closest("[data-score-cell]");
      const cell = getScoreCellFromKey(cellEl.dataset.scoreCell);
      const oldTerminal = activeDiamondTerminal(cell.bases);
      const clickedIndex = diamondBaseOrder.indexOf(base);
      const oldIndex = diamondBaseOrder.indexOf(oldTerminal);
      const newTerminal = clickedIndex === oldIndex ? diamondBaseOrder[clickedIndex - 1] || "" : base;
      applyTerminalChange(cellEl.dataset.scoreCell, newTerminal);
      saveState();
      render();
    }
    if (runnerAdvanceKey) {
      const cell = getScoreCellFromKey(runnerAdvanceKey);
      const oldTerminal = activeDiamondTerminal(cell.bases);
      const next = nextTerminalFrom(oldTerminal);
      applyTerminalChange(runnerAdvanceKey, next);
      saveState();
      render();
    }
    if (runnerScoreKey) {
      applyTerminalChange(runnerScoreKey, "toHome");
      saveState();
      render();
    }
    if (runnerOutKey) {
      const cell = getScoreCellFromKey(runnerOutKey);
      clearRunnerOutcome(cell);
      applyTerminalChange(runnerOutKey, "");
      cell.outOverlay = true;
      cell.runnerNote = "OUT";
      addRunnerPitcherOut(cell);
      saveState();
      render();
    }
    if (stealCellKey && stealTerminal) {
      applyTerminalChange(stealCellKey, stealTerminal);
      const cell = getScoreCellFromKey(stealCellKey);
      clearRunnerOutcome(cell);
      const { slot } = parseScoreCellKey(stealCellKey);
      const runnerId = cell.runnerId || runnerIdAtSlot(slot);
      if (runnerId && stealTerminal !== "toFirst") addRunnerStatDelta(cell, runnerId, "SB", 1);
      cell.runnerNote = terminalEventLabel("SB", stealTerminal);
      saveState();
      render();
    }
    if (csCellKey && csTerminal) {
      const chart = activeChart();
      const cell = getScoreCellFromKey(csCellKey);
      const sequence = await promptThrowSequence("Caught stealing", defaultCsSequence(csTerminal));
      const { slot } = parseScoreCellKey(csCellKey);
      const runnerId = cell.runnerId || runnerIdAtSlot(slot);
      clearRunnerOutcome(cell);
      if (!cell.baseStateBefore) cell.baseStateBefore = { ...chart.baseState };
      cell.bases = diamondPathThrough(csTerminal);
      if (runnerId) {
        setBatterBaseState(chart, runnerId, "");
        addRunnerStatDelta(cell, runnerId, "CS", 1);
      }
      cell.outOverlay = true;
      addRunnerPitcherOut(cell);
      cell.runnerNote = `CS ${sequence}`;
      if (!cell.notation && !cell.result) cell.notation = `CS ${sequence}`;
      saveState();
      render();
    }
    if (pickCellKey && pickTerminal) {
      const chart = activeChart();
      const cell = getScoreCellFromKey(pickCellKey);
      const sequence = await promptThrowSequence("Pickoff", defaultPickSequence(pickTerminal));
      const { slot } = parseScoreCellKey(pickCellKey);
      const runnerId = cell.runnerId || runnerIdAtSlot(slot);
      clearRunnerOutcome(cell);
      if (!cell.baseStateBefore) cell.baseStateBefore = { ...chart.baseState };
      cell.bases = diamondPathThrough(pickTerminal);
      if (runnerId) setBatterBaseState(chart, runnerId, "");
      cell.outOverlay = true;
      addRunnerPitcherOut(cell);
      cell.runnerNote = `PO ${sequence}`;
      if (!cell.notation && !cell.result) cell.notation = `PO ${sequence}`;
      saveState();
      render();
    }
    if (riCellKey && riTerminal) {
      const chart = activeChart();
      const cell = getScoreCellFromKey(riCellKey);
      const { slot } = parseScoreCellKey(riCellKey);
      const runnerId = cell.runnerId || runnerIdAtSlot(slot);
      clearRunnerOutcome(cell);
      if (!cell.baseStateBefore) cell.baseStateBefore = { ...chart.baseState };
      cell.bases = diamondPathThrough(riTerminal);
      if (runnerId) setBatterBaseState(chart, runnerId, "");
      cell.outOverlay = true;
      addRunnerPitcherOut(cell);
      cell.runnerNote = "RI";
      if (!cell.notation && !cell.result) cell.notation = "RI";
      saveState();
      render();
    }
    if (wpCellKey) {
      const cell = getScoreCellFromKey(wpCellKey);
      clearRunnerOutcome(cell);
      applyTerminalChange(wpCellKey, "toHome");
      addRunnerPitcherDelta(cell, { WP: 1 });
      cell.runnerNote = "WP";
      if (!cell.notation && !cell.result) cell.notation = "WP";
      saveState();
      render();
    }
    if (addAbFor) {
      const { slot, inning } = parseScoreCellKey(addAbFor);
      addExtraAbForSlotInning(slot - 1, inning);
      saveState();
      renderScorecard();
    }
    if (rbiValue !== undefined) {
      const cellEl = event.target.closest("[data-score-cell]");
      const cell = getScoreCellFromKey(cellEl.dataset.scoreCell);
      const nextValue = Number(rbiValue);
      setCellRbi(cellEl.dataset.scoreCell, toNumber(cell.rbi) === nextValue ? 0 : nextValue);
      saveState();
      render();
    }
    if (removeAb) {
      removeExtraAtBat(removeAb);
      saveState();
      render();
    }
    if (pitch) {
      const cellEl = event.target.closest("[data-score-cell]");
      await addPitchToCell(cellEl.dataset.scoreCell, pitch);
      saveState();
      render();
    }
    if (undoPitch) {
      undoLastPitchForCell(undoPitch);
      saveState();
      render();
    }
    if (chartAction) {
      const cellEl = event.target.closest("[data-score-cell]");
      if (chartAction === "FC") await applyFielderChoice(cellEl.dataset.scoreCell);
      else applyChartAction(cellEl.dataset.scoreCell, chartAction);
      saveState();
      render();
    }
    if (clearKey) {
      reverseChartCell(clearKey);
      delete activeChart().scorecard[clearKey];
      saveState();
      render();
    }
  });

  els.lineupSlots.addEventListener("input", (event) => {
    const chart = activeChart();
    const lineupIndex = event.target.dataset.lineupIndex;
    const posIndex = event.target.dataset.lineupPos;
    if (lineupIndex !== undefined) chart.lineup[Number(lineupIndex)] = event.target.value;
    if (posIndex !== undefined) {
      chart.lineupPositions = chart.lineupPositions || Array.from({ length: 9 }, () => "");
      chart.lineupPositions[Number(posIndex)] = event.target.value;
    }
    saveState();
    renderScorecard();
    renderDefense();
    renderDefensePopup();
  });

  els.lineupSlots.addEventListener("click", (event) => {
    const index = event.target.dataset.moveLineup;
    if (index === undefined) return;
    const chart = activeChart();
    const from = Number(index);
    const to = from + Number(event.target.dataset.direction);
    if (to < 0 || to >= chart.lineup.length) return;
    [chart.lineup[from], chart.lineup[to]] = [chart.lineup[to], chart.lineup[from]];
    [chart.lineupPositions[from], chart.lineupPositions[to]] = [chart.lineupPositions[to], chart.lineupPositions[from]];
    saveState();
    render();
  });

  els.spotlightSelect.addEventListener("change", renderSpotlight);
  els.playerSearch?.addEventListener("input", renderPlayerTable);
  els.playerForm.addEventListener("submit", savePlayerFromForm);
  els.newPlayerButton.addEventListener("click", () => {
    closePlayerEditModal();
    fillPlayerForm(null);
  });
  els.prevPlayerButton?.addEventListener("click", () => cycleRosterEditPlayer(-1));
  els.nextPlayerButton?.addEventListener("click", () => cycleRosterEditPlayer(1));
  els.closePlayerModalButton?.addEventListener("click", () => closePlayerEditModal());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && rosterEditModalOpen) closePlayerEditModal();
    if (event.key === "Escape") closeStatExplanation();
    if (event.key === "Escape") closeHudContextPopover();
    const statExplain = event.target.closest?.("[data-stat-explain]");
    if (statExplain && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      toggleStatExplanation(statExplain);
    }
  });

  document.body.addEventListener("click", (event) => {
    if (!event.target.closest("[data-stat-explain]") && !event.target.closest("#statExplanationPopover")) {
      closeStatExplanation();
    }
    if (!event.target.closest("[data-hud-context]") && !event.target.closest("#hudContextPopover")) {
      closeHudContextPopover();
    }
    const editId = event.target.dataset.editPlayer;
    const deleteId = event.target.dataset.deletePlayer;
    const deleteEventId = event.target.dataset.deleteEvent;

    if (editId) {
      openPlayerEditModal(editId);
    }

    if (deleteId && confirm("Delete this player?")) {
      state.players = state.players.filter((player) => player.id !== deleteId);
      state.games.forEach((entry) => {
        Object.values(entry.charts).forEach((chart) => {
          chart.lineup = chart.lineup.map((id) => id === deleteId ? "" : id);
          Object.keys(chart.hud?.defense || {}).forEach((pos) => {
            if (chart.hud.defense[pos] === deleteId) chart.hud.defense[pos] = "";
          });
          if (chart.activePitcherId === deleteId) chart.activePitcherId = "";
          if (chart.startingPitcherId === deleteId) chart.startingPitcherId = "";
          chart.bullpenIds = (chart.bullpenIds || []).filter((id) => id !== deleteId);
        });
      });
      saveState();
      render();
    }

    if (deleteEventId) {
      const eventToRemove = state.events.find((item) => item.id === deleteEventId);
      if (eventToRemove) applyEvent(eventToRemove, -1);
      state.events = state.events.filter((item) => item.id !== deleteEventId);
      saveState();
      render();
    }
  });

  els.eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!els.eventPlayer.value) return;
    const gameType = activeGameType();
    const gameEvent = {
      id: uid("event"),
      playerId: els.eventPlayer.value,
      pitcherId: activeChart().activePitcherId,
      gameId: activeGame().id,
      gameType,
      result: document.querySelector("#eventResult").value,
      rbi: toNumber(document.querySelector("#eventRbi").value),
      sb: toNumber(document.querySelector("#eventSb").value),
      cs: toNumber(document.querySelector("#eventCs").value),
      context: document.querySelector("#eventContext").value.trim(),
      createdAt: new Date().toISOString()
    };
    applyEvent(gameEvent, 1);
    state.events.unshift(gameEvent);
    document.querySelector("#eventRbi").value = 0;
    document.querySelector("#eventSb").value = 0;
    document.querySelector("#eventCs").value = 0;
    document.querySelector("#eventContext").value = "";
    saveState();
    render();
  });

  els.clearEventsButton.addEventListener("click", () => {
    if (!confirm("Clear this game's events and reverse their stat changes?")) return;
    const gameId = activeGame().id;
    state.events.forEach((event) => {
      if (eventBelongsToGame(event, gameId)) applyEvent(event, -1);
    });
    state.events = state.events.filter((event) => !eventBelongsToGame(event, gameId));
    saveState();
    render();
  });
}

function populateNotationDatalist() {
  const datalist = document.querySelector("#notation-suggestions");
  if (!datalist) return;
  datalist.innerHTML = notationSuggestions
    .map((token) => `<option value="${escapeHtml(token)}"></option>`)
    .join("");
}

let appEventsWired = false;

function bootApp() {
  normalizeState();
  populateNotationDatalist();
  if (!appEventsWired) {
    setupEvents();
    appEventsWired = true;
  }
  render();
}

async function recoverIndexedDbState() {
  const record = await readStateFromIndexedDb();
  if (!record?.serialized) return false;
  const indexedSavedAt = toNumber(record.savedAt);
  if (indexedSavedAt <= localStateSavedAt()) return false;

  let recoveredState;
  try {
    recoveredState = JSON.parse(record.serialized);
  } catch (error) {
    console.warn("IndexedDB state backup could not be parsed:", error?.message || error);
    return false;
  }
  if (!recoveredState || typeof recoveredState !== "object" || !Array.isArray(recoveredState.games)) return false;

  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, recoveredState);
  persistStateSnapshot(record.serialized, indexedSavedAt || Date.now());
  bootApp();
  setCloudSyncStatus("Recovered local workspace");
  schedulePushState();
  return true;
}

// ---------------- Supabase auth + sync ----------------

const authEls = {
  overlay: document.querySelector("#authOverlay"),
  emailForm: document.querySelector("#authEmailForm"),
  email: document.querySelector("#authEmail"),
  emailSubmit: document.querySelector("#authEmailSubmit"),
  codeForm: document.querySelector("#authCodeForm"),
  code: document.querySelector("#authCode"),
  codeSubmit: document.querySelector("#authCodeSubmit"),
  codeBack: document.querySelector("#authCodeBack"),
  codeEmailEcho: document.querySelector("#authCodeEmailEcho"),
  message: document.querySelector("#authMessage"),
  cloudStatus: document.querySelector("#cloudSyncStatus"),
  cloudEmail: document.querySelector("#cloudSyncEmail"),
  signOut: document.querySelector("#cloudSignOutButton"),
  syncActions: document.querySelector("#cloudSyncActions"),
  push: document.querySelector("#cloudPushButton"),
  pull: document.querySelector("#cloudPullButton"),
};

function setAuthMessage(text, kind = "info") {
  if (!authEls.message) return;
  authEls.message.textContent = text || "";
  authEls.message.dataset.kind = kind;
}

function showAuthOverlayLegacy() {
  if (!authEls.overlay) return;
  authEls.overlay.removeAttribute("aria-hidden");
  authEls.overlay.classList.add("is-shown");
  document.body.classList.add("auth-locked");
}

function hideAuthOverlayLegacy() {
  if (!authEls.overlay) return;
  authEls.overlay.setAttribute("aria-hidden", "true");
  authEls.overlay.classList.remove("is-shown");
  document.body.classList.remove("auth-locked");
}

function setCloudSyncStatus(text) {
  if (authEls.cloudStatus) authEls.cloudStatus.textContent = text;
}

function setCloudSyncEmailLegacy(email) {
  if (authEls.cloudEmail) authEls.cloudEmail.innerHTML = `Signed in as <strong>${escapeHtml(email || "—")}</strong>`;
}

function setCloudSyncEmail(email) {
  if (authEls.cloudEmail) {
    authEls.cloudEmail.innerHTML = email
      ? `Signed in as <strong>${escapeHtml(email)}</strong>`
      : "Not signed in";
  }
}

function renderCloudSyncUi() {
  const signedIn = Boolean(supabaseSession?.user);
  if (authEls.emailForm) authEls.emailForm.hidden = signedIn;
  if (authEls.codeForm) authEls.codeForm.hidden = true;
  if (authEls.syncActions) authEls.syncActions.hidden = !signedIn;
  if (!signedIn) setCloudSyncEmail("");
}

function wireAuthForms() {
  if (!supabaseClient || !authEls.emailForm) return;

  authEls.emailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = authEls.email.value.trim().toLowerCase();
    if (!email) return;
    authEls.emailSubmit.disabled = true;
    setAuthMessage("Sending code…");
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    authEls.emailSubmit.disabled = false;
    if (error) {
      setAuthMessage(error.message || "Could not send code.", "error");
      return;
    }
    authEls.codeEmailEcho.textContent = email;
    authEls.emailForm.hidden = true;
    authEls.codeForm.hidden = false;
    authEls.code.value = "";
    authEls.code.focus();
    setAuthMessage("Check your inbox for an 8-digit code.");
  });

  authEls.codeBack.addEventListener("click", () => {
    authEls.codeForm.hidden = true;
    authEls.emailForm.hidden = false;
    authEls.email.focus();
    setAuthMessage("");
  });

  authEls.codeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = authEls.codeEmailEcho.textContent;
    const token = authEls.code.value.trim();
    if (!email || !token) return;
    authEls.codeSubmit.disabled = true;
    setAuthMessage("Verifying…");
    const { data, error } = await supabaseClient.auth.verifyOtp({ email, token, type: "email" });
    authEls.codeSubmit.disabled = false;
    if (error || !data?.session) {
      setAuthMessage(error?.message || "Invalid code.", "error");
      return;
    }
    setAuthMessage("Signed in!");
    onSignedIn(data.session);
  });

  if (authEls.signOut) {
    authEls.signOut.addEventListener("click", async () => {
      if (!supabaseClient) return;
      await supabaseClient.auth.signOut();
    });
  }
  if (authEls.push) {
    authEls.push.addEventListener("click", async () => {
      await pushStateNow({ force: true, userInitiated: true });
    });
  }
  if (authEls.pull) {
    authEls.pull.addEventListener("click", async () => {
      await pullCloudState({ confirmReplace: true });
    });
  }
}

let signedInUserId = "";
let signedInLoadStarted = false;

async function onSignedInLegacy(session) {
  const userId = session?.user?.id;
  if (!userId) return;
  if (signedInLoadStarted && signedInUserId === userId) return;
  signedInUserId = userId;
  signedInLoadStarted = true;
  supabaseSession = session;
  lastPushedSerialized = JSON.stringify(state);
  setCloudSyncEmail(session.user.email || session.user.id);
  setCloudSyncStatus("Loading…");

  const { data: row, error } = await supabaseClient
    .from("app_state")
    .select("state, last_client_id, updated_at")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    console.warn("Could not load remote state:", error.message);
    setCloudSyncStatus("Offline (local only)");
  }

  if (row && row.state && Object.keys(row.state).length > 0) {
    applyRemoteState(row.state, row.updated_at);
    setCloudSyncStatus("Synced");
  } else {
    bootApp();
    if (Object.keys(state).length) {
      await pushStateNow();
      setCloudSyncStatus("Synced");
    } else {
      setCloudSyncStatus("Synced");
    }
  }

  subscribeRealtime();
  hideAuthOverlay();
}

function formatCloudTime(value) {
  if (!value) return "available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "available";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

async function onSignedIn(session) {
  const userId = session?.user?.id;
  if (!userId) return;
  if (signedInLoadStarted && signedInUserId === userId) return;
  signedInUserId = userId;
  signedInLoadStarted = true;
  supabaseSession = session;
  setCloudSyncEmail(session.user.email || session.user.id);
  renderCloudSyncUi();
  setCloudSyncStatus("Checking cloud");

  const { data: row, error } = await supabaseClient
    .from("app_state")
    .select("state, last_client_id, updated_at")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    console.warn("Could not load remote state:", error.message);
    setCloudSyncStatus("Offline (local only)");
    return;
  }

  if (row && row.state && Object.keys(row.state).length > 0) {
    lastSyncedAt = row.updated_at ? new Date(row.updated_at).getTime() : Date.now();
    setCloudSyncStatus(`Connected; cloud save ${formatCloudTime(row.updated_at)}`);
  } else {
    setCloudSyncStatus("Connected; no cloud save yet");
  }

  subscribeRealtime();
}

function applyRemoteState(remote, updatedAt) {
  Object.keys(state).forEach((k) => delete state[k]);
  Object.assign(state, remote);
  lastPushedSerialized = JSON.stringify(state);
  lastSyncedAt = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  persistStateSnapshot(lastPushedSerialized, lastSyncedAt);
  bootApp();
}

async function fetchCloudState() {
  if (!supabaseClient || !supabaseSession) return { row: null, error: null };
  const { data: row, error } = await supabaseClient
    .from("app_state")
    .select("state, last_client_id, updated_at")
    .eq("user_id", supabaseSession.user.id)
    .maybeSingle();
  return { row, error };
}

async function pullCloudState({ confirmReplace = false } = {}) {
  if (!supabaseClient || !supabaseSession) {
    setCloudSyncStatus("Sign in to pull cloud");
    return false;
  }
  const ok = !confirmReplace || confirm("Pull cloud state and replace this device's local workspace?");
  if (!ok) return false;
  setCloudSyncStatus("Pulling cloud");
  const { row, error } = await fetchCloudState();
  if (error) {
    console.warn("Pull failed:", error.message);
    setCloudSyncStatus("Pull failed");
    return false;
  }
  if (!row?.state || !Object.keys(row.state).length) {
    setCloudSyncStatus("No cloud save found");
    return false;
  }
  applyRemoteState(row.state, row.updated_at);
  setCloudSyncStatus(`Pulled cloud ${formatCloudTime(row.updated_at)}`);
  return true;
}

function schedulePushState() {
  if (!supabaseClient || !supabaseSession) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { pushStateNow(); }, 1500);
}

async function pushStateNowLegacy() {
  if (!supabaseClient || !supabaseSession) return;
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  const serialized = JSON.stringify(state);
  if (serialized === lastPushedSerialized) return;
  setCloudSyncStatus("Saving…");
  const { error } = await supabaseClient
    .from("app_state")
    .upsert({
      user_id: supabaseSession.user.id,
      state,
      last_client_id: CLIENT_ID,
      updated_at: new Date().toISOString(),
    });
  if (error) {
    console.warn("Push failed:", error.message);
    setCloudSyncStatus("Offline (will retry)");
    return;
  }
  lastPushedSerialized = serialized;
  lastSyncedAt = Date.now();
  setCloudSyncStatus(`Synced ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
}

async function pushStateNow({ force = false, userInitiated = false } = {}) {
  if (!supabaseClient || !supabaseSession) {
    if (userInitiated) setCloudSyncStatus("Sign in to push cloud");
    return false;
  }
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  const serialized = JSON.stringify(state);
  if (!force && serialized === lastPushedSerialized) {
    if (userInitiated) setCloudSyncStatus("Cloud already current");
    return true;
  }
  setCloudSyncStatus("Saving");
  const { error } = await supabaseClient
    .from("app_state")
    .upsert({
      user_id: supabaseSession.user.id,
      state,
      last_client_id: CLIENT_ID,
      updated_at: new Date().toISOString(),
    });
  if (error) {
    console.warn("Push failed:", error.message);
    setCloudSyncStatus("Push failed");
    return false;
  }
  lastPushedSerialized = serialized;
  lastSyncedAt = Date.now();
  setCloudSyncStatus(`Pushed ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
  return true;
}

function flushPendingStatePush() {
  if (!supabaseClient || !supabaseSession) return;
  if (JSON.stringify(state) === lastPushedSerialized) return;
  pushStateNow().catch((error) => {
    console.warn("Final push failed:", error?.message || error);
  });
}

function subscribeRealtime() {
  if (!supabaseClient || !supabaseSession) return;
  if (realtimeChannel) {
    supabaseClient.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
  realtimeChannel = supabaseClient
    .channel(`app_state:${supabaseSession.user.id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "app_state",
        filter: `user_id=eq.${supabaseSession.user.id}`,
      },
      (payload) => {
        const next = payload.new;
        if (!next) return;
        if (next.last_client_id === CLIENT_ID) return;
        if (next.updated_at && new Date(next.updated_at).getTime() <= lastSyncedAt) return;
        lastSyncedAt = next.updated_at ? new Date(next.updated_at).getTime() : Date.now();
        setCloudSyncStatus(`Cloud update available ${formatCloudTime(next.updated_at)}`);
      }
    )
    .subscribe();
}

// ---------------- Service worker ----------------

const checkUpdatesButton = document.querySelector("#checkUpdatesButton");
const appVersionLabel = document.querySelector("#appVersionLabel");

if (appVersionLabel) appVersionLabel.textContent = APP_VERSION;

async function hardCheckForUpdates() {
  if (!("serviceWorker" in navigator)) {
    window.location.reload();
    return;
  }
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (_) { /* ignore */ }
  window.location.reload();
}

if (checkUpdatesButton) checkUpdatesButton.addEventListener("click", hardCheckForUpdates);

window.addEventListener("pagehide", flushPendingStatePush);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushPendingStatePush();
});

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((registration) => {
      setInterval(() => { registration.update().catch(() => {}); }, 60 * 1000);
    }).catch(() => {});

    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });
  });
}

// ---------------- Boot gate ----------------

function showAuthOverlay() {}
function hideAuthOverlay() {}

renderCloudSyncUi();
setCloudSyncStatus(supabaseClient ? "Local first" : "Local only");
bootApp();
recoverIndexedDbState().catch((error) => {
  console.warn("Workspace backup recovery failed:", error?.message || error);
});
if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => {
    if (!data?.session && !supabaseSession) setCloudSyncStatus("Local only");
  });
}

if (!supabaseClient) {
  console.warn("Supabase SDK or config missing — running in local-only mode.");
  setCloudSyncStatus("Local only");
  bootApp();
} else {
  wireAuthForms();
  showAuthOverlay();
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data?.session) onSignedIn(data.session);
  });
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) onSignedIn(session);
    if (event === "SIGNED_OUT") {
      supabaseSession = null;
      signedInUserId = "";
      signedInLoadStarted = false;
      if (realtimeChannel) { supabaseClient.removeChannel(realtimeChannel); realtimeChannel = null; }
      showAuthOverlay();
      setCloudSyncEmail("");
      setCloudSyncStatus("Signed out");
    }
  });
}
