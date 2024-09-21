// Seleciona os elementos HTML da interface
const pergunta = document.querySelector(".question");
const respostas = document.querySelector(".answers");
const spnQuantidade = document.querySelector(".spnQtd");
const textoFinalizacao = document.querySelector(".finish span");
const conteudo = document.querySelector(".content");
const conteudoFinalizacao = document.querySelector(".finish");
const btnReiniciar = document.querySelector(".finish button");
const btnContinuar = document.querySelector(".continue button");
const popUpEliminado = document.querySelector(".eliminado");
const divPular = document.querySelector(".pular .opcoes");
const opcoesPular = document.querySelectorAll(".pulo");
const dicas = document.querySelectorAll(".dica .opcoes div");
const perguntaElement = document.querySelector(".question");

let pulosRestantes = 3; // Contador de pulos disponíveis
let dicasDisponiveis = 3; // Contador de dicas disponíveis

btnContinuar.style.display = "none"; // Oculta o botão de continuar inicialmente

// Carrega os sons usados no quiz
const somCertaResposta = new Audio("/assets/sounds/index/certaResposta.mp3");
const somRespostaCerta = new Audio(
  "/assets/sounds/index/qualRespostaCerta.mp3"
);
const somVinheta = new Audio("/assets/sounds/index/vinheta.mp3");
const somErrou = new Audio("/assets/sounds/index/quePena.mp3");
const somPular = new Audio("/assets/sounds/index/naoConsegue.mp3");

// Importa o array de perguntas do arquivo externo
import perguntas from "./questions.js";

let indiceAtual = 0; // Índice da pergunta atual
let respostasCorretas = 0; // Contador de respostas corretas
let perguntasFaceis = [];
let perguntasMedias = [];
let perguntasDificeis = [];
let dificuldadeAtual = 1; // Dificuldade padrão inicial

// Filtra perguntas por dificuldade e retorna um conjunto embaralhado
function sortearPerguntas(perguntas, dificuldade, quantidade) {
  const perguntasFiltradas = perguntas.filter(
    (q) => q.difficulty === dificuldade
  );
  return perguntasFiltradas
    .sort(() => Math.random() - 0.5) // Embaralha as perguntas
    .slice(0, quantidade); // Seleciona a quantidade especificada
}

// Organiza perguntas de acordo com suas dificuldades
function obterPerguntasOrdenadas(perguntas) {
  perguntasFaceis = sortearPerguntas(perguntas, 1, 4); // 4 perguntas fáceis
  perguntasMedias = sortearPerguntas(perguntas, 2, 5); // 5 perguntas médias
  perguntasDificeis = sortearPerguntas(perguntas, 3, 6); // 6 perguntas difíceis
}

// Função de efeito "máquina de escrever"
const typeWriter = (elemento) => {
  const arrayPergunta = elemento.innerHTML.split(""); // Quebra a pergunta em letras
  elemento.innerHTML = ""; // Limpa o conteúdo do elemento antes de iniciar o efeito

  // Exibe cada letra com um intervalo
  arrayPergunta.forEach((letra, index) => {
    setTimeout(() => {
      elemento.innerHTML += letra;
    }, 100 * index); // 100 ms de intervalo entre cada letra
  });
};

