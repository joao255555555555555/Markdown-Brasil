import { initDB } from './db.js';
import { initTheme } from './theme.js';
import { initEditor, initToolbar, setContent } from './editor.js'; // Importa initToolbar
import { initHistory, loadLastVersion } from './history.js';
import { initModals } from './modals.js';
import { initCommands } from './commands.js';
import { initExport } from './export.js';
import { initKeybindings } from './keybindings.js';
import { initMisc } from './misc.js';
import { showToast, updateSaveStatus } from './ui.js';

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


document.addEventListener('DOMContentLoaded', async () => {
    
    initTheme();
    initEditor();
    initToolbar(); // <-- CHAMA A NOVA FUNÇÃO AQUI
    initModals();
    initCommands();
    initExport();
    initKeybindings();
    initMisc();

    let db;
    try {
        db = await initDB();
        
        initHistory(db);
        await loadLastVersion();
        
    } catch (error) {
        console.error('Falha ao inicializar o banco de dados:', error);
        
        showToast('Histórico e salvamento automático indisponíveis.', 'error', 8000);
        
        const historyBtn = document.getElementById('btn-history');
        const saveNamedBtn = document.getElementById('btn-save-named');
        if (historyBtn) historyBtn.style.display = 'none';
        if (saveNamedBtn) saveNamedBtn.style.display = 'none';

        setContent(preloadedContent, true);
        updateSaveStatus('error', 'Salvamento desativado');
    }
});