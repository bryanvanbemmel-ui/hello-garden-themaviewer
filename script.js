const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];
let currentSuggestions = [];
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

/* 🔄 UPDATE BALK */
function showUpdateBar() {
  if (document.getElementById("updateBar")) return;

  const bar = document.createElement("div");
  bar.id = "updateBar";
  bar.innerHTML = `
    <span>🔄 Nieuwe data beschikbaar</span>
    <button onclick="location.reload()">Vernieuwen</button>
  `;

  Object.assign(bar.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#356859",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "12px",
    display: "flex",
    gap: "10px",
    zIndex: 9999
  });

  document.body.appendChild(bar);

  setTimeout(() => location.reload(), 10000);
}

/* 🔥 DATA LADEN */
async function loadData() {
  try {
    const res = await fetch("/hello-garden-themaviewer/data.json?v=" + Date.now(), {
      cache: "no-store"
    });

    const text = await res.text();

    if (lastDataString && lastDataString !== text) {
      showUpdateBar();
      return;
    }

    lastDataString = text;
    allData = JSON.parse(text);

    console.log("DATA OK:", allData.length);

  } catch (e) {
    console.log("offline");
  }
}

/* INIT */
loadData();

/* CHECK */
setInterval(loadData, 30000);

/* ELEMENTEN */
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

  if (!allData.length) return; // 🔥 wacht op data

  const matches = allData.filter(r =>
    (r["Nederlandse naam"] || "").toLowerCase().includes(value) ||
    (r["Omschrijving"] || "").toLowerCase().includes(value)
  );

  currentSuggestions = matches.slice(0, 5);
  currentList = matches;

  showSuggestions(currentSuggestions);
  render(matches.slice(0, 10));
});

/* CLEAR */
clearBtn.onclick = () => {
  input.value = "";
  document.getElementById("suggestions").innerHTML = "";
  document.getElementById("results").innerHTML = "";
  clearBtn.style.display = "none";
};

/* DROPDOWN */
function showSuggestions(list) {
  const box = document.getElementById("suggestions");

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

  currentList = [item]; // 🔥 fix
  render(currentList);
}

/* FOTO */
function getFoto(item) {
  let url = item["Foto"];
  return (!url || !url.startsWith("http")) ? FALLBACK : url;
}

/* LIJST */
function render(list) {
  const container = document.getElementById("results");

  if (!list.length) {
    container.innerHTML = "<p>Geen resultaat</p>";
    return;
  }

  currentList = list; // 🔥 altijd sync

  container.innerHTML = list.map((item, index) => `
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

  document.getElementById("results").innerHTML = `
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
  render(currentList);
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
      title: "Hello Garden",
      url: window.location.href
    });
  };
} else if (shareBtn) {
  shareBtn.style.display = "none";
}
