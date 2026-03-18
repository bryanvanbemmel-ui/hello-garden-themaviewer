const csvFile = "data.csv";

// themakleuren
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

// laad CSV en vul keuzelijst
Papa.parse(csvFile, {
  download: true,
  header: true,
  complete: function (results) {
    const data = results.data.filter(row => row.Omschrijving);
    const datalist = document.getElementById("datalist");
    data.forEach(row => {
      const opt1 = document.createElement("option");
      opt1.value = row["Nederlandse naam"];
      datalist.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = row["Omschrijving"];
      datalist.appendChild(opt2);
    });

    const input = document.getElementById("searchBox");
    input.addEventListener("change", () => showResult(input.value, data));
  }
});

function showResult(value, data) {
  const resultDiv = document.getElementById("result");
  const row = data.find(r =>
    (r["Nederlandse naam"] && r["Nederlandse naam"].toLowerCase() === value.toLowerCase()) ||
    (r["Omschrijving"] && r["Omschrijving"].toLowerCase() === value.toLowerCase())
  );

  if (!row) {
    resultDiv.innerHTML = "<p>❌ Niet gevonden. Controleer spelling.</p>";
    return;
  }

  const thema = row["Thema"] || "Onbekend";
  const color = themeColors[thema] || "#eee";

  resultDiv.innerHTML = `
    <h2>${row["Nederlandse naam"] || ""}</h2>
    <p><em>${row["Omschrijving"] || ""}</em></p>
    <div class="theme-box" style="background:${color};">${thema}</div>
  `;
}
