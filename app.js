const VALUE_ORDER = [2, 3, 4, 5, 6, 1];
const VALUE_RANK = new Map(VALUE_ORDER.map((value, index) => [value, index + 1]));
const DEFAULT_SINGULAR_NAMES = {
  1: "as",
  2: "pato",
  3: "trica",
  4: "cuadra",
  5: "china",
  6: "sena"
};
const BOT_NAMES = [
  "Mateo",
  "Lucia",
  "Diego",
  "Valeria",
  "Andres",
  "Camila",
  "Renato",
  "Sofia"
];
const SPEEDS = {
  slow: 2.6,
  normal: 1.9,
  fast: 1.25
};
const USER_STORAGE_KEY = "cachito-user";
const SESSION_STORAGE_KEY = "cachito-last-session";
const PREF_STORAGE_KEY = "cachito-preferences";
const GAME_TYPE_LABELS = {
  callao: "Callao",
  tortuga: "Tortuga",
  "ojos-azules": "Ojos azules"
};
const LEARN_MODE_LABELS = {
  recognize: "Reconocer jugada",
  stand: "Cuando plantarme",
  beat: "Vencer al enemigo"
};

const state = {
  user: null,
  rooms: [],
  currentRoom: null,
  config: null,
  players: [],
  round: 0,
  starterIndex: 0,
  turnIndex: 0,
  rollLimit: null,
  currentRolls: 0,
  dice: [],
  held: [],
  lockedHeld: [],
  botChoosingHeld: [],
  results: [],
  activeMark: null,
  challengeTeam: null,
  usedPlayers: new Set(),
  starterRolls: {},
  starterRanks: {},
  starterRollingIds: new Set(),
  starterCelebratingId: null,
  lastRoundWinnerId: null,
  lastRoundWinningTeam: null,
  teamWins: { A: 0, B: 0 },
  matchOver: false,
  revealAllDice: false,
  revealedCards: new Set(),
  gameType: "callao",
  speed: "normal",
  gameToken: 0,
  inGame: false,
  roundOver: false,
  busy: false,
  learnStats: { wins: 0, losses: 0 },
  learnAdvice: "",
  recognize: {
    options: [],
    correctKey: "",
    selectedKey: "",
    answered: false,
    feedback: ""
  },
  beat: {
    target: null,
    feedback: ""
  }
};

const panels = {
  login: document.querySelector("#loginPanel"),
  lobby: document.querySelector("#lobbyPanel"),
  room: document.querySelector("#roomPanel"),
  game: document.querySelector("#gamePanel")
};

const loginForm = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const userTitle = document.querySelector("#userTitle");
const userNameEditInput = document.querySelector("#userNameEditInput");
const logoutBtn = document.querySelector("#logoutBtn");
const saveUserEditBtn = document.querySelector("#saveUserEditBtn");
const cancelUserEditBtn = document.querySelector("#cancelUserEditBtn");
const gameTypePicker = document.querySelector(".game-type-picker");
const learnModeBtn = document.querySelector("#learnModeBtn");
const practiceModeBtn = document.querySelector("#practiceModeBtn");
const multiplayerModeBtn = document.querySelector("#multiplayerModeBtn");
const learnPanel = document.querySelector("#learnPanel");
const practicePanel = document.querySelector("#practicePanel");
const multiplayerPanel = document.querySelector("#multiplayerPanel");
const learnActions = document.querySelector(".learn-actions");
const practiceIndividualBtn = document.querySelector("#practiceIndividualBtn");
const practiceTeamsBtn = document.querySelector("#practiceTeamsBtn");
const practicePlayersInput = document.querySelector("#practicePlayersInput");
const guideBtn = document.querySelector("#guideBtn");
const guideModal = document.querySelector("#guideModal");
const guideCloseBtn = document.querySelector("#guideCloseBtn");
const openCreateRoomBtn = document.querySelector("#openCreateRoomBtn");
const createRoomModal = document.querySelector("#createRoomModal");
const closeCreateRoomBtn = document.querySelector("#closeCreateRoomBtn");
const createRoomForm = document.querySelector("#createRoomForm");
const roomNameInput = document.querySelector("#roomNameInput");
const roomVisibilityInput = document.querySelector("#roomVisibilityInput");
const roomPasswordInput = document.querySelector("#roomPasswordInput");
const roomModeInput = document.querySelector("#roomModeInput");
const roomDiceInput = document.querySelector("#roomDiceInput");
const roomTargetWinsInput = document.querySelector("#roomTargetWinsInput");
const roomDirectionInput = document.querySelector("#roomDirectionInput");
const singularNamesEditor = document.querySelector("#singularNamesEditor");
const roomsList = document.querySelector("#roomsList");
const roomCountLabel = document.querySelector("#roomCountLabel");
const roomTitle = document.querySelector("#roomTitle");
const roomVisibilityLabel = document.querySelector("#roomVisibilityLabel");
const roomModeText = document.querySelector("#roomModeText");
const roomDiceText = document.querySelector("#roomDiceText");
const roomTargetText = document.querySelector("#roomTargetText");
const roomDirectionText = document.querySelector("#roomDirectionText");
const roomNamesText = document.querySelector("#roomNamesText");
const roomStatusText = document.querySelector("#roomStatusText");
const seatsBoard = document.querySelector("#seatsBoard");
const backToLobbyBtn = document.querySelector("#backToLobbyBtn");
const startMatchBtn = document.querySelector("#startMatchBtn");
const leftPlayers = document.querySelector("#leftPlayers");
const rightPlayers = document.querySelector("#rightPlayers");
const leftPlayersTitle = document.querySelector("#leftPlayersTitle");
const rightPlayersTitle = document.querySelector("#rightPlayersTitle");
const roundTitle = document.querySelector("#roundTitle");
const modeLabel = document.querySelector("#modeLabel");
const statusText = document.querySelector("#statusText");
const gameStatusBar = document.querySelector(".game-panel .status-bar");
const currentMarkBox = document.querySelector("#currentMark");
const currentMark = document.querySelector("#currentMark strong");
const speedInput = document.querySelector("#speedInput");
const topbarMenu = document.querySelector(".game-panel .topbar-menu");
const turnPlayer = document.querySelector("#turnPlayer");
const turnHint = document.querySelector("#turnHint");
const heldDiceRow = document.querySelector("#heldDiceRow");
const rollingDiceRow = document.querySelector("#rollingDiceRow");
const recognizePanel = document.querySelector("#recognizePanel");
const recognizeOptions = document.querySelector("#recognizeOptions");
const recognizeFeedback = document.querySelector("#recognizeFeedback");
const recognizeNextBtn = document.querySelector("#recognizeNextBtn");
const nextRoundStageBtn = document.querySelector("#nextRoundStageBtn");
const cup = document.querySelector("#cup");
const cupStage = document.querySelector("#cupStage");
const leaderMark = document.querySelector("#leaderMark");
const cachitoBurst = document.querySelector("#cachitoBurst");
const cachitoWinner = document.querySelector("#cachitoWinner");
const championBurst = document.querySelector("#championBurst");
const championWinner = document.querySelector("#championWinner");
const championMeta = document.querySelector("#championMeta");
const turnArrow = document.querySelector("#turnArrow");
const turnArrowPath = document.querySelector("#turnArrowPath");
const rollBtn = document.querySelector("#rollBtn");
const standBtn = document.querySelector("#standBtn");
const newRoundBtn = document.querySelector("#newRoundBtn");
const resetMatchBtn = document.querySelector("#resetMatchBtn");
const exitGameBtn = document.querySelector("#exitGameBtn");
const logToggleBtn = document.querySelector("#logToggleBtn");
const revealDiceBtn = document.querySelector("#revealDiceBtn");
const logCloseBtn = document.querySelector("#logCloseBtn");
const logOverlay = document.querySelector("#logOverlay");
const logList = document.querySelector("#logList");
let turnArrowTimer = null;

function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function normalizeUsername(value) {
  const text = String(value || "").trim() || "Jugador";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18) || "jugador";
}

function defaultUser() {
  return {
    id: "local-player",
    username: "jugador",
    name: "Jugador",
    password: ""
  };
}

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user || typeof user !== "object") return null;
    const name = String(user.name || user.username || "Jugador").trim() || "Jugador";
    return {
      id: user.id || "local-player",
      username: normalizeUsername(user.username || name),
      name,
      password: user.password || ""
    };
  } catch {
    return null;
  }
}

function saveUser(user) {
  try {
    const { id, username, name } = user;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ id, username, name }));
  } catch {
    // Si localStorage esta bloqueado, la app funciona con el usuario en memoria.
  }
}

function saveSession(session) {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // La sesion solo mejora el refresco; si falla, la app sigue normal.
  }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify({ ...(loadPrefs() || {}), ...prefs }));
  } catch {
    // Preferencias no criticas.
  }
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function ensureUser() {
  if (!state.user) {
    state.user = loadStoredUser() || defaultUser();
    saveUser(state.user);
  }
  usernameInput.value = state.user.name;
  passwordInput.value = state.user.password || "";
  return state.user;
}

