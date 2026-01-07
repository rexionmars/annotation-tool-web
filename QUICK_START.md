# Guia Rápido - Ferramenta de Anotação Web

## 🚀 Início Rápido

### 1. Instalação

```bash
npm install
```

### 2. Executar em Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📋 Passo a Passo

### Primeira Vez

1. **Acesse a aplicação** - Abra o navegador em `http://localhost:3000`
2. **Faça upload das imagens** - Clique em "Selecionar Imagens" e escolha suas imagens de carcaças
3. **Comece a anotar!**

### Criando Anotações

#### Passo 1: Selecione o Modo
- Clique em **"Gordura"** para anotar regiões de gordura (vermelho)
- Clique em **"Músculo"** para anotar regiões de músculo (azul)

#### Passo 2: Desenhe Polígonos
1. **Clique esquerdo** na imagem para adicionar pontos ao polígono
2. Continue clicando para adicionar mais pontos
3. **Clique direito** para finalizar o polígono (mínimo 3 pontos)

#### Passo 3: Gerencie suas Anotações
- **Finalizar Polígono**: Completa o polígono atual
- **Limpar Polígono**: Remove os pontos do polígono em andamento
- **Resetar Anotações**: Remove todas as anotações da imagem atual

#### Passo 4: Navegue entre Imagens
- Use os botões **"← Anterior"** e **"Próxima →"**
- As anotações são automaticamente preservadas

#### Passo 5: Exporte os Resultados
- Clique em **"Exportar Anotações"** no topo
- Baixe o arquivo ZIP com todas as máscaras e segmentações

## 🎨 Recursos

### Temas
- Clique no ícone de sol/lua no canto superior direito
- Alterna entre modo claro e escuro

### Visualização em Tempo Real
- À medida que você desenha, veja um preview do polígono
- Anotações completas aparecem com overlay semi-transparente
- Vermelho = Gordura | Azul = Músculo

## 📦 Estrutura da Exportação

Quando você exporta, recebe um ZIP com:

```
annotations_2025-11-09.zip
├── fat/
│   └── [suas_imagens]_fat.png       # Apenas regiões de gordura
├── muscle/
│   └── [suas_imagens]_muscle.png    # Apenas regiões de músculo
└── masks/
    ├── [suas_imagens]_fat_mask.png     # Máscara binária de gordura
    └── [suas_imagens]_muscle_mask.png  # Máscara binária de músculo
```

## 💡 Dicas

### Performance
- Para melhor performance, use imagens com resolução até 2000x2000px
- Se tiver muitas imagens (>50), considere processar em lotes

### Precisão
- Zoom do navegador pode ser usado (Cmd/Ctrl + ou -)
- Quanto mais pontos no polígono, mais precisa a anotação
- Use o preview do cursor para ver onde o próximo ponto será

### Atalhos de Teclado ✅

**Modos:**
- `F` - Modo Gordura (vermelho)
- `M` - Modo Músculo (azul)

**Polígonos:**
- `Enter` - Finalizar polígono atual
- `Esc` - Limpar polígono em andamento
- `R` - Resetar todas as anotações da imagem

**Navegação:**
- `→` - Próxima imagem
- `←` - Imagem anterior

**Zoom:**
- `Scroll` - Zoom in/out no cursor
- `Cmd/Ctrl + +` - Aumentar zoom
- `Cmd/Ctrl + -` - Diminuir zoom
- `Cmd/Ctrl + 0` - Resetar zoom (100%)
- `Espaço + Arrastar` - Mover a imagem
- `Botão do Meio + Arrastar` - Mover a imagem

**Exportação:**
- `Cmd/Ctrl + S` - Exportar anotações

## 🐛 Solução de Problemas

### Imagem não aparece
- Verifique se o formato é suportado (JPG, PNG, BMP, TIFF)
- Tente recarregar a página

### Exportação não funciona
- Certifique-se de ter pelo menos uma anotação
- Verifique o console do navegador para erros

### Polígono não finaliza
- São necessários no mínimo 3 pontos
- Use clique direito ou o botão "Finalizar Polígono"

## 🔧 Build para Produção

```bash
# Build otimizado
npm run build

# Executar versão de produção
npm run start
```

## 📱 Compatibilidade

- ✅ Chrome/Edge (Recomendado)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile (funcional, mas desktop recomendado)

## 🆚 Comparação com Versão Python

| Recurso | Python (Tkinter) | Web (Next.js) |
|---------|------------------|---------------|
| Interface | Desktop | Navegador |
| Instalação | Python + deps | npm install |
| Multiplataforma | ✅ | ✅ |
| Temas | ❌ | ✅ |
| Responsivo | ❌ | ✅ |
| Cloud Deploy | ❌ | ✅ |
| Performance | Rápido | Rápido |

## 🎯 Próximos Passos

Após dominar o básico:
1. Experimente com diferentes tipos de imagens
2. Use o modo escuro para reduzir fadiga visual
3. Organize seu fluxo de trabalho por lotes de imagens
4. Mantenha backups das exportações

---

**Precisa de ajuda?** Consulte o [README.md](README.md) completo ou abra uma issue no repositório.
