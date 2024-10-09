// dicas.js
import sounds from "../modulo/sounds.js";
// 1. Variáveis necessárias para o uso das dicas
let dicasDisponiveis = 3; // Número de dicas disponíveis
const dicas = document.querySelectorAll(".dica .opcoes div"); // Botões de dica

// 2. Função para usar uma dica (elimina uma resposta incorreta)
export function usarDica(e) {
  if (dicasDisponiveis > 0) {
    e.currentTarget.innerHTML = "X"; // Marca a dica como usada
    e.currentTarget.classList.add("ativado");
    e.currentTarget.classList.add("usado");
    dicasDisponiveis--;
    sounds.eTaBom.play(); // Toca som de pulo

    // Seleciona todas as respostas
    const botoes = document.querySelectorAll(".answer");

    // Filtra apenas as respostas incorretas que ainda não foram desativadas
    const alternativasErradas = Array.from(botoes).filter(
      (btn) =>
        btn.getAttribute("data-correct") === "false" &&
        btn.style.opacity !== "0.5"
    );

    if (alternativasErradas.length > 0) {
      // Escolhe uma resposta incorreta aleatória
      const indexAleatorio = Math.floor(
        Math.random() * alternativasErradas.length
      );
      const alternativaErrada = alternativasErradas[indexAleatorio];

      // Deixa a resposta incorreta menos visível e a desabilita
      alternativaErrada.style.opacity = "0.5";
      alternativaErrada.disabled = true;
    }
  }
}

// 3. Função para escutar os cliques nas dicas
export function listenDicas() {
  dicas.forEach((dica) => dica.addEventListener("click", usarDica)); // Adiciona evento para usar as dicas
}
