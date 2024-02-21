let currentPokemon;
let currentPokemonSpecies;
let pokemonsArray = [0];
let pokemonsSpeciesArray = [0];
let moveTypes = [];

let pokemonToLoad = 30; // Initial number of items to load
let pokemonLoaded = 0; // Number of items loaded so far
let loadingMore = false; // Flag to prevent multiple loadings
let loadedPokemonIds = []; // Array to keep track of loaded Pokémon IDs

loadPokemon(pokemonToLoad);

async function fetchPokemonData(i) {
  let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
  let response = await fetch(url);
  return await response.json();
}

async function fetchPokemonSpeciesData(i) {
  let urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
  let responseSpecies = await fetch(urlSpecies);
  return await responseSpecies.json();
}

async function loadPokemon(loadeSteps) {
  if (!loadingMore) {
    loadingMore = true;
    for (let i = pokemonLoaded + 1; i <= pokemonLoaded + loadeSteps; i++) {
      if (!loadedPokemonIds.includes(i)) {
        loadedPokemonIds.push(i);
        currentPokemon = await fetchPokemonData(i);
        pokemonsArray.push(currentPokemon);
        currentPokemonSpecies = await fetchPokemonSpeciesData(i);
        pokemonsSpeciesArray.push(currentPokemonSpecies);
        renderPokedex(i);
      }
    }
    pokemonLoaded += loadeSteps;
    loadingMore = false;
  }
}

function renderPokedex(i) {
  let pokName = capitalizeFirstLetter(pokemonsArray[i].name);
  let pokId = appLeadingZeros(pokemonsArray[i].id);
  let type = pokemonsArray[i]["types"]["0"]["type"]["name"];
  let pokType1 = capitalizeFirstLetter(type);
  let bgColor = colorsForTypes[type];
  let labeType1Bg = makeColorBrighter(colorsForTypes[type], 50);
  let dropShdowColor = makeColorBrighter(colorsForTypes[type], 70);
  let pokImg =
    pokemonsArray[i]["sprites"]["other"]["official-artwork"]["front_default"];
  let pokedexCard = createPokedexCard(
    i,
    bgColor,
    pokName,
    pokType1,
    labeType1Bg,
    pokImg,
    pokId,
    dropShdowColor
  );
  document.getElementById("pokedex").innerHTML += pokedexCard;
  addTypeLabel2(i);
}

async function openPokemonInfo(i) {
  document.getElementById("pokemonInfoBgPerma").classList.remove("d-none");

  let pokName = capitalizeFirstLetter(pokemonsArray[i].name);
  let pokId = appLeadingZeros(pokemonsArray[i].id);
  let type = pokemonsArray[i]["types"]["0"]["type"]["name"];
  let pokType1 = capitalizeFirstLetter(type);
  let bgColor = colorsForTypes[type];
  let labeType1Bg = makeColorBrighter(colorsForTypes[type], 50);
  let pokImg =
    pokemonsArray[i]["sprites"]["other"]["official-artwork"]["front_default"];

  let height = (pokemonsArray[i]["height"] / 10).toFixed(1) + "m";
  let weight = (pokemonsArray[i]["weight"] / 10).toFixed(1) + "kg";

  let abilities = getAbilities(i);
  let description = getDescription(i);
  let pokemonInfo = generatePokemonInfoTemplate(
    i,
    bgColor,
    pokName,
    pokId,
    pokType1,
    labeType1Bg,
    pokImg,
    height,
    weight,
    abilities,
    description
  );
  document.getElementById("pokedex").innerHTML += pokemonInfo;

  addTypeLabel2Info(i);
  genderInfo(i);
}

function closePokemonInfo(i) {
  document.getElementById("pokemonInfoBgPerma").classList.add("d-none");
  document.getElementById(`pokemonInfoBg${i}`).remove();
}

function loadeChart(i) {
  let loadingSpinner = document.querySelector(".loadingSpinner");
  loadingSpinner.style.display = "block";

  let bgColor = colorsForTypes[pokemonsArray[i]["types"]["0"]["type"]["name"]];
  let labeType1Bg = makeColorBrighter(
    colorsForTypes[pokemonsArray[i]["types"]["0"]["type"]["name"]],
    50
  );
  let chartFillColor = changeOpacity(labeType1Bg, 0.2);

  let statsData = getStatsData(i);
  let maxStat = Math.max(...statsData);

  const ctx = document.getElementById("myChart");

  let maxChartValue = getMaxChartValue(maxStat);
  let stepSizeValue = getStepSizeValue(maxChartValue);

  setTimeout(function () {
    new Chart(
      ctx,
      createChartConfig(
        statsData,
        bgColor,
        chartFillColor,
        maxChartValue,
        stepSizeValue
      )
    );
    loadingSpinner.style.display = "none";
  }, 100);
}

async function loadeMoves(i) {
  let loadingSpinner = document.getElementById("loadingSpinner");
  let dataContainer = document.getElementById("movesContainer");

  try {
    loadingSpinner.style.display = "block";

    let moves = pokemonsArray[i]["moves"];
    let moveNames = getMoveNames(moves);

    let moveTypes = await getMoveTypes(moveNames);

    await new Promise((resolve) => setTimeout(resolve, 500));
    loadingSpinner.style.display = "none";
    dataContainer.style.display = "flex";

    displayMoves(moveNames, moveTypes, dataContainer);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function clearChart() {
  if (document.getElementById("myChart") !== null) {
    document.getElementById("myChart").remove();
  }
}

function infoNavHover(element) {
  element.classList.remove("infoNavNotAktiv");
}

function infoNavReset(element) {
  if (element.classList.contains("aktiv")) {
  } else {
    element.classList.add("infoNavNotAktiv");
  }
}

async function loadAllPokemon() {
  let totalPokemon = 1017; // Total number of Pokémon 1017
  while (pokemonLoaded < totalPokemon) {
    await loadPokemon(pokemonToLoad);
  }
}

function backToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function nextPokemon(i) {
  document.getElementById(`pokemonInfoBg${i}`).remove();
  if (i == pokemonsArray.length - 1) {
    openPokemonInfo(1);
  } else {
    openPokemonInfo(i + 1);
  }
}

function previousPokemon(i) {
  document.getElementById(`pokemonInfoBg${i}`).remove();
  if (i == 1) {
    openPokemonInfo(pokemonsArray.length - 1);
  } else {
    openPokemonInfo(i - 1);
  }
}

function searchPokemon() {
  let searchPokemon = document.getElementById("searchInput").value;
  let cards = document.querySelectorAll(".pokedexCard");

  cards.forEach((card) => {
    let pokemon = card.querySelector("h1"); // Find the h1 element within the card
    if (pokemon) {
      let pokemonLowerCase = pokemon.textContent.toLowerCase(); // Convert card name to lowercase
      let searchPokemonLowerCase = searchPokemon.toLowerCase(); // Convert search value to lowercase
      if (
        searchPokemonLowerCase == "" ||
        pokemonLowerCase.includes(searchPokemonLowerCase)
      ) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    }
  });
}

function searchPokemon() {
  let searchPokemon = document.getElementById("searchInput").value;
  let cards = document.querySelectorAll(".pokedexCard");
  cards.forEach((card) => {
    let pokemon = card.querySelector("h1");
    if (pokemon) {
      let pokemonLowerCase = pokemon.textContent.toLowerCase();
      let searchPokemonLowerCase = searchPokemon.toLowerCase();
      if (
        searchPokemonLowerCase == "" ||
        pokemonLowerCase.includes(searchPokemonLowerCase)
      ) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    }
  });
}

function searchPokemonID() {
  let searchPokemonID = document.getElementById("searchInputID").value;
  let cards = document.querySelectorAll(".pokedexCard");

  cards.forEach((card) => {
    let idString = card.querySelector(".pokemonID");
    if (idString) {
      let id = idString.textContent;
      if (searchPokemonID == "" || id.includes(searchPokemonID)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    }
  });
}

let searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  document.getElementById("searchInputID").value = "";
  searchPokemon();
});

let searchInputID = document.getElementById("searchInputID");
searchInputID.addEventListener("input", function () {
  document.getElementById("searchInput").value = "";
  searchPokemonID();
});
