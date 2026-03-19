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
let currentSuggestions = [];

// DATA LADEN
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    allData = data;
    console.log("Data geladen");
  })
  .catch(err => console.error(err));

const input = document.getElementById("searchBox");

// INPUT
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

  currentSuggestions = matches.slice(0, 5);

  showSuggestions(currentSuggestions);
  render(matches.slice(0, 10));
});

// DROPDOWN
function showSuggestions(list) {
  const box = document.getElementById("suggestions");

  if (!list.length) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = list.map((item, i) => `
    <div class="suggestion" onclick="selectItem(${i})">
      <strong>${item["Nederlandse naam"]}</strong><br>
      <small>${item["Omschrijving"]}</small>
    </div>
  `).join("");
}

// SELECT (exact 1 item)
function selectItem(index) {
  const item = currentSuggestions[index];

  document.getElementById("searchBox").value =
    item["Nederlandse naam"] + " - " + item["Omschrijving"];

  document.getElementById("suggestions").innerHTML = "";

  render([item]); // 👈 ALLEEN DEZE
}

// RESULTATEN
function render(list) {
  const container = document.getElementById("results");

  if (!list.length) {
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

// CLICK OUTSIDE = CLOSE
document.addEventListener("click", (e) => {
  if (!e.target.closest("#searchBox")) {
    document.getElementById("suggestions").innerHTML = "";
  }
});
const clearBtn = document.getElementById("clearBtn");

input.addEventListener("input", () => {
  clearBtn.style.display = input.value ? "block" : "none";
});

clearBtn.addEventListener("click", () => {
  input.value = "";
  document.getElementById("suggestions").innerHTML = "";
  document.getElementById("results").innerHTML = "";
  clearBtn.style.display = "none";
  input.focus();
});
