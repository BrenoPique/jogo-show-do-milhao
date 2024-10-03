// cronometro.js

import sounds from "../modulo/sounds.js";
import { exibirPopupEliminado } from "./ui.js";
import { carregarPergunta } from "../script.js";
import { desabilitarRespostas } from "./ui.js";

// Seleciona os elementos do cronômetro
const minutos = document.querySelector(".cronometro p:nth-child(1)");
const segundos = document.querySelector(".cronometro p:nth-child(2)");
let timer; // Variável para controle do cronômetro
const btnContinuar = document.querySelector(".continue");

const cronometro = {
  tempoRestante: 25, // Tempo inicial por pergunta
};

export default cronometro;

// 1. Função para iniciar o cronômetro
export function iniciarCronometro() {
  cronometro.tempoRestante = 25; // Reseta o tempo restante para 20 segundos
  atualizarCronometro(); // Atualiza a interface imediatamente

  clearInterval(timer); // Limpa qualquer cronômetro anterior

  // Define o cronômetro que decrementa a cada segundo
  timer = setInterval(() => {
    cronometro.tempoRestante--;

    atualizarCronometro(); // Atualiza a interface do cronômetro

    if (cronometro.tempoRestante <= 0) {
      clearInterval(timer); // Para o cronômetro quando o tempo acaba
      setTimeout(() => {
        sounds.somErrou.play(); // Toca som de erro
        exibirPopupEliminado(); // Exibe o pop-up de eliminação
        // Desabilita os botões de resposta
        desabilitarRespostas();
        // Libera o botão de continuar
        btnContinuar.style.display = "block";
        btnContinuar.style.opacity = "1";
        btnContinuar.style.pointerEvents = "all";
        btnContinuar.onclick = () => {
          btnContinuar.style.opacity = "0.5";
          btnContinuar.style.pointerEvents = "none";
          carregarPergunta(); // Carrega a próxima pergunta ao continuar
        };
      }, 1000);
    }
  }, 1000); // Intervalo de 1 segundo entre cada atualização
}

// 2. Atualiza o cronômetro na interface com os minutos e segundos restantes
export function atualizarCronometro() {
  const min = Math.floor(cronometro.tempoRestante / 60);
  const sec = cronometro.tempoRestante % 60;
  minutos.innerHTML = min < 10 ? `0${min}` : min; // Formatação com dois dígitos
  segundos.innerHTML = sec < 10 ? `0${sec}` : sec;
}

// 3. Função para parar o cronômetro
export function pararCronometro() {
  clearInterval(timer); // Para o cronômetro
}
