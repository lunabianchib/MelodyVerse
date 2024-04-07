// Cargar la API de YouTube antes de que ocurra el evento DOMContentLoaded
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

document.addEventListener("DOMContentLoaded", function() {
    let player;
    let quizForm;

    function onYouTubeIframeAPIReady() {
        console.log('La API de YouTube se cargó correctamente');
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: 'I5gh8rAVLkI', // Video inicial
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'rel': 0,
                'fs': 0,
                'modestbranding': 1,
                'iv_load_policy': 3,
                'enablejsapi': 1,
                'origin': 'http://localhost:8158',
                'key': 'AIzaSyAPGug-Vrm9KWqFwbxXeyR68hkegDrdmg4'
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });

        quizForm = document.getElementById("quiz-form"); // Definir quizForm antes de agregar el event listener

        if (quizForm) {
            quizForm.addEventListener("submit", function (event) {
                event.preventDefault();
                const selectedSongId = document.getElementById("song-select").value;
                checkAnswers(selectedSongId);
            });
        }

        // Agrega el event listener si el botón existe
        const playButton = document.getElementById("play-button");
        if (playButton) {
            playButton.addEventListener("click", playSelectedSong);
        }
    }

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    function playSelectedSong() {
        const selectedSongId = document.getElementById("song-select").value;
        const selectedSong = songs[selectedSongId];
        player.loadVideoById(selectedSongId);
        player.playVideo();
        displayLyrics(selectedSongId);
        displayOptions(selectedSongId);
    }

    function checkAnswers(songId) {
        const song = songs[songId];
        let score = 0;
        for (let i = 0; i < song.blanks.length; i++) {
            const selectedOption = document.querySelector(`input[name="blank${i}"]:checked`);
            if (selectedOption && selectedOption.value === song.correctAnswers[i]) {
                score++;
            }
        }
        alert(`Tu puntuación es: ${score} de ${song.blanks.length}`);
    }

    function displayLyrics(songId) {
        const song = songs[songId];
        let displayedLyrics = "";
        for (let i = 0; i < song.lyrics.length; i++) {
            if (song.blanks.includes(song.lyrics[i])) {
                displayedLyrics += `<input type="text" id="blank${i}" required>`;
            } else {
                displayedLyrics += song.lyrics[i];
            }
        }
        document.getElementById("lyrics").innerHTML = displayedLyrics;
    }

    function displayOptions(songId) {
        const song = songs[songId];
        for (let i = 0; i < song.blanks.length; i++) {
            let optionsHtml = "";
            for (let j = 0; j < song.options[i].length; j++) {
                optionsHtml += `<label><input type="radio" name="blank${i}" value="${song.options[i][j]}">${song.options[i][j]}</label>`;
            }
            const blankElement = document.getElementById(`blank${song.lyrics.indexOf(song.blanks[i])}`);
            blankElement.insertAdjacentHTML("afterend", optionsHtml);
        }
    }

    function onPlayerStateChange(event) {
        // Aquí puedes realizar acciones según el estado del reproductor
    }
});