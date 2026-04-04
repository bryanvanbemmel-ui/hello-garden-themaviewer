const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];
let currentSuggestions = [];

/* 🔥 DATA LADEN (JUISTE PAD + GEEN CACHE) */
fetch("/hello-garden-themaviewer/data.json?v=" + Date.now(), { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    allData = data;
    console.log("DATA geladen:", data);
  })
  .catch(err => console.error("Fout laden JSON:", err));

const input = document.getElementById("searchBox");
const clearBtn = document.getElementById("clearBtn");
const results = document.getElementById("results");
const suggestions = document.getElementById("suggestions");

/* =======================
   INPUT
======================= */
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

  clearBtn.style.display = value ? "block" : "none";

  if (!value) {
    results.innerHTML = "";
    suggestions.innerHTML = "";
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
clearBtn.onclick = () => {
  input.value = "";
  results.innerHTML = "";
  suggestions.innerHTML = "";
  clearBtn.style.display = "none";
};

/* =======================
   SUGGESTIONS
======================= */
function showSuggestions(list) {
  suggestions.innerHTML = list.map((item, i) => `
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
  suggestions.innerHTML = "";
  render([item]);
}

/* =======================
   FOTO HELPER (BELANGRIJK)
======================= */
function getFoto(item) {
  let foto = item["Foto"] || item["foto"] || "";

  if (!foto || !foto.startsWith("http")) {
    return FALLBACK;
  }

  return foto;
}

/* =======================
   RENDER
======================= */
function render(list) {
  results.innerHTML = list.map(item => {

    const imgUrl = getFoto(item);

    return `
      <div class="card">
        <h2>${item["Nederlandse naam"]}</h2>
        <p>${item["Omschrijving"]}</p>

        <!-- 🔥 FOTO -->
        <img src="${imgUrl}"
             style="width:120px;height:120px;border:2px solid #ccc;margin-top:10px"
             onclick="openImg('${imgUrl}')"
             onerror="this.onerror=null; this.src='${FALLBACK}'">

        <div class="theme-row">
          <div class="theme">${item["Thema"] || ""}</div>
        </div>
      </div>
    `;
  }).join("");
}

/* =======================
   LIGHTBOX
======================= */
function openImg(src) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightboxImg").src = src;
}

document.getElementById("close").onclick = () => {
  document.getElementById("lightbox").style.display = "none";
};

/* =======================
   CLICK OUTSIDE
======================= */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    suggestions.innerHTML = "";
  }
});
