 const audio = document.getElementById('bg-music');
  const bubble = document.getElementById('music-bubble');

  // === Playlist of MP3 URLs ===
  const playlist = [
    'https://elysiancoffee.github.io/resources/music/進撃gt20130218巨人.mp3',
  ];

  let currentTrackIndex = 0;
  let saveInterval;

  // === Load saved track index and time (AFTER playlist is ready) ===
  const saved = localStorage.getItem('audioTime');
  if (saved) {
    const [savedIndex] = saved.split('|');
    const index = parseInt(savedIndex);
    if (!isNaN(index) && index >= 0 && index < playlist.length) {
      currentTrackIndex = index;
    }
  }

  function loadTrack(index) {
    if (!playlist[index]) return;
    audio.src = playlist[index];

    // Wait for metadata before setting time
    audio.addEventListener('loadedmetadata', function setTimeOnce() {
      const saved = localStorage.getItem('audioTime');
      if (saved) {
        const [savedIndex, savedTime] = saved.split('|');
        if (parseInt(savedIndex) === index) {
          audio.currentTime = parseFloat(savedTime);
        }
      }
      audio.removeEventListener('loadedmetadata', setTimeOnce);
    });

    const holdUntil = localStorage.getItem('pauseUntil');
    const now = Date.now();

    if (holdUntil && now < parseInt(holdUntil)) {
      audio.pause();
      bubble.innerHTML = '▶️';
    } else {
      audio.play();
      bubble.innerHTML = '⏸️';
    }
  }

  // === Loop to next track ===
  audio.addEventListener('ended', () => {
    localStorage.removeItem('audioTime');
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
  });

  // === Save current track and time ===
  audio.addEventListener('playing', () => {
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(() => {
      localStorage.setItem('audioTime', `${currentTrackIndex}|${audio.currentTime}`);
    }, 1000);
  });

  // === Play/pause toggle bubble ===
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

  // === Set initial icon ===
  if (audio.paused) {
    bubble.innerHTML = '▶️';
  } else {
    bubble.innerHTML = '⏸️';
  }

  // === Start playback ===
  loadTrack(currentTrackIndex);
