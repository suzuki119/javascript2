import { runAcross, popImage } from "./animations.js";
const card = document.querySelector(".card");
const errorEl = document.querySelector(".error");
const loader = document.querySelector(".loader");

const STAT_NAMES = {
  "hp": "HP",
  "attack": "こうげき",
  "defense": "ぼうぎょ",
  "special-attack": "とくこう",
  "special-defense": "とくぼう",
  "speed": "すばやさ",
};

const MAX_STAT = 255; // 種族値の理論上の最大値（バーの基準）

// 画面の端から端まで走るポケモンの画像（最初は非表示）
const runner = document.createElement("img");
runner.className = "runner";
runner.hidden = true;
document.body.appendChild(runner);
let running;

export const renderPokemon = (data) => {

  const sprites = [
    { name: "通常色", url: data.sprites.front_default },
    { name: "色違い", url: data.sprites.front_shiny },
  ];

  const statsHtml = data.stats.map((s) => {
    const label = STAT_NAMES[s.stat.name] ?? s.stat.name;
    const percent = (s.base_stat / MAX_STAT) * 100;
    return `
      <div class="stat-row">
        <span class="stat-name">${label}</span>
        <span class="stat-value">${s.base_stat}</span>
        <span class="stat-bar"><span class="stat-bar-fill" style="width:${percent}%"></span></span>
      </div>
    `;
  }).join('');

  card.innerHTML = `
    <h2>${data.name}</h2>

    <div class="sprite-buttons">
      ${sprites.map((sprite, i) => `<button class="sprite-btn" data-index="${i}">${sprite.name}</button>`).join('')}
    </div>

    <img id="pokemonImage" src="${sprites[0].url}" alt="${data.name}">

    <p>タイプ: ${data.types.map((type) => type.type.name).join(", ")}</p>
    <p>高さ: ${data.height}</p>
    <p>重さ: ${data.weight}</p>

    <h3 class="stats-title">種族値</h3>
    <div class="stats">${statsHtml}</div>
  `;

  card.hidden = false;
  errorEl.hidden = true;

  // 検索したポケモンが画面の右外 → 左外へ走る（前のループは止める）
  runner.src = data.sprites.front_default;
  runner.hidden = false;
  running?.stop();
  running = runAcross(runner);

  const pokemonImage = document.querySelector("#pokemonImage");
  // 画像そのものをクリックしたときのアニメーション（ポンッと弾む）
  pokemonImage.addEventListener("click", () => popImage(pokemonImage));

  document.querySelectorAll(".sprite-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      pokemonImage.src = sprites[e.target.dataset.index].url;
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
