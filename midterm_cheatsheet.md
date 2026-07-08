# Vanilla JS 中間テスト チートシート

> 持ち込み用早見表。構文＋「何が返るか/なぜ」＋**実例と出力値**をセットで。
> `// → xxx` は実際に返る値・表示される値。

---

## 1. 基本構文（if / for / forEach）

```js
// if
const x = 5;
if (x > 0) console.log("正");      // → 正
else if (x === 0) console.log("0");
else console.log("負");

// for
const arr = ["a", "b", "c"];
for (let i = 0; i < arr.length; i++) {
  console.log(i, arr[i]);
}
// → 0 "a"
// → 1 "b"
// → 2 "c"

// forEach（戻り値なし=undefined。ループ専用、値を作らない）
const result = arr.forEach((item, index) => console.log(index, item));
console.log(result); // → undefined  ★戻り値は必ずundefined
```

- `===` は型も比較：`1 === "1"` → **false** / `1 == "1"` → **true**（`==`は型変換するので注意）
- `forEach` は **新しい配列を作らない**。変換したいなら `map`

---

## 2. ESモジュール（import / export）

```js
// utils.js -----------------------------
export const add = (a, b) => a + b;        // 名前付き（複数OK）
export function sub(a, b) { return a - b; }
export default function main() { return "main"; } // default（1ファイル1つ）

// main.js -----------------------------
import main, { add, sub } from "./utils.js";
//     ↑default   ↑名前付き（{}で囲む・名前一致が必須）

console.log(add(2, 3)); // → 5
console.log(sub(5, 1)); // → 4
console.log(main());    // → "main"
```

| | 書き方 | import |
|---|---|---|
| 名前付き | `export const x` | `import { x }` （名前一致・複数可） |
| default | `export default x` | `import 好きな名前` （`{}`なし・1つ） |

- 名前付きは `as` で別名可：`import { add as plus }` → `plus(2,3)` → **5**
- ファイルは役割ごとに分割するのが目的

---

## 3. 配列メソッド（戻り値の違いが最重要）

```js
const nums = [1, 2, 3, 4];

nums.map(n => n * 2);          // → [2, 4, 6, 8]   同じ長さの新配列
nums.filter(n => n % 2 === 0); // → [2, 4]         条件trueだけの新配列
nums.find(n => n > 2);         // → 3              最初の1要素
nums.find(n => n > 99);        // → undefined      見つからない時
nums.reduce((acc, n) => acc + n, 0); // → 10       単一値に畳み込む

// 元配列は変わらない（非破壊）
console.log(nums); // → [1, 2, 3, 4]
```

| メソッド | 戻り値 | 例 → 出力 |
|---|---|---|
| `map` | **配列**（同じ長さ） | `[1,2,3].map(n=>n*10)` → `[10,20,30]` |
| `filter` | **配列**（0個以上） | `[1,2,3].filter(n=>n>1)` → `[2,3]` |
| `find` | **要素1つ** / `undefined` | `[1,2,3].find(n=>n>1)` → `2` |
| `reduce` | **単一値** | `[1,2,3].reduce((a,n)=>a+n,0)` → `6` |
| `forEach` | **undefined** | — |

- `map` vs `forEach`：戻り値が要るなら `map`、要らないなら `forEach`
- `find` vs `filter`：1件なら `find`、複数なら `filter`
- `reduce(コールバック, 初期値)` の **初期値を忘れない**

```js
// reduce 応用：オブジェクトに集計
const fruits = ["apple", "banana", "apple"];
fruits.reduce((acc, f) => {
  acc[f] = (acc[f] || 0) + 1;
  return acc;
}, {});
// → { apple: 2, banana: 1 }
```

---

## 4. 関数化（アロー関数・引数）

