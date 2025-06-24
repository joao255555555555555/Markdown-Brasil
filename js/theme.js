const THEME_KEY = 'markdown_editor_theme';
const themeSelector = document.getElementById('theme-selector__select');
const htmlElement = document.documentElement;

/**
 * Aplica um tema à aplicação.
 * @param {string} themeName - O nome do tema a ser aplicado (ex: 'dark', 'light').
 */
function applyTheme(themeName) {
    htmlElement.setAttribute('data-theme', themeName);
    if (themeSelector) {
        themeSelector.value = themeName;
    }
    localStorage.setItem(THEME_KEY, themeName);
}

/**
 * Inicializa o gerenciador de temas, carregando o tema salvo ou o padrão.
 */
export function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);

    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => applyTheme(e.target.value));
    }
}

// Permite que outros módulos alterem o tema programaticamente
export { applyTheme };