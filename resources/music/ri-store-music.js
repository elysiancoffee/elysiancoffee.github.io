const audio = document.getElementById('bg-music');

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

  audio.play();
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

// === Start playback ===
loadTrack(currentTrackIndex);
