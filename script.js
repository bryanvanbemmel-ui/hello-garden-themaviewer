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

let allData = [];

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    allData = data;
    console.log("Data geladen");
  })
  .catch(err => console.error("Fout:", err));

const input = document.getElementById("searchBox");

/* INPUT */
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

  if (!value) {
    document.getElementById("suggestions").innerHTML = "";
    document.getElementById("results").innerHTML = "";
    return;
  }

  const matches = allData.filter(r =>
    (r["Nederlandse naam"] || "").toLowerCase().includes(value) ||
    (r["Omschrijving"] || "").toLowerCase().includes(value)
  );

  showSuggestions(matches.slice(0, 5));
  render(matches.slice(0, 10));
});

/* DROPDOWN */
function showSuggestions(list) {
  const box = document.getElementById("suggestions");

  if (!list || list.length === 0) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = list.map((item, index) => `
    <div class="suggestion" onclick="selectItem(${index})">
      <strong>${item["Nederlandse naam"] || ""}</strong><br>
      <small>${item["Omschrijving"] || ""}</small>
    </div>
  `).join("");

  // bewaar lijst tijdelijk
  window.currentSuggestions = list;
}

  box.innerHTML = list.map(item => `
    <div class="suggestion" onclick="selectItem('${(item["Nederlandse naam"] || "").replace(/'/g, "\\'")}', '${(item["Omschrijving"] || "").replace(/'/g, "\\'")}')
      <strong>${item["Nederlandse naam"] || ""}</strong><br>
      <small>${item["Omschrijving"] || ""}</small>
    </div>
  `).join("");
}

/* SELECT */
function selectItem(name, desc) {
  const matches = allData.filter(r =>
    (r["Nederlandse naam"] || "").toLowerCase() === name.toLowerCase() &&
    (r["Omschrijving"] || "").toLowerCase() === desc.toLowerCase()
  );

  document.getElementById("searchBox").value = name;
  document.getElementById("suggestions").innerHTML = "";

  render(matches);
}

/* RESULTATEN */
function render(list) {
  const container = document.getElementById("results");

  if (!list || list.length === 0) {
    container.innerHTML = "<p>Geen resultaat</p>";
    return;
  }

  container.innerHTML = list.map(item => {
    const thema = (item["Thema"] || "Onbekend").trim();
    const color = themeColors[thema] || "#eee";

    return `
      <div class="card">
        <h2>${item["Nederlandse naam"]}</h2>
        <p>${item["Omschrijving"]}</p>
        <div class="theme" style="background:${color}">
          ${thema}
        </div>
      </div>
    `;
  }).join("");
}

/* CLICK OUTSIDE = CLOSE DROPDOWN */
document.addEventListener("click", (e) => {
  if (!e.target.closest("#searchBox")) {
    document.getElementById("suggestions").innerHTML = "";
  }
});
