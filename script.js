/* ===============================
   AUDIO DATA
================================ */
const songs = [
  "assets/song1.mp3",
  "assets/song2.mp3",
  "assets/song3.mp3"
];

const titles = [
  "Disarankan di Bandung",
  "Kota Ini Tak Sama Tanpamu",
  "Ngga Dulu"
];

let index = 0;

/* ===============================
   AUDIO ELEMENT
================================ */
const audio = new Audio();
audio.preload = "auto";

/* ===============================
   DOM
================================ */
const titleEl = document.getElementById("songTitle");
const progress = document.querySelector(".progress");
const playlist = document.getElementById("playlist");
const card = document.querySelector(".card");

/* ===============================
   PLAYLIST
================================ */
titles.forEach((title, i) => {
  const el = document.createElement("div");
  el.className = "song";
  el.innerText = title;
  el.onclick = () => {
    index = i;
    loadSong();
    play();
  };
  playlist.appendChild(el);
});

function updateActive() {
  document.querySelectorAll(".song").forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });
}

/* ===============================
   CONTROL
================================ */
function loadSong() {
  audio.src = songs[index];
  titleEl.innerText = titles[index];
  updateActive();
}

function play() {
  initAudio();
  audio.play();
}

function togglePlay() {
  if (!audio.src) loadSong();
  audio.paused ? play() : audio.pause();
}

function nextSong() {
  index = (index + 1) % songs.length;
  loadSong();
  play();
}

function prevSong() {
  index = (index - 1 + songs.length) % songs.length;
  loadSong();
  play();
}

/* ===============================
   PROGRESS
================================ */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.style.width =
    (audio.currentTime / audio.duration) * 100 + "%";
});

/* ===============================
   AUDIO CONTEXT
================================ */
let ctx, analyser, src, freq;

function initAudio() {
  if (ctx) return;

  ctx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;

  src = ctx.createMediaElementSource(audio);
  src.connect(analyser);
  analyser.connect(ctx.destination);

  freq = new Uint8Array(analyser.frequencyBinCount);
  ambienceLoop();
}

/* ===============================
   ULTRA PREMIUM BEAT AMBIENCE
================================ */
let smooth = 0;

function ambienceLoop() {
  requestAnimationFrame(ambienceLoop);
  analyser.getByteFrequencyData(freq);

  // ultra low bass only
  let bass = 0;
  for (let i = 0; i < 3; i++) bass += freq[i];
  bass = bass / 3 / 255;

  // heavy smoothing (cinematic)
  smooth += (bass - smooth) * 0.025;

  // very subtle scale
  const scale = 1 + smooth * 0.018;
  card.style.transform =
    `translate(-50%, -50%) scale(${scale})`;

  // soft luxury glow
  card.style.boxShadow = `
    0 20px 60px rgba(0,0,0,.6),
    0 0 ${60 + smooth * 160}px rgba(255,255,255,.06),
    0 0 ${140 + smooth * 320}px rgba(120,255,240,${0.06 + smooth})
  `;

  // ambient background light
  document.body.style.background =
    `radial-gradient(
      circle at center,
      rgba(40,255,240,${0.04 + smooth * 0.18}),
      #000 80%
    )`;
}

/* ===============================
   INIT
================================ */
loadSong();
