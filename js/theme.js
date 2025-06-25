const UI_THEME_KEY = 'markdown_editor_theme';
const CODE_THEME_KEY = 'markdown_code_theme';
const FONT_KEY = 'markdown_editor_font'; // Nova chave para o localStorage

// Novas referências de elementos
const uiThemeSelector = document.getElementById('theme-selector__select');
const codeThemeSelector = document.getElementById('highlight-theme-selector');
const fontSelector = document.getElementById('font-selector'); 

const htmlElement = document.documentElement;
const highlightThemeLink = document.getElementById('highlight-theme');

/**
 * Aplica um tema à interface da aplicação.
 * @param {string} themeName - O nome do tema.
 */
export function applyUiTheme(themeName) {
    htmlElement.setAttribute('data-theme', themeName);
    if (uiThemeSelector) uiThemeSelector.value = themeName;
    localStorage.setItem(UI_THEME_KEY, themeName);
}

/**
 * Aplica um tema de cores ao Syntax Highlighter.
 * @param {string} themeName - O nome do tema (ex: 'github-dark').
 */
export function applyCodeTheme(themeName) {
    if (highlightThemeLink) {
        highlightThemeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${themeName}.min.css`;
    }
    if (codeThemeSelector) codeThemeSelector.value = themeName;
    localStorage.setItem(CODE_THEME_KEY, themeName);
}

/**
 * Nova função para aplicar a fonte.
 * @param {string} fontFamily - A família de fontes a ser aplicada (ex: "'Fira Code', monospace").
 */
export function applyFont(fontFamily) {
    // Define o valor da variável CSS --editor-font no elemento raiz (<html>)
    document.documentElement.style.setProperty('--editor-font', fontFamily);
    if (fontSelector) fontSelector.value = fontFamily;
    localStorage.setItem(FONT_KEY, fontFamily);
}

/**
 * Inicializa os temas da UI, do código e a fonte.
 */
export function initTheme() {
    // Carrega e aplica o tema da UI
    const savedUiTheme = localStorage.getItem(UI_THEME_KEY) || 'dark';
    applyUiTheme(savedUiTheme);
    if (uiThemeSelector) {
        uiThemeSelector.addEventListener('change', (e) => applyUiTheme(e.target.value));
    }

    // Carrega e aplica o tema do código
    const savedCodeTheme = localStorage.getItem(CODE_THEME_KEY) || 'github-dark';
    applyCodeTheme(savedCodeTheme);
    if (codeThemeSelector) {
        codeThemeSelector.addEventListener('change', (e) => applyCodeTheme(e.target.value));
    }

    // Carrega e aplica a fonte
    const savedFont = localStorage.getItem(FONT_KEY) || "'Inter', sans-serif";
    applyFont(savedFont);
    if (fontSelector) {
        fontSelector.addEventListener('change', (e) => applyFont(e.target.value));
    }
}