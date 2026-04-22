export function createWorkItem(work) {
  return `<li>${work.title} / ${work.category}</li>`;
}

export function renderWorkList(targetId, items) {
  const target = document.querySelector(`#${targetId}`);
  target.innerHTML = items.map(createWorkItem).join("");
}