const card = document.querySelector(".card");
const errorEl = document.querySelector(".error");
const loader = document.querySelector(".loader");

export const renderPokemon = (data) => {

  const sprites = [
    { name: "通常", url: data.sprites.front_default },
    { name: "色違い", url: data.sprites.front_shiny },
  ].filter(s => s.url);

  card.innerHTML = `
    <h2>${data.name}</h2>
    <div class="sprite-buttons">
      ${sprites.map((s, i) => `<button class="sprite-btn" data-index="${i}">${s.name}</button>`).join('')}
    </div>
    <img id="pokemonImage" src="${sprites[0].url}" alt="${data.name}">
    <p>タイプ: ${data.types.map((type) => type.type.name).join(", ")}</p>
    <p>高さ: ${data.height}</p>
    <p>重さ: ${data.weight}</p>
  `;

  card.hidden = false;
  errorEl.hidden = true;


  document.querySelectorAll(".sprite-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelector("#pokemonImage").src = sprites[e.target.dataset.index].url;
    });
  });

  console.log(data);
};

export const showError = function (message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
  card.hidden = true;
};

export function setLoading(isLoading) {
  loader.hidden = !isLoading;
  if (isLoading) {
    card.hidden = true;
    errorEl.hidden = true;
  }
}
