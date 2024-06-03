const apiUrl = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";

const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const types = document.getElementById("types");
const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const specialAttack = document.getElementById("special-attack");
const specialDefense = document.getElementById("special-defense");
const speed = document.getElementById("speed");
const spriteContainer = document.getElementById("sprite-container")

let pokemonList = [];

const fetchData = async () => {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const {results} = data;
    return results;
  } catch (err) {
    console.log(err);
  }
};

const initialize = async () => {
  pokemonList = await fetchData();
};

initialize();

const showResults = (data) => {
  pokemonName.textContent = data["name"];
  pokemonId.textContent = `#${data["id"]}`;
  weight.textContent = `Weight: ${data["weight"]}`;
  height.textContent = `Height: ${data["height"]}`;
  spriteContainer.innerHTML = `
      <img id="sprite" src="${data["sprites"]["front_default"]}" alt="${data.name} front default sprite">`;

  const typesObj = data["types"];
  types.innerHTML = "";
  typesObj.forEach((type)=>{
    types.innerHTML+=`<span class="type ${type["type"]["name"]}">${type["type"]["name"]}</span>`;
  })
  const statistics = {};
  data["stats"].forEach((stat)=>{
    statistics[stat["stat"]["name"]] = stat["base_stat"];
  })
  console.log(statistics);
  hp.textContent = statistics["hp"];
  attack.textContent = statistics["attack"];
  defense.textContent = statistics["defense"];
  specialAttack.textContent = statistics["special-attack"];
  specialDefense.textContent = statistics["special-defense"];
  speed.textContent = statistics["speed"];
};

const fetchPokemon = async (pokeUrl) => {
  try {
    const res = await fetch(pokeUrl);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const searchPokemon = async (nameOrId) => {
  let poke = pokemonList.find((p) => p["id"]==nameOrId || p["name"] === nameOrId);
  if (!poke) {
    alert("Pokémon not found");
    return;
  } else {
    let pokeUrl = `${apiUrl}/${poke["id"]}`;
    let pokeData = await fetchPokemon(pokeUrl);
    showResults(pokeData);
  }
};

const prepareInput = (inputValue) => {
  if (isNaN(inputValue)) {
    let name = inputValue;
    let matched = name.match(/[♀♂]/) ? name.match(/[♀♂]/)[0] : "";
    name = name.replace(/[^a-zA-Z- ]/g, "");
    if (matched) {
      name += (matched === "♀") ? "-f" : "-m";
    }
    name = name.replace(" ","-").toLowerCase();
    console.log(name)
    return name;
  }
  return inputValue;
};



searchBtn.addEventListener("click", () => {
  searchPokemon(prepareInput(input.value)); 
});
