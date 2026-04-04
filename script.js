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

/* DATA LADEN */
fetch("data.json?v=" + Date.now(), { cache: "no-store" })
  .then(res => res.json())
  .then(data => allData = data);

/* INPUT */
const input = document.getElementById("searchBox");
const clearBtn = document.getElementById("clearBtn");

input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

  clearBtn.style.display = value ? "block" : "none";

  if (!value) {
    suggestions.innerHTML = "";
    results.innerHTML = "";
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
  suggestions.innerHTML = "";
  results.innerHTML = "";
  clearBtn.style.display = "none";
});

/* SUGGESTIONS */
function showSuggestions(list) {
  suggestions.innerHTML = list.map((item, i) => `
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
  suggestions.innerHTML = "";
  render([item]);
}

/* RENDER */
function render(list) {
  results.innerHTML = list.map(item => {

    const color = themeColors[item["Thema"]] || "#eee";
    let imgUrl = item["Foto"];

    if (!imgUrl || !imgUrl.startsWith("http")) {
      imgUrl = FALLBACK;
    }

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

/* LIGHTBOX */
function openLightbox(src) {
  lightbox.style.display = "flex";
  lightboxImg.src = src;
}

lightboxClose.onclick = () => lightbox.style.display = "none";

lightbox.onclick = (e) => {
  if (e.target.id === "lightbox") {
    lightbox.style.display = "none";
  }
};
