const songs=[
  "assets/song1.mp3",
  "assets/song2.mp3",
  "assets/song3.mp3"
];

const titles=[
  "Disarankan di Bandung",
  "Kota Ini Tak Sama Tanpamu",
  "Ngga Dulu"
];

let index=0;
const audio=new Audio();
audio.preload="auto";

const titleEl=document.getElementById("songTitle");
const progress=document.querySelector(".progress");
const playlist=document.getElementById("playlist");
const cards=document.querySelectorAll(".card");
const bg=document.querySelector(".bg");

/* PLAYLIST */
titles.forEach((t,i)=>{
  const el=document.createElement("div");
  el.className="song";
  el.innerText=t;
  el.onclick=()=>{
    index=i;
    load();
    play();
  };
  playlist.appendChild(el);
});

function updateActive(){
  document.querySelectorAll(".song")
    .forEach((s,i)=>s.classList.toggle("active",i===index));
}

function load(){
  audio.src=songs[index];
  titleEl.innerText=titles[index];
  updateActive();
}

function play(){
  initAudio();
  audio.play();
}

function togglePlay(){
  if(!audio.src) load();
  audio.paused?play():audio.pause();
}

function nextSong(){
  index=(index+1)%songs.length;
  load(); play();
}
function prevSong(){
  index=(index-1+songs.length)%songs.length;
  load(); play();
}

/* PROGRESS */
audio.addEventListener("timeupdate",()=>{
  if(!audio.duration)return;
  progress.style.width=
    (audio.currentTime/audio.duration)*100+"%";
});

/* AUDIO CONTEXT */
let ctx,analyser,src,freq;
function initAudio(){
  if(ctx)return;
  ctx=new(window.AudioContext||window.webkitAudioContext)();
  analyser=ctx.createAnalyser();
  analyser.fftSize=512;
  src=ctx.createMediaElementSource(audio);
  src.connect(analyser);
  analyser.connect(ctx.destination);
  freq=new Uint8Array(analyser.frequencyBinCount);
  loop();
}

/* BEAT LOOP */
let smooth=0;
function loop(){
  requestAnimationFrame(loop);
  analyser.getByteFrequencyData(freq);

  let energy=0;
  for(let i=0;i<10;i++) energy+=freq[i];
  energy=energy/10/255;

  smooth+=(energy-smooth)*0.05;

  const scale=1+smooth*0.03;
  cards.forEach(c=>{
    c.style.transform=`scale(${scale})`;
    c.style.boxShadow=
      `0 40px 120px rgba(0,0,0,.8),
       0 0 ${60+smooth*240}px rgba(160,255,245,.25)`;
  });

  bg.style.transform=`scale(${1+smooth*0.12})`;
  bg.style.opacity=0.6+smooth*0.5;
}

load();

}

/* ===== INIT ===== */
loadSong();