function selectGameType(type, options = {}) {
  state.gameType = type || "callao";
  gameTypePicker.querySelectorAll("[data-game-type]").forEach((button) => {
    const active = button.dataset.gameType === state.gameType;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (options.persist !== false) savePrefs({ gameType: state.gameType });
}

function renderUserSummary(editing = false) {
  ensureUser();
  userTitle.textContent = state.user.name;
  userNameEditInput.value = state.user.name;
  userTitle.classList.toggle("hidden", editing);
  userNameEditInput.classList.toggle("hidden", !editing);
  logoutBtn.classList.toggle("hidden", editing);
  saveUserEditBtn.classList.toggle("hidden", !editing);
  cancelUserEditBtn.classList.toggle("hidden", !editing);
  if (editing) {
    userNameEditInput.focus();
    userNameEditInput.select();
  }
}

function openUserEditor() {
  renderUserSummary(true);
}

function saveUserEditor() {
  const name = userNameEditInput.value.trim() || "Jugador";
  state.user = {
    ...ensureUser(),
    name,
    username: normalizeUsername(name)
  };
  saveUser(state.user);
  renderLobby();
  renderUserSummary(false);
}

function cancelUserEditor() {
  renderUserSummary(false);
}

function setLobbyMode(mode, options = {}) {
  const isLearn = mode === "learn";
  learnModeBtn.classList.toggle("active", isLearn);
  practiceModeBtn.classList.toggle("active", !isLearn);
  multiplayerModeBtn.classList.remove("active");
  learnPanel.classList.toggle("hidden", !isLearn);
  practicePanel.classList.toggle("hidden", isLearn);
  multiplayerPanel.classList.add("hidden");
  if (options.persist !== false) savePrefs({ lobbyMode: isLearn ? "learn" : "practice" });
}

const ROUTES = {
  login: "login.html",
  lobby: "lobby.html",
  game: "play.html"
};

function appBasePath() {
  let path = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
  const lastSegment = path.split("/").pop();
  if (Object.values(ROUTES).includes(lastSegment) || ["login", "lobby", "play"].includes(lastSegment)) {
    path = path.slice(0, -(lastSegment.length + 1)) || "";
  }
  const cachitoIndex = path.lastIndexOf("/cachito");
  if (cachitoIndex >= 0) return path.slice(0, cachitoIndex + "/cachito".length);
  return path;
}

function routeToPanel() {
  const queryRoute = new URLSearchParams(window.location.search).get("route");
  if (queryRoute === "play") return "game";
  if (queryRoute === "lobby") return "lobby";
  if (queryRoute === "login") return "login";
  const cleanPath = window.location.pathname.replace(/\/$/, "");
  const segment = cleanPath.split("/").pop();
  if (segment === "play" || segment === "play.html") return "game";
  if (segment === "lobby" || segment === "lobby.html") return "lobby";
  return "login";
}

function updateRoute(name, replace = false) {
  const route = ROUTES[name];
  if (!route) return;
  const nextPath = `${appBasePath()}/${route}`;
  if (window.location.pathname === nextPath) return;
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({ panel: name }, "", nextPath);
}

function showPanel(name, options = {}) {
  Object.entries(panels).forEach(([key, panel]) => {
    panel.classList.toggle("hidden", key !== name);
  });
  if (options.route !== false) updateRoute(name, Boolean(options.replace));
}

function openModal(modal) {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function pluralizeName(name) {
  const clean = name.trim().toLowerCase();
  if (!clean) return "";
  if (clean.endsWith("s")) return clean;
  if (clean.endsWith("z")) return `${clean.slice(0, -1)}ces`;
  if ("aeiou".includes(clean.at(-1))) return `${clean}s`;
  return `${clean}es`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makeNamesEditor() {
  singularNamesEditor.innerHTML = "";
  [1, 2, 3, 4, 5, 6].forEach((value) => {
    const label = document.createElement("label");
    label.innerHTML = `${value}
      <input class="group-name" data-value="${value}" value="${DEFAULT_SINGULAR_NAMES[value]}">
    `;
    singularNamesEditor.appendChild(label);
  });
}

function readNames() {
  const singular = {};
  const plural = {};
  singularNamesEditor.querySelectorAll(".group-name").forEach((input) => {
    const value = Number(input.dataset.value);
    const name = input.value.trim() || DEFAULT_SINGULAR_NAMES[value];
    singular[value] = name;
    plural[value] = pluralizeName(name);
  });
  return { singular, plural };
}

function defaultNames() {
  const singular = { ...DEFAULT_SINGULAR_NAMES };
  const plural = {};
  Object.entries(singular).forEach(([value, name]) => {
    plural[value] = pluralizeName(name);
  });
  return { singular, plural };
}

function login(event) {
  event.preventDefault();
  const name = usernameInput.value.trim() || "Jugador";
  state.user = {
    id: state.user?.id || "local-player",
    username: normalizeUsername(name),
    name,
    password: passwordInput.value
  };
  saveUser(state.user);
  renderLobby();
  showPanel("lobby");
}

function logout() {
  ensureUser();
  usernameInput.focus();
  showPanel("login");
}

function practiceSeatCount(mode) {
  const raw = Number(practicePlayersInput.value);
  if (mode === "teams") return Math.max(1, Math.min(4, raw || 3)) * 2;
  return Math.max(2, Math.min(8, raw || 5));
}

function makeDefaultRoom(mode = "classic", source = "practice", seatCount = mode === "teams" ? 6 : 5) {
  const room = {
    id: `${source}-${Date.now()}`,
    name: mode === "teams" ? "Practica por equipos" : "Practica individual",
    visibility: source === "practice" ? "practice" : "public",
    password: "",
    mode,
    gameType: state.gameType,
    diceCount: 5,
    targetWins: 5,
    direction: "right",
    names: defaultNames(),
    hostId: state.user.id,
    seats: makeSeats(mode, seatCount)
  };

  room.seats[0] = {
    id: "seat-1",
    type: "human",
    status: "filled",
    userId: state.user.id,
    name: state.user.name,
    username: state.user.username,
    team: mode === "teams" ? "A" : null
  };

  return room;
}

async function startLearn(mode) {
  setLobbyMode("learn");
  const label = LEARN_MODE_LABELS[mode] || "Aprender";
  const gameType = GAME_TYPE_LABELS[state.gameType] || "Callao";
  const soloLearn = mode === "recognize" || mode === "stand" || mode === "beat";
  const room = makeDefaultRoom("classic", "learn", soloLearn ? 1 : 2);
  room.name = `Aprender ${gameType}: ${label}`;
  room.source = "learn";
  room.learnMode = mode;
  room.gameType = state.gameType;
  room.targetWins = 1;
  if (!soloLearn) {
    room.seats[1] = {
      id: "seat-2",
      type: "bot",
      status: "filled",
      userId: "learn-rival",
      name: mode === "beat" ? "Rival" : "Guia",
      username: mode === "beat" ? "rival" : "guia",
      team: null
    };
  }
  saveSession({ screen: "game", source: "learn", learnMode: mode, gameType: state.gameType });
  state.learnStats = { wins: 0, losses: 0 };
  state.learnAdvice = "";
  state.currentRoom = room;
  await startMatch();
}

async function startPractice(mode) {
  setLobbyMode("practice");
  saveSession({ screen: "game", source: "practice", mode, gameType: state.gameType });
  state.currentRoom = makeDefaultRoom(mode, "practice", practiceSeatCount(mode));
  await startMatch();
}

async function restoreSavedGameSession(session) {
  if (!session || session.screen !== "game") return false;
  selectGameType(session.gameType || "callao", { persist: false });
  if (session.source === "learn" && session.learnMode) {
    await startLearn(session.learnMode);
    return true;
  }
  if (session.source === "practice") {
    await startPractice(session.mode || "classic");
    return true;
  }
  return false;
}

function createRoom(event) {
  event.preventDefault();
  const mode = roomModeInput.value;
  const seatCount = mode === "teams" ? 6 : 5;
  const names = readNames();
  const room = {
    id: `sala-${Date.now()}`,
    name: roomNameInput.value.trim() || "Sala San Juan",
    visibility: roomVisibilityInput.value,
    password: roomVisibilityInput.value === "private" ? roomPasswordInput.value.trim() : "",
    mode,
    gameType: state.gameType,
    diceCount: Number(roomDiceInput.value) || 5,
    targetWins: Number(roomTargetWinsInput.value) || 5,
    direction: roomDirectionInput.value,
    names,
    hostId: state.user.id,
    seats: makeSeats(mode, seatCount)
  };

  room.seats[0] = {
    id: "seat-1",
    type: "human",
    status: "filled",
    userId: state.user.id,
    name: state.user.name,
    username: state.user.username,
    team: mode === "teams" ? "A" : null
  };

  state.rooms.unshift(room);
  state.currentRoom = room;
  closeModal(createRoomModal);
  renderLobby();
  renderRoom();
  showPanel("room");
}

function makeSeats(mode, count) {
  const teamSplit = Math.ceil(count / 2);
  return Array.from({ length: count }, (_, index) => ({
    id: `seat-${index + 1}`,
    type: "bot",
    status: "filled",
    userId: `bot-seat-${index + 1}`,
    name: botName(index),
    username: `bot${index + 1}`,
    team: mode === "teams" ? index < teamSplit ? "A" : "B" : null
  }));
}

function botName(index) {
  return BOT_NAMES[index % BOT_NAMES.length];
}

function renderLobby() {
  renderUserSummary(false);
  roomCountLabel.textContent = `${state.rooms.length} sala${state.rooms.length === 1 ? "" : "s"}`;
  roomsList.innerHTML = "";

  if (!state.rooms.length) {
    const empty = document.createElement("article");
    empty.className = "room-card";
    empty.innerHTML = "<h4>No hay salas aun</h4><p>Crea una para empezar localmente.</p>";
    roomsList.appendChild(empty);
    return;
  }

  state.rooms.forEach((room) => {
    const filled = room.seats.filter((seat) => seat.status === "filled").length;
    const card = document.createElement("article");
    card.className = "room-card";
    card.innerHTML = `
      <h4>${escapeHtml(room.name)}</h4>
      <p>${room.mode === "teams" ? "3 vs 3" : "Todos contra todos"} / ${filled}/${room.seats.length} jugadores / ${room.visibility === "private" ? "privada" : "publica"}</p>
      <button type="button">Entrar</button>
    `;
    card.querySelector("button").addEventListener("click", () => enterRoom(room.id));
    roomsList.appendChild(card);
  });
}

function enterRoom(roomId) {
  const room = state.rooms.find((item) => item.id === roomId);
  if (!room) return;
  state.currentRoom = room;
  renderRoom();
  showPanel("room");
}

function renderRoom() {
  const room = state.currentRoom;
  if (!room) return;
  const filled = room.seats.filter((seat) => seat.status === "filled").length;
  roomTitle.textContent = room.name;
  roomVisibilityLabel.textContent = room.visibility === "private" ? "Privada" : "Publica";
  roomModeText.textContent = room.mode === "teams" ? "3 vs 3" : "Todos contra todos";
  roomDiceText.textContent = `${room.diceCount} dados`;
  roomTargetText.textContent = `${room.targetWins} victoria${room.targetWins === 1 ? "" : "s"}`;
  roomDirectionText.textContent = room.direction === "right" ? "Derecha" : "Izquierda";
  roomNamesText.textContent = VALUE_ORDER.map((value) => room.names.plural[value]).join(", ");
  roomStatusText.textContent = filled === room.seats.length
    ? "La sala esta completa. Ya se puede empezar."
    : `Faltan ${room.seats.length - filled} puesto${room.seats.length - filled === 1 ? "" : "s"} por completar.`;
  startMatchBtn.disabled = filled !== room.seats.length;
  renderSeats(room);
}

function renderSeats(room) {
  seatsBoard.innerHTML = "";

  if (room.mode === "teams") {
    const left = makeSeatsColumn("Equipo A");
    const right = makeSeatsColumn("Equipo B");
    room.seats.forEach((seat, index) => {
      renderSeatCard(room, seat, index, seat.team === "A" ? left.list : right.list);
    });
    seatsBoard.append(left.section, right.section);
    return;
  }

  room.seats.forEach((seat, index) => renderSeatCard(room, seat, index, seatsBoard));
}

function makeSeatsColumn(title) {
  const section = document.createElement("section");
  section.className = "seats-team";
  section.innerHTML = `<h3>${title}</h3><div class="seats-list"></div>`;
  return { section, list: section.querySelector(".seats-list") };
}

function renderSeatCard(room, seat, index, target) {
    const card = document.createElement("article");
    card.className = `seat-card${seat.userId === state.user.id ? " host" : ""}${seat.status === "waiting" ? " waiting" : ""}`;
    const teamText = room.mode === "teams" ? ` / Equipo ${seat.team}` : "";
    const seatName = escapeHtml(seat.name || defaultSeatName(seat, index));
    const seatIcon = seatIconFor(seat.type);
    card.innerHTML = `
      <h4>Puesto ${index + 1}${teamText}</h4>
      <p>${seat.status === "filled" ? `<span class="name-line"><span class="type-badge ${seat.type}">${seatIcon}</span>${escapeHtml(seat.name)}</span>` : "Esperando jugador"}</p>
      <label>Tipo
        <select class="seat-type">
          <option value="human"${seat.type === "human" ? " selected" : ""}>Jugador</option>
          <option value="bot"${seat.type === "bot" ? " selected" : ""}>Bot</option>
        </select>
      </label>
      <label>Nombre
        <input class="seat-name" value="${seatName}">
      </label>
      <div class="seat-actions">
        <button class="fill-seat" type="button">${seat.type === "bot" ? "Agregar bot" : "Simular entrada"}</button>
        <button class="clear-seat" type="button"${index === 0 ? " disabled" : ""}>Vaciar</button>
      </div>
    `;
    const typeInput = card.querySelector(".seat-type");
    const nameInput = card.querySelector(".seat-name");
    typeInput.addEventListener("change", () => {
      seat.type = typeInput.value;
      if (seat.type === "bot") {
        seat.status = "filled";
        seat.name = botName(index);
        seat.username = `bot${index + 1}`;
        seat.userId = `bot-${seat.id}`;
      } else {
        seat.status = "waiting";
        seat.name = "";
        seat.username = "";
        seat.userId = null;
      }
      renderRoom();
    });
    card.querySelector(".fill-seat").addEventListener("click", () => fillSeat(seat, index, nameInput.value));
    card.querySelector(".clear-seat").addEventListener("click", () => clearSeat(seat));
    target.appendChild(card);
}

function defaultSeatName(seat, index) {
  if (seat.status === "filled" && seat.name) return seat.name;
  return seat.type === "bot" ? botName(index) : `Jugador ${index + 1}`;
}

function fillSeat(seat, index, rawName) {
  seat.status = "filled";
  seat.name = rawName.trim() || defaultSeatName(seat, index);
  seat.username = seat.type === "bot" ? `bot${index + 1}` : `jugador${index + 1}`;
  seat.userId = seat.type === "bot" ? `bot-${seat.id}` : `human-${seat.id}`;
  renderRoom();
}

function clearSeat(seat) {
  if (seat.userId === state.user.id) return;
  seat.status = "waiting";
  seat.name = "";
  seat.username = "";
  seat.userId = null;
  renderRoom();
}

async function startMatch() {
  const room = state.currentRoom;
  if (!room) return;
  startMatchBtn.disabled = true;
  state.gameToken += 1;
  state.inGame = true;
  const token = state.gameToken;
  setupMatchFromRoom(room);
  logList.innerHTML = "";
  addLog(`Sala ${room.name} lista.`);
  renderGameHeaderMeta();
  cupStage.classList.remove("cup-collecting", "dice-emerging");
  cup.classList.remove("collecting", "covering", "shaking", "reveal");
  cachitoBurst.classList.remove("show");
  championBurst.classList.remove("show");
  if (revealDiceBtn) revealDiceBtn.textContent = "Ver dados";
  showPanel("game");
  state.busy = true;
  renderAll();
  if (state.config.source === "learn" && state.config.learnMode === "recognize") {
    startRecognizeExercise();
    return;
  }
  if (state.config.source === "learn" && state.config.learnMode === "stand") {
    startStandExercise();
    return;
  }
  if (state.config.source === "learn" && state.config.learnMode === "beat") {
    startBeatExercise();
    return;
  }
  statusText.textContent = "Sorteando quien empieza.";
  await determineStarter(token);
  if (!isActiveGame(token)) return;
  state.busy = false;
  startRound();
}

function setupMatchFromRoom(room) {
  state.config = {
    mode: room.mode,
    source: room.source || "practice",
    gameType: room.gameType || "callao",
    learnMode: room.learnMode || null,
    diceCount: room.diceCount,
    targetWins: room.targetWins,
    direction: room.direction,
    names: room.names.plural
  };
  state.players = room.seats.map((seat, index) => ({
    id: `p${index + 1}`,
    name: seat.name,
    username: seat.username,
    type: seat.type === "bot" ? "bot" : seat.userId === state.user.id ? "human" : "remote",
    team: seat.team,
    wins: 0
  }));
  resetMatchState();
}

function renderGameHeaderMeta() {
  const gameType = GAME_TYPE_LABELS[state.config?.gameType] || "Callao";
  panels.game.classList.toggle("learn-mode", state.config?.source === "learn");
  if (state.config?.source === "learn") {
    modeLabel.textContent = `Aprender ${gameType}`;
    roundTitle.textContent = modeTitle();
    return;
  }
  modeLabel.textContent = state.config?.mode === "teams" ? "Modalidad 3 vs 3" : "Todos contra todos";
  roundTitle.textContent = state.round > 0 ? `Ronda ${state.round}` : "";
}

function modeTitle() {
  if (state.config?.source === "learn") return LEARN_MODE_LABELS[state.config.learnMode] || "Callao";
  return state.round > 0 ? `Ronda ${state.round}` : "";
}

function resetMatchState() {
  state.round = 0;
  state.starterIndex = 0;
  state.turnIndex = 0;
  state.teamWins = { A: 0, B: 0 };
  state.lastRoundWinnerId = null;
  state.lastRoundWinningTeam = null;
  state.matchOver = false;
  state.revealAllDice = false;
  state.revealedCards = new Set();
  state.rollLimit = null;
  state.currentRolls = 0;
  state.dice = Array.from({ length: state.config.diceCount }, () => null);
  state.held = Array.from({ length: state.config.diceCount }, () => false);
  state.lockedHeld = Array.from({ length: state.config.diceCount }, () => false);
  state.botChoosingHeld = Array.from({ length: state.config.diceCount }, () => false);
  state.results = [];
  state.activeMark = null;
  state.challengeTeam = null;
  state.usedPlayers = new Set();
  state.starterRolls = {};
  state.starterRanks = {};
  state.starterRollingIds = new Set(state.players.map((player) => player.id));
  state.starterCelebratingId = null;
  state.roundOver = false;
  state.busy = false;
  state.players.forEach((player) => {
    player.wins = 0;
  });
}

async function resetMatch() {
  if (!state.currentRoom || !state.config) return;
  state.gameToken += 1;
  state.inGame = true;
  const token = state.gameToken;
  resetMatchState();
  logList.innerHTML = "";
  addLog("Partida reiniciada.");
  cupStage.classList.remove("cup-collecting", "dice-emerging");
  cup.classList.remove("collecting", "covering", "shaking", "reveal");
  cachitoBurst.classList.remove("show");
  championBurst.classList.remove("show");
  if (isRecognizeMode()) {
    startRecognizeExercise();
    return;
  }
  if (isStandLearnMode()) {
    startStandExercise();
    return;
  }
  if (isBeatLearnMode()) {
    startBeatExercise();
    return;
  }
  state.busy = true;
  renderAll();
  statusText.textContent = "Sorteando quien empieza.";
  await determineStarter(token);
  if (!isActiveGame(token)) return;
  state.busy = false;
  startRound();
}

function leaveGameToLobby() {
  state.inGame = false;
  state.gameToken += 1;
  state.busy = false;
  cupStage.classList.remove("cup-collecting", "dice-emerging");
  cup.classList.remove("collecting", "covering", "shaking", "reveal");
  const prefs = loadPrefs();
  if (prefs?.gameType) selectGameType(prefs.gameType, { persist: false });
  setLobbyMode(prefs?.lobbyMode || "practice", { persist: false });
  renderLobby();
  showPanel("lobby");
}

async function determineStarter(token = state.gameToken) {
  let candidates = [...state.players];
  let starter = null;
  do {
    if (!isActiveGame(token)) return;
    state.starterRollingIds = new Set(candidates.map((player) => player.id));
    renderPlayers();
    await wait(850);
    if (!isActiveGame(token)) return;
    const rolls = candidates.map((player) => ({ player, value: randomDie() }));
    rolls.forEach((roll) => {
      state.starterRolls[roll.player.id] = roll.value;
    });
    state.starterRollingIds = new Set();
    renderPlayers();
    await wait(850);
    if (!isActiveGame(token)) return;
    const max = Math.max(...rolls.map((roll) => roll.value));
    const tied = rolls.filter((roll) => roll.value === max).map((roll) => roll.player);
    addLog(`Sorteo: ${rolls.map((roll) => `${roll.player.name} saco ${roll.value}`).join(", ")}.`);
    if (tied.length === 1) {
      starter = tied[0];
    } else {
      candidates = tied;
      addLog(`Empate en ${max}. Vuelven a tirar: ${candidates.map((player) => player.name).join(", ")}.`);
      await wait(650);
    }
  } while (!starter);

  state.starterIndex = state.players.findIndex((player) => player.id === starter.id);
  assignStarterRanks();
  state.starterCelebratingId = starter.id;
  renderPlayers();
  await wait(1000);
  if (!isActiveGame(token)) return;
  state.starterCelebratingId = null;
  addLog(`${starter.name} empieza la partida.`);
  renderPlayers();
}

function assignStarterRanks() {
  state.starterRanks = {};
  const step = state.config.direction === "right" ? 1 : -1;
  let index = state.starterIndex;
  for (let rank = 1; rank <= state.players.length; rank += 1) {
    const player = state.players[index];
    state.starterRanks[player.id] = rank;
    index = (index + step + state.players.length) % state.players.length;
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, scaledDelay(ms)));
}

function scaledDelay(ms) {
  return Math.round(ms * (SPEEDS[state.speed] || SPEEDS.normal));
}

function gameTimeout(callback, ms) {
  return window.setTimeout(callback, scaledDelay(ms));
}

function updateSpeed() {
  const activeSpeed = speedInput.querySelector(".active")?.dataset.speed || "normal";
  state.speed = activeSpeed;
  const factor = SPEEDS[state.speed] || SPEEDS.normal;
  document.documentElement.style.setProperty("--die-roll-duration", `${Math.round(1280 * factor)}ms`);
  document.documentElement.style.setProperty("--cup-shake-duration", `${Math.round(1040 * factor)}ms`);
  document.documentElement.style.setProperty("--cup-collect-duration", `${Math.round(980 * factor)}ms`);
  document.documentElement.style.setProperty("--cup-reveal-duration", `${Math.round(1320 * factor)}ms`);
  document.documentElement.style.setProperty("--starter-roll-duration", `${Math.round(720 * factor)}ms`);
  document.documentElement.style.setProperty("--starter-pop-duration", `${Math.round(920 * factor)}ms`);
}

function selectSpeed(speed, options = {}) {
  const nextSpeed = SPEEDS[speed] ? speed : "normal";
  speedInput.querySelectorAll("[data-speed]").forEach((button) => {
    button.classList.toggle("active", button.dataset.speed === nextSpeed);
  });
  updateSpeed();
  if (options.persist !== false) savePrefs({ speed: state.speed });
}

function isActiveGame(token = state.gameToken) {
  return state.inGame && token === state.gameToken;
}

function startRound() {
  if (!isActiveGame() || state.matchOver) return;
  state.round += 1;
  state.turnIndex = state.starterIndex;
  state.rollLimit = null;
  state.results = [];
  state.activeMark = null;
  state.challengeTeam = null;
  state.usedPlayers = new Set();
  state.revealedCards = new Set();
  state.roundOver = false;
  assignStarterRanks();
  roundTitle.textContent = modeTitle();
  if (newRoundBtn) newRoundBtn.disabled = true;
  resetTurn();
  renderAll();
  addLog(`Ronda ${state.round} iniciada.`);
  maybeRunAutomaticPlayer();
}

function goToNextRound() {
  if (isRecognizeMode() && state.recognize.answered) {
    startRecognizeExercise();
    return;
  }
  if (isStandLearnMode() && state.roundOver) {
    startStandExercise();
    return;
  }
  if (isBeatLearnMode() && state.roundOver) {
    startBeatExercise();
    return;
  }
  if (!state.roundOver || state.matchOver) return;
  state.inGame = true;
  state.busy = false;
  startRound();
}

function resetTurn() {
  state.currentRolls = 0;
  state.dice = Array.from({ length: state.config.diceCount }, () => null);
  state.held = Array.from({ length: state.config.diceCount }, () => false);
  state.lockedHeld = Array.from({ length: state.config.diceCount }, () => false);
  state.botChoosingHeld = Array.from({ length: state.config.diceCount }, () => false);
}

function isRecognizeMode() {
  return state.config?.source === "learn" && state.config.learnMode === "recognize";
}

function isStandLearnMode() {
  return state.config?.source === "learn" && state.config.learnMode === "stand";
}

function isBeatLearnMode() {
  return state.config?.source === "learn" && state.config.learnMode === "beat";
}

function isCompactGameLayout() {
  return window.matchMedia("(max-width: 1049px)").matches;
}

function placeRecognizePanel() {
  if (!isRecognizeMode()) {
    if (recognizePanel.parentElement !== cupStage) cupStage.appendChild(recognizePanel);
    return;
  }
  const target = isCompactGameLayout() ? cupStage : rightPlayers;
  if (recognizePanel.parentElement !== target) target.appendChild(recognizePanel);
}

function startRecognizeExercise() {
  state.busy = false;
  state.roundOver = false;
  state.matchOver = false;
  state.round = 1;
  state.turnIndex = 0;
  state.starterIndex = 0;
  state.starterRolls = {};
  state.starterRanks = {};
  state.starterRollingIds = new Set();
  state.starterCelebratingId = null;
  resetTurn();
  state.recognize = {
    options: [],
    correctKey: "",
    selectedKey: "",
    answered: false,
    feedback: ""
  };
  renderAll();
}

function startStandExercise() {
  state.busy = false;
  state.roundOver = false;
  state.matchOver = false;
  state.inGame = true;
  state.round = 1;
  state.turnIndex = 0;
  state.starterIndex = 0;
  state.rollLimit = 3;
  state.results = [];
  state.activeMark = null;
  state.learnAdvice = "";
  state.starterRolls = {};
  state.starterRanks = {};
  state.starterRollingIds = new Set();
  state.starterCelebratingId = null;
  cachitoBurst.classList.remove("show");
  championBurst.classList.remove("show");
  leaderMark.classList.add("hidden");
  leaderMark.innerHTML = "";
  resetTurn();
  renderAll();
}

function beatTargetKey(target) {
  return target ? `${resultKey(target.result)}-${target.rolls}` : "";
}

function randomBeatTarget(previousTarget = null) {
  const previousKey = beatTargetKey(previousTarget);
  for (let attempt = 0; attempt < 2500; attempt += 1) {
    const dice = Array.from({ length: state.config.diceCount }, () => randomDie());
    const result = evaluateDice(dice, state.config.names);
    const rolls = 1 + Math.floor(Math.random() * 3);
    const validTarget = result.gameType === "tortuga"
      ? result.hasHead && result.legs >= 1 && result.legs <= 3
      : result.gameType === "ojos-azules"
        ? result.score >= 4 && result.score <= 12
        : !result.isCachito && result.count * 10 + result.rank >= 36;
    if (validTarget) {
      const target = {
        playerId: "learn-rival",
        player: { id: "learn-rival", name: "Rival", type: "bot", team: null },
        result,
        rolls,
        dice,
        provisional: false
      };
      if (beatTargetKey(target) !== previousKey) return target;
    }
  }
  const dice = currentGameType() === "tortuga"
    ? [6, 1, 1, 3, 4].slice(0, state.config.diceCount)
    : currentGameType() === "ojos-azules"
      ? [2, 5, 3, 4, 1].slice(0, state.config.diceCount)
      : [1, 2, 2, 2, 2].slice(0, state.config.diceCount);
  const result = evaluateDice(dice, state.config.names);
  return {
    playerId: "learn-rival",
    player: { id: "learn-rival", name: "Rival", type: "bot", team: null },
    result,
    rolls: 2,
    dice,
    provisional: false
  };
}

function startBeatExercise() {
  const previousTarget = state.beat.target;
  state.busy = false;
  state.roundOver = false;
  state.matchOver = false;
  state.inGame = true;
  state.round = 1;
  state.turnIndex = 0;
  state.starterIndex = 0;
  state.results = [];
  state.activeMark = null;
  state.learnAdvice = "";
  state.beat = {
    target: randomBeatTarget(previousTarget),
    feedback: ""
  };
  state.starterRolls = {};
  state.starterRanks = {};
  state.starterRollingIds = new Set();
  state.starterCelebratingId = null;
  cachitoBurst.classList.remove("show");
  championBurst.classList.remove("show");
  resetTurn();
  renderAll();
}

function resultKey(result) {
  if (result.gameType === "tortuga") return `tortuga-${result.hasHead ? 1 : 0}-${result.legs || 0}`;
  if (result.gameType === "ojos-azules") return `ojos-${result.score}`;
  return `${result.count}-${result.value}`;
}

function optionFromResult(result) {
  return {
    key: resultKey(result),
    label: result.label
  };
}

function randomResultOption() {
  if (currentGameType() === "tortuga") {
    const hasHead = Math.random() > 0.18;
    const legs = hasHead ? Math.floor(Math.random() * 5) : 0;
    const result = {
      gameType: "tortuga",
      hasHead,
      legs,
      label: hasHead
        ? legs === 0
          ? "Cabeza"
          : legs >= 4
            ? "Tortuga completa"
            : `Cabeza + ${legs} pata${legs === 1 ? "" : "s"}`
        : "Sin tortuga"
    };
    return { key: resultKey(result), label: result.label };
  }
  if (currentGameType() === "ojos-azules") {
    const score = Math.floor(Math.random() * 22);
    return { key: `ojos-${score}`, label: `${score} punto${score === 1 ? "" : "s"}` };
  }
  const count = 1 + Math.floor(Math.random() * 5);
  const value = VALUE_ORDER[Math.floor(Math.random() * VALUE_ORDER.length)];
  return {
    key: `${count}-${value}`,
    label: `${count} ${state.config.names[value]}`
  };
}

function shuffleItems(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function prepareRecognizeOptions() {
  const correct = optionFromResult(evaluateDice(state.dice, state.config.names));
  const options = [correct];
  while (options.length < 5) {
    const option = randomResultOption();
    if (options.some((item) => item.key === option.key)) continue;
    options.push(option);
  }
  state.recognize = {
    options: shuffleItems(options),
    correctKey: correct.key,
    selectedKey: "",
    answered: false,
    feedback: ""
  };
  renderAll();
}

function chooseRecognizeOption(key) {
  if (!isRecognizeMode() || state.recognize.answered || !state.recognize.correctKey) return;
  const isCorrect = key === state.recognize.correctKey;
  state.recognize.selectedKey = key;
  state.recognize.answered = true;
  state.recognize.feedback = isCorrect
    ? "¡Correcto! Esa era la jugada."
    : "No acertaste. Te marco la jugada correcta.";
  if (isCorrect) state.learnStats.wins += 1;
  else state.learnStats.losses += 1;
  renderAll();
}

function simulateBestResultFrom(dice, held, rollsLeft, samples = 900) {
  let better = 0;
  const current = evaluateDice(dice, state.config.names);
  for (let sample = 0; sample < samples; sample += 1) {
    let candidateDice = [...dice];
    let candidateHeld = [...held];
    for (let roll = 0; roll < rollsLeft; roll += 1) {
      candidateDice = candidateDice.map((value, index) => candidateHeld[index] && value ? value : randomDie());
      const result = evaluateDice(candidateDice, state.config.names);
      const scoring = scoringDiceIndexes({ result, dice: candidateDice });
      candidateHeld = candidateDice.map((_, index) => candidateHeld[index] || scoring.has(index));
    }
    if (compareResults(evaluateDice(candidateDice, state.config.names), current) > 0) better += 1;
  }
  return better / samples;
}

function simulateBeatChances(targetResult, rolls, samples = 700, opponents = 5) {
  let beatenOpponents = 0;
  let beatenTables = 0;
  for (let sample = 0; sample < samples; sample += 1) {
    let tableBeat = false;
    for (let opponent = 0; opponent < opponents; opponent += 1) {
      let candidateDice = Array.from({ length: state.config.diceCount }, () => 0);
      let candidateHeld = Array.from({ length: state.config.diceCount }, () => false);
      for (let roll = 0; roll < rolls; roll += 1) {
        candidateDice = candidateDice.map((value, index) => candidateHeld[index] && value ? value : randomDie());
        const result = evaluateDice(candidateDice, state.config.names);
        const scoring = scoringDiceIndexes({ result, dice: candidateDice });
        candidateHeld = candidateDice.map((_, index) => candidateHeld[index] || scoring.has(index));
      }
      const beatsTarget = compareResults(evaluateDice(candidateDice, state.config.names), targetResult) > 0;
      if (beatsTarget) {
        beatenOpponents += 1;
        tableBeat = true;
      }
    }
    if (tableBeat) beatenTables += 1;
  }
  return {
    opponent: beatenOpponents / (samples * opponents),
    table: beatenTables / samples
  };
}

function standAdvice(result, rolls) {
  const rollsLeft = Math.max(0, 3 - rolls);
  const improveChance = rollsLeft > 0
    ? simulateBestResultFrom([...state.dice], [...state.held], rollsLeft)
    : 0;
  const opponents = state.config?.source === "learn" ? 5 : Math.max(1, state.players.length - 1);
  const beatChances = simulateBeatChances(result, rolls, 700, opponents);
  const opponentBeatPercent = Math.round(beatChances.opponent * 100);
  const tableBeatPercent = Math.round(beatChances.table * 100);
  const improvePercent = Math.round(improveChance * 100);
  if (result.gameType === "tortuga") {
    let verdict = "";
    if (rolls >= 3) {
      verdict = result.hasHead && result.legs >= 3
        ? "Buena tortuga final."
        : result.hasHead
          ? "Tortuga regular; al menos tienes cabeza."
          : "Mala suerte: sin cabeza no hay tortuga.";
      return `${result.label} en 3 tiros. ${verdict} Te gane un rival: ${opponentBeatPercent}%. Mesa completa: ${tableBeatPercent}%.`;
    }
    if (result.hasHead && result.legs >= 3) verdict = "Buena opcion: tienes cabeza y varias patas.";
    else if (result.hasHead && improveChance < 0.45) verdict = "Plantarte puede estar bien: ya tienes cabeza y no era tan probable mejorar.";
    else verdict = "Conviene seguir: necesitas cabeza y mas patas para competir.";
    return `${result.label} en ${rolls} tiro${rolls === 1 ? "" : "s"}. ${verdict} Rival: ${opponentBeatPercent}%. Mesa: ${tableBeatPercent}%. Mejorar: ${improvePercent}%.`;
  }
  if (result.gameType === "ojos-azules") {
    let verdict = "";
    if (rolls >= 3) {
      verdict = result.score <= 4
        ? "Muy buen puntaje final."
        : result.score <= 9
          ? "Puntaje aceptable."
          : "Puntaje alto; es probable que te ganen.";
      return `${result.label} en 3 tiros. ${verdict} Te gane un rival: ${opponentBeatPercent}%. Mesa completa: ${tableBeatPercent}%.`;
    }
    if (result.score <= 4) verdict = "Buena opcion: puntaje bajo para plantarte.";
    else if (improveChance >= 0.55) verdict = "Conviene seguir: es bastante probable bajar el puntaje.";
    else if (result.score <= 8) verdict = "Plantarte es razonable, aunque podrias intentar bajarlo.";
    else verdict = "Puntaje alto: conviene arriesgar otro tiro.";
    return `${result.label} en ${rolls} tiro${rolls === 1 ? "" : "s"}. ${verdict} Rival: ${opponentBeatPercent}%. Mesa: ${tableBeatPercent}%. Mejorar: ${improvePercent}%.`;
  }
  const strength = result.count * 10 + result.rank;
  let verdict = "";
  if (rolls >= 3) {
    if (result.isCachito || result.count >= 5 || strength >= 46) {
      verdict = "Llegaste al tercer tiro: era obligatorio plantarte. Buena jugada final.";
    } else if (result.count >= 4 || strength >= 36) {
      verdict = "Llegaste al tercer tiro: era obligatorio plantarte. Jugada aceptable.";
    } else {
      verdict = "Llegaste al tercer tiro: era obligatorio plantarte. Mala jugada final; no se podia hacer mas, mala suerte.";
    }
  } else if (rolls === 1 && result.count >= 4 && result.rank >= VALUE_RANK.get(5)) {
    verdict = "Buena opcion: conviene plantarte. Es una jugada fuerte y al hacerla en 1 tiro obligas a los demas a superarla con un solo lanzamiento.";
  } else if (rolls === 1 && result.count >= 4) {
    verdict = "Plantarte esta bien: una jugada de 4 dados en 1 tiro presiona bastante porque limita a todos a un solo lanzamiento.";
  } else if (rolls === 2 && result.count >= 4 && result.rank >= VALUE_RANK.get(4)) {
    verdict = "Buena opcion: es una jugada fuerte para plantarte en 2 tiros.";
  } else if (strength >= 46 || result.isCachito) {
    verdict = "Buena opcion: es una jugada fuerte para plantarte.";
  } else if (beatChances.opponent <= 0.28 && improveChance < 0.45) {
    verdict = "Plantarte esta bien: el riesgo de que te ganen es bajo y no habia tanta mejora probable.";
  } else if (improveChance >= 0.55 && beatChances.opponent >= 0.4) {
    verdict = "Debiste seguir: habia buena chance de mejorar y todavia te podian superar.";
  } else if (improveChance >= 0.55) {
    verdict = "Seguir era una buena opcion: todavia era bastante probable mejorar.";
  } else if (strength < 34) {
    verdict = "Jugada floja: conviene arriesgar un tiro mas.";
  } else {
    verdict = "Plantarte esta bien, aunque habia margen para intentar mejorar.";
  }
  if (rolls >= 3) return `${result.label} en 3 tiros. ${verdict} Te gane un rival: ${opponentBeatPercent}%. Mesa completa: ${tableBeatPercent}%.`;
  return `${result.label} en ${rolls} tiro${rolls === 1 ? "" : "s"}. ${verdict} Rival: ${opponentBeatPercent}%. Mesa: ${tableBeatPercent}%. Mejorar: ${improvePercent}%.`;
}

function currentPlayer() {
  return state.players[state.turnIndex];
}

function maxRollsForTurn() {
  if (isRecognizeMode()) return 1;
  if (isStandLearnMode()) return 3;
  if (isBeatLearnMode()) return state.beat.target?.rolls || 3;
  if (state.config.mode === "teams" && !state.activeMark) return 3;
  return state.rollLimit || 3;
}

function rollDice() {
  if (!isActiveGame() || state.busy || state.roundOver || state.currentRolls >= maxRollsForTurn()) return;
  const token = state.gameToken;
  const turnPlayerId = currentPlayer().id;
  const collectDelay = 980;
  const revealDelay = 1950;
  const emergeDelay = 760;
  state.busy = true;
  state.botChoosingHeld = Array.from({ length: state.config.diceCount }, () => false);
  if (state.currentRolls > 0) {
    state.lockedHeld = state.held.map((held, index) => held || state.lockedHeld[index]);
  }
  cupStage.classList.add("cup-collecting");
  cup.classList.remove("shaking", "reveal");
  cup.classList.add("collecting");
  renderDice(true);

  gameTimeout(() => {
    if (!isActiveGame(token) || currentPlayer().id !== turnPlayerId) return;
    cup.classList.remove("collecting");
    cup.classList.add("covering");
    cup.classList.add("shaking");
  }, collectDelay);

  gameTimeout(() => {
    if (!isActiveGame(token) || currentPlayer().id !== turnPlayerId) return;
    state.dice = state.dice.map((value, index) => state.held[index] && value ? value : randomDie());
    state.currentRolls += 1;
    cupStage.classList.remove("cup-collecting");
    cupStage.classList.add("dice-emerging");
    cup.classList.remove("covering", "shaking");
    cup.classList.add("reveal");
    renderAll();
    gameTimeout(() => {
      if (!isActiveGame(token) || currentPlayer().id !== turnPlayerId) return;
      cupStage.classList.remove("dice-emerging");
      state.busy = false;
      renderAll();
      if (isRecognizeMode()) {
        prepareRecognizeOptions();
        return;
      }
      if (isStandLearnMode()) return;
      if (isBeatLearnMode()) return;
      const result = evaluateDice(state.dice, state.config.names);
      if (result.isCachito) {
        const player = currentPlayer();
        finishRound(player, `${player.name} saco cachito: 5 ases.`, true);
        return;
      }
      if (currentPlayer().type === "bot") botThink();
    }, emergeDelay);
  }, revealDelay);
}

function stand() {
  if (!isActiveGame() || state.busy || state.roundOver || state.currentRolls === 0) return;
  const player = currentPlayer();
  const result = evaluateDice(state.dice, state.config.names);
  state.results.push({ playerId: player.id, result, rolls: state.currentRolls, dice: [...state.dice] });
  addLog(`${player.name} se planta con ${result.label} (${state.currentRolls} tiro${state.currentRolls === 1 ? "" : "s"}).`);

  if (isStandLearnMode()) {
    state.learnAdvice = standAdvice(result, state.currentRolls);
    state.roundOver = true;
    state.matchOver = false;
    state.busy = false;
    cachitoBurst.classList.remove("show");
    championBurst.classList.remove("show");
    renderAll();
    return;
  }

  if (isBeatLearnMode()) {
    const target = state.beat.target;
    const won = target && compareResults(result, target.result) > 0;
    state.learnStats[won ? "wins" : "losses"] += 1;
    state.beat.feedback = won
      ? `Has ganado: ${result.label} supera ${target.result.label}.`
      : `Has perdido: ${result.label} no supera ${target.result.label}.`;
    state.roundOver = true;
    state.matchOver = false;
    state.busy = false;
    cachitoBurst.classList.remove("show");
    championBurst.classList.remove("show");
    renderAll();
    return;
  }

  if (state.config.mode === "classic") {
    handleClassicStand();
  } else {
    handleTeamStand(result);
  }
}

function handleClassicStand() {
  if (state.rollLimit === null) {
    state.rollLimit = state.currentRolls;
    addLog(`La ronda queda limitada a ${state.rollLimit} tiro${state.rollLimit === 1 ? "" : "s"}.`);
  }

  const played = new Set(state.results.map((entry) => entry.playerId));
  if (played.size === state.players.length) {
    const winnerEntry = [...state.results].sort((a, b) => compareResults(b.result, a.result))[0];
    const winner = state.players.find((player) => player.id === winnerEntry.playerId);
    finishRound(winner, `${winner.name} gana la ronda con ${winnerEntry.result.label}.`);
    return;
  }

  moveTurnTo(nextPlayerIndex(state.turnIndex));
  resetTurn();
  renderAll();
  maybeRunAutomaticPlayer();
}

function handleTeamStand(result) {
  const player = currentPlayer();
  state.usedPlayers.add(player.id);

  if (!state.activeMark) {
    state.activeMark = { playerId: player.id, team: player.team, result };
    state.rollLimit = state.currentRolls;
    state.challengeTeam = otherTeam(player.team);
    addLog(`${player.name} deja la marca: ${result.label}. El otro equipo responde.`);
    moveToNextTeamPlayer(state.challengeTeam);
    return;
  }

  if (compareResults(result, state.activeMark.result) > 0) {
    state.activeMark = { playerId: player.id, team: player.team, result };
    state.challengeTeam = otherTeam(player.team);
    addLog(`${player.name} supera la marca con ${result.label}.`);
    if (!hasAvailableTeamPlayer(state.challengeTeam)) {
      finishRound(player, `${player.name} cierra el reto para el Equipo ${player.team}.`);
      return;
    }
    moveToNextTeamPlayer(state.challengeTeam);
    return;
  }

  addLog(`${player.name} no supera ${state.activeMark.result.label}.`);
  if (hasAvailableTeamPlayer(player.team)) {
    moveToNextTeamPlayer(player.team);
    return;
  }

  const holder = state.players.find((item) => item.id === state.activeMark.playerId);
  finishRound(holder, `Equipo ${state.activeMark.team} gana con ${holder.name}: ${state.activeMark.result.label}.`);
}

function nextPlayerIndex(index) {
  const step = state.config.direction === "right" ? 1 : -1;
  return (index + step + state.players.length) % state.players.length;
}

function moveTurnTo(nextIndex) {
  const previousPlayerId = currentPlayer()?.id;
  state.turnIndex = nextIndex;
  const nextPlayerId = currentPlayer()?.id;
  requestAnimationFrame(() => showTurnArrow(previousPlayerId, nextPlayerId));
}

function showTurnArrow(fromPlayerId, toPlayerId) {
  if (!turnArrow || !turnArrowPath || !fromPlayerId || !toPlayerId || fromPlayerId === toPlayerId) return;
  const fromCard = panels.game.querySelector(`[data-player-id="${fromPlayerId}"]`);
  const toCard = panels.game.querySelector(`[data-player-id="${toPlayerId}"]`);
  if (!fromCard || !toCard) return;

  const from = fromCard.getBoundingClientRect();
  const to = toCard.getBoundingClientRect();
  const startX = from.left + from.width / 2;
  const startY = from.top + from.height / 2;
  const endX = to.left + to.width / 2;
  const endY = to.top + to.height / 2;
  const distanceX = endX - startX;
  const curveLift = Math.max(46, Math.min(120, Math.abs(distanceX) * 0.22 + Math.abs(endY - startY) * 0.35));
  const control1X = startX + distanceX * 0.34;
  const control2X = startX + distanceX * 0.66;
  const control1Y = startY - curveLift;
  const control2Y = endY - curveLift;

  turnArrow.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
  turnArrowPath.setAttribute("d", `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`);
  turnArrow.classList.remove("hidden", "show");
  void turnArrow.offsetWidth;
  turnArrow.classList.add("show");
  clearTimeout(turnArrowTimer);
  turnArrowTimer = setTimeout(() => {
    turnArrow.classList.add("hidden");
    turnArrow.classList.remove("show");
  }, 950);
}

function otherTeam(team) {
  return team === "A" ? "B" : "A";
}

function hasAvailableTeamPlayer(team) {
  return state.players.some((player) => player.team === team && !state.usedPlayers.has(player.id));
}

function moveToNextTeamPlayer(team) {
  const step = state.config.direction === "right" ? 1 : -1;
  let index = state.turnIndex;
  for (let attempts = 0; attempts < state.players.length; attempts += 1) {
    index = (index + step + state.players.length) % state.players.length;
    const player = state.players[index];
    if (player.team === team && !state.usedPlayers.has(player.id)) {
      moveTurnTo(index);
      resetTurn();
      renderAll();
      maybeRunAutomaticPlayer();
      return;
    }
  }
}

function finishRound(winner, message, isCachito = false) {
  if (!isActiveGame()) return;
  ensureWinnerResult(winner);
  const winningTeam = state.config.mode === "teams" ? winner.team : null;
  if (winningTeam) state.teamWins[winningTeam] += 1;
  else winner.wins += 1;

  state.lastRoundWinnerId = winner.id;
  state.lastRoundWinningTeam = winningTeam;
  state.roundOver = true;
  state.starterIndex = state.players.findIndex((player) => player.id === winner.id);
  addLog(message);
  cupStage.classList.add("winner-flash");
  gameTimeout(() => cupStage.classList.remove("winner-flash"), 1200);
  if (isCachito) showCachitoBurst(winner.name);

  if (hasMatchWinner(winner)) {
    state.matchOver = true;
    addLog(matchWinnerMessage(winner));
    showChampionBurst(winner);
    if (newRoundBtn) newRoundBtn.disabled = true;
  } else {
    if (newRoundBtn) newRoundBtn.disabled = false;
  }
  renderAll();
}

function ensureWinnerResult(winner) {
  const alreadyRegistered = state.results.some((entry) => entry.playerId === winner.id);
  const isCurrentWinner = currentPlayer()?.id === winner.id;
  const hasCompleteDice = state.dice.length && state.dice.every(Boolean);
  if (alreadyRegistered || !isCurrentWinner || !hasCompleteDice || state.currentRolls === 0) return;
  state.results.push({
    playerId: winner.id,
    result: evaluateDice(state.dice, state.config.names),
    rolls: state.currentRolls,
    dice: [...state.dice]
  });
}

function hasMatchWinner(winner) {
  if (state.config.mode === "teams") return state.teamWins[winner.team] >= state.config.targetWins;
  return winner.wins >= state.config.targetWins;
}

function matchWinnerMessage(winner) {
  if (state.config.mode === "teams") {
    return `Equipo ${winner.team} gana la partida a ${state.config.targetWins} victorias.`;
  }
  return `${winner.name} gana la partida a ${state.config.targetWins} victorias.`;
}

function showCachitoBurst(playerName) {
  cachitoWinner.textContent = playerName;
  cachitoBurst.classList.remove("show");
  void cachitoBurst.offsetWidth;
  cachitoBurst.classList.add("show");
}

function showChampionBurst(winner) {
  championWinner.textContent = state.config.mode === "teams" ? `Equipo ${winner.team}` : winner.name;
  championMeta.textContent = `${state.config.targetWins} victoria${state.config.targetWins === 1 ? "" : "s"}`;
  championBurst.classList.remove("show");
  void championBurst.offsetWidth;
  championBurst.classList.add("show");
}

function currentGameType() {
  return state.config?.gameType || state.gameType || "callao";
}

function evaluateDice(dice, names) {
  const gameType = currentGameType();
  if (gameType === "tortuga") return evaluateTortugaDice(dice);
  if (gameType === "ojos-azules") return evaluateOjosAzulesDice(dice);
  return evaluateCallaoDice(dice, names);
}

function evaluateCallaoDice(dice, names) {
  const counts = new Map(VALUE_ORDER.map((value) => [value, 0]));
  dice.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));

  let best = null;
  for (const topValue of VALUE_ORDER) {
    const topCount = counts.get(topValue) || 0;
    if (!topCount) continue;

    const candidates = [{
      gameType: "callao",
      count: topCount,
      value: topValue,
      rank: VALUE_RANK.get(topValue),
      parts: [topValue],
      isCachito: topCount >= 5 && topValue === 1,
      label: `${topCount} ${names[topValue]}`
    }];

    for (const lowerValue of VALUE_ORDER) {
      if (VALUE_RANK.get(lowerValue) >= VALUE_RANK.get(topValue)) continue;
      const amount = counts.get(lowerValue) || 0;
      if (amount > 0) {
        const total = topCount + amount;
        candidates.push({
          gameType: "callao",
          count: total,
          value: topValue,
          rank: VALUE_RANK.get(topValue),
          parts: [topValue, lowerValue],
          isCachito: total >= 5 && topValue === 1,
          label: `${total} ${names[topValue]}`
        });
      }
    }

    for (const candidate of candidates) {
      if (!best || compareResults(candidate, best) > 0) best = candidate;
    }
  }

  return best || {
    gameType: "callao",
    count: 0,
    value: 2,
    rank: 0,
    parts: [],
    isCachito: false,
    label: "sin jugada"
  };
}

function evaluateTortugaDice(dice) {
  const hasHead = dice.includes(6);
  const legs = hasHead ? dice.filter((value) => value === 1).length : 0;
  const count = hasHead ? 1 + legs : 0;
  const label = hasHead
    ? legs === 0
      ? "Cabeza"
      : legs >= 4
        ? "Tortuga completa"
        : `Cabeza + ${legs} pata${legs === 1 ? "" : "s"}`
    : "Sin tortuga";
  return {
    gameType: "tortuga",
    count,
    value: 6,
    rank: hasHead ? legs + 1 : 0,
    parts: hasHead ? [6, 1] : [],
    isCachito: false,
    hasHead,
    legs,
    label
  };
}

function evaluateOjosAzulesDice(dice) {
  const scoringValues = dice.filter((value) => value && value !== 2 && value !== 5);
  const score = scoringValues.reduce((sum, value) => sum + value, 0);
  const saved = dice.filter((value) => value === 2 || value === 5).length;
  return {
    gameType: "ojos-azules",
    count: saved,
    value: 0,
    rank: 30 - score,
    parts: [2, 5],
    isCachito: false,
    score,
    saved,
    label: `${score} punto${score === 1 ? "" : "s"}`
  };
}

function compareResults(a, b) {
  const gameType = a?.gameType || b?.gameType || currentGameType();
  if (gameType === "tortuga") {
    if (Boolean(a.hasHead) !== Boolean(b.hasHead)) return a.hasHead ? 1 : -1;
    if ((a.legs || 0) !== (b.legs || 0)) return (a.legs || 0) - (b.legs || 0);
    return 0;
  }
  if (gameType === "ojos-azules") {
    if ((a.score ?? 99) !== (b.score ?? 99)) return (b.score ?? 99) - (a.score ?? 99);
    return (a.saved || 0) - (b.saved || 0);
  }
  if (a.isCachito && !b.isCachito) return 1;
  if (!a.isCachito && b.isCachito) return -1;
  if (a.count !== b.count) return a.count - b.count;
  return a.rank - b.rank;
}

function botThink() {
  if (!isActiveGame() || state.roundOver || currentPlayer().type !== "bot") return;
  const token = state.gameToken;
  const turnPlayerId = currentPlayer().id;
  const result = evaluateDice(state.dice, state.config.names);
  const limit = maxRollsForTurn();
  if (result.isCachito) {
    const player = currentPlayer();
    gameTimeout(() => {
      if (isActiveGame(token) && currentPlayer().id === turnPlayerId) {
        finishRound(player, `${player.name} saco cachito: 5 ases.`, true);
      }
    }, 650);
    return;
  }

  if (botShouldStand(result, limit)) {
    gameTimeout(() => {
      if (isActiveGame(token) && currentPlayer().id === turnPlayerId) stand();
    }, 650);
    return;
  }

  const scoringIndexes = scoringDiceIndexes({ result, dice: state.dice });
  const nextHeld = state.dice.map((_, index) => state.lockedHeld[index] || scoringIndexes.has(index));
  state.botChoosingHeld = nextHeld.map((held, index) => held && !state.held[index]);
  renderAll();
  gameTimeout(() => {
    if (!isActiveGame(token) || currentPlayer().id !== turnPlayerId) return;
    state.held = nextHeld;
    state.botChoosingHeld = Array.from({ length: state.config.diceCount }, () => false);
    addLog(`${currentPlayer().name} conserva ${state.held.filter(Boolean).length} dado${state.held.filter(Boolean).length === 1 ? "" : "s"}.`);
    renderAll();
  }, 520);
  gameTimeout(() => {
    if (!isActiveGame(token) || currentPlayer().id !== turnPlayerId) return;
    if (state.held.every(Boolean)) stand();
    else rollDice();
  }, 1250);
}

function botShouldStand(result, limit) {
  if (state.currentRolls >= limit) return true;
  if (currentGameType() === "tortuga") return botShouldStandTortuga(result);
  if (currentGameType() === "ojos-azules") return botShouldStandOjosAzules(result);
  const isOpeningMark = state.config.mode === "classic" ? state.rollLimit === null : state.activeMark === null;
  if (isOpeningMark) return isStrongOpeningResult(result);
  if (state.config.mode === "teams" && state.activeMark) return compareResults(result, state.activeMark.result) > 0 && result.count >= 4;
  const currentBest = bestClassicResult();
  return currentBest && compareResults(result, currentBest.result) > 0 && result.count >= 4;
}

function botShouldStandTortuga(result) {
  if (result.hasHead && result.legs >= 4) return true;
  if (state.config.mode === "teams" && state.activeMark) return compareResults(result, state.activeMark.result) > 0 && result.legs >= 2;
  const isOpeningMark = state.config.mode === "classic" ? state.rollLimit === null : state.activeMark === null;
  if (isOpeningMark) return result.hasHead && (state.currentRolls >= 2 ? result.legs >= 2 : result.legs >= 3);
  const currentBest = bestClassicResult();
  return currentBest && compareResults(result, currentBest.result) > 0 && result.hasHead;
}

function botShouldStandOjosAzules(result) {
  if (result.score <= 0) return true;
  if (state.config.mode === "teams" && state.activeMark) return compareResults(result, state.activeMark.result) > 0 && result.score <= 6;
  const isOpeningMark = state.config.mode === "classic" ? state.rollLimit === null : state.activeMark === null;
  if (isOpeningMark) {
    if (state.currentRolls === 1) return result.score <= 4;
    if (state.currentRolls === 2) return result.score <= 7;
    return true;
  }
  const currentBest = bestClassicResult();
  return currentBest && compareResults(result, currentBest.result) > 0 && result.score <= 8;
}

function isStrongOpeningResult(result) {
  if (state.currentRolls === 1) return result.count >= 4 && result.rank >= VALUE_RANK.get(6);
  if (state.currentRolls === 2) return result.count >= 4 && result.rank >= VALUE_RANK.get(5);
  return false;
}

function bestClassicResult() {
  if (!state.results.length) return null;
  return [...state.results].sort((a, b) => compareResults(b.result, a.result))[0];
}

function maybeRunAutomaticPlayer() {
  renderAll();
  if (!state.roundOver && currentPlayer().type === "bot") {
    const token = state.gameToken;
    const turnPlayerId = currentPlayer().id;
    gameTimeout(() => {
      if (isActiveGame(token) && currentPlayer().id === turnPlayerId) rollDice();
    }, 900);
  }
}

function toggleHold(index) {
  if (isRecognizeMode()) return;
  if (state.busy || state.roundOver || state.currentRolls === 0 || currentPlayer().type !== "human") return;
  if (state.lockedHeld[index]) return;
  if (!canHoldDie(index)) return;
  state.held[index] = !state.held[index];
  renderAll();
}

function canHoldDie(index) {
  const value = state.dice[index];
  if (!value) return false;
  if (currentGameType() === "tortuga") {
    if (value === 6) {
      if (state.held[index] && state.held.some((held, heldIndex) => held && state.dice[heldIndex] === 1)) return false;
      return !state.held.some((held, heldIndex) => held && state.dice[heldIndex] === 6 && heldIndex !== index);
    }
    if (value === 1) return state.held.some((held, heldIndex) => held && state.dice[heldIndex] === 6 && heldIndex !== index);
    return false;
  }
  if (currentGameType() === "ojos-azules") return value === 2 || value === 5;
  return true;
}

function renderAll() {
  panels.game.classList.toggle("recognize-mode", isRecognizeMode());
  renderPlayers();
  renderDice(false);
  renderRecognizePanel();
  renderStatus();
  renderLeaderMark();
  const humanTurn = currentPlayer()?.type === "human";
  const canStartNextRound = isRecognizeMode()
    ? state.recognize.answered
    : (isStandLearnMode() || isBeatLearnMode())
      ? state.roundOver
      : state.roundOver && !state.matchOver;
  nextRoundStageBtn.classList.toggle("hidden", !canStartNextRound);
  nextRoundStageBtn.disabled = !canStartNextRound;
  nextRoundStageBtn.textContent = isRecognizeMode() || isStandLearnMode() || isBeatLearnMode() ? "Siguiente" : "Siguiente ronda";
  rollBtn.disabled = state.busy || state.roundOver || !humanTurn || state.currentRolls >= maxRollsForTurn() || (isRecognizeMode() && state.recognize.answered);
  standBtn.classList.toggle("hidden", isRecognizeMode());
  standBtn.disabled = isRecognizeMode() || state.busy || state.roundOver || !humanTurn || state.currentRolls === 0;
}

function renderRecognizePanel() {
  const active = isRecognizeMode();
  placeRecognizePanel();
  recognizePanel.classList.toggle("hidden", !active);
  if (!active) return;
  recognizeOptions.innerHTML = "";
  state.recognize.options.forEach((option) => {
    const button = document.createElement("button");
    const isSelected = option.key === state.recognize.selectedKey;
    const isCorrect = option.key === state.recognize.correctKey;
    button.type = "button";
    button.className = `recognize-option${state.recognize.answered && isCorrect ? " correct" : ""}${state.recognize.answered && isSelected && !isCorrect ? " wrong" : ""}${state.recognize.answered && isSelected && isCorrect ? " celebrate" : ""}`;
    button.textContent = option.label;
    button.disabled = state.recognize.answered;
    button.addEventListener("click", () => chooseRecognizeOption(option.key));
    recognizeOptions.appendChild(button);
  });
  recognizeFeedback.textContent = state.recognize.feedback || (state.currentRolls ? "Escoge la jugada correcta." : "Lanza los dados para ver una jugada.");
  recognizeFeedback.className = state.recognize.answered
    ? state.recognize.selectedKey === state.recognize.correctKey ? "good" : "bad"
    : "";
  recognizeNextBtn.classList.add("hidden");
}

function renderPlayers() {
  leftPlayers.innerHTML = "";
  rightPlayers.innerHTML = "";
  leftPlayers.parentElement.classList.toggle("hidden", false);
  rightPlayers.parentElement.classList.toggle("hidden", isRecognizeMode() && isCompactGameLayout());
  placeRecognizePanel();

  if (isRecognizeMode() || isBeatLearnMode()) {
    leftPlayersTitle.textContent = "Aciertos / Errores";
    rightPlayersTitle.textContent = isRecognizeMode() ? "Opciones" : "Reto";
  } else if (state.config.mode === "teams") {
    leftPlayersTitle.textContent = `Equipo A (${state.teamWins.A}/${state.config.targetWins})`;
    rightPlayersTitle.textContent = `Equipo B (${state.teamWins.B}/${state.config.targetWins})`;
  } else {
    leftPlayersTitle.textContent = "Jugadores";
    rightPlayersTitle.textContent = "Jugadores";
  }

  state.players.forEach((player, index) => {
    const latest = [...state.results].reverse().find((entry) => entry.playerId === player.id);
    const hasPlayed = Boolean(latest);
    const liveEntry = livePlayerEntry(player);
    const visibleEntry = liveEntry || latest;
    const frontDice = liveEntry
      ? renderOrderedMiniDice(liveEntry, state.held)
      : latest
        ? renderMiniDice(latest)
        : "";
    const starterValue = state.starterRolls[player.id];
    const starterRolling = state.starterRollingIds.has(player.id);
    const starterRank = state.starterRanks[player.id];
    const starterCelebrating = state.starterCelebratingId === player.id;
    const roundWinner = state.roundOver && player.id === state.lastRoundWinnerId;
    const card = document.createElement("article");
    card.className = `player-card${player.type === "human" ? " is-you" : ""}${index === state.turnIndex && !state.roundOver ? " active" : ""}${starterRolling ? " starter-rolling" : ""}${starterCelebrating ? " starter-celebrating" : ""}${starterRank === 1 ? " starter-winner" : ""}${hasPlayed ? " played" : ""}${player.id === state.lastRoundWinnerId ? " crowned" : ""}${roundWinner ? " round-winner" : ""}`;
    card.dataset.playerId = player.id;
    card.innerHTML = `
      <div class="crown" aria-hidden="true">&#9819;</div>
      <div class="card-face card-front">
        <div class="player-line player-line-top">
          <span class="type-badge ${player.type === "bot" ? "bot" : "human"}">${playerIcon(player)}</span>
          <span class="player-score">${playerWinsLabel(player)}</span>
        </div>
        <div class="player-line player-line-name">
          <span class="player-name">${escapeHtml(player.name)}</span>
          <span class="starter-die ${starterRank ? "ranked" : ""}" aria-label="${starterRank ? `Orden ${starterRank}` : starterValue ? `Sorteo ${starterValue}` : "Sorteo pendiente"}">${starterRank ? rankLabel(starterRank) : starterValue || "?"}</span>
        </div>
        <div class="player-line player-line-mark">
          <span class="player-mark">${visibleEntry ? visibleEntry.result.label : "Sin jugada"}</span>
          <span class="player-rolls">${visibleEntry ? `${visibleEntry.rolls} tiro${visibleEntry.rolls === 1 ? "" : "s"}` : ""}</span>
        </div>
        <div class="card-front-dice">${frontDice}</div>
      </div>
    `;
    playerSide(player, index).appendChild(card);
  });
}

function rankLabel(rank) {
  const labels = ["", "1ro", "2do", "3ro", "4to", "5to", "6to"];
  return labels[rank] || `${rank}`;
}

function renderMiniDice(entry) {
  const scoringIndexes = scoringDiceIndexes(entry);
  return entry.dice
    .map((value, index) => `<span class="${scoringIndexes.has(index) ? "used" : ""}">${value}</span>`)
    .join("");
}

function renderScoringDice(entry) {
  const scoringIndexes = scoringDiceIndexes(entry);
  return entry.dice
    .filter((_, index) => scoringIndexes.has(index))
    .map((value) => `<span class="used">${value}</span>`)
    .join("");
}

function livePlayerEntry(player) {
  if (state.roundOver || currentPlayer()?.id !== player.id || state.currentRolls === 0) return null;
  return {
    playerId: player.id,
    result: evaluateDice(state.dice, state.config.names),
    rolls: state.currentRolls,
    dice: [...state.dice]
  };
}

function renderOrderedMiniDice(entry, held = []) {
  const scoringIndexes = scoringDiceIndexes(entry);
  return entry.dice
    .map((value, index) => ({ value, index, held: Boolean(held[index]) }))
    .sort((a, b) => Number(b.held) - Number(a.held) || a.index - b.index)
    .map(({ value, index, held: isHeld }) => `<span class="${scoringIndexes.has(index) ? "used" : ""}${isHeld ? " held" : ""}">${value}</span>`)
    .join("");
}

function scoringDiceIndexes(entry) {
  const indexes = new Set();
  if (entry.result.gameType === "tortuga") {
    if (!entry.result.hasHead) return indexes;
    const headIndex = entry.dice.findIndex((value) => value === 6);
    if (headIndex >= 0) indexes.add(headIndex);
    entry.dice.forEach((value, index) => {
      if (value === 1) indexes.add(index);
    });
    return indexes;
  }
  if (entry.result.gameType === "ojos-azules") {
    entry.dice.forEach((value, index) => {
      if (value === 2 || value === 5) indexes.add(index);
    });
    return indexes;
  }
  let remaining = entry.result.count;
  const valuesToUse = [entry.result.value, ...entry.result.parts.filter((value) => value !== entry.result.value)];
  valuesToUse.forEach((partValue) => {
    entry.dice.forEach((dieValue, index) => {
      if (remaining <= 0 || indexes.has(index) || dieValue !== partValue) return;
      indexes.add(index);
      remaining -= 1;
    });
  });
  return indexes;
}

function visibleLeaderEntry() {
  const entries = state.results.map((entry) => ({
    ...entry,
    player: state.players.find((player) => player.id === entry.playerId),
    provisional: false
  }));
  const player = currentPlayer();
  if (!state.roundOver && player && state.currentRolls > 0) {
    entries.push({
      playerId: player.id,
      player,
      result: evaluateDice(state.dice, state.config.names),
      rolls: state.currentRolls,
      dice: [...state.dice],
      provisional: true
    });
  }
  const validEntries = entries.filter((entry) => entry.player);
  if (!validEntries.length) return null;
  return validEntries.sort((a, b) => compareResults(b.result, a.result))[0];
}

function renderLeaderMark() {
  if (isRecognizeMode()) {
    leaderMark.classList.add("hidden");
    leaderMark.innerHTML = "";
    return;
  }
  if (isBeatLearnMode()) {
    const target = state.beat.target;
    const won = state.roundOver && state.beat.feedback?.startsWith("Has ganado");
    const lost = state.roundOver && state.beat.feedback?.startsWith("Has perdido");
    leaderMark.classList.toggle("hidden", !target);
    leaderMark.classList.toggle("is-winner", Boolean(won));
    leaderMark.classList.toggle("is-champion", false);
    leaderMark.classList.toggle("is-beat-result", Boolean(state.roundOver));
    leaderMark.classList.toggle("is-loser", Boolean(lost));
    leaderMark.classList.remove("is-advice");
    if (!target) {
      leaderMark.innerHTML = "";
      return;
    }
    leaderMark.innerHTML = `
      ${state.roundOver ? `<em class="beat-outcome">${won ? "GANASTE" : "PERDISTE"}</em>` : ""}
      <div class="leader-mark-label">
        <span>${state.roundOver ? "Resultado" : "A superar"}</span>
      </div>
      <strong>${escapeHtml(target.player.name)}</strong>
      <b>${target.result.label}</b>
      <small>${target.rolls} tiro${target.rolls === 1 ? "" : "s"}</small>
      <div class="leader-mini-dice">${renderMiniDice(target)}</div>
    `;
    return;
  }
  if (isStandLearnMode()) {
    leaderMark.classList.add("hidden");
    leaderMark.classList.remove("is-winner", "is-champion", "is-advice");
    leaderMark.innerHTML = "";
    return;
  }
  const leader = visibleLeaderEntry();
  leaderMark.classList.toggle("hidden", !leader);
  leaderMark.classList.toggle("is-winner", Boolean(leader && state.roundOver));
  leaderMark.classList.toggle("is-champion", Boolean(leader && state.matchOver));
  if (!leader) {
    leaderMark.innerHTML = "";
    return;
  }
  const teamText = state.config.mode === "teams" ? `<span>Equipo ${leader.player.team}</span>` : "";
  const label = state.matchOver ? "Campeon" : state.roundOver ? "Ganador" : "A superar";
  leaderMark.innerHTML = `
    <div class="leader-mark-label">
      <span>${label}</span>
      ${teamText}
    </div>
    <strong>${escapeHtml(leader.player.name)}</strong>
    <b>${leader.result.label}</b>
    <small>${leader.provisional ? "jugada actual" : `${leader.rolls} tiro${leader.rolls === 1 ? "" : "s"}`}</small>
    <div class="leader-mini-dice">${leader.dice ? renderMiniDice(leader) : ""}</div>
  `;
}

function playerWinsLabel(player) {
  if (isRecognizeMode() || isBeatLearnMode()) return `${state.learnStats.wins}/${state.learnStats.losses}`;
  if (state.config.mode === "teams") return `${state.teamWins[player.team]}/${state.config.targetWins}`;
  return `${player.wins}/${state.config.targetWins}`;
}

function playerIcon(player) {
  return player.type === "bot" ? "B" : "J";
}

function seatIconFor(type) {
  return type === "bot" ? "B" : "J";
}

function playerSide(player, index) {
  if (state.config.mode === "teams") return player.team === "A" ? leftPlayers : rightPlayers;
  return index % 2 === 0 ? leftPlayers : rightPlayers;
}

function renderDice(rolling) {
  heldDiceRow.innerHTML = "";
  rollingDiceRow.innerHTML = "";
  state.dice.forEach((value, index) => {
    const die = document.createElement("button");
    die.className = `die${value ? "" : " empty"}${state.held[index] ? " locked" : ""}${state.lockedHeld[index] ? " fixed" : ""}${state.botChoosingHeld[index] ? " bot-picking" : ""}${rolling && !state.held[index] ? " rolling" : ""}`;
    die.type = "button";
    die.style.setProperty("--tilt", `${(index % 2 ? 6 : -5) + index}deg`);
    die.setAttribute("aria-label", value ? `Dado ${value}` : "Dado sin lanzar");
    die.addEventListener("click", () => toggleHold(index));
    renderPips(die, value);
    if (state.held[index]) heldDiceRow.appendChild(die);
    else rollingDiceRow.appendChild(die);
  });
}

function renderPips(die, value) {
  const layouts = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  };
  const activePips = new Set(layouts[value] || []);
  for (let index = 1; index <= 9; index += 1) {
    const pip = document.createElement("span");
    pip.className = `pip${activePips.has(index) ? " on" : ""}`;
    die.appendChild(pip);
  }
}

function renderStatus() {
  const player = currentPlayer();
  turnPlayer.textContent = isRecognizeMode()
    ? "Reconocer jugada"
    : isStandLearnMode()
      ? "Cuando plantarme"
      : isBeatLearnMode()
        ? "Vencer al enemigo"
        : player ? `${player.name}${player.team ? ` / Equipo ${player.team}` : ""}` : "-";
  const limit = maxRollsForTurn();
  const result = state.currentRolls > 0 ? evaluateDice(state.dice, state.config.names) : null;
  if (isRecognizeMode()) {
    turnHint.textContent = state.currentRolls === 0
      ? "Lanza los dados y elige la jugada correcta."
      : state.recognize.answered
        ? "Pulsa Siguiente para repetir el ejercicio."
        : "Mira los dados y escoge una de las opciones.";
  } else if (isStandLearnMode()) {
    turnHint.textContent = state.roundOver
      ? "Pulsa Siguiente para intentar otra decision."
      : state.currentRolls === 0
        ? "Lanza, guarda dados si quieres y plantate cuando lo veas conveniente."
        : `Va ${state.currentRolls}/3. Jugada actual: ${result.label}.`;
  } else if (isBeatLearnMode()) {
    const target = state.beat.target;
    turnHint.textContent = state.roundOver
      ? "Pulsa Siguiente para intentar otro reto."
      : state.currentRolls === 0
        ? `Lanza e intenta superar ${target?.result.label || "la jugada rival"} en hasta ${limit} tiro${limit === 1 ? "" : "s"}.`
        : `Va ${state.currentRolls}/${limit}. Tu jugada actual: ${result.label}.`;
  } else if (state.roundOver) {
    turnHint.textContent = state.matchOver ? "Partida terminada." : "Ronda terminada.";
  } else if (player?.type === "remote") {
    turnHint.textContent = "Esperando accion de jugador remoto. En Firebase llegara desde su navegador.";
  } else if (state.currentRolls === 0) {
    turnHint.textContent = `Puede tirar hasta ${limit} vez${limit === 1 ? "" : "es"}.`;
  } else {
    turnHint.textContent = `Va ${state.currentRolls}/${limit}. Jugada actual: ${result.label}.`;
  }

  rollBtn.textContent = isRecognizeMode() ? "Lanzar dados" : "Lanzar";

  statusText.textContent = state.config.source === "learn"
    ? isStandLearnMode() && state.learnAdvice
      ? state.learnAdvice
      : isBeatLearnMode() && state.beat.feedback
        ? state.beat.feedback
        : learnStatus()
    : state.config.mode === "teams" ? teamStatus() : classicStatus();

  const hideCurrentMarkOnMobile = state.config.mode !== "teams";
  gameStatusBar.classList.toggle("hide-current-mark-mobile", hideCurrentMarkOnMobile);
  currentMarkBox.classList.remove("hidden");
  currentMark.textContent = state.config.source === "learn"
    ? "Entrenamiento"
    : state.activeMark
      ? `${state.activeMark.result.label} / Equipo ${state.activeMark.team}`
      : state.rollLimit
        ? `Limite: ${state.rollLimit} tiro${state.rollLimit === 1 ? "" : "s"}`
        : "Sin jugada";
}

function learnStatus() {
  const gameType = GAME_TYPE_LABELS[currentGameType()] || "Callao";
  if (state.config.learnMode === "recognize") return `Tira los dados y practica reconocer la jugada de ${gameType}.`;
  if (state.config.learnMode === "stand") return `Decide que guardar y cuando plantarte en ${gameType}.`;
  if (state.config.learnMode === "beat") return `Intenta vencer una jugada rival de ${gameType} usando la misma cantidad de tiros.`;
  return `Modo aprendizaje de ${gameType}.`;
}

function classicStatus() {
  if (state.matchOver) return "La partida termino.";
  if (state.roundOver) return "La ronda termino. El ganador abre la siguiente ronda.";
  if (!state.rollLimit) return "El primer jugador que se plante definira el maximo de tiros para todos.";
  return `La ronda esta limitada a ${state.rollLimit} tiro${state.rollLimit === 1 ? "" : "s"}.`;
}

function teamStatus() {
  if (state.matchOver) return "La partida termino.";
  if (state.roundOver) return "El reto termino. El ganador abre la siguiente ronda.";
  if (!state.activeMark) return "El primer jugador marcara la jugada que el otro equipo debe superar.";
  return `Equipo ${state.challengeTeam} debe superar ${state.activeMark.result.label}.`;
}

function addLog(message) {
  const item = document.createElement("li");
  item.textContent = message;
  logList.prepend(item);
}

loginForm.addEventListener("submit", login);
logoutBtn.addEventListener("click", openUserEditor);
saveUserEditBtn.addEventListener("click", saveUserEditor);
cancelUserEditBtn.addEventListener("click", cancelUserEditor);
userNameEditInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveUserEditor();
  if (event.key === "Escape") cancelUserEditor();
});
gameTypePicker.addEventListener("click", (event) => {
  const button = event.target.closest("[data-game-type]");
  if (!button) return;
  selectGameType(button.dataset.gameType);
});
learnActions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-learn-mode]");
  if (!button) return;
  startLearn(button.dataset.learnMode);
});
learnModeBtn.addEventListener("click", () => {
  setLobbyMode("learn");
});
practiceModeBtn.addEventListener("click", () => {
  setLobbyMode("practice");
});
multiplayerModeBtn.addEventListener("click", () => {
  if (multiplayerModeBtn.disabled) return;
  multiplayerModeBtn.classList.add("active");
  learnModeBtn.classList.remove("active");
  practiceModeBtn.classList.remove("active");
  learnPanel.classList.add("hidden");
  multiplayerPanel.classList.remove("hidden");
  practicePanel.classList.add("hidden");
});
practiceIndividualBtn.addEventListener("click", () => startPractice("classic"));
practiceTeamsBtn.addEventListener("click", () => startPractice("teams"));
guideBtn.addEventListener("click", () => openModal(guideModal));
guideCloseBtn.addEventListener("click", () => closeModal(guideModal));
guideModal.addEventListener("click", (event) => {
  if (event.target === guideModal) closeModal(guideModal);
});
openCreateRoomBtn.addEventListener("click", () => openModal(createRoomModal));
closeCreateRoomBtn.addEventListener("click", () => closeModal(createRoomModal));
createRoomModal.addEventListener("click", (event) => {
  if (event.target === createRoomModal) closeModal(createRoomModal);
});
createRoomForm.addEventListener("submit", createRoom);
backToLobbyBtn.addEventListener("click", () => {
  const prefs = loadPrefs();
  if (prefs?.gameType) selectGameType(prefs.gameType, { persist: false });
  setLobbyMode(prefs?.lobbyMode || "practice", { persist: false });
  renderLobby();
  showPanel("lobby");
});
startMatchBtn.addEventListener("click", startMatch);
exitGameBtn.addEventListener("click", leaveGameToLobby);
rollBtn.addEventListener("click", rollDice);
standBtn.addEventListener("click", stand);
if (newRoundBtn) newRoundBtn.addEventListener("click", startRound);
nextRoundStageBtn.addEventListener("click", goToNextRound);
resetMatchBtn.addEventListener("click", resetMatch);
logToggleBtn.addEventListener("click", () => openModal(logOverlay));
if (revealDiceBtn) {
  revealDiceBtn.addEventListener("click", () => {
    state.revealAllDice = !state.revealAllDice;
    revealDiceBtn.textContent = state.revealAllDice ? "Ocultar dados" : "Ver dados";
    renderPlayers();
  });
}
speedInput.addEventListener("click", (event) => {
  const button = event.target.closest("[data-speed]");
  if (!button) return;
  selectSpeed(button.dataset.speed);
});
topbarMenu?.addEventListener("click", (event) => {
  if (event.target.closest("button")) topbarMenu.open = false;
});
document.addEventListener("click", (event) => {
  if (!topbarMenu?.open) return;
  if (topbarMenu.contains(event.target)) return;
  topbarMenu.open = false;
});
logCloseBtn.addEventListener("click", () => closeModal(logOverlay));
logOverlay.addEventListener("click", (event) => {
  if (event.target === logOverlay) closeModal(logOverlay);
});

window.addEventListener("popstate", () => {
  ensureUser();
  const panel = routeToPanel();
  if (panel === "game" && !state.inGame) {
    renderLobby();
    showPanel("lobby", { replace: true });
    return;
  }
  if (panel === "lobby") renderLobby();
  showPanel(panel, { route: false });
});

async function bootRoute() {
  ensureUser();
  const prefs = loadPrefs();
  selectSpeed(prefs?.speed || "normal", { persist: false });
  if (prefs?.gameType) selectGameType(prefs.gameType, { persist: false });
  setLobbyMode(prefs?.lobbyMode || "practice", { persist: false });
  const savedSession = loadSession();
  const panel = routeToPanel();
  if (panel === "login") {
    renderLobby();
    showPanel("lobby", { replace: true });
    return;
  }
  if (panel === "game" && !state.inGame) {
    const restored = await restoreSavedGameSession(savedSession);
    if (!restored) {
      renderLobby();
      showPanel("lobby", { replace: true });
    }
    return;
  }
  if (panel === "lobby") renderLobby();
  showPanel(panel, { replace: true });
}

makeNamesEditor();
selectGameType(state.gameType, { persist: false });
bootRoute();
