const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];

/* 🔥 DATA LADEN (MEERDERE POGINGEN) */
async function loadData() {
  try {
    // poging 1 (GitHub pages pad)
    let res = await fetch("/hello-garden-themaviewer/data.json?v=" + Date.now(), { cache: "no-store" });

    if (!res.ok) {
      // poging 2 (relatief)
      res = await fetch("data.json?v=" + Date.now(), { cache: "no-store" });
    }

    const data = await res.json();

    allData = data;
    console.log("DATA OK:", data);

  } catch (e) {
    console.error("JSON laad fout:", e);
    alert("JSON wordt niet geladen!");
  }
}

loadData();

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
    JSON.stringify(r).toLowerCase().includes(value)
  );

  render(matches.slice(0, 10));
});

/* 🔥 FOTO HELPER (ULTRA ROBUUST) */
function getFoto(item) {
  let foto =
    item["Foto"] ||
    item["foto"] ||
    item["Foto "] ||
    item["image"] ||
    "";

  console.log("FOTO VALUE:", foto);

  if (!foto || !foto.startsWith("http")) {
    return FALLBACK;
  }

  return foto;
}

/* 🔥 RENDER (MET DEBUG) */
function render(list) {

  if (!list.length) {
    results.innerHTML = "<p>Geen resultaat</p>";
    return;
  }

  results.innerHTML = list.map(item => {

    const imgUrl = getFoto(item);

    return `
      <div class="card">
        <h2>${item["Nederlandse naam"] || ""}</h2>
        <p>${item["Omschrijving"] || ""}</p>

        <!-- 🔥 FOTO (GROOT + ZICHTBAAR) -->
        <img src="${imgUrl}"
             style="width:150px;height:150px;border:3px solid red;margin-top:10px"
             onclick="openImg('${imgUrl}')"
             onerror="this.onerror=null; this.src='${FALLBACK}'; this.style.border='3px solid blue'">

        <div style="font-size:10px;word-break:break-all;">
          ${imgUrl}
        </div>

        <div style="margin-top:10px;">
          ${item["Thema"] || ""}
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
