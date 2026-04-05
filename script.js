const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];
let currentSuggestions = [];
let currentList = [];
let lastDataString = "";

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

/* 🔥 UPDATE BALK */
function showUpdateBar() {
  if (document.getElementById("updateBar")) return;

  const bar = document.createElement("div");
  bar.id = "updateBar";
  bar.innerHTML = `
    <span>🔄 Nieuwe data beschikbaar</span>
    <button onclick="location.reload()">Nu verversen</button>
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
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    zIndex: 9999
  });

  document.body.appendChild(bar);

  // 🔥 AUTO REFRESH NA 10 SEC
  setTimeout(() => {
    location.reload();
  }, 10000);
}

/* 🔥 DATA LADEN */
async function loadData() {
  try {
    const res = await fetch("/hello-garden-themaviewer/data.json?v=" + Date.now(), {
      cache: "no-store"
    });

    const text = await res.text();

    if (lastDataString && lastDataString !== text) {
      console.log("🔄 Nieuwe data gevonden");
      showUpdateBar();
      return;
    }

    lastDataString = text;
    allData = JSON.parse(text);

  } catch (e) {
    console.log("offline");
  }
}

/* INIT */
loadData();

/* 🔁 CHECK ELKE 30 SEC */
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

/* FOTO */
function getFoto(item) {
  let url = item["Foto"];
  if (!url || !url.startsWith("http")) return FALLBACK;
  return url;
}

/* LIJST */
function render(list) {
  const container = document.getElementById("results");

  if (!list.length) {
    container.innerHTML = "<p>Geen resultaat</p>";
    return;
  }

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

  const imgUrl = getFoto(item);

  document.getElementById("results").innerHTML = `
    <div class="card" style="flex-direction:column;">
      <button onclick="goBack()">⬅ Terug</button>

      <h2>${item["Nederlandse naam"]}</h2>
      <p>${item["Omschrijving"]}</p>

      <img src="${imgUrl}" class="detail-img"
           onclick="openLightbox('${imgUrl}')">

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
