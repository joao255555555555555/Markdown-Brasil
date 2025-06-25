import { elements, updateSaveStatus, showToast } from './ui.js';

let lastContent = '';
let saveTimeout;

function handleMediaInsert() {
    const url = prompt("Cole a URL do Vídeo (YouTube), GIF ou Imagem:");
    if (!url) return;

    let embedCode = '';

    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch && youtubeMatch[1]) {
        const videoId = youtubeMatch[1];
        embedCode = `\n<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>\n`;
    } 
    else if (/\.(gif|jpe?g|png|webp|svg)$/i.test(url)) {
        embedCode = `\n![Mídia](${url})\n`;
    } 
    else {
        showToast("Formato de URL não reconhecido. Use links do YouTube ou links diretos para imagens/GIFs.", "error");
        return;
    }

    insertTextAtCursor(embedCode);
}


export function initToolbar() {
    if (!elements.toolbar) return;

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
            'btn-media': handleMediaInsert,
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

    const selectHeading = document.getElementById('select-heading');
    if (selectHeading) {
        selectHeading.addEventListener('change', (e) => {
            const level = e.target.value;
            if (!level || level === 'p') return;
            const prefix = '#'.repeat(parseInt(level.replace('h', ''))) + ' ';
            applyMarkdownToLine(prefix);
            e.target.value = 'p'; 
        });
    }

    const selectAlert = document.getElementById('select-alert');
    if (selectAlert) {
        selectAlert.addEventListener('change', (e) => {
            const type = e.target.value;
            if (!type || type === 'p') return;
            applyMarkdown(`> [!${type.toUpperCase()}]\n> `, '');
            e.target.value = 'p';
        });
    }
}


export function initEditor() {
    if (!elements.editor) return;

    marked.setOptions({
        breaks: true,
        gfm: true,
        highlight: function(code, lang) {
            if (window.hljs) {
                const language = window.hljs.getLanguage(lang) ? lang : 'plaintext';
                return window.hljs.highlight(code, { language }).value;
            }
            return code;
        }
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
        
        // --- MUDANÇA DA CORREÇÃO AQUI ---
        // Avisa ao highlight.js para procurar e colorir os novos blocos de código no preview
        elements.preview.querySelectorAll('pre code').forEach((block) => {
            window.hljs.highlightElement(block);
        });
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