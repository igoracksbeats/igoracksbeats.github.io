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

let currentIndex = -1;


/* ==========================================
   CREATE WAVEFORMS
========================================== */

document.querySelectorAll(".wave").forEach(wave => {

    for (let i = 0; i < 90; i++) {

        const bar = document.createElement("span");

        const h = 4 + Math.random() * 18;

        bar.style.height = `${h}px`;

        wave.appendChild(bar);

    }

});


/* ==========================================
   FORMAT TIME
========================================== */

function formatTime(seconds){

    if(isNaN(seconds)) return "0:00";

    const m = Math.floor(seconds / 60);

    const s = Math.floor(seconds % 60);

    return `${m}:${String(s).padStart(2,"0")}`;

}


/* ==========================================
   LOAD TRACK
========================================== */

function loadTrack(index){

    currentIndex = index;

    const track = tracks[index];

    audio.src = track.dataset.src;

    playerTitle.textContent = track.dataset.title;

    playerInfo.textContent = track.dataset.info;

    tracks.forEach(t=>t.classList.remove("active"));

    track.classList.add("active");

}


/* ==========================================
   CLICK TRACK
========================================== */

tracks.forEach((track,index)=>{

    const btn = track.querySelector(".track-play");

    btn.addEventListener("click",()=>{

        if(currentIndex!==index){

            loadTrack(index);

        }

        audio.play();

    });

});

/* ==========================================
   PLAY / PAUSE
========================================== */

function updatePlayButtons(isPlaying){

    tracks.forEach(track=>{

        const icon = track.querySelector(".track-play i");

        icon.className = "fas fa-play";

    });

    if(currentIndex >= 0){

        const icon = tracks[currentIndex].querySelector(".track-play i");

        icon.className = isPlaying
            ? "fas fa-pause"
            : "fas fa-play";

    }

    playButton.innerHTML = isPlaying
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';

}


playButton.addEventListener("click",()=>{

    if(currentIndex === -1){

        loadTrack(0);

    }

    if(audio.paused){

        audio.play();

    }else{

        audio.pause();

    }

});


audio.addEventListener("play",()=>{

    updatePlayButtons(true);

});


audio.addEventListener("pause",()=>{

    updatePlayButtons(false);

});


/* ==========================================
   PREVIOUS / NEXT
========================================== */

prevButton.addEventListener("click",()=>{

    if(tracks.length===0) return;

    if(currentIndex<=0){

        loadTrack(tracks.length-1);

    }else{

        loadTrack(currentIndex-1);

    }

    audio.play();

});


nextButton.addEventListener("click",()=>{

    if(tracks.length===0) return;

    if(currentIndex>=tracks.length-1){

        loadTrack(0);

    }else{

        loadTrack(currentIndex+1);

    }

    audio.play();

});


audio.addEventListener("ended",()=>{

    nextButton.click();

});


/* ==========================================
   TIME
========================================== */

audio.addEventListener("loadedmetadata",()=>{

    durationTime.textContent =
        formatTime(audio.duration);

});


audio.addEventListener("timeupdate",()=>{

    currentTime.textContent =
        formatTime(audio.currentTime);

    if(audio.duration){

        seek.value =
            (audio.currentTime/audio.duration)*100;

    }

});


/* ==========================================
   SEEK
========================================== */

seek.addEventListener("input",()=>{

    if(!audio.duration) return;

    audio.currentTime =
        (seek.value/100)*audio.duration;

});


/* ==========================================
   START
========================================== */

if(tracks.length){

    loadTrack(0);

}
