
// Global variables
let currentSong = new Audio();
let songs = [];
let currFolder;
let albums = [
    {
        folder: "A1_Karan_Aujla", title: "Aujla Anthems", number :"1",
        description: "Feel the energy and passion of Karan Aujla's powerful Punjabi tracks."
    }]

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

// Function to get songs in array from folder
function getSongs(folder) {
    currFolder = folder;
    let div = document.createElement("div");
    div.innerHTML = `
    <a href="${folder}/On Top Artist Karan Aujla I llky.mp3" data-folder="A1_Karan_Aujla"></a>
    <a href="${folder}/Maxico Artist Karan Aujla.mp3" data-folder="A1_Karan_Aujla"></a>
    <a href="${folder}/Kya Baat Aa Artist Karan Aujla.mp3" data-folder="A1_Karan_Aujla"></a>
    <a href="${folder}/Softly Artist Karan Aujla I llky.mp3" data-folder="A1_Karan_Aujla"></a>
    <a href="${folder}/Winning Speech Artist Karan Aujla I Mxrci (8D).mp3" data-folder="A1_Karan_Aujla"></a>
    <a href="${folder}/Alone Artist Alan Walker.mp3" data-folder="Alan_Walker"></a>
    <a href="${folder}/Alone 2 Artist Alan Walker.mp3" data-folder="Alan_Walker"></a>
    <a href="${folder}/PUBG X On My Way Artist Alan Walker.mp3" data-folder="Alan_Walker"></a>
    <a href="${folder}/Faded Artist Alan Walker.mp3" data-folder="Alan_Walker"></a>
    <a href="${folder}/Aujla Mashup Artist Karan Aujla.mp3" data-folder="Gangsta_Mashup"></a>
    <a href="${folder}/All Mashup 1 Artist Sidhu x Shubh X AP Dhillon.mp3" data-folder="Gangsta_Mashup"></a>
    <a href="${folder}/All Mashup 2 Artist Diljit Dosanjh x Varinder Barar.mp3" data-folder="Gangsta_Mashup"></a>
    <a href="${folder}/Beqarar Karke Hume Artist Hemant Kumar.mp3" data-folder="Pure_Olds"></a>
    <a href="${folder}/Ramaiya Vastavaiya Artist Mohammed Rafi.mp3" data-folder="Pure_Olds"></a>
    <a href="${folder}/Yeh Ratein Yeh Mausam Artist  Kishore Kumar.mp3" data-folder="Pure_Olds"></a>
    <a href="${folder}/Dedubluman You don't know Artist Sen Bilmezsin.mp3" data-folder="Turkish_Songs"></a>
    <a href="${folder}/Akh Lari Bado Badi Artist Sidhu x Noor Jahan.mp3" data-folder="Slowed_Remix"></a>
    <a href="${folder}/Jadon Holi Jai Slowed Reverb Artist Beghum Noor Jahan.mp3" data-folder="Slowed_Remix"></a>
    <a href="${folder}/Aaja Sanam Slowed Remix Artist .mp3" data-folder="Slowed_Remix"></a>
    <a href="${folder}/Pyar Hua Ikrar Hua Ft. Artist Divine x Shankar Jaikishan.mp3" data-folder="Slowed_Remix"></a>
    <a href="${folder}/Maxico Artist Karan Aujla.mp3" data-folder="Random_Hits"></a>
    <a href="${folder}/Her Artist Shubhneet Singh.mp3" data-folder="Random_Hits"></a>
    <a href="${folder}/Naina Artist Diljit Dosanjh.mp3" data-folder="Random_Hits"></a>
    `;

    let folderNames = folder.split("/");
    let folderName = folderNames[folderNames.length - 1];

    let as = div.getElementsByTagName("a");
    songs = Array.from(as)
        .filter(a => a.dataset.folder === folderName)
        .map(a => a.href.split(`${folder}/`)[1]);
    
    // Update playlist UI
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

    // Attach event listeners to songs
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info div:first-child").textContent.trim();
            let artistName = e.querySelector(".info div:last-child").textContent.trim();
            playMusic(`${songName} Artist ${artistName}.mp3`);
        });
    });
    return songs;
}

// Add event listener to previous and next buttons
function addEventListenersToControlButtons() {
    const playPrevious = () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index > 0) {
            playMusic(songs[index - 1]);
        } else {
            // Get the current album's folder name
            let currentFolder = currFolder.split("/").slice(-1)[0];

            // Get the index of the current album in the albums array
            let albumIndex = albums.findIndex(album => album.folder === currentFolder);

            // Get the index of the previous album to play
            let previousAlbumIndex = albumIndex - 1;

            // If the previous album index is within bounds, play its songs
            if (previousAlbumIndex >= 0) {
                let previousAlbumFolder = albums[previousAlbumIndex].folder;
                getSongs(`musics/${previousAlbumFolder}`);
                playMusic(songs[songs.length - 1]);
            } else {
                // Wrap around to the last album if reached the beginning
                let lastAlbumIndex = albums.length - 1;
                getSongs(`musics/${albums[lastAlbumIndex].folder}`);
                playMusic(songs[songs.length - 1]);
            }
        }
    };

    const playNext = () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index < songs.length - 1) {
            // Play the next song in the current album
            playMusic(songs[index + 1]);
        } else {
            // Get the current album's folder name
            let currentFolder = currFolder.split("/").slice(-1)[0];

            // Get the index of the current album in the albums array
            let albumIndex = albums.findIndex(album => album.folder === currentFolder);

            // Get the index of the next album to play
            let nextAlbumIndex = albumIndex + 1;

            // If the next album index is within bounds, play its songs
            if (nextAlbumIndex < albums.length) {
                let nextAlbumFolder = albums[nextAlbumIndex].folder;
                getSongs(`musics/${nextAlbumFolder}`);
                playMusic(songs[0]);
            } else {
                // Wrap around to the first album if reached the end
                getSongs(`musics/${albums[0].folder}`);
                playMusic(songs[0]);
            }
        }
    };

    document.getElementById("previous").addEventListener("click", playPrevious);
    document.getElementById("next").addEventListener("click", playNext);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            playPrevious();
        } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            playNext();
        }
    });
}




