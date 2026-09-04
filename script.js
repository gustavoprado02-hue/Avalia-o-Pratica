// Base de dados de times/seleções com escudos via API pública de imagens
const teamsData = [
  { id: 'br', name: 'Brasil', flag: 'https://flagcdn.com/w80/br.png' },
  { id: 'ar', name: 'Argentina', flag: 'https://flagcdn.com/w80/ar.png' },
  { id: 'fr', name: 'França', flag: 'https://flagcdn.com/w80/fr.png' },
  { id: 'de', name: 'Alemanha', flag: 'https://flagcdn.com/w80/de.png' },
  { id: 'es', name: 'Espanha', flag: 'https://flagcdn.com/w80/es.png' },
  { id: 'pt', name: 'Portugal', flag: 'https://flagcdn.com/w80/pt.png' }
];

// Estado Global
let player = {
  name: "Craque",
  team: null,
  rival: null,
  matches: 0,
  goals: 0,
  assists: 0,
  stamina: 100
};

let matchState = {
  homeGoals: 0,
  awayGoals: 0,
  minute: 0
};

// Elementos DOM
const setupCard = document.getElementById('setup-card');
const gameScreen = document.getElementById('game-screen');
const userTeamSelect = document.getElementById('user-team-select');
const rivalTeamSelect = document.getElementById('rival-team-select');
const startGameBtn = document.getElementById('start-game-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

// Popular Selects de Times
function populateTeamSelects() {
  teamsData.forEach(team => {
    const opt1 = new Option(team.name, team.id);
    const opt2 = new Option(team.name, team.id);
    userTeamSelect.add(opt1);
    rivalTeamSelect.add(opt2);
  });
  rivalTeamSelect.selectedIndex = 1; // Selecionar segundo time por padrão
}

// Controle de Modo Escuro
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggleBtn.innerText = isDark ? "☀️ Modo Claro" : "🌙 Modo Escuro";
});

// Inicialização da Partida
startGameBtn.addEventListener('click', () => {
  const selectedUserTeamId = userTeamSelect.value;
  const selectedRivalTeamId = rivalTeamSelect.value;

  if (selectedUserTeamId === selectedRivalTeamId) {
    alert("Escolha times diferentes para o confronto!");
    return;
  }

  player.name = document.getElementById('player-name').value || "Craque";
  player.team = teamsData.find(t => t.id === selectedUserTeamId);
  player.rival = teamsData.find(t => t.id === selectedRivalTeamId);

  // Configurar Interface da Partida
  document.getElementById('home-name').innerText = player.team.name;
  document.getElementById('home-flag').src = player.team.flag;
  document.getElementById('away-name').innerText = player.rival.name;
  document.getElementById('away-flag').src = player.rival.flag;

  setupCard.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  resetMatch();
});

// Estrutura de Decisões Copero (Realista)
const eventTree = {
  start: {
    minute: "15'",
    getText: () => `${player.name} recebe no meio-campo. A marcação do ${player.rival.name} deixa espaço. Qual sua decisão?`,
    choices: [
      { text: "Tentar passe em profundidade", target: "deep_pass" },
      { text: "Arriscar chute forte de fora", target: "long_shot" },
      { text: "Cadenciar e tocar de lado", target: "keep_possession" }
    ]
  },
  deep_pass: {
    minute: "18'",
    getText: () => `Visão de jogo incrível! A bola passa entre os zagueiros. O ponta domina e cruza de volta para você na marca do pênalti!`,
    choices: [
      { text: "Chutar de primeira no canto", target: "goal_scored" },
      { text: "Dominar para tirar o zagueiro", target: "tackled" }
    ]
  },
  long_shot: {
    minute: "18'",
    getText: () => `Você solta uma bomba! A bola curva no ar, o goleiro espalma e ela fica viva dentro da grande área!`,
    choices: [
      { text: "Correr para pegar o rebote", target: "rebound_goal" },
      { text: "Reclamar de escanteio com o juiz", target: "yellow_card" }
    ]
  },
  keep_possession: {
    minute: "30'",
    getText: () => `O jogo fica truncado no meio-campo. O ${player.rival.name} consegue um contra-ataque rápido e abre o placar.`,
    action: () => { matchState.awayGoals += 1; player.stamina -= 10; },
    choices: [
      { text: "Pedir a bola e organizar o ataque", target: "penalty_drawn" }
    ]
  },
  goal_scored: {
    minute: "20'",
    getText: () => `GOOOOOOOOL DO ${player.team.name.toUpperCase()}! Finalização perfeita no canto sem chances de defesa!`,
    action: () => { matchState.homeGoals += 1; player.goals += 1; player.stamina -= 15; },
    choices: [{ text: "Avançar para o 2º Tempo", target: "second_half" }]
  },
  rebound_goal: {
    minute: "20'",
    getText: () => `Você antecipa o zagueiro e empurra para as redes! GOL DE CENTROAVANTE!`,
    action: () => { matchState.homeGoals += 1; player.goals += 1; player.stamina -= 15; },
    choices: [{ text: "Avançar para o 2º Tempo", target: "second_half" }]
  },
  tackled: {
    minute: "20'",
    getText: () => `Você demorou para finalizar e o zagueiro travou no momento exato.`,
    action: () => { player.stamina -= 10; },
    choices: [{ text: "Avançar para o 2º Tempo", target: "second_half" }]
  },
  yellow_card: {
    minute: "20'",
    getText: () => `O juiz não gosta da reclamação e te dá um Cartão Amarelo por reclamação!`,
    action: () => { player.stamina -= 5; },
    choices: [{ text: "Avançar para o 2º Tempo", target: "second_half" }]
  },
  penalty_drawn: {
    minute: "40'",
    getText: () => `Você invade a área, toma um rapa por trás e O JUIZ APITA PÊNALTI! Você mesmo assume a cobrança.`,
    choices: