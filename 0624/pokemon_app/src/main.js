import "./style.css";
import { getPokemon, getSpecies, loadJpDict } from "./api.js";
import { renderPokemon, showError, setLoading, renderHistory } from "./view.js";
import { spinSpinner } from "./animations.js";
import { getHistory, addHistory } from "./history.js";

spinSpinner(document.querySelector(".spinner"));

// 履歴アイテムをクリックしたら、そのIDで再検索する
const showHistory = () => {
  renderHistory(getHistory(), (id) => {
    document.querySelector("#keyword").value = id;
    load(String(id));
  });
};

let controller;

// 👇 引数名を name → input に
const load = async (input) => {
  if (controller) controller.abort();          // ← 変更なし
  controller = new AbortController();          // ← 変更なし
  setLoading(true);                            // ← 既存のローディング開始処理

  try {
    // 👇 ここから try の中身を置き換え
    // 1. 日本語入力なら辞書でIDに変換、それ以外はそのまま使う
    const dict = await loadJpDict();
    const query = dict[input] ?? input.toLowerCase();

    // 2. ★ 2つのAPIを並行取得
    const [pokemon, species] = await Promise.all([
      getPokemon(query, controller.signal),
      getSpecies(query, controller.signal),
    ]);

    // 3. species から日本語名と解説文を取り出して renderPokemon に渡す
    const jpName = species.names.find((n) => n.language.name === "ja")?.name;
    const jpFlavor = species.flavor_text_entries.find(
      (e) => e.language.name === "ja" || e.language.name === "ja-Hrkt"
    )?.flavor_text;
    // 改行・改ページなどの制御文字を取り除く
    const description = jpFlavor?.replace(/[\f\n\r]/g, "");
    renderPokemon(pokemon, jpName, description);

    // 4. 検索に成功したら履歴に保存して再描画
    addHistory({ id: pokemon.id, label: jpName ?? pokemon.name });
    showHistory();
    // 👆 ここまでが try の中身（catch / finally は既存のままでOK）
  } catch (err) {
    // ← 既存の catch をそのまま使う
    if (err.name === "AbortError") return;
    console.error(err);
    showError("見つかりませんでした");
  } finally {
    // ← 既存の finally をそのまま使う
    setLoading(false);
  }
};


document.querySelector("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  load(document.querySelector("#keyword").value.trim().toLowerCase());
});

// 全国図鑑のポケモン数（第9世代まで）
const TOTAL_POKEMON = 1025;

document.querySelector("#randomBtn").addEventListener("click", () => {
  const id = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
  document.querySelector("#keyword").value = id;
  load(String(id));
});

// ページ読み込み時に保存済みの履歴を表示
showHistory();