// Function to display albums from local data
function displayAlbums() {
    let cardContainer = document.querySelector(".cardContainer");
    albums = [
        {
            folder: "A1_Karan_Aujla", title: "Aujla Anthems", number :"1",
            description: "Feel the energy and passion of Karan Aujla's powerful Punjabi tracks."
        },
        {
            folder: "Alan_Walker", title: "Fade Into Walker", number :"2",
            description: "Lose yourself in the captivating beats and emotional journeys of Alan Walker's music."
        },
        {
            folder: "Pure_Olds", title: "80s Flashback", number :"5",
            description: "Travel back to the 80s with this nostalgic collection of timeless classics."
        },
        {
            folder: "Slowed_Remix", title: "Chill Remixes", number :"6",
            description: "Enjoy a unique listening experience with these creatively slowed remixes."
        },
        {
            folder: "Gangsta_Mashup", title: "Thug Fusion", number :"3",
            description: "A powerful mix of gangsta tracks seamlessly mashed up for an intense listening experience."
        },
        {
            folder: "Turkish_Songs", title: "Istanbul Beats", number :"7",
            description: "Experience the vibrant sounds of Istanbul, from its bustling streets to its serene Bosphorus shores."
        },
        {
            folder: "Random_Hits", title: "Shuffle Sensations", number :"4",
            description: "A diverse mix of chart-toppers and hidden gems from various genres and eras."
        }
        // Add more albums as needed
    ];

    albums.forEach((album, index) => {
        cardContainer.innerHTML += `
            <div data-folder="${album.folder}" class="card">
                <div class="play">
                    <img src="https://img.icons8.com/sf-black-filled/64/play.png" alt="play" />
                </div>
                <img src="assets/musics/${album.folder}/cover.jpeg" alt="cover pic">
                <h2>${album.title}</h2>
                <p>${album.description}</p>
            </div>`;
    });

    // Attach event listeners to each album card
    Array.from(cardContainer.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async () => {
            await getSongs(`musics/${e.dataset.folder}`);
        });
    });
}

// Music playing function
const playMusic = (track, pause = false) => {
    currentSong.src = `assets/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play();
    }
    document.getElementById("play-wrapper").innerHTML = `<lord-icon style="position:relative; scale:1.2; bottom: 2px;" src="https://cdn.lordicon.com/jctchmfs.json" trigger="hover" colors="primary:#ffffff" style="width:33px;height:33px"></lord-icon>`;
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// Inside main function
async function main() {
    songs = await getSongs('musics/A1_Karan_Aujla');
    playMusic(songs[0], true);
    // Display the list of all the songs
    displayAlbums();
    
    // Add event listeners to control buttons
    addEventListenersToControlButtons();

    // Song play pause on click
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

    // Song play pause on space bar
    document.addEventListener('keydown', function (event) {
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

    // Listen for time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100;
    });

    // Adjusting the volume and updating the volume image on input change
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        const volumeImg = document.querySelector(".volume > img");
        if (currentSong.volume === 0) {
            volumeImg.src = "assets/svgs/mute.svg";
        } else {
            volumeImg.src = "assets/svgs/volume.svg";
        }
    });

    // Volume range colorer
    document.querySelector('.my-range').addEventListener('input', function () {
        this.style.setProperty('--value', this.value + '%');
    });

    // Controlling the visibility of the volume range
    document.querySelector('.volume').addEventListener('click', function () {
        const rangeElement = document.querySelector('.range');
        if (rangeElement.style.visibility === 'hidden') {
            rangeElement.style.visibility = 'visible';
        } else {
            rangeElement.style.visibility = 'hidden';
        }
    });



// Add click event listener to the hamburger icon
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});




// Add touch event listeners for swipe left
let xDown = null;

document.querySelector(".right").addEventListener('touchstart', handleTouchStart, false);
document.querySelector(".right").addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    xDown = firstTouch.clientX;
}

function handleTouchMove(event) {
    if (!xDown) {
        return;
    }

    let xUp = event.touches[0].clientX;
    let xDiff = xDown - xUp;

    if (xDiff > 0) {
        // Swipe left detected
        document.querySelector(".left").style.left = "-120%";
    }
    else if (xDiff < 0) {
        // Swipe left detected
        document.querySelector(".left").style.left = "-120%";
    }

    // Reset xDown
    xDown = null;
}





// Add event listener to cards only when screen width is below 1300px
    if (window.matchMedia("(max-width: 1300px)").matches) {
        Array.from(document.querySelectorAll(".card")).forEach(card => {
            card.addEventListener("click", () => {
                document.querySelector(".left").style.left = "0";
            });
        });
    }

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
});

if (window.innerWidth < 1300) {
    document.querySelector(".signupbtn").addEventListener("click", () => {
      alert("Sign up feature is only supported for laptop devices");
    });
  } else {
    document.querySelector(".signupbtn").addEventListener("click", () => {
        alert("Sign up feature is under development");
      });
  }
  

  // Assuming currentSong is your audio element
currentSong.addEventListener('timeupdate', function() {
    if (currentSong.currentTime >= currentSong.duration) {
        document.getElementById("next").click();
    }
});


}

// Run main function when the document is ready
document.addEventListener("DOMContentLoaded", main);


document.addEventListener("contextmenu", function(e){
    e.preventDefault()
},false)