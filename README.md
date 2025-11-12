# ☕ Café Store - SPA

Projeto da matéria de Programação Visual e Autoria Web, ministrada pelo professor Taniro. Consiste em um e-commerce **Single Page Application (SPA)** desenvolvido com JavaScript puro, focado na venda de cafés especiais. O projeto utiliza consumo de API RESTful simulada e persistência de dados local.

![Status](https://img.shields.io/badge/Status-Concluído-success) ![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica.
- **CSS3 & Bootstrap:** Estilização, layout responsivo e componentes visuais.
- **JavaScript:** Lógica de roteamento, manipulação do DOM e gerenciamento de estado.
- **JSON Server:** Simulação de API REST para os produtos.
- **Web Storage API:** Persistência do carrinho de compras (`localStorage`).

## 📂 Estrutura do Projeto

```
TRABALHO2---CAFESTORE/
│
├── 📂 fonts/
│   └── 📄 SaintCarell_PERSONAL_USE_ONLY.otf
│
├── 📄 db.json        (Banco de dados simulado)
├── 📄 index.html     (Página única / SPA)
├── 📄 script.js      (Lógica do sistema)
└── 📄 style.css      (Estilos e fontes)
```

## ✨ Funcionalidades Principais

1.  **Navegação SPA:** Transição entre telas (Home, Carrinho, Checkout) sem recarregar a página.
2.  **Catálogo Dinâmico:** Renderização de produtos consumidos de uma API externa.
3.  **Gestão de Carrinho:**
    - Adicionar/Remover itens.
    - Ajuste de quantidade.
    - Cálculo automático de subtotal e total.
    - Persistência de dados (o carrinho não some ao fechar a aba).
4.  **Checkout em Etapas:**
    - **Etapa 1:** Formulário de endereço com validação HTML5.
    - **Etapa 2:** Seleção de pagamento (Pix com QR Code dinâmico, Cartão ou Boleto).
5.  **UX/UI:**
    - Feedbacks visuais (Toasts de sucesso, Spinners de carregamento).
    - Design responsivo (Mobile-first).
    - Formatação monetária nativa (`Intl.NumberFormat`).

## 🎨 Identidade Visual

- **Paleta de Cores:**
  - 🟤 Marrom Café: `#A0522D`
  - 🟢 Verde Musgo: `#556B2F`
- **Tipografia:**
  - _Saint Carell_ (Títulos e Logo).
  - _System UI/Bootstrap_ (Textos gerais).

---

_Projeto desenvolvido para fins acadêmicos da disciplina de Programação Visual e Autoria Web._

```

```
