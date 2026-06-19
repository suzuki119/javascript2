import { inView, animate, stagger, scroll } from "motion";


inView(".fade-target h2", (element) => {
  animate(element, { opacity: [0, 1], y: [40, 0] }, { duration: 1 });
});



const cardAnimate = function (element) {
  animate(element, { opacity: [0, 1], y: [40, 0], rotateY: [0, 360] }, { duration: 1, delay: stagger(0.5) });
};

inView('.cards', () => {
  cardAnimate('.card');
});



const showWithExit = function (element) {
  animate(element, { opacity: [0, 1], y: [80, 0] }, { duration: 0.6 });

    animate(element, { background: ["#ffeaea", "#960505"], color: ["#000", "#fff"],  filter: ["blur(10px)", "blur(0px)"] }, { duration: 2.0 });

  // MotionのinView()の仕様：コールバック関数の中で return した関数は、要素が画面外に出たときに実行される
  return () => {
    animate(element, { opacity: 0, y: -80, background: ["#fff", "#f5f5f5"], color: ["#fff", "#000"] }, { duration: 0.4 });
  };
};

inView('#voteList', showWithExit);



// 監視したい要素を取得（fade-target 内の h2 を監視する）
const target = document.querySelector("#voteList");

// 要素の表示状態が変わったときに呼ばれるコールバック関数
function handleIntersect(entries) {
  // entries は監視中の要素の状態を配列で持っている
  entries.forEach((entry) => {
    // 画面内に入ったかどうかを判定
    if (entry.isIntersecting) {
      // クラスを付与して、CSS側でアニメーションを発火させる
      entry.target.classList.add("is-visible");
      // 一度表示したら監視を解除（再度演出させたい場合は外す）
      observer.unobserve(entry.target);
    }
  });
}

// 追記：.hero のスクロール量に合わせて hero-title を上にフェードアウト
scroll(
  animate(".hero-title", { opacity: [1, 0], y: [0, -200] }),
  {
    target: document.querySelector(".hero"),
    offset: ["start 0.3", "start 0"], // heroの上端が画面の30%〜0%に来る間でアニメーション
  },
);


// IntersectionObserverを生成し、コールバック関数を渡す
const observer = new IntersectionObserver(handleIntersect);
// 監視対象を登録（複数登録したいときは observe() を繰り返し呼ぶ）
observer.observe(target);

// 追記：.parallax-section のスクロールに合わせて背景画像を上に動かす
scroll(
  animate(".parallax-bg", { y: [0, -500] }),
  { target: document.querySelector(".parallax-section") },
);