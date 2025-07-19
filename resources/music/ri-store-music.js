 const audio = document.getElementById('bg-music');
  const bubble = document.getElementById('music-bubble');

  // === Playlist of MP3 URLs ===
  const playlist = [
    'https://elysiancoffee.github.io/resources/music/進撃gt20130218巨人.mp3',
  ];

  let currentTrackIndex = 0;
  let saveInterval;

  // === Load saved track index and time (AFTER playlist is ready) ===
  const saved = localStorage.getItem('riStoreAudioTime');
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
      const saved = localStorage.getItem('riStoreAudioTime');
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
    localStorage.removeItem('riStoreAudioTime');
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
  });

  // === Save current track and time ===
  audio.addEventListener('playing', () => {
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(() => {
      localStorage.setItem('riStoreAudioTime', `${currentTrackIndex}|${audio.currentTime}`);
    }, 1000);
  });

  // === Play/pause toggle bubble ===
  bubble.addEventListener('click', () => {
    const now = Date.now();

    if (audio.paused) {
      audio.play();
      bubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>';
      localStorage.removeItem('pauseUntil');
    } else {
      audio.pause();
      bubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
      const futureTime = now + 24 * 60 * 60 * 1000;
      localStorage.setItem('pauseUntil', futureTime);
    }
  });

  // === Set initial icon ===
  if (audio.paused) {
    bubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
  } else {
    bubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>';
  }

  // === Start playback ===
  loadTrack(currentTrackIndex);
