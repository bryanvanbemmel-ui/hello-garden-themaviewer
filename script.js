const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];

/* DATA LADEN */
fetch("/hello-garden-themaviewer/data.json?v=" + Date.now(), { cache: "no-store" })
  .then(res => res.json())
  .then(data => allData = data);

const input = document.getElementById("searchBox");
const results = document.getElementById("results");

/* INPUT */
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

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

/* =======================
   LIJST (ZONDER FOTO)
======================= */
function renderList(list) {

  results.innerHTML = list.map((item, index) => {

    return `
      <div class="card" onclick="openDetail(${index})">
        <h2>${item["Nederlandse naam"]}</h2>
        <p>${item["Omschrijving"]}</p>

        <div class="theme">${item["Thema"] || ""}</div>
      </div>
    `;
  }).join("");

  window.currentList = list;
}

/* =======================
   DETAIL MET FOTO
======================= */
function openDetail(index) {

  const item = window.currentList[index];

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
           style="width:100%;max-width:400px;margin-top:10px;border-radius:10px"
           onclick="openLightbox('${imgUrl}')"
           onerror="this.src='${FALLBACK}'">

      <div style="margin-top:10px;">
        ${item["Thema"] || ""}
      </div>
    </div>
  `;
}

/* TERUG NAAR LIJST */
function goBack() {
  renderList(window.currentList);
}

/* =======================
   LIGHTBOX (GROTE FOTO)
======================= */
function openLightbox(src) {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");

  img.src = src;
  box.style.display = "flex";
}

/* SLUITEN */
document.getElementById("lightbox").onclick = () => {
  document.getElementById("lightbox").style.display = "none";
};
