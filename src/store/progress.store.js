const KEY_PROGRESS = 'bible_progress';

export const ProgressStore = {
    // Retorna array de strings "bookId:chapter"
    getReadChapters() {
        const stored = localStorage.getItem(KEY_PROGRESS);
        return stored ? JSON.parse(stored) : [];
    },

    markAsRead(bookId, chapter) {
        const list = this.getReadChapters();
        const id = `${bookId}:${chapter}`;
        if (!list.includes(id)) {
            list.push(id);
            localStorage.setItem(KEY_PROGRESS, JSON.stringify(list));
        }
    },

    isRead(bookId, chapter) {
        const list = this.getReadChapters();
        return list.includes(`${bookId}:${chapter}`);
    }
};