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
    console.log("data geladen");
  })
  .catch(err => console.error(err));

const input = document.getElementById("searchBox");

input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

  if (!value) {
    document.getElementById("results").innerHTML = "";
    return;
  }

  const matches = allData.filter(r =>
    (r["Nederlandse naam"] || "").toLowerCase().includes(value) ||
    (r["Omschrijving"] || "").toLowerCase().includes(value)
  );

  render(matches.slice(0, 10));
});

function render(list) {
  const container = document.getElementById("results");

  if (list.length === 0) {
    container.innerHTML = "<p>Geen resultaat</p>";
    return;
  }

  container.innerHTML = list.map(item => {
    const thema = (item["Thema"] || "Onbekend").trim();
    const color = themeColors[thema] || "#eee";

    return `
      <div class="card">
        <h3>${item["Nederlandse naam"]}</h3>
        <p>${item["Omschrijving"]}</p>
        <div class="theme" style="background:${color}">
          ${thema}
        </div>
      </div>
    `;
  }).join("");
}
#suggestions {
  max-width: 700px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 10px;
}

.suggestion {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.suggestion:hover {
  background: #f3f4f6;
}
