// Centraliza todas as referências aos elementos do DOM
export const elements = {
    // Inputs e áreas de texto
    editor: document.getElementById('editor'),
    preview: document.getElementById('preview'),
    documentTitle: document.getElementById('document-title'),
    // Barras e containers
    header: document.querySelector('.header'),
    toolbar: document.getElementById('toolbar'),
    statusBar: document.querySelector('.status-bar'),
    // Contadores e Status
    wordCount: document.getElementById('word-count'),
    charCount: document.getElementById('char-count'),
    saveStatus: document.getElementById('save-status'),
    // Modais (Overlays)
    modals: {
        table: document.getElementById('modal-table'),
        badge: document.getElementById('modal-badge'),
        details: document.getElementById('modal-details'),
        skills: document.getElementById('modal-skills'),
        template: document.getElementById('modal-template'),
        history: document.getElementById('modal-history'),
        commandPalette: document.getElementById('modal-command-palette'),
    },
    // Notificações
    toastContainer: document.getElementById('toast-container'),
};

/**
 * Exibe uma notificação (toast) na tela.
 * @param {string} message - A mensagem a ser exibida.
 * @param {'success' | 'error' | 'info'} type - O tipo de notificação.
 * @param {number} duration - Duração em milissegundos.
 */
export function showToast(message, type = 'info', duration = 3000) {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    // Adiciona a classe para animação de entrada
    setTimeout(() => {
        toast.classList.add('toast--show');
    }, 10);

    // Remove o toast após a duração
    setTimeout(() => {
        toast.classList.remove('toast--show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

/**
 * Abre um modal específico.
 * @param {keyof elements.modals} modalName - O nome do modal a ser aberto.
 */
export function openModal(modalName) {
    const modal = elements.modals[modalName];
    if (modal) {
        modal.classList.add('modal__overlay--show');
        // Foca no primeiro input, se houver
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    }
}

/**
 * Fecha o modal que está aberto.
 */
export function closeModal() {
    const openModal = document.querySelector('.modal__overlay--show');
    if (openModal) {
        openModal.classList.remove('modal__overlay--show');
    }
}

// Event listener para fechar modais clicando no fundo ou no botão de fechar
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal__overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal__button--close')) {
                closeModal();
            }
        });
    });
});

/**
 * Atualiza o status de salvamento na barra de status.
 * @param {'saving' | 'success' | 'error' | 'idle'} status - O status atual.
 * @param {string} message - A mensagem a ser exibida.
 */
export function updateSaveStatus(status, message) {
    if (!elements.saveStatus) return;
    
    elements.saveStatus.textContent = message;
    elements.saveStatus.className = 'status-bar__save-status'; // Reset
    
    switch (status) {
        case 'saving':
            elements.saveStatus.classList.add('status-bar__save-status--saving');
            break;
        case 'success':
            elements.saveStatus.classList.add('status-bar__save-status--success');
            break;
        case 'error':
            elements.saveStatus.classList.add('status-bar__save-status--error');
            break;
    }
}