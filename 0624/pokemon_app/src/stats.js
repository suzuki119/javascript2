// 実数値の計算（第3世代以降の公式）と性格補正データ

// 性格 → [上がるステータス, 下がるステータス]（無補正は [null, null]）
export const NATURES = {
  "がんばりや": [null, null],
  "さみしがり": ["attack", "defense"],
  "ゆうかん": ["attack", "speed"],
  "いじっぱり": ["attack", "special-attack"],
  "やんちゃ": ["attack", "special-defense"],
  "ずぶとい": ["defense", "attack"],
  "すなお": [null, null],
  "のんき": ["defense", "speed"],
  "わんぱく": ["defense", "special-attack"],
  "のうてんき": ["defense", "special-defense"],
  "おくびょう": ["speed", "attack"],
  "せっかち": ["speed", "defense"],
  "まじめ": [null, null],
  "ようき": ["speed", "special-attack"],
  "むじゃき": ["speed", "special-defense"],
  "ひかえめ": ["special-attack", "attack"],
  "おっとり": ["special-attack", "defense"],
  "れいせい": ["special-attack", "speed"],
  "てれや": [null, null],
  "うっかりや": ["special-attack", "special-defense"],
  "おだやか": ["special-defense", "attack"],
  "おとなしい": ["special-defense", "defense"],
  "なまいき": ["special-defense", "speed"],
  "しんちょう": ["special-defense", "special-attack"],
  "きまぐれ": [null, null],
};

// 1つのステータスの実数値を計算する
//   statName: "hp" / "attack" など
//   base: 種族値, iv: 個体値(0-31), ev: 努力値(0-252), level: レベル, nature: NATURESの値
export const calcStat = (statName, base, iv, ev, level, nature) => {
  const common = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100);

  // HP は性格補正なし・計算式が別
  if (statName === "hp") {
    return common + level + 10;
  }

  let value = common + 5;
  const [plus, minus] = nature;
  if (plus === statName) value = Math.floor(value * 1.1);
  else if (minus === statName) value = Math.floor(value * 0.9);
  return value;
};
