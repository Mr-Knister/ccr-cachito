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
  speed: "normal",
  gameToken: 0,
  inGame: false,
  roundOver: false,
  busy: false
};

const panels = {
  login: document.querySelector("#loginPanel"),
  lobby: document.querySelector("#lobbyPanel"),
  room: document.querySelector("#roomPanel"),
  game: document.querySelector("#gamePanel")
};

const loginForm = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#usernameInput");
const displayNameInput = document.querySelector("#displayNameInput");
const userTitle = document.querySelector("#userTitle");
const userMeta = document.querySelector("#userMeta");
const logoutBtn = document.querySelector("#logoutBtn");
const practiceModeBtn = document.querySelector("#practiceModeBtn");
const multiplayerModeBtn = document.querySelector("#multiplayerModeBtn");
const practicePanel = document.querySelector("#practicePanel");
const multiplayerPanel = document.querySelector("#multiplayerPanel");
const practiceIndividualBtn = document.querySelector("#practiceIndividualBtn");
const practiceTeamsBtn = document.querySelector("#practiceTeamsBtn");
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
const currentMark = document.querySelector("#currentMark strong");
const speedInput = document.querySelector("#speedInput");
const topbarMenu = document.querySelector(".game-panel .topbar-menu");
const turnPlayer = document.querySelector("#turnPlayer");
const turnHint = document.querySelector("#turnHint");
const heldDiceRow = document.querySelector("#heldDiceRow");
const rollingDiceRow = document.querySelector("#rollingDiceRow");
const nextRoundStageBtn = document.querySelector("#nextRoundStageBtn");
const cup = document.querySelector("#cup");
const cupStage = document.querySelector("#cupStage");
const leaderMark = document.querySelector("#leaderMark");
const cachitoBurst = document.querySelector("#cachitoBurst");
const cachitoWinner = document.querySelector("#cachitoWinner");
const championBurst = document.querySelector("#championBurst");
const championWinner = document.querySelector("#championWinner");
const championMeta = document.querySelector("#championMeta");
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

function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function showPanel(name) {
  Object.entries(panels).forEach(([key, panel]) => {
    panel.classList.toggle("hidden", key !== name);
  });
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
  state.user = {
    id: `u-${Date.now()}`,
    username: usernameInput.value.trim() || "jugador",
    name: displayNameInput.value.trim() || "Jugador"
  };
  renderLobby();
  showPanel("lobby");
}

function logout() {
  state.user = null;
  state.currentRoom = null;
  showPanel("login");
}

