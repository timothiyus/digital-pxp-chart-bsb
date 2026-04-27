const STORAGE_KEY = "pxp-baseball-chart-v1";

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
  IP: 0,
  ERA: 0,
  WHIP: 0,
  W: 0,
  L: 0,
  GS: 0,
  BF: 0,
  BAA: 0,
  Pitches: 0,
  Strikes: 0
});

const state = loadState();

function emptyBaseState() {
  return { first: "", second: "", third: "" };
}

const els = {
  appShell: document.querySelector("#appShell"),
  collapseSetupButton: document.querySelector("#collapseSetupButton"),
  csvInput: document.querySelector("#csvInput"),
  pdfInput: document.querySelector("#pdfInput"),
  exportButton: document.querySelector("#exportButton"),
  resetButton: document.querySelector("#resetButton"),
  saveState: document.querySelector("#saveState"),
  teamName: document.querySelector("#teamName"),
  opponentName: document.querySelector("#opponentName"),
  gameDate: document.querySelector("#gameDate"),
  gameNotes: document.querySelector("#gameNotes"),
  showAtBatControls: document.querySelector("#showAtBatControls"),
  showFocusControls: document.querySelector("#showFocusControls"),
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
  lineupSlots: document.querySelector("#lineupSlots"),
  autoLineupButton: document.querySelector("#autoLineupButton"),
  spotlightSelect: document.querySelector("#spotlightSelect"),
  spotlightCard: document.querySelector("#spotlightCard"),
  playerSearch: document.querySelector("#playerSearch"),
  playerTable: document.querySelector("#playerTable"),
  playerForm: document.querySelector("#playerForm"),
  newPlayerButton: document.querySelector("#newPlayerButton"),
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
  boxScorePdfInput: document.querySelector("#boxScorePdfInput"),
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

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    game: {
      teamName: "Garden City CC",
      opponentName: "",
      gameDate: new Date().toISOString().slice(0, 10),
      notes: ""
    },
    activeSide: "home",
    settings: {
      showAtBatControls: false,
      showFocusControls: false
    },
    players: [],
    events: [],
    inningCount: 9,
    charts: {
      home: newChartState(),
      away: newChartState()
    },
    sources: [],
    boxScores: []
  };
}

