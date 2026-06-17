export const getPokemon = async (name, signal) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, { signal });
  if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
  return res.json();
};
