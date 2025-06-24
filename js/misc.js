import { elements, showToast } from './ui.js';
import { getContent, insertTextAtCursor } from './editor.js';

/**
 * Inicializa as funções utilitárias diversas.
 */
export function initMisc() {
    elements.editor.addEventListener('input', updateCounts);
    elements.editor.addEventListener('scroll', () => syncScroll(elements.editor, elements.preview));
    elements.preview.addEventListener('scroll', () => syncScroll(elements.preview, elements.editor));
    document.getElementById('btn-checklist').addEventListener('click', async () => {
        // CORREÇÃO AQUI: Usa import() dinâmico
        const { applyMarkdownToLine } = await import('./editor.js');
        applyMarkdownToLine('- [ ] ');
    });
    document.getElementById('btn-toc').addEventListener('click', generateToc);

    // Inicializa os contadores na carga da página
    updateCounts();
}

/**
 * Atualiza os contadores de palavras e caracteres na barra de status.
 */
function updateCounts() {
    const text = getContent();
    // Expressão regular aprimorada para contar palavras
    const words = text.match(/[\w\u00C0-\u017F]+/g) || [];
    elements.wordCount.textContent = `Palavras: ${words.length}`;
    elements.charCount.textContent = `Caracteres: ${text.length}`;
}

let isSyncing = false;
/**
 * Sincroniza a rolagem entre dois elementos.
 * @param {HTMLElement} source - O elemento que iniciou a rolagem.
 * @param {HTMLElement} target - O elemento que deve ser sincronizado.
 */
function syncScroll(source, target) {
    if (isSyncing) return;
    isSyncing = true;

    const sourceScrollHeight = source.scrollHeight - source.clientHeight;
    if (sourceScrollHeight <= 0) {
        isSyncing = false;
        return;
    }

    const percent = source.scrollTop / sourceScrollHeight;
    target.scrollTop = percent * (target.scrollHeight - target.clientHeight);
    
    // Timeout curto para evitar "gagueira" na sincronização
    setTimeout(() => { isSyncing = false; }, 50);
}

/**
 * Gera um Sumário (Table of Contents) a partir dos cabeçalhos do documento.
 */
export function generateToc() {
    const lines = getContent().split('\n');
    const headings = lines.filter(line => line.trim().startsWith('#'));

    if (headings.length === 0) {
        showToast('Nenhum cabeçalho (H1, H2, etc.) encontrado para gerar o sumário.', 'info');
        return;
    }

    const toc = headings.map(h => {
        const trimmedHeading = h.trim();
        const level = trimmedHeading.indexOf(' ');
        const title = trimmedHeading.substring(level + 1).trim();
        // Cria um "slug" compatível com GitHub
        const slug = title.trim().toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove caracteres não-alfanuméricos (exceto espaços e hífens)
            .replace(/\s+/g, '-');   // Substitui espaços por hífens
        
        return `${'  '.repeat(level)}- [${title}](#${slug})`;
    }).join('\n');

    insertTextAtCursor('## Sumário\n\n' + toc + '\n\n');
}