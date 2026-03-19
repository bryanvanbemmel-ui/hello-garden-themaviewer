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
  })
  .catch(err => console.error("JSON fout:", err));

const input = document.getElementById("searchBox");

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
});

/* DROPDOWN */
function showSuggestions(list) {
  const box = document.getElementById("suggestions");

  if (list.length === 0) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = list.map(item => `
    <div class="suggestion" onclick="selectItem('${item["Nederlandse naam"]}')">
      <strong>${item["Nederlandse naam"]}</strong><br>
      <small>${item["Omschrijving"]}</small>
    </div>
  `).join("");
}

/* SELECT */
function selectItem(name) {
  const matches = allData.filter(r =>
    (r["Nederlandse naam"] || "").toLowerCase() === name.toLowerCase()
  );

  document.getElementById("searchBox").value = name;
  document.getElementById("suggestions").innerHTML = "";

  render(matches);
}

/* RENDER */
function render(list) {
  const container = document.getElementById("results");

  if (list.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Geen resultaat</p>";
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
