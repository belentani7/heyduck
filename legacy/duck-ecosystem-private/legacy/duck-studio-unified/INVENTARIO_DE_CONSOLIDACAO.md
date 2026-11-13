# Inventário e procedência da consolidação Duck

## Escopo e método

Este documento registra a inspeção estática dos pacotes recebidos e dos repositórios Duck acessíveis pela conta conectada. Nenhum código herdado foi instalado, executado ou publicado durante esta etapa. A inspeção manteve os pacotes em uma área isolada, calculou hashes SHA-256 e examinou apenas a estrutura de arquivos e a documentação necessária para identificar a aplicação canônica.

## Pacotes recebidos

| Pacote | Conteúdo verificado | Hash SHA-256 | Decisão de tratamento |
|---|---|---|---|
| `DUCKULTIMO.zip` | Pacote externo com 81 itens, documentos, fontes unificadas e duas entregas derivadas. | `b188ab25172ec62c4dcd21b08a11a4aef096dba4dca5bb4a938026f4f3e3be74` | Preservar como artefato de origem; não usar como diretório de execução. |
| `duck-studio-unified-source.zip` | 4.280 entradas. Contém a aplicação canônica e 16 origens legadas preservadas. | `6dee2259d5fc6af8c7b1ca34808f74c11ef35b2803f8425c35a9a866bf34a403` | Extrair somente a aplicação canônica para revisão; manter legados isolados. |
| `duck-studio-duck-control.zip` | 198 entradas. Espelho administrativo da aplicação, manual operacional e mapa de acesso. | `3511d2c42835691c6ac5d46bbed779280ac68607276858cef68036c2e7b7cb2d` | Usar como referência administrativa; não duplicar seu conteúdo na aplicação ativa. |
| `duck-studio-client-materials.zip` | Manual operacional em PDF e mapa de acesso, sem fontes, dados, ativos ou segredos. | `becd39e2975f90094885ea9ae4514cf73bff0864a7371d33996b4004cc2f270a` | Manter como entrega de cliente; não incorporar como código do produto. |

> **Princípio de segurança:** a existência de um módulo em um pacote não autoriza sua execução nem sua integração. Todo módulo legado permanece isolado até aprovação por compatibilidade, licença, segurança, dados e testes.

## Aplicação canônica identificada

A fonte definida como canônica está em `duck-studio-unified/apps/duck-studio-platform/`. A cópia inspecionada contém 173 arquivos de trabalho, sem incluir os metadados internos de checkpoint. Ela reúne o front-end React, o servidor tRPC, o banco modelado com Drizzle, autenticação, armazenamento privado, migrações e testes. Esta é a única fonte que será evoluída dentro do projeto ativo.

| Domínio | Evidência presente na base canônica | Estado de consolidação |
|---|---|---|
| Presença pública | Landing, catálogo de beats e rotas públicas localizadas. | Preservar e revisar visualmente. |
| Idiomas | Componentes e rotas para português brasileiro, espanhol e inglês. | Preservar como requisito de regressão. |
| Portal de clientes | Briefs, projetos, feedback, aprovações e área autenticada. | Evoluir somente com testes e controle de acesso. |
| Beat Lab | Interface de direção musical e registro de propostas em brief. | Manter como ferramenta assistiva; não declarar geração de áudio inexistente. |
| Operação | CRM, ativos, licenças, comércio, privacidade, crescimento e centro de controle. | Preservar estados vazios e bloqueios reais até ativação autorizada. |
| Governança | Regras de aprovação, pausa e trilha de auditoria. | Tratar como requisito estrutural para ações externas. |

## Dependências e ativos relevantes

A aplicação canônica declara uma pilha React 19 com TypeScript, Vite, Tailwind, componentes Radix, tRPC, Drizzle ORM, MySQL, validação Zod, React Query, formulários React Hook Form, animação Framer Motion, gráficos Recharts e Vitest. As bibliotecas existentes serão mantidas enquanto houver compatibilidade e cobertura verificável; a inclusão de bibliotecas novas dependerá de necessidade concreta, licença compatível, análise de dependências e manutenção ativa.

| Categoria | Dependências ou entidades existentes | Uso permitido nesta evolução |
|---|---|---|
| Interface | React, Tailwind, Radix UI, Lucide, Framer Motion e Sonner. | Evolução da experiência esmeralda acessível, responsiva e com movimento reduzido. |
| Dados e contratos | tRPC, Zod, React Query, Drizzle ORM e MySQL. | Portal, CRM, governança, catálogo real e trilhas auditáveis. |
| Acesso e arquivos | OAuth, JWT, armazenamento privado e URLs temporárias. | Acesso autenticado e entrega restrita de ativos autorizados. |
| Qualidade | TypeScript, Vitest, Prettier e auditoria de dependências. | Validação obrigatória dos módulos aprovados antes de integração. |
| Domínio de ativos | `digitalAssets`, `productAssets`, `deliverables` e `issuedLicenses`. | Metadados, hash de conteúdo, versão, nível de acesso, vínculo com produto e entrega licenciada. |
| Domínio de operação | `automationControls`, `automationAuditEvents`, `operationTasks` e `privacyRequests`. | Pausa, aprovação humana, classificação de risco, registro e tratamento supervisionado. |

