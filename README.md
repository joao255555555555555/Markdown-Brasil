# Markdown Brasil — Editor Web com Preview em Tempo Real

<p align="left">
  <img src="https://img.shields.io/badge/Vers%C3%A3o-v1.0-blue.svg" />
  <img src="https://img.shields.io/badge/Status-Est%C3%A1vel-brightgreen.svg" />
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-yellow.svg" />
  <br/>
  <img src="https://img.shields.io/badge/Execu%C3%A7%C3%A3o-100%25%20Client--Side-orange.svg" />
  <img src="https://img.shields.io/badge/Licen%C3%A7a-GPLv3-blue.svg" />
</p>

---

## 1. Introdução

**Markdown Brasil** é um editor Markdown moderno, leve e direto, que roda 100% no navegador com **preview ao vivo**, temas inclusivos, persistência local e **zero dependência externa invasiva**.

Desenvolvido com HTML, CSS e JavaScript puro, é uma alternativa aos editores pesados baseados em Electron. Ideal para desenvolvedores, escritores técnicos e quem valoriza produtividade e autonomia real.

---

## 2. Principais Funcionalidades

> Um editor leve, funcional e sem ruído — direto ao ponto, como o Markdown deveria ser.

---

### 🚀 **Preview em Tempo Real**
- Visualização instantânea do conteúdo em HTML.
- Suporte completo ao **GitHub Flavored Markdown (GFM)**.

---

### 🎨 **Temas Personalizáveis**
Escolha entre **7 temas visuais inclusivos**:

| Tema             | Descrição                                |
|------------------|------------------------------------------|
| `Dark`           | Tema escuro padrão, ideal para foco      |
| `Light`          | Visual limpo e tradicional               |
| `Dracula`        | Tema popular entre devs noturnos         |
| `GitHub Light`   | Similar à UI do GitHub                   |
| `Colorblind`     | Contraste acessível                      |
| `Tritanopia`     | Inclusivo para daltonismo específico     |
| `Soft Dark`      | Escuro suave e confortável               |

---

### 💾 **Preferências Persistentes**
- Salva automaticamente o tema escolhido usando `localStorage`.

---

### 📱 **Responsivo e Minimalista**
- Compatível com desktop e mobile.
- Sem dependência de backend, frameworks ou build tools.

---

### 🔐 **Privacidade Garantida**
- Zero rastreamento.
- 100% client-side.
- Código sob **GPLv3**: use, estude, modifique e distribua livremente.

---

## 🎬 Demonstração

<p align="center">
  <img src="https://raw.githubusercontent.com/henriquetourinho/Markdown-Brasil/main/media/funcionamento.gif" alt="Funcionamento do Markdown Brasil" width="700">
</p>

---

## 3. Como Usar

### ✅ Online:
Acesse diretamente:  
👉 **https://markdownbrasil.com/**

### 💻 Localmente:

```bash
git clone https://github.com/henriquetourinho/Markdown-Brasil.git
cd Markdown-Brasil
xdg-open index.html  # ou abra manualmente no navegador
```

---

## 4. Estrutura do Projeto

```
📁 Markdown-Brasil/
├── index.html           # Página principal com editor e preview
├── style.css            # Temas e estilos responsivos
└── js/                  # Módulos JavaScript (lógica do app)
    ├── app.js           # Ponto de entrada e inicialização
    ├── db.js            # Persistência com localStorage
    ├── editor.js        # Área de edição Markdown
    ├── export.js        # (futuro) exportação de conteúdo
    ├── history.js       # Suporte a undo/redo
    ├── keybindings.js   # Atalhos de teclado
    ├── modals.js        # Modais e diálogos
    ├── theme.js         # Aplicação e troca de temas
    ├── commands.js      # Comandos de formatação (bold, etc.)
    ├── ui.js            # Elementos e eventos da interface
    └── misc.js          # Funções auxiliares diversas
```

---

## 5. Roadmap

- [ ] Exportação para `.md` e `.html`
- [ ] Upload/arraste de imagem
- [ ] Modo tela cheia / apresentação
- [ ] Conversão reversa HTML → Markdown
- [ ] Suporte a PWA offline

---

## 7. Contribuições

Contribuições são bem-vindas!
Siga os princípios do projeto:

- Código simples, direto, sem frameworks pesados
- Commits claros e bem documentados
- Issues objetivas com contexto técnico

---

## 📜 Licença

Distribuído sob **GPL-3.0 license**. Veja o arquivo `LICENSE`.

---

## 🙋‍♂️ Desenvolvido por

**Carlos Henrique Tourinho Santana**  
📍 Salvador - Bahia, Brasil  

🔗 Wiki Debian: [wiki.debian.org/henriquetourinho](https://wiki.debian.org/henriquetourinho)  
🔗 LinkedIn: [br.linkedin.com/in/carloshenriquetourinhosantana](https://br.linkedin.com/in/carloshenriquetourinhosantana)  
🔗 GitHub: [github.com/henriquetourinho](https://github.com/henriquetourinho)

---

<p align="center">Feito com ❤️ no Brasil</p>
