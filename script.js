/* ===== MUSIC ===== */
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

/* RENDER PLAYLIST */
titles.forEach((t,i)=>{
 const d=document.createElement("div");
 d.className="song";
 d.innerText=t;
 d.onclick=()=>{index=i;playSong()};
 playlist.appendChild(d);
});

function playSong(){
 audio.src=songs[index];
 title.innerText=titles[index];
 audio.play();
 document.querySelectorAll(".song").forEach((s,i)=>{
  s.classList.toggle("active",i===index);
 });
 document.querySelector(".song.active")
  ?.scrollIntoView({behavior:"smooth",block:"center"});
 initAudio();
}

function togglePlay(){
 initAudio();
 audio.paused?audio.play():audio.pause();
}
function nextSong(){index=(index+1)%songs.length;playSong()}
function prevSong(){index=(index-1+songs.length)%songs.length;playSong()}

audio.addEventListener("timeupdate",()=>{
 progress.style.width=(audio.currentTime/audio.duration)*100+"%";
});

/* ===== AUDIO CONTEXT (SAFE) ===== */
let audioCtx,analyser,src,data;

function initAudio(){
 if(audioCtx) return;
 audioCtx=new (window.AudioContext||window.webkitAudioContext)();
 analyser=audioCtx.createAnalyser();
 src=audioCtx.createMediaElementSource(audio);
 src.connect(analyser);
 analyser.connect(audioCtx.destination);
 analyser.fftSize=64;
 data=new Uint8Array(analyser.frequencyBinCount);
 visual();
}

/* ===== CIRCULAR VISUALIZER ===== */
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
  const x1=cx+Math.cos(a)*r;
  const y1=cy+Math.sin(a)*r;
  const x2=cx+Math.cos(a)*(r+bar);
  const y2=cy+Math.sin(a)*(r+bar);

  vCtx.strokeStyle="#00fff0";
  vCtx.lineWidth=3;
  vCtx.shadowBlur=15;
  vCtx.shadowColor="#00fff0";
  vCtx.beginPath();
  vCtx.moveTo(x1,y1);
  vCtx.lineTo(x2,y2);
  vCtx.stroke();
 });
}

/* ===== PARTICLES ===== */
const pCanvas=document.getElementById("particles");
const pCtx=pCanvas.getContext("2d");
pCanvas.width=innerWidth;
pCanvas.height=innerHeight;

const pts=[...Array(60)].map(()=>({
 x:Math.random()*innerWidth,
 y:Math.random()*innerHeight,
 dx:(Math.random()-.5),
 dy:(Math.random()-.5)
}));

(function animate(){
 pCtx.clearRect(0,0,innerWidth,innerHeight);
 pts.forEach(pt=>{
  pt.x+=pt.dx; pt.y+=pt.dy;
  pCtx.fillStyle="#00fff0";
  pCtx.fillRect(pt.x,pt.y,2,2);
 });
 requestAnimationFrame(animate);
})();

window.addEventListener("resize",()=>{
 vCanvas.width=innerWidth;
 vCanvas.height=innerHeight;
 pCanvas.width=innerWidth;
 pCanvas.height=innerHeight;
});

/* INIT ON FIRST CLICK (BROWSER SAFE) */
document.addEventListener("click",initAudio,{once:true});
