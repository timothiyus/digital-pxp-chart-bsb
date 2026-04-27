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
  TB: 0,
  IP: 0,
  ERA: 0,
  WHIP: 0,
  W: 0,
  L: 0,
  GS: 0,
  BF: 0,
  BAA: 0,
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
    teamMeta: {
      home: emptyTeamMeta(),
      away: emptyTeamMeta()
    },
    sources: [],
    boxScores: []
  };
}

function emptyTeamMeta() {
  return {
    logo: "",
    abbreviation: "",
    mascot: "",
    overallRecord: "",
    conferenceRecord: "",
    location: "",
    institutionInfo: "",
    primaryColor: "#167052",
    secondaryColor: "#b67a14",
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
  state.sources = state.sources || [];
  state.boxScores = state.boxScores || [];
  state.events = state.events || [];
  state.teamMeta = {
    home: { ...emptyTeamMeta(), ...(state.teamMeta?.home || {}) },
    away: { ...emptyTeamMeta(), ...(state.teamMeta?.away || {}) }
  };
  ["home", "away"].forEach((side) => {
    state.teamMeta[side].records = Array.from({ length: 10 }, (_, index) => ({
      season: "",
      overall: "",
      conference: "",
      ...((state.teamMeta[side].records || [])[index] || {})
    }));
    state.teamMeta[side].coaches = (state.teamMeta[side].coaches || []).map((coach) => ({
      id: coach.id || uid("coach"),
      name: "",
      title: "",
      bio: "",
      image: "",
      ...coach
    }));
  });
  state.fullChartSide = state.fullChartSide || state.activeSide || "home";
  state.settings = {
    showAtBatControls: false,
    showFocusControls: false,
    ...(state.settings || {})
  };
  state.hudStatScopes = {
    batter: "overall",
    pitcher: "overall",
    ...(state.hudStatScopes || {})
  };
  ["batter", "pitcher"].forEach((kind) => {
    if (!["overall", "conference", "nonconference", "currentgame"].includes(state.hudStatScopes[kind])) {
      state.hudStatScopes[kind] = "overall";
    }
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
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  els.saveState.textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
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

function activeChart() {
  return state.charts[state.activeSide];
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
    IP: toNumber(valueFromFirst(row, headers, ["IP", "InningsPitched", "Innings Pitched"])),
    GS: toNumber(valueFrom(row, headers, "GS")),
    BF: toNumber(valueFromFirst(row, headers, ["BF", "BattersFaced", "Batters Faced"])),
    W: toNumber(valueFrom(row, headers, "W")),
    L: toNumber(valueFrom(row, headers, "L")),
    Pitches: toNumber(valueFromFirst(row, headers, ["#P", "NumberOfPitches", "Number Of Pitches", "Pitches", "NP"])),
    Strikes: toNumber(valueFrom(row, headers, "S%", 1)),
    ERA: toNumber(valueFrom(row, headers, "ERA")),
    WHIP: toNumber(valueFrom(row, headers, "WHIP")),
    BAA: toNumber(valueFrom(row, headers, "BAA")),
    P_HR: toNumber(valueFromFirst(row, headers, [["HR", 2], "HomeRunsAgainst", "Home Runs Against", "HRA"])),
    P_2B: toNumber(valueFromFirst(row, headers, [["2B", 2], "DoublesAgainst", "Doubles Against"])),
    P_3B: toNumber(valueFromFirst(row, headers, [["3B", 2], "TriplesAgainst", "Triples Against"])),
    P_BB: toNumber(valueFromFirst(row, headers, [["BB", 2], "BaseOnBallsAgainst", "Base On Balls Against", "WalksAgainst", "Walks Against"])),
    P_SO: toNumber(valueFromFirst(row, headers, [["SO", 2], "BattersStruckOut", "Batters Struck Out", ["K", 2], "StrikeoutsAgainst"])),
    P_H: toNumber(valueFromFirst(row, headers, [["H", 2], "HitsAgainst", "Hits Against", "HA"])),
    P_R: toNumber(valueFromFirst(row, headers, [["R", 2], "RunsAgainst", "Runs Against", "RA"])),
    P_ER: toNumber(valueFromFirst(row, headers, ["ER", "EarnedRuns", "Earned Runs"])),
    P_BK: toNumber(valueFromFirst(row, headers, ["BK", "Balks", "BalksAgainst"])),
    P_HBP: toNumber(valueFromFirst(row, headers, [["HBP", 2], "HitBatter", "Hit Batter", "HitBatters", "HB"])),
    P_WP: toNumber(valueFromFirst(row, headers, ["WP", "WildPitches", "Wild Pitches"])),
    P_AB: toNumber(valueFromFirst(row, headers, [["AB", 2], "AtBatsAgainst", "At Bats Against", "ABAgainst"])),
    CG: toNumber(valueFromFirst(row, headers, ["CG", "CompleteGames", "Complete Games"])),
    SHO: toNumber(valueFromFirst(row, headers, ["SHO", "Shutouts"])),
    SV: toNumber(valueFromFirst(row, headers, ["SV", "Saves"])),
    SFA: toNumber(valueFromFirst(row, headers, ["SFA", "SacFliesAgainst", "Sac Flies Against"])),
    SHA: toNumber(valueFromFirst(row, headers, ["SHA", "SacHitsAgainst", "Sac Hits Against"]))
  };
}

function importPlayersFromCsv(text, filename, scope = "overall") {
  const rows = parseCsv(text);
  const headerRowIndex = rows.findIndex((row) => row.includes("Number") && row.includes("Last") && row.includes("First"));
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

  imported.forEach((player) => {
    const fullKey = `${player.side}-${player.number}-${player.first}-${player.last}`.toLowerCase();
    const jerseyKey = player.number ? `${player.side}-${String(player.number).trim().toLowerCase()}` : "";
    const existing = byKey.get(fullKey) || (jerseyKey ? byJersey.get(jerseyKey) : null);
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
    } else {
      const filled = {
        ...player,
        stats: { ...emptyStats(), ...(player.stats || {}) },
        confStats: { ...emptyStats(), ...(player.confStats || {}) }
      };
      state.players.push(filled);
      byKey.set(fullKey, filled);
      if (jerseyKey) byJersey.set(jerseyKey, filled);
    }
  });
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
  return trimmed.includes("#") && trimmed.includes("Name") && Boolean(detectPrestoVariant(trimmed));
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
  const headerRowIndex = rows.findIndex((row) => row.some((cell) => String(cell).trim() === "#") && row.some((cell) => String(cell).trim() === "Name"));
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

function saveImportedBoxScore(lines, filename, meta = {}, sourceFormat = "CSV") {
  if (!lines.length) {
    throw new Error(`No player rows found in this ${sourceFormat} box score.`);
  }

  const box = {
    id: uid("box"),
    side: state.activeSide,
    gameDate: meta.gameDate || new Date().toISOString().slice(0, 10),
    opponent: meta.opponent || "",
    resultNote: meta.resultNote || "",
    filename,
    format: sourceFormat.toLowerCase(),
    importedAt: new Date().toISOString(),
    lines
  };
  state.boxScores.unshift(box);

  state.sources.unshift({
    id: uid("source"),
    type: "box-score",
    name: filename,
    importedAt: box.importedAt,
    detail: `${lines.length} players, ${box.opponent || "opponent unknown"} ${box.gameDate}`,
    source: "gamechanger",
    scope: "box-score",
    variant: sourceFormat.toLowerCase()
  });

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
  }
  if (result === "walk") delta.BB = 1;
  if (result === "hbp") delta.HBP = 1;
  if (result === "strikeout") delta.SO = 1;
  if (result === "sacFly") delta.SF = 1;
  if (result === "balk") delta.BK = 1;

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

const defaultEarnedRunActions = new Set(["1B", "2B", "3B", "HR", "BB", "HBP", "SF", "BI", "FC", "KWP"]);

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
    if (batter && delta) {
      batter.stats.RBI = Math.max(0, toNumber(batter.stats.RBI) + delta);
    }
    event.rbi = nextRbi;
    syncPitcherRunsFromRbi(cell, cell.actionKey || notationActionKey(cell.notation), oldEventRbi, nextRbi);
  }
}

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
  addRunnerPitcherDelta(cell, { outs: 1 });
}

