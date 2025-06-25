import { openModal, closeModal, showToast } from './ui.js';
// MUDANÇA CORRIGIDA AQUI: Importa "applyUiTheme"
import { applyUiTheme } from './theme.js';
import { triggerSave } from './history.js';
import { generateToc } from './misc.js';

const commandPalette = document.getElementById('modal-command-palette');
const commandInput = document.getElementById('command-input');
const commandResults = document.getElementById('command-results');

const commands = [
    { name: 'Inserir Tabela', icon: 'fas fa-table', action: () => openModal('table') },
    { name: 'Inserir Badge', icon: 'fas fa-shield-alt', action: () => openModal('badge') },
    { name: 'Inserir Skills', icon: 'fas fa-laptop-code', action: () => { document.getElementById('btn-skills').click() } },
    { name: 'Usar um Template', icon: 'fas fa-file-alt', action: () => openModal('template') },
    { name: 'Gerar Sumário', icon: 'fas fa-sitemap', action: generateToc },
    { name: 'Salvar Versão Nomeada', icon: 'fas fa-save', action: () => triggerSave(true) },
    { name: 'Ver Histórico', icon: 'fas fa-history', action: () => { document.getElementById('btn-history').click() } },
    // MUDANÇA CORRIGIDA AQUI: Usa "applyUiTheme"
    { name: 'Mudar Tema para Light', icon: 'fas fa-sun', action: () => applyUiTheme('light') },
    { name: 'Mudar Tema para Dark', icon: 'fas fa-moon', action: () => applyUiTheme('dark') },
    { name: 'Mudar Tema para Dracula', icon: 'fas fa-paint-brush', action: () => applyUiTheme('dracula') },
    { name: 'Copiar HTML', icon: 'fas fa-copy', action: () => { 
        navigator.clipboard.writeText(document.getElementById('preview').innerHTML);
        showToast('HTML copiado para a área de transferência!', 'success');
    }},
];

export function initCommands() {
    if (!commandInput) return;

    commandInput.addEventListener('input', () => renderCommandResults(commandInput.value));
    
    commandResults.addEventListener('click', (e) => {
        const item = e.target.closest('.command-palette__item');
        if (item && item.dataset.commandName) {
            const command = commands.find(c => c.name === item.dataset.commandName);
            if(command) {
                command.action();
                closeModal();
            }
        }
    });

    commandInput.addEventListener('keydown', (e) => {
        const items = commandResults.querySelectorAll('.command-palette__item');
        if (items.length === 0) return;

        let selected = commandResults.querySelector('.command-palette__item--selected');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!selected) {
                items[0].classList.add('command-palette__item--selected');
            } else {
                selected.classList.remove('command-palette__item--selected');
                const next = selected.nextElementSibling || items[0];
                next.classList.add('command-palette__item--selected');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!selected) {
                items[items.length - 1].classList.add('command-palette__item--selected');
            } else {
                selected.classList.remove('command-palette__item--selected');
                const prev = selected.previousElementSibling || items[items.length - 1];
                prev.classList.add('command-palette__item--selected');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            selected = selected || items[0];
            if (selected) {
                selected.click();
            }
        }
    });
}

function renderCommandResults(query) {
    const filtered = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    commandResults.innerHTML = filtered.map((c, index) => `
        <li class="command-palette__item ${index === 0 ? 'command-palette__item--selected' : ''}" data-command-name="${c.name}">
            <i class="${c.icon}"></i>
            <span>${c.name}</span>
        </li>
    `).join('');
}