O modelo de dados já prevê ativos de áudio, imagem, vídeo, preset, documento e arquivo de projeto. Nenhum arquivo artístico, preview ou material comercial foi considerado ativo publicado nesta inspeção. Esses materiais somente poderão entrar no armazenamento privado após validação de origem, direitos, metadados, classificação de acesso e autorização do operador.

## Origens preservadas no pacote unificado

Os diretórios legados identificados são: `DUCK-ZION-PREMIUM`, `Duck-Deck`, `Duck-Omega`, `DuckHTML`, `duck-2026`, `duck-apps`, `duck-belentani-os-audited-2026-08-23`, `duck-ecosystem`, `duck-full-studio-pro`, `duck-lab`, `duck-music-lab`, `duck-studio-suite`, `duck-unified-master`, `duck-zion-apex-public`, `heyduck` e `omega-max-duck`. Eles permanecem fora do caminho de execução da aplicação canônica.

O inventário estrutural encontrou predominância de componentes `.tsx`, código `.ts`, documentação `.md`, dados `.json`, imagens `.png` e `.jpg`, páginas `.html`, arquivos `.js`, estilos `.css`, migrações `.sql` e também fontes Python e scripts de shell. Essa variedade confirma que não é seguro nem útil efetuar mesclagem automática.

## Repositórios Duck acessíveis

| Repositório | Visibilidade | Branch principal | Licença declarada | Situação inicial |
|---|---|---|---|---|
| [duck-unified-master](https://github.com/belentani7/duck-unified-master) | Público | `main` | MIT | Referência histórica consolidada. |
| [duck-music-lab](https://github.com/belentani7/duck-music-lab) | Público | `main` | Não declarada | Isolar até revisão. |
| [duck-studio-suite](https://github.com/belentani7/duck-studio-suite) | Público | `main` | Não declarada | Isolar até revisão. |
| [duck-belentani-os-audited-2026-08-23](https://github.com/belentani7/duck-belentani-os-audited-2026-08-23) | Público | `main` | Não declarada | Referência auditada; não mesclar automaticamente. |
| [duck-ecosystem](https://github.com/belentani7/duck-ecosystem) | Público | `main` | Não declarada | Isolar até revisão. |
| [duck-2026](https://github.com/belentani7/duck-2026) | Público | `main` | Não declarada | Isolar até revisão. |
| [duck-full-studio-pro](https://github.com/belentani7/duck-full-studio-pro) | Público | `main` | Não declarada | Isolar até revisão. |
| [heyduck](https://github.com/belentani7/heyduck) | Público | `main` | Não declarada | Isolar até revisão. |
| [duck-lab](https://github.com/belentani7/duck-lab) | Público | `main` | Não declarada | Isolar até revisão. |
| [duck-apps](https://github.com/belentani7/duck-apps) | Público | `main` | Não declarada | Isolar até revisão. |
| [Duck-Omega](https://github.com/belentani7/Duck-Omega) | Público | `main` | Não declarada | Isolar até revisão. |
| [DUCK-ZION-PREMIUM](https://github.com/belentani7/DUCK-ZION-PREMIUM) | Público | `main` | Não declarada | Isolar até revisão. |
| [DuckHTML](https://github.com/belentani7/DuckHTML) | Público | `duck` | Não declarada | Isolar até revisão. |
| [duck-zion-apex-public](https://github.com/belentani7/duck-zion-apex-public) | Público | `main` | Não declarada | Isolar até revisão. |
| [Duck-Deck](https://github.com/belentani7/Duck-Deck) | Público | `main` | Não declarada | Isolar até revisão. |
| [omega-max-duck](https://github.com/belentani7/omega-max-duck) | Público | `main` | Não declarada | Isolar até revisão. |

## Decisão de consolidação

O projeto seguirá a arquitetura de **uma aplicação canônica e fontes legadas preservadas**. A integração será seletiva, rastreável e reversível: um módulo só poderá migrar para a base ativa quando tiver procedência registrada, licença ou autorização de uso confirmada, compatibilidade com React/tRPC/Drizzle, ausência de segredos e comportamento coberto por testes. Conteúdos comerciais, ativos artísticos, previews, preços, licenças e pagamentos continuarão vazios ou bloqueados até que o operador forneça materiais e autorizações válidas.
