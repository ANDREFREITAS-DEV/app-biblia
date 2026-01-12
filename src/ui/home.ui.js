import { DailyAPI } from '../api/daily.api.js';
import { shareContent } from '../utils/share.js';

export const HomeUI = {
    async render(container) {
        container.innerHTML = '<div class="loading-spinner">Buscando inspiração...</div>';
        
        try {
            const daily = await DailyAPI.getDailyVerse();
            
            // Define imagem (Supabase ou Fallback)
            const imgUrl = daily.image_url 
                ? daily.image_url 
                : 'https://images.unsplash.com/photo-1507692049790-de58293a469d?w=800&q=80';

            const html = `
                <div class="card" style="text-align: center;">
                    <h2 style="margin-bottom: 1rem;">Palavra do Momento</h2>
                    
                    <div style="position: relative; margin-bottom: 1rem;">
                        <img src="${imgUrl}" alt="Imagem devocional" class="verse-day-img" style="min-height: 250px; object-fit: cover;">
                    </div>

                    <blockquote class="verse-text" style="font-size: 1.4rem;">"${daily.text}"</blockquote>
                    <span class="verse-ref" style="display: block; margin-top: 0.5rem; font-weight: bold;">${daily.reference}</span>
                    
                    <div class="action-bar" style="justify-content: center; margin-top: 1.5rem;">
                        <button id="btn-share-daily" class="btn-primary" style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.2rem;">📤</span> Compartilhar Imagem
                        </button>
                        <button id="btn-reload" class="btn-outline" aria-label="Nova Mensagem">
                            ↻ Outra
                        </button>
                    </div>
                </div>

                <div class="card">
                    <h3>Leitura Bíblica</h3>
                    <p>Continue de onde parou ou inicie um novo livro.</p>
                    <br>
                    <button class="btn-outline" style="width: 100%" onclick="window.location.hash = '#bible'">Ir para a Bíblia</button>
                </div>
            `;

            container.innerHTML = html;

            // --- EVENTO DE COMPARTILHAR ---
            document.getElementById('btn-share-daily').addEventListener('click', async () => {
                const btn = document.getElementById('btn-share-daily');
                const originalText = btn.innerHTML;
                btn.textContent = 'Baixando e Enviando...';
                
                // OBSERVAÇÃO: Aqui removemos qualquer URL do texto para evitar link azul
                const shareText = `"${daily.text}"\n— ${daily.reference}`;
                
                // Enviamos (Título, Texto Limpo, URL da Imagem para download)
                await shareContent('Versículo do Dia', shareText, imgUrl);
                
                btn.innerHTML = originalText;
            });

            document.getElementById('btn-reload').addEventListener('click', () => {
                this.render(container);
            });

        } catch (e) {
            console.error(e);
            container.innerHTML = `<div class="card error">
                <p>Não foi possível carregar a mensagem agora.</p>
                <button class="btn-primary" onclick="location.reload()">Tentar Novamente</button>
            </div>`;
        }
    }
};