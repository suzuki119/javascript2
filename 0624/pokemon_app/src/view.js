import { popImage } from "./animations.js";
import { NATURES, calcStat } from "./stats.js";
const card = document.querySelector(".card");
const errorEl = document.querySelector(".error");
const loader = document.querySelector(".loader");
const historyEl = document.querySelector("#history");

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

export const renderPokemon = (data, jpName, description) => {

  const displayName = jpName ?? data.name;

  // 第5世代（ブラック・ホワイト）のアニメーションスプライト。無ければ静止画を使う
  const animated =
    data.sprites.versions?.["generation-v"]?.["black-white"]?.animated;

  const sprites = [
    { name: "通常色", url: animated?.front_default ?? data.sprites.front_default },
    { name: "色違い", url: animated?.front_shiny ?? data.sprites.front_shiny },
  ];

  card.innerHTML = `
    <h2>${displayName} <small>(${data.name})</small></h2>
    <img src="${data.sprites.front_default}" alt="${displayName}">
  `;
  card.hidden = false;
  errorEl.hidden = true;

  const statsHtml = data.stats.map((s) => {
    const label = STAT_NAMES[s.stat.name] ?? s.stat.name;
    return `
      <div class="stat-row" data-stat="${s.stat.name}" data-base="${s.base_stat}">
        <span class="stat-name">${label}<span class="nature-mark"></span></span>
        <span class="stat-value">${s.base_stat}</span>
        <span class="real-value">-</span>
        <input class="iv-input" type="number" min="0" max="31" value="31" aria-label="${label}の個体値">
        <div class="ev-cell">
          <input class="ev-range" type="range" min="0" max="252" step="4" value="0" aria-label="${label}の努力値スライダー">
          <input class="ev-input" type="number" min="0" max="252" value="0" aria-label="${label}の努力値">
        </div>
      </div>
    `;
  }).join('');

  // 実数値計算の操作パネル（レベル・性格・努力値合計）
  const calcControlsHtml = `
    <div class="calc-controls">
      <label>Lv
        <input id="levelInput" type="number" min="1" max="100" value="50">
      </label>
      <div class="lv-presets">
        <button type="button" class="lv-btn" data-lv="50">50</button>
        <button type="button" class="lv-btn" data-lv="100">100</button>
      </div>
      <label class="nature-label">性格
        <select id="natureSelect">
          ${Object.keys(NATURES).map((n) => `<option value="${n}">${n}</option>`).join('')}
        </select>
      </label>
    </div>
    <div class="ev-summary">
      <span>努力値 <b id="evTotal">0</b> / 510</span>
      <span class="ev-bar"><span class="ev-bar-fill" id="evBar"></span></span>
      <button type="button" id="evReset" class="ev-reset">リセット</button>
    </div>
  `;

  card.innerHTML = `
  <h2>${displayName} <small>(${data.name})</small></h2>
    <h2>${data.name}</h2>

    <div class="sprite-buttons">
      ${sprites.map((sprite, i) => `<button class="sprite-btn" data-index="${i}">${sprite.name}</button>`).join('')}
    </div>

    <img id="pokemonImage" src="${sprites[0].url}" alt="${data.name}">

    <p>タイプ: ${data.types.map((type) => type.type.name).join(", ")}</p>
    <p>高さ: ${data.height}</p>
    <p>重さ: ${data.weight}</p>

        ${description ? `<p class="description">${description}</p>` : ""}


    <h3 class="stats-title">種族値・実数値</h3>
    ${calcControlsHtml}
    <div class="stats">
      <div class="stat-row stat-head">
        <span class="stat-name">ステータス</span>
        <span class="stat-value">種族</span>
        <span class="real-value">実数</span>
        <span class="stat-col-label">個体</span>
        <span class="stat-col-label">努力値</span>
      </div>
      ${statsHtml}
    </div>

  `;

  card.hidden = false;
  errorEl.hidden = true;

  // 実数値の再計算：レベル・性格・各ステータスの個体値/努力値から計算して表示を更新
  const clamp = (n, min, max) => Math.min(max, Math.max(min, Number(n) || 0));
  const levelInput = document.querySelector("#levelInput");
  const natureSelect = document.querySelector("#natureSelect");
  const evTotalEl = document.querySelector("#evTotal");
  const evBar = document.querySelector("#evBar");
  const rows = document.querySelectorAll(".stats .stat-row:not(.stat-head)");

  const recompute = () => {
    const level = clamp(levelInput.value, 1, 100);
    const nature = NATURES[natureSelect.value];
    const [plus, minus] = nature;
    let evSum = 0;
    rows.forEach((row) => {
      const statName = row.dataset.stat;
      const base = Number(row.dataset.base);
      const iv = clamp(row.querySelector(".iv-input").value, 0, 31);
      const ev = clamp(row.querySelector(".ev-input").value, 0, 252);
      evSum += ev;
      row.querySelector(".real-value").textContent = calcStat(statName, base, iv, ev, level, nature);

      // 性格補正を ▲（上がる）/▼（下がる）で色分け表示
      const mark = row.querySelector(".nature-mark");
      const isUp = plus === statName;
      const isDown = minus === statName;
      mark.textContent = isUp ? "▲" : isDown ? "▼" : "";
      row.classList.toggle("nature-up", isUp);
      row.classList.toggle("nature-down", isDown);
    });
    evTotalEl.textContent = evSum;
    // 努力値の合計上限（510）を割合バーで表示。超えたら警告色
    const over = evSum > 510;
    evBar.style.width = `${Math.min(100, (evSum / 510) * 100)}%`;
    evBar.classList.toggle("over", over);
    evTotalEl.classList.toggle("over", over);
  };

  // スライダーと数値入力を相互に同期させる
  rows.forEach((row) => {
    const range = row.querySelector(".ev-range");
    const num = row.querySelector(".ev-input");
    range.addEventListener("input", () => { num.value = range.value; recompute(); });
    num.addEventListener("input", () => { range.value = clamp(num.value, 0, 252); recompute(); });
  });

  card.querySelectorAll("#levelInput, #natureSelect, .iv-input")
    .forEach((el) => el.addEventListener("input", recompute));

  // レベルのクイックボタン（50 / 100）
  card.querySelectorAll(".lv-btn").forEach((btn) => {
    btn.addEventListener("click", () => { levelInput.value = btn.dataset.lv; recompute(); });
  });

  // 努力値を一括リセット
  card.querySelector("#evReset").addEventListener("click", () => {
    rows.forEach((row) => {
      row.querySelector(".ev-range").value = 0;
      row.querySelector(".ev-input").value = 0;
    });
    recompute();
  });

  recompute();

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


// 検索履歴を一覧表示する。各ボタンを押すと onSelect(id) が呼ばれる
export const renderHistory = (list, onSelect) => {
  if (!historyEl) return;
  historyEl.innerHTML = list
    .map((e) => `<button class="history-item" data-id="${e.id}">${e.label}</button>`)
    .join("");
  historyEl.querySelectorAll(".history-item").forEach((btn) => {
    btn.addEventListener("click", () => onSelect(btn.dataset.id));
  });
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
