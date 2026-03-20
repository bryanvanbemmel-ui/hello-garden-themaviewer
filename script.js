const themeColors = {
  "Bijen- en vlinderlokkers": "#FEE191",
  "Bodembedekkend": "#B5D99C",
  "Geurend": "#FFD7E6",
  "Schaduw": "#C2C9E8",
  "Specials": "#C1B2FF",
  "Grassen": "#B0D0D3",
  "Kruiden": "#C9E0A5",
  "Wild & Inheems": "#DEC089"
};

let allData = [];
let currentSuggestions = [];
let lastDataHash = "";

// DATA LADEN
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    allData = data;
    console.log("Data geladen");
  })
  .catch(err => console.error("Fout:", err));

const input = document.getElementById("searchBox");
const clearBtn = document.getElementById("clearBtn");

/* INPUT */
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

  clearBtn.style.display = value ? "block" : "none";

  if (!value) {
    document.getElementById("suggestions").innerHTML = "";
    document.getElementById("results").innerHTML = "";
    return;
  }

  const matches = allData.filter(r =>
    (r["Nederlandse naam"] || "").toLowerCase().includes(value) ||
    (r["Omschrijving"] || "").toLowerCase().includes(value)
  );

  currentSuggestions = matches.slice(0, 5);

  showSuggestions(currentSuggestions);
  render(matches.slice(0, 10));
});

/* CLEAR */
clearBtn.addEventListener("click", () => {
  input.value = "";
  document.getElementById("suggestions").innerHTML = "";
  document.getElementById("results").innerHTML = "";
  clearBtn.style.display = "none";
  input.focus();
});

/* DROPDOWN */
function showSuggestions(list) {
  const box = document.getElementById("suggestions");

  if (!list.length) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = list.map((item, i) => `
    <div class="suggestion" onclick="selectItem(${i})">
      <strong>${item["Nederlandse naam"]}</strong><br>
      <small>${item["Omschrijving"]}</small>
    </div>
  `).join("");
}

/* SELECT */
function selectItem(index) {
  const item = currentSuggestions[index];

  input.value = item["Nederlandse naam"];
  document.getElementById("suggestions").innerHTML = "";

  render([item]);
}

/* RESULT */
function render(list) {
  const container = document.getElementById("results");

  if (!list.length) {
    container.innerHTML = "<p>Geen resultaat</p>";
    return;
  }

  container.innerHTML = list.map(item => {
    const color = themeColors[item["Thema"]] || "#eee";

    return `
      <div class="card">
        <h2>${item["Nederlandse naam"]}</h2>
        <p>${item["Omschrijving"]}</p>
        <div class="theme" style="background:${color}">
          ${item["Thema"]}
        </div>
      </div>
    `;
  }).join("");
}

/* CLICK OUTSIDE */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    document.getElementById("suggestions").innerHTML = "";
  }
});

/* SHARE */
const shareBtn = document.getElementById("shareBtn");

if (shareBtn && navigator.share) {
  shareBtn.addEventListener("click", () => {
    navigator.share({
      title: "Hello Garden",
      text: "Bekijk deze planten tool",
      url: window.location.href
    });
  });
} else if (shareBtn) {
  shareBtn.style.display = "none";
}

/* SERVICE WORKER */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW actief:', reg.scope))
      .catch(err => console.error('SW fout:', err));
  });
}

/* AUTO UPDATE CHECK */
async function checkForUpdates() {
  try {
    const res = await fetch("data.json?cache=" + Date.now());
    const text = await res.text();

    if (lastDataHash && lastDataHash !== text) {
      console.log("Nieuwe data gevonden → reload");
      location.reload();
    }

    lastDataHash = text;
  } catch (e) {
    console.log("Update check fout");
  }
}

setInterval(checkForUpdates, 30000);