function addRunnerPitcherDelta(cell, updates) {
  const chart = activeChart();
  if (!chart.activePitcherId) return;
  addToPitchingLine(chart.activePitcherId, updates);
  cell.runnerPitcherDeltas = cell.runnerPitcherDeltas || [];
  cell.runnerPitcherDeltas.push({ pitcherId: chart.activePitcherId, updates: { ...updates } });
}

function reverseRunnerPitcherDelta(item) {
  const updates = item.updates || { outs: toNumber(item.outs) };
  const reverseUpdates = {};
  Object.entries(updates).forEach(([key, value]) => {
    reverseUpdates[key] = -toNumber(value);
  });
  addToPitchingLine(item.pitcherId, reverseUpdates);
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
  return { outs: 0, H: 0, R: 0, ER: 0, BB: 0, K: 0, KC: 0, HR: 0, "2B": 0, "3B": 0, HBP: 0, WP: 0, BF: 0, pitches: 0, strikes: 0, balls: 0, fouls: 0, twoStrikePitches: 0, BK: 0 };
}

function formatIpFromOuts(outs) {
  return `${Math.floor(outs / 3)}.${outs % 3}`;
}

function livePitchingRates(line) {
  const outs = toNumber(line.outs);
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

function addToPitchingLine(pitcherId, updates) {
  if (!pitcherId) return;
  const line = getPitchingLine(activeChart(), pitcherId);
  Object.entries(updates).forEach(([key, value]) => {
    line[key] = Math.max(0, toNumber(line[key]) + value);
  });
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
  addToPitchingLine(pitcherId, { [key]: delta });
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
        if (pitch.updates) {
          const reverseUpdates = {};
          Object.entries(pitch.updates).forEach(([key, value]) => {
            reverseUpdates[key] = -toNumber(value);
          });
          addToPitchingLine(pitch.pitcherId, reverseUpdates);
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
  if (cell.runnerStatDeltas) {
    cell.runnerStatDeltas.forEach((item) => {
      const player = state.players.find((candidate) => candidate.id === item.playerId);
      if (player) player.stats[item.key] = Math.max(0, toNumber(player.stats[item.key]) - toNumber(item.value));
    });
  }
  if (cell.runnerPitcherDeltas) {
    cell.runnerPitcherDeltas.forEach((item) => {
      reverseRunnerPitcherDelta(item);
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
        <label>Abbrev <input type="text" data-team-meta-side="${side}" data-team-meta-field="abbreviation" value="${escapeHtml(meta.abbreviation)}" placeholder="GCCC" /></label>
        <label>Location <input type="text" data-team-meta-side="${side}" data-team-meta-field="location" value="${escapeHtml(meta.location)}" placeholder="Garden City, KS" /></label>
        <label>Overall record <input type="text" data-team-meta-side="${side}" data-team-meta-field="overallRecord" value="${escapeHtml(meta.overallRecord)}" placeholder="21-31" /></label>
        <label>Conference record <input type="text" data-team-meta-side="${side}" data-team-meta-field="conferenceRecord" value="${escapeHtml(meta.conferenceRecord)}" placeholder="13-14" /></label>
        <label>Primary color <input type="color" data-team-meta-side="${side}" data-team-meta-field="primaryColor" value="${escapeHtml(safeHex(meta.primaryColor, "#167052"))}" /></label>
        <label>Secondary color <input type="color" data-team-meta-side="${side}" data-team-meta-field="secondaryColor" value="${escapeHtml(safeHex(meta.secondaryColor, "#b67a14"))}" /></label>
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
    tab.textContent = tab.dataset.side === "home" ? (state.game.teamName || "My Team") : (state.game.opponentName || "Opponent");
  });
  els.teamName.value = state.game.teamName;
  els.opponentName.value = state.game.opponentName;
  els.gameDate.value = state.game.gameDate;
  els.gameNotes.value = state.game.notes;
  if (els.teamProfilePanel) els.teamProfilePanel.innerHTML = teamSetupHtml(state.activeSide);
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
  return Object.entries(chart.scorecard || {}).reduce((outs, [key, cell]) => {
    const { inning: cellColumn } = parseScoreCellKey(key);
    if (cellActualInning(cell, cellColumn) !== Number(inning)) return outs;
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
  if (value === undefined || value === null || value === "" || value === "-" || String(value).includes("--")) return "stat-neutral";
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

function statPill({ label, value, type = "neutral", show = true, className = "" }) {
  return show ? `<span class="hud-stat-chip ${hudStatClass(value, type)} ${className}"><b>${escapeHtml(String(value))}</b><i>${escapeHtml(label)}</i></span>` : "";
}

function renderPillGroups(groups) {
  return groups
    .filter((group) => group.some((pill) => pill.show !== false))
    .map((group) => `<div class="hud-pill-group" style="--pill-count:${group.length}">${group.map(statPill).join("")}</div>`)
    .join("");
}

function renderPillRow(groups, className = "") {
  return `<div class="compact-stat-row ${className}">${renderPillGroups(groups)}</div>`;
}

function percentValue(numerator, denominator) {
  const denom = toNumber(denominator);
  return denom ? `${((toNumber(numerator) / denom) * 100).toFixed(1)}%` : "-";
}

function calculatedPercentPill(label, numerator, denominator, type = "neutral", className = "") {
  return {
    label,
    value: percentValue(numerator, denominator),
    type,
    className
  };
}

const batterStatKeys = ["GP", "PA", "AB", "H", "2B", "3B", "HR", "RBI", "R", "BB", "SO", "HBP", "SF", "SB", "CS", "TB"];
const pitcherStatKeys = ["GP", "IP", "ERA", "WHIP", "W", "L", "GS", "BF", "BAA", "Pitches", "P_H", "P_R", "P_ER", "P_HR", "P_BB", "P_SO", "P_BK", "P_HBP", "P_WP"];
const nonConferenceSubtractKeys = [
  "GP", "PA", "AB", "H", "2B", "3B", "HR", "RBI", "R", "BB", "SO", "HBP", "SF", "SB", "CS", "TB",
  "W", "L", "GS", "BF", "Pitches", "Strikes", "BK", "P_H", "P_R", "P_ER", "P_HR", "P_2B", "P_3B", "P_BB", "P_SO", "P_BK", "P_HBP", "P_WP", "P_AB", "CG", "SHO", "SV", "SFA", "SHA",
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

function pitchingStatsLine(stats = {}) {
  const line = { ...emptyStats(), ...(stats || {}) };
  return `P ${line.Pitches || 0} - W-L ${line.W || 0}-${line.L || 0} - ERA ${formatPitchingStatsLineValue("ERA", line.ERA)} - G/GS ${line.GP || 0}/${line.GS || 0} - IP ${formatPitchingStatsLineValue("IP", line.IP)} - H ${line.P_H || 0} - R ${line.P_R || 0} - ER ${line.P_ER || 0} - HR ${line.P_HR || 0} - BB ${line.P_BB || 0} - K ${line.P_SO || 0} - HBP ${line.P_HBP || 0} - WP ${line.P_WP || 0} - BK ${line.P_BK || 0} - WHIP ${formatPitchingStatsLineValue("WHIP", line.WHIP)} - AVG ${formatPitchingStatsLineValue("BAA", line.BAA)}`;
}

function batterHudPills(stats, rates, advanced) {
  const pa = stats.PA || stats.AB + stats.BB + stats.HBP + stats.SF;
  const obpDenom = stats.AB + stats.BB + stats.HBP + stats.SF;
  const sbAttempts = stats.SB + stats.CS;
  const xbh = stats["2B"] + stats["3B"] + stats.HR;
  return [
    [
      [
        { label: "GP/GS", value: `${stats.GP || 0}/${stats.GS || 0}` },
        { label: "PA/AB", value: `${pa}/${stats.AB || 0}` },
        { label: "AVG", value: stats.AB > 0 ? rates.AVG : "-", type: "avg" },
        { label: "OBP", value: obpDenom > 0 ? rates.OBP : "-", type: "obp" },
        { label: "SLG%", value: stats.AB > 0 ? rates.SLG : "-", type: "slg" },
        { label: "OPS", value: obpDenom > 0 && stats.AB > 0 ? rates.OPS : "-", type: "ops" }
      ],
      [
        { label: "R", value: stats.R, type: "count" },
        { label: "H", value: stats.H, type: "count" },
        { label: "2B", value: stats["2B"], type: "count" },
        { label: "3B", value: stats["3B"], type: "count" },
        { label: "HR", value: stats.HR, type: "count" },
        { label: "RBI", value: stats.RBI, type: "count" }
      ]
    ],
    [
      [
        { label: "BB", value: stats.BB },
        { label: "SO", value: stats.SO },
        { label: "HBP", value: stats.HBP }
      ],
      [
        { label: "K%", value: pa > 0 ? advanced.KP : "-", type: "kp" },
        { label: "BB%", value: pa > 0 ? advanced.BBP : "-", type: "bbp" },
        { label: "BB/K", value: `${stats.BB}/${stats.SO}` }
      ],
      [
        { label: "ISO", value: stats.AB > 0 ? advanced.ISO : "-", type: "iso" },
        calculatedPercentPill("XBH%", xbh, stats.H, "iso"),
        calculatedPercentPill("HR%", stats.HR, stats.AB, "iso")
      ],
      [
        { label: "SB", value: stats.SB },
        { label: "CS", value: stats.CS },
        calculatedPercentPill("SB%", stats.SB, sbAttempts, "count")
      ]
    ]
  ];
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

function currentGameBatterSpecialPills(playerId) {
  const chart = activeChart();
  const eventCells = Object.entries(chart.scorecard || {})
    .map(([key, cell]) => ({ key, cell, event: state.events.find((item) => item.id === cell.eventId) }))
    .filter((item) => item.event)
    .sort(scoreCellSortChronological);
  const outsByInning = {};
  const line = {
    rispAb: 0,
    rispH: 0,
    twoOutH: 0,
    twoOutBbhbp: 0,
    twoOutPa: 0,
    twoOutObpEvents: 0,
    twoOutRbi: 0
  };

  eventCells.forEach((item) => {
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
        line.twoOutH += delta.H || 0;
        line.twoOutBbhbp += (delta.BB || 0) + (delta.HBP || 0);
        line.twoOutObpEvents += (delta.H || 0) + (delta.BB || 0) + (delta.HBP || 0);
        line.twoOutRbi += toNumber(item.event.rbi);
      }
    }
    if (cellRecordsOut(item.cell)) outsByInning[inning] = outsBefore + 1;
  });

  return [
    { label: "CURRENT GAME AVG W/RISP", value: line.rispAb ? formatRate(line.rispH / line.rispAb) : "-", className: "game-context-chip" },
    { label: "CURRENT 2-OUT HIT", value: line.twoOutH, className: "game-context-chip" },
    { label: "CURRENT 2-OUT BB/HBP", value: line.twoOutBbhbp, className: "game-context-chip" },
    { label: "CURRENT 2-OUT PA", value: line.twoOutPa, className: "game-context-chip" },
    { label: "CURRENT 2-OUT OBP", value: line.twoOutPa ? formatRate(line.twoOutObpEvents / line.twoOutPa) : "-", className: "game-context-chip" },
    { label: "CURRENT 2-OUT RBI", value: line.twoOutRbi, className: "game-context-chip" }
  ];
}

function currentPitcherPills(line) {
  const rates = livePitchingRates(line);
  return [
    { label: "IP", value: formatIpFromOuts(line.outs) },
    { label: "P/S/B/F", value: `${line.pitches}/${line.strikes}/${line.balls}/${line.fouls}` },
    { label: "H", value: line.H },
    { label: "R", value: line.R },
    { label: "ER", value: line.ER },
    { label: "K", value: line.K, type: "count" },
    { label: "Kc", value: line.KC, type: "count" },
    { label: "2B", value: line["2B"] },
    { label: "3B", value: line["3B"] },
    { label: "HR", value: line.HR },
    { label: "BB", value: line.BB },
    { label: "HBP", value: line.HBP },
    { label: "BF", value: line.BF },
    { label: "GERA", value: line.outs ? rates.ERA : "-", type: "era" },
    { label: "GWHIP", value: line.outs ? rates.WHIP : "-", type: "whip" },
    { label: "GAVG", value: line.BF ? rates.BAA : "-", type: "baa" },
    { label: "GBB%", value: percentValue(line.BB, line.BF), type: "bbp" },
    { label: "G2-Str%", value: percentValue(line.twoStrikePitches, line.pitches) }
  ];
}

function seasonPitcherPills(stats) {
  const apps = stats.GP || 0;
  const avgDenom = toNumber(stats.P_AB) || Math.max(0, toNumber(stats.BF) - toNumber(stats.P_BB) - toNumber(stats.P_HBP));
  const hasIp = ipToOuts(stats.IP) > 0;
  return [
    { label: "IP", value: formatIpValue(stats.IP) },
    { label: "ERA", value: hasIp ? formatFixed(stats.ERA, 2) : "-", type: "era" },
    { label: "W/L", value: `${stats.W || 0}/${stats.L || 0}` },
    { label: "GP/GS", value: `${stats.GP || 0}/${stats.GS || 0}` },
    { label: "App/GS", value: `${apps}/${stats.GS || 0}` },
    { label: "H", value: stats.P_H || 0 },
    { label: "R", value: stats.P_R || 0 },
    { label: "ER", value: stats.P_ER || 0 },
    { label: "BB", value: stats.P_BB || 0 },
    { label: "SO", value: stats.P_SO || 0 },
    { label: "HR", value: stats.P_HR || 0 },
    { label: "AVG", value: avgDenom ? formatRate(toNumber(stats.BAA)) : "-", type: "baa" },
    { label: "WHIP", value: hasIp ? formatFixed(stats.WHIP, 2) : "-", type: "whip" },
    { label: "WP", value: stats.P_WP || 0 },
    { label: "HBP", value: stats.P_HBP || 0 }
  ];
}

function aggregateTeamStats(side) {
  const players = playersForSide(side);
  const stats = emptyStats();
  players.forEach((player) => {
    const playerStats = { ...emptyStats(), ...(player.stats || {}) };
    [...new Set([...batterStatKeys, ...pitcherStatKeys, "P_2B", "P_3B", "P_AB", "CG", "SHO", "SV", "SFA", "SHA", "TC", "PO", "A", "E", "DP", "SBA", "RCS", "PB", "CI"])].forEach((key) => {
      if (key === "IP") return;
      stats[key] = toNumber(stats[key]) + toNumber(playerStats[key]);
    });
    stats.IP = outsToIpValue(ipToOuts(stats.IP) + ipToOuts(playerStats.IP));
  });
  const battingRates = calcStats(stats);
  calculatePitchingRates(stats);
  return { stats, battingRates, players };
}

function teamMetaForSide(side) {
  state.teamMeta = state.teamMeta || {};
  state.teamMeta[side] = { ...emptyTeamMeta(), ...(state.teamMeta[side] || {}) };
  state.teamMeta[side].records = Array.from({ length: 10 }, (_, index) => ({
    season: "",
    overall: "",
    conference: "",
    ...((state.teamMeta[side].records || [])[index] || {})
  }));
  state.teamMeta[side].coaches = state.teamMeta[side].coaches || [];
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
  return `--team-primary:${safeHex(meta.primaryColor, "#167052")}; --team-secondary:${safeHex(meta.secondaryColor, "#b67a14")}`;
}

function applyActiveTeamColors() {
  const meta = teamMetaForSide(state.activeSide);
  document.documentElement.style.setProperty("--active-team-primary", safeHex(meta.primaryColor, "#167052"));
  document.documentElement.style.setProperty("--active-team-secondary", safeHex(meta.secondaryColor, "#b67a14"));
}

function applySideTabColors(tab) {
  if (!tab?.dataset?.side) return;
  const meta = teamMetaForSide(tab.dataset.side);
  tab.style.setProperty("--side-primary", safeHex(meta.primaryColor, "#167052"));
  tab.style.setProperty("--side-secondary", safeHex(meta.secondaryColor, "#b67a14"));
}

function teamRecordTableHtml(side, compact = false) {
  const rows = teamMetaForSide(side).records || [];
  const visibleRows = rows.filter((row) => row.season || row.overall || row.conference);
  if (!visibleRows.length) return compact ? "" : `<p class="meta">Add prior records in Setup.</p>`;
  return `
    <div class="team-record-history">
      <table>
        <thead><tr><th>Season</th><th>Overall</th><th>Conf</th></tr></thead>
        <tbody>
          ${visibleRows.map((row) => `<tr><td>${escapeHtml(row.season)}</td><td>${escapeHtml(row.overall)}</td><td>${escapeHtml(row.conference)}</td></tr>`).join("")}
        </tbody>
      </table>
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
          <div>
            <strong>${escapeHtml(coach.name || "Coach")}</strong>
            <span>${escapeHtml(coach.title || "")}</span>
            ${coach.bio ? `<details class="coach-bio-details"><summary>Bio</summary><p>${escapeHtml(coach.bio)}</p></details>` : ""}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function teamSnapshotHeaderHtml(side) {
  const meta = teamMetaForSide(side);
  const name = sideLabel(side);
  const title = [name, meta.mascot].filter(Boolean).join(" ");
  return `
    <div class="team-snapshot-identity" style="${teamColorStyle(side)}">
      <div class="team-logo-box display-only">
        ${meta.logo
          ? `<img src="${escapeHtml(meta.logo)}" alt="${escapeHtml(name)} logo" />`
          : `<span>${escapeHtml(teamInitials(name))}</span>`}
      </div>
      <div class="team-snapshot-copy">
        <strong>${escapeHtml(title || name)}</strong>
        <span>${escapeHtml([meta.location, meta.abbreviation].filter(Boolean).join(" | "))}</span>
        <em>${escapeHtml([meta.overallRecord, meta.conferenceRecord ? `(${meta.conferenceRecord})` : ""].filter(Boolean).join(" ") || "Record not set")}</em>
        ${meta.institutionInfo ? `<p>${escapeHtml(meta.institutionInfo)}</p>` : ""}
      </div>
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
        { label: "Players", value: players.length },
        { label: "AVG", value: stats.AB ? battingRates.AVG : "-", type: "avg" },
        { label: "OBP", value: obpDenom ? battingRates.OBP : "-", type: "obp" },
        { label: "SLG%", value: stats.AB ? battingRates.SLG : "-", type: "slg" },
        { label: "OPS", value: stats.AB && obpDenom ? battingRates.OPS : "-", type: "ops" },
        { label: "PA", value: pa },
        { label: "AB", value: stats.AB },
        { label: "R", value: stats.R, type: "count" },
        { label: "H", value: stats.H, type: "count" },
        { label: "2B", value: stats["2B"], type: "count" },
        { label: "3B", value: stats["3B"], type: "count" },
        { label: "HR", value: stats.HR, type: "count" },
        { label: "RBI", value: stats.RBI, type: "count" },
        { label: "BB", value: stats.BB },
        { label: "SO", value: stats.SO },
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
        { label: "Staff ERA", value: hasStaffPitching && ipToOuts(stats.IP) ? formatFixed(stats.ERA, 2) : "-", type: "era" },
        { label: "WHIP", value: hasStaffPitching && ipToOuts(stats.IP) ? formatFixed(stats.WHIP, 2) : "-", type: "whip" },
        { label: "P AVG", value: hasStaffPitching && (stats.P_AB || stats.BF) ? formatRate(toNumber(stats.BAA)) : "-", type: "baa" },
        { label: "W/L", value: `${stats.W || 0}/${stats.L || 0}` },
        { label: "GP/GS", value: `${stats.GP || 0}/${stats.GS || 0}` },
        { label: "SV", value: stats.SV || 0 },
        { label: "CG", value: stats.CG || 0 },
        { label: "SHO", value: stats.SHO || 0 },
        { label: "H", value: stats.P_H || 0 },
        { label: "R", value: stats.P_R || 0 },
        { label: "ER", value: stats.P_ER || 0 },
        { label: "BB", value: stats.P_BB || 0 },
        { label: "SO", value: stats.P_SO || 0 },
        { label: "HR", value: stats.P_HR || 0 },
        { label: "HBP", value: stats.P_HBP || 0 },
        { label: "WP", value: stats.P_WP || 0 },
        { label: "BK", value: stats.P_BK || 0 }
      ]
    },
    {
      title: "Base Running",
      pills: [
        { label: "SB", value: stats.SB || 0 },
        { label: "CS", value: stats.CS || 0 },
        { label: "SB%", value: sbAttempts ? percentValue(stats.SB, sbAttempts) : "-" },
        { label: "SBA", value: stats.SBA || 0 },
        { label: "RCS", value: stats.RCS || 0 },
        { label: "RCS%", value: caughtStealAttempts ? percentValue(stats.RCS, caughtStealAttempts) : "-" }
      ]
    },
    {
      title: "Fielding",
      pills: [
        { label: "F%", value: fieldingPct },
        { label: "TC", value: stats.TC || 0 },
        { label: "PO", value: stats.PO || 0 },
        { label: "A", value: stats.A || 0 },
        { label: "E", value: errors },
        { label: "DP", value: stats.DP || 0 },
        { label: "PB", value: stats.PB || 0 },
        { label: "CI", value: stats.CI || 0 }
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
  if (kind === "pitcher" && requested === "currentgame") return "currentgame";
  if (requested === "conference" && hasConferenceStats(player, kind)) return "conference";
  if (requested === "nonconference" && hasNonConferenceStats(player, kind)) return "nonconference";
  return "overall";
}

function hudStatsFor(player, kind) {
  const scope = selectedHudStatScope(kind, player);
  if (scope === "nonconference") return nonConferenceStatsFor(player);
  const source = scope === "conference" ? player?.confStats : player?.stats;
  return { ...emptyStats(), ...(source || {}) };
}

function hudScopeToggleHtml(kind, player) {
  const selected = selectedHudStatScope(kind, player);
  const canUseConference = hasConferenceStats(player, kind);
  const canUseNonConference = hasNonConferenceStats(player, kind);
  const label = kind === "pitcher" ? "Pitcher stats scope" : "Batter stats scope";
  const side = player?.side || state.activeSide;
  return `
    <div class="hud-scope-toggle" role="group" aria-label="${label}" style="${teamColorStyle(side)}">
      ${kind === "pitcher" ? `<button type="button" data-hud-stat-kind="${kind}" data-hud-stat-scope="currentgame" class="${selected === "currentgame" ? "active" : ""}">CURRENT GAME</button>` : ""}
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-scope="overall" class="${selected === "overall" ? "active" : ""}">OVERALL</button>
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-scope="conference" class="${selected === "conference" ? "active" : ""}" ${canUseConference ? "" : "disabled"} title="${canUseConference ? "Show conference stats" : "No conference stats imported"}">CONF</button>
      <button type="button" data-hud-stat-kind="${kind}" data-hud-stat-scope="nonconference" class="${selected === "nonconference" ? "active" : ""}" ${canUseNonConference ? "" : "disabled"} title="${canUseNonConference ? "Show overall minus conference stats" : "Overall and conference stats are needed"}">NON-CONF</button>
    </div>
  `;
}

function applyHudStatScopeFromEvent(event) {
  const button = event.target.closest("[data-hud-stat-scope]");
  if (!button || button.disabled) return false;
  const kind = button.dataset.hudStatKind;
  const scope = button.dataset.hudStatScope;
  if (!["batter", "pitcher"].includes(kind) || !["overall", "conference", "nonconference", "currentgame"].includes(scope)) return false;
  if (kind !== "pitcher" && scope === "currentgame") return false;
  state.hudStatScopes = state.hudStatScopes || { batter: "overall", pitcher: "overall" };
  state.hudStatScopes[kind] = scope;
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
  const currentContextPills = currentGameBatterSpecialPills(player.id);
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
    <div class="batter-detail-card" style="${teamColorStyle(player.side || state.activeSide)}">
      <div class="compact-player-identity">
        <strong>${escapeHtml(displayName)}</strong>
        <span>${escapeHtml(player.pronunciation || "No pronunciation provided")}</span>
        <span>${escapeHtml(playerMeta)}</span>
        <span>${escapeHtml(player.hometown || "No hometown provided")}</span>
        ${hudScopeToggleHtml("batter", player)}
      </div>
      <div class="compact-batter-line">
        ${renderPillRow(batterPillRows[0], "batter-season-row batter-season-row-top")}
        ${renderPillRow(batterPillRows[1], "batter-season-row batter-season-row-bottom")}
      </div>
      <div class="compact-analytics-line">
        ${currentContextPills.map(statPill).join("")}
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
        ${hudScopeToggleHtml("batter", player)}
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
    const runnerId = chart.baseState[base];
    const slot = slotForRunnerId(runnerId);
    const player = playerById(runnerId);
    return { base, player, runnerId, slot };
  });
  const pitcher = state.players.find((player) => player.id === chart.activePitcherId);
  const liveLine = getPitchingLine(chart);
  const pitcherStats = pitcher ? hudStatsFor(pitcher, "pitcher") : null;
  const pitcherScope = pitcher ? selectedHudStatScope("pitcher", pitcher) : "overall";
  const pitcherPills = pitcherScope === "currentgame" ? currentPitcherPills(liveLine) : seasonPitcherPills(pitcherStats || emptyStats());
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
        ${hudScopeToggleHtml("pitcher", pitcher)}
        ${pitcherPills.map(statPill).join("")}
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
      <button type="button" data-pitch="ball">Ball</button>
      <button type="button" data-pitch="strike">Strike</button>
      <button type="button" data-pitch="foul">Foul</button>
      <button type="button" data-pitch="balk">Balk</button>
    </div>
    <div class="result-buttons">
      <div class="result-button-row result-button-row-4">
        ${["HBP", "KWP", "KPB", "CI"].map(actionButtonHtml).join("")}
      </div>
      <div class="result-button-row result-button-row-2">
        ${["BI", "OUT"].map(actionButtonHtml).join("")}
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

  return `
    <div class="${cellClasses.join(" ")}" data-score-cell="${cellKey}">
      ${displacedBadge}
      <div class="score-ab-controls">
        <button type="button" class="muted add-ab-button" data-add-ab-for="${baseCellKey}" title="Add extra at-bat for this inning">+ AB</button>
        ${abSelector}
      </div>
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
        <button type="button" data-move-next-inning="${inning}">Move to next inning</button>
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
        <span>${escapeHtml(sideLabel(snapshotSide))}</span>
      </div>
      ${teamSnapshotHeaderHtml(snapshotSide)}
      <div class="team-snapshot-divider"></div>
      ${meta.showRecords ? teamRecordTableHtml(snapshotSide, true) : ""}
      ${meta.showCoaches ? teamCoachesHtml(snapshotSide) : ""}
    </section>
    ${meta.showSnapshot ? `
      <section class="hud-panel team-stats-hud" style="${teamColorStyle(snapshotSide)}">
        <div class="hud-title">
          <h2>Team Stats</h2>
          <span>${escapeHtml(teamAbbreviation(snapshotSide))}</span>
        </div>
        <div class="team-snapshot-stat-groups">${teamSnapshotGroupsHtml(snapshotSide)}</div>
      </section>
    ` : ""}
  `;
}

const defensePositions = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"];

function defensePlayerLabel(playerId) {
  const player = state.players.find((item) => item.id === playerId);
  return player ? `#${player.number} ${fullName(player)}` : "--";
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
  return `
    <div class="defense-diamond ${editable ? "editable" : "display"}">
      ${defensePositions.map((pos) => {
        const selected = pos === "P" ? activePitcher : chart.hud.defense[pos];
        const label = pos === "P" ? defensePlayerLabel(activePitcher) : defensePlayerLabel(selected);
        return `
          <label class="def-pos pos-${pos.replace("1", "one").replace("2", "two").replace("3", "three")}">
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
      <span>Pitcher follows the active pitcher selected on the Pitching tab.</span>
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

function render() {
  applyActiveTeamColors();
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
  ["IP", "ERA", "WHIP", "W", "L", "GS", "BF", "P_H", "P_R", "P_ER", "P_HR", "P_BB", "P_SO", "P_HBP", "P_WP", "P_BK", "BAA", "Pitches"].forEach((key) => {
    const input = document.querySelector(`#stat${CSS.escape(key)}`);
    if (input) input.value = stats[key] || 0;
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
  ["IP", "ERA", "WHIP", "W", "L", "GS", "BF", "P_H", "P_R", "P_ER", "P_HR", "P_BB", "P_SO", "P_HBP", "P_WP", "P_BK", "BAA", "Pitches"].forEach((key) => {
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
    side: existing?.side || state.activeSide,
    stats,
    confStats: existing?.confStats || emptyStats()
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
  if (type !== "balk") cell.count = `${balls}-${strikes}`;

  let pitchDelta = null;
  if (chart.activePitcherId) {
    const updates = {};
    if (type === "balk") {
      updates.BK = 1;
    } else {
      chart.pitchCounts[chart.activePitcherId] = (chart.pitchCounts[chart.activePitcherId] || 0) + 1;
      updates.pitches = 1;
      if (type === "ball") updates.balls = 1;
      if (type === "foul") updates.fouls = 1;
      if (type === "strike" || type === "foul") updates.strikes = 1;
      if (strikesRaw >= 2) updates.twoStrikePitches = 1;
    }
    addToPitchingLine(chart.activePitcherId, updates);
    cell.pitchDeltas = cell.pitchDeltas || [];
    pitchDelta = { pitcherId: chart.activePitcherId, type, updates };
    cell.pitchDeltas.push(pitchDelta);
  }

  const pitchEvent = {
    id: uid("pitch"),
    pitcherId: chart.activePitcherId,
    type,
    cellKey,
    count: cell.count || "0-0",
    createdAt: new Date().toISOString()
  };
  chart.pitchLog.unshift(pitchEvent);
  cell.pitchDeltas = cell.pitchDeltas || [];
  if (pitchDelta) pitchDelta.id = pitchEvent.id;
  else cell.pitchDeltas.push({ id: pitchEvent.id, pitcherId: chart.activePitcherId, type });

  if (type === "balk") return;

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
  const batterId = batterIdAtSlot(slot);
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
  const liveRunnerId = batterTerminal && batterTerminal !== "toHome" ? (runnerIdAtSlot(slot) || batterId) : batterId;
  if (liveRunnerId) cell.runnerId = liveRunnerId;
  else delete cell.runnerId;
  setBatterBaseState(chart, liveRunnerId, batterTerminal === "toHome" ? "" : batterTerminal);

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
  if (event) {
    const chargedRuns = pitcherRunsForAction(actionKey, event.rbi);
    const earnedRuns = pitcherEarnedRunsForAction(actionKey, event.rbi);
    if (chargedRuns) pitcherUpdates.R = chargedRuns;
    if (earnedRuns) pitcherUpdates.ER = earnedRuns;
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
  setSelectedAbForSlotInning(slot - 1, inning, Math.max(0, abNumber - 2), chart);
}

function clearActiveChartData() {
  const chart = activeChart();
  Object.keys(chart.scorecard || {}).forEach((cellKey) => {
    reverseChartCell(cellKey);
  });
  state.events.forEach((event) => applyEvent(event, -1));
  state.events = [];
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

  if (els.teamProfilePanel) {
    els.teamProfilePanel.addEventListener("input", (event) => {
      const metaSide = event.target.dataset.teamMetaSide;
      const metaField = event.target.dataset.teamMetaField;
      const recordSide = event.target.dataset.teamRecordSide;
      const coachSide = event.target.dataset.coachSide;
      const chartHudField = event.target.dataset.chartHudField;
      if (metaSide && metaField) {
        teamMetaForSide(metaSide)[metaField] = event.target.value;
        if (metaField === "primaryColor" || metaField === "secondaryColor") {
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
    const teamMetaSide = event.target.dataset.teamMetaSide;
    const teamMetaField = event.target.dataset.teamMetaField;
    if (hudField) chart.hud[hudField] = event.target.value;
    if (defensePos) chart.hud.defense[defensePos] = event.target.value;
    if (teamMetaSide && teamMetaField) teamMetaForSide(teamMetaSide)[teamMetaField] = event.target.value;
    saveState();
  });

  if (els.defenseEditor) {
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
    applyHudStatScopeFromEvent(event);
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
    if (applyHudStatScopeFromEvent(event)) return;
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
    const chart = state.charts[state.fullChartSide || state.activeSide] || activeChart();
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
        chart.completedInnings[confirmInning] = true;
        delete chart.editingCompletedInnings[confirmInning];
      }
      if (moveNextInning) {
        chart.completedInnings[moveNextInning] = true;
        delete chart.editingCompletedInnings[moveNextInning];
        if (Number(moveNextInning) < Number(state.inningCount || 9)) {
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
