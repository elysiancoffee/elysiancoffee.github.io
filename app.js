// Dynamically Generate the Italian Mafia-Themed Webpage

// Create the Sidenav
const createSidenav = () => {
  const sidenav = document.createElement("div");
  sidenav.className = "sidenav";

  // Add Mafia-themed logo
  const logo = document.createElement("img");
  logo.src = "https://upload.wikimedia.org/wikipedia/commons/6/6b/Mafia_game_logo.png"; // Free-license Mafia logo
  logo.alt = "Mafia Club Logo";
  sidenav.appendChild(logo);

  // Add navigation links
  const links = [
    { text: "Home", href: "#" },
    { text: "About Us", href: "#" },
    { text: "Join Us", href: "#" },
    { text: "Contact", href: "#" },
  ];

  links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.textContent = link.text;
    sidenav.appendChild(anchor);
  });

  document.body.appendChild(sidenav);
};

// Create the Announcement Area
const createAnnouncementArea = () => {
  const announcementArea = document.createElement("div");
  announcementArea.className = "announcement-area";

  // Mock Announcements
  const announcements = [
    {
      title: "New Family Member Initiated",
      description: "We welcome our newest Wiseguy into La Famiglia. Congratulations on joining the family!",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Old_mobsters.jpg", // Free license
    },
    {
      title: "Upcoming Meeting",
      description: "All members are expected to attend the meeting on Friday. Keep your alibis ready!",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mafia_table_meeting.jpg", // Free license
    },
    {
      title: "Big Score Success",
      description: "A successful heist last night. Kudos to the team for their impeccable execution.",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Mafia_cash_heist.jpg", // Free license
    },
  ];

  announcements.forEach((announcement) => {
    const card = document.createElement("div");
    card.className = "announcement-card";

    const img = document.createElement("img");
    img.src = announcement.image;
    img.alt = announcement.title;

    const textContainer = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = announcement.title;

    const description = document.createElement("p");
    description.textContent = announcement.description;

    textContainer.appendChild(title);
    textContainer.appendChild(description);

    card.appendChild(img);
    card.appendChild(textContainer);
    announcementArea.appendChild(card);
  });

  document.body.appendChild(announcementArea);
};

// Create the Right Section Placeholder
const createRightSection = () => {
  const rightSection = document.createElement("div");
  rightSection.className = "right-section";
  rightSection.textContent = "Right Section - Coming Soon...";
  document.body.appendChild(rightSection);
};

// Initialize the Page
const initPage = () => {
  createSidenav();
  createAnnouncementArea();
  createRightSection();
};

initPage();
