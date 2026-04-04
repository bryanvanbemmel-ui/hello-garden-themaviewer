const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];

/* DATA LADEN (GEEN CACHE) */
fetch("data.json?v=" + Date.now(), { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    allData = data;
  });

const input = document.getElementById("searchBox");
const clearBtn = document.getElementById("clearBtn");
const results = document.getElementById("results");
const suggestions = document.getElementById("suggestions");

/* INPUT */
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

  render(matches.slice(0, 10));
});

/* CLEAR */
clearBtn.onclick = () => {
  input.value = "";
  results.innerHTML = "";
  suggestions.innerHTML = "";
  clearBtn.style.display = "none";
};

/* RENDER */
function render(list) {
  results.innerHTML = list.map(item => {

    let imgUrl = item["Foto"];

    if (!imgUrl || !imgUrl.startsWith("http")) {
      imgUrl = FALLBACK;
    }

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
          <div class="theme">${item["Thema"]}</div>
        </div>
      </div>
    `;
  }).join("");
}

/* LIGHTBOX */
function openImg(src) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightboxImg").src = src;
}

document.getElementById("close").onclick = () => {
  document.getElementById("lightbox").style.display = "none";
};
