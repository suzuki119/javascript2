// localStorage を使った検索履歴の保存・取得

const KEY = "pokemon_history"; // 保存先のキー
const MAX = 10;                // 履歴に残す最大件数

// 履歴を取り出す（壊れていたら空配列）
export const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};

// 履歴を追加（同じIDは一度消して先頭に入れ直す＝重複なし・最新が先頭）
export const addHistory = (entry) => {
  const list = getHistory().filter((e) => e.id !== entry.id);
  list.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
};

// 履歴を全消去
export const clearHistory = () => localStorage.removeItem(KEY);
