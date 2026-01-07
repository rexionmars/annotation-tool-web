# Ferramenta de Anotação de Carcaças - Web

Versão web moderna da ferramenta de anotação para segmentação de gordura e músculos em imagens de carcaças, construída com Next.js e shadcn/ui.

## Características

- Interface web moderna e responsiva
- Anotação por polígonos interativos
- Suporte para múltiplas imagens
- Temas claro/escuro
- Exportação completa de anotações (máscaras + imagens segmentadas)
- Preview em tempo real das anotações
- Gerenciamento de estado eficiente com Zustand

## Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI
- **Zustand** - Gerenciamento de estado
- **Lucide React** - Ícones
- **JSZip** - Exportação de arquivos

## Instalação

```bash
# Instalar dependências
npm install

# ou com yarn
yarn install

# ou com pnpm
pnpm install
```

## Como Usar

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build para Produção

```bash
npm run build
npm run start
```

## Guia de Uso

### 1. Upload de Imagens

- Clique em "Selecionar Imagens" na tela inicial
- Escolha uma ou múltiplas imagens de carcaças
- Formatos suportados: JPG, PNG, BMP, TIFF

### 2. Criar Anotações

1. **Selecionar modo**: Escolha entre "Gordura" (vermelho) ou "Músculo" (azul)
2. **Desenhar polígono**:
   - Clique esquerdo para adicionar pontos
   - Clique direito para finalizar o polígono (mínimo 3 pontos)
3. **Visualização**: As anotações aparecem com overlay semi-transparente

### 3. Controles

#### Modos de Anotação
- **Gordura**: Anota regiões de gordura (cor vermelha)
- **Músculo**: Anota regiões de músculo (cor azul)

#### Ações do Polígono
- **Finalizar Polígono**: Completa o polígono atual
- **Limpar Polígono**: Remove pontos do polígono em andamento
- **Resetar Anotações**: Remove todas as anotações da imagem atual

#### Navegação
- **Anterior**: Vai para a imagem anterior
- **Próxima**: Vai para a próxima imagem

### 4. Exportação

Clique em "Exportar Anotações" para baixar um arquivo ZIP contendo:

```
annotations_YYYY-MM-DD.zip
├── fat/                    # Imagens segmentadas de gordura
│   ├── imagem1_fat.png
│   └── imagem2_fat.png
├── muscle/                 # Imagens segmentadas de músculo
│   ├── imagem1_muscle.png
│   └── imagem2_muscle.png
└── masks/                  # Máscaras binárias
    ├── imagem1_fat_mask.png
    ├── imagem1_muscle_mask.png
    ├── imagem2_fat_mask.png
    └── imagem2_muscle_mask.png
```

### 5. Tema

Use o botão de alternância no canto superior direito para alternar entre modo claro e escuro.

## Estrutura do Projeto

```
annotation-tool-web/
├── src/
│   ├── app/                    # Rotas Next.js
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── separator.tsx
│   │   ├── AnnotationCanvas.tsx
│   │   ├── Toolbar.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── ExportButton.tsx
│   │   └── ThemeToggle.tsx
│   ├── lib/                    # Utilitários
│   │   ├── utils.ts
│   │   └── export.ts
│   ├── store/                  # Estado global
│   │   └── annotationStore.ts
│   └── types/                  # Tipos TypeScript
│       └── annotation.ts
├── public/                     # Arquivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## Funcionalidades Técnicas

### Canvas de Anotação
- Desenho interativo de polígonos
- Preview em tempo real do cursor
- Escalonamento automático para diferentes tamanhos de tela
- Suporte a múltiplas anotações por imagem

### Gerenciamento de Estado
- Estado global com Zustand
- Persistência de anotações por imagem
- Histórico de navegação entre imagens

### Exportação
- Geração de máscaras binárias (preto/branco)
- Extração de regiões segmentadas da imagem original
- Compactação em ZIP para download fácil

## Atalhos de Teclado

### Modos de Anotação
- `F` - Modo Gordura
- `M` - Modo Músculo

### Controles de Polígono
- `Enter` - Finalizar polígono
- `Esc` - Limpar polígono atual
- `R` - Resetar anotações (com confirmação)

### Navegação
- `→` ou `Seta Direita` - Próxima imagem
- `←` ou `Seta Esquerda` - Imagem anterior

### Zoom e Visualização
- `Scroll do Mouse` - Zoom in/out
- `Cmd/Ctrl + +` - Zoom in
- `Cmd/Ctrl + -` - Zoom out
- `Cmd/Ctrl + 0` - Resetar zoom
- `Espaço + Arrastar` - Mover imagem (pan)
- `Botão do Meio + Arrastar` - Mover imagem (pan)

### Exportação
- `Cmd/Ctrl + S` - Salvar/Exportar anotações

## Contribuindo

Este é um projeto acadêmico da UFPI. Sugestões e melhorias são bem-vindas.

## Licença

MIT

## Autor

Desenvolvido para o curso de [seu curso] - UFPI
