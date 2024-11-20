document.addEventListener('DOMContentLoaded', () => {
    const playlistModal = document.getElementById('playlistModal');
    const closeModal = playlistModal.querySelector('.close'); // Правильный выбор для кнопки закрытия
    const playlistAddButtons = document.querySelectorAll('.playlistAddButton');

    // Открытие модального окна при нажатии на любую кнопку playlistAddButton
    playlistAddButtons.forEach(button => {
        button.addEventListener('click', () => {
            playlistModal.style.display = 'block';
        });
    });

    // Закрытие модального окна при нажатии на крестик
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            playlistModal.style.display = 'none';
        });
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === playlistModal) {
            playlistModal.style.display = 'none';
        }
    });

    // Обработчик для добавления песни в выбранный плейлист
    document.getElementById('add-song-to-playlist-button').addEventListener('click', () => {
        const selectedPlaylist = document.getElementById('select-playlist').value;

        if (selectedPlaylist) {
            const player = document.querySelector('.player.active'); // Найдите активный плеер (как пример)
            const songIndex = player.id === 'player1' ? currentSongIndex1 : currentSongIndex2;
            const song = songs[songIndex];

            const playlist = playlists.find(p => p.name === selectedPlaylist);
            if (playlist && !playlist.songs.some(s => s.src === song.src)) {
                playlist.songs.push(song);
                alert(`${song.title} добавлена в плейлист ${selectedPlaylist}`);
                savePlaylists();
            } else {
                alert(`${song.title} уже в плейлисте ${selectedPlaylist}`);
            }
        } else {
            alert("Пожалуйста, выберите плейлист.");
        }

        playlistModal.style.display = 'none'; // Закрыть модальное окно после добавления
    });

    // Закрытие модального окна при нажатии клавиши Escape
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && playlistModal.style.display === 'block') {
            playlistModal.style.display = 'none';
        }
    });
});