// Carrega a próxima pergunta com base na dificuldade atual
function carregarPergunta() {
  somVinheta.play(); // Toca a vinheta ao carregar a pergunta
  spnQuantidade.innerHTML = `${respostasCorretas}/15`; // Atualiza o contador de respostas

  let item; // Variável para armazenar a pergunta atual

  // Seleciona a pergunta de acordo com a dificuldade atual
  if (dificuldadeAtual === 1 && perguntasFaceis.length > 0) {
    item = perguntasFaceis[indiceAtual];
  } else if (dificuldadeAtual === 2 && perguntasMedias.length > 0) {
    item = perguntasMedias[indiceAtual];
  } else if (dificuldadeAtual === 3 && perguntasDificeis.length > 0) {
    item = perguntasDificeis[indiceAtual];
  }

  respostas.innerHTML = ""; // Limpa as respostas anteriores
  pergunta.innerHTML = item.question; // Exibe a pergunta atual

  // Aplica o efeito de máquina de escrever na pergunta
  typeWriter(perguntaElement);

  // Cria e adiciona botões de resposta
  item.answers.forEach((resposta, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <button class="answer" data-correct="${resposta.correct}">
        ${i + 1})&emsp; ${resposta.option}
      </button>
    `;
    respostas.appendChild(div); // Adiciona a resposta à interface
  });

  // Adiciona evento de clique aos novos botões de resposta
  document.querySelectorAll(".answer").forEach((item) => {
    item.addEventListener("click", proximaPergunta);
  });
}

// Função para usar uma dica
function usarDica(e) {
  if (dicasDisponiveis > 0) {
    // Adiciona um "X" na div clicada
    e.currentTarget.innerHTML = "X";
    e.currentTarget.classList.add("usada"); // Classe para estilo, se necessário
    dicasDisponiveis--; // Decrementa o contador de dicas disponíveis

    // Seleciona aleatoriamente uma resposta incorreta
    const botoes = document.querySelectorAll(".answer");
    const alternativasErradas = Array.from(botoes).filter(
      (btn) =>
        btn.getAttribute("data-correct") === "false" &&
        btn.style.opacity !== "0.5"
    );

    // Verifica se há alternativas erradas disponíveis
    if (alternativasErradas.length > 0) {
      // Seleciona uma alternativa errada aleatoriamente
      const indexAleatorio = Math.floor(
        Math.random() * alternativasErradas.length
      );
      const alternativaErrada = alternativasErradas[indexAleatorio];

      // Altera a opacidade da alternativa errada
      alternativaErrada.style.opacity = "0.5"; // Ajuste a opacidade conforme necessário
      alternativaErrada.disabled = true; // Desabilita a resposta
    }
  }
}

// Adiciona eventos de clique para as opções de dica
dicas.forEach((dica) => {
  dica.addEventListener("click", usarDica);
});

// Função para pular a pergunta
function pularPergunta(e) {
  const puloDiv = e.currentTarget;

  if (pulosRestantes > 0) {
    pulosRestantes--; // Decrementa o número de pulos restantes
    puloDiv.innerHTML = "X"; // Indica que a opção de pular foi ativada
    puloDiv.classList.add("ativado");

    // Avança para a próxima pergunta
    indiceAtual++;

    somPular.play(); // Toca o som de pular
    setTimeout(carregarPergunta, 2000); // Carrega a próxima pergunta após 2 segundos

    if (pulosRestantes === 0) {
      desativarPulo(); // Desativa a opção de pular se não houver mais pulos
    }
  }
}

// Desativa a opção de pular
function desativarPulo() {
  divPular.classList.add("desativado"); // Aplica estilo de desativação
}

// Adiciona eventos de clique para as opções de pular
opcoesPular.forEach((pulo) => {
  pulo.addEventListener("click", pularPergunta);
});

// Função para lidar com a resposta selecionada
function proximaPergunta(e) {
  const botoes = document.querySelectorAll(".answer");
  botoes.forEach((btn) => (btn.disabled = true)); // Desativa todos os botões de resposta

  if (e.target.getAttribute("data-correct") === "true") {
    e.target.classList.add("correct"); // Marca a resposta como correta
    respostasCorretas++; // Incrementa o contador de respostas corretas
    somCertaResposta.play(); // Toca o som de resposta certa
  } else {
    e.target.classList.add("incorrect"); // Marca a resposta como incorreta
    somErrou.play(); // Toca o som de resposta errada
    exibirPopupEliminado(); // Exibe o pop-up de eliminado
  }

  // Atualiza o índice para a próxima pergunta
  indiceAtual++;

  // Reseta o índice se ultrapassar o número de perguntas
  if (dificuldadeAtual === 1 && indiceAtual >= perguntasFaceis.length) {
    indiceAtual = 0;
  } else if (dificuldadeAtual === 2 && indiceAtual >= perguntasMedias.length) {
    indiceAtual = 0;
  } else if (
    dificuldadeAtual === 3 &&
    indiceAtual >= perguntasDificeis.length
  ) {
    indiceAtual = 0;
  }

  // Exibe o botão de continuar
  btnContinuar.style.display = "block";
  btnContinuar.onclick = () => {
    btnContinuar.style.display = "none"; // Oculta o botão de continuar
    carregarPergunta(); // Carrega a próxima pergunta
  };
}

// Função para exibir o pop-up "Eliminado"
function exibirPopupEliminado() {
  popUpEliminado.style.display = "block";
  setTimeout(() => {
    popUpEliminado.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    popUpEliminado.style.opacity = "0";
    setTimeout(() => {
      popUpEliminado.style.display = "none";
    }, 500);
  }, 5000);
}

// Carrega as perguntas ao iniciar o quiz
obterPerguntasOrdenadas(perguntas);

// Configura o evento de reinício do quiz
btnReiniciar.onclick = () => {
  conteudo.style.display = "flex"; // Exibe a tela do quiz
  conteudoFinalizacao.style.display = "none"; // Oculta a tela de finalização

  // Reseta as variáveis para um novo quiz
  indiceAtual = 0;
  respostasCorretas = 0;
  dificuldadeAtual = 1; // Retorna para as perguntas fáceis
  pulosRestantes = 3; // Reseta o número de pulos
  dicasDisponiveis = 3; // Reseta o número de dicas

  obterPerguntasOrdenadas(perguntas); // Reorganiza as perguntas
  carregarPergunta(); // Carrega a primeira pergunta
};

// Carrega a primeira pergunta ao iniciar
carregarPergunta();
