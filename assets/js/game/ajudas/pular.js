import { pararCronometro } from "../funcionalidades/cronometro.js";
import sounds from "../modulo/sounds.js";
import { carregarPergunta, aumentarIndice } from "../script.js";
const opcoesPular = document.querySelectorAll(".pulo");
let pulosRestantes = 3;
function pularPergunta(e) {
  pararCronometro(); // Para o cronômetro
  if (pulosRestantes > 0) {
    pulosRestantes--; // Reduz o número de pulos disponíveis
    e.currentTarget.innerHTML = "X"; // Marca o pulo como usado
    e.currentTarget.classList.add("ativado");
    e.currentTarget.classList.add("usado");

    aumentarIndice(); // Passa para a próxima pergunta
    sounds.somPular.play(); // Toca som de pulo
    setTimeout(carregarPergunta, 2000); // Aguarda 2 segundos antes de carregar a próxima pergunta
  }
}

export function listenPular() {
  opcoesPular.forEach((pulo) => pulo.addEventListener("click", pularPergunta)); // Adiciona evento para usar o pulo
}
