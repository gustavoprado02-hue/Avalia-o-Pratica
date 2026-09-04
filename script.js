// Estado Global do Jogador
const playerStats = {
  matches: 0,
  goals: 0,
  assists: 0,
  energy: 100
};

// Estado da Partida
let currentHomeScore = 0;
let currentAwayScore = 0;

// Referências do DOM
const scenarioText = document.getElementById('scenario-text');
const choicesContainer = document.getElementById('choices-container');
const scoreDisplay = document.getElementById('score-display');
const matchMinute = document.getElementById('match-minute');
const statMatches = document.getElementById('stat-matches');
const statGoals = document.getElementById('stat-goals');
const statAssists = document.getElementById('stat-assists');
const statEnergy = document.getElementById('stat-energy');

// Nós da História (Estilo Coopero Game)
const storyNodes = {
  start: {
    minute: "10'",
    text: "O jogo começou muito movimentado! A zaga adversária falha na saída de bola e ela sobra limpa para você na intermediária. O que você faz?",
    choices: [
      { text: "Chutar direto de fora da área", target: "shot_outside" },
      { text: "Tocar para o ponta livre na direita", target: "pass_wing" }
    ]
  },
  shot_outside: {
    minute: "12'",
    text: "GOOOOOOL! Você solta um canudo no ângulo! A torcida vai à loucura no estádio!",
    action: () => {
      playerStats.goals += 1;
      currentHomeScore += 1;
      playerStats.energy -= 10;
    },
    choices: [
      { text: "Continuar a partida", target: "mid_game" }
    ]
  },
  pass_wing: {
    minute: "12'",
    text: "O ponta recebe, cruza para a área mas a zaga afasta para escanteio.",
    action: () => {
      playerStats.energy -= 5;
    },
    choices: [
      { text: "Continuar a partida", target: "mid_game" }
    ]
  },
  mid_game: {
    minute: "65'",
    text: "O adversário pressiona e empata o jogo. Agora o jogo está tenso aos 65 minutos. Você recebe um lançamento em profundidade na corrida.",
    action: () => {
      currentAwayScore = 1;
    },
    choices: [
      { text: "Tentar driblar o goleiro", target: "dribble_keeper" },
      { text: "Tocar de primeira para o centroavante", target: "pass_center" }
    ]
  },
  dribble_keeper: {
    minute: "67'",
    text: "Você tenta o drible, mas o goleiro se joga bem nos seus pés e fica com a bola.",
    action: () => {
      playerStats.energy -= 15;
    },
    choices: [
      { text: "Avançar para o final do jogo", target: "end_game" }
    ]
  },
  pass_center: {
    minute: "67'",
    text: "Passe perfeito! O centroavante só empurra para o gol vazio! ASSISTÊNCIA SUA!",
    action: () => {
      playerStats.assists += 1;
      currentHomeScore += 1;
      playerStats.energy -= 10;
    },
    choices: [
      { text: "Avançar para o final do jogo", target: "end_game" }
    ]
  },
  end_game: {
    minute: "90'",
    text: "Fim de jogo! O apito final confirma o encerramento da partida com muita emoção.",
    action: () => {
      playerStats.matches += 1;
    },
    choices: [
      { text: "Jogar Nova Partida", target: "restart" }
    ]
  }
};

// Atualiza a tela de acordo com o nó atual
function goToNode(nodeKey) {
  if (nodeKey === 'restart') {
    resetMatch();
    return;
  }

  const node = storyNodes[nodeKey];

  // Executa efeitos do nó
  if (node.action) {
    node.action();
  }

  // Atualiza Interface
  scenarioText.innerText = node.text;
  matchMinute.innerText = `Minuto: ${node.minute}`;
  scoreDisplay.innerText = `${currentHomeScore} - ${currentAwayScore}`;
  
  updateStatsDisplay();

  // Renderiza Opções
  choicesContainer.innerHTML = '';
  node.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'btn-choice';
    btn.innerText = choice.text;
    btn.onclick = () => goToNode(choice.target);
    choicesContainer.appendChild(btn);
  });
}

function updateStatsDisplay() {
  statMatches.innerText = playerStats.matches;
  statGoals.innerText = playerStats.goals;
  statAssists.innerText = playerStats.assists;
  statEnergy.innerText = `${playerStats.energy}%`;
}

function resetMatch() {
  currentHomeScore = 0;
  currentAwayScore = 0;
  playerStats.energy = 100;
  goToNode('start');
}

// Inicializar o jogo na primeira carregada
goToNode('start');