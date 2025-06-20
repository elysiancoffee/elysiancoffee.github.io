  const audio = document.getElementById('bg-music');
  const bubble = document.getElementById('music-bubble');

  // === Playlist of MP3 URLs ===
  const playlist = [
    'https://elysiancoffee.github.io/resources/music/What Makes You Beautiful.mp3',
    'https://elysiancoffee.github.io/resources/music/2000.mp3'
  ];

  let currentTrackIndex = 0;
  const saved = localStorage.getItem('audioTime');
if (saved) {
  const [savedIndex] = saved.split('|');
  currentTrackIndex = parseInt(savedIndex);
}
  let saveInterval;

  function loadTrack(index) {
    if (!playlist[index]) return;
    audio.src = playlist[index];

    const saved = localStorage.getItem('audioTime');
    const holdUntil = localStorage.getItem('pauseUntil');
    const now = Date.now();

    // Restore position if saved
    if (saved) {
      const [savedIndex, savedTime] = saved.split('|');
      if (parseInt(savedIndex) === index) {
  audio.addEventListener('loadedmetadata', function setTimeOnce() {
    audio.currentTime = parseFloat(savedTime);
    audio.removeEventListener('loadedmetadata', setTimeOnce);
  });
}
    }

    // Respect 24-hour pause
    if (holdUntil && now < parseInt(holdUntil)) {
      audio.pause();
      bubble.innerHTML = '▶️';
    } else {
      audio.play();
      bubble.innerHTML = '⏸️';
    }
  }

  // === Load and play next on end ===
  audio.addEventListener('ended', () => {
    localStorage.removeItem('audioTime');
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
  });

  // === Save current time every second ===
  audio.addEventListener('playing', () => {
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(() => {
      localStorage.setItem('audioTime', `${currentTrackIndex}|${audio.currentTime}`);
    }, 1000);
  });

  // === Play/pause logic ===
  bubble.addEventListener('click', () => {
    const now = Date.now();

    if (audio.paused) {
      audio.play();
      bubble.innerHTML = '⏸️';
      localStorage.removeItem('pauseUntil');
    } else {
      audio.pause();
      bubble.innerHTML = '▶️';
      const futureTime = now + 24 * 60 * 60 * 1000;
      localStorage.setItem('pauseUntil', futureTime);
    }
  });

  // === Set initial icon state ===
  if (audio.paused) {
    bubble.innerHTML = '▶️';
  } else {
    bubble.innerHTML = '⏸️';
  }

  // === Start playback on page load ===
  loadTrack(currentTrackIndex);
