import { elements, openModal, closeModal } from './ui.js';
import { insertTextAtCursor } from './editor.js';

const skills = [ { name: 'JavaScript', logo: 'js' }, { name: 'TypeScript', logo: 'ts' }, { name: 'React', logo: 'react' }, { name: 'HTML5', logo: 'html' }, { name: 'CSS3', logo: 'css' }, { name: 'Sass', logo: 'scss' }, { name: 'Node.js', logo: 'nodejs' }, { name: 'Python', logo: 'python' }, { name: 'Java', logo: 'java' }, { name: 'Go', logo: 'go' }, { name: 'Linux', logo: 'linux' }, { name: 'Git', logo: 'git' }, { name: 'GitHub', logo: 'github' }, { name: 'Docker', logo: 'docker' }, { name: 'MySQL', logo: 'mysql' }, { name: 'PostgreSQL', logo: 'postgres' }, { name: 'MongoDB', logo: 'mongodb' }, { name: 'VSCode', logo: 'vscode' } ];

const templates = {
    simple: `# Nome do Projeto\n\nUma breve descrição sobre o que seu projeto faz.\n\n## Tecnologias Utilizadas\n\n- React\n- Node.js\n- CSS\n\n## Como Instalar\n\n\`\`\`bash\n# Clone o repositório\ngit clone https://github.com/seu-usuario/seu-projeto.git\n# Instale as dependências\nnpm install\n# Inicie o projeto\nnpm start\n\`\`\``,
    detailed: `# Nome do Projeto\n\n![Badge de Licença](https://img.shields.io/badge/license-MIT-blue.svg)\n\nDescrição mais detalhada do projeto, seus objetivos e público-alvo.\n\n## Índice\n\n- [Sobre](#sobre)\n- [Funcionalidades](#funcionalidades)\n- [Instalação](#instalação)\n- [Como Usar](#como-usar)\n- [Contribuição](#contribuição)\n- [Licença](#licença)\n\n## Sobre\n\n...\n\n## Funcionalidades\n\n- [x] Feature 1\n- [ ] Feature 2\n- [ ] Feature 3\n\n## Instalação\n\n...\n\n## Como Usar\n\n...\n\n## Contribuição\n\n...\n\n## Licença\n\nDistribuído sob a licença MIT. Veja \`LICENSE\` para mais informações.`
};

export function initModals() {
    // Botões que abrem modais
    document.getElementById('btn-table').addEventListener('click', () => openModal('table'));
    document.getElementById('btn-badge').addEventListener('click', () => openModal('badge'));
    document.getElementById('btn-details').addEventListener('click', () => openModal('details'));
    document.getElementById('btn-skills').addEventListener('click', () => {
        populateSkillsModal();
        openModal('skills');
    });
    document.getElementById('btn-template').addEventListener('click', () => openModal('template'));

    // Botões de "Criar" dentro dos modais
    document.getElementById('btn-create-table').addEventListener('click', createTable);
    document.getElementById('btn-create-badge').addEventListener('click', createBadge);
    document.getElementById('btn-create-details').addEventListener('click', createDetails);
    document.getElementById('btn-create-skills').addEventListener('click', createSkills);
    document.getElementById('btn-apply-template').addEventListener('click', applyTemplate);
}

function createTable() {
    const cols = document.getElementById('table-cols').value;
    const rows = document.getElementById('table-rows').value;
    let table = `\n| ${Array(parseInt(cols)).fill('Cabeçalho').join(' | ')} |\n`;
    table += `| ${Array(parseInt(cols)).fill('---').join(' | ')} |\n`;
    for (let i = 0; i < rows; i++) {
        table += `| ${Array(parseInt(cols)).fill('Dado').join(' | ')} |\n`;
    }
    insertTextAtCursor(table);
    closeModal();
}

function createBadge() {
    const label = encodeURIComponent(document.getElementById('badge-label').value.replace(/-/g, '--'));
    const message = encodeURIComponent(document.getElementById('badge-message').value.replace(/-/g, '--'));
    const color = document.getElementById('badge-color').value;
    const link = document.getElementById('badge-link').value;
    let badge = `![${label}](https://img.shields.io/badge/${label}-${message}-${color})`;
    if (link) { badge = `[${badge}](${link})`; }
    insertTextAtCursor(badge + ' ');
    closeModal();
}

function createDetails() {
    const summary = document.getElementById('details-summary').value || 'Clique para expandir';
    const content = document.getElementById('details-content').value || 'Conteúdo escondido aqui.';
    const details = `\n<details>\n  <summary>${summary}</summary>\n\n  ${content}\n\n</details>\n`;
    insertTextAtCursor(details);
    closeModal();
}

function populateSkillsModal() {
    const container = document.querySelector('.skills-container');
    container.innerHTML = skills.map(skill => `
        <div class="skill-option">
            <input type="checkbox" id="skill-${skill.logo}" value="${skill.logo}" />
            <img src="https://skillicons.dev/icons?i=${skill.logo}" alt="${skill.name}" />
            <label for="skill-${skill.logo}">${skill.name}</label>
        </div>
    `).join('');
}

function createSkills() {
    const selectedLogos = Array.from(document.querySelectorAll('.skills-container input:checked')).map(cb => cb.value);
    if (selectedLogos.length === 0) return;
    const theme = document.getElementById('skills-theme').value;
    const markdown = `\n<p align="left">\n  <img src="https://skillicons.dev/icons?i=${selectedLogos.join(',')}&theme=${theme}" />\n</p>\n`;
    insertTextAtCursor(markdown);
    closeModal();
}

async function applyTemplate() {
    // CORREÇÃO AQUI: Usa import() dinâmico para evitar dependência circular
    const { setContent } = await import('./editor.js');
    const selectedTemplate = document.getElementById('template-select').value;
    if (templates[selectedTemplate]) {
        setContent(templates[selectedTemplate]);
    }
    closeModal();
}