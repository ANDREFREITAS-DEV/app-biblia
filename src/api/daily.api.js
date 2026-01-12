import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const DailyAPI = {
    async getDailyVerse() {
        const today = new Date().toISOString().split('T')[0];

        // 1. Busca a referência do dia
        const { data: refData, error: refError } = await supabase
            .from('versiculo_do_dia')
            .select('*')
            // Tenta pegar o de hoje, ou o último cadastrado se não houver hoje
            .order('data', { ascending: false }) 
            .limit(1)
            .single();

        if (refError || !refData) {
             // Fallback local se não houver dados no banco
             return {
                 text: "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.",
                 reference: "Salmos 119:105",
                 image_url: null 
             };
        }

        // 2. Busca o texto do versículo na tabela principal
        const { data: verseData, error: verseError } = await supabase
            .from('biblia_versiculos')
            .select('texto')
            .eq('livro', refData.livro)
            .eq('capitulo', refData.capitulo)
            .eq('versiculo', refData.versiculo)
            .single();

        const text = verseData ? verseData.texto : "Texto indisponível.";
        const reference = `${refData.livro} ${refData.capitulo}:${refData.versiculo}`;

        return {
            text: text,
            reference: reference,
            image_url: refData.image_path // Caminho para usar no Storage
        };
    },

    getDailyImageURL(path) {
        if (!path) return null;
        // Ajuste 'daily-images' para o nome correto do seu bucket no Supabase, se for diferente
        return supabase.storage.from('daily-images').getPublicUrl(path).data.publicUrl;
    }
};