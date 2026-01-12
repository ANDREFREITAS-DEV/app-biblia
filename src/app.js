import { HomeUI } from './ui/home.ui.js';
import { BibleUI } from './ui/bible.ui.js';

class App {
    constructor() {
        this.mainContent = document.getElementById('main-content');
        this.initTheme();
        this.initRouter();
        this.bindEvents();
    }

    // Gerenciamento de Tema
    initTheme() {
        // O tema inicial já foi setado inline no HTML para performance
        // Aqui apenas ligamos o botão de toggle
        this.toggleBtn = document.getElementById('btn-theme');
    }

    toggleTheme() {
        const root = document.documentElement;
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', next);
        localStorage.setItem('app_theme', next);
    }

    // Roteador Simples Baseado em Hash
    initRouter() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute(); // Executa no load
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        
        // Limpa view anterior
        this.mainContent.innerHTML = '';

        switch(hash) {
            case 'home':
                HomeUI.render(this.mainContent);
                break;
            case 'bible':
                BibleUI.render(this.mainContent);
                break;
            default:
                HomeUI.render(this.mainContent);
        }

        this.updateNav(hash);
    }

    updateNav(hash) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            // Lógica simples de active state visual, se necessário
        });
    }

    bindEvents() {
        // Navegação
        document.getElementById('btn-home').addEventListener('click', () => window.location.hash = 'home');
        document.getElementById('btn-bible').addEventListener('click', () => window.location.hash = 'bible');
        
        // Tema
        document.getElementById('btn-theme').addEventListener('click', () => this.toggleTheme());
    }
}

// Inicializa o App quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new App();
});