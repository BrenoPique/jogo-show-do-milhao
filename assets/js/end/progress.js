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

console.log(targetPercentage);

function scaleMark(element) {
  element.classList.add("ok");
  element.classList.add("aumentar");
  setTimeout(() => {
    element.classList.remove("aumentar");
  }, 1000);
}

// Animação da barra de progresso
function progresso() {
  setInterval(() => {
    if (progress >= targetPercentage) {
      clearInterval(interval);
    } else {
      progress += 1; // Aumentar a barra gradualmente
      pontos += pontuacao / targetPercentage;
      document.getElementsByClassName("pontos")[0].innerHTML =
        Math.floor(pontos).toLocaleString("pt-BR") + " pts";
      progressElement.style.width = progress + "%";
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
  }, 60); // 60ms para suavizar a animação
}

setInterval(() => {
  progresso();
}, 2000);
