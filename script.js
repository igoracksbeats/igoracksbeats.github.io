const audio =
  document.getElementById("audio");

const tracks =
  Array.from(
    document.querySelectorAll(".track")
  );

const playButton =
  document.getElementById("play");

const prevButton =
  document.getElementById("prev");

const nextButton =
  document.getElementById("next");

const seek =
  document.getElementById("seek");

const currentTime =
  document.getElementById("current");

const duration =
  document.getElementById("duration");

const playerTitle =
  document.getElementById("player-title");

const playerInfo =
  document.getElementById("player-info");


let currentTrackIndex = -1;


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(seconds) {

  if (
    !Number.isFinite(seconds)
  ) {
    return "0:00";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  const secs =
    Math.floor(
      seconds % 60
    );

  return (
    minutes +
    ":" +
    secs
      .toString()
      .padStart(2, "0")
  );

}


/* =========================================
   GENERATE MINI WAVEFORMS
========================================= */

document
  .querySelectorAll(".wave")
  .forEach(
    (wave, waveIndex) => {

      wave.innerHTML = "";

      const bars = 44;

      for (
        let i = 0;
        i < bars;
        i++
      ) {

        const bar =
          document.createElement("span");

        bar.className =
          "wave-bar";

        const value =
          (
            (
              i * 17 +
              waveIndex * 13
            ) %
            28
          ) +
          7;

        bar.style.height =
          `${value}px`;

        wave.appendChild(
          bar
        );

      }

    }
  );


/* =========================================
   ADD DOWNLOAD DEMO BUTTONS
========================================= */

tracks.forEach(
  (track, index) => {

    const src =
      track.dataset.src;

    const title =
      track.dataset.title ||
      `beat-${index + 1}`;

    const button =
      document.createElement(
        "button"
      );

    button.className =
      "download-demo";

    button.innerHTML =
      `
      <i class="fas fa-download"></i>
      <span>DOWNLOAD DEMO</span>
      `;


    button.addEventListener(
      "click",
      async (event) => {

        event.stopPropagation();

        if (!src) {
          return;
        }


        button.classList.add(
          "downloading"
        );

        const label =
          button.querySelector("span");

        const originalText =
          label.textContent;

        label.textContent =
          "DOWNLOADING";


        try {

          const response =
            await fetch(src);

          if (!response.ok) {
            throw new Error(
              "Download failed"
            );
          }


          const blob =
            await response.blob();

          const objectURL =
            URL.createObjectURL(
              blob
            );


          const anchor =
            document.createElement("a");

          anchor.href =
            objectURL;


          const safeTitle =
            title
              .toLowerCase()
              .replace(
                /[^a-z0-9а-яё]+/gi,
                "-"
              )
              .replace(
                /^-+|-+$/g,
                ""
              );


          anchor.download =
            `${safeTitle}-demo.mp3`;

          document.body.appendChild(
            anchor
          );

          anchor.click();

          anchor.remove();


          setTimeout(
            () => {

              URL.revokeObjectURL(
                objectURL
              );

            },
            1000
          );


          label.textContent =
            "DOWNLOADED";


          setTimeout(
            () => {

              label.textContent =
                originalText;

            },
            1300
          );

        }

        catch (error) {

          console.error(
            error
          );


          /*
          Fallback:
          if browser refuses fetch download,
          open the original MP3.
          */

          const anchor =
            document.createElement("a");

          anchor.href =
            src;

          anchor.download = "";

          document.body.appendChild(
            anchor
          );

          anchor.click();

          anchor.remove();


          label.textContent =
            originalText;

        }

        finally {

          button.classList.remove(
            "downloading"
          );

        }

      }
    );


    track.appendChild(
      button
    );

  }
);


/* =========================================
   LOAD TRACK
========================================= */

function loadTrack(
  index,
  autoplay = true
) {

  if (
    index < 0 ||
    index >= tracks.length
  ) {
    return;
  }


  currentTrackIndex =
    index;


  const track =
    tracks[index];

  const src =
    track.dataset.src;

  const title =
    track.dataset.title ||
    "Untitled";

  const info =
    track.dataset.info ||
    "";


  audio.src =
    src;


  playerTitle.textContent =
    title;

  playerInfo.textContent =
    info;


  tracks.forEach(
    (item, itemIndex) => {

      item.classList.toggle(
        "active",
        itemIndex === index
      );


      const icon =
        item.querySelector(
          ".track-play i"
        );


      if (icon) {

        icon.className =
          itemIndex === index &&
          autoplay
            ? "fas fa-pause"
            : "fas fa-play";

      }

    }
  );


  if (autoplay) {

    audio
      .play()
      .catch(
        error => {

          console.log(
            "Playback blocked:",
            error
          );

        }
      );

  }


  updatePlayIcons();

}


/* =========================================
   PLAY / PAUSE
========================================= */

function togglePlay() {

  if (
    currentTrackIndex === -1
  ) {

    loadTrack(
      0,
      true
    );

    return;
  }


  if (
    audio.paused
  ) {

    audio.play();

  }

  else {

    audio.pause();

  }

}


/* =========================================
   ICON STATES
========================================= */

function updatePlayIcons() {

  const isPlaying =
    !audio.paused;


  if (playButton) {

    const icon =
      playButton.querySelector(
        "i"
      );


    if (icon) {

      icon.className =
        isPlaying
          ? "fas fa-pause"
          : "fas fa-play";

    }

  }


  tracks.forEach(
    (track, index) => {

      const icon =
        track.querySelector(
          ".track-play i"
        );


      if (!icon) {
        return;
      }


      if (
        index ===
          currentTrackIndex &&
        isPlaying
      ) {

        icon.className =
          "fas fa-pause";

      }

      else {

        icon.className =
          "fas fa-play";

      }

    }
  );

}


/* =========================================
   TRACK BUTTON EVENTS
========================================= */

tracks.forEach(
  (track, index) => {

    const button =
      track.querySelector(
        ".track-play"
      );


    if (!button) {
      return;
    }


    button.addEventListener(
      "click",
      () => {

        if (
          index ===
          currentTrackIndex
        ) {

          togglePlay();

        }

        else {

          loadTrack(
            index,
            true
          );

        }

      }
    );

  }
);


/* =========================================
   MAIN CONTROLS
========================================= */

playButton?.addEventListener(
  "click",
  togglePlay
);


prevButton?.addEventListener(
  "click",
  () => {

    if (!tracks.length) {
      return;
    }


    let nextIndex =
      currentTrackIndex - 1;


    if (
      nextIndex < 0
    ) {

      nextIndex =
        tracks.length - 1;

    }


    loadTrack(
      nextIndex,
      true
    );

  }
);


nextButton?.addEventListener(
  "click",
  () => {

    if (!tracks.length) {
      return;
    }


    let nextIndex =
      currentTrackIndex + 1;


    if (
      nextIndex >=
      tracks.length
    ) {

      nextIndex = 0;

    }


    loadTrack(
      nextIndex,
      true
    );

  }
);


/* =========================================
   AUDIO EVENTS
========================================= */

audio.addEventListener(
  "play",
  updatePlayIcons
);


audio.addEventListener(
  "pause",
  updatePlayIcons
);


audio.addEventListener(
  "loadedmetadata",
  () => {

    duration.textContent =
      formatTime(
        audio.duration
      );

  }
);


audio.addEventListener(
  "timeupdate",
  () => {

    currentTime.textContent =
      formatTime(
        audio.currentTime
      );


    if (
      Number.isFinite(
        audio.duration
      ) &&
      audio.duration > 0
    ) {

      seek.value =
        (
          audio.currentTime /
          audio.duration
        ) *
        100;

    }

  }
);


/* NEXT TRACK AUTOMATICALLY */

audio.addEventListener(
  "ended",
  () => {

    if (!tracks.length) {
      return;
    }


    let nextIndex =
      currentTrackIndex + 1;


    if (
      nextIndex >=
      tracks.length
    ) {

      nextIndex = 0;

    }


    loadTrack(
      nextIndex,
      true
    );

  }
);


/* =========================================
   SEEK
========================================= */

seek.addEventListener(
  "input",
  () => {

    if (
      !Number.isFinite(
        audio.duration
      )
    ) {
      return;
    }


    audio.currentTime =
      (
        seek.value /
        100
      ) *
      audio.duration;

  }
);


/* =========================================
   3D HEADER TITLE
========================================= */

const title =
  document.querySelector(
    "header h1"
  );


if (title) {

  title.addEventListener(
    "pointermove",
    event => {

      const rect =
        title.getBoundingClientRect();


      const x =
        (
          event.clientX -
          rect.left
        ) /
        rect.width;


      const y =
        (
          event.clientY -
          rect.top
        ) /
        rect.height;


      const rotateY =
        (
          x -
          0.5
        ) *
        10;


      const rotateX =
        (
          0.5 -
          y
        ) *
        8;


      title.style.transform =
        `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(28px)
        scale(1.02)
        `;

    }
  );


  title.addEventListener(
    "pointerleave",
    () => {

      title.style.transform =
        `
        perspective(800px)
        rotateX(0deg)
        rotateY(0deg)
        translateZ(0)
        scale(1)
        `;

    }
  );

}
