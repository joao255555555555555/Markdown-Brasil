import { elements, updateSaveStatus, showToast } from './ui.js';

let lastContent = '';
let saveTimeout;

function handleMediaInsert() {
    // ... (função que já criamos)
}

export function initToolbar() {
    // ... (função que já criamos)
}

/**
 * Inicializa o editor e seus eventos.
 */
export function initEditor() {
    if (!elements.editor) return;

    // --- MUDANÇA AQUI ---
    // Configura o `marked` para usar o `highlight.js`
    marked.setOptions({
        breaks: true,
        gfm: true,
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    });

    elements.editor.addEventListener('input', handleEditorInput);
    elements.editor.addEventListener('dragover', handleDragOver);
    elements.editor.addEventListener('dragleave', handleDragLeave);
    elements.editor.addEventListener('drop', handleDrop);
}

// ... todo o resto do seu arquivo editor.js continua aqui ...
// (handleEditorInput, updatePreview, setContent, etc.)
// Não precisa mudar mais nada nele.