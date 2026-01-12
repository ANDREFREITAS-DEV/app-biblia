import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';
import { BibleAPI } from './bible.api.js';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const DailyAPI = {
    async getDailyVerse() {
        // 1. Busca TODOS os versículos curados da tabela 'versiculo_do_dia'
        // Como são apenas algumas centenas, é muito rápido e barato baixar tudo.
        const { data: versesList, error } = await supabase
            .from('versiculo_do_dia')
            .select('*');

        if (error || !versesList || versesList.length === 0) {
             console.error("Erro ou lista vazia:", error);
             // Fallback local caso a internet falhe ou banco esteja vazio
             return {
                 text: "O Senhor é o meu pastor, nada me faltará.",
                 reference: "Salmos 23:1",
                 image_url: null 
             };
        }

        // 2. Sorteia UM versículo aleatório da lista
        const randomIndex = Math.floor(Math.random() * versesList.length);
        const randomVerse = versesList[randomIndex];

        // 3. Busca o TEXTO completo na tabela de bíblia (pois versiculo_do_dia só tem a referência)
        // Precisamos traduzir o nome do livro se ele estiver abreviado na tabela do dia
        // Mas pelo seu CSV, parece que na tabela do dia está "Hebreus" (bonito), e na biblia está "Hb" (sigla).
        // Vamos tentar buscar direto. Se falhar, tentamos converter.
        
        let textData = null;
        
        // Tentativa 1: Busca direta (Assumindo que o nome do livro bate)
        const { data: v1 } = await supabase
            .from('biblia_versiculos')
            .select('texto')
            .eq('livro', randomVerse.livro) // Tenta "Hebreus"
            .eq('capitulo', randomVerse.capitulo)
            .eq('versiculo', randomVerse.versiculo)
            .single();
            
        textData = v1;

        // Tentativa 2: Se falhou, pode ser que 'Hebreus' precise virar 'Hb'
        if (!textData) {
            // Procura a SIGLA baseada no nome
            const bookMap = await BibleAPI.getBooks(); 
            const foundBook = bookMap.find(b => b.name === randomVerse.livro);
            
            if (foundBook) {
                const { data: v2 } = await supabase
                    .from('biblia_versiculos')
                    .select('texto')
                    .eq('livro', foundBook.id) // Usa a sigla "Hb"
                    .eq('capitulo', randomVerse.capitulo)
                    .eq('versiculo', randomVerse.versiculo)
                    .single();
                textData = v2;
            }
        }

        const finalText = textData ? textData.texto : "Texto não encontrado no banco.";
        
        return {
            text: finalText,
            reference: `${randomVerse.livro} ${randomVerse.capitulo}:${randomVerse.versiculo}`,
            // Monta a URL da imagem. 
            // IMPORTANTE: Substitua 'daily-images' pelo nome real do seu bucket se for diferente.
            image_url: DailyAPI.getDailyImageURL(randomVerse.image_path)
        };
    },

    getDailyImageURL(path) {
        if (!path) return null;
        // Se o path já vier completo (http...), retorna ele. Se não, monta.
        if (path.startsWith('http')) return path;
        
        // ATENÇÃO: Confirme se o nome do seu bucket no Storage é 'daily-images'
        // Se você criou uma pasta 'faith' dentro de um bucket chamado 'imagens', mude aqui.
        // Vou assumir que o bucket se chama 'daily-images' baseado no nosso papo anterior.
        return supabase.storage.from('bible-cards').getPublicUrl(path).data.publicUrl;
    }
};