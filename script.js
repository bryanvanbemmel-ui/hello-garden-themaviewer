const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];
let currentList = [];

/* THEMA ICONEN */
const themeIcons = {
  "Grassen": "🌾",
  "Kruiden": "🍃",
  "Schaduw": "🌑",
  "Bijen- en vlinderlokkers": "🐝"
};

/* 🔥 DATA LADEN (ONLINE + OFFLINE) */
async function loadData() {
  try {
    const res = await fetch("/hello-garden-themaviewer/data.json?v=" + Date.now());
    const data = await res.json();

    localStorage.setItem("plantData", JSON.stringify(data));

    console.log("ONLINE DATA");
    return data;

  } catch (e) {
    console.log("OFFLINE DATA");

    const local = localStorage.getItem("plantData");
    return local ? JSON.parse(local) : [];
  }
}

loadData().then(data => {
  allData = data;
});

/* ELEMENTEN */
const input = document.getElementById("searchBox");
const clearBtn = document.getElementById("clearBtn");
const results = document.getElementById("results");

/* INPUT */
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

  clearBtn.style.display = value ? "block" : "none";

  if (!value) {
    results.innerHTML = "";
    return;
  }

  const matches = allData.filter(r =>
    (r["Nederlandse naam"] || "").toLowerCase().includes(value) ||
    (r["Omschrijving"] || "").toLowerCase().includes(value)
  );

  renderList(matches.slice(0, 10));
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

/* LIJST */
function renderList(list) {
  currentList = list;

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
  renderList(currentList);
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

if (navigator.share) {
  shareBtn.onclick = () => {
    navigator.share({
      title: "Vaste planten – Themazoeker",
      url: window.location.href
    });
  };
} else {
  shareBtn.style.display = "none";
}