function newChartState() {
  return {
    lineup: Array.from({ length: 9 }, () => ""),
    lineupPositions: Array.from({ length: 9 }, () => ""),
    scorecard: {},
    substitutions: {},
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

function normalizeState() {
  state.activeSide = state.activeSide || "home";
  state.inningCount = state.inningCount || 9;
  if (!state.charts) {
    state.charts = {
      home: {
        ...newChartState(),
        lineup: state.lineup || Array.from({ length: 9 }, () => ""),
        lineupPositions: state.lineupPositions || Array.from({ length: 9 }, () => ""),
        scorecard: state.scorecard || {}
      },
      away: newChartState()
    };
    delete state.lineup;
    delete state.lineupPositions;
    delete state.scorecard;
  }
  state.charts.home = { ...newChartState(), ...state.charts.home };
  state.charts.away = { ...newChartState(), ...state.charts.away };
  Object.values(state.charts).forEach((chart) => {
    chart.substitutions = chart.substitutions || {};
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
  state.sources = state.sources || [];
  state.boxScores = state.boxScores || [];
  state.events = state.events || [];
  state.fullChartSide = state.fullChartSide || state.activeSide || "home";
  state.settings = {
    showAtBatControls: false,
    showFocusControls: false,
    ...(state.settings || {})
  };
  state.pinStatHud = state.pinStatHud ?? Boolean(state.pinScorecard);
  state.players = state.players || [];
  state.players.forEach((player) => {
    player.side = player.side || "home";
    player.hometown = player.hometown || "";
    player.height = player.height || "";
    player.weight = player.weight || "";
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  els.saveState.textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function toNumber(value) {
  if (value === undefined || value === null || value === "" || value === "-") return 0;
  const normalized = String(value).replace("%", "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatRate(value) {
  if (!Number.isFinite(value)) return ".000";
  const fixed = value.toFixed(3);
  return fixed.startsWith("0") ? fixed.slice(1) : fixed;
}

function activeChart() {
  return state.charts[state.activeSide];
}

function activePlayers() {
  return state.players.filter((player) => (player.side || "home") === state.activeSide);
}

function activeSideName() {
  return state.activeSide === "home" ? (state.game.teamName || "My Team") : (state.game.opponentName || "Opponent");
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

function calcStats(stats) {
  const singles = Math.max(0, stats.H - stats["2B"] - stats["3B"] - stats.HR);
  const totalBases = singles + stats["2B"] * 2 + stats["3B"] * 3 + stats.HR * 4;
  const obpDenom = stats.AB + stats.BB + stats.HBP + stats.SF;
  const avg = stats.AB ? stats.H / stats.AB : 0;
  const obp = obpDenom ? (stats.H + stats.BB + stats.HBP) / obpDenom : 0;
  const slg = stats.AB ? totalBases / stats.AB : 0;
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
  const paDenom = stats.AB + stats.BB + stats.HBP + stats.SF;
  const iso = (toNumber(rates.SLG) - toNumber(rates.AVG)).toFixed(3).replace(/^0/, "");
  const bbPct = paDenom ? `${((stats.BB / paDenom) * 100).toFixed(1)}%` : "--";
  const kPct = paDenom ? `${((stats.SO / paDenom) * 100).toFixed(1)}%` : "--";
  const babipDenom = stats.AB - stats.SO - stats.HR + stats.SF;
  const babip = babipDenom > 0 ? formatRate((stats.H - stats.HR) / babipDenom) : ".000";
  const xbh = stats["2B"] + stats["3B"] + stats.HR;
  return { ...rates, ISO: iso, BBP: bbPct, KP: kPct, BABIP: babip, XBH: xbh };
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

function headerIndex(headers, name, occurrence = 1) {
  let seen = 0;
  for (let i = 0; i < headers.length; i += 1) {
    if (headers[i] === name) {
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

function importPlayersFromCsv(text, filename) {
  const rows = parseCsv(text);
  const headerRowIndex = rows.findIndex((row) => row.includes("Number") && row.includes("Last") && row.includes("First"));
  if (headerRowIndex < 0) {
    throw new Error("Could not find a roster/stat header row with Number, Last, and First columns.");
  }

  const headers = rows[headerRowIndex].map((header) => header.trim());
  const imported = [];

  rows.slice(headerRowIndex + 1).forEach((row) => {
    const number = valueFrom(row, headers, "Number").trim();
    const last = valueFrom(row, headers, "Last").trim();
    const first = valueFrom(row, headers, "First").trim();
    if (!number && !last && !first) return;

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
      stats: {
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
        IP: toNumber(valueFrom(row, headers, "IP")),
        GS: toNumber(valueFrom(row, headers, "GS")),
        BF: toNumber(valueFrom(row, headers, "BF")),
        W: toNumber(valueFrom(row, headers, "W")),
        L: toNumber(valueFrom(row, headers, "L")),
        Pitches: toNumber(valueFrom(row, headers, "#P")),
        Strikes: toNumber(valueFrom(row, headers, "S%", 1)),
        ERA: toNumber(valueFrom(row, headers, "ERA")),
        WHIP: toNumber(valueFrom(row, headers, "WHIP")),
        BAA: toNumber(valueFrom(row, headers, "BAA")),
        P_HR: toNumber(valueFrom(row, headers, "HR", 2)),
        P_BB: toNumber(valueFrom(row, headers, "BB", 2)),
        P_SO: toNumber(valueFrom(row, headers, "SO", 2)),
        P_H: toNumber(valueFrom(row, headers, "H", 2)),
        P_R: toNumber(valueFrom(row, headers, "R", 2)),
        P_ER: toNumber(valueFrom(row, headers, "ER"))
      }
    });
  });

  const byKey = new Map(state.players.map((player) => [`${player.side || "home"}-${player.number}-${player.first}-${player.last}`.toLowerCase(), player]));
  imported.forEach((player) => {
    const key = `${player.side}-${player.number}-${player.first}-${player.last}`.toLowerCase();
    if (byKey.has(key)) {
      Object.assign(byKey.get(key), {
        ...player,
        id: byKey.get(key).id,
        pronunciation: byKey.get(key).pronunciation || "",
        hometown: byKey.get(key).hometown || player.hometown || "",
        position: byKey.get(key).position || "",
        classYear: byKey.get(key).classYear || "",
        height: byKey.get(key).height || player.height || "",
        weight: byKey.get(key).weight || player.weight || "",
        notes: byKey.get(key).notes || ""
      });
    } else {
      state.players.push(player);
    }
  });

  state.sources.unshift({
    id: uid("source"),
    type: "csv",
    name: filename,
    importedAt: new Date().toISOString(),
    detail: `${imported.length} player rows`
  });

  if (!activeChart().lineup.some(Boolean)) autoFillLineup();
  saveState();
  render();
}

function importBoxScoreFromCsv(text, filename, meta = {}) {
  const rows = parseCsv(text);
  const headerRowIndex = rows.findIndex((row) => row.includes("Number") && row.includes("Last") && row.includes("First"));
  if (headerRowIndex < 0) {
    throw new Error("Could not find a header row with Number, Last, and First columns.");
  }
  const headers = rows[headerRowIndex].map((header) => header.trim());
  const lines = [];

  rows.slice(headerRowIndex + 1).forEach((row) => {
    const number = valueFrom(row, headers, "Number").trim();
    const last = valueFrom(row, headers, "Last").trim();
    const first = valueFrom(row, headers, "First").trim();
    if (!number && !last && !first) return;

    const matchKey = `${state.activeSide}-${number}-${first}-${last}`.toLowerCase();
    const existing = state.players.find((p) => `${p.side || "home"}-${p.number}-${p.first}-${p.last}`.toLowerCase() === matchKey);

    lines.push({
      playerId: existing ? existing.id : "",
      number,
      first,
      last,
      AB: toNumber(valueFrom(row, headers, "AB")),
      H: toNumber(valueFrom(row, headers, "H", 1)),
      "2B": toNumber(valueFrom(row, headers, "2B")),
      "3B": toNumber(valueFrom(row, headers, "3B")),
      HR: toNumber(valueFrom(row, headers, "HR", 1)),
      BB: toNumber(valueFrom(row, headers, "BB", 1)),
      SO: toNumber(valueFrom(row, headers, "SO", 1)),
      RBI: toNumber(valueFrom(row, headers, "RBI")),
      R: toNumber(valueFrom(row, headers, "R")),
      SB: toNumber(valueFrom(row, headers, "SB", 1)),
      HBP: toNumber(valueFrom(row, headers, "HBP", 1)),
      IP: toNumber(valueFrom(row, headers, "IP"))
    });
  });

  if (!lines.length) {
    throw new Error("No player rows found in this CSV.");
  }

  const box = {
    id: uid("box"),
    side: state.activeSide,
    gameDate: meta.gameDate || new Date().toISOString().slice(0, 10),
    opponent: meta.opponent || "",
    resultNote: meta.resultNote || "",
    filename,
    importedAt: new Date().toISOString(),
    lines
  };
  state.boxScores.unshift(box);

  state.sources.unshift({
    id: uid("source"),
    type: "box-score",
    name: filename,
    importedAt: box.importedAt,
    detail: `${lines.length} players, ${box.opponent || "opponent unknown"} ${box.gameDate}`
  });

  saveState();
  render();
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
  // Pre-fill the input with the saved override (if any) so the user can see / edit it.
  if (els.pdfBridgeUrlInput) {
    try {
      const saved = localStorage.getItem("pxp.pdfBridgeUrl") || "";
      els.pdfBridgeUrlInput.value = saved;
      // If we're on GitHub Pages with no saved override, expand the config so the input is visible.
      if (!saved && !PDF_BRIDGE_URL && els.pdfBridgeConfig) {
        els.pdfBridgeConfig.open = true;
      }
    } catch (_) { /* ignore */ }
  }

  refreshPdfBridgeStatus();

  if (els.pdfBridgeStatus) {
    els.pdfBridgeStatus.addEventListener("click", () => {
      if (els.pdfBridgeStatus.dataset.status !== "busy") refreshPdfBridgeStatus();
    });
  }

  if (els.pdfBridgeSaveButton && els.pdfBridgeUrlInput) {
    els.pdfBridgeSaveButton.addEventListener("click", () => {
      savePdfBridgeUrl(els.pdfBridgeUrlInput.value);
    });
    els.pdfBridgeUrlInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        savePdfBridgeUrl(els.pdfBridgeUrlInput.value);
      }
    });
  }

  if (els.pdfBridgeClearButton && els.pdfBridgeUrlInput) {
    els.pdfBridgeClearButton.addEventListener("click", () => {
      els.pdfBridgeUrlInput.value = "";
      savePdfBridgeUrl("");
    });
  }

  document.querySelectorAll('.data-tab[data-data-section="seasonStatsSection"]').forEach((tab) => {
    tab.addEventListener("click", refreshPdfBridgeStatus);
  });

  if (els.pdfInput) {
    els.pdfInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        await importPdfViaBridge(file, { kindHint: "auto" });
      } catch (error) {
        alert(`PDF import failed: ${error.message}\n\nMake sure the parser bridge is running:\n  cd tools/pdf_to_csv\n  python -m pdf_to_csv.server`);
      } finally {
        event.target.value = "";
      }
    });
  }

  if (els.boxScorePdfInput) {
    els.boxScorePdfInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        await importPdfViaBridge(file, {
          kindHint: "box",
          boxMeta: {
            gameDate: els.boxScoreDate?.value || "",
            opponent: els.boxScoreOpponent?.value || "",
            resultNote: els.boxScoreResultNote?.value || ""
          }
        });
        if (els.boxScoreOpponent) els.boxScoreOpponent.value = "";
        if (els.boxScoreResultNote) els.boxScoreResultNote.value = "";
      } catch (error) {
        alert(`PDF import failed: ${error.message}\n\nMake sure the parser bridge is running:\n  cd tools/pdf_to_csv\n  python -m pdf_to_csv.server`);
      } finally {
        event.target.value = "";
      }
    });
  }
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
  }
  if (result === "walk") delta.BB = 1;
  if (result === "hbp") delta.HBP = 1;
  if (result === "strikeout") delta.SO = 1;
  if (result === "sacFly") delta.SF = 1;

  return delta;
}

function applyEvent(event, direction = 1) {
  const player = state.players.find((item) => item.id === event.playerId);
  if (!player) return;
  const delta = eventDelta(event.result);
  Object.entries(delta).forEach(([key, value]) => {
    player.stats[key] = Math.max(0, toNumber(player.stats[key]) + value * direction);
  });
  player.stats.RBI = Math.max(0, toNumber(player.stats.RBI) + toNumber(event.rbi) * direction);
  player.stats.SB = Math.max(0, toNumber(player.stats.SB) + toNumber(event.sb) * direction);
  player.stats.CS = Math.max(0, toNumber(player.stats.CS) + toNumber(event.cs) * direction);
}

function resultLabel(result) {
  return {
    single: "Single",
    double: "Double",
    triple: "Triple",
    hr: "Home run",
    walk: "Walk",
    hbp: "Hit by pitch",
    strikeout: "Strikeout",
    out: "Out in play",
    sacFly: "Sac fly",
    reachedError: "Reached on error",
    fieldersChoice: "Fielder's choice"
  }[result] || result;
}

const notationStatMap = {
  "1B": "1B", "2B": "2B", "3B": "3B", "HR": "HR",
  "BB": "BB", "K": "K", "KC": "KC", "KL": "KC", "KPB": "KPB", "K PB": "KPB", "KWP": "KWP", "K WP": "KWP",
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

function notationActionKey(text) {
  const normalized = normalizedNotation(text);
  if (/^[FGLP][1-9]$/.test(normalized)) return "OUT";
  if (/^K\s+[1-9](?:-[1-9U])+$/.test(normalized)) return "K";
  if (/^[1-9](?:-[1-9U])+$/.test(normalized)) return "OUT";
  if (["FO", "GO", "LO", "DP", "TP", "PO"].includes(normalized)) return "OUT";
  return notationStatMap[normalized] || "";
}

const chartActions = {
  BB: { label: "BB", result: "walk", notation: "BB", pitcher: { BB: 1, BF: 1 } },
  K: { label: "K", result: "strikeout", notation: "K", pitcher: { K: 1, BF: 1 } },
  KC: { label: "ꓘ", result: "strikeout", notation: "Kc", pitcher: { K: 1, BF: 1 } },
  KPB: { label: "K PB", result: "strikeout", notation: "K PB", pitcher: { K: 1, BF: 1 } },
  KWP: { label: "K WP", result: "strikeout", notation: "K WP", pitcher: { K: 1, BF: 1 } },
  "1B": { label: "1B", result: "single", notation: "1B", pitcher: { H: 1, BF: 1 } },
  "2B": { label: "2B", result: "double", notation: "2B", pitcher: { H: 1, BF: 1 } },
  "3B": { label: "3B", result: "triple", notation: "3B", pitcher: { H: 1, BF: 1 } },
  HR: { label: "Hr", result: "hr", notation: "HR", pitcher: { H: 1, HR: 1, R: 1, ER: 1, BF: 1 } },
  OUT: { label: "Out", result: "out", notation: "OUT", pitcher: { BF: 1 } },
  HBP: { label: "HBP", result: "hbp", notation: "HBP", pitcher: { BF: 1 } },
  BI: { label: "BI", result: "out", notation: "BI", pitcher: { BF: 1 } },
  CI: { label: "CI", result: "catcherInterference", notation: "CI", pitcher: { BF: 1 } },
  BALK: { label: "Balk", result: "balk", notation: "BK", pitcher: {}, noPlateAppearance: true, advanceBatter: false },
  SF: { label: "SF", result: "sacFly", notation: "SF", pitcher: { BF: 1 } },
  ROE: { label: "ROE", result: "reachedError", notation: "ROE", pitcher: { BF: 1 }, inning: { E: 1 } },
  ERR: { label: "E", result: "out", notation: "E", pitcher: {}, inning: { E: 1 } },
  FC: { label: "FC", result: "fieldersChoice", notation: "FC", pitcher: { BF: 1 } }
};

const basePathForResult = {
  "1B": ["toFirst"],
  BB: ["toFirst"],
  HBP: ["toFirst"],
  CI: ["toFirst"],
  KPB: ["toFirst"],
  KWP: ["toFirst"],
  ROE: ["toFirst"],
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
  return Boolean(bases.toSecond || bases.toThird);
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
  player.stats[key] = Math.max(0, toNumber(player.stats[key]) + value);
  cell.runnerStatDeltas = cell.runnerStatDeltas || [];
  cell.runnerStatDeltas.push({ playerId, key, value });
}

function addRunnerPitcherOut(cell) {
  const chart = activeChart();
  if (!chart.activePitcherId) return;
  addToPitchingLine(chart.activePitcherId, { outs: 1 });
  cell.runnerPitcherDeltas = cell.runnerPitcherDeltas || [];
  cell.runnerPitcherDeltas.push({ pitcherId: chart.activePitcherId, outs: 1 });
}

function clearRunnerOutcome(cell) {
  if (cell.runnerStatDeltas) {
    cell.runnerStatDeltas.forEach((item) => {
      const player = state.players.find((candidate) => candidate.id === item.playerId);
      if (player) player.stats[item.key] = Math.max(0, toNumber(player.stats[item.key]) - toNumber(item.value));
    });
  }
  if (cell.runnerPitcherDeltas) {
    cell.runnerPitcherDeltas.forEach((item) => {
      addToPitchingLine(item.pitcherId, { outs: -toNumber(item.outs) });
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

async function promptThrowSequence(title, defaultValue) {
  const value = await showAppPrompt({
    title,
    message: "Enter the throw sequence for the notation.",
    defaultValue,
    inputLabel: defaultValue
  });
  return (value || defaultValue).trim();
}

function applyTerminalChange(cellKey, newTerminal) {
  const chart = activeChart();
  const cell = getScoreCellFromKey(cellKey);
  const { slot, inning } = parseScoreCellKey(cellKey);
  const effectiveInning = cellActualInning(cell, inning);
  const batterId = chart.lineup[slot - 1];
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
  if (batterId) setBatterBaseState(chart, batterId, newTerminal);
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
  chart.currentInning = Math.min(Number(state.inningCount || 9), Math.max(1, Number(inning) || 1));
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

function blankPitchingLine() {
  return { outs: 0, H: 0, R: 0, ER: 0, BB: 0, K: 0, HR: 0, BF: 0, pitches: 0, strikes: 0 };
}

function formatIpFromOuts(outs) {
  return `${Math.floor(outs / 3)}.${outs % 3}`;
}

function getPitchingLine(chart, pitcherId = chart.activePitcherId) {
  if (!pitcherId) return blankPitchingLine();
  chart.pitchingLines[pitcherId] = chart.pitchingLines[pitcherId] || blankPitchingLine();
  return chart.pitchingLines[pitcherId];
}

function addToPitchingLine(pitcherId, updates) {
  if (!pitcherId) return;
  const line = getPitchingLine(activeChart(), pitcherId);
  Object.entries(updates).forEach(([key, value]) => {
    line[key] = Math.max(0, toNumber(line[key]) + value);
  });
}

function addToInningTotals(inning, updates, direction = 1) {
  const totals = getInningTotals(inning);
  Object.entries(updates || {}).forEach(([key, value]) => {
    totals[key] = Math.max(0, toNumber(totals[key]) + value * direction);
  });
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
    addToPitchingLine(cell.pitcherId, reversePitcher);
  }
  if (!options.preservePitches && cell.pitchDeltas) {
    cell.pitchDeltas.forEach((pitch) => {
      if (pitch.pitcherId) {
        chart.pitchCounts[pitch.pitcherId] = Math.max(0, toNumber(chart.pitchCounts[pitch.pitcherId]) - 1);
        const line = getPitchingLine(chart, pitch.pitcherId);
        line.pitches = Math.max(0, toNumber(line.pitches) - 1);
        if (pitch.type === "strike" || pitch.type === "foul") line.strikes = Math.max(0, toNumber(line.strikes) - 1);
      }
      if (pitch.id) chart.pitchLog = chart.pitchLog.filter((item) => item.id !== pitch.id);
    });
  }
  if (cell.inning && cell.inningUpdates) {
    addToInningTotals(cell.inning, cell.inningUpdates, -1);
  }
  if (cell.runnerStatDeltas) {
    cell.runnerStatDeltas.forEach((item) => {
      const player = state.players.find((candidate) => candidate.id === item.playerId);
      if (player) player.stats[item.key] = Math.max(0, toNumber(player.stats[item.key]) - toNumber(item.value));
    });
  }
  if (cell.runnerPitcherDeltas) {
    cell.runnerPitcherDeltas.forEach((item) => {
      addToPitchingLine(item.pitcherId, { outs: -toNumber(item.outs) });
    });
  }
  if (cell.runnerDiamondBefore) {
    cell.runnerDiamondBefore.forEach((item) => {
      if (chart.scorecard[item.key]) chart.scorecard[item.key].bases = { ...item.bases };
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
  delete cell.baseStateBefore;
  delete cell.actionKey;
  delete cell.runnerStatDeltas;
  delete cell.runnerPitcherDeltas;
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
  if (stats.IP) details.push(`${stats.IP} IP on the mound`);

  return `${fullName(player)} is a ${details.join(", ")}. Current line: ${rates.AVG}/${rates.OBP}/${rates.SLG}, ${stats.H} H in ${stats.AB} AB.`;
}

function renderSetup() {
  document.querySelectorAll(".side-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.side === state.activeSide);
    tab.textContent = tab.dataset.side === "home" ? (state.game.teamName || "My Team") : (state.game.opponentName || "Opponent");
  });
  els.teamName.value = state.game.teamName;
  els.opponentName.value = state.game.opponentName;
  els.gameDate.value = state.game.gameDate;
  els.gameNotes.value = state.game.notes;
  if (els.showAtBatControls) els.showAtBatControls.checked = Boolean(state.settings.showAtBatControls);
  if (els.showFocusControls) els.showFocusControls.checked = Boolean(state.settings.showFocusControls);
  if (!state.settings.showFocusControls) {
    Object.values(state.charts).forEach((chart) => {
      chart.viewMode = "all";
    });
  }
  const players = activePlayers();
  els.playerCount.textContent = `${activeSideName()}: ${players.length} player${players.length === 1 ? "" : "s"}`;
  els.rosterSummary.textContent = players.length ? `${players.length} editable player cards` : "No players yet";
  els.inningCount.innerHTML = Array.from({ length: 18 }, (_, index) => {
    const value = index + 3;
    return `<option value="${value}" ${value === Number(state.inningCount) ? "selected" : ""}>${value}</option>`;
  }).join("");
  els.inningCount.value = String(state.inningCount);
  els.currentInning.innerHTML = Array.from({ length: Number(state.inningCount || 9) }, (_, index) => {
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
    : `<p class="meta">Import the Garden City CSV or attach PDFs to track your prep sources.</p>`;
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

function batterIdAtSlot(slot) {
  const chart = activeChart();
  const sub = chart.substitutions?.[slot - 1];
  if (sub && sub.playerId) return sub.playerId;
  return chart.lineup[slot - 1] || "";
}

function playerAtSlot(slot) {
  const id = batterIdAtSlot(slot);
  return id ? state.players.find((item) => item.id === id) : null;
}

function abCountForSlotInning(slotIndex, inning) {
  const chart = activeChart();
  return 1 + toNumber(chart.extraAbs[scoreCellKey(slotIndex, inning)] || 0);
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
  const maxInning = Number(state.inningCount || 9);

  const currentAbCount = abCountForSlotInning(slotIndex, currentInning);
  for (let ab = 0; ab < currentAbCount; ab += 1) {
    const key = scoreCellKey(slotIndex, currentInning, ab);
    if (!cellHasResult(chart.scorecard[key])) {
      return { key, column: currentInning, abIndex: ab, displaced: false };
    }
  }
  const primaryCurrent = chart.scorecard[scoreCellKey(slotIndex, currentInning, 0)];
  if (primaryCurrent && cellActualInning(primaryCurrent, currentInning) < currentInning) {
    const newAb = currentAbCount;
    return {
      key: scoreCellKey(slotIndex, currentInning, newAb),
      column: currentInning,
      abIndex: newAb,
      displaced: false,
      willCreateExtra: true
    };
  }
  for (let col = currentInning + 1; col <= maxInning; col += 1) {
    const abCount = abCountForSlotInning(slotIndex, col);
    for (let ab = 0; ab < abCount; ab += 1) {
      const key = scoreCellKey(slotIndex, col, ab);
      if (!cellHasResult(chart.scorecard[key])) {
        return { key, column: col, abIndex: ab, displaced: true };
      }
    }
  }
  const fallbackAb = currentAbCount;
  return {
    key: scoreCellKey(slotIndex, currentInning, fallbackAb),
    column: currentInning,
    abIndex: fallbackAb,
    displaced: false,
    willCreateExtra: true
  };
}

function ensureActiveCellExists() {
  const chart = activeChart();
  const currentInning = Number(chart.currentInning || 1);
  const loc = getActiveCellLocation();
  if (loc.willCreateExtra) {
    const baseKey = scoreCellKey(getCurrentSlot() - 1, loc.column);
    chart.extraAbs[baseKey] = toNumber(chart.extraAbs[baseKey]) + 1;
  }
  const cell = chart.scorecard[loc.key] = chart.scorecard[loc.key] || {
    count: "",
    result: "",
    rbi: "",
    notes: "",
    bases: emptyDiamondPath()
  };
  if (loc.displaced && !cell.actualInning) {
    cell.actualInning = currentInning;
  }
  return loc;
}

function visibleColumnsForView() {
  const chart = activeChart();
  const currentInning = Number(chart.currentInning || 1);
  const cols = new Set([currentInning]);
  Object.entries(chart.scorecard).forEach(([key, cell]) => {
    const { inning } = parseScoreCellKey(key);
    const actualInning = cellActualInning(cell, inning);
    if (actualInning === currentInning && inning !== currentInning) {
      cols.add(inning);
    }
  });
  return [...cols].sort((a, b) => a - b);
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

function findLatestScoreCellKeyForPlayer(playerId, exceptKey = "") {
  const chart = activeChart();
  return Object.keys(chart.scorecard)
    .filter((key) => {
      if (key === exceptKey) return false;
      const { slot } = parseScoreCellKey(key);
      return chart.lineup[slot - 1] === playerId;
    })
    .sort((a, b) => {
      const left = parseScoreCellKey(a);
      const right = parseScoreCellKey(b);
      return right.inning - left.inning || right.slot - left.slot || right.abNumber - left.abNumber;
    })[0] || "";
}

function updateRunnerDiamond(playerId, terminalBase, exceptKey = "") {
  const key = findLatestScoreCellKeyForPlayer(playerId, exceptKey);
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

function tonightLineForPlayer(playerId) {
  const tonightEvents = state.events.filter((event) => event.playerId === playerId);
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

function currentInningOuts(inning = activeChart().currentInning) {
  const chart = activeChart();
  return Object.values(chart.scorecard || {}).reduce((outs, cell) => {
    if (cellActualInning(cell, inning) !== Number(inning)) return outs;
    if (cell.outOverlay || ["OUT", "K", "Kc", "SF", "BI"].includes(cell.result) || ["OUT", "K", "KC", "SF", "BI"].includes(cell.actionKey)) return outs + 1;
    return outs;
  }, 0);
}

function recentPaText(events, limit = 4) {
  const items = events.slice(0, limit).map((event) => {
    const label = event.context?.split(": ").pop() || resultLabel(event.result);
    return label.replace("strikeout", "K");
  });
  return items.length ? items.join(" / ") : "No PA yet";
}

function hudStatClass(value, type = "neutral") {
  if (value === undefined || value === null || value === "" || String(value).includes("--")) return "stat-neutral";
  const n = toNumber(value);
  if (type === "avg") return n >= 0.3 ? "stat-good" : n >= 0.24 ? "stat-average" : "stat-bad";
  if (type === "obp") return n >= 0.38 ? "stat-good" : n >= 0.32 ? "stat-average" : "stat-bad";
  if (type === "slg") return n >= 0.48 ? "stat-good" : n >= 0.36 ? "stat-average" : "stat-bad";
  if (type === "ops") return n >= 0.85 ? "stat-good" : n >= 0.68 ? "stat-average" : "stat-bad";
  if (type === "iso") return n >= 0.18 ? "stat-good" : n >= 0.1 ? "stat-average" : "stat-bad";
  if (type === "bbp") return n >= 10 ? "stat-good" : n >= 6 ? "stat-average" : "stat-bad";
  if (type === "kp") return n <= 15 ? "stat-good" : n <= 25 ? "stat-average" : "stat-bad";
  if (type === "era") return n <= 3 ? "stat-good" : n <= 5 ? "stat-average" : "stat-bad";
  if (type === "whip") return n <= 1.25 ? "stat-good" : n <= 1.6 ? "stat-average" : "stat-bad";
  if (type === "baa") return n <= 0.23 ? "stat-good" : n <= 0.3 ? "stat-average" : "stat-bad";
  if (type === "count") return n > 0 ? "stat-good" : "stat-neutral";
  return "stat-neutral";
}

function hudStatChip(label, value, type = "neutral") {
  return `<span class="hud-stat-chip ${hudStatClass(value, type)}"><b>${escapeHtml(String(value))}</b><i>${escapeHtml(label)}</i></span>`;
}

function limitWords(text, limit = 250) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "No notes provided";
  return words.length > limit ? `${words.slice(0, limit).join(" ")}...` : words.join(" ");
}

function batterDetailHtml() {
  const slot = getCurrentSlot();
  const player = playerAtSlot(slot);
  if (!player) {
    return `<div class="batter-detail-card empty"><div class="totals-label">Active Batter</div><p class="meta">Set a player in the lineup board to see their detail.</p></div>`;
  }
  const stats = player.stats;
  const rates = calcStats(stats);
  const advanced = advancedStats(stats);
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
  const recentBoxLines = boxScoreLinesForPlayer(player.id).slice(0, 3);
  const recentGameText = recentBoxLines.length
    ? recentBoxLines.map(({ box, line: boxLine }) => `${formatBoxDate(box.gameDate)} ${boxLine.H}/${boxLine.AB}${boxLine.HR ? ` ${boxLine.HR}HR` : ""}${boxLine.RBI ? ` ${boxLine.RBI}RBI` : ""}`).join(" | ")
    : "No recent games";

  const tonightSummary = line.PA > 0
    ? `${line.H}/${line.AB}, ${line.RBI} RBI, ${line.BB} BB, ${line.SO} K`
    : `0 PA tonight`;

  return `
    <div class="batter-detail-card">
      <div class="compact-player-identity">
        <strong>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}</strong>
        <span>${escapeHtml(player.pronunciation || "No pronunciation provided")}</span>
        <span>${escapeHtml(playerMeta)}</span>
        <span>${escapeHtml(player.hometown || "No hometown provided")}</span>
      </div>
      <div class="compact-batter-line">
        ${hudStatChip("AVG", rates.AVG, "avg")}
        ${hudStatChip("OBP", rates.OBP, "obp")}
        ${hudStatChip("SLG", rates.SLG, "slg")}
        ${hudStatChip("OPS", rates.OPS, "ops")}
        ${hudStatChip("H/AB", `${stats.H}/${stats.AB}`)}
        ${hudStatChip("XBH", advanced.XBH, "count")}
        ${hudStatChip("RBI", stats.RBI, "count")}
        ${hudStatChip("HR", stats.HR, "count")}
        ${hudStatChip("BB/K", `${stats.BB}/${stats.SO}`)}
        ${hudStatChip("SB", `${stats.SB}/${sbAttempts}`)}
      </div>
      <div class="compact-analytics-line">
        ${hudStatChip("ISO", advanced.ISO, "iso")}
        ${hudStatChip("BB%", advanced.BBP, "bbp")}
        ${hudStatChip("K%", advanced.KP, "kp")}
        ${hudStatChip("BABIP", advanced.BABIP)}
        ${hudStatChip("TB", advanced.TB || rates.TB)}
        ${hudStatChip("PA", stats.PA || stats.AB + stats.BB + stats.HBP + stats.SF)}
        ${hudStatChip("SO", stats.SO)}
        ${hudStatChip("R", stats.R, "count")}
      </div>
      <div class="compact-storyline-line">
        <span class="hud-context-chip">Today: ${escapeHtml(tonightSummary)}</span>
        <span class="hud-context-chip">Prev: ${escapeHtml(recentPaText(events))}</span>
        <span class="hud-context-chip">Recent: ${escapeHtml(recentGameText)}</span>
      </div>
      <div class="compact-notes-box">${escapeHtml(limitWords(player.notes, 250))}</div>
      <div class="batter-detail-head">
        <div class="batter-detail-title">
          <span class="batter-detail-slot">SLOT ${slot}</span>
          <strong>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}</strong>
          <span class="batter-detail-meta">${escapeHtml([player.position, player.classYear].filter(Boolean).join(" / ") || "—")}</span>
        </div>
        ${player.pronunciation ? `<div class="batter-pronunciation">${escapeHtml(player.pronunciation)}</div>` : ""}
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
  const boxes = boxScoreLinesForPlayer(playerId).slice(0, 5);
  if (!boxes.length) return "";
  return `
    <div class="batter-recent-games">
      <span class="totals-label small">Recent Games</span>
      <ul class="batter-recent-list">
        ${boxes.map(({ box, line }) => {
          const opponent = box.opponent ? `vs ${escapeHtml(box.opponent)}` : "vs ?";
          const date = box.gameDate ? formatBoxDate(box.gameDate) : "";
          const slash = `${line.H}/${line.AB}`;
          const extras = [];
          if (line.HR) extras.push(`${line.HR} HR`);
          if (line.RBI) extras.push(`${line.RBI} RBI`);
          if (line.BB) extras.push(`${line.BB} BB`);
          if (line.SO) extras.push(`${line.SO} K`);
          if (line.SB) extras.push(`${line.SB} SB`);
          return `<li><b>${date}</b> <span>${opponent}</span> <em>${slash}</em>${extras.length ? ` &middot; ${escapeHtml(extras.join(", "))}` : ""}</li>`;
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
    const player = state.players.find((item) => item.id === chart.baseState[base]);
    return { base, player };
  });
  const pitcher = state.players.find((player) => player.id === chart.activePitcherId);
  const liveLine = getPitchingLine(chart);
  const pitcherRates = pitcher ? calcStats(pitcher.stats) : null;
  const outs = currentInningOuts(inning);
  const pitcherCard = pitcher
    ? `
      <div class="compact-pitcher-card">
        <strong>P #${escapeHtml(pitcher.number)} ${escapeHtml(fullName(pitcher))}</strong>
        <span class="pitcher-meta">${escapeHtml([pitcher.classYear, pitcher.weight ? `Wt ${pitcher.weight}` : "", pitcher.height ? `Ht ${pitcher.height}` : "", pitcher.hometown].filter(Boolean).join(" | ") || "No pitcher bio provided")}</span>
        ${hudStatChip("P/S", `${liveLine.pitches}/${liveLine.strikes}`)}
        ${hudStatChip("K", liveLine.K, "count")}
        ${hudStatChip("BB", liveLine.BB, liveLine.BB <= 1 ? "count" : "neutral")}
        ${hudStatChip("H", liveLine.H)}
        ${hudStatChip("R", liveLine.R)}
        ${hudStatChip("ERA", pitcher.stats.ERA || 0, "era")}
        ${hudStatChip("WHIP", pitcher.stats.WHIP || 0, "whip")}
        ${hudStatChip("AVG", pitcher.stats.BAA || pitcherRates?.AVG || 0, "baa")}
      </div>
    `
    : `<div class="compact-pitcher-card empty">P --</div>`;
  const compactBases = runners.map(({ base, player }) => {
    const label = base === "first" ? "1B" : base === "second" ? "2B" : "3B";
    return `${label} ${player ? `#${player.number} ${player.last}` : "--"}`;
  }).join(" | ");
  els.inningTotals.innerHTML = `
    ${batterDetailHtml()}
    <div class="base-state-card">
      <div class="totals-label">Bases</div>
      <div class="compact-run-state">
        <div class="compact-bases-line">${escapeHtml(compactBases)}</div>
        <div class="compact-count-line">Count ${escapeHtml(activeCount)} | Outs ${Math.min(3, outs)}/3</div>
      </div>
      <div class="mini-diamond">
        <svg class="mini-diamond-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <polygon class="diamond-frame-shape" points="50,92 92,50 50,8 8,50" />
          ${chart.baseState.first ? `<line class="mini-path" x1="50" y1="92" x2="92" y2="50" />` : ""}
          ${chart.baseState.second ? `<line class="mini-path" x1="92" y1="50" x2="50" y2="8" />` : ""}
          ${chart.baseState.third ? `<line class="mini-path" x1="50" y1="8" x2="8" y2="50" />` : ""}
        </svg>
        ${runners.map(({ base, player }) => {
          const baseClass = base === "first" ? "mini-base-first" : base === "second" ? "mini-base-second" : "mini-base-third";
          return `<button type="button" class="mini-base ${baseClass} ${player ? "occupied" : ""}" data-clear-base="${base}" title="${player ? `Clear ${base}` : `${base} empty`}">
            <span class="mini-base-mark"></span>
            <span class="mini-base-label">${player ? `#${escapeHtml(player.number)} ${escapeHtml(player.last)}` : escapeHtml(base[0].toUpperCase() + base.slice(1))}</span>
          </button>`;
        }).join("")}
      </div>
      ${pitcherCard}
    </div>
  `;
  els.inningTotals.style.setProperty("--innings", Number(state.inningCount || 9) + 1);
}

function sideLabel(side) {
  return side === "home" ? (state.game.teamName || "My Team") : (state.game.opponentName || "Opponent");
}

function lineScoreHtml({ inning = Number(activeChart().currentInning || 1), highlightedSide = state.activeSide } = {}) {
  const innings = Number(state.inningCount || 9);
  const totalKeys = ["R", "H", "E", "LOB", "RISP"];
  const sideLineTotals = (chart) => Array.from({ length: innings }, (_, index) => getChartInningTotals(chart, index + 1))
    .reduce((acc, item) => {
      totalKeys.forEach((key) => {
        acc[key] = toNumber(acc[key]) + toNumber(item[key]);
      });
      return acc;
    }, blankInningTotals());

  return `
    <div class="traditional-line-score">
      <table>
        <thead>
          <tr>
            <th>Team</th>
            ${Array.from({ length: innings }, (_, index) => `<th class="${index + 1 === inning ? "active" : ""}">${index + 1}</th>`).join("")}
            ${totalKeys.map((key) => `<th class="metric-total">${key}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${["home", "away"].map((side) => {
            const chart = state.charts[side];
            const lineTotals = sideLineTotals(chart);
            return `
              <tr class="${side === highlightedSide ? "active-side" : ""}">
                <th>${escapeHtml(sideLabel(side))}</th>
                ${Array.from({ length: innings }, (_, index) => {
                  const item = getChartInningTotals(chart, index + 1);
                  return `<td class="${index + 1 === inning ? "active" : ""}">${item.R || 0}</td>`;
                }).join("")}
                ${totalKeys.map((key) => `<td class="metric-total">${lineTotals[key] || 0}</td>`).join("")}
              </tr>
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

function upNextEntryHtml(slot, label, modifier) {
  const player = playerAtSlot(slot);
  const rates = player ? calcStats(player.stats) : null;
  const position = player ? displayPosition(activeChart().lineupPositions?.[slot - 1] || player.position) : "";
  const nameLine = player
    ? `#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}${position ? ` (${escapeHtml(position)})` : ""}`
    : `Lineup ${slot} (empty)`;
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
        <button type="button" id="nextAtBatButton" class="next-ab-button">Next At Bat &rarr;</button>
      ` : ""}
      ${state.settings.showFocusControls ? `
        <div class="segmented-toggle" role="group" aria-label="Visible batters">
          <button type="button" data-view-mode="focused" class="${activeChart().viewMode !== "all" ? "is-on" : ""}" title="Show only the active and adjacent batters">FOCUS 3</button>
          <button type="button" data-view-mode="all" class="${activeChart().viewMode === "all" ? "is-on" : ""}" title="Show every batter for editing">EDIT ALL</button>
        </div>
      ` : ""}
      <button id="pinChartButton" type="button" class="muted ${Boolean(state.pinStatHud) ? "active" : ""}">${Boolean(state.pinStatHud) ? "Unpinned HUD" : "Pinned HUD"}</button>
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
  const actualInning = cellActualInning(cell, column);
  const isDisplaced = actualInning < column;
  const cellClasses = ["score-cell"];
  if (isOnBase) cellClasses.push("has-runner");
  if (cellTerminal === "toHome") cellClasses.push("has-scored");
  if (isDisplaced) cellClasses.push("is-displaced");
  if (opts.isActive) cellClasses.push("is-active-cell");
  if (opts.isCompact) cellClasses.push("is-compact");
  if (cell.outOverlay) cellClasses.push("is-out");
  if (cell.scoredOverlay) cellClasses.push("is-scored-status");

  const runnerControls = isOnBase ? `
    <div class="runner-controls" role="group" aria-label="Advance runner">
      <button type="button" class="runner-btn runner-advance" data-runner-advance="${cellKey}" title="Advance runner one base">&rarr; ADV</button>
      <button type="button" class="runner-btn runner-score" data-runner-score="${cellKey}" title="Score runner">SCORED</button>
      <button type="button" class="runner-btn runner-out" data-runner-out="${cellKey}" title="Runner out">OUT</button>
    </div>
  ` : "";
  const stealControls = `
    <div class="steal-controls" role="group" aria-label="Steal base">
      <div class="steal-control-pair steal-toFirst">
        <div class="steal-main-stack">
          <button type="button" data-steal-cell="${cellKey}" data-steal-terminal="toFirst">Steal 1B</button>
          <button type="button" class="cs-control" data-cs-cell="${cellKey}" data-cs-terminal="toFirst">CS 1B</button>
        </div>
        <div class="runner-extra-stack">
          <button type="button" class="pick-control" data-pick-cell="${cellKey}" data-pick-terminal="toFirst">Pick</button>
          <button type="button" class="ri-control" data-ri-cell="${cellKey}" data-ri-terminal="toFirst">RI</button>
        </div>
      </div>
      <div class="steal-control-pair steal-toSecond">
        <div class="steal-main-stack">
          <button type="button" data-steal-cell="${cellKey}" data-steal-terminal="toSecond">Steal 2B</button>
          <button type="button" class="cs-control" data-cs-cell="${cellKey}" data-cs-terminal="toSecond">CS 2B</button>
        </div>
        <div class="runner-extra-stack">
          <button type="button" class="pick-control" data-pick-cell="${cellKey}" data-pick-terminal="toSecond">Pick</button>
          <button type="button" class="ri-control" data-ri-cell="${cellKey}" data-ri-terminal="toSecond">RI</button>
        </div>
      </div>
      <div class="steal-control-pair steal-toThird">
        <div class="runner-extra-stack">
          <button type="button" class="pick-control" data-pick-cell="${cellKey}" data-pick-terminal="toThird">Pick</button>
          <button type="button" class="ri-control" data-ri-cell="${cellKey}" data-ri-terminal="toThird">RI</button>
        </div>
        <div class="steal-main-stack">
          <button type="button" data-steal-cell="${cellKey}" data-steal-terminal="toThird">Steal 3B</button>
          <button type="button" class="cs-control" data-cs-cell="${cellKey}" data-cs-terminal="toThird">CS 3B</button>
        </div>
      </div>
      <div class="steal-control-pair steal-toHome">
        <div class="runner-extra-stack">
          <button type="button" class="pick-control" data-pick-cell="${cellKey}" data-pick-terminal="toHome">Pick</button>
          <button type="button" class="ri-control" data-ri-cell="${cellKey}" data-ri-terminal="toHome">RI</button>
        </div>
        <div class="steal-main-stack">
          <button type="button" data-steal-cell="${cellKey}" data-steal-terminal="toHome">Steal HP</button>
          <button type="button" class="cs-control" data-cs-cell="${cellKey}" data-cs-terminal="toHome">CS HP</button>
          <button type="button" class="wp-control" data-wp-cell="${cellKey}">WP</button>
        </div>
      </div>
    </div>
  `;

  const actionButtonHtml = (key) => {
    const action = chartActions[key];
    return `
      <button type="button" data-chart-action="${key}" ${action.detail ? `title="${escapeHtml(`${action.label} (${action.detail})`)}"` : ""}>
        <span class="result-main">${escapeHtml(action.label)}</span>
      </button>
    `;
  };
  const actionButtons = [
    ["1B", "2B", "3B", "HR"],
    ["KWP", "KPB", "BI"],
    ["HBP", "BALK", "CI"]
  ].map((row) => `
    <div class="result-button-row result-button-row-${row.length}">
      ${row.map(actionButtonHtml).join("")}
    </div>
  `).join("");

  const displacedBadge = isDisplaced ? `<div class="displaced-tag">FROM INN ${actualInning}</div>` : "";
  const pitchTotal = (cell.pitchDeltas || []).length;

  const entrySurface = opts.isCompact ? "" : `
    <div class="score-count-row">
      <div class="count-card">
        <span>${escapeHtml(cell.count || "0-0")} | ${pitchTotal} P</span>
      </div>
      <select data-score-field="rbi" aria-label="RBI">
        ${[0, 1, 2, 3, 4].map((value) => `<option value="${value}" ${value === toNumber(cell.rbi) ? "selected" : ""}>${value} RBI</option>`).join("")}
      </select>
    </div>
  `;

  const fullEntry = (opts.isActive || !opts.isCompact) ? `
    <div class="pitch-buttons">
      <button type="button" data-pitch="ball">Ball</button>
      <button type="button" data-pitch="strike">Strike</button>
      <button type="button" data-pitch="foul">Foul</button>
    </div>
    <button type="button" data-clear-cell="${cellKey}" class="danger clear-action-button" title="Clear cell">Clear AB Data</button>
    <div class="result-buttons">${actionButtons}</div>
    ${abIndex > 0 ? `<div class="score-result-row"><button type="button" data-remove-ab="${cellKey}" class="muted remove-ab-button" title="Remove extra at-bat">Remove AB</button></div>` : ""}
  ` : "";

  const notationValue = cell.notation || cell.result || "";
  const knownNotation = notationValue && (notationActionKey(notationValue) || notationSuggestions.some((token) => normalizedNotation(token) === normalizedNotation(notationValue)));
  const noteInputClasses = ["diamond-result-input"];
  if (notationValue && !knownNotation) noteInputClasses.push("is-unknown");

  return `
    <div class="${cellClasses.join(" ")}" data-score-cell="${cellKey}">
      ${displacedBadge}
      ${entrySurface}
      <div class="score-cell-body">
        <div class="diamond" aria-label="Runner diamond">
          ${diamondSvg(cell.bases)}
          ${stealControls}
          <div class="diamond-result">
            <input
              class="${noteInputClasses.join(" ")}"
              data-score-field="notation"
              data-notation-cell="${cellKey}"
              type="text"
              inputmode="text"
              autocomplete="off"
              list="notation-suggestions"
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
  const playerId = chart.lineup[slotIndex];
  if (!playerId) return "";
  if (chart.baseState.first === playerId) return "toFirst";
  if (chart.baseState.second === playerId) return "toSecond";
  if (chart.baseState.third === playerId) return "toThird";
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

  const header = [`<div class="score-head">${escapeHtml(activeSideName())}</div>`]
    .concat(visibleCols.map((col) => {
      const isCurrent = col === Number(chart.currentInning || 1);
      return `<div class="score-head ${isCurrent ? "is-current-col" : "is-overflow-col"}">Inning ${col}${isCurrent ? "" : " (overflow)"}</div>`;
    })).join("");

  const rows = Array.from({ length: slotCount }, (_, slotIndex) => {
    const slotNumber = slotIndex + 1;
    const player = state.players.find((item) => item.id === chart.lineup[slotIndex]);
    const sub = chart.substitutions[slotIndex] || { playerId: "", text: "", type: "" };
    const subPlayer = state.players.find((item) => item.id === sub.playerId);
    const subRates = subPlayer ? calcStats(subPlayer.stats) : null;
    const subOptions = [`<option value="">Sub</option>`]
      .concat(sortedPlayers().map((item) => `<option value="${item.id}" ${item.id === sub.playerId ? "selected" : ""}>#${escapeHtml(item.number)} ${escapeHtml(fullName(item))}</option>`))
      .join("");
    const playerLabel = player ? `#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}` : `Lineup ${slotNumber}`;
    const playerMeta = player ? escapeHtml([displayPosition(chart.lineupPositions?.[slotIndex] || player.position), player.pronunciation].filter(Boolean).join(" - ")) : "Select player in Lineup Board";
    const rates = player ? calcStats(player.stats) : null;

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
      const cells = Array.from({ length: abCount }, (_, ab) => {
        const isThisActiveCell = isActive && activeLoc && activeLoc.column === col && activeLoc.abIndex === ab;
        const isCompactCell = focusMode && !isActive && !hasRunner;
        return renderScoreCellHtml(slotIndex, col, ab, {
          isActive: isThisActiveCell,
          isCompact: isCompactCell
        });
      }).join("");
      return `<div class="ab-cell-row" data-column="${col}">${cells}</div>`;
    }).join("");

    return `
      <div class="${rowClasses.join(" ")}" data-slot="${slotNumber}">
        <div class="score-player">
          <div class="score-player-head">
            <button type="button" class="batting-order-badge" data-focus-slot="${slotNumber}" title="Make at-bat">${slotNumber}</button>
            <div class="score-player-headline">
              <strong>${playerLabel}</strong>
              <div class="player-pill-row">${statusPill}${runnerPill}</div>
            </div>
          </div>
          <span>${playerMeta}</span>
          ${player ? `
            <div class="batter-splits">
              <span class="${toNumber(rates.AVG) >= 0.3 ? "hot" : ""}" title="Batting average">AVG ${rates.AVG}</span>
              <span title="On-base percentage">OBP ${rates.OBP}</span>
              <span class="${toNumber(rates.OPS) >= 0.85 ? "power" : ""}" title="On-base plus slugging">OPS ${rates.OPS}</span>
              <span class="${player.stats.SO > player.stats.BB * 2 ? "risk" : ""}" title="Walks / strikeouts">BB/K ${player.stats.BB}/${player.stats.SO}</span>
            </div>
          ` : ""}
          ${isActive ? `
            <div class="sub-row">
              <select data-sub-player="${slotIndex}">${subOptions}</select>
              <input data-sub-type="${slotIndex}" value="${escapeHtml(sub.type || "")}" placeholder="PH/PR/CR/DEF" />
              <input data-sub-text="${slotIndex}" value="${escapeHtml(sub.text || "")}" placeholder="write-in sub" />
            </div>
            ${subPlayer ? `
              <div class="sub-card">
                <strong>${escapeHtml(sub.type || "SUB")} #${escapeHtml(subPlayer.number)} ${escapeHtml(fullName(subPlayer))}</strong>
                <span>AVG ${subRates.AVG} OBP ${subRates.OBP} OPS ${subRates.OPS} BB/K ${subPlayer.stats.BB}/${subPlayer.stats.SO}</span>
              </div>
            ` : ""}
          ` : ""}
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
  const pitchText = cell.pitchDeltas?.length ? `${cell.pitchDeltas.length} P` : "";
  const summaryText = [cell.result || cell.notation, cell.runnerNote, cell.count ? `(${cell.count})` : "", pitchText, cell.rbi ? `${cell.rbi} RBI` : ""].filter(Boolean).join(" ");
  const center = cell.result || cell.notation || "-";
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

function renderFullScorecard() {
  if (!els.fullScorecardGrid) return;
  const side = state.fullChartSide || state.activeSide;
  const chart = state.charts[side] || activeChart();
  const innings = Number(state.inningCount || 9);
  const lastLineupIndex = chart.lineup.reduce((last, playerId, index) => playerId ? index : last, -1);
  const slotCount = Math.max(9, lastLineupIndex + 1);
  els.fullScorecardGrid.style.setProperty("--innings", innings);
  if (els.fullChartToolbar) {
    els.fullChartToolbar.innerHTML = `
      <div class="segmented-toggle" role="group" aria-label="Full chart team">
        ${["home", "away"].map((item) => `
          <button type="button" data-full-chart-side="${item}" class="${item === side ? "is-on" : ""}">${escapeHtml(sideLabel(item))}</button>
        `).join("")}
      </div>
    `;
  }
  if (els.fullChartLineScore) {
    els.fullChartLineScore.innerHTML = lineScoreHtml({ highlightedSide: side });
  }
  const header = [`<div class="score-head">${escapeHtml(sideLabel(side))}</div>`]
    .concat(Array.from({ length: innings }, (_, index) => `<div class="score-head">${index + 1}</div>`))
    .join("");
  const rows = Array.from({ length: slotCount }, (_, slotIndex) => {
    const player = state.players.find((item) => item.id === chart.lineup[slotIndex]);
    const playerLabel = player ? `#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}` : `Lineup ${slotIndex + 1}`;
    const cells = Array.from({ length: innings }, (_, inningIndex) => {
      const inning = inningIndex + 1;
      const abCount = 1 + toNumber(chart.extraAbs[scoreCellKey(slotIndex, inning)] || 0);
      return `<div class="summary-stack">${Array.from({ length: abCount }, (_, abIndex) => scoreSummaryHtml(readChartScoreCell(chart, slotIndex, inning, abIndex))).join("")}</div>`;
    }).join("");
    return `<div class="score-player summary-player"><strong>${playerLabel}</strong></div>${cells}`;
  }).join("");
  els.fullScorecardGrid.innerHTML = header + rows;
}

function renderInningCompletion() {
  if (!els.inningCompleteOverlay || !els.inningEditBanner) return;
  const chart = activeChart();
  const inning = Number(chart.currentInning || 1);
  const outs = currentInningOuts(inning);

  if (outs < 3) {
    els.inningCompleteOverlay.hidden = true;
    els.inningEditBanner.hidden = true;
    delete chart.completedInnings[inning];
    delete chart.editingCompletedInnings[inning];
    return;
  }

  if (chart.editingCompletedInnings[inning]) {
    els.inningCompleteOverlay.hidden = true;
    els.inningEditBanner.hidden = false;
    els.inningEditBanner.innerHTML = `
      <strong>Editing completed inning ${inning}</strong>
      <span>Make corrections on the diamonds, then lock it back in.</span>
      <button type="button" data-confirm-inning="${inning}">Confirm edits</button>
    `;
    return;
  }

  if (chart.completedInnings[inning]) {
    els.inningCompleteOverlay.hidden = true;
    els.inningEditBanner.hidden = false;
    els.inningEditBanner.innerHTML = `
      <strong>Inning ${inning} completed</strong>
      <span>${Math.min(3, outs)} outs logged</span>
      <button type="button" class="muted" data-edit-completed-inning="${inning}">Edit inning</button>
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
        <button type="button" data-confirm-inning="${inning}">Confirm edits</button>
        <button type="button" class="muted" data-continue-inning-edit="${inning}">Continue editing</button>
      </div>
    </div>
  `;
}

function renderChartHud() {
  const chart = activeChart();
  const opponentPlayers = playersForSide(oppositeSide());
  const pitcher = state.players.find((player) => player.id === chart.activePitcherId);
  const pitcherRates = pitcher ? calcStats(pitcher.stats) : null;
  const pitcherCount = chart.pitchCounts[chart.activePitcherId] || 0;
  const liveLine = getPitchingLine(chart);
  const bullpen = chart.bullpenIds
    .map((id) => state.players.find((player) => player.id === id))
    .filter(Boolean);
  const defensePositions = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"];
  const defenseOptions = (selected) => [`<option value="">--</option>`]
    .concat(opponentPlayers.map((player) => `<option value="${player.id}" ${player.id === selected ? "selected" : ""}>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}</option>`))
    .join("");

  els.chartHud.innerHTML = `
    <section class="hud-panel pitcher-hud">
      <div class="hud-title">
        <h2>Opposing Pitcher</h2>
        <span>${escapeHtml(pitcher ? `${pitcherCount} pitches` : "Select above")}</span>
      </div>
      ${pitcher ? `
        <strong>#${escapeHtml(pitcher.number)} ${escapeHtml(fullName(pitcher))}</strong>
        <div class="hud-stats">
          <span title="Total pitches thrown">P ${pitcher.stats.Pitches || 0}</span>
          <span title="Win-loss record">W-L ${pitcher.stats.W || 0}-${pitcher.stats.L || 0}</span>
          <span title="Earned run average">ERA ${pitcher.stats.ERA || 0}</span>
          <span title="Games / games started">G/GS ${pitcher.stats.GP || 0}/${pitcher.stats.GS || 0}</span>
          <span title="Innings pitched">IP ${pitcher.stats.IP || 0}</span>
          <span title="Home runs allowed">HR ${pitcher.stats.P_HR || 0}</span>
          <span title="Walks allowed">BB ${pitcher.stats.P_BB || pitcher.stats.BB || 0}</span>
          <span title="Strikeouts">K ${pitcher.stats.P_SO || pitcher.stats.SO || 0}</span>
          <span title="Batting average against">AVG ${pitcher.stats.BAA || 0}</span>
        </div>
        <div class="live-line">
          <strong>Today</strong>
          <span title="Innings pitched">IP ${formatIpFromOuts(liveLine.outs)}</span>
          <span title="Hits allowed">H ${liveLine.H}</span>
          <span title="Runs allowed">R ${liveLine.R}</span>
          <span title="Earned runs">ER ${liveLine.ER}</span>
          <span title="Walks">BB ${liveLine.BB}</span>
          <span title="Strikeouts">K ${liveLine.K}</span>
          <span title="Home runs">HR ${liveLine.HR}</span>
          <span title="Batters faced">BF ${liveLine.BF}</span>
          <span title="Pitches / strikes">P/S ${liveLine.pitches}/${liveLine.strikes}</span>
        </div>
      ` : `<p class="meta">Choose the pitcher facing this lineup. Pitch buttons in the chart update this count.</p>`}
      <div class="bullpen-strip">
        <strong>Bullpen</strong>
        ${bullpen.length ? bullpen.map((player) => {
          const count = chart.pitchCounts[player.id] || 0;
          return `<span>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))} (${count} P)</span>`;
        }).join("") : `<span>No bullpen arms selected yet.</span>`}
      </div>
      <label>Bullpen / tendencies<textarea data-hud-field="bullpen" rows="4">${escapeHtml(chart.hud.bullpen)}</textarea></label>
    </section>
    <section class="hud-panel defense-hud">
      <div class="hud-title">
        <h2>Defense</h2>
        <span>${escapeHtml(state.activeSide === "home" ? state.game.opponentName || "Opponent" : state.game.teamName || "My Team")}</span>
      </div>
      <div class="defense-diamond">
        ${defensePositions.map((pos) => `
          <label class="def-pos pos-${pos.replace("1", "one").replace("2", "two").replace("3", "three")}">
            ${pos}
            <select data-defense-pos="${pos}">${defenseOptions(chart.hud.defense[pos])}</select>
          </label>
        `).join("")}
      </div>
    </section>
    <section class="hud-panel notes-hud">
      <div class="hud-title">
        <h2>Notes</h2>
        <span>Manual HUD</span>
      </div>
      <label>Defense notes<textarea data-hud-field="defenseNotes" rows="3">${escapeHtml(chart.hud.defenseNotes)}</textarea></label>
      <label>Game notes<textarea data-hud-field="chartNotes" rows="3">${escapeHtml(chart.hud.chartNotes)}</textarea></label>
    </section>
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
    return `
      <article class="roster-card">
        <div class="number-badge">${escapeHtml(player.number || "-")}</div>
        <div class="card-main">
          <h3>${escapeHtml(fullName(player))}</h3>
          <p>${escapeHtml([player.position, player.classYear, player.pronunciation].filter(Boolean).join(" - ") || "No profile details yet")}</p>
          <p class="meta">${rates.AVG}/${rates.OBP}/${rates.SLG} - ${player.stats.H} H, ${player.stats.RBI} RBI, ${player.stats.BB} BB</p>
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
  els.eventList.innerHTML = state.events.length
    ? state.events.map((event, index) => {
      const player = state.players.find((item) => item.id === event.playerId);
      return `
        <article class="event-card">
          <h3>${state.events.length - index}. ${escapeHtml(player ? fullName(player) : "Deleted player")} - ${escapeHtml(resultLabel(event.result))}</h3>
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
  { token: "BB", desc: "Walk", stat: true },
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
    if (state.sources.length) {
      els.dataSourceList.innerHTML = state.sources.map((source) => `
        <div class="source-item">
          <strong>${escapeHtml(source.name)}</strong>
          <p class="meta">${escapeHtml(source.type.toUpperCase())} &middot; ${escapeHtml(source.detail || "")} &middot; ${new Date(source.importedAt).toLocaleString()}</p>
        </div>
      `).join("");
    } else {
      els.dataSourceList.innerHTML = `<p class="meta">No imports yet.</p>`;
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
      els.boxScoreList.innerHTML = `<p class="meta">No box scores imported for this side yet. Use the form above to import a per-game CSV.</p>`;
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

function render() {
  renderSetup();
  renderChartHud();
  renderUpNextStrip();
  renderInningTotals();
  renderDiamondLineScore();
  renderScorecard();
  renderDataView();
  renderLineup();
  renderPlayerSelects();
  renderSpotlight();
  renderPlayerTable();
  renderRosterCards();
  renderEvents();
  renderPitching();
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
  const activeCount = chart.pitchCounts[chart.activePitcherId] || 0;
  els.activePitcherLabel.textContent = active ? `${fullName(active)} - ${activeCount} pitches` : "No active pitcher";

  const selectedPitcherIds = [...new Set([chart.startingPitcherId, chart.activePitcherId, ...chart.bullpenIds].filter(Boolean))];
  const selectedPitchers = selectedPitcherIds.map((id) => state.players.find((player) => player.id === id)).filter(Boolean);
  els.pitcherCards.innerHTML = selectedPitchers.map((player) => {
    const count = chart.pitchCounts[player.id] || 0;
    const line = getPitchingLine(chart, player.id);
    const isBullpen = chart.bullpenIds.includes(player.id);
    return `
      <article class="pitcher-card ${player.id === chart.activePitcherId ? "active" : ""}">
        <div>
          <strong>#${escapeHtml(player.number)} ${escapeHtml(fullName(player))}${player.id === chart.startingPitcherId ? " - SP" : ""}${isBullpen ? " - BP" : ""}</strong>
          <p class="meta">P ${player.stats.Pitches || 0} - W-L ${player.stats.W || 0}-${player.stats.L || 0} - ERA ${player.stats.ERA || 0} - G/GS ${player.stats.GP || 0}/${player.stats.GS || 0} - IP ${player.stats.IP || 0} - HR ${player.stats.P_HR || 0} - BB ${player.stats.P_BB || player.stats.BB || 0} - K ${player.stats.P_SO || player.stats.SO || 0} - AVG ${player.stats.BAA || 0}</p>
          <p class="meta">Today: IP ${formatIpFromOuts(line.outs)} H ${line.H} R ${line.R} ER ${line.ER} HR ${line.HR} BB ${line.BB} K ${line.K} BF ${line.BF} P/S ${line.pitches}/${line.strikes}</p>
          <textarea data-prev-starts="${player.id}" rows="2" placeholder="Previous starts: IP, H, R, ER, HR, BB, K, BF, P/S">${escapeHtml(player.previousStarts || "")}</textarea>
        </div>
        <div class="number-badge">${count}</div>
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

function showAppPrompt({ title, message = "", defaultValue = "", choices = [], inputLabel = "" } = {}) {
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
      resolve(value);
    };

    els.appPromptTitle.textContent = title || "Chart input";
    els.appPromptMessage.textContent = message;
    els.appPromptInput.value = defaultValue || "";
    els.appPromptInput.placeholder = inputLabel || "";
    els.appPromptInput.hidden = Boolean(choices.length);
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
}

function savePlayerFromForm(event) {
  event.preventDefault();
  const id = els.editingId.value || uid("player");
  const existing = state.players.find((player) => player.id === id);
  const stats = { ...(existing?.stats || emptyStats()) };
  ["AB", "H", "2B", "3B", "HR", "BB", "HBP", "SF", "RBI", "SO", "SB", "CS"].forEach((key) => {
    stats[key] = toNumber(document.querySelector(`#stat${CSS.escape(key)}`).value);
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
    side: existing?.side || state.activeSide,
    stats
  };

  if (existing) Object.assign(existing, player);
  else state.players.push(player);

  saveState();
  fillPlayerForm(null);
  render();
}

async function strikeThreeChoice(cellKey) {
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
    applyChartAction(cellKey, "KC");
    const cell = getScoreCellFromKey(cellKey);
    cell.outOverlay = true;
    return;
  }

  applyChartAction(cellKey, "K");
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
  const [ballsRaw, strikesRaw] = String(cell.count || "0-0").split("-").map(toNumber);
  let balls = ballsRaw;
  let strikes = strikesRaw;

  if (type === "ball") balls = Math.min(3, balls + 1);
  if (type === "strike") strikes = Math.min(2, strikes + 1);
  if (type === "foul") strikes = strikes < 2 ? strikes + 1 : strikes;
  cell.count = `${balls}-${strikes}`;

  if (chart.activePitcherId) {
    chart.pitchCounts[chart.activePitcherId] = (chart.pitchCounts[chart.activePitcherId] || 0) + 1;
    const line = getPitchingLine(chart, chart.activePitcherId);
    line.pitches += 1;
    if (type === "strike" || type === "foul") line.strikes += 1;
  }

  const pitchEvent = {
    id: uid("pitch"),
    pitcherId: chart.activePitcherId,
    type,
    cellKey,
    count: cell.count,
    createdAt: new Date().toISOString()
  };
  chart.pitchLog.unshift(pitchEvent);
  cell.pitchDeltas = cell.pitchDeltas || [];
  cell.pitchDeltas.push({ id: pitchEvent.id, pitcherId: chart.activePitcherId, type });

  const canAutoLogResult = !cell.actionKey && !cell.eventId && !cell.notation && !cell.result;
  if (canAutoLogResult && type === "ball" && ballsRaw >= 3) {
    cell.count = `3-${strikes}`;
    applyChartAction(cellKey, "BB");
  }
  if (canAutoLogResult && type === "strike" && strikesRaw >= 2) {
    cell.count = `${balls}-2`;
    await strikeThreeChoice(cellKey);
  }
}

function applyChartAction(cellKey, actionKey) {
  const chart = activeChart();
  const [slot, inning, abNumber] = cellKey.split("-").map(Number);
  const batterId = chart.lineup[slot - 1];
  const action = chartActions[actionKey];
  if (!action || !batterId) return;

  const cell = chart.scorecard[cellKey] || getScoreCell(slot - 1, inning, abNumber ? abNumber - 1 : 0);
  reverseChartCell(cellKey, { preservePitches: true });

  const effectiveInning = cellActualInning(cell, inning);
  const baseStateBefore = { ...chart.baseState };
  cell.result = action.notation;
  cell.notation = action.notation;
  cell.actionKey = actionKey;
  cell.outOverlay = ["OUT", "K", "KC", "SF", "BI"].includes(actionKey);
  cell.baseStateBefore = baseStateBefore;
  cell.bases = emptyDiamondPath();
  (basePathForResult[actionKey] || []).forEach((base) => {
    cell.bases[base] = true;
  });
  cell.scoredOverlay = activeDiamondTerminal(cell.bases) === "toHome";
  if (!cell.scoredOverlay) delete cell.scoredOverlay;

  const inningUpdates = { ...(action.inning || {}) };
  if (["1B", "2B", "3B", "HR"].includes(actionKey)) inningUpdates.H = (inningUpdates.H || 0) + 1;
  if (actionKey === "HR") inningUpdates.R = (inningUpdates.R || 0) + 1;
  if (["2B", "3B"].includes(actionKey)) inningUpdates.RISP = (inningUpdates.RISP || 0) + 1;

  const batterTerminal = activeDiamondTerminal(cell.bases);
  setBatterBaseState(chart, batterId, batterTerminal === "toHome" ? "" : batterTerminal);

  addToInningTotals(effectiveInning, inningUpdates, 1);

  let event = null;
  if (!action.noPlateAppearance) {
    event = {
      id: uid("chart-event"),
      playerId: batterId,
      pitcherId: chart.activePitcherId,
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
  if (event?.rbi && ["HR"].includes(actionKey)) {
    pitcherUpdates.R = Math.max(pitcherUpdates.R || 0, event.rbi);
    pitcherUpdates.ER = Math.max(pitcherUpdates.ER || 0, event.rbi);
  }
  addToPitchingLine(chart.activePitcherId, pitcherUpdates);
  if (event) cell.eventId = event.id;
  cell.pitcherId = chart.activePitcherId;
  cell.pitcherUpdates = pitcherUpdates;
  cell.inning = effectiveInning;
  cell.inningUpdates = inningUpdates;

  if (action.advanceBatter !== false && slot === getCurrentSlot() && effectiveInning === Number(chart.currentInning || 1)) {
    advanceBatter();
  }
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

  ["teamName", "opponentName", "gameDate", "gameNotes"].forEach((key) => {
    els[key].addEventListener("input", () => {
      state.game[key === "gameNotes" ? "notes" : key] = els[key].value;
      saveState();
    });
  });

  ["showAtBatControls", "showFocusControls"].forEach((key) => {
    if (!els[key]) return;
    els[key].addEventListener("change", () => {
      state.settings[key] = els[key].checked;
      if (key === "showFocusControls" && !els[key].checked) {
        Object.values(state.charts).forEach((chart) => {
          chart.viewMode = "all";
        });
      }
      saveState();
      render();
    });
  });

  els.csvInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      importPlayersFromCsv(await file.text(), file.name);
    } catch (error) {
      alert(error.message);
    } finally {
      event.target.value = "";
    }
  });

  if (els.boxScoreInput) {
    els.boxScoreInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        importBoxScoreFromCsv(await file.text(), file.name, {
          gameDate: els.boxScoreDate?.value || "",
          opponent: els.boxScoreOpponent?.value || "",
          resultNote: els.boxScoreResultNote?.value || ""
        });
        if (els.boxScoreOpponent) els.boxScoreOpponent.value = "";
        if (els.boxScoreResultNote) els.boxScoreResultNote.value = "";
      } catch (error) {
        alert(error.message);
      } finally {
        event.target.value = "";
      }
    });
  }

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

  bindPdfBridge();

  els.exportButton.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `pxp-baseball-${state.game.teamName || "team"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  });

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
    if (hudField) chart.hud[hudField] = event.target.value;
    if (defensePos) chart.hud.defense[defensePos] = event.target.value;
    saveState();
  });

  els.chartHud.addEventListener("change", (event) => {
    const defensePos = event.target.dataset.defensePos;
    if (!defensePos) return;
    activeChart().hud.defense[defensePos] = event.target.value;
    saveState();
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

  els.inningTotals.addEventListener("click", (event) => {
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
    state.inningCount = Number(els.inningCount.value);
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
    if (!confirm("Clear every diamond, count, and result on the visual chart?")) return;
    activeChart().scorecard = {};
    activeChart().extraAbs = {};
    activeChart().inningTotals = {};
    activeChart().baseStates = {};
    activeChart().baseState = emptyBaseState();
    saveState();
    render();
  });

  els.toggleFullChartButton?.addEventListener("click", () => {
    els.fullScorecardPanel.hidden = !els.fullScorecardPanel.hidden;
    els.toggleFullChartButton.textContent = els.fullScorecardPanel.hidden ? "Show Full Chart" : "Hide Full Chart";
    if (!els.fullScorecardPanel.hidden) renderFullScorecard();
  });

  els.fullScorecardPanel?.addEventListener("click", (event) => {
    const side = event.target.closest("[data-full-chart-side]")?.dataset.fullChartSide;
    if (!side) return;
    state.fullChartSide = side;
    saveState();
    renderFullScorecard();
  });

  [els.inningCompleteOverlay, els.inningEditBanner].forEach((container) => {
    container?.addEventListener("click", (event) => {
      const chart = activeChart();
      const confirmInning = event.target.closest("[data-confirm-inning]")?.dataset.confirmInning;
      const continueEdit = event.target.closest("[data-continue-inning-edit]")?.dataset.continueInningEdit;
      const editCompleted = event.target.closest("[data-edit-completed-inning]")?.dataset.editCompletedInning;
      if (confirmInning) {
        chart.completedInnings[confirmInning] = true;
        delete chart.editingCompletedInnings[confirmInning];
      }
      if (continueEdit || editCompleted) {
        const inning = continueEdit || editCompleted;
        chart.editingCompletedInnings[inning] = true;
        delete chart.completedInnings[inning];
      }
      if (confirmInning || continueEdit || editCompleted) {
        saveState();
        renderScorecard();
      }
    });
  });

  els.scorecardGrid.addEventListener("input", (event) => {
    const cellEl = event.target.closest("[data-score-cell]");
    const field = event.target.dataset.scoreField;
    const subPlayer = event.target.dataset.subPlayer;
    const subType = event.target.dataset.subType;
    const subText = event.target.dataset.subText;
    if (subPlayer !== undefined || subType !== undefined || subText !== undefined) {
      const slotIndex = subPlayer ?? subType ?? subText;
      const chart = activeChart();
      chart.substitutions[slotIndex] = chart.substitutions[slotIndex] || { playerId: "", type: "", text: "" };
      if (subPlayer !== undefined) chart.substitutions[slotIndex].playerId = event.target.value;
      if (subType !== undefined) chart.substitutions[slotIndex].type = event.target.value;
      if (subText !== undefined) chart.substitutions[slotIndex].text = event.target.value;
      saveState();
      if (subPlayer !== undefined) renderScorecard();
      return;
    }
    if (!cellEl || !field) return;
    const cell = getScoreCellFromKey(cellEl.dataset.scoreCell);
    cell[field] = event.target.value;
    saveState();
  });

  els.scorecardGrid.addEventListener("change", (event) => {
    const cellEl = event.target.closest("[data-score-cell]");
    const field = event.target.dataset.scoreField;
    if (!cellEl || field !== "notation") return;
    const cell = getScoreCellFromKey(cellEl.dataset.scoreCell);
    const typedNotation = event.target.value.trim();
    cell.notation = typedNotation;
    const actionKey = notationActionKey(typedNotation);
    if (actionKey && cell.actionKey !== actionKey) {
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
    const chartAction = event.target.dataset.chartAction;
    const addAb = event.target.dataset.addAb;
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
      const runnerId = activeChart().lineup[slot - 1];
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
      const runnerId = chart.lineup[slot - 1];
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
      const runnerId = chart.lineup[slot - 1];
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
      const runnerId = chart.lineup[slot - 1];
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
      applyTerminalChange(wpCellKey, "toHome");
      cell.runnerNote = "WP";
      if (!cell.notation && !cell.result) cell.notation = "WP";
      saveState();
      render();
    }
    if (addAb !== undefined) {
      const key = scoreCellKey(Number(addAb), activeChart().currentInning);
      activeChart().extraAbs[key] = toNumber(activeChart().extraAbs[key]) + 1;
      saveState();
      renderScorecard();
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
    if (chartAction) {
      const cellEl = event.target.closest("[data-score-cell]");
      applyChartAction(cellEl.dataset.scoreCell, chartAction);
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
  els.playerSearch.addEventListener("input", renderPlayerTable);
  els.playerForm.addEventListener("submit", savePlayerFromForm);
  els.newPlayerButton.addEventListener("click", () => fillPlayerForm(null));

  document.body.addEventListener("click", (event) => {
    const editId = event.target.dataset.editPlayer;
    const deleteId = event.target.dataset.deletePlayer;
    const deleteEventId = event.target.dataset.deleteEvent;

    if (editId) {
      const player = state.players.find((item) => item.id === editId);
      if (player) {
        fillPlayerForm(player);
        document.querySelector('[data-view="rosterView"]').click();
      }
    }

    if (deleteId && confirm("Delete this player?")) {
      state.players = state.players.filter((player) => player.id !== deleteId);
      Object.values(state.charts).forEach((chart) => {
        chart.lineup = chart.lineup.map((id) => id === deleteId ? "" : id);
        if (chart.activePitcherId === deleteId) chart.activePitcherId = "";
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
  const gameEvent = {
      id: uid("event"),
      playerId: els.eventPlayer.value,
      pitcherId: activeChart().activePitcherId,
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
    state.events.forEach((event) => applyEvent(event, -1));
    state.events = [];
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

normalizeState();
populateNotationDatalist();
setupEvents();
render();
