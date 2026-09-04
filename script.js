// Aguarda o DOM carregar completamente antes de rodar a lógica
document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    
    // Verifica se o usuário já possui uma preferência salva no navegador
    const savedTheme = localStorage.getItem("theme");

    // Se houver tema salvo, aplica imediatamente ao carregar a página
    if (savedTheme) {
        document.body.setAttribute("data-theme", savedTheme);
    } else {
        // Caso contrário, verifica se o sistema operacional prefere o modo escuro por padrão
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
            document.body.setAttribute("data-theme", "dark");
        }
    }

    // Escuta o clique no botão de alternância
    themeToggleBtn.addEventListener("click", () => {
        // Descobre o tema atual analisando o atributo do body
        const currentTheme = document.body.getAttribute("data-theme");
        
        if (currentTheme === "dark") {
            // Se for escuro, muda para o claro removendo o atributo
            document.body.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
        } else {
            // Se for claro, aplica o atributo "dark"
            document.body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
    });
});
