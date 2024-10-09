const duration = 15 * 1000,
  animationEnd = Date.now() + duration,
  defaults = { startVelocity: 60, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Função para iniciar o efeito de confetes
function startConfetti() {
  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 30 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}
//

let pontuacao = sessionStorage.getItem("pontuacaoFinal");
const progressElement = document.getElementById("progress");
const mark = document.getElementsByClassName("mark");
let pontos = 0;
let progress = 0;
let targetPercentage = 0;
const premio1 = 10000;
const premio2 = 100000;
const premio3 = 500000;
const premio4 = 1000000;

if (pontuacao <= premio1) {
  targetPercentage = (pontuacao / premio1) * 25; // Primeiros 25% até 10 mil
} else if (pontuacao <= premio2) {
  targetPercentage = 25 + ((pontuacao - premio1) / (premio2 - premio1)) * 25; // Próximos 25% até 100 mil
} else if (pontuacao <= premio3) {
  targetPercentage = 50 + ((pontuacao - premio2) / (premio3 - premio2)) * 25; // Próximos 25% até 500 mil
} else {
  targetPercentage = 75 + ((pontuacao - premio3) / (premio4 - premio3)) * 25; // Últimos 25% até 1 milhão
}

function scaleMark(element) {
  element.classList.add("ok");
  element.classList.add("aumentar");
  setTimeout(() => {
    element.classList.remove("aumentar");
  }, 1000);
}

// Animação da barra de progresso
function progresso() {
  const totalProgressSteps = targetPercentage; // Quantos passos a barra vai precisar dar
  const pontosIncrement = pontuacao / totalProgressSteps; // Quanto cada passo aumenta na pontuação

  const interval = setInterval(() => {
    if (progress >= targetPercentage || pontos >= pontuacao) {
      // Garante que os valores finais sejam exatos
      progress = targetPercentage;
      pontos = pontuacao;

      // Atualiza a última vez
      document.getElementsByClassName("pontos")[0].innerHTML =
        Math.floor(pontos).toLocaleString("pt-BR") + " pts";
      progressElement.style.width = progress + "%";

      clearInterval(interval); // Para a animação

      if (pontos >= pontuacao) {
        startConfetti(); // Inicia o confete
      }
    } else {
      progress += 1; // Aumenta a barra gradualmente
      pontos += pontosIncrement; // Incrementa a pontuação proporcionalmente

      document.getElementsByClassName("pontos")[0].innerHTML =
        Math.floor(pontos).toLocaleString("pt-BR") + " pts";
      progressElement.style.width = progress + "%";

      // Verifica em qual marco a progressão está e escala a marca correspondente
      if (progress >= 25 && progress < 26) {
        scaleMark(mark[0]); // Escala para o primeiro marco (10 mil)
      } else if (progress >= 50 && progress < 51) {
        scaleMark(mark[1]); // Escala para o segundo marco (100 mil)
      } else if (progress >= 75 && progress < 76) {
        scaleMark(mark[2]); // Escala para o terceiro marco (500 mil)
      } else if (progress >= 100) {
        scaleMark(mark[3]); // Escala para o quarto marco (1 milhão)
      }
    }
  }, 60); // Intervalo de 60ms para suavizar a animação
}

// Inicia a progressão depois de um intervalo de 2 segundos
setTimeout(() => {
  progresso();
}, 2000);
