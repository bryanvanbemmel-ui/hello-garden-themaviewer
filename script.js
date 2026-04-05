const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];
let currentList = [];
let lastDataString = "";

/* ICONEN */
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
const results = document.getElementById("results");
const clearBtn = document.getElementById("clearBtn");

/* 🔥 DATA LADEN */
async function loadData() {
  try {
    const res = await fetch("/hello-garden-themaviewer/data.json?v=" + Date.now(), {
      cache: "no-store"
    });

    const text = await res.text();

    // update check
    if (lastDataString && lastDataString !== text) {
      showUpdateBar();
      return;
    }

    lastDataString = text;
    allData = JSON.parse(text);

    console.log("DATA GELADEN:", allData.length);

  } catch (e) {
    console.log("offline");
  }
}

/* 🔄 UPDATE BALK */
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

/* 🔍 ZOEKEN */
input.addEventListener("input", handleSearch);

/* CLEAR */
clearBtn.onclick = () => {
  input.value = "";
  results.innerHTML = "";
  clearBtn.style.display = "none";
};

/* 🔥 ZOEK FUNCTIE */
function handleSearch() {

  const value = input.value.toLowerCase();

  clearBtn.style.display = value ? "block" : "none";

  if (!value || !allData.length) {
    results.innerHTML = "";
    return;
  }

  const matches = allData.filter(item => {
    return (
      (item["Nederlandse naam"] || "").toLowerCase().includes(value) ||
      (item["Omschrijving"] || "").toLowerCase().includes(value)
    );
  });

  currentList = matches;

  render(matches.slice(0, 10));
}

/* FOTO */
function getFoto(item) {
  let url = item["Foto"];
  return (!url || !url.startsWith("http")) ? FALLBACK : url;
}

/* LIJST */
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

      <img src="${getFoto(item)}" class="detail-img"
           onclick="openLightbox('${getFoto(item)}')">

      <div class="theme" data-theme="${item["Thema"]}">
        ${themeIcons[item["Thema"]] || ""} ${item["Thema"]}
      </div>
    </div>
  `;
}

/* TERUG */
function goBack() {
  render(currentList.slice(0, 10));
}

/* LIGHTBOX */
function openLightbox(src) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightboxImg").src = src;
}

document.getElementById("lightbox").onclick = () => {
  document.getElementById("lightbox").style.display = "none";
};

/* SHARE */
const shareBtn = document.getElementById("shareBtn");

if (shareBtn && navigator.share) {
  shareBtn.onclick = () => {
    navigator.share({
      title: "Thema zoeker",
      url: window.location.href
    });
  };
} else if (shareBtn) {
  shareBtn.style.display = "none";
}
