const songs=[
  "assets/song1.mp3",
  "assets/song2.mp3",
  "assets/song3.mp3",
  "assets/song4.mp3"
];

const titles=[
  "Disarankan di Bandung",
  "Kota Ini Tak Sama Tanpamu",
  "Ngga Dulu",
  "Menerima Luka"
];

const covers=[
  "assets/cover1.jpg",
  "assets/cover2.jpg",
  "assets/cover3.jpg",
  "assets/cover4.jpg"
];

let index=0;
const audio=new Audio();
audio.preload="auto";
audio.volume=0.7;

const titleEl=document.getElementById("songTitle");
const progress=document.querySelector(".progress");
const playlist=document.getElementById("playlist");
const player=document.getElementById("playerCard");
const bg=document.querySelector(".bg");
const cover=document.getElementById("cover");
const vol=document.querySelector(".volume");
const cur=document.getElementById("current");
const dur=document.getElementById("duration");

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
  cover.src=covers[index];
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

/* VOLUME */
vol.oninput=()=> audio.volume=vol.value;

/* TIME */
audio.addEventListener("loadedmetadata",()=>{
  dur.innerText=format(audio.duration);
});
audio.addEventListener("timeupdate",()=>{
  if(!audio.duration)return;
  progress.style.width=
    (audio.currentTime/audio.duration)*100+"%";
  cur.innerText=format(audio.currentTime);
});

function format(t){
  const m=Math.floor(t/60);
  const s=Math.floor(t%60);
  return `${m}:${s<10?"0":""}${s}`;
}

/* RESET */
audio.addEventListener("ended",resetVisual);
audio.addEventListener("pause",resetVisual);

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

/* BEAT */
let smooth=0;
function loop(){
  requestAnimationFrame(loop);
  if(!analyser)return;

  analyser.getByteFrequencyData(freq);
  let energy=0;
  for(let i=0;i<12;i++) energy+=freq[i];
  energy=energy/12/255;

  smooth+=(energy-smooth)*0.05;

  player.style.transform=`scale(${1+smooth*0.03})`;
  player.style.boxShadow=
    `0 40px 120px rgba(0,0,0,.8),
     0 0 ${50+smooth*220}px rgba(160,255,245,.35)`;

  bg.style.transform=`scale(${1+smooth*0.12})`;
}

function resetVisual(){
  smooth=0;
  player.style.transform="scale(1)";
  player.style.boxShadow=
    "0 40px 120px rgba(0,0,0,.8)";
  bg.style.transform="scale(1)";
}

(function(){
    const board = document.querySelector('.miniPuzzleBoard');
    const numbers = [1,2,3,4,5,6,7,8];
    let cardsArray = [...numbers, ...numbers];
    let flippedCards = [];
    let matchedCards = 0;

    // Shuffle
    cardsArray.sort(() => 0.5 - Math.random());

    // Create cards
    cardsArray.forEach(num => {
      const card = document.createElement('div');
      card.classList.add('miniPuzzleCard');
      card.dataset.number = num;
      card.innerText = "";
      card.addEventListener('click', flipCard);
      board.appendChild(card);
    });

    function flipCard() {
      if (this.classList.contains('flipped') || flippedCards.length === 2) return;
      this.classList.add('flipped');
      this.innerText = this.dataset.number;
      flippedCards.push(this);

      if (flippedCards.length === 2) {
        if (flippedCards[0].dataset.number === flippedCards[1].dataset.number) {
          flippedCards.forEach(c => c.classList.add('matched'));
          matchedCards += 2;
          flippedCards = [];
          if (matchedCards === cardsArray.length) {
            setTimeout(() => alert('Selamat! Kamu menyelesaikan puzzle!'), 200);
          }
        } else {
          setTimeout(() => {
            flippedCards.forEach(c => {
              c.classList.remove('flipped');
              c.innerText = "";
            });
            flippedCards = [];
          }, 800);
        }
      }
    }
  })();
load();
