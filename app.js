// JavaScript to handle interactions and dynamic updates for the Mafia-themed webpage

// Helper to toggle the sidenav visibility
const toggleSidenav = () => {
  const sidenav = document.getElementById('sidenav');
  sidenav.classList.toggle('hidden');
};

// Function to add a new announcement dynamically
const addAnnouncement = (title, content) => {
  const announcementsSection = document.getElementById('announcements');
  const announcementCard = document.createElement('div');
  announcementCard.classList.add('announcement-card');

  announcementCard.innerHTML = `
    <h3 class="announcement-title">${title}</h3>
    <p class="announcement-content">${content}</p>
  `;

  announcementsSection.appendChild(announcementCard);
};

// Add event listeners for interactive elements
document.addEventListener('DOMContentLoaded', () => {
  const sidenavToggle = document.getElementById('sidenav-toggle');
  sidenavToggle.addEventListener('click', toggleSidenav);

  // Example of adding announcements dynamically
  addAnnouncement('Welcome to Club Mafia', 'We value loyalty, respect, and tradition. Stay tuned for upcoming events!');
  addAnnouncement('Meeting Tonight', 'Don’t forget the family meeting at 8 PM sharp in the lounge.');
});
