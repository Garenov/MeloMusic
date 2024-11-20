document.addEventListener('DOMContentLoaded', () => {
    const nextButtons = document.querySelectorAll('.next');
    const likeButtons = document.querySelectorAll('.like');
    const likedBox = document.querySelector('.liked');

    let songs = [];
    let currentSongIndex1 = 0;
    let currentSongIndex2 = 1;

    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            songs = data;
            console.log('Songs loaded:', songs);

            updatePlayer('player1', currentSongIndex1);
            updatePlayer('player2', currentSongIndex2);
            loadLiked(songs);
        })
        .catch(error => console.error('Ошибка загрузки JSON:', error));

    function saveSongs() {
        localStorage.setItem('songs', JSON.stringify(songs));
    }

    function updatePlayer(playerId, songIndex) {
        const player = document.getElementById(playerId);
        const audio = player.querySelector('audio');
        const img = player.querySelector('img');
        const likeButton = player.querySelector('.like');
        const songTitle = player.querySelector('.song-title');
        const timer = player.querySelector('.timer');

        audio.src = songs[songIndex].src;
        img.src = songs[songIndex].cover;
        songTitle.textContent = `${songs[songIndex].artist} - ${songs[songIndex].title}`;
        likeButton.setAttribute('data-liked', songs[songIndex].liked);
        likeButton.querySelector('img').src = songs[songIndex].liked ? 'image/liked.png' : 'image/unliked.png';
        timer.textContent = '00:00 / 00:00';

        const playPauseButton = player.querySelector('.play-pause');
        playPauseButton.querySelector('img').src = 'image/play.png';
        playPauseButton.querySelector('img').alt = 'Play';

        audio.addEventListener('timeupdate', () => updateTimer(audio, timer));
        audio.addEventListener('loadedmetadata', () => updateTimer(audio, timer));
    }

    function handleNext(button) {
        const playerId = button.getAttribute('data-player');
        const player = document.getElementById(playerId);
        const audio = player.querySelector('audio');

        if (playerId === 'player1') {
            do {
                currentSongIndex1 = (currentSongIndex1 + 1) % songs.length;
            } while (currentSongIndex1 === currentSongIndex2);
            updatePlayer('player1', currentSongIndex1);
        } else {
            do {
                currentSongIndex2 = (currentSongIndex2 + 1) % songs.length;
            } while (currentSongIndex2 === currentSongIndex1);
            updatePlayer('player2', currentSongIndex2);
        }

        audio.load();
    }
    
    function handleLike(button) {
        const img = button.querySelector('img');
        const isLiked = button.getAttribute('data-liked') === 'true';
        const songIndex = button.closest('.player').id === 'player1' ? currentSongIndex1 : currentSongIndex2;

        if (isLiked) {
            img.src = 'image/unliked.png';
            img.alt = 'Like';
            button.setAttribute('data-liked', 'false');
            songs[songIndex].liked = false;
        } else {
            img.src = 'image/liked.png';
            img.alt = 'Liked';
            button.setAttribute('data-liked', 'true');
            songs[songIndex].liked = true;
        }

        saveSongs();
        loadLiked(songs);
    }

    function updateTimer(audio, timer) {
        const currentTime = formatTime(audio.currentTime);
        const duration = formatTime(audio.duration);
        timer.textContent = `${currentTime} / ${duration}`;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function loadLiked(songs) {
        if (likedBox) {
            likedBox.innerHTML = "";
            songs.forEach(song => {
                if (song.liked) {
                    likedBox.innerHTML += `<div class="song">${song.artist} - ${song.title}</div>`;
                }
            });
        }
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', () => handleNext(button));
    });

    likeButtons.forEach(button => {
        button.addEventListener('click', () => handleLike(button));
    });
});