let perguntasFaceis = [];
let perguntasMedias = [];
let perguntasDificeis = [];

function sortearPerguntas(perguntas, dificuldade) {
  return perguntas
    .filter((q) => q.difficulty === dificuldade) // Filtra perguntas por dificuldade
    .sort(() => Math.random() - 0.5); // Embaralha as perguntas
}

// Função para separar as perguntas em fáceis, médias e difíceis
export function separarPerguntas(perguntas) {
  perguntasFaceis = sortearPerguntas(perguntas, 1); // Perguntas fáceis (dificuldade 1)
  perguntasMedias = sortearPerguntas(perguntas, 2); // Perguntas médias (dificuldade 2)
  perguntasDificeis = sortearPerguntas(perguntas, 3); // Perguntas difíceis (dificuldade 3)

  return {
    faceis: perguntasFaceis,
    medias: perguntasMedias,
    dificeis: perguntasDificeis,
  };
}
