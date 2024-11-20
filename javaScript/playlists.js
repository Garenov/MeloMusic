document.addEventListener('DOMContentLoaded', () => {
    const playlistModal = document.getElementById('playlistModal');
    const createPlaylistButton = document.getElementById('create-playlist-button');
    const selectPlaylist = document.getElementById('select-playlist');
    const addSongToPlaylistButton = document.getElementById('add-song-to-playlist-button');

    let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    let currentAudio = null;
    let currentPlaylistIndex = 0;

    function savePlaylists() {
        localStorage.setItem('playlists', JSON.stringify(playlists));
        updatePlaylistOptions();
    }

    function updatePlaylistOptions() {
        selectPlaylist.innerHTML = '<option value="" disabled selected>Выберите плейлист</option>';
        playlists.forEach((playlist, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = playlist.name;
            selectPlaylist.appendChild(option);
        });
    }

    function stopCurrentAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
    }

    createPlaylistButton.addEventListener('click', () => {
        const playlistNameInput = document.getElementById('new-playlist-name');
        const playlistName = playlistNameInput.value.trim();

        if (playlistName) {
            const newPlaylist = { name: playlistName, songs: [] };
            playlists.push(newPlaylist);
            savePlaylists();
            playlistNameInput.value = '';
            alert(`Плейлист "${playlistName}" создан.`);
        } else {
            alert('Введите название плейлиста!');
        }
    });

    addSongToPlaylistButton.addEventListener('click', () => {
        const selectedPlaylistIndex = selectPlaylist.value;

        if (selectedPlaylistIndex !== "") {
            const song = {
                title: 'Пример песни', // Здесь должна быть логика выбора песни
                src: 'example-song.mp3' // Замените на реальный источник
            };

            if (!playlists[selectedPlaylistIndex].songs.some(s => s.src === song.src)) {
                playlists[selectedPlaylistIndex].songs.push(song);
                savePlaylists();
                alert(`${song.title} добавлена в плейлист "${playlists[selectedPlaylistIndex].name}".`);
            } else {
                alert(`${song.title} уже в плейлисте.`);
            }
        } else {
            alert('Выберите плейлист!');
        }
    });

    updatePlaylistOptions();
});