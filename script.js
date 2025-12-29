// ===== PLAYLIST =====//

const songs = [
  { title: "disarankan di bandung", file: "assets/song1.mp3" },
  { title: "Kota ini tak sama tanpamu", file: "assets/song2.mp3" },
  { title: "ngaa dulu", file: "assets/song3.mp3" }
];

let index = 0;
const audio = document.getElementById("audio");
const title = document.getElementById("song-title");

function loadSong() {
  audio.src = songs[index].file;
  title.innerText = songs[index].title;
}

function playPause() {
  if (audio.paused) audio.play();
  else audio.pause();
}

function nextSong() {
  index = (index + 1) % songs.length;
  loadSong();
  audio.play();
}

function prevSong() {
  index = (index - 1 + songs.length) % songs.length;
  loadSong();
  audio.play();
}

loadSong();

// ===== PARTICLES =====
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
  });
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "cyan";

  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();