const MAX_POKEMON = 102;
const searchList = document.getElementById("searchList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clear");
const searchNotFound = document.getElementById("search-not-found");
const who = document.getElementById("who-container");
const footerBottom = document.getElementsByClassName("footer");
const myModal = new bootstrap.Modal(document.getElementById("staticBackdrop"));

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
    // console.log(allPokemons);
  });
// function fetchAPI() {
//   fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data.types[0].type.name);
//     });
// }

// fetchAPI();

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
      (res) => (detail = res.json())
    );
    return pokemon;
  } catch (error) {
    console.error("Failed to fetch Pokemon data before redirect");
  }
}

function displayPokemons(pokemon) {
  searchList.innerHTML = "";

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    const pokemonnm = fetchPokemonDataBeforeRedirect(pokemonID);
    pokemonnm.then((res) => {
      const detail = res;
      const abilities = detail.abilities.map((x) => x.ability.name);
      //   console.warn(abilities);
      listItem.className = "list-item col-sm-6 col-md-4 col-lg-3 my-5";
      listItem.innerHTML = `
                  <div class="card">
                    <img
                      id="pokemonImage"
                      class="pokemonImage card-img-top pt-2 px-3"
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
                      alt="${detail.name}"
                    />
                    <h4 class="pokemonName card-title text-center">${capitalizeFirstLetter(
                      detail.name
                    )}</h4>
                    <div class="card-body content">
                      <p class="card-text"><span>Element type: </span>${
                        detail.types[0].type.name
                      }</p>
                      <p class="card-text"><span>Ability: </span>${capitalizeFirstLetter(
                        abilities.join(", ")
                      )}</p>
                      <p class="card-text"><span>Height: </span>${
                        detail.height
                      }ft</p>
                      <p class="card-text"><span>Weight: </span>${
                        detail.weight
                      }kg</p>
                    </div>
                  </div>
              `;
    });

    // listItem.addEventListener("click", async () => {
    //   const success = await fetchPokemonDataBeforeRedirect(pokemonID);
    //   if (success) {
    //     window.location.href = `./detail.html?id=${pokemonID}`;
    //   }
    // });

    searchList.appendChild(listItem);
  });
}

searchBtn.addEventListener("click", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (searchInput.value) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    return;
  }

  displayPokemons(filteredPokemons);

  if (filteredPokemons.length === 0) {
    searchNotFound.style.display = "block";
    footerBottom[0].classList.add("fixed-bottom");
  } else {
    searchNotFound.style.display = "none";
    footerBottom[0].classList.remove("fixed-bottom");
  }
}
setTimeout(() => {
  myModal.show();
}, 3000);

clearBtn.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
  displayPokemons(allPokemons);
  searchNotFound.style.display = "none";
  footerBottom[0].classList.remove("fixed-bottom");
}
