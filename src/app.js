import { HomeUI } from './ui/home.ui.js';
import { BibleUI } from './ui/bible.ui.js';
import { AboutUI } from './ui/about.ui.js'; // <--- Adicione isso
class App {
    constructor() {
        this.mainContent = document.getElementById('main-content');
        this.initTheme();
        this.initRouter();
        this.bindEvents();
        this.initInstallPrompt(); // <--- NOVO
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
            case 'about': // <--- Adicione isso
                AboutUI.render(this.mainContent);
                break;

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
        document.getElementById('btn-about').addEventListener('click', () => window.location.hash = 'about');
        
        // Tema
        document.getElementById('btn-theme').addEventListener('click', () => this.toggleTheme());
    }

    // --- NOVA FUNÇÃO DE INSTALAÇÃO ---
    initInstallPrompt() {
        window.deferredPrompt = null;

        window.addEventListener('beforeinstallprompt', (e) => {
            // 1. Impede o banner automático
            e.preventDefault();
            // 2. Guarda o evento
            window.deferredPrompt = e;
            console.log('App pronto para instalar!');

            // 3. NOVO: Avisa todas as telas que o botão já pode aparecer
            window.dispatchEvent(new Event('app-ready-to-install'));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});