import { BibleAPI } from '../api/bible.api.js';
import { FavoritesStore } from '../store/favorites.store.js';
import { ProgressStore } from '../store/progress.store.js';

export const BibleUI = {
    state: {
        view: 'books', 
        selectedBookId: null,   // Guarda a SIGLA (ex: "Mt")
        selectedBookName: null, // Guarda o NOME (ex: "Mateus")
        selectedChapter: 1
    },

    async render(container) {
        this.container = container;
        this.updateView();
    },

    async updateView() {
        this.container.innerHTML = '<div class="loading-spinner">Carregando...</div>';

        if (this.state.view === 'books') {
            await this.renderBooks();
        } else if (this.state.view === 'chapters') {
            await this.renderChapters();
        } else if (this.state.view === 'reader') {
            await this.renderReader();
        }
    },

    async renderBooks() {
        // Pega nossa lista mapeada e bonita
        const books = await BibleAPI.getBooks();
        
        let html = `<h2>Livros</h2><div class="grid-list">`;
        books.forEach(book => {
            // data-id leva a sigla (Mt), mas o texto mostra o nome (Mateus)
            html += `<div class="list-item" data-id="${book.id}" data-name="${book.name}">${book.name}</div>`;
        });
        html += `</div>`;
        
        this.container.innerHTML = html;

        this.container.querySelectorAll('.list-item').forEach(el => {
            el.addEventListener('click', () => {
                this.state.selectedBookId = el.dataset.id;
                this.state.selectedBookName = el.dataset.name;
                this.state.view = 'chapters';
                this.updateView();
            });
        });
    },

    async renderChapters() {
        // Usa a SIGLA para perguntar ao banco quantos capítulos tem
        const meta = await BibleAPI.getBookMeta(this.state.selectedBookId);
        const total = meta.chapters_count;

        let html = `
            <button class="btn-outline" id="back-books">← Voltar</button>
            <h2>${this.state.selectedBookName}</h2> <div class="grid-list">
        `;
        
        for (let i = 1; i <= total; i++) {
            // Verifica progresso usando a SIGLA para garantir unicidade
            const isRead = ProgressStore.isRead(this.state.selectedBookId, i);
            const style = isRead ? 'background: var(--bg-surface-elevated); opacity: 0.7; border-color: var(--accent);' : '';
            html += `<div class="list-item" style="${style}" data-chapter="${i}">${i}</div>`;
        }
        html += `</div>`;

        this.container.innerHTML = html;

        document.getElementById('back-books').addEventListener('click', () => {
            this.state.view = 'books';
            this.updateView();
        });

        this.container.querySelectorAll('.list-item').forEach(el => {
            el.addEventListener('click', () => {
                this.state.selectedChapter = el.dataset.chapter;
                this.state.view = 'reader';
                this.updateView();
            });
        });
    },

    async renderReader() {
        // Busca versículos usando a SIGLA
        const verses = await BibleAPI.getChapter(this.state.selectedBookId, this.state.selectedChapter);
        
        let html = `
            <div class="action-bar">
                <button class="btn-outline" id="back-chapters">← Capítulos</button>
                <button class="btn-primary" id="mark-read">Marcar Lido</button>
            </div>
            <h3 style="margin-top: 1rem;">${this.state.selectedBookName} ${this.state.selectedChapter}</h3>
            <div class="reader-content">
        `;

        if (!verses || verses.length === 0) {
            html += `<p style="padding: 1rem; text-align: center;">Nenhum versículo encontrado para este capítulo.</p>`;
        } else {
            verses.forEach(v => {
                const isFav = FavoritesStore.isFavorite(v.livro, v.capitulo, v.versiculo);
                const favClass = isFav ? 'color: var(--accent);' : 'color: var(--text-muted);';
                
                html += `
                    <div class="reader-verse">
                        <span class="verse-num">${v.versiculo}</span>
                        <span class="text">${v.texto}</span>
                        <button class="fav-btn" style="float: right; ${favClass}" 
                            data-livro="${v.livro}" 
                            data-capitulo="${v.capitulo}" 
                            data-versiculo="${v.versiculo}"
                            data-texto="${v.texto}">
                            ★
                        </button>
                    </div>
                `;
            });
        }
        html += `</div>`;

        this.container.innerHTML = html;

        // Listeners
        document.getElementById('back-chapters').addEventListener('click', () => {
            this.state.view = 'chapters';
            this.updateView();
        });

        document.getElementById('mark-read').addEventListener('click', () => {
            ProgressStore.markAsRead(this.state.selectedBookId, this.state.selectedChapter);
            alert('Capítulo marcado como lido!');
            this.state.view = 'chapters';
            this.updateView();
        });

        this.container.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const v = btn.dataset;
                const verseObj = { 
                    book_id: v.livro, 
                    chapter: v.capitulo, 
                    verse: v.versiculo,
                    text: v.texto
                };
                FavoritesStore.toggleFavorite(verseObj);
                this.renderReader(); 
            });
        });
    }
};