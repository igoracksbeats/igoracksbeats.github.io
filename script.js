const beats = document.querySelectorAll(".beat");

let currentAudio = null;
let currentButton = null;

beats.forEach((beat) => {

    const audio = beat.querySelector("audio");
    const button = beat.querySelector(".play-btn");
    const icon = button.querySelector("i");

    const progress = beat.querySelector(".progress");

    const current = beat.querySelector(".current");
    const duration = beat.querySelector(".duration");

    function format(time){

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${seconds.toString().padStart(2,"0")}`;

    }

    audio.addEventListener("loadedmetadata",()=>{

        duration.textContent = format(audio.duration);

    });

    button.addEventListener("click",()=>{

        if(currentAudio && currentAudio !== audio){

            currentAudio.pause();
            currentAudio.currentTime = 0;

            currentButton
                .querySelector("i")
                .className = "fas fa-play";

        }

        if(audio.paused){

            audio.play();

            icon.className = "fas fa-pause";

            currentAudio = audio;
            currentButton = button;

        }else{

            audio.pause();

            icon.className = "fas fa-play";

        }

    });

    audio.addEventListener("timeupdate",()=>{

        current.textContent = format(audio.currentTime);

        progress.value =
            (audio.currentTime / audio.duration) * 100 || 0;

    });

    progress.addEventListener("input",()=>{

        audio.currentTime =
            (progress.value / 100) * audio.duration;

    });

    audio.addEventListener("ended",()=>{

        progress.value = 0;

        current.textContent = "0:00";

        icon.className = "fas fa-play";

    });

});
