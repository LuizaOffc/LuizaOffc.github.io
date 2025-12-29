/* ===== DATA ===== */
const songs=[
 "assets/song1.mp3",
 "assets/song2.mp3",
 "assets/song3.mp3"
];
const titles=[
 "Disarankan di Bandung",
 "Kota ini tak sama tanpamu",
 "Ngga dulu"
];

let index = 0;
let isPlaying = false;

const audio = new Audio();
audio.preload = "auto";

const titleEl = document.getElementById("songTitle");
const progress = document.querySelector(".progress");
const playlist = document.getElementById("playlist");

/* ===== PLAYLIST ===== */
titles.forEach((t,i)=>{
 const d=document.createElement("div");
 d.className="song";
 d.innerText=t;
 d.onclick=()=>{
   index=i;
   loadSong();
 };
 playlist.appendChild(d);
});

function loadSong(){
 audio.src = songs[index];
 titleEl.innerText = titles[index];
 document.querySelectorAll(".song").forEach((s,i)=>{
  s.classList.toggle("active",i===index);
 });
}

/* ===== CONTROLS ===== */
function togglePlay(){
 if(!audio.src) loadSong();
 initAudio();

 if(audio.paused){
  audio.play();
  isPlaying = true;
 }else{
  audio.pause();
  isPlaying = false;
 }
}

function nextSong(){
 index=(index+1)%songs.length;
 loadSong();
 audio.play();
}

function prevSong(){
 index=(index-1+songs.length)%songs.length;
 loadSong();
 audio.play();
}

/* ===== PROGRESS ===== */
audio.addEventListener("timeupdate",()=>{
 if(audio.duration){
  progress.style.width =
   (audio.currentTime/audio.duration)*100 + "%";
 }
});

/* ===== AUDIO CONTEXT (AMAN) ===== */
let audioCtx, analyser, src, data;

function initAudio(){
 if(audioCtx) return;

 audioCtx = new (window.AudioContext||window.webkitAudioContext)();
 analyser = audioCtx.createAnalyser();
 src = audioCtx.createMediaElementSource(audio);
 src.connect(analyser);
 analyser.connect(audioCtx.destination);
 analyser.fftSize = 64;
 data = new Uint8Array(analyser.frequencyBinCount);
 visual();
}

/* ===== VISUALIZER BULAT ===== */
const vCanvas=document.getElementById("visualizer");
const vCtx=vCanvas.getContext("2d");
vCanvas.width=innerWidth;
vCanvas.height=innerHeight;

function visual(){
 requestAnimationFrame(visual);
 analyser.getByteFrequencyData(data);
 vCtx.clearRect(0,0,vCanvas.width,vCanvas.height);

 const cx=vCanvas.width/2;
 const cy=vCanvas.height/2;
 const r=80;

 data.forEach((v,i)=>{
  const a=(i/data.length)*Math.PI*2;
  const bar=v*1.2;
  vCtx.strokeStyle="#00fff0";
  vCtx.lineWidth=3;
  vCtx.beginPath();
  vCtx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
  vCtx.lineTo(cx+Math.cos(a)*(r+bar),cy+Math.sin(a)*(r+bar));
  vCtx.stroke();
 });
}
