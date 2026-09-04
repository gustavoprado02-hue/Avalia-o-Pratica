// ESTADO GLOBAL DO JOGO (MODO CARREIRA)
let careerData = {
    managerName: "Arthur Silva",
    teamName: "Real Madrid",
    teamLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
    league: "Espanha",
    level: 1,
    reputation: 60,
    salary: 50000,
    trophies: 0,
    energy: 100,
    morale: 90,
    stats: {
        goals: 0,
        assists: 0,
        matches: 0,
        rating: 7.2
    }
};

// DADOS DA LIGA & PARTIDAS
let opponents = [
    { name: "Atlético Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2024_logo.svg" },
    { name: "Valencia CF", logo: "https://upload.wikimedia.org/wikipedia/en/c/ce/Valencia_CF_Logo.svg" },
    { name: "Sevilla FC", logo: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg" },
    { name: "Villarreal CF", logo: "https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg" }
];

let currentOpponent = opponents[0];

let standings = [
    { pos: 1, name: "Real Madrid", p: 12, v: 4, e: 0, d: 0, sg: 11, pts: 12 },
    { pos: 2, name: "FC Barcelona", p: 12, v: 3, e: 1, d: 0, sg: 8, pts: 10 },
    { pos: 3, name: "Atlético Madrid", p: 12, v: 2, e: 2, d: 0, sg: 4, pts: 8 },
    { pos: 4, name: "Valencia CF", p: 12, v: 1, e: 1, d: 2, sg: -3, pts: 4 }
];

let matchInterval = null;
let currentMinute = 0;
let homeScore = 0;
let awayScore = 0;
let currentDecisionCallback = null;

// SELEÇÃO DE TIME NA TELA DE SETUP
function selectTeam(name, logo, league) {
    document.querySelectorAll('.team-option').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    careerData.teamName = name;
    careerData.teamLogo = logo;
    careerData.league = league;
}

// INICIAR A CARREIRA
function startCareer() {
    const nameInput = document.getElementById('manager-name').value.trim();
    if(nameInput) {
        careerData.managerName = nameInput;
    }

    // Atualiza UI do Header
    document.getElementById('header-manager').innerText = careerData.managerName;
    document.getElementById('header-team-name').innerText = careerData.teamName;
    document.getElementById('header-team-logo').src = careerData.teamLogo;
    document.getElementById('header-level').innerText = careerData.level;

    // Configura Próximo Jogo
    currentOpponent = opponents[Math.floor(Math.random() * opponents.length)];
    document.getElementById('nm-home').innerText = careerData.teamName;
    document.getElementById('nm-away').innerText = currentOpponent.name;

    // Transição de Telas
    document.getElementById('setup-screen').classList.remove('active');
    document.getElementById('career-screen').classList.add('active');

    updateUI();
    renderStandings();
}

// TROCAR ABAS
function switchTab(tabId) {
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ATUALIZAR INTERFACE GERAL
function updateUI() {
    document.getElementById('rep-val').innerText = careerData.reputation;
    document.getElementById('sal-val').innerText = careerData.salary.toLocaleString();
    document.getElementById('trophy-val').innerText = careerData.trophies;

    document.getElementById('energy-txt').innerText = careerData.energy + '%';
    document.getElementById('energy-fill').style.width = careerData.energy + '%';

    document.getElementById('morale-txt').innerText = careerData.morale + '%';
    document.getElementById('morale-fill').style.width = careerData.morale + '%';

    // Estatísticas Pessoais
    document.getElementById('st-goals').innerText = careerData.stats.goals;
    document.getElementById('st-assists').innerText = careerData.stats.assists;
    document.getElementById('st-matches').innerText = careerData.stats.matches;
    document.getElementById('st-rating').innerText = careerData.stats.rating.toFixed(1);
}

// SIMULADOR DE PARTIDA EM TEMPO REAL
function startMatchSimulation() {
    const startBtn = document.getElementById('start-match-btn');
    startBtn.style.display = 'none';

    // Configurar Placar e Logos
    document.getElementById('match-home-name').innerText = careerData.teamName;
    document.getElementById('match-home-logo').src = careerData.teamLogo;
    document.getElementById('match-away-name').innerText = currentOpponent.name;
    document.getElementById('match-away-logo').src = currentOpponent.logo;

    homeScore = 0;
    awayScore = 0;
    currentMinute = 0;
    document.getElementById('score-home').innerText = homeScore;
    document.getElementById('score-away').innerText = awayScore;
    
    const feed = document.getElementById('live-feed');
    feed.innerHTML = `<div class="feed-item">Apito inicial! A bola rola para este grande duelo.</div>`;

    matchInterval = setInterval(() => {
        currentMinute += 3;
        if(currentMinute > 90) currentMinute = 90;
        document.getElementById('match-timer').innerText = currentMinute + "'";

        // Eventos aleatórios baseados no minuto
        if(currentMinute === 18) {
            addFeedItem("18' Boa troca de passes no meio-campo conduzida por " + careerData.managerName + ".");
        } else if(currentMinute === 34) {
            triggerDecision(
                "Oportunidade de Ouro na Entrada da Área!",
                "Você recebeu passe livre pelo meio. O zagueiro aperta a marcação. O que fazer?",
                [
                    { text: "Chutar forte colocado no ângulo!", action: () => resolveDecision('goal_shot') },
                    { text: "Dar passe milimétrico para o centroavante livre", action: () => resolveDecision('assist_play') },
                    { text: "Tentar drible individual arriscado", action: () => resolveDecision('skill_play') }
                ]
            );
            return; // Pausa o relógio enquanto toma decisão
        } else if(currentMinute === 56) {
            addFeedItem("56' Jogo disputado intensamente no setor defensivo.");
        } else if(currentMinute === 72) {
            triggerDecision(
                "Pressão do Adversário na Reta Final!",
                "O time rival avança com perigo pela ponta esquerda e cruza na área.",
                [
                    { text: "Dar carrinho preciso na bola para desarmar", action: () => resolveDecision('defend_good') },
                    { text: "Fazer falta tática para evitar o lance", action: () => resolveDecision('yellow_card') }
                ]
            );
            return;
        } else if(currentMinute >= 90) {
            clearInterval(matchInterval);
            endMatch();
        }
    }, 1200);
}

function addFeedItem(text, type = '') {
    const feed = document.getElementById('live-feed');
    const item = document.createElement('div');
    item.className = `feed-item ${type}`;
    item.innerText = text;
    feed.appendChild(item);
    feed.scrollTop = feed.scrollHeight;
}

// SISTEMA DE DECISÕES
function triggerDecision(title, desc, options) {
    clearInterval(matchInterval); // Pausa simulação
    document.getElementById('decision-title').innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${title}`;
    document.getElementById('decision-desc').innerText = desc;
    
    const container = document.getElementById('decision-options');
    container.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'dec-btn';
        btn.innerText = opt.text;
        btn.onclick = () => {
            document.getElementById('decision-panel').classList.add('hidden');
            opt.action();
        };
        container.appendChild(btn);
    });

    document.getElementById('decision-panel').classList.remove('hidden');
}

function resolveDecision(type) {
    if(type === 'goal_shot') {
        if(Math.random() > 0.3) {
            homeScore++;
            careerData.stats.goals++;
            addFeedItem(`GOOOOL! Golaço espetacular de ${careerData.managerName}!`, 'goal');
        } else {
            addFeedItem(`Chuta com força, mas o goleiro espalma para escanteio!`);
        }
    } else if(type === 'assist_play') {
        if(Math.random() > 0.2) {
            homeScore++;
            careerData.stats.assists++;
            addFeedItem(`GOOOOL! Passe perfeito para o companheiro estufar a rede!`, 'goal');
        } else {
            addFeedItem(`A zaga corta o passe no último segundo.`);
        }
    } else if(type === 'skill_play') {
        if(Math.random() > 0.5) {
            addFeedItem(`Drible desconcertante! O estádio vai ao delírio com sua técnica.`);
        } else {
            addFeedItem(`Perda de bola no ataque, contra-ataque cedido.`);
            awayScore += (Math.random() > 0.6 ? 1 : 0);
        }
    } else if(type === 'defend_good') {
        addFeedItem(`Desarme perfeito! Você recupera a posse de bola para sua equipe.`);
    } else if(type === 'yellow_card') {
        addFeedItem(`Cartão amarelo aplicado pelo árbitro pela falta tática.`, 'card-yellow');
        careerData.reputation -= 2;
    }

    document.getElementById('score-home').innerText = homeScore;
    document.getElementById('score-away').innerText = awayScore;

    // Retomar relógio do jogo
    matchInterval = setInterval(() => {
        currentMinute += 4;
        if(currentMinute >= 90) {
            currentMinute = 90;
            document.getElementById('match-timer').innerText = "90'";
            clearInterval(matchInterval);
            endMatch();
            return;
        }
        document.getElementById('match-timer').innerText = currentMinute + "'";
    }, 1200);
}

// FIM DA PARTIDA
function endMatch() {
    careerData.stats.matches++;
    let resultText = "";
    if(homeScore > awayScore) {
        resultText = `Vitória por ${homeScore}x${awayScore}! Excelente desempenho.`;
        careerData.reputation += 5;
        careerData.morale = Math.min(100, careerData.morale + 5);
        careerData.salary += 2000;
        updateStandingsData(3);
    } else if(homeScore === awayScore) {
        resultText = `Empate em ${homeScore}x${awayScore}. Jogo equilibrado.`;
        careerData.morale = Math.max(0, careerData.morale - 2);
        updateStandingsData(1);
    } else {
        resultText = `Derrota dolorosa por ${homeScore}x${awayScore}. Pressão da torcida aumenta.`;
        careerData.reputation -= 3;
        careerData.morale = Math.max(0, careerData.morale - 10);
        updateStandingsData(0);
    }

    // Exibir Modal
    document.getElementById('modal-result-text').innerText = resultText;
    document.getElementById('modal-details').innerText = `Você acumulou estatísticas para sua carreira profissional.`;
    document.getElementById('match-modal').style.display = 'flex';
}

function closeMatchModal() {
    document.getElementById('match-modal').style.display = 'none';
    document.getElementById('start-match-btn').style.display = 'block';
    document.getElementById('decision-panel').classList.add('hidden');
    
    // Trocar para aba Hub
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    document.querySelector('.sidebar-menu button:first-child').classList.add('active');
    document.getElementById('tab-hub').classList.add('active');

    // Mudar próximo oponente
    currentOpponent = opponents[Math.floor(Math.random() * opponents.length)];
    document.getElementById('nm-home').innerText = careerData.teamName;
    document.getElementById('nm-away').innerText = currentOpponent.name;

    careerData.energy = Math.max(40, careerData.energy - 15);
    updateUI();
    renderStandings();
}

// ATUALIZAR TABELA DA LIGA
function updateStandingsData(pointsEarned) {
    let teamRow = standings.find(s => s.name === careerData.teamName);
    if(teamRow) {
        teamRow.p++;
        teamRow.pts += pointsEarned;
        if(pointsEarned === 3) teamRow.v++;
        if(pointsEarned === 1) teamRow.e++;
        if(pointsEarned === 0) teamRow.d++;
    }
    // Ordenar por pontos
    standings.sort((a,b) => b.pts - a.pts);
    standings.forEach((item, idx) => item.pos = idx + 1);
}

function renderStandings() {
    const tbody = document.getElementById('standings-body');
    tbody.innerHTML = '';
    standings.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>${s.pos}</b></td>
            <td style="text-align: left;">${s.name}</td>
            <td>${s.p}</td>
            <td>${s.v}</td>
            <td>${s.e}</td>
            <td>${s.d}</td>
            <td>${s.sg}</td>
            <td><b>${s.pts}</b></td>
        `;
        tbody.appendChild(tr);
    });
}