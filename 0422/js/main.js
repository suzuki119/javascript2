import { greet, schoolName } from "./message.js";

console.log(greet("田中"));
console.log(schoolName);

const target = document.querySelector(`#workslist`);

target.innerHTML = works.map(createWorkItem).join("");
