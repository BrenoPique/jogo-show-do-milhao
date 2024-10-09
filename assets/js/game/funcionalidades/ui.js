export function atualizarInterfaceComPergunta(pergunta, respostas, item) {
  respostas.innerHTML = "";
  pergunta.innerHTML = item.question;
  typeWriter(pergunta);

  item.answers.forEach((resposta, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <button class="answer" data-correct="${resposta.correct}">
        ${i + 1})&emsp; ${resposta.option}
      </button>
    `;
    respostas.appendChild(div);
  });
}

export function desabilitarRespostas() {
  document.querySelectorAll(".answer").forEach((btn) => (btn.disabled = true));
  document.querySelectorAll(".opcoes div").forEach((div) => {
    div.classList.add("ativado");
  });
}

export function habilitarContinuarBotao(btnContinuar, callback) {
  btnContinuar.style.opacity = "1";
  btnContinuar.style.pointerEvents = "all";
  btnContinuar.onclick = callback;
}

const typeWriter = (elemento) => {
  const arrayPergunta = elemento.innerHTML.split(""); // Separa o texto da pergunta em letras
  elemento.innerHTML = ""; // Limpa o conteúdo do elemento
  arrayPergunta.forEach((letra, index) => {
    setTimeout(() => {
      elemento.innerHTML += letra; // Exibe letra por letra
    }, 50 * index); // Intervalo de 100ms entre cada letra
  });
};

export function exibirPopupEliminado() {
  const popUpEliminado = document.querySelector(".eliminado");
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
