import { elements, openModal, closeModal, showToast, updateSaveStatus } from './ui.js';
import { getContent, setContent, markAsSaved } from './editor.js';
import { saveVersion, getAllVersions, getVersion, deleteVersion, updateVersion } from './db.js';

let dbInstance;

// NOVO TEXTO PRÉ-CARREGADO
const preloadedContent = `# Transforme Ideias em Código com o Markdown Brasil

**Bem-vindo ao mais completo editor Markdown online, criado para o desenvolvedor brasileiro.** Seja para criar um \`README.md\` impecável para seu projeto no GitHub, documentar sua API, ou simplesmente para visualizar HTML e CSS em tempo real, nossa ferramenta oferece a velocidade e os recursos que você precisa.

## Recursos Principais

- **Editor em Tempo Real:** Escreva em Markdown de um lado e veja o resultado instantaneamente do outro.
- **Foco em READMEs:** Gere sumários, badges, seções retráteis e listas de tecnologias com poucos cliques.
- **Visualizador de HTML e CSS:** Cole seu código HTML ou CSS e veja como ele se comporta. Perfeito para testes rápidos.
- **Totalmente Grátis:** Sem anúncios, sem assinaturas. Uma ferramenta da comunidade para a comunidade.

## Para Quem é Este Editor?

* **Desenvolvedores de Software** que buscam a forma mais eficiente de criar um \`README.md\`.
* **Estudantes de programação** que estão aprendendo HTML, CSS e Markdown.
* **Profissionais de Tech** que precisam criar documentação clara e bem formatada.

**Comece a escrever agora e eleve a qualidade da sua documentação!**`;


export function initHistory(db) {
    dbInstance = db;
    document.getElementById('btn-history').addEventListener('click', showHistoryPanel);
    document.getElementById('btn-history-close').addEventListener('click', closeModal);
    document.getElementById('btn-save-named').addEventListener('click', () => triggerSave(true));
    
    const historyList = document.getElementById('history-list');
    historyList.addEventListener('click', handleHistoryAction);

    document.addEventListener('editor:save', () => triggerSave());
}

export async function loadLastVersion() {
    try {
        const versions = await getAllVersions();
        if (versions.length > 0) {
            const lastVersion = versions[0];
            setContent(lastVersion.content, true);
            elements.documentTitle.value = lastVersion.name || 'README';
            updateSaveStatus('success', 'Última versão carregada');
        } else {
            // MUDANÇA AQUI: Usa o novo conteúdo pré-carregado
            setContent(preloadedContent, true);
            elements.documentTitle.value = 'Meu README Incrível';
            updateSaveStatus('idle', 'Pronto para começar!');
        }
    } catch (error) {
        showToast('Erro ao carregar o histórico.', 'error');
        console.error(error);
    }
}

export async function triggerSave(isNamed = false) {
    const content = getContent();
    let name = document.getElementById('document-title').value.trim();
    const lastSavedVersion = await getLastSavedVersion();

    if (isNamed && !name) {
        name = prompt("Por favor, dê um nome para esta versão:", `Versão de ${new Date().toLocaleTimeString('pt-BR')}`);
        if (!name) return;
        document.getElementById('document-title').value = name;
    }
    
    if (!content.trim() || (lastSavedVersion && content === lastSavedVersion.content && !isNamed)) {
        if (lastSavedVersion && content === lastSavedVersion.content) {
            updateSaveStatus('success', 'Progresso salvo ✓');
        }
        return;
    }

    const newVersion = { content, name, timestamp: new Date() };

    try {
        await saveVersion(newVersion);
        markAsSaved();
        const message = isNamed ? `Versão "${name}" salva!` : 'Progresso salvo ✓';
        updateSaveStatus('success', message);
        if(isNamed) showToast(message, 'success');
    } catch (error) {
        updateSaveStatus('error', 'Erro ao salvar');
        showToast('Não foi possível salvar a versão.', 'error');
        console.error(error);
    }
}

async function getLastSavedVersion() {
    const versions = await getAllVersions();
    return versions.length > 0 ? versions[0] : null;
}

async function showHistoryPanel() {
    openModal('history');
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '<li>Carregando histórico...</li>';

    try {
        const versions = await getAllVersions();
        if (versions.length === 0) {
            historyList.innerHTML = '<li>Nenhuma versão salva ainda.</li>';
            return;
        }

        historyList.innerHTML = versions.map(v => `
            <li class="history-panel__item" data-id="${v.id}">
                <div class="history-panel__info" data-action="restore">
                    <strong class="history-panel__name">${v.name || 'Versão automática'}</strong>
                    <span class="history-panel__timestamp">${new Date(v.timestamp).toLocaleString('pt-BR')}</span>
                    <p class="history-panel__preview">${v.content.substring(0, 100).replace(/\n/g, ' ')}...</p>
                </div>
                <div class="history-panel__actions">
                    <button class="history-panel__button" data-action="rename" title="Renomear"><i class="fas fa-pencil-alt"></i></button>
                    <button class="history-panel__button history-panel__button--delete" data-action="delete" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>
            </li>
        `).join('');
    } catch (error) {
        historyList.innerHTML = '<li>Erro ao carregar o histórico.</li>';
        console.error(error);
    }
}

async function handleHistoryAction(e) {
    const button = e.target.closest('[data-action]');
    if (!button) return;

    const listItem = e.target.closest('[data-id]');
    const versionId = parseInt(listItem.dataset.id, 10);
    const action = button.dataset.action;

    switch (action) {
        case 'restore':
            const version = await getVersion(versionId);
            setContent(version.content);
            document.getElementById('document-title').value = version.name || '';
            closeModal();
            showToast(`Versão de ${new Date(version.timestamp).toLocaleTimeString('pt-BR')} restaurada!`, 'success');
            break;
        case 'rename':
            await renameHistoryVersion(versionId);
            break;
        case 'delete':
            await deleteHistoryVersion(versionId);
            break;
    }
}

async function renameHistoryVersion(id) {
    const version = await getVersion(id);
    const newName = prompt('Digite o novo nome para a versão:', version.name);

    if (newName && newName.trim() !== version.name) {
        version.name = newName.trim();
        await updateVersion(version);
        showHistoryPanel();
        showToast('Versão renomeada com sucesso!', 'success');
    }
}

async function deleteHistoryVersion(id) {
    if (confirm('Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita.')) {
        await deleteVersion(id);
        showHistoryPanel();
        showToast('Versão excluída.', 'info');
    }
}