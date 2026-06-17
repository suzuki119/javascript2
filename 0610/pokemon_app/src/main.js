import "./style.css";
import { animate } from "motion";
import { getPokemon } from "./api.js";
import { renderPokemon, showError, setLoading } from "./view.js";

animate(document.querySelector(".spinner"), { rotate: [0, 360] }, { duration: 1, repeat: Infinity, ease: "linear" });

let controller;

const load = async (name) => {
  if (controller) controller.abort();
  controller = new AbortController();

  setLoading(true);

  try {
    const data = await getPokemon(name, controller.signal);
    renderPokemon(data);
  } catch (err) {
    if (err.name === "AbortError") return;
    console.error(err);
    showError("見つかりませんでした");
  } finally {
    setLoading(false);
  }
};

document.querySelector("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  load(document.querySelector("#keyword").value.trim().toLowerCase());
});

document.querySelector("#numberForm").addEventListener("submit", (e) => {
  e.preventDefault();
  load(document.querySelector("#number").value.trim());
});
