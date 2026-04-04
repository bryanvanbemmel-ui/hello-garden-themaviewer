const FALLBACK = "https://webshop.griffioenwassenaar.nl/img/plant.png";

let allData = [];

/* DATA LADEN */
fetch("/hello-garden-themaviewer/data.json?v=" + Date.now(), { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    allData = data;
    console.log("NIEUWE SCRIPT ACTIEF");
  });

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

  render(matches.slice(0, 10));
});

/* RENDER MET FOTO */
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

        <img src="${imgUrl}"
             style="width:120px;height:120px;border:3px solid red;margin-top:10px"
             onerror="this.onerror=null; this.src='${FALLBACK}'">

        <div style="margin-top:10px;">
          ${item["Thema"]}
        </div>
      </div>
    `;
  }).join("");
}
