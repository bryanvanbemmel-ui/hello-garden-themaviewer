const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];
let currentList = [];
let lastDataString = "";
let deferredPrompt = null;

/* ICONEN */
const themeIcons = {
  "Grassen": "🌾",
  "Kruiden": "🍃",
  "Schaduw": "🌑",
  "Bijen- en vlinderlokkers": "🐝"
};

/* ELEMENTEN */
const input = document.getElementById("searchBox");
const clearBtn = document.getElementById("clearBtn");
const results = document.getElementById("results");
const installBtn = document.getElementById("installBtn");

/* 🔥 INSTALL EVENT */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "inline-block";
});

/* INSTALL CLICK */
installBtn.onclick = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;

  console.log(choice.outcome);

  deferredPrompt = null;
  installBtn.style.display = "none";
};

/* DATA LADEN */
async function loadData() {
  const res = await fetch("/hello-garden-themaviewer/data.json?v=" + Date.now());
  const text = await res.text();

  if (lastDataString && lastDataString !== text) {
    location.reload();
    return;
  }

  lastDataString = text;
  allData = JSON.parse(text);
}

loadData();
setInterval(loadData, 30000);

/* INPUT */
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

  clearBtn.style.display = value ? "block" : "none";

  if (!value || !allData.length) {
    results.innerHTML = "";
    return;
  }

  const matches = allData.filter(item =>
    (item["Nederlandse naam"] || "").toLowerCase().includes(value) ||
    (item["Omschrijving"] || "").toLowerCase().includes(value)
  );

  currentList = matches;
  render(matches.slice(0, 10));
});

/* CLEAR */
clearBtn.onclick = () => {
  input.value = "";
  results.innerHTML = "";
  clearBtn.style.display = "none";
};

/* FOTO */
function getFoto(item) {
  let url = item["Foto"];
  return (!url || !url.startsWith("http")) ? FALLBACK : url;
}

/* RENDER */
function render(list) {
  results.innerHTML = list.map((item, index) => `
    <div class="card" onclick="openDetail(${index})">

      <img src="${getFoto(item)}" class="card-img">

      <div class="card-content">
        <h2>${item["Nederlandse naam"]}</h2>
        <p>${item["Omschrijving"]}</p>

        <div class="theme" data-theme="${item["Thema"]}">
          ${themeIcons[item["Thema"]] || ""} ${item["Thema"]}
        </div>
      </div>

    </div>
  `).join("");
}

/* DETAIL */
function openDetail(index) {
  const item = currentList[index];

  results.innerHTML = `
    <div class="card" style="flex-direction:column;">
      <button onclick="goBack()">⬅ Terug</button>

      <h2>${item["Nederlandse naam"]}</h2>
      <p>${item["Omschrijving"]}</p>

      <img src="${getFoto(item)}" class="detail-img">

      <div class="theme">${item["Thema"]}</div>
    </div>
  `;
}

/* TERUG */
function goBack() {
  render(currentList.slice(0, 10));
}
