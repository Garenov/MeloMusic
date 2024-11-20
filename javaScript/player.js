document.addEventListener('DOMContentLoaded', () => {
    const playPauseButtons = document.querySelectorAll('.play-pause');
    const volumeControls = document.querySelectorAll('.volume');
    const loginLink = document.getElementById('login-link');
    const loginModal = document.getElementById('login-modal');
    const closeButtons = document.querySelectorAll('.close');
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    let songs = [];
    let currentSongIndex1 = 0;
    let currentSongIndex2 = 1;

    // Загружаем данные о песнях из JSON-файла
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            songs = data;
            console.log('Songs loaded:', songs);
        })
        .catch(error => console.error('Ошибка загрузки JSON:', error));

    function handlePlayPause(button) {
        const audioId = button.getAttribute('data-audio');
        const audio = document.getElementById(audioId);
        const img = button.querySelector('img');

        // Остановить все другие аудиоэлементы
        document.querySelectorAll('audio').forEach(otherAudio => {
            if (otherAudio !== audio && !otherAudio.paused) {
                otherAudio.pause();
                // Сбросить иконку кнопки воспроизведения, связанной с другим аудио
                const otherButton = document.querySelector(`.play-pause[data-audio="${otherAudio.id}"]`);
                if (otherButton) {
                    const otherImg = otherButton.querySelector('img');
                    otherImg.src = 'image/play.png';
                    otherImg.alt = 'Play';
                }
            }
        });

        // Воспроизведение или пауза текущего аудио
        if (audio.paused) {
            audio.play();
            img.src = 'image/pause.png';
            img.alt = 'Pause';
        } else {
            audio.pause();
            img.src = 'image/play.png';
            img.alt = 'Play';
        }
    }

    function handleVolumeChange(input) {
        const audioId = input.getAttribute('data-audio');
        const audio = document.getElementById(audioId);
        audio.volume = input.value;
    }

    function updatePlayer(playerId, songIndex) {
        const player = document.getElementById(playerId);
        const song = songs[songIndex];
        if (song) {
            const audio = player.querySelector('audio');
            const title = player.querySelector('.title');
            const cover = player.querySelector('.cover img');

            audio.src = song.src;
            title.textContent = `${song.artist} - ${song.title}`;
            cover.src = song.cover;
            audio.load();
        }
    }

    playPauseButtons.forEach(button => {
        button.addEventListener('click', () => handlePlayPause(button));
    });

    volumeControls.forEach(input => {
        input.addEventListener('input', () => handleVolumeChange(input));
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const result = songs.find(song => song.title.toLowerCase().includes(searchTerm));

        if (result) {
            currentSongIndex1 = songs.indexOf(result);
            if (currentSongIndex1 === currentSongIndex2) {
                currentSongIndex2 = (currentSongIndex2 + 1) % songs.length;
                updatePlayer('player2', currentSongIndex2);
            }
            updatePlayer('player1', currentSongIndex1);
        } else {
            alert('No songs found');
        }
    });

    document.addEventListener("keypress", function(event) {
        const searchTerm = searchBar.value.toLowerCase();
        if (event.key === "Enter" && searchTerm.length > 0) {
            const result = songs.find(song => song.title.toLowerCase().includes(searchTerm));

            if (result) {
                currentSongIndex1 = songs.indexOf(result);
                if (currentSongIndex1 === currentSongIndex2) {
                    currentSongIndex2 = (currentSongIndex2 + 1) % songs.length;
                    updatePlayer('player2', currentSongIndex2);
                }
                updatePlayer('player1', currentSongIndex1);
            } else {
                alert('No songs found');
            }
        }
    });
});