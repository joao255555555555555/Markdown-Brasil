import { elements, showToast } from './ui.js';
import { getContent, insertTextAtCursor } from './editor.js';

/**
 * Nova função para inicializar o Modo Foco
 */
function initFocusMode() {
    const focusBtn = document.getElementById('btn-focus-mode');
    const body = document.body;

    if (focusBtn) {
        focusBtn.addEventListener('click', () => {
            body.classList.toggle('focus-mode');
        });
    }

    // Adiciona um listener para sair do modo foco com a tecla 'Esc'
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body.classList.contains('focus-mode')) {
            body.classList.remove('focus-mode');
        }
    });
}

/**
 * Inicializa as funções utilitárias diversas.
 */
export function initMisc() {
    // MUDANÇA AQUI: Chama a nova função
    initFocusMode(); 

    elements.editor.addEventListener('input', updateCounts);
    elements.editor.addEventListener('scroll', () => syncScroll(elements.editor, elements.preview));
    elements.preview.addEventListener('scroll', () => syncScroll(elements.preview, elements.editor));
    document.getElementById('btn-checklist').addEventListener('click', async () => {
        const { applyMarkdownToLine } = await import('./editor.js');
        applyMarkdownToLine('- [ ] ');
    });
    document.getElementById('btn-toc').addEventListener('click', generateToc);

    updateCounts();
}

/**
 * Atualiza os contadores de palavras e caracteres.
 */
export function updateCounts() {
    const text = getContent();
    const words = text.match(/[\w\u00C0-\u017F]+/g) || [];
    if (elements.wordCount) elements.wordCount.textContent = `Palavras: ${words.length}`;
    if (elements.charCount) elements.charCount.textContent = `Caracteres: ${text.length}`;
}

let isSyncing = false;
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
    
    setTimeout(() => { isSyncing = false; }, 50);
}

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
        const slug = title.trim().toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');   
        
        return `${'  '.repeat(level)}- [${title}](#${slug})`;
    }).join('\n');

    insertTextAtCursor('## Sumário\n\n' + toc + '\n\n');
}