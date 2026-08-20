const express = require("express");
const http = require("http");
const path = require("path");
const os = require("os");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const SEGMENT_DURATION_MS = 60 * 1000;
const SEGMENT_DURATION_SECONDS = SEGMENT_DURATION_MS / 1000;

function getLocalIps() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  Object.values(interfaces).forEach((entries = []) => {
    entries.forEach((entry) => {
      if (entry.family === "IPv4" && !entry.internal) {
        addresses.push(entry.address);
      }
    });
  });

  return addresses;
}

app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const questionBank = [
  "What is your favourite food?",
  "What is your favourite fruit?",
  "What is your favourite vegetable?",
  "What is your favourite dessert?",
  "What is your favourite ice cream flavour?",
  "What is your favourite pizza topping?",
  "What is your favourite fast food?",
  "What is your favourite restaurant?",
  "What food could you eat every day?",
  "What food could you never eat?",
  "What is your favourite drink?",
  "What is your favourite soft drink?",
  "What is your favourite snack?",
  "What is your favourite breakfast?",
  "What would you choose for your last meal?",
  "What is your favourite cuisine?",
  "What is your favourite chocolate?",
  "What is your favourite candy?",
  "What is your most hated food?",
  "What is your go-to meal?",
  "What is your favourite movie?",
  "What is your favourite TV show?",
  "What is your favourite Netflix show?",
  "Who is your favourite actor?",
  "Who is your favourite actress?",
  "Who is your favourite singer?",
  "What is your favourite song?",
  "What is your favourite music genre?",
  "What is your favourite band?",
  "Who is your favourite YouTuber?",
  "What is your favourite video game?",
  "What is your favourite video game character?",
  "What is your favourite Roblox game?",
  "What is your favourite book?",
  "What is your favourite cartoon?",
  "What is your favourite anime?",
  "What movie could you watch over and over?",
  "What show would you recommend to everyone?",
  "What fictional character would you want to be?",
  "What fictional world would you want to live in?",
  "What is your favourite sport?",
  "What is your favourite football team?",
  "Who is your favourite football player?",
  "Who is your favourite F1 driver?",
  "What is your favourite F1 team?",
  "What is your favourite racing game?",
  "What is your favourite board game?",
  "What is your favourite card game?",
  "What sport would you most like to try?",
  "What is your best sport?",
  "What is your worst sport?",
  "What is your favourite sport to watch?",
  "Who is your favourite athlete?",
  "What is your favourite racing circuit?",
  "What is your favourite game to play with friends?",
  "What is your dream holiday destination?",
  "What country would you most like to visit?",
  "What city would you most like to visit?",
  "What is your favourite country?",
  "What is your favourite city?",
  "Where would you live if you could live anywhere?",
  "Would you rather live near the beach or mountains?",
  "What is your favourite way to travel?",
  "What is the best trip you've ever taken?",
  "Where would you go if you could travel tomorrow?",
  "What country would you never want to visit?",
  "What is your dream road trip?",
  "Would you rather travel alone or with friends?",
  "What is your favourite place you've visited?",
  "Where would you want to go with your best friend?",
  "What is your favourite colour?",
  "What is your favourite animal?",
  "What is your favourite season?",
  "What is your favourite month?",
  "What is your favourite day of the week?",
  "What is your favourite hobby?",
  "What is your favourite app?",
  "What is your favourite social media platform?",
  "What is your favourite clothing brand?",
  "What is your favourite shoe brand?",
  "What is your favourite subject?",
  "What is your least favourite subject?",
  "What is your favourite place to hang out?",
  "What is your favourite thing to do with friends?",
  "What is your favourite thing to do alone?",
  "What is your favourite type of weather?",
  "What is your favourite holiday?",
  "What is your favourite emoji?",
  "What is your most-used app?",
  "What is your biggest pet peeve?",
  "What annoys you the most?",
  "What makes you laugh the most?",
  "What is something you are terrible at?",
  "What is something you're surprisingly good at?",
  "What is your most forgotten item?",
  "What is your biggest procrastination?",
  "What is your most embarrassing habit?",
  "What is something you could never live without?",
  "What is your first move after waking up?",
  "What is your last habit before sleeping?",
  "What is your most-used emoji?",
  "What is your weirdest habit?",
  "What is something you would never do?",
  "What is something you would do if nobody could see you?",
  "What is your biggest fear?",
  "What is your worst habit?",
  "What is something that instantly makes you happy?",
  "What is something that instantly annoys you?",
  "What is something you would be famous for?",
  "What would you buy if you won ₹1 crore?",
  "What would you do if you won the lottery?",
  "What would you do if you had unlimited money?",
  "What would you do if you were invisible for a day?",
  "What would you do if you could read minds?",
  "What would you do if you could travel through time?",
  "What superpower would you choose?",
  "What would you do if you had one year with no responsibilities?",
  "What famous person would you want to meet?",
  "What skill would you instantly master?",
  "What would your dream house look like?",
  "What would your dream car be?",
  "What would your dream job be?",
  "What would you do with an extra ₹10 lakh?",
  "What would you change about the world?",
  "If you could live in any fictional world, which would you choose?",
  "If you could swap lives with anyone for a day, who would you choose?",
  "If you could only eat one food forever, what would it be?",
  "If you could only use one app forever, which would it be?",
  "If you could have any animal as a pet, what would you choose?",
  "What was your favourite childhood toy?",
  "What was your favourite childhood game?",
  "What was your favourite cartoon?",
  "What was your favourite childhood movie?",
  "What did you want to become when you were younger?",
  "What was your favourite school subject as a child?",
  "What was your favourite childhood food?",
  "What was your favourite childhood TV show?",
  "What was your favourite school trip?",
  "What is your favourite childhood memory?",
  "What is your comfort show?",
  "What is your karaoke song?",
  "What is your coffee or tea order?",
  "What is your favourite way to spend a Sunday?",
  "What is the best gift you were ever given?",
  "What is your favourite smell?",
  "What is the first app you would open each morning?",
  "What is your favourite meme?",
  "What is your signature dance move?",
  "What is your go-to excuse for cancelling plans?",
  "What is the strangest thing in your bag right now?",
  "What is your favourite thing about your best friend?",
  "What nickname would you secretly like?",
  "What is your favourite midnight snack?",
  "What is the most-played song on your phone?",
  "What is your dream pet name?"
];

