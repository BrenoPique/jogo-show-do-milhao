document.getElementById("comecar").addEventListener("click", () => {
  const qtdJogadores = document.getElementById("qtd").value;
  errosRestantes = parseInt(qtdJogadores);

  // Armazena o valor no Session Storage
  sessionStorage.setItem("errosRestantes", errosRestantes);

  window.location.href = "game.html";
});