```js
const f = (a, b) => a + b;          // 1式なら return 省略
const g = (a) => { return a * 2; }; // {}使ったら return 必須
const h = () => ({ x: 1 });         // オブジェクトを返すなら () で囲む

console.log(f(2, 3)); // → 5
console.log(g(4));    // → 8
console.log(h());     // → { x: 1 }

// {} を使って return を忘れると undefined
const bad = (a) => { a * 2 };
console.log(bad(4));  // → undefined  ★ハマりやすい

// デフォルト引数
const greet = (name = "ゲスト") => `こんにちは ${name}`;
console.log(greet());        // → "こんにちは ゲスト"
console.log(greet("太郎"));  // → "こんにちは 太郎"
```

- 引数なし＝`()`、1つでも `(a)` と書いておくと安全
- `{}` で囲んだら `return` を書かないと `undefined`

---

## 5. Motion `animate()`

```js
import { animate } from "motion";

animate(
  element,                     // ① 対象（要素 or セレクタ）
  { opacity: [0, 1], x: 100 }, // ② アニメーションするプロパティ
  { duration: 0.5, delay: 0.2, easing: "ease-out" } // ③ オプション
);
// 効果：0.2秒待ってから0.5秒かけて、透明→表示・右へ100px移動
```

| 引数 | 役割 | 例 |
|---|---|---|
| 第1 | アニメ対象（DOM要素やセレクタ） | `document.querySelector(".box")` |
| 第2 | 変化させるCSSプロパティ（`[開始, 終了]`で範囲指定可） | `{ opacity: [0, 1] }` |
| 第3 | duration / delay / easing などの設定 | `{ duration: 0.5 }` |

- 値を `[0, 1]` のように配列にすると **開始→終了** を指定できる
- 単一値 `{ x: 100 }` は「現在地→100pxへ」

---

## 6. fetch / async / await（頻出・要注意）

```js
async function getData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {                       // ← HTTPエラー(404,500)はここで自分で弾く
      throw new Error(`HTTP error: ${res.status}`);
    }
    const data = await res.json();       // ← json() も await が必要
    return data;
  } catch (err) {                        // ← ネットワークエラー＆上のthrowを捕捉
    console.error(err);
  } finally {
    // 成功・失敗どちらでも必ず実行（ローディング解除など）
  }
}

// 実行例
const user = await getData("/api/user"); // 成功 → { id: 1, name: "太郎" }
// 404の場合 → catchに入り "HTTP error: 404" を表示、返り値は undefined
```

**★最重要ポイント：ネットワークエラー と HTTPエラーの違い**

| | catchに入る？ | 説明 |
|---|---|---|
| ネットワークエラー（通信不能・URL不正） | **入る** | fetch自体がreject |
| HTTPエラー（404 / 500） | **入らない** | fetchは成功扱い。`res.ok`で自分でチェックが必要 |

```js
// res の中身イメージ
res.ok;     // → true（200番台）/ false（400,500番台）
res.status; // → 200 / 404 / 500 など
```

- `fetch` は404でも**例外を投げない** → `if (!res.ok) throw` が必須
- `await` を付け忘れると Promise のまま進む：
  ```js
  const data = fetch(url); // await忘れ
  console.log(data);       // → Promise { <pending> }  ★undefinedではなくPromise
  ```
- `res.json()` も非同期 → `await` が要る

---

## 7. fetch + map（一覧取得→表示の定番）

```js
async function render() {
  const res = await fetch("/api/items");
  const items = await res.json();
  // items → [{ name: "りんご", price: 100 }, { name: "みかん", price: 80 }]

  const html = items
    .map(item => `<li>${item.name}: ${item.price}円</li>`)
    .join("");
  // html → "<li>りんご: 100円</li><li>みかん: 80円</li>"

  document.querySelector("#list").innerHTML = html;
}
```

- `map` の結果は**配列** → `join("")` で連結して文字列にしてから挿入
- `join` を忘れると要素間に `,` が入る：
  ```js
  ["<li>A</li>", "<li>B</li>"].toString(); // → "<li>A</li>,<li>B</li>" ★カンマ混入
  ["<li>A</li>", "<li>B</li>"].join("");   // → "<li>A</li><li>B</li>"  ★正しい
  ```

---

## 8. LocalStorage