const rooms = {};

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeAnswer(value) {
  return String(value ?? "").trim().toLowerCase();
}

function possessive(name) {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

const SECOND_PERSON = /\byou've\b|\byou're\b|\byou were\b|\byou are\b|\byour\b|\byou\b/gi;
// "...if nobody could see you?" needs "them", not "they".
const OBJECT_POSITION = /\b(see|tell|know|help|like|meet|watch|join|beat|trust|with|about|for|to|at|from)\s+$/i;

// Turns a private, second-person prompt ("What is your favourite fruit?") into the
// version the rest of the group guesses against ("What is Ana's favourite fruit?").
// Only the first mention uses the name; later ones become pronouns so questions like
// "What is your favourite thing about your best friend?" still read naturally.
function personalizeQuestion(question, name) {
  let named = false;

  return String(question)
    .replace(SECOND_PERSON, (match, offset, full) => {
      const token = match.toLowerCase();
      const isFirst = !named;
      named = true;

      if (token === "you've") return isFirst ? `${name} has` : "they have";
      if (token === "you're" || token === "you are") return isFirst ? `${name} is` : "they are";
      if (token === "you were") return isFirst ? `${name} was` : "they were";
      if (token === "your") return isFirst ? possessive(name) : "their";
      if (isFirst) return name;
      return OBJECT_POSITION.test(full.slice(0, offset)) ? "them" : "they";
    })
    .replace(/^./, (first) => first.toUpperCase());
}

function getPublicPlayers(players) {
  return players.map((player) => ({
    id: player.id,
    name: player.name,
    score: player.score
  }));
}

function emitPlayers(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;

  io.to(roomCode).emit("playersUpdated", {
    players: getPublicPlayers(room.players),
    hostId: room.hostId
  });
}

function createRoomState() {
  return {
    players: [],
    hostId: null,
    gameStarted: false,
    status: "lobby",
    selectedQuestions: [],
    currentQuestionIndex: 0,
    guesses: {},
    currentRound: null,
    timer: null
  };
}

function getRoom(roomCode) {
  if (!roomCode) return null;
  return rooms[String(roomCode).toUpperCase()];
}

function getTimerPayload(deadline = Date.now() + SEGMENT_DURATION_MS) {
  return {
    durationSeconds: SEGMENT_DURATION_SECONDS,
    deadline
  };
}

function clearRoomTimer(room) {
  if (room?.timer) {
    clearTimeout(room.timer);
    room.timer = null;
  }
}

function clearPlayerTimer(player) {
  if (player?.setupTimer) {
    clearTimeout(player.setupTimer);
    player.setupTimer = null;
  }
}

function scheduleRoomTimer(roomCode, callback) {
  const room = getRoom(roomCode);
  if (!room) return null;

  clearRoomTimer(room);
  room.timer = setTimeout(() => {
    room.timer = null;
    callback();
  }, SEGMENT_DURATION_MS);

  if (typeof room.timer.unref === "function") {
    room.timer.unref();
  }

  return room.timer;
}

function sendPersonalQuestion(roomCode, player) {
  const question = player.personalQuestions[player.currentPersonalQuestion];
  if (!question) return;

  clearPlayerTimer(player);
  const deadline = Date.now() + SEGMENT_DURATION_MS;

  io.to(player.id).emit("yourNextQuestion", {
    question,
    questionNumber: player.currentPersonalQuestion + 1,
    totalQuestions: player.personalQuestions.length,
    ...getTimerPayload(deadline)
  });

  player.setupTimer = setTimeout(() => {
    processPersonalAnswer(roomCode, player.id, "Skipped");
  }, SEGMENT_DURATION_MS);

  if (typeof player.setupTimer.unref === "function") {
    player.setupTimer.unref();
  }
}

function processPersonalAnswer(roomCode, playerId, answer) {
  const room = getRoom(roomCode);
  if (!room || room.status !== "setup") return;

  const player = room.players.find((entry) => entry.id === playerId);
  if (!player || player.hasAnsweredSetup) return;

  const question = player.personalQuestions[player.currentPersonalQuestion];
  if (!question) return;

  const trimmed = String(answer || "").trim() || "Skipped";
  clearPlayerTimer(player);

  player.personalAnswers[question] = trimmed;
  player.currentPersonalQuestion += 1;

  if (player.currentPersonalQuestion < player.personalQuestions.length) {
    sendPersonalQuestion(roomCode, player);
    return;
  }

  player.hasAnsweredSetup = true;
  io.to(player.id).emit("personalQuestionsComplete");

  const everyoneDone = room.players.every((entry) => entry.hasAnsweredSetup);
  if (everyoneDone) {
    prepareSelectedQuestions(roomCode);
  }
}

function assignQuestionsToPlayers(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;

  const usedQuestions = new Set();
  const shuffledBank = shuffle(questionBank);

  room.players.forEach((player) => {
    player.personalQuestions = [];
    player.personalAnswers = {};
    player.currentPersonalQuestion = 0;
    player.hasAnsweredSetup = false;
    player.score = 0;
    clearPlayerTimer(player);

    for (const question of shuffledBank) {
      if (!usedQuestions.has(question)) {
        player.personalQuestions.push(question);
        usedQuestions.add(question);
      }
      if (player.personalQuestions.length >= 3) break;
    }

    if (player.personalQuestions.length < 3) {
      for (const question of questionBank) {
        if (!usedQuestions.has(question)) {
          player.personalQuestions.push(question);
          usedQuestions.add(question);
        }
        if (player.personalQuestions.length >= 3) break;
      }
    }
  });

  room.players.forEach((player) => sendPersonalQuestion(roomCode, player));
}

// Orders the picked questions so the same owner is never up twice in a row
// unless there is simply nothing else left to play.
function orderQuestionsForVariety(questions) {
  const pool = shuffle(questions);
  const ordered = [];

  while (pool.length) {
    const previous = ordered[ordered.length - 1];
    const nextIndex = pool.findIndex((entry) => !previous || entry.ownerId !== previous.ownerId);
    ordered.push(...pool.splice(nextIndex === -1 ? 0 : nextIndex, 1));
  }

  return ordered;
}

function prepareSelectedQuestions(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;

  const answeredByOwner = room.players.map((player) =>
    shuffle(
      player.personalQuestions
        .filter((question) => Object.prototype.hasOwnProperty.call(player.personalAnswers, question))
        .map((question) => ({
          question,
          prompt: personalizeQuestion(question, player.name),
          ownerId: player.id,
          ownerName: player.name,
          answer: player.personalAnswers[question]
        }))
    )
  );

  // Take one question per player per pass, so the 8 slots are spread as evenly as
  // the group allows before anyone contributes a second or third question.
  const questionLimit = 8;
  const deepestStack = Math.max(0, ...answeredByOwner.map((questions) => questions.length));
  const selected = [];

  for (let round = 0; round < deepestStack && selected.length < questionLimit; round += 1) {
    const layer = shuffle(answeredByOwner.map((questions) => questions[round]).filter(Boolean));

    for (const entry of layer) {
      if (selected.length >= questionLimit) break;
      selected.push(entry);
    }
  }

  room.selectedQuestions = orderQuestionsForVariety(selected);
  room.currentQuestionIndex = 0;
  room.guesses = {};
  startRound(roomCode);
}

function startRound(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;
  clearRoomTimer(room);

  if (room.currentQuestionIndex >= room.selectedQuestions.length) {
    finishGame(roomCode);
    return;
  }

  const current = room.selectedQuestions[room.currentQuestionIndex];
  room.currentRound = current;
  room.guesses = {};
  room.status = "guessing";
  const timerPayload = getTimerPayload();

  room.players.forEach((player) => {
    if (player.id === current.ownerId) {
      io.to(player.id).emit("questionOwnerWaiting", {
        question: current.question,
        ownerName: current.ownerName,
        questionNumber: room.currentQuestionIndex + 1,
        totalQuestions: room.selectedQuestions.length,
        ...timerPayload
      });
    } else {
      io.to(player.id).emit("guessQuestion", {
        question: current.prompt,
        ownerName: current.ownerName,
        questionNumber: room.currentQuestionIndex + 1,
        totalQuestions: room.selectedQuestions.length,
        ...timerPayload
      });
    }
  });

  scheduleRoomTimer(roomCode, () => revealQuestion(roomCode));
}

function revealQuestion(roomCode) {
  const room = getRoom(roomCode);
  if (!room || room.status !== "guessing") return;
  clearRoomTimer(room);

  const current = room.selectedQuestions[room.currentQuestionIndex];
  if (!current) return;

  const results = [];

  room.players.forEach((player) => {
    if (player.id === current.ownerId) {
      results.push({
        name: player.name,
        answer: current.answer,
        owner: true,
        matched: false
      });
      return;
    }

    const guess = room.guesses[player.id] || "";
    const matched = normalizeAnswer(guess) === normalizeAnswer(current.answer);

    if (matched) {
      player.score += 1;
    }

    results.push({
      name: player.name,
      answer: guess,
      owner: false,
      matched
    });
  });

  room.status = "results";
  const timerPayload = getTimerPayload();

  io.to(roomCode).emit("questionRevealed", {
    question: current.prompt,
    ownerName: current.ownerName,
    correctAnswer: current.answer,
    questionNumber: room.currentQuestionIndex + 1,
    totalQuestions: room.selectedQuestions.length,
    results,
    players: getPublicPlayers(room.players),
    ...timerPayload
  });

  scheduleRoomTimer(roomCode, () => advanceQuestion(roomCode));
}

function advanceQuestion(roomCode) {
  const room = getRoom(roomCode);
  if (!room || room.status !== "results") return;
  clearRoomTimer(room);

  room.currentQuestionIndex += 1;
  if (room.currentQuestionIndex >= room.selectedQuestions.length) {
    finishGame(roomCode);
    return;
  }

  startRound(roomCode);
}

function finishGame(roomCode, message = null) {
  const room = getRoom(roomCode);
  if (!room) return;
  clearRoomTimer(room);
  room.players.forEach(clearPlayerTimer);

  room.status = "finished";
  const leaderboard = [...room.players].sort((a, b) => b.score - a.score);
  const winnerName = leaderboard[0] ? leaderboard[0].name : null;

  io.to(roomCode).emit("gameFinished", {
    leaderboard: getPublicPlayers(leaderboard),
    winnerName,
    message
  });
}

function returnToLobby(roomCode, message) {
  const room = getRoom(roomCode);
  if (!room) return;

  clearRoomTimer(room);
  room.players.forEach((player) => {
    clearPlayerTimer(player);
    player.score = 0;
    player.personalQuestions = [];
    player.personalAnswers = {};
    player.currentPersonalQuestion = 0;
    player.hasAnsweredSetup = false;
  });

  room.status = "lobby";
  room.gameStarted = false;
  room.selectedQuestions = [];
  room.currentQuestionIndex = 0;
  room.guesses = {};
  room.currentRound = null;

  io.to(roomCode).emit("returnedToLobby", {
    roomCode,
    players: getPublicPlayers(room.players),
    hostId: room.hostId,
    message
  });
}

// Keeps a round moving when the player everyone was waiting on leaves.
function resumeAfterPlayerLeft(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;

  if (room.status === "setup") {
    if (room.players.length < 2) {
      returnToLobby(roomCode, "Not enough players left to keep going. Back to the lobby.");
      return;
    }

    if (room.players.every((player) => player.hasAnsweredSetup)) {
      prepareSelectedQuestions(roomCode);
    }
    return;
  }

  if (room.status === "guessing") {
    if (room.players.length < 2) {
      finishGame(roomCode, "Everyone else left, so we wrapped the game up early.");
      return;
    }

    const current = room.selectedQuestions[room.currentQuestionIndex];
    if (!current) return;

    const guessers = room.players.filter((player) => player.id !== current.ownerId);
    const allSubmitted = guessers.every((player) =>
      Object.prototype.hasOwnProperty.call(room.guesses, player.id)
    );

    if (guessers.length === 0 || allSubmitted) {
      revealQuestion(roomCode);
    }
    return;
  }

  if (room.status === "results" && room.players.length < 2) {
    finishGame(roomCode, "Everyone else left, so we wrapped the game up early.");
  }
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("createGame", (playerName) => {
    const name = String(playerName || "").trim();
    if (!name) {
      socket.emit("joinError", "Please enter a valid name.");
      return;
    }

    let roomCode;
    do {
      roomCode = generateRoomCode();
    } while (rooms[roomCode]);

    const room = createRoomState();
    room.hostId = socket.id;
    room.players.push({
      id: socket.id,
      name,
      score: 0,
      personalQuestions: [],
      personalAnswers: {},
      currentPersonalQuestion: 0,
      hasAnsweredSetup: false
    });

    rooms[roomCode] = room;
    socket.join(roomCode);

    socket.emit("gameCreated", {
      roomCode,
      players: getPublicPlayers(room.players),
      hostId: room.hostId,
      isHost: true
    });

    emitPlayers(roomCode);
  });

  socket.on("joinGame", ({ playerName, roomCode }) => {
    const name = String(playerName || "").trim();
    const code = String(roomCode || "").toUpperCase();

    if (!name) {
      socket.emit("joinError", "Please enter your name.");
      return;
    }

    const room = getRoom(code);
    if (!room) {
      socket.emit("joinError", "Room not found.");
      return;
    }

    if (room.players.length >= 8) {
      socket.emit("joinError", "Room is full.");
      return;
    }

    if (room.gameStarted) {
      socket.emit("joinError", "The game has already started.");
      return;
    }

    room.players.push({
      id: socket.id,
      name,
      score: 0,
      personalQuestions: [],
      personalAnswers: {},
      currentPersonalQuestion: 0,
      hasAnsweredSetup: false
    });

    socket.join(code);
    socket.emit("gameJoined", {
      roomCode: code,
      players: getPublicPlayers(room.players),
      hostId: room.hostId,
      isHost: false
    });

    emitPlayers(code);
  });

  socket.on("startGame", (roomCode) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (room.hostId !== socket.id) return;
    if (room.players.length < 2) {
      socket.emit("startError", "At least 2 players are required to start.");
      return;
    }

    room.gameStarted = true;
    room.status = "setup";
    assignQuestionsToPlayers(roomCode);
  });

  socket.on("submitPersonalAnswer", ({ roomCode, answer }) => {
    const room = getRoom(roomCode);
    if (!room || room.status !== "setup") return;

    const player = room.players.find((entry) => entry.id === socket.id);
    if (!player) return;

    const trimmed = String(answer || "").trim();
    if (!trimmed) return;

    processPersonalAnswer(roomCode, socket.id, trimmed);
  });

  socket.on("submitGuess", ({ roomCode, guess }) => {
    const room = getRoom(roomCode);
    if (!room || room.status !== "guessing") return;

    const current = room.selectedQuestions[room.currentQuestionIndex];
    if (!current) return;
    if (current.ownerId === socket.id) return;

    const trimmed = String(guess || "").trim();
    if (!trimmed) return;

    room.guesses[socket.id] = trimmed;

    const guessers = room.players.filter((player) => player.id !== current.ownerId);
    const allSubmitted = guessers.every((player) => Object.prototype.hasOwnProperty.call(room.guesses, player.id));

    if (allSubmitted) {
      revealQuestion(roomCode);
    }
  });

  socket.on("nextQuestion", (roomCode) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (room.hostId !== socket.id) return;
    if (room.status !== "results") return;

    advanceQuestion(roomCode);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    for (const roomCode of Object.keys(rooms)) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex((player) => player.id === socket.id);

      if (playerIndex === -1) continue;

      const [departed] = room.players.splice(playerIndex, 1);
      clearPlayerTimer(departed);
      delete room.guesses[socket.id];

      if (room.players.length === 0) {
        clearRoomTimer(room);
        delete rooms[roomCode];
        break;
      }

      if (room.hostId === socket.id) {
        room.hostId = room.players[0].id;
      }

      emitPlayers(roomCode);
      io.to(roomCode).emit("playerLeft", { name: departed.name, hostId: room.hostId });
      resumeAfterPlayerLeft(roomCode);
      break;
    }
  });
});

server.listen(PORT, HOST, () => {
  const ips = getLocalIps();
  console.log(`Real Ones server running on http://localhost:${PORT}`);
  if (ips.length) {
    ips.forEach((ip) => console.log(`Local network: http://${ip}:${PORT}`));
  }
  console.log("Use the local IP above for friends on the same Wi‑Fi, or tunnel this port via a public host for internet play.");
});
