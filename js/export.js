import { elements, showToast } from './ui.js';
import { getContent } from './editor.js';

/**
 * Inicializa os botões de exportação.
 */
export function initExport() {
    document.getElementById('btn-export-md').addEventListener('click', exportMd);
    document.getElementById('btn-export-html').addEventListener('click', exportHtml);
    document.getElementById('btn-export-pdf').addEventListener('click', exportPdf);
    document.getElementById('btn-copy-html').addEventListener('click', copyHtmlToClipboard);
}

/**
 * Obtém um nome de arquivo sanitizado a partir do título do documento.
 * @returns {string}
 */
function getFilename() {
    return (elements.documentTitle.value.trim() || 'README').replace(/[/\\?%*:|"<>]/g, '-');
}

/**
 * Força o download de um arquivo no navegador.
 * @param {string} filename - O nome do arquivo a ser baixado.
 * @param {string} content - O conteúdo do arquivo.
 * @param {string} mimeType - O MIME type do arquivo.
 */
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Exporta o conteúdo do editor como um arquivo .md.
 */
function exportMd() {
    downloadFile(`${getFilename()}.md`, getContent(), 'text/markdown;charset=utf-8');
}

/**
 * Exporta o conteúdo do preview como um arquivo .html, incluindo os estilos do tema atual.
 */
function exportHtml() {
    const themeName = document.documentElement.getAttribute('data-theme') || 'dark';
    const cssText = Array.from(document.styleSheets)
        .map(sheet => {
            try {
                return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
            } catch (e) {
                // Ignora folhas de estilo de origem cruzada que não podem ser lidas
                return '';
            }
        })
        .join('');

    const fullHtml = `
        <!DOCTYPE html>
        <html lang="pt-br" data-theme="${themeName}">
        <head>
            <meta charset="UTF-8">
            <title>${getFilename()}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Estilos embutidos para portabilidade */
                ${cssText}
                /* Ajustes para o corpo do documento exportado */
                body {
                    background-color: var(--preview-bg, #fff);
                    color: var(--text-color, #000);
                    padding: 2rem;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <div class="preview">${elements.preview.innerHTML}</div>
        </body>
        </html>`;
    downloadFile(`${getFilename()}.html`, fullHtml, 'text/html;charset=utf-8');
}

/**
 * Exporta o conteúdo do preview como um arquivo .pdf.
 */
function exportPdf() {
    showToast('Gerando PDF, por favor aguarde...', 'info', 5000);
    const elementToPrint = elements.preview;
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${getFilename()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: getComputedStyle(elementToPrint).backgroundColor },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(elementToPrint).set(opt).save()
        .then(() => showToast('PDF gerado com sucesso!', 'success'))
        .catch(err => {
            showToast('Falha ao gerar o PDF.', 'error');
            console.error("Erro na geração de PDF:", err);
        });
}

/**
 * Copia o código HTML do preview para a área de transferência.
 */
function copyHtmlToClipboard() {
    const htmlContent = elements.preview.innerHTML;
    navigator.clipboard.writeText(htmlContent)
        .then(() => showToast('HTML copiado para a área de transferência!', 'success'))
        .catch(err => {
            showToast('Falha ao copiar HTML.', 'error');
            console.error('Erro ao copiar HTML:', err);
        });
}