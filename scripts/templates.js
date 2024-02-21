function createPokedexCard(
  i,
  bgColor,
  pokName,
  pokType1,
  labeType1Bg,
  pokImg,
  pokId,
  dropShdowColor
) {
  return /*html*/ `
  <div class="pokedexCard phases40" style="background-color: ${bgColor};" onclick="openPokemonInfo(${i})">
  <img class="pokeballBg" src="./images/pokeball_bg.png" alt="Pokeball Background Image">
  <div class="pokedexCardContent" >
  <h1>${pokName}</h1>

      <div class="typeContainer" id="typeContainer${i}">
          <div style="background-color: ${labeType1Bg}" class="typeLable">${pokType1}</div>
      </div>
      <div class="imgWithId">
      <img id="pokeImg${i}"  onmouseover="this.style.filter = 'drop-shadow(0 0 16px ${dropShdowColor})'"
      onmouseout="this.style.filter = ''"
src="${pokImg}" alt="Image of ${pokName}">
      <div class="pokemonID">${pokId}</div>
      </div>
      </div>
  </div>

`;
}

function addTypeLabel2(i) {
  if (pokemonsArray[i]["types"]["1"]) {
    let pokType2 = capitalizeFirstLetter(
      pokemonsArray[i]["types"]["1"]["type"]["name"]
    );
    let labeType2Bg = makeColorBrighter(
      colorsForTypes[pokemonsArray[i]["types"]["1"]["type"]["name"]],
      30
    );
    document.getElementById(`typeContainer${i}`).innerHTML += /*html*/ `
        <div style="background-color: ${labeType2Bg}" class="typeLable">${pokType2}</div>`;
  }
}

function generatePokemonInfoTemplate(
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
) {
  return /*html*/ `
      <div onclick="closePokemonInfo(${i})" id="pokemonInfoBg${i}" class="pokemonInfoBg">
        <div onclick="event.stopPropagation()" class="control">
          <span id="previousPokemon" onclick="previousPokemon(${i})" class="material-symbols-outlined controlIcons">arrow_circle_left</span>
          <span id="nextPokemon" onclick="nextPokemon(${i})" class="material-symbols-outlined controlIcons">arrow_circle_right</span>
        </div>
        <div onclick="event.stopPropagation()" class="pokemonInfoCard phases40" style="background-color: ${bgColor};">
          <img class="pokeballBgInfo" src="./images/pokeball_bg.png" alt="Pokeball Background Image">
          <div class="pokemonInfoCardTop">
            <span onclick="closePokemonInfo(${i})" class="material-symbols-outlined closeIcon">close</span>
            <div class="infoNameWithId">
              <h1>${pokName}</h1>
              <div>${pokId}</div>
            </div>
            <div class="typeContainerInfo" id="typeContainerInfo${i}">
              <div style="background-color: ${labeType1Bg}" class="typeLable">${pokType1}</div>
            </div>
            <img class="pokemonInfoImg" src="${pokImg}" alt="Image of ${pokName}">
          </div>
          <div class="pokemonInfoCardBottom phases40">
            <div style="border-bottom: 1px solid ${labeType1Bg};" class="infoNav">
              <span id="infoNavAbout" onclick="openInfoAbout()" class="aktiv" onmouseover="infoNavHover(this)" onmouseout="infoNavReset(this)" style="text-decoration: underline 3px ${bgColor};" class="">About</span>
              <span id="infoNavStats" onclick="openInfoStats(${i})" onmouseover="infoNavHover(this)" onmouseout="infoNavReset(this)" style="text-decoration: underline 3px ${bgColor};" class="infoNavNotAktiv">Stats</span>
              <span id="infoNavMoves" onclick="openInfoMoves(${i})" onmouseover="infoNavHover(this)" onmouseout="infoNavReset(this)" style="text-decoration: underline 3px ${bgColor};" class="infoNavNotAktiv">Moves</span>
            </div>
            <div id="infoAbout" class="about">
              <div class="aboutSections"> <span class="aboutMargins"><b>Height</b></span><span>${height}</span></div>
              <div class="aboutSections"> <span class="aboutMargins"><b>Weight</b></span><span>${weight}</span></div>
              <div class="aboutSections"> <span class="aboutMargins"><b>Abilities</b></span><span>${abilities}</span></div>
              <div class="aboutSections"> <span class="aboutMargins"><b>Gender</b></span><span class="genderRate" id="genderRate${i}"></span></div>
              <span><b>Description</b></span><span class="aboutDescription">${description}</span>
            </div>
            <div id="infoStats" class="d-none">
              <div class="loadingSpinner">
                <img src="./images/pokeball.png" alt="Rotating Pokeball">
              </div>
              <canvas id="myChart"></canvas>
            </div>
            <div id="infoMoves" class="d-none">
              <div id="loadingSpinner" class="loadingSpinner">
                <img src="./images/pokeball.png" alt="Rotating Pokeball">
              </div>
              <div id="movesContainer" style="display: none;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
}

function addTypeLabel2Info(i) {
  if (pokemonsArray[i]["types"]["1"]) {
    let pokType2 = capitalizeFirstLetter(
      pokemonsArray[i]["types"]["1"]["type"]["name"]
    );
    let labeType2Bg = makeColorBrighter(
      colorsForTypes[pokemonsArray[i]["types"]["1"]["type"]["name"]],
      30
    );
    document.getElementById(`typeContainerInfo${i}`).innerHTML += /*html*/ `
        <div style="background-color: ${labeType2Bg}" class="typeLable">${pokType2}</div>`;
  }
}

function createChartConfig(
  statsData,
  bgColor,
  chartFillColor,
  maxChartValue,
  stepSizeValue
) {
  return {
    type: "radar",
    data: {
      labels: ["HP", "Atk.", "Def.", "Sp.Atk.", "Sp.Def.", "Speed"],
      datasets: [
        {
          data: statsData,
          fill: true,
          borderWidth: 1,
          borderColor: bgColor,
          backgroundColor: chartFillColor,
        },
      ],
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: maxChartValue,
          beginAtZero: true,
          ticks: {
            stepSize: stepSizeValue,
            callback: (value) =>
              value === maxChartValue ? `${maxChartValue}` : "",
          },
          pointLabels: {
            font: {
              size: 14,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };
}

function displayMoves(moveNames, moveTypes, dataContainer) {
  dataContainer.innerHTML = "";
  for (let i = 0; i < moveNames.length; i++) {
    let moveName = moveNames[i];
    let moveTypeColor = colorsForTypes[moveTypes[i]];
    dataContainer.innerHTML += /*html*/ `
        <div class="moves" style="background-color: ${moveTypeColor}">
          ${capitalizeFirstLetter(moveName)}
        </div>
      `;
  }
}
