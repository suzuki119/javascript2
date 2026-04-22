import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';

const box = document.querySelector('#box');

//１番目はアニメーションさせる要素２番目はアニメーション内容、３番目はオプション
animate(box,

    { opacity: [0, 1] },

    { duration: 3 },

    {scale:[0,1.5,0]},

    {backgroundcolor:'#fff'}


);