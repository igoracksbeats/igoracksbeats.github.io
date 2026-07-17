const audio = document.getElementById("audio");

const tracks = document.querySelectorAll(".beat");

const mainPlay = document.getElementById("main-play");

const title = document.getElementById("current-title");
const info = document.getElementById("current-info");

const seek = document.getElementById("seek");

const currentTime = document.getElementById("time-current");
const totalTime = document.getElementById("time-total");

const prev = document.getElementById("prev");
const next = document.getElementById("next");


let currentTrack = 0;



function formatTime(seconds) {

    if (isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);

    let secondsLeft = Math.floor(seconds % 60);

    if (secondsLeft < 10) {
        secondsLeft = "0" + secondsLeft;
    }

    return `${minutes}:${secondsLeft}`;

}





function loadTrack(index) {

    const track = tracks[index];

    currentTrack = index;

    audio.src = track.dataset.src;

    title.textContent = track.dataset.title;

    info.textContent = track.dataset.info;


    tracks.forEach(item => {
        item.classList.remove("active");

        const icon = item.querySelector(".play-btn i");

        if(icon){
            icon.className = "fas fa-play";
        }

    });


    track.classList.add("active");


}






function playTrack() {

    audio.play();

    mainPlay.innerHTML =
    '<i class="fas fa-pause"></i>';


    const activeButton =
    tracks[currentTrack].querySelector(".play-btn i");


    if(activeButton){
        activeButton.className = "fas fa-pause";
    }

}






function pauseTrack() {

    audio.pause();

    mainPlay.innerHTML =
    '<i class="fas fa-play"></i>';


    const activeButton =
    tracks[currentTrack].querySelector(".play-btn i");


    if(activeButton){
        activeButton.className = "fas fa-play";
    }

}






tracks.forEach((track,index)=>{


    const button = track.querySelector(".play-btn");


    button.addEventListener("click",(event)=>{


        event.stopPropagation();


        if(currentTrack !== index || !audio.src){


            loadTrack(index);

            playTrack();


        } else {


            if(audio.paused){

                playTrack();

            } else {

                pauseTrack();

            }

        }


    });





    track.addEventListener("click",()=>{


        loadTrack(index);

        playTrack();


    });



});








mainPlay.addEventListener("click",()=>{


    if(!audio.src){

        loadTrack(0);

    }


    if(audio.paused){

        playTrack();

    } else {

        pauseTrack();

    }


});








audio.addEventListener("timeupdate",()=>{


    if(audio.duration){


        seek.value =
        (audio.currentTime / audio.duration) * 100;


        currentTime.textContent =
        formatTime(audio.currentTime);


        totalTime.textContent =
        formatTime(audio.duration);


    }


});








seek.addEventListener("input",()=>{


    if(audio.duration){


        audio.currentTime =
        (seek.value / 100) * audio.duration;


    }


});








next.addEventListener("click",()=>{


    currentTrack++;


    if(currentTrack >= tracks.length){

        currentTrack = 0;

    }


    loadTrack(currentTrack);

    playTrack();


});








prev.addEventListener("click",()=>{


    currentTrack--;


    if(currentTrack < 0){

        currentTrack = tracks.length - 1;

    }


    loadTrack(currentTrack);

    playTrack();


});








audio.addEventListener("ended",()=>{


    next.click();


});
