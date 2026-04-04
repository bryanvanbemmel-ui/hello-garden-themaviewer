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

const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];
let currentSuggestions = [];
let lastDataHash = "";

/* =======================
   DATA LADEN (NO CACHE)
======================= */
fetch("data.json?v=" + Date.now(), { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    allData = data;
    console.log("Data geladen");
  })
  .catch(err => console.error("Fout:", err));

const input = document.getElementById("searchBox");
const clearBtn = document.getElementById("clearBtn");

/* =======================
   INPUT
======================= */
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

/* =======================
   CLEAR
======================= */
clearBtn.addEventListener("click", () => {
  input.value = "";
  document.getElementById("suggestions").innerHTML = "";
  document.getElementById("results").innerHTML = "";
  clearBtn.style.display = "none";
  input.focus();
});

/* =======================
   SUGGESTIONS
======================= */
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

/* =======================
   SELECT
======================= */
function selectItem(index) {
  const item = currentSuggestions[index];

  input.value = item["Nederlandse naam"];
  document.getElementById("suggestions").innerHTML = "";

  render([item]);
}

/* =======================
   RENDER RESULT (MET FOTO)
======================= */
function render(list) {
  const container = document.getElementById("results");

  if (!list.length) {
    container.innerHTML = "<p>Geen resultaat</p>";
    return;
  }

  container.innerHTML = list.map(item => {

    const color = themeColors[item["Thema"]] || "#eee";
    const imgUrl = item["Foto"] || FALLBACK;

    return `
      <div class="card">
        <h2>${item["Nederlandse naam"]}</h2>
        <p>${item["Omschrijving"]}</p>

        <div class="theme-row">
          <div class="theme" style="background:${color}">
            ${item["Thema"]}
          </div>

          <img src="${imgUrl}"
               class="theme-img"
               onclick="openLightbox('${imgUrl}')"
               onerror="this.onerror=null; this.src='${FALLBACK}'">
        </div>
      </div>
    `;
  }).join("");
}

/* =======================
   LIGHTBOX
======================= */
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");

  img.src = src || FALLBACK;
  lightbox.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {

  const closeBtn = document.getElementById("lightboxClose");
  const lightbox = document.getElementById("lightbox");

  if (closeBtn) {
    closeBtn.onclick = () => lightbox.style.display = "none";
  }

  if (lightbox) {
    lightbox.onclick = (e) => {
      if (e.target.id === "lightbox") {
        lightbox.style.display = "none";
      }
    };
  }

});

/* =======================
   CLICK OUTSIDE
======================= */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    document.getElementById("suggestions").innerHTML = "";
  }
});

/* =======================
   SHARE
======================= */
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

/* =======================
   SERVICE WORKER
======================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW actief:', reg.scope))
      .catch(err => console.error('SW fout:', err));
  });
}

/* =======================
   AUTO UPDATE JSON
======================= */
async function checkForUpdates() {
  try {
    const res = await fetch("data.json?v=" + Date.now(), { cache: "no-store" });
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
