import perguntas from "./modulo/questions.js";
import sounds from "./modulo/sounds.js";
import { listenDicas } from "./ajudas/dicas.js";
import { listenUniversitarios } from "./ajudas/universitarios.js";
import { listenPular } from "./ajudas/pular.js";
import {
  iniciarCronometro,
  pararCronometro,
} from "./funcionalidades/cronometro.js";
import {
  atualizarInterfaceComPergunta,
  desabilitarRespostas,
  habilitarContinuarBotao,
  exibirPopupEliminado,
} from "./funcionalidades/ui.js";
import { separarPerguntas } from "./funcionalidades/ordenarPerguntas.js";

const pergunta = document.querySelector(".question");
const respostas = document.querySelector(".answers");
const spnQuantidade = document.querySelector(".spnQtd");
const btnContinuar = document.querySelector(".continue");
const btnParar = document.querySelector(".parar");

let indiceAtual = 0;
let respostasCorretas = 0;
let dificuldadeAtual = 1;
let pontos = 0;
let pontosPergunta = 0;
let pontosAcerta = 0;
let errosRestantes = sessionStorage.getItem("errosRestantes");
let virada1 = false;
let virada2 = false;
const { faceis, medias, dificeis } = separarPerguntas(perguntas);

export function aumentarIndice() {
  indiceAtual++;
}

function calcularPontuacao(dificuldade) {
  if (dificuldade === 1) return 1000;
  if (dificuldade === 2) return 10000;
  if (dificuldade === 3) return 100000;
}

function atualizarPontuacao() {
  document.querySelector(
    ".informativo button span:last-of-type"
  ).innerHTML = `${pontos.toLocaleString("pt-BR")} pts`;

  document.querySelector(
    ".funcionais p:last-of-type span:last-of-type"
  ).innerHTML = `${pontosAcerta.toLocaleString("pt-BR")} pts`;

  document.querySelector(".informativo p span:last-of-type").innerHTML = `${(
    pontos / 2
  ).toLocaleString("pt-BR")} pts`;
}

export function carregarPergunta() {
  spnQuantidade.innerHTML = `${respostasCorretas}/15`;
  let item;
  sounds.somVinheta.play();
  document.querySelectorAll(".opcoes div").forEach((div) => {
    div.classList.remove("ativado");
  });

  if (dificuldadeAtual === 1 && respostasCorretas === 4) {
    dificuldadeAtual = 2;
    indiceAtual = 0;
    pontosAcerta = calcularPontuacao(2);
  } else if (dificuldadeAtual === 2 && respostasCorretas === 10) {
    dificuldadeAtual = 3;
    indiceAtual = 0;
    pontosAcerta = calcularPontuacao(3);
  }

  if (dificuldadeAtual === 1 && indiceAtual < faceis.length) {
    item = faceis[indiceAtual];
    pontosPergunta = calcularPontuacao(1);
    pontosAcerta = pontos + pontosPergunta;
  } else if (dificuldadeAtual === 2 && indiceAtual < medias.length) {
    item = medias[indiceAtual];
    pontosPergunta = calcularPontuacao(2);
    if (respostasCorretas === 4) {
      pontosAcerta = pontosPergunta;
    } else if (respostasCorretas === 5 && !virada1) {
      pontos -= 4000;
      pontosAcerta = pontos + pontosPergunta;
      virada1 = true;
    } else {
      pontosAcerta = pontos + pontosPergunta;
    }
  } else if (dificuldadeAtual === 3 && indiceAtual < dificeis.length) {
    item = dificeis[indiceAtual];
    pontosPergunta = calcularPontuacao(3);
    if (indiceAtual === 0) {
      pontosAcerta = pontosPergunta;
    } else if (respostasCorretas === 11 && !virada2) {
      pontos -= 60000;
      pontosAcerta = pontos + pontosPergunta;
      virada2 = true;
    } else {
      pontosAcerta = pontos + pontosPergunta;
    }
  } else {
    carregarPergunta();
    return;
  }

  atualizarPontuacao();

  atualizarInterfaceComPergunta(pergunta, respostas, item);

  document.querySelectorAll(".answer").forEach((item) => {
    item.addEventListener("click", proximaPergunta);
  });

  iniciarCronometro();
}

function proximaPergunta(e) {
  habilitarContinuarBotao(btnContinuar);
  desabilitarRespostas();

  if (e.target.getAttribute("data-correct") === "true") {
    e.target.classList.add("correct");
    respostasCorretas++;
    sounds.somCertaResposta.play();
    pontos += pontosPergunta;
  } else {
    e.target.classList.add("incorrect");
    const respostaCorreta = document.querySelector('[data-correct="true"]');
    respostaCorreta.classList.add("correct");
    sounds.somErrou.play();
    exibirPopupEliminado();
    errosRestantes--;
  }

  pararCronometro();
  aumentarIndice();

  btnContinuar.style.display = "block";
  btnContinuar.onclick = () => {
    btnContinuar.style.opacity = "0.5";
    btnContinuar.style.pointerEvents = "none";
    if (respostasCorretas === 15) {
      sessionStorage.clear();
      sessionStorage.setItem("pontuacaoFinal", pontos);
      window.location.href = "end.html";
    } else if (errosRestantes === 0) {
      sessionStorage.clear();
      sessionStorage.setItem("pontuacaoFinal", pontos / 2);
      window.location.href = "end.html";
    }
    carregarPergunta();
  };
  btnParar.addEventListener("click", () => {
    sessionStorage.clear();
    sessionStorage.setItem("pontuacaoFinal", pontos);
    window.location.href = "end.html";
  });
}

separarPerguntas(perguntas);
listenDicas();
listenPular();
listenUniversitarios();
carregarPergunta();
