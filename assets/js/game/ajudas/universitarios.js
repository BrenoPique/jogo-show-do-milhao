// universitarios.js

// Seleciona os elementos de universitários da interface
const universitarios = document.querySelectorAll(".universitarios .opcoes div"); // Botões de ajuda "Universitários"
let universitariosDisponiveis = 3; // Quantidade de universitários disponíveis

// Importa o cronômetro para poder atualizar o tempo
import cronometro, {
  atualizarCronometro,
} from "../funcionalidades/cronometro.js";

// Função para usar a ajuda dos universitários (adiciona 15 segundos ao cronômetro)
export function usarUniversitarios(e) {
  if (universitariosDisponiveis > 0) {
    e.currentTarget.innerHTML = "X"; // Marca o botão como usado
    e.currentTarget.classList.add("ativado");
    e.currentTarget.classList.add("usado");
    universitariosDisponiveis--;

    cronometro.tempoRestante += 15; // Adiciona 15 segundos ao cronômetro

    atualizarCronometro(); // Atualiza o cronômetro na interface
  }
}

// Função para inicializar os eventos dos universitários
export function listenUniversitarios() {
  universitarios.forEach((universitario) =>
    universitario.addEventListener("click", usarUniversitarios)
  ); // Adiciona evento para usar ajuda dos universitários
}
