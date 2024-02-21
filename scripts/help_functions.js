let colorsForTypes = {
  normal: "rgba(168, 167, 122, 1)",
  fire: "rgba(238, 129, 48, 1)",
  water: "rgba(99, 144, 240, 1)",
  electric: "rgba(247, 208, 44, 1)",
  grass: "rgba(122, 199, 76, 1)",
  ice: "rgba(150, 217, 214, 1)",
  fighting: "rgba(194, 46, 40, 1)",
  poison: "rgba(163, 62, 161, 1)",
  ground: "rgba(226, 191, 101, 1)",
  flying: "rgba(169, 143, 243, 1)",
  psychic: "rgba(249, 85, 135, 1)",
  bug: "rgba(166, 185, 26, 1)",
  rock: "rgba(182, 161, 54, 1)",
  ghost: "rgba(115, 87, 151, 1)",
  steel: "rgba(183, 183, 206, 1)",
  dragon: "rgba(111, 53, 252, 1)",
  dark: "rgba(112, 87, 70, 1)",
  fairy: "rgba(214, 133, 173, 1)",
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function appLeadingZeros(nr) {
  return "#" + Array(4 - String(nr).length + 1).join("0") + nr;
}

function makeColorBrighter(color, factor) {
  // Extract the color components
  const components = extractColorComponents(color);

  if (components.length !== 4) {
    // Invalid color format
    return color;
  }

  // Extract the red, green, blue, and alpha components
  let [red, green, blue, alpha] = components;

  // Adjust the brightness by multiplying the RGB values by the factor
  red = Math.min(255, red + factor);
  green = Math.min(255, green + factor);
  blue = Math.min(255, blue + factor);

  // Return the adjusted color in the same format
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function extractColorComponents(color) {
  const colorValues = color.substring(
    color.indexOf("(") + 1,
    color.lastIndexOf(")")
  );
  return colorValues.split(",").map(Number);
}

function changeOpacity(color, opacity) {
  // Ensure the opacity value is within the range [0, 1]
  opacity = Math.min(Math.max(opacity, 0), 1);

  // Extract the RGB components and the alpha value from the input color
  const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/.exec(color);
  if (!match) {
    // Invalid color format
    return color;
  }
  // Construct a new RGBA color with the specified opacity
  const [_, r, g, b] = match;
  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;

  return rgbaColor;
}

function openInfoAbout() {
  clearChart();
  document.getElementById("infoAbout").classList.remove("d-none");
  document.getElementById("infoStats").classList.add("d-none");
  document.getElementById("infoMoves").classList.add("d-none");

  document.getElementById("infoNavAbout").classList.remove("infoNavNotAktiv");
  document.getElementById("infoNavStats").classList.add("infoNavNotAktiv");
  document.getElementById("infoNavMoves").classList.add("infoNavNotAktiv");

  document.getElementById("infoNavAbout").classList.add("aktiv");
  document.getElementById("infoNavStats").classList.remove("aktiv");
  document.getElementById("infoNavMoves").classList.remove("aktiv");
}

function openInfoStats(i) {
  document.getElementById("infoStats").innerHTML = `
  <div class="loadingSpinner">
  <img src="./images/pokeball.png" alt="Rotating Pokeball">
</div> 
  <canvas id="myChart"></canvas>`;
  loadeChart(i);
  document.getElementById("infoAbout").classList.add("d-none");
  document.getElementById("infoStats").classList.remove("d-none");
  document.getElementById("infoMoves").classList.add("d-none");

  document.getElementById("infoNavAbout").classList.add("infoNavNotAktiv");
  document.getElementById("infoNavStats").classList.remove("infoNavNotAktiv");
  document.getElementById("infoNavMoves").classList.add("infoNavNotAktiv");

  document.getElementById("infoNavAbout").classList.remove("aktiv");
  document.getElementById("infoNavStats").classList.add("aktiv");
  document.getElementById("infoNavMoves").classList.remove("aktiv");
}
function openInfoMoves(i) {
  document.getElementById("movesContainer").innerHTML = "";
  loadeMoves(i);
  clearChart();
  document.getElementById("infoAbout").classList.add("d-none");
  document.getElementById("infoStats").classList.add("d-none");
  document.getElementById("infoMoves").classList.remove("d-none");

  document.getElementById("infoNavAbout").classList.add("infoNavNotAktiv");
  document.getElementById("infoNavStats").classList.add("infoNavNotAktiv");
  document.getElementById("infoNavMoves").classList.remove("infoNavNotAktiv");

  document.getElementById("infoNavAbout").classList.remove("aktiv");
  document.getElementById("infoNavStats").classList.remove("aktiv");
  document.getElementById("infoNavMoves").classList.add("aktiv");
}

function genderInfo(i) {
  if (pokemonsSpeciesArray[i]["gender_rate"] == -1) {
    document.getElementById(`genderRate${i}`).innerHTML = "genderles";
  } else {
    let female = pokemonsSpeciesArray[i]["gender_rate"] * 12.5;
    let male = 100 - female;
    document.getElementById(`genderRate${i}`).innerHTML = /*html*/ `
        <span>
            <span style="color: #ED49A7" class="material-symbols-outlined">female</span>
            ${female}%
        </span>
        <span>
            <span style="color: #52A3FF" class="material-symbols-outlined">male</span>
            ${male}%
        </span>
    `;
  }
}

function getDescription(i) {
  for (
    let j = 0;
    j < pokemonsSpeciesArray[i]["flavor_text_entries"].length;
    j++
  ) {
    if (
      pokemonsSpeciesArray[i]["flavor_text_entries"][`${j}`]["language"][
        "name"
      ] == "en"
    ) {
      return pokemonsSpeciesArray[i]["flavor_text_entries"][`${j}`][
        "flavor_text"
      ];
    }
  }
  return "";
}

function getAbilities(i) {
  let abilitiesArray = [];
  for (let j = 0; j < pokemonsArray[i]["abilities"].length; j++) {
    abilitiesArray.push(
      capitalizeFirstLetter(
        pokemonsArray[i]["abilities"][`${j}`]["ability"]["name"]
      )
    );
  }
  return abilitiesArray.join(", ");
}

function getStatsData(i) {
  let statsData = [];
  for (let j = 0; j < pokemonsArray[i].stats.length; j++) {
    statsData.push(pokemonsArray[i].stats[j].base_stat);
  }
  return statsData;
}

function getMaxChartValue(maxStat) {
  if (maxStat > 150) return 200;
  if (maxStat > 100) return 150;
  return 100;
}

function getStepSizeValue(maxChartValue) {
  if (maxChartValue === 200) return 40;
  if (maxChartValue === 150) return 30;
  return 20;
}

let BackToTopButton = document.getElementById("backToTop");
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    BackToTopButton.style.display = "block";
  } else {
    BackToTopButton.style.display = "none";
  }
}

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.body.scrollHeight;

  if (scrollY + windowHeight >= documentHeight - 100) {
    loadPokemon(pokemonToLoad);
  }
});

function getMoveNames(moves) {
  let moveNames = [];
  for (let i = 0; i < moves.length; i++) {
    moveNames.push(moves[i]["move"]["name"]);
  }
  return moveNames;
}

async function getMoveTypes(moveNames) {
  for (let moveName of moveNames) {
    let url = `https://pokeapi.co/api/v2/move/${moveName}`;
    let response = await fetch(url);
    let moveInfo = await response.json();

    moveTypes.push(moveInfo["type"]["name"]);
  }
  return moveTypes;
}
