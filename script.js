const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];
let currentList = [];

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

/* DATA LADEN */
fetch("/hello-garden-themaviewer/data.json?v=" + Date.now(), { cache: "no-store" })
  .then(res => res.json())
  .then(data => allData = data);

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

/* LIJST */
function renderList(list) {
  currentList = list;

  results.innerHTML = list.map((item, index) => `
    <div class="card" onclick="openDetail(${index})">
      <h2>${item["Nederlandse naam"]}</h2>
      <p>${item["Omschrijving"]}</p>

      <div class="theme" data-theme="${item["Thema"]}">
        ${themeIcons[item["Thema"]] || ""} ${item["Thema"]}
      </div>
    </div>
  `).join("");
}

/* DETAIL */
function openDetail(index) {
  const item = currentList[index];

  let imgUrl = item["Foto"];
  if (!imgUrl || !imgUrl.startsWith("http")) {
    imgUrl = FALLBACK;
  }

  results.innerHTML = `
    <div class="card">
      <button onclick="goBack()">⬅ Terug</button>

      <h2>${item["Nederlandse naam"]}</h2>
      <p>${item["Omschrijving"]}</p>

      <img src="${imgUrl}"
           class="detail-img"
           onclick="openLightbox('${imgUrl}')"
           onerror="this.src='${FALLBACK}'">

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
  shareBtn.addEventListener("click", () => {
    navigator.share({
      title: "Vaste planten – Themazoeker",
      text: "Bekijk deze planten tool",
      url: window.location.href
    });
  });
} else {
  shareBtn.style.display = "none";
}
