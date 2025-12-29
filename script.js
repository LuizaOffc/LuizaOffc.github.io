// ===== PLAYLIST =====//

const songs = [
  "assets/song1.mp3",
  "assets/song2.mp3",
  "assets/song3.mp3"
];

const titles = [
  "Kota ini tak sama tanpamu",
  "Resah jadi luka",
  "Bawa dia kembali"
];

let index = 0;
const audio = new Audio(songs[index]);
const title = document.getElementById("songTitle");
const progress = document.querySelector(".progress");

function togglePlay() {
  if (audio.paused) audio.play();
  else audio.pause();
}

function nextSong() {
  index = (index + 1) % songs.length;
  playSong();
}

function prevSong() {
  index = (index - 1 + songs.length) % songs.length;
  playSong();
}

function playSong() {
  audio.src = songs[index];
  title.textContent = titles[index];
  audio.play();
}

audio.addEventListener("timeupdate", () => {
  progress.style.width = (audio.currentTime / audio.duration) * 100 + "%";
});

/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2 + 1,
  dx: (Math.random() - .5) * .5,
  dy: (Math.random() - .5) * .5
}));

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = "#00fff0";
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