function makeDefaultRoom(mode = "classic", source = "practice") {
  const seatCount = mode === "teams" ? 6 : 5;
  const room = {
    id: `${source}-${Date.now()}`,
    name: mode === "teams" ? "Practica por equipos" : "Practica individual",
    visibility: source === "practice" ? "practice" : "public",
    password: "",
    mode,
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

async function startPractice(mode) {
  state.currentRoom = makeDefaultRoom(mode, "practice");
  await startMatch();
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
  return Array.from({ length: count }, (_, index) => ({
    id: `seat-${index + 1}`,
    type: "bot",
    status: "filled",
    userId: `bot-seat-${index + 1}`,
    name: botName(index),
    username: `bot${index + 1}`,
    team: mode === "teams" ? index < 3 ? "A" : "B" : null
  }));
}

function botName(index) {
  return BOT_NAMES[index % BOT_NAMES.length];
}

function renderLobby() {
  userTitle.textContent = state.user?.name || "-";
  userMeta.textContent = state.user ? `@${state.user.username}` : "-";
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
  modeLabel.textContent = state.config.mode === "teams" ? "Modalidad 3 vs 3" : "Todos contra todos";
  cupStage.classList.remove("cup-collecting", "dice-emerging");
  cup.classList.remove("collecting", "covering", "shaking", "reveal");
  cachitoBurst.classList.remove("show");
  championBurst.classList.remove("show");
  if (revealDiceBtn) revealDiceBtn.textContent = "Ver dados";
  showPanel("game");
  state.busy = true;
  renderAll();
  statusText.textContent = "Sorteando quien empieza.";
  await determineStarter(token);
  if (!isActiveGame(token)) return;
  state.busy = false;
  startRound();
}

function setupMatchFromRoom(room) {
  state.config = {
    mode: room.mode,
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
  roundTitle.textContent = `Ronda ${state.round}`;
  if (newRoundBtn) newRoundBtn.disabled = true;
  resetTurn();
  renderAll();
  addLog(`Ronda ${state.round} iniciada.`);
  maybeRunAutomaticPlayer();
}

function goToNextRound() {
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

function currentPlayer() {
  return state.players[state.turnIndex];
}

function maxRollsForTurn() {
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

  state.turnIndex = nextPlayerIndex(state.turnIndex);
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
      state.turnIndex = index;
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

function evaluateDice(dice, names) {
  const counts = new Map(VALUE_ORDER.map((value) => [value, 0]));
  dice.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));

  let best = null;
  for (const topValue of VALUE_ORDER) {
    const topCount = counts.get(topValue) || 0;
    if (!topCount) continue;

    const candidates = [{
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
    count: 0,
    value: 2,
    rank: 0,
    parts: [],
    isCachito: false,
    label: "sin jugada"
  };
}

function compareResults(a, b) {
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

  const keepValues = new Set(result.parts);
  const nextHeld = state.dice.map((value, index) => state.lockedHeld[index] || keepValues.has(value));
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
    if (isActiveGame(token) && currentPlayer().id === turnPlayerId) rollDice();
  }, 1250);
}

function botShouldStand(result, limit) {
  if (state.currentRolls >= limit) return true;
  const isOpeningMark = state.config.mode === "classic" ? state.rollLimit === null : state.activeMark === null;
  if (isOpeningMark) return isStrongOpeningResult(result);
  if (state.config.mode === "teams" && state.activeMark) return compareResults(result, state.activeMark.result) > 0 && result.count >= 4;
  const currentBest = bestClassicResult();
  return currentBest && compareResults(result, currentBest.result) > 0 && result.count >= 4;
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
  if (state.busy || state.roundOver || state.currentRolls === 0 || currentPlayer().type !== "human") return;
  if (state.lockedHeld[index]) return;
  state.held[index] = !state.held[index];
  renderAll();
}

function renderAll() {
  renderPlayers();
  renderDice(false);
  renderStatus();
  renderLeaderMark();
  const humanTurn = currentPlayer()?.type === "human";
  const canStartNextRound = state.roundOver && !state.matchOver;
  nextRoundStageBtn.classList.toggle("hidden", !canStartNextRound);
  nextRoundStageBtn.disabled = !canStartNextRound;
  rollBtn.disabled = state.busy || state.roundOver || !humanTurn || state.currentRolls >= maxRollsForTurn();
  standBtn.disabled = state.busy || state.roundOver || !humanTurn || state.currentRolls === 0;
}

function renderPlayers() {
  leftPlayers.innerHTML = "";
  rightPlayers.innerHTML = "";

  if (state.config.mode === "teams") {
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
          <span class="player-mark">${latest ? latest.result.label : "Sin jugada"}</span>
          <span class="player-rolls">${latest ? `${latest.rolls} tiro${latest.rolls === 1 ? "" : "s"}` : ""}</span>
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
  const neededValues = [...entry.result.parts];
  neededValues.forEach((partValue) => {
    entry.dice.forEach((dieValue, index) => {
      if (dieValue === partValue) indexes.add(index);
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
  turnPlayer.textContent = player ? `${player.name}${player.team ? ` / Equipo ${player.team}` : ""}` : "-";
  const limit = maxRollsForTurn();
  const result = state.currentRolls > 0 ? evaluateDice(state.dice, state.config.names) : null;
  if (state.roundOver) {
    turnHint.textContent = state.matchOver ? "Partida terminada." : "Ronda terminada.";
  } else if (player?.type === "remote") {
    turnHint.textContent = "Esperando accion de jugador remoto. En Firebase llegara desde su navegador.";
  } else if (state.currentRolls === 0) {
    turnHint.textContent = `Puede tirar hasta ${limit} vez${limit === 1 ? "" : "es"}.`;
  } else {
    turnHint.textContent = `Va ${state.currentRolls}/${limit}. Jugada actual: ${result.label}.`;
  }

  statusText.textContent = state.config.mode === "teams" ? teamStatus() : classicStatus();
  currentMark.textContent = state.activeMark
    ? `${state.activeMark.result.label} / Equipo ${state.activeMark.team}`
    : state.rollLimit
      ? `Limite: ${state.rollLimit} tiro${state.rollLimit === 1 ? "" : "s"}`
      : "Sin jugada";
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
logoutBtn.addEventListener("click", logout);
practiceModeBtn.addEventListener("click", () => {
  practiceModeBtn.classList.add("active");
  multiplayerModeBtn.classList.remove("active");
  practicePanel.classList.remove("hidden");
  multiplayerPanel.classList.add("hidden");
});
multiplayerModeBtn.addEventListener("click", () => {
  if (multiplayerModeBtn.disabled) return;
  multiplayerModeBtn.classList.add("active");
  practiceModeBtn.classList.remove("active");
  multiplayerPanel.classList.remove("hidden");
  practicePanel.classList.add("hidden");
});
practiceIndividualBtn.addEventListener("click", () => startPractice("classic"));
practiceTeamsBtn.addEventListener("click", () => startPractice("teams"));
openCreateRoomBtn.addEventListener("click", () => openModal(createRoomModal));
closeCreateRoomBtn.addEventListener("click", () => closeModal(createRoomModal));
createRoomModal.addEventListener("click", (event) => {
  if (event.target === createRoomModal) closeModal(createRoomModal);
});
createRoomForm.addEventListener("submit", createRoom);
backToLobbyBtn.addEventListener("click", () => {
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
  speedInput.querySelectorAll("[data-speed]").forEach((item) => item.classList.toggle("active", item === button));
  updateSpeed();
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

makeNamesEditor();
updateSpeed();
renderLobby();
