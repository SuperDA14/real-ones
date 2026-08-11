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
  "What food do you hate the most?",
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
  "What sport are you best at?",
  "What sport are you worst at?",
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
  "What is your favourite hobby?",
  "What is your biggest pet peeve?",
  "What annoys you the most?",
  "What makes you laugh the most?",
  "What is something you are terrible at?",
  "What is something you're surprisingly good at?",
  "What is something you always forget?",
  "What is something you always procrastinate?",
  "What is your most embarrassing habit?",
  "What is something you could never live without?",
  "What is the first thing you do when you wake up?",
  "What is the last thing you do before sleeping?",
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
  "What is my dream job?",
  "What is my dream car?",
  "What is my dream holiday?",
  "What is my biggest pet peeve?",
  "What is my favourite food?",
  "What is my favourite movie?",
  "What is my favourite sport?",
  "What is my favourite game?",
  "What is my favourite animal?",
  "What is my favourite colour?",
  "What is my biggest fear?",
  "What would I buy first if I became rich?",
  "What country would I most want to visit?",
  "What would I choose as my superpower?",
  "What is one thing I couldn't live without?"
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

function getPublicPlayers(players) {
  return players.map((player) => ({
    id: player.id,
    name: player.name,
    score: player.score
  }));
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

function prepareSelectedQuestions(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;

  const questionsByOwner = new Map();

  room.players.forEach((player) => {
    player.personalQuestions.forEach((question) => {
      if (Object.prototype.hasOwnProperty.call(player.personalAnswers, question)) {
        const ownerQuestions = questionsByOwner.get(player.id) || [];
        ownerQuestions.push({
          question,
          ownerId: player.id,
          ownerName: player.name,
          answer: player.personalAnswers[question]
        });
        questionsByOwner.set(player.id, ownerQuestions);
      }
    });
  });

  const guaranteedQuestions = [];
  const remainingQuestions = [];

  room.players.forEach((player) => {
    const ownerQuestions = shuffle(questionsByOwner.get(player.id) || []);
    const guaranteed = ownerQuestions.shift();

    if (guaranteed) {
      guaranteedQuestions.push(guaranteed);
    }

    remainingQuestions.push(...ownerQuestions);
  });

  const questionLimit = 8;
  const openSlots = Math.max(0, questionLimit - guaranteedQuestions.length);
  room.selectedQuestions = shuffle([
    ...guaranteedQuestions,
    ...shuffle(remainingQuestions).slice(0, openSlots)
  ]);
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
        question: current.question,
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
    question: current.question,
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

function finishGame(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;
  clearRoomTimer(room);
  room.players.forEach(clearPlayerTimer);

  room.status = "finished";
  const leaderboard = [...room.players].sort((a, b) => b.score - a.score);
  const winnerName = leaderboard[0] ? leaderboard[0].name : null;

  io.to(roomCode).emit("gameFinished", {
    leaderboard: getPublicPlayers(leaderboard),
    winnerName
  });
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
      isHost: true
    });

    io.to(roomCode).emit("playersUpdated", { players: getPublicPlayers(room.players) });
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
      isHost: false
    });

    io.to(code).emit("playersUpdated", { players: getPublicPlayers(room.players) });
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

      clearPlayerTimer(room.players[playerIndex]);
      room.players.splice(playerIndex, 1);

      if (room.players.length === 0) {
        clearRoomTimer(room);
        delete rooms[roomCode];
        break;
      }

      if (room.hostId === socket.id) {
        room.hostId = room.players[0].id;
      }

      io.to(roomCode).emit("playersUpdated", { players: getPublicPlayers(room.players) });
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
