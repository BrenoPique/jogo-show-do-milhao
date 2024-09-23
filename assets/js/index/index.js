// 1. Seleciona elementos da interface que serão manipulados no jogo
const pergunta = document.querySelector(".question");
const respostas = document.querySelector(".answers");
const spnQuantidade = document.querySelector(".spnQtd");
const btnReiniciar = document.querySelector(".finish button");
const btnContinuar = document.querySelector(".continue");
const popUpEliminado = document.querySelector(".eliminado");
const opcoesPular = document.querySelectorAll(".pulo");
const dicas = document.querySelectorAll(".dica .opcoes div");
const universitarios = document.querySelectorAll(".universitarios .opcoes div"); // Botões de ajuda "Universitários"
const perguntaElement = document.querySelector(".question");
const minutos = document.querySelector(".cronometro p:nth-child(1)");
const segundos = document.querySelector(".cronometro p:nth-child(2)");

// 2. Variáveis de controle do jogo como número de dicas, pulos e status das perguntas
let pulosRestantes = 3;
let dicasDisponiveis = 3;
let universitariosDisponiveis = 3; // Quantidade de universitários disponíveis
let indiceAtual = 0; // Controla o índice da pergunta atual
let respostasCorretas = 0; // Contador de respostas corretas
let perguntasFaceis = [];
let perguntasMedias = [];
let perguntasDificeis = [];
let dificuldadeAtual = 1; // 1 = fácil, 2 = média, 3 = difícil
let timer; // Variável para controle do cronômetro
let tempoRestante = 20; // Tempo inicial por pergunta
let pontos = 0; // Pontos acumulados
let pontosPergunta = 0; // Pontos da pergunta atual
let pontosAcerta = 0;

// 3. Inicializa sons para efeitos sonoros como resposta certa, errada, pulo, etc.
const somCertaResposta = new Audio("/assets/sounds/index/certaResposta.mp3");
const somVinheta = new Audio("/assets/sounds/index/vinheta.mp3");
const somErrou = new Audio("/assets/sounds/index/quePena.mp3");
const somPular = new Audio("/assets/sounds/index/naoConsegue.mp3");

// 4. Carrega as perguntas de um arquivo externo
import perguntas from "./questions.js";

// 6. Função para sortear perguntas com base na dificuldade fornecida
function sortearPerguntas(perguntas, dificuldade) {
  return perguntas
    .filter((q) => q.difficulty === dificuldade) // Filtra perguntas por dificuldade
    .sort(() => Math.random() - 0.5); // Embaralha as perguntas
}

// Função para separar as perguntas em fáceis, médias e difíceis
function separarPerguntas(perguntas) {
  perguntasFaceis = sortearPerguntas(perguntas, 1); // Perguntas fáceis (dificuldade 1)
  perguntasMedias = sortearPerguntas(perguntas, 2); // Perguntas médias (dificuldade 2)
  perguntasDificeis = sortearPerguntas(perguntas, 3); // Perguntas difíceis (dificuldade 3)
}

function atualizarPontuacao() {
  // Exibe os pontos acumulados no elemento de pontuação
  document.querySelector(
    ".informativo p:first-of-type span:last-of-type"
  ).innerHTML = `${pontos.toLocaleString("pt-BR")} pts`;

  // Exibe os pontos que o usuário pode ganhar na pergunta atual
  document.querySelector(
    ".funcionais p:last-of-type span:last-of-type"
  ).innerHTML = `${pontosAcerta.toLocaleString("pt-BR")} pts`;
}

// 7. Função que cria efeito de "máquina de escrever" ao exibir a pergunta
const typeWriter = (elemento) => {
  const arrayPergunta = elemento.innerHTML.split(""); // Separa o texto da pergunta em letras
  elemento.innerHTML = ""; // Limpa o conteúdo do elemento
  arrayPergunta.forEach((letra, index) => {
    setTimeout(() => {
      elemento.innerHTML += letra; // Exibe letra por letra
    }, 100 * index); // Intervalo de 100ms entre cada letra
  });
};

// 8. Função para carregar a próxima pergunta com base na dificuldade atual
function carregarPergunta() {
  spnQuantidade.innerHTML = `${respostasCorretas}/15`; // Atualiza o contador de respostas corretas

  let item;
  somVinheta.play(); // Toca som de vinheta

  // Verifica a dificuldade atual
  if (dificuldadeAtual === 1 && respostasCorretas === 4) {
    dificuldadeAtual = 2; // Perguntas médias
    indiceAtual = 0;
  } else if (dificuldadeAtual === 2 && respostasCorretas === 10) {
    dificuldadeAtual = 3; // Perguntas difíceis
    indiceAtual = 0;
  } else if (dificuldadeAtual === 3 && respostasCorretas === 16) {
    finalizarQuiz(); // Finaliza o jogo
    return;
  }

  // Seleciona a pergunta de acordo com a dificuldade e o índice atual
  if (dificuldadeAtual === 1 && indiceAtual < perguntasFaceis.length) {
    item = perguntasFaceis[indiceAtual];
    pontosPergunta = 31250; // Pontuação para perguntas fáceis
    pontosAcerta = pontos + pontosPergunta;
  } else if (dificuldadeAtual === 2 && indiceAtual < perguntasMedias.length) {
    item = perguntasMedias[indiceAtual];
    pontosPergunta = 31250 * 2; // Pontuação para perguntas médias
    pontosAcerta = pontos + pontosPergunta;
  } else if (dificuldadeAtual === 3 && indiceAtual < perguntasDificeis.length) {
    item = perguntasDificeis[indiceAtual];
    pontosPergunta = 31250 * 3; // Pontuação para perguntas difíceis
    pontosAcerta = pontos + pontosPergunta;
  } else {
    carregarPergunta(); // Carrega novamente se não houver perguntas
    return;
  }

  // Atualiza a interface com os pontos
  atualizarPontuacao();

  // Atualiza a interface com a pergunta e respostas
  respostas.innerHTML = "";
  pergunta.innerHTML = item.question;
  typeWriter(perguntaElement); // Aplica o efeito de máquina de escrever

  item.answers.forEach((resposta, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <button class="answer" data-correct="${resposta.correct}">
        ${i + 1})&emsp; ${resposta.option}
      </button>
    `;
    respostas.appendChild(div);
  });

  document.querySelectorAll(".answer").forEach((item) => {
    item.addEventListener("click", proximaPergunta);
  });

  iniciarCronometro();
}

// 9. Função para iniciar o cronômetro
function iniciarCronometro() {
  tempoRestante = 20; // Reseta o tempo restante para 20 segundos
  atualizarCronometro(); // Atualiza a interface imediatamente

  clearInterval(timer); // Limpa qualquer cronômetro anterior

  // Define o cronômetro que decrementa a cada segundo
  timer = setInterval(() => {
    tempoRestante--;

    atualizarCronometro(); // Atualiza a interface do cronômetro

    if (tempoRestante <= 0) {
      clearInterval(timer); // Para o cronômetro quando o tempo acaba
      setTimeout(() => {
        somErrou.play(); // Toca som de erro
        exibirPopupEliminado(); // Exibe o pop-up de eliminação
        // Desabilita os botões de resposta
        document
          .querySelectorAll(".answer")
          .forEach((btn) => (btn.disabled = true));
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

// Atualiza o cronômetro na interface com os minutos e segundos restantes
function atualizarCronometro() {
  const min = Math.floor(tempoRestante / 60);
  const sec = tempoRestante % 60;
  minutos.innerHTML = min < 10 ? `0${min}` : min; // Formatação com dois dígitos
  segundos.innerHTML = sec < 10 ? `0${sec}` : sec;
}

// 10. Função para usar uma dica (elimina uma resposta incorreta)
function usarDica(e) {
  if (dicasDisponiveis > 0) {
    e.currentTarget.innerHTML = "X"; // Marca a dica como usada
    e.currentTarget.classList.add("usada");
    dicasDisponiveis--;

    const botoes = document.querySelectorAll(".answer");
    const alternativasErradas = Array.from(botoes).filter(
      (btn) =>
        btn.getAttribute("data-correct") === "false" &&
        btn.style.opacity !== "0.5"
    );

    if (alternativasErradas.length > 0) {
      const indexAleatorio = Math.floor(
        Math.random() * alternativasErradas.length
      );
      const alternativaErrada = alternativasErradas[indexAleatorio];
      alternativaErrada.style.opacity = "0.5"; // Deixa a resposta errada menos visível
      alternativaErrada.disabled = true; // Desabilita a resposta errada
    }
  }
}

// 11. Função para pular uma pergunta
function pularPergunta(e) {
  clearInterval(timer); // Para o cronômetro
  if (pulosRestantes > 0) {
    pulosRestantes--; // Reduz o número de pulos disponíveis
    e.currentTarget.innerHTML = "X"; // Marca o pulo como usado
    e.currentTarget.classList.add("ativado");

    indiceAtual++; // Passa para a próxima pergunta
    somPular.play(); // Toca som de pulo
    setTimeout(carregarPergunta, 2000); // Aguarda 2 segundos antes de carregar a próxima pergunta
  }
}

// 12. Função para usar a ajuda dos universitários (adiciona 15 segundos ao cronômetro)
function usarUniversitarios(e) {
  if (universitariosDisponiveis > 0) {
    e.currentTarget.innerHTML = "X"; // Marca o botão como usado
    e.currentTarget.classList.add("ativado");
    universitariosDisponiveis--;

    tempoRestante += 15; // Adiciona 15 segundos ao cronômetro

    atualizarCronometro(); // Atualiza o cronômetro na interface
  }
}

// 13. Função para processar a resposta selecionada
function proximaPergunta(e) {
  btnContinuar.style.opacity = "1";
  btnContinuar.style.pointerEvents = "all";
  const botoes = document.querySelectorAll(".answer");
  botoes.forEach((btn) => (btn.disabled = true)); // Desabilita todos os botões

  // Verifica se a resposta selecionada é correta
  if (e.target.getAttribute("data-correct") === "true") {
    e.target.classList.add("correct");
    respostasCorretas++;
    somCertaResposta.play(); // Som de resposta correta
    pontos += pontosPergunta; // Adiciona os pontos da pergunta atual ao total
  } else {
    e.target.classList.add("incorrect");
    somErrou.play(); // Som de erro
    exibirPopupEliminado();
  }

  // Atualiza a pontuação na interface
  atualizarPontuacao();

  clearInterval(timer); // Para o cronômetro
  indiceAtual++; // Próxima pergunta

  btnContinuar.style.display = "block"; // Exibe o botão de continuar
  btnContinuar.onclick = () => {
    btnContinuar.style.opacity = "0.5";
    btnContinuar.style.pointerEvents = "none";
    carregarPergunta(); // Carrega a próxima pergunta
  };
}

// 14. Função para exibir o pop-up de eliminação
function exibirPopupEliminado() {
  popUpEliminado.style.display = "block"; // Exibe o pop-up
  setTimeout(() => {
    popUpEliminado.style.opacity = "1";
  }, 10);
  setTimeout(() => {
    popUpEliminado.style.opacity = "0"; // Desaparece após 5 segundos
    setTimeout(() => {
      popUpEliminado.style.display = "none";
    }, 500);
  }, 5000);
}

// 15. Configurações iniciais e eventos
separarPerguntas(perguntas); // Separa as perguntas por dificuldade
btnReiniciar.onclick = () => window.location.reload(); // Reinicia o jogo ao clicar no botão de reiniciar
opcoesPular.forEach((pulo) => pulo.addEventListener("click", pularPergunta)); // Adiciona evento para usar o pulo
dicas.forEach((dica) => dica.addEventListener("click", usarDica)); // Adiciona evento para usar as dicas
universitarios.forEach((universitario) =>
  universitario.addEventListener("click", usarUniversitarios)
); // Adiciona evento para usar ajuda dos universitários
carregarPergunta(); // Carrega a primeira pergunta do jogo
