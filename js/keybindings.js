import { openModal, closeModal } from './ui.js';
import { triggerSave } from './history.js';
import { applyMarkdown } from './editor.js';

/**
 * Inicializa todos os atalhos de teclado da aplicação.
 */
export function initKeybindings() {
    document.addEventListener('keydown', (e) => {
        // Atalhos com a tecla Ctrl (ou Cmd no Mac)
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 's':
                    e.preventDefault();
                    triggerSave(true);
                    break;
                case 'h':
                    e.preventDefault();
                    // Alterna a visibilidade do painel de histórico
                    const historyModal = document.getElementById('modal-history');
                    if (historyModal.classList.contains('modal__overlay--show')) {
                        closeModal();
                    } else {
                        document.getElementById('btn-history').click();
                    }
                    break;
                case 'k':
                    e.preventDefault();
                    openModal('commandPalette');
                    break;
                case 'b':
                    e.preventDefault();
                    applyMarkdown('**');
                    break;
                case 'i':
                    e.preventDefault();
                    applyMarkdown('*');
                    break;
            }
        } 
        // Atalho com a tecla Escape
        else if (e.key === 'Escape') {
            closeModal();
        }
    });
}