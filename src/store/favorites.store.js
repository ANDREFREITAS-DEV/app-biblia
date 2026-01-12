const KEY_FAVS = 'bible_favorites';

export const FavoritesStore = {
    getAll() {
        const stored = localStorage.getItem(KEY_FAVS);
        return stored ? JSON.parse(stored) : [];
    },

    toggleFavorite(verseData) {
        let list = this.getAll();
        // Identificador único
        const id = `${verseData.book_id}:${verseData.chapter}:${verseData.verse}`;
        
        const index = list.findIndex(v => `${v.book_id}:${v.chapter}:${v.verse}` === id);

        if (index >= 0) {
            list.splice(index, 1); // Remove
        } else {
            list.push(verseData); // Adiciona
        }
        localStorage.setItem(KEY_FAVS, JSON.stringify(list));
    },

    isFavorite(bookId, chapter, verse) {
        const list = this.getAll();
        return list.some(v => v.book_id == bookId && v.chapter == chapter && v.verse == verse);
    }
};