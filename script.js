// BANCO DE DADOS GLOBAL DOS JOGADORES DO PLANETA
const globalPlayersData = [
    { id: 0, name: "Erling Haaland", team: "Manchester City • Premier League", pos: "ATA", goals: "38G / 6A", market: "€ 180.0M", rating: "9.24", ovr: 92, img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=200" },
    { id: 1, name: "Kylian Mbappé", team: "Real Madrid • La Liga", pos: "ATA", goals: "41G / 5A", market: "€ 180.0M", rating: "9.18", ovr: 93, img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=200" },
    { id: 2, name: "Jude Bellingham", team: "Real Madrid • La Liga", pos: "MEI", goals: "22G / 14A", market: "€ 180.0M", rating: "9.12", ovr: 92, img: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=200" },
    { id: 3, name: "Vinicius Jr", team: "Real Madrid • La Liga", pos: "ATA", goals: "26G / 15A", market: "€ 200.0M", rating: "9.10", ovr: 92, img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200" },
    { id: 4, name: "Rodri", team: "Manchester City • Premier League", pos: "MEI", goals: "9G / 12A", market: "€ 130.0M", rating: "8.95", ovr: 91, img: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=200" },
    { id: 5, name: "Lamine Yamal", team: "FC Barcelona • La Liga", pos: "ATA", goals: "18G / 20A", market: "€ 150.0M", rating: "8.90", ovr: 88, img: "https://images.unsplash.com/photo-1628891016460-1517203b4474?auto=format&fit=crop&q=80&w=200" }
];

// NAVEGAÇÃO DE TÓPICOS
function switchView(viewId, btnElement) {
    document.querySelectorAll('.section-view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`view-${viewId}`).classList.add('active');
    if(btnElement) btnElement.classList.add('active');
}

// ALTERNAR MODO ESCURO / CLARO
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    if(html.getAttribute('data-theme') === 'dark') {
        html.setAttribute('data-theme', 'light');
        icon.className = 'fa-solid fa-sun';
    } else {
        html.setAttribute('data-theme', 'dark');
        icon.className = 'fa-solid fa-moon';
    }
}

// RENDERIZAR TABELA GLOBAL
function renderGlobalTable(data) {
    const tbody = document.getElementById('players-table-body');
    tbody.innerHTML = '';
    data.forEach(p => {
        const tr = document.createElement('tr');
        tr.onclick = () => openPlayerModal(p.id);
        tr.innerHTML = `
            <td>
                <div class="player-info-cell">
                    <img src="${p.img}" alt="${p.name}">
                    <span>${p.name}</span>
                </div>
            </td>
            <td>${p.team}</td>
            <td><b>${p.pos}</b></td>
            <td>${p.goals}</td>
            <td><b>${p.market}</b></td>
            <td><span class="rating-badge">${p.rating}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// FILTRAR JOGADORES GLOBALMENTE
function filterPlayers() {
    const query = document.getElementById('player-search').value.toLowerCase();
    const filtered = globalPlayersData.filter(p => p.name.toLowerCase().includes(query) || p.team.toLowerCase().includes(query));
    renderGlobalTable(filtered);
}

// RENDERIZAR CARDS FC27
function renderFC27Grid() {
    const grid = document.getElementById('fc27-grid');
    grid.innerHTML = '';
    globalPlayersData.forEach(p => {
        const card = document.createElement('div');
        card.className = 'fc27-player-card';
        card.onclick = () => openPlayerModal(p.id);
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <span class="fc27-pos">${p.pos}</span>
            <div class="fc27-ovr">${p.ovr}</div>
            <img src="${p.img}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin: 10px auto; border: 2px solid var(--border);" alt="${p.name}">
            <div class="fc27-name">${p.name}</div>
            <p style="font-size: 0.75rem; color: var(--text-muted);">${p.market}</p>
        `;
        grid.appendChild(card);
    });
}

// ABRIR LOCAL DINÂMICO (MODAL DE JOGADOR)
function openPlayerModal(id) {
    const p = globalPlayersData.find(item => item.id === id);
    if(!p) return;

    document.getElementById('modal-img').src = p.img;
    document.getElementById('modal-name').innerText = p.name;
    document.getElementById('modal-team').innerText = p.team;
    document.getElementById('modal-rating').innerText = p.rating;
    document.getElementById('modal-market').innerText = p.market;
    document.getElementById('modal-ovr').innerText = p.ovr;

    document.getElementById('player-modal').style.display = 'flex';
}

function closePlayerModal() {
    document.getElementById('player-modal').style.display = 'none';
}

// Inicialização ao carregar a página
window.onload = () => {
    renderGlobalTable(globalPlayersData);
    renderFC27Grid();
};