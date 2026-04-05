const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];
let currentList = [];
let lastDataString = "";
let deferredPrompt = null;

/* THEMA ICONEN */
const themeIcons = {
  "Bijen- en vlinderlokkers": "🐝",
  "Bodembedekkend": "🌿",
  "Geurend": "🌸",
  "Schaduw": "🌑",
  "Specials": "⭐",
  "Grassen": "🌾",
  "Kruiden": "🍃",
  "Wild & Inheems": "🌼"
};

/* ELEMENTEN */
const input = document.getElementById("searchBox");
const clearBtn = document.getElementById("clearBtn");
const results = document.getElementById("results");
const installBtn = document.getElementById("installBtn");

/* 🔥 INSTALL */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "inline-block";
});

if (installBtn) {
  installBtn.onclick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;
    installBtn.style.display = "none";
  };
}

/* 🔥 SHARE (ALTIJD WERKEND) */
window.addEventListener("load", () => {

  const shareBtn = document.getElementById("shareBtn");

  if (!shareBtn) return;

  if (navigator.share) {
    shareBtn.style.display = "inline-block";

    shareBtn.onclick = async () => {
      try {
        await navigator.share({
          title: "Vaste planten – Themazoeker",
          text: "Bekijk deze planten tool",
          url: window.location.href
        });
      } catch (err) {
        console.log("Share geannuleerd");
      }
    };

  } else {
    // fallback
    shareBtn.style.display = "inline-block";

    shareBtn.onclick = () => {
      navigator.clipboard.writeText(window.location.href);
      alert("Link gekopieerd 👍");
    };
  }

});

/* 🔄 DATA LADEN */
async function loadData() {
  try {
    const res = await fetch("/hello-garden-themaviewer/data.json?v=" + Date.now());
    const text = await res.text();

    if (lastDataString && lastDataString !== text) {
      showUpdateBar();
      return;
    }

    lastDataString = text;
    allData = JSON.parse(text);

  } catch (e) {
    console.log("offline");
  }
}

/* 🔄 UPDATE MELDING */
function showUpdateBar() {
  if (document.getElementById("updateBar")) return;

  const bar = document.createElement("div");
  bar.innerHTML = "🔄 Nieuwe data beschikbaar – verversen…";

  Object.assign(bar.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#356859",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "10px",
    zIndex: 9999
  });

  document.body.appendChild(bar);

  setTimeout(() => location.reload(), 8000);
}

/* INIT */
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
          ${themeIcons[item["Thema"]] || ""} ${item["Thema"] || ""}
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

      <div class="theme" data-theme="${item["Thema"]}">
        ${themeIcons[item["Thema"]] || ""} ${item["Thema"] || ""}
      </div>
    </div>
  `;
}

/* TERUG */
function goBack() {
  render(currentList.slice(0, 10));
}
