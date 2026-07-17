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


// AUDIO VISUALIZER

let audioContext;
let analyser;
let source;
let dataArray;
let visualizerStarted = false;



function formatTime(seconds) {

    if (isNaN(seconds)) return "0:00";

    let min = Math.floor(seconds / 60);

    let sec = Math.floor(seconds % 60);

    if (sec < 10) {
        sec = "0" + sec;
    }

    return `${min}:${sec}`;

}





function createVisualizer(){


    const waveform =
    document.querySelector(".waveform");


    if(!waveform) return;


    waveform.innerHTML = "";


    for(let i = 0; i < 32; i++){

        const bar = document.createElement("span");

        waveform.appendChild(bar);

    }

}





function startVisualizer(){


    if(visualizerStarted){

        audioContext.resume();

        return;

    }


    audioContext =
    new AudioContext();


    analyser =
    audioContext.createAnalyser();


    source =
    audioContext.createMediaElementSource(audio);


    source.connect(analyser);


    analyser.connect(
        audioContext.destination
    );


    analyser.fftSize = 64;


    dataArray =
    new Uint8Array(
        analyser.frequencyBinCount
    );


    createVisualizer();


    visualizerStarted = true;


    animateVisualizer();


}





function animateVisualizer(){


    requestAnimationFrame(
        animateVisualizer
    );


    if(!analyser) return;


    analyser.getByteFrequencyData(
        dataArray
    );


    const bars =
    document.querySelectorAll(
        ".waveform span"
    );


    bars.forEach((bar,index)=>{


        let value =
        dataArray[index] || 0;


        let height =
        Math.max(
            5,
            value / 2
        );


        bar.style.height =
        height + "px";


    });


}







function resetTracks(){


    tracks.forEach(track=>{


        track.classList.remove("active");

        track.classList.remove("playing");


        const icon =
        track.querySelector(".play-btn i");


        if(icon){

            icon.className =
            "fas fa-play";

        }


    });


}







function loadTrack(index){


    const track =
    tracks[index];


    currentTrack = index;


    audio.src =
    track.dataset.src;


    title.textContent =
    track.dataset.title;


    info.textContent =
    track.dataset.info;



    resetTracks();


    track.classList.add("active");


}







function playTrack(){


    startVisualizer();


    audio.play();



    mainPlay.innerHTML =
    '<i class="fas fa-pause">';



    const track =
    tracks[currentTrack];


    track.classList.add("playing");



    const icon =
    track.querySelector(".play-btn i");


    if(icon){

        icon.className =
        "fas fa-pause";

    }


}







function pauseTrack(){


    audio.pause();


    mainPlay.innerHTML =
    '<i class="fas fa-play"></i>';



    const track =
    tracks[currentTrack];


    track.classList.remove("playing");



    const icon =
    track.querySelector(".play-btn i");


    if(icon){

        icon.className =
        "fas fa-play";

    }


}








tracks.forEach((track,index)=>{


    const button =
    track.querySelector(".play-btn");



    button.addEventListener(
    "click",
    (e)=>{


        e.stopPropagation();



        if(currentTrack !== index || !audio.src){


            loadTrack(index);

            playTrack();


        }

        else{


            if(audio.paused){

                playTrack();

            }

            else{

                pauseTrack();

            }


        }


    });






    track.addEventListener(
    "click",
    ()=>{


        if(currentTrack !== index || !audio.src){


            loadTrack(index);

            playTrack();


        }

        else{


            if(audio.paused){

                playTrack();

            }

            else{

                pauseTrack();

            }


        }


    });


});








mainPlay.addEventListener(
"click",
()=>{


    if(!audio.src){

        loadTrack(0);

    }



    if(audio.paused){

        playTrack();

    }

    else{

        pauseTrack();

    }


});









audio.addEventListener(
"timeupdate",
()=>{


    if(audio.duration){


        seek.value =
        (audio.currentTime / audio.duration) * 100;



        currentTime.textContent =
        formatTime(audio.currentTime);



        totalTime.textContent =
        formatTime(audio.duration);


    }


});








seek.addEventListener(
"input",
()=>{


    if(audio.duration){


        audio.currentTime =
        (seek.value / 100) * audio.duration;


    }


});








next.addEventListener(
"click",
()=>{


    currentTrack++;


    if(currentTrack >= tracks.length){

        currentTrack = 0;

    }


    loadTrack(currentTrack);

    playTrack();


});








prev.addEventListener(
"click",
()=>{


    currentTrack--;


    if(currentTrack < 0){

        currentTrack =
        tracks.length - 1;

    }


    loadTrack(currentTrack);

    playTrack();


});








audio.addEventListener(
"ended",
()=>{


    next.click();


});
