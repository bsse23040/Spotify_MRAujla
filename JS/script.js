// Global variables
const currentSong = new Audio();
let songs = [];
let currFolder = "";

// Time formatting function
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    let totalSeconds = Math.round(seconds);
    let minutes = Math.floor(totalSeconds / 60);
    let secs = totalSeconds % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    secs = secs < 10 ? '0' + secs : secs;
    return minutes + ':' + secs;
}

// Function to get songs from a folder
function getSongs(folder) {
    currFolder = folder;
    let div = document.createElement("div");
    div.innerHTML = document.body.innerHTML;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/assets/${currFolder}/`)[1]);
        }
    }

    // Display all songs in the playlist
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    songs.forEach(song => {
        let index1 = song.indexOf("Artist");
        let index2 = song.indexOf(".mp3");

        let mysongname = '';
        let myartistname = '';

        if (index1 !== -1 && index2 !== -1 && index1 < index2) {
            mysongname = song.substring(0, index1).replaceAll("%20", " ");
            myartistname = song.substring((index1 + 6), index2).replaceAll("%20", " ");
        }

        songUL.innerHTML += `<li>
                                <img class="invert" src="assets/svgs/music.svg" alt="music icon">
                                <div class="info">
                                    <div class="mySongName">${mysongname}</div>
                                    <div>${myartistname}</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" height="22px" src="assets/svgs/playnow.svg" alt="play icon">
                                </div>
                             </li>`;
    });

    // Attach event listeners to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info div:first-child").textContent.trim();
            let artistName = e.querySelector(".info div:last-child").textContent.trim();
            playMusic(`${songName} Artist ${artistName}.mp3`);
        });
    });

    return songs;
}

// Function to play music
function playMusic(track, pause = false) {
    currentSong.src = `assets/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play();
    }
    document.getElementById("play-wrapper").innerHTML = `<lord-icon style="position:relative; scale:1.2; bottom: 2px;" src="https://cdn.lordicon.com/jctchmfs.json" trigger="hover" colors="primary:#ffffff" style="width:33px;height:33px"></lord-icon>`;
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// Function to display albums
function displayAlbums() {
    let anchors = Array.from(document.getElementsByTagName("a"));
    let cardContainer = document.querySelector(".cardContainer");
    anchors.forEach(e => {
        if (e.href.includes("/musics") && !e.href.includes(".htaccess")) {
            let folder = e.href.split('/').slice(-2)[0];
            fetch(`assets/musics/${folder}/info.json`)
                .then(response => response.json())
                .then(data => {
                    cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <img src="https://img.icons8.com/sf-black-filled/64/play.png" alt="play" />
                        </div>
                        <img src="assets/musics/${folder}/cover.jpeg" alt="cover pic">
                        <h2>${data.title}</h2>
                        <p>${data.description}</p>
                    </div>`;
                })
                .catch(error => console.error('Error fetching album info:', error));
        }
    });

    // Load event listeners when cards are clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", item => {
            getSongs(`musics/${item.currentTarget.dataset.folder}`);
        });
    });
}

// Main function
function main() {
    displayAlbums();

    // Play/pause functionality
    const playWrapper = document.getElementById("play-wrapper");
    playWrapper.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playWrapper.innerHTML = `<lord-icon style="position:relative; scale:1.2; bottom: 2px;" src="https://cdn.lordicon.com/jctchmfs.json" trigger="hover" colors="primary:#ffffff" style="width:33px;height:33px"></lord-icon>`;
        } else {
            currentSong.pause();
            playWrapper.innerHTML = `<img id="play" src="assets/svgs/play.svg" alt="play">`;
        }
    });

    // Spacebar play/pause
    document.addEventListener('keydown', event => {
        if (event.code === 'Space') {
            if (currentSong.paused) {
                currentSong.play();
                playWrapper.innerHTML = `<lord-icon style="position:relative; scale:1.2; bottom: 2px;" src="https://cdn.lordicon.com/jctchmfs.json" trigger="hover" colors="primary:#ffffff" style="width:33px;height:33px"></lord-icon>`;
            } else {
                currentSong.pause();
                playWrapper.innerHTML = `<img id="play" src="assets/svgs/play.svg" alt="play">`;
            }
        }
    });

    // Update time and seekbar
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seekbar functionality
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100;
    });

    // Previous and next buttons
    document.getElementById("previous").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index > 0) {
            playMusic(songs[index - 1]);
        }
    });

    document.getElementById("next").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        }
    });

    // Volume control and visibility
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        const volumeImg = document.querySelector(".volume > img");
        volumeImg.src = currentSong.volume === 0 ? "assets/svgs/mute.svg" : "assets/svgs/volume.svg";
    });

    document.querySelector('.my-range').addEventListener('input', function () {
        this.style.setProperty('--value', this.value + '%');
    });

    document.querySelector('.volume').addEventListener('click', function () {
        const rangeElement = document.querySelector('.range');
        rangeElement.style.visibility = rangeElement.style.visibility === 'hidden' ? 'visible' : 'hidden';
    });
}

// Call main function when the document is fully loaded
document.addEventListener("DOMContentLoaded", main);
