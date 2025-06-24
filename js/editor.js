import { elements, updateSaveStatus } from './ui.js';

let lastContent = '';
let saveTimeout;

/**
 * Inicializa a barra de ferramentas e seus eventos.
 */
export function initToolbar() {
    if (!elements.toolbar) return;

    // Listener principal para os botões da toolbar
    elements.toolbar.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button || !button.id) return;

        const actions = {
            'btn-bold': () => applyMarkdown('**', '**'),
            'btn-italic': () => applyMarkdown('*', '*'),
            'btn-strike': () => applyMarkdown('~~', '~~'),
            'btn-link': () => {
                const url = prompt('Digite a URL do link:', 'https://');
                if (url) applyMarkdown('[', `](${url})`);
            },
            'btn-quote': () => applyMarkdownToLine('> '),
            'btn-code': () => {
                const lang = prompt('Qual a linguagem do código? (ex: js, python)', '');
                applyMarkdown('```' + (lang || '') + '\n', '\n```');
            },
            'btn-ul': () => applyMarkdownToLine('- '),
            'btn-ol': () => applyMarkdownToLine('1. '),
        };

        if (actions[button.id]) {
            actions[button.id]();
        }
    });

    // Listeners para os menus <select>
    const selectHeading = document.getElementById('select-heading');
    if (selectHeading) {
        selectHeading.addEventListener('change', (e) => {
            const level = e.target.value;
            if (!level || level === 'p') return;
            const prefix = '#'.repeat(parseInt(level.replace('h', ''))) + ' ';
            applyMarkdownToLine(prefix);
            e.target.value = 'p'; // Reseta o dropdown
        });
    }

    const selectAlert = document.getElementById('select-alert');
    if (selectAlert) {
        selectAlert.addEventListener('change', (e) => {
            const type = e.target.value;
            if (!type || type === 'p') return;
            applyMarkdown(`> [!${type.toUpperCase()}]\n> `, '');
            e.target.value = 'p'; // Reseta o dropdown
        });
    }
}


/**
 * Inicializa o editor e seus eventos.
 */
export function initEditor() {
    if (!elements.editor) return;

    marked.setOptions({
        breaks: true,
        gfm: true,
    });

    elements.editor.addEventListener('input', handleEditorInput);
    elements.editor.addEventListener('dragover', handleDragOver);
    elements.editor.addEventListener('dragleave', handleDragLeave);
    elements.editor.addEventListener('drop', handleDrop);
}

function handleEditorInput() {
    updatePreview();
    
    const currentContent = elements.editor.value;
    if (currentContent === lastContent) return;

    updateSaveStatus('saving', 'Alterações não salvas...');
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        document.dispatchEvent(new CustomEvent('editor:save'));
    }, 2000);
}

export function updatePreview() {
    if (elements.preview && elements.editor) {
        elements.preview.innerHTML = marked.parse(elements.editor.value);
    }
}

export function setContent(content, isInitialLoad = false) {
    if (elements.editor) {
        elements.editor.value = content;
        if (isInitialLoad) {
            lastContent = content;
        }
        elements.editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

export function getContent() {
    return elements.editor ? elements.editor.value : '';
}

export function markAsSaved() {
    lastContent = elements.editor.value;
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.editor.classList.add('editor--drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.editor.classList.remove('editor--drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.editor.classList.remove('editor--drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result;
                const imageName = file.name.split('.')[0] || 'imagem';
                const markdownImage = `![${imageName}](${base64Image})\n`;
                insertTextAtCursor(markdownImage);
            };
            reader.readAsDataURL(file);
        }
    }
}

export function insertTextAtCursor(text) {
    if (!elements.editor) return;
    const start = elements.editor.selectionStart;
    const end = elements.editor.selectionEnd;
    
    elements.editor.setRangeText(text, start, end, 'end');
    elements.editor.focus();
    elements.editor.dispatchEvent(new Event('input', { bubbles: true }));
}

export function applyMarkdown(prefix, suffix = prefix) {
    if (!elements.editor) return;
    const start = elements.editor.selectionStart;
    const end = elements.editor.selectionEnd;
    const selectedText = elements.editor.value.substring(start, end);
    const newText = `${prefix}${selectedText}${suffix}`;
    
    elements.editor.setRangeText(newText, start, end);
    elements.editor.focus();
    
    if (start === end) {
        elements.editor.selectionStart = elements.editor.selectionEnd = start + prefix.length;
    } else {
        elements.editor.selectionStart = start + prefix.length;
        elements.editor.selectionEnd = end + prefix.length;
    }
    
    elements.editor.dispatchEvent(new Event('input', { bubbles: true }));
}

export function applyMarkdownToLine(prefix) {
    if (!elements.editor) return;
    const start = elements.editor.selectionStart;
    const lineStart = elements.editor.value.lastIndexOf('\n', start - 1) + 1;
    
    elements.editor.setSelectionRange(lineStart, lineStart);
    insertTextAtCursor(prefix);
}