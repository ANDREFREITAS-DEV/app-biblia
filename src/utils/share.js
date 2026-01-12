export async function shareContent(title, text, imageUrl = null) {
    if (navigator.share) {
        try {
            const shareData = {
                title: title,
                text: text,
            };

            // Se houver imagem, tentar fazer fetch e converter para File (avançado)
            // Para simplificar PWA básico, compartilhamos apenas URL se imagem existir
            if (imageUrl) {
                shareData.url = imageUrl; // Alguns apps aceitam url da imagem
            }

            await navigator.share(shareData);
            return true;
        } catch (err) {
            console.warn('Erro ao compartilhar:', err);
            return false;
        }
    } else {
        // Fallback: Copiar para área de transferência
        try {
            await navigator.clipboard.writeText(`${title}\n${text}`);
            alert('Texto copiado para a área de transferência!');
            return true;
        } catch (err) {
            console.error('Falha ao copiar:', err);
            return false;
        }
    }
}