import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// MAPA DE TRADUÇÃO: [Nome Bonito na Tela] -> [Sigla no Banco]
// Baseado exatamente no arquivo CSV que você enviou.
const BIBLE_BOOKS = [
    { name: "Gênesis", id: "Gênesis" },
    { name: "Êxodo", id: "Êx" },
    { name: "Levítico", id: "Levítico" },
    { name: "Números", id: "Números" },
    { name: "Deuteronômio", id: "Deuteronômio" },
    { name: "Josué", id: "Js" },
    { name: "Juízes", id: "Jz" },
    { name: "Rute", id: "Rt" },
    { name: "1 Samuel", id: "1Sm" },
    { name: "2 Samuel", id: "2Sm" },
    { name: "1 Reis", id: "1Rs" },
    { name: "2 Reis", id: "2Rs" },
    { name: "1 Crônicas", id: "1Cr" },
    { name: "2 Crônicas", id: "2Cr" },
    { name: "Esdras", id: "Ed" },
    { name: "Neemias", id: "Ne" },
    { name: "Ester", id: "Et" },
    { name: "Jó", id: "Jó" },
    { name: "Salmos", id: "Sl" },
    { name: "Provérbios", id: "Pv" },
    { name: "Eclesiastes", id: "Ec" },
    { name: "Cânticos", id: "Ct" },
    { name: "Isaías", id: "Is" },
    { name: "Jeremias", id: "Jr" },
    { name: "Lamentações", id: "Lm" },
    { name: "Ezequiel", id: "Ez" },
    { name: "Daniel", id: "Dn" },
    { name: "Oseias", id: "Os" },
    { name: "Joel", id: "Jl" },
    { name: "Amós", id: "Am" },
    { name: "Obadias", id: "Ob" },
    { name: "Jonas", id: "Jn" },
    { name: "Miqueias", id: "Mq" },
    { name: "Naum", id: "Na" },
    { name: "Habacuque", id: "Hc" },
    { name: "Sofonias", id: "Sf" },
    { name: "Ageu", id: "Ag" },
    { name: "Zacarias", id: "Zc" },
    { name: "Malaquias", id: "Ml" },
    // Novo Testamento
    { name: "Mateus", id: "Mt" },
    { name: "Marcos", id: "Mc" },
    { name: "Lucas", id: "Lc" },
    { name: "João", id: "Jo" },
    { name: "Atos", id: "At" },
    { name: "Romanos", id: "Rm" },
    { name: "1 Coríntios", id: "1Co" },
    { name: "2 Coríntios", id: "2Co" },
    { name: "Gálatas", id: "Gl" },
    { name: "Efésios", id: "Ef" },
    { name: "Filipenses", id: "Fp" },
    { name: "Colossenses", id: "Cl" },
    { name: "1 Tessalonicenses", id: "1Ts" },
    { name: "2 Tessalonicenses", id: "2Ts" },
    { name: "1 Timóteo", id: "1Tn" }, // Seu banco usa '1Tn'
    { name: "2 Timóteo", id: "2Tm" },
    { name: "Tito", id: "Tt" },
    { name: "Filemom", id: "Fm" },
    { name: "Hebreus", id: "Hb" },
    { name: "Tiago", id: "Tg" },
    { name: "1 Pedro", id: "1Pe" },
    { name: "2 Pedro", id: "2Pe" },
    { name: "1 João", id: "1Jo" },
    { name: "2 João", id: "2Jo" },
    { name: "3 João", id: "3Jo" },
    { name: "Judas", id: "Jd" },
    { name: "Apocalipse", id: "Ap" }
];

export const BibleAPI = {
    // Retorna a lista fixa e bonita, já mapeada para as siglas
    async getBooks() {
        return BIBLE_BOOKS;
    },

    // Recebe a SIGLA (ex: 'Mt') para buscar no banco
    async getChapter(bookId, chapterNum) {
        const { data, error } = await supabase
            .from('biblia_versiculos')
            .select('*')
            .eq('livro', bookId) // Busca pela sigla
            .eq('capitulo', chapterNum)
            .order('versiculo', { ascending: true });

        if (error) {
            console.error(`Erro ao buscar ${bookId} ${chapterNum}:`, error);
            return [];
        }
        return data;
    },

    // Recebe a SIGLA para buscar meta dados
    async getBookMeta(bookId) {
         const { data, error } = await supabase
            .from('biblia_versiculos')
            .select('capitulo')
            .eq('livro', bookId)
            .order('capitulo', { ascending: false })
            .limit(1);
        
        if (error || !data || data.length === 0) {
            return { chapters_count: 50 };
        }
        return { chapters_count: data[0].capitulo };
    },

    // Helper para reverter Sigla -> Nome (útil para títulos)
    getBookName(bookId) {
        const found = BIBLE_BOOKS.find(b => b.id === bookId);
        return found ? found.name : bookId;
    }
};