// main.js
import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
import { vote, getRates,resetCandidates } from './candidates.js';

// 全カードのバーを得票率に合わせてアニメーションさせる
const animateBars = () => {
  getRates().forEach(({ id, rate }) => {
    const bar = document.querySelector(`[data-id="${id}"] .bar`);
    animate(bar, { width: `${rate}%` }, { duration: 0.4, easing: 'ease-out' });
  });
};

let slot = [0,0,0];
const gamble = document.querySelector(".gamble");

// 背景色を変える関数
const colors = ['#ffffff', '#ffe6f0', '#fff0e6', '#e6f0ff', '#f0ffe6'];
let colorIndex = 0;

const changeBackgroundColor = () => {
  const nextColor = colors[colorIndex % colors.length];
  animate(document.body, { backgroundColor: nextColor }, { duration: 0.8, easing: 'ease-in-out' });
  colorIndex++;
};

const slotTime = () => {
    slot.forEach((number, index) => {
        slot[index] = Math.floor(Math.random()*10);
        console.log(number,slot);
    });
    if (slot[0] === slot[1] && slot[1] === slot[2]) {
    } else {
    }
}


document.querySelectorAll('.card').forEach((card) => {
  const id = Number(card.dataset.id);
    const btn = card.querySelector('.vote-btn');
    const image = card.querySelector('.candidate-image');

  btn.addEventListener('click', () => {
      vote(id);
      slotTime();
      changeBackgroundColor();
      animate(btn, { scale: [1, 1.3, 1], rotateX: [0, 180, 0] }, { duration: 0.3 });
      animate(image, { scale: [1, 1.5, 1], rotateZ: [0, 360, 0] }, { duration: 0.3 });
    animateBars();
  });
});

const resetButton = document.querySelector("#resetBtn");
resetButton.addEventListener("click", () => {
  if (!confirm("票数をリセットしますか？")) return;
  resetCandidates();
  animateBars();          // ← リセット後にバーも初期状態へ戻す
});

// ⬇ 末尾に追加：起動時に、読み込んだ得票率でバーを描画する
animateBars();
