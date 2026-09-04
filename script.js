// ALTERNAR ENTRE ABAS PRINCIPAIS (JOGOS E EXPLORAR)
function switchMainTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.main-tab-content').forEach(tab => tab.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ABRIR MODAL DE DETALHES DA PARTIDA
function openMatchDetail(matchId) {
    document.getElementById('match-modal').style.display = 'flex';
}

// FECHAR MODAL
function closeMatchDetail() {
    document.getElementById('match-modal').style.display = 'none';
}

// ALTERNAR ABAS DENTRO DO DETALHE DA PARTIDA (ESTATÍSTICAS VS NOTAS)
function switchMatchTab(tabName) {
    document.querySelectorAll('.m-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.match-tab-content').forEach(tab => tab.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(`m-tab-${tabName}`).classList.add('active');
}

// SIMULAÇÃO DE ATUALIZAÇÃO AO VIVO EM TEMPO REAL
setInterval(() => {
    const timeElement = document.querySelector('.match-time');
    if(timeElement) {
        let currentMin = parseInt(timeElement.innerText);
        if(currentMin < 90) {
            currentMin += 1;
            timeElement.innerText = currentMin + "'";
        }
    }
}, 60000); // Atualiza a cada 1 minuto simulado