```js
// 保存（文字列しか保存できない → stringifyで文字列化）
localStorage.setItem("user", JSON.stringify({ name: "太郎", age: 20 }));

// 取得（文字列で返る → parseでオブジェクトに戻す）
const raw = localStorage.getItem("user");
console.log(raw);  // → '{"name":"太郎","age":20}'  ★文字列
const user = raw ? JSON.parse(raw) : null;
console.log(user); // → { name: "太郎", age: 20 }    ★オブジェクトに復元
console.log(user.age); // → 20

// 存在しないキー
localStorage.getItem("none"); // → null

// 削除
localStorage.removeItem("user");
localStorage.clear(); // 全消し
```

| メソッド | 動き | 戻り値 |
|---|---|---|
| `setItem(k, v)` | 保存（vは文字列のみ） | undefined |
| `getItem(k)` | 取得 | 文字列 / `null`（無い時） |
| `removeItem(k)` | 1件削除 | undefined |

**★なぜ stringify / parse が要る？**
LocalStorageは**文字列しか保存できない**から。オブジェクト/配列は `JSON.stringify` で文字列に、取り出すときは `JSON.parse` でオブジェクトに戻す。

```js
// stringifyを忘れると…
localStorage.setItem("obj", { a: 1 });
localStorage.getItem("obj"); // → "[object Object]"  ★壊れる
```

- 値が無いと `getItem` は `null` → `parse(null)` 対策で存在チェック
- 数値も取り出すと文字列になる：`Number(localStorage.getItem("age"))` で戻す

---

## 9. Promise.all（並行実行）

```js
// 並行：3つ同時にスタート → 全部終わるまで待つ（速い）
const [a, b, c] = await Promise.all([
  fetch(url1).then(r => r.json()),
  fetch(url2).then(r => r.json()),
  fetch(url3).then(r => r.json()),
]);
// a, b, c → 渡した順番で結果が入る（完了が早い順ではない）

// 数値でイメージ
const [x, y] = await Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
]);
console.log(x, y); // → 1 2
```

```js
// 直列：1つずつ順番に待つ（遅い）
const a = await (await fetch(url1)).json();
const b = await (await fetch(url2)).json();
```

| | 実行の仕方 | 速度 | 備考 |
|---|---|---|---|
| `Promise.all` | 並行（同時スタート） | **速い** | 1つでも失敗すると全体がreject |
| 直列 await | 1つずつ順番 | 遅い | 前の結果を次に使う時はこっち |

- 互いに依存しない通信は `Promise.all` でまとめると速い
- 戻り値は **渡した配列と同じ順番** の配列（完了順ではない）
- 1つでも失敗すると全体が即reject → `catch` へ

---

## 10. 補足（出題確率低め）

**finally でローディング解除**
```js
let loading = true;
try { /* 通信 */ }
catch (e) { /* エラー表示 */ }
finally { loading = false; } // 成功/失敗どちらでも必ず解除
```

**AbortController（通信キャンセル）**
```js
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort(); // 進行中の通信を中断 → catchでAbortError
```

---

## ⚡ 直前チェック（戻り値クイズ）

| 問題 | 答え |
|---|---|
| `[1,2,3].map(n=>n*2)` → ? | `[2, 4, 6]`（配列・同じ長さ） |
| `[1,2,3].filter(n=>n>1)` → ? | `[2, 3]`（配列・条件true） |
| `[1,2,3].find(n=>n>1)` → ? | `2`（要素1つ） |
| `[1,2,3].find(n=>n>9)` → ? | `undefined`（見つからない） |
| `[1,2,3].reduce((a,n)=>a+n,0)` → ? | `6`（単一値） |
| `[1,2].forEach(...)` の戻り値 → ? | `undefined` |
| `1 === "1"` → ? | `false`（型も比較） |
| 404のとき catch に入る？ | **入らない**（`res.ok`で弾く） |
| `await`忘れた `fetch()` → ? | `Promise { <pending> }` |
| LocalStorageに保存できるのは？ | **文字列だけ** |
| `getItem("無いキー")` → ? | `null` |
