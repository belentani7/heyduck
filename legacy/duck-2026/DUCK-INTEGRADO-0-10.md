# DUCK Integrado — níveis 0 a 10

## Objetivo

Esta integração reúne a base funcional do **DUCK-2000** com as versões visuais e de console encontradas no Drive, preservando os arquivos originais e criando uma versão unificada para teste.

## Mapa dos níveis

| Nível | Capacidade integrada | Componentes de origem |
|---|---|---|
| 0 | Base do projeto, identidade DUCK e estrutura HTML | `index.html`, `DUCK-2000` |
| 1 | Dados centralizados de artista, catálogo e estatísticas | `data.js` |
| 2 | Estilo visual, tipografia, cores, layout responsivo e acessibilidade | `styles.css`, `index.html` |
| 3 | Animações, transições, scroll suave e efeitos de interação | GSAP, ScrollTrigger, Lenis e scripts das versões unificadas |
| 4 | Hero, navegação, menu, progresso de rolagem e experiência mobile | `DUCK-MEGA-UNIFICADO.html`, `02-DUCK-FUSIONADO-COMPLETO.html` |
| 5 | Catálogo, lançamentos, capas, links externos e previews de áudio | `data.js`, `app.js` |
| 6 | Beat store e pacotes de licenciamento | `data.js`, seção de licenças do DUCK-2000 |
| 7 | Serviços, estações de estúdio, equipamentos e cadeia de produção | `data.js`, seções de estúdio e ecossistema |
| 8 | Contato, links oficiais, metadados e estrutura SEO | `index.html`, versões unificadas |
| 9 | Console/estúdio interativo, controles avançados e elementos experimentais | `legacy-studio-console.html` |
| 10 | Experiência final unificada, com todos os módulos disponíveis em uma única entrada | `DUCK-MEGA-UNIFICADO.html` como camada visual principal |

## Entrada recomendada

O arquivo `DUCK-INTEGRADO-0-10.html` deve ser aberto junto da pasta `images` e do arquivo `data.js` existentes no projeto `DUCK-2000`. Ele é uma versão de integração não destrutiva: os HTMLs, scripts, estilos e backups originais permanecem preservados.

## Observações técnicas

A versão integrada depende dos assets locais referenciados pelo projeto, especialmente `images/logo-duck.png`, `images/logo-768x768.png` e as imagens de capas e estúdio. Também utiliza bibliotecas externas carregadas por CDN, incluindo GSAP e Lenis. O funcionamento offline completo exigirá baixar essas bibliotecas e armazená-las localmente.

Os níveis 0 a 10 representam uma organização funcional da integração; eles não correspondem a versões oficiais numeradas no Drive. Antes de publicar em produção, é necessário validar todos os caminhos de imagens, os previews de áudio, os links externos e a compatibilidade mobile.
