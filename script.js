
/* === MUSIC === */
const songs=[
 "assets/song1.mp3",
 "assets/song2.mp3",
 "assets/song3.mp3"
];
const titles=[
 "Disarankan Di Bandung",
 "Kota Ini Tak Sama Tanpamu",
 "Ngga Dulu"
];

let index=0;
const audio=new Audio();
const title=document.getElementById("songTitle");
const progress=document.querySelector(".progress");
const playlist=document.getElementById("playlist");

/* PLAYLIST RENDER */
titles.forEach((t,i)=>{
 const div=document.createElement("div");
 div.className="song";
 div.innerText=t;
 div.onclick=()=>{index=i;playSong()};
 playlist.appendChild(div);
});

function playSong(){
 audio.src=songs[index];
 title.innerText=titles[index];
 audio.play();
 document.querySelectorAll(".song").forEach((s,i)=>{
  s.classList.toggle("active",i===index);
 });
}

function togglePlay(){audio.paused?audio.play():audio.pause()}
function nextSong(){index=(index+1)%songs.length;playSong()}
function prevSong(){index=(index-1+songs.length)%songs.length;playSong()}

audio.addEventListener("timeupdate",()=>{
 progress.style.width=(audio.currentTime/audio.duration)*100+"%";
});

/* === VISUALIZER === */
const vCanvas=document.getElementById("visualizer");
const vCtx=vCanvas.getContext("2d");
vCanvas.width=innerWidth;
vCanvas.height=innerHeight;

const audioCtx=new AudioContext();
const src=audioCtx.createMediaElementSource(audio);
const analyser=audioCtx.createAnalyser();
src.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize=64;
const data=new Uint8Array(analyser.frequencyBinCount);

function visual(){
 requestAnimationFrame(visual);
 analyser.getByteFrequencyData(data);
 vCtx.clearRect(0,0,vCanvas.width,vCanvas.height);
 data.forEach((v,i)=>{
  const x=i*20;
  const h=v*2;
  vCtx.fillStyle="#00fff0";
  vCtx.fillRect(x,vCanvas.height-h,10,h);
 });
}
visual();

/* === PARTICLES === */
const p=document.getElementById("particles").getContext("2d");
const pts=[...Array(60)].map(()=>({
 x:Math.random()*innerWidth,
 y:Math.random()*innerHeight,
 dx:(Math.random()-.5),
 dy:(Math.random()-.5)
}));

(function animate(){
 p.clearRect(0,0,innerWidth,innerHeight);
 pts.forEach(pt=>{
  pt.x+=pt.dx; pt.y+=pt.dy;
  p.fillStyle="#00fff0";
  p.fillRect(pt.x,pt.y,2,2);
 });
 requestAnimationFrame(animate);
})();
document.addEventListener("click", () => {
  initAudio();
}, { once: true });
