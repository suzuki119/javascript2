
// ⬇ ファイル冒頭に追加：エンドポイントの共通部分を定数に
const POKEAPI = "https://pokeapi.co/api/v2";

// ⬇ 既存の getPokemon を、定数を使う形に書き換え（引数名も idOrName に）
export const getPokemon = async (idOrName, signal) => {
  const res = await fetch(`${POKEAPI}/pokemon/${idOrName}`, { signal });
  if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
  return res.json();
};

// ⬇ 追加：speciesエンドポイント（多言語名が入ったレスポンス）
export const getSpecies = async (idOrName, signal) => {
  const res = await fetch(`${POKEAPI}/pokemon-species/${idOrName}`, { signal });
  if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
  return res.json();
};

// ⬇ 追加：日本語辞書JSONを1度だけ読み込んでキャッシュする
let dictCache = null;
export const loadJpDict = async () => {
  if (dictCache) return dictCache;
  const res = await fetch("/jp-pokemon.json");
  dictCache = await res.json();
  return dictCache;
};
