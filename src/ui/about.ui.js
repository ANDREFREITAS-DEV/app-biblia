import { shareContent } from '../utils/share.js';

export const AboutUI = {
    render(container) {
        const appIconUrl = '/assets/icons/icon-512.png'; 
        // 🟢 SEU PIX AQUI
        const PIX_KEY = "11999999999"; 

        const html = `
            <div class="card" style="text-align: center; padding: 2rem 1rem;">
                <img src="${appIconUrl}" alt="Bíblia PWA" style="width: 80px; height: 80px; border-radius: 20px; margin-bottom: 1rem; box-shadow: var(--shadow);">
                
                <h2 style="margin-bottom: 0.5rem;">Bíblia PWA</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Versão 1.0.0</p>

                <p style="margin-bottom: 1.5rem; line-height: 1.8;">
                    Leitura bíblica simples, rápida e 100% offline. 
                    Sem anúncios, focado apenas na Palavra.
                </p>

                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                    
                    <button id="btn-install" class="btn-primary" style="display: none; align-items: center; justify-content: center; gap: 10px; padding: 12px; background-color: var(--text); color: var(--bg);">
                        <span style="font-size: 1.2rem;">⬇️</span> Instalar Aplicativo
                    </button>

                    <button id="btn-share-app" class="btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px;">
                        <span style="font-size: 1.2rem;">📲</span> Compartilhar com Amigos
                    </button>

                    <button id="btn-pix" class="btn-outline" style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; border: 1px solid var(--accent); color: var(--accent);">
                        <span>☕</span> Apoiar com PIX
                    </button>
                </div>

                <div id="ios-hint" style="display: none; background: var(--bg-surface-elevated); padding: 1rem; border-radius: 8px; font-size: 0.9rem; margin-bottom: 2rem;">
                    Para instalar no <strong>iPhone</strong>:<br>
                    Toque em <strong>Compartilhar</strong> (quadrado com seta) e depois em <strong>"Adicionar à Tela de Início"</strong>.
                </div>

                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2rem;">
                    <p>Feito com ❤️</p>
                    <br>
                    <button id="btn-back-home" style="text-decoration: underline; color: var(--text-muted);">Voltar para Início</button>
                </div>
            </div>
        `;

        // 1. INJETA O HTML NA TELA (Obrigatório fazer isso antes de pegar os IDs)
        container.innerHTML = html;

        // ============================================================
        // LÓGICA DE INSTALAÇÃO (Versão Reativa - Corrige o Bug de sumir)
        // ============================================================
        const btnInstall = document.getElementById('btn-install');
        const iosHint = document.getElementById('ios-hint');
        
        // Função auxiliar para mostrar o botão
        const showInstallButton = () => {
            if (window.deferredPrompt) {
                btnInstall.style.display = 'flex';
                iosHint.style.display = 'none';
            }
        };

        // Tenta mostrar agora (se já estiver pronto)
        showInstallButton();

        // Fica ouvindo se ficar pronto depois (Reatividade)
        window.addEventListener('app-ready-to-install', showInstallButton);

        // Clique do Botão Instalar
        btnInstall.addEventListener('click', async () => {
            const promptEvent = window.deferredPrompt;
            if (!promptEvent) return;
            
            promptEvent.prompt(); 
            const result = await promptEvent.userChoice;
            console.log('Escolha:', result.outcome);
            
            window.deferredPrompt = null;
            btnInstall.style.display = 'none';
        });

        // Dica iOS
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        if (isIOS && !window.deferredPrompt) {
            iosHint.style.display = 'block';
        }

        // ============================================================
        // OUTROS EVENTOS (Compartilhar, Voltar, Pix)
        // ============================================================

        // Voltar
        document.getElementById('btn-back-home').addEventListener('click', () => {
            window.location.hash = 'home';
        });

        // Compartilhar App
        document.getElementById('btn-share-app').addEventListener('click', async () => {
            const btn = document.getElementById('btn-share-app');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Gerando card...';
            
            const inviteText = `Baixe agora a Bíblia PWA: leitura offline e versículo do dia!\n\nSimples e sem anúncios.`;
            await shareContent('Bíblia PWA', inviteText, appIconUrl);
            
            btn.innerHTML = originalText;
        });

        // Copiar PIX
        document.getElementById('btn-pix').addEventListener('click', () => {
            const btn = document.getElementById('btn-pix');
            navigator.clipboard.writeText(PIX_KEY).then(() => {
                const originalContent = btn.innerHTML;
                btn.innerHTML = `<span>✅</span> Chave Copiada!`;
                btn.style.borderColor = 'green';
                btn.style.color = 'green';
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.borderColor = 'var(--accent)';
                    btn.style.color = 'var(--accent)';
                }, 2000);
            });
        });
    }
};