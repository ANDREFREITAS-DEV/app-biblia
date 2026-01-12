import { DailyAPI } from '../api/daily.api.js';
import { shareContent } from '../utils/share.js';

export const HomeUI = {
    async render(container) {
        container.innerHTML = '<div class="loading-spinner">Carregando devocional...</div>';
        
        try {
            const daily = await DailyAPI.getDailyVerse();
            // Imagem padrão de fallback (natureza abstrata)
            const imgUrl = daily.image_url 
                ? DailyAPI.getDailyImageURL(daily.image_url) 
                : 'https://images.unsplash.com/photo-1507692049790-de58293a469d?w=800&q=80';

            const html = `
                <div class="card">
                    <h2>Versículo do Dia</h2>
                    <img src="${imgUrl}" alt="Imagem do dia" class="verse-day-img" loading="lazy">
                    <blockquote class="verse-text">"${daily.text}"</blockquote>
                    <span class="verse-ref">${daily.reference}</span>
                    
                    <div class="action-bar">
                        <button id="btn-share-daily" class="btn-primary">Compartilhar</button>
                    </div>
                </div>

                <div class="card">
                    <h3>Seu Progresso</h3>
                    <p>Continue sua leitura de onde parou.</p>
                    <br>
                    <button class="btn-outline" onclick="window.location.hash = '#bible'">Ir para Leitura</button>
                </div>
            `;

            container.innerHTML = html;

            // Event Listeners
            document.getElementById('btn-share-daily').addEventListener('click', () => {
                shareContent('Versículo do Dia', `"${daily.text}" - ${daily.reference}`, imgUrl);
            });

        } catch (e) {
            container.innerHTML = `<div class="card error">Erro ao carregar: ${e.message}</div>`;
        }
    }
};