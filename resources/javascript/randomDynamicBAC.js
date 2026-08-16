let visibilityFreq = 300;
const TRIVIA_API_ENDPOINT = "https://elysiancoffee.vercel.app/api/chips-trivia";

const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxBjlT0Wu44fJkJeCNPT5PB8E2iTuVB4tvrBB1EPN3rQhaggkYJHNJIEchvbUlSUUU/exec";

// Fallback riddles (used if offline or before the API URL is set)
let riddles = [
  "Which position has the most power in our ECON Family?",
  "What position did Harry play on the Gryffindor Quidditch team?",
  "What did Dumbledore leave to Hermione in his will?",
  "What does the word Omertà refer to in Mafia culture?",
  "Who was known as The Teflon Don because charges against him never stuck?",
  "What is the Mafia term for a boss of bosses?",
  "Which vault number held the Philosopher’s Stone at Gringotts?",
  "Who founded the “Commission” (La Commissione) to organize the American Mafia families?",
  "What is the name of the incentive that mainly powers our ECON Pricing Sheet Database?",
  "According to our La Nostra Omertá, are you allowed to make game threads inside the club?"
];

// Fetch live questions and visibility frequency from your Next.js maintenance API
async function syncRiddlesFromAPI() {
  if (!TRIVIA_API_ENDPOINT || TRIVIA_API_ENDPOINT.includes("YOUR_VERCEL_APP_URL")) {
    return; // Uses fallback riddles and frequency until URL is configured
  }

  try {
    const response = await fetch(TRIVIA_API_ENDPOINT, {
      method: "GET",
      cache: "no-store", // Always fetch fresh data
    });

    if (response.ok) {
      const data = await response.json();
      
      // Dynamically update riddles list
      if (Array.isArray(data.riddles) && data.riddles.length > 0) {
        riddles = data.riddles;
      }

      // Dynamically update visibility frequency
      if (typeof data.visibilityFreq === "number") {
        visibilityFreq = data.visibilityFreq;
      }
    }
  } catch (err) {
    console.warn("Could not reach trivia API, using offline configuration:", err);
  }
}

function generateRandomID(e = 6) {
  let t = "abcdefghijklmnopqrstuvwxyz0123456789", n = "";
  for (let o = 0; o < e; o++) n += t.charAt(Math.floor(Math.random() * t.length));
  return n;
}

function maybeShowRiddleBox() {
  let e = localStorage.getItem("activeRiddle"),
      t = localStorage.getItem("activeRiddleID");

  if (e && t) {
    document.getElementById("BARiddle").textContent = e;
    document.getElementById("randomBACid").textContent = "Claim ID: " + t;
    document.getElementById("randomBACtag").style.display = "block";
    return;
  }

  const chance = visibilityFreq / 300; // Dynamic chance: 1 = rare (~0.33%), 100 = ~33%, 300 = 100%
  if (Math.random() < chance) {
    let n = riddles[Math.floor(Math.random() * riddles.length)],
        o = generateRandomID();
    document.getElementById("BARiddle").textContent = n;
    document.getElementById("randomBACid").textContent = "Claim ID: " + o;
    document.getElementById("randomBACtag").style.display = "block";
    localStorage.setItem("activeRiddle", n);
    localStorage.setItem("activeRiddleID", o);
    logToSheet({
      username: typeof username !== "undefined" ? username : "unknown",
      riddle: n,
      claimID: o,
      timestamp: new Date().toISOString()
    });
  }
}

function clearRiddleBox() {
  document.getElementById("randomBACtag").style.display = "none";
  localStorage.removeItem("activeRiddle");
  localStorage.removeItem("activeRiddleID");
}

function logToSheet(e) {
  fetch(SHEET_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...e, origin: window.location.origin })
  });
}

document.addEventListener("DOMContentLoaded", async function() {
  document.getElementById("randomBACtag").style.display = "none";

  // Pull latest questions & frequency before checking visibility chance
  await syncRiddlesFromAPI();
  maybeShowRiddleBox();

  document.getElementById("BARiddleClear").addEventListener("click", function(e) {
    e.preventDefault();
    clearRiddleBox();
  });
});
