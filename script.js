/* ==========================================
   ELEMENTS
========================================== */

const audio = document.getElementById("audio");

const tracks = [...document.querySelectorAll(".track")];

const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const seek = document.getElementById("seek");

const currentTime = document.getElementById("current");
const durationTime = document.getElementById("duration");

const playerTitle = document.getElementById("player-title");
const playerInfo = document.getElementById("player-info");

let currentIndex = 0;


/* ==========================================
   CREATE WAVES
========================================== */

document.querySelectorAll(".wave").forEach(wave=>{

    for(let i=0;i<90;i++){

        const bar=document.createElement("span");

        bar.style.height=(4+Math.random()*18)+"px";

        bar.style.animationDelay=(Math.random()*0.5)+"s";

        wave.appendChild(bar);

    }

});

const bars=document.querySelectorAll(".wave span");


/* ==========================================
   WAVE
========================================== */

function startWave(){

    bars.forEach(bar=>{

        bar.style.animationPlayState="running";

    });

}

function stopWave(){

    bars.forEach(bar=>{

        bar.style.animationPlayState="paused";

    });

}


/* ==========================================
   TIME
========================================== */

function formatTime(sec){

    if(isNaN(sec)) return "0:00";

    const m=Math.floor(sec/60);

    const s=Math.floor(sec%60);

    return `${m}:${String(s).padStart(2,"0")}`;

}


/* ==========================================
   LOAD TRACK
========================================== */

function loadTrack(index){

    currentIndex=index;

    const track=tracks[index];

    audio.src=track.dataset.src;

    playerTitle.textContent=track.dataset.title;

    playerInfo.textContent=track.dataset.info;

    tracks.forEach(t=>t.classList.remove("active"));

    track.classList.add("active");

    updatePlayButtons(false);

}


/* ==========================================
   BUTTONS
========================================== */

function updatePlayButtons(isPlaying){

    tracks.forEach(track=>{

        track.querySelector(".track-play i").className="fas fa-play";

    });

    if(tracks[currentIndex]){

        tracks[currentIndex]
            .querySelector(".track-play i")
            .className=isPlaying
            ? "fas fa-pause"
            : "fas fa-play";

    }

    playButton.innerHTML=isPlaying
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';

}


/* ==========================================
   TRACK CLICK
========================================== */

tracks.forEach((track,index)=>{

    track.querySelector(".track-play")
    .addEventListener("click",()=>{

        if(currentIndex!==index){

            loadTrack(index);

            audio.play();

            return;

        }

        if(audio.paused){

            audio.play();

        }else{

            audio.pause();

        }

    });

});


/* ==========================================
   MAIN PLAY
========================================== */

playButton.addEventListener("click",()=>{

    if(!audio.src){

        loadTrack(0);

    }

    if(audio.paused){

        audio.play();

    }else{

        audio.pause();

    }

});


/* ==========================================
   PREVIOUS
========================================== */

prevButton.addEventListener("click",()=>{

    currentIndex--;

    if(currentIndex<0){

        currentIndex=tracks.length-1;

    }

    loadTrack(currentIndex);

    audio.play();

});


/* ==========================================
   NEXT
========================================== */

nextButton.addEventListener("click",()=>{

    currentIndex++;

    if(currentIndex>=tracks.length){

        currentIndex=0;

    }

    loadTrack(currentIndex);

    audio.play();

});
/* ==========================================
   AUDIO EVENTS
========================================== */

audio.addEventListener("play",()=>{

    updatePlayButtons(true);

    startWave();

});

audio.addEventListener("pause",()=>{

    updatePlayButtons(false);

    stopWave();

});

audio.addEventListener("ended",()=>{

    stopWave();

    currentIndex++;

    if(currentIndex>=tracks.length){

        currentIndex=0;

    }

    loadTrack(currentIndex);

    audio.play();

});


/* ==========================================
   METADATA
========================================== */

audio.addEventListener("loadedmetadata",()=>{

    durationTime.textContent=formatTime(audio.duration);

});


/* ==========================================
   PROGRESS
========================================== */

audio.addEventListener("timeupdate",()=>{

    currentTime.textContent=formatTime(audio.currentTime);

    if(audio.duration){

        seek.value=(audio.currentTime/audio.duration)*100;

    }

});


/* ==========================================
   SEEK
========================================== */

seek.addEventListener("input",()=>{

    if(!audio.duration) return;

    audio.currentTime=(seek.value/100)*audio.duration;

});


/* ==========================================
   KEYBOARD
========================================== */

document.addEventListener("keydown",e=>{

    if(e.code==="Space"){

        e.preventDefault();

        playButton.click();

    }

});


/* ==========================================
   START
========================================== */

if(tracks.length){

    loadTrack(0);

}

stopWave();
