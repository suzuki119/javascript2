import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';

const box = document.querySelector('#box');

//１番目はアニメーションさせる要素２番目はアニメーション内容、３番目はオプション
// 操作フィードバック：短くキビキビと
animate(box, { scale: [1, 1.3, 1] }, { duration: 0.2, ease: 'ease-out' });

// 結果の変化：少し余韻を残す
animate(box, { width: ['0%', '60%'] }, { duration: 0.4, ease: 'ease-out' });

// 状態変化：ゆっくりフェード
animate(box, { opacity: [1, 0.4] }, { duration: 0.3 });