import { animate } from "motion";

// スピナーをくるくる回し続ける
export const spinSpinner = (el) =>
  animate(el, { rotate: [0, 360] }, { duration: 1, repeat: Infinity, ease: "linear" });

// 画面の右外 → 左外へポケモンを走らせる（ループ）
export const runAcross = (el) =>
  animate(el, { x: [window.innerWidth, -120] }, { duration: 4, repeat: Infinity, ease: "linear" });

// 画像クリック時のランダムな弾みアニメーション（3パターン）
export const popImage = (el) => {
  const variant = Math.floor(Math.random() * 3);
  if (variant === 0) {
    return animate(el, { scale: [1, 1.5, 1] }, { duration: 0.3, ease: "easeOut" });
  }
  if (variant === 1) {
    return animate(el, { rotate: [0, 20, -20, 0] }, { duration: 0.3, ease: "easeOut" });
  }
  return animate(
    el,
    { scale: [0.8, 1.5, 1], rotate: [0, 100, 200, 360], translateY: [0, 5, -50, -55, 0] },
    { duration: 0.3, ease: "easeOut" }
  );
};
