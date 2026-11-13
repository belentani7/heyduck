# Validação técnica da base canônica

## Escopo validado

A aplicação ativa foi substituída pela fonte canônica inspecionada em `duck-studio-unified/apps/duck-studio-platform`. Os diretórios de aplicação, servidor, modelos de dados, componentes compartilhados, configurações e bloqueio de dependências foram adotados sem copiar diretórios legados, ativos de mídia ou arquivos de ambiente. Os documentos de inventário, classificação, pesquisa, plano mestre e backlog do projeto ativo foram preservados.

| Verificação | Comando executado | Resultado |
|---|---|---|
| Tipagem | `pnpm check` | Aprovado, código de saída 0. |
| Testes | `pnpm test` | Aprovado: quatro arquivos e nove testes. |
| Build de produção | `pnpm build` | Aprovado, código de saída 0. Há aviso de tamanho de bundle para acompanhamento, sem falha de compilação. |
| Dependências de produção | `pnpm audit --prod --json` | Aprovado, código de saída 0. |
| Instalação | `pnpm install --frozen-lockfile --ignore-scripts` | Aprovada sem executar scripts de ciclo de vida. |

## Limites da validação

Esta validação confirma somente a base canônica e seus testes existentes. Nenhuma fonte legada foi executada, nenhum módulo condicionado foi importado e não houve ativação de Shopify, pagamentos, e-mail externo, automações recorrentes, geração de áudio, publicação de ativos ou comunicação com clientes. A validação visual e manual por teclado será realizada após a reinicialização do ambiente de desenvolvimento e a revisão das rotas públicas e autenticadas.

## Ampliação validada nesta evolução

Após a integração da base, foram incluídos alertas internos ao proprietário para novo interesse, briefing, feedback, aprovação de etapa e solicitação de privacidade. Os alertas contêm apenas contexto operacional mínimo, não incluem e-mail ou conteúdo privado de clientes e falhas de entrega não interrompem a persistência do fluxo principal.

Também foi validada uma prévia sonora breve no Beat Lab. O áudio só é iniciado após uma ação explícita da pessoa usuária, apresenta estado de ouvir/parar, encerra os osciladores ao finalizar ou sair da rota e declara que é um esboço de oito passos, sem representar uma DAW, stems ou geração musical por IA.

A orientação de briefing por IA seleciona um modelo disponível em tempo de execução, envia somente clima, BPM, estrutura e variação do esboço, e exige resposta JSON estruturada. A interface explicita que a orientação não é salva automaticamente, não envia áudio, não publica conteúdo, não contata clientes e não altera o projeto. A validação final aprovou tipagem, build, auditoria de dependências de produção e sete arquivos de teste, totalizando dezesseis testes.

| Revisão visual | Resultado |
|---|---|
| Página inicial em português brasileiro | Identidade esmeralda e superfícies de vidro preservadas; conteúdo comercial permanece em estado transparente. |
| Rotas públicas `/es` e `/en` | Renderizadas com a mesma estrutura e conteúdo localizado. |
| Catálogo e privacidade | Estados vazios e fluxo de privacidade visíveis, sem produtos ou alegações comerciais fictícias. |
| Portal, controle e CRM | Rotas renderizadas com separação de operação, governança e estados reais de ausência de dados. |
| Beat Lab em desktop e mobile | Legível e responsivo; prévia sonora claramente identificada como rascunho local. |

## Evidência de acessibilidade e governança

O tema ativo declara superfícies esmeralda escuras e texto de alto valor de luminosidade, com foco visível de três pixels em links, botões, campos, seletores e áreas de texto. As superfícies de vidro possuem alternativa para preferência por transparência reduzida. A folha global também contém uma regra explícita para `prefers-reduced-motion`, tornando animações e transições não essenciais praticamente instantâneas e removendo a rolagem suave. Essas regras foram revisadas junto às rotas públicas e ao Beat Lab em desktop e mobile.

A governança em três nós está implementada em `server/studioDomain.ts`: o **nó de dados** verifica destinatário e consentimento; o **nó de risco** determina o nível de risco por ação e jurisdição; e o **nó do proprietário** exige aprovação quando configurada ou quando o risco não é baixo. A pausa global é prioritária. A suíte `server/studioDomain.test.ts` verifica os três desfechos críticos: falta de consentimento retorna `blocked`, pausa global retorna `paused` e aviso externo de entrega retorna `awaiting_approval`.

## Superfícies consolidadas e limites comerciais

A página pública ativa já expõe serviços, contato, rotas em português brasileiro, espanhol e inglês, catálogo consultado no servidor, portfólio reservado para obras autorizadas e espaço de depoimentos que permanece vazio sem relatos reais consentidos. A página do portal centraliza briefs, projetos, etapas, feedback, entregáveis e licenças sob autenticação, com estados explícitos quando um projeto, arquivo ou licença ainda não existe.

O módulo de comércio permite ao proprietário criar somente rascunhos de produtos e modelos de licença, bem como associar ativos previamente inventariados. Não há integração Shopify ativa, checkout, cobrança, e-mail comercial externo, publicação automática, emissão automática de licença ou pagamento simulado. A vitrine pública mostra apenas produtos em estado `active`; sem itens autorizados, ela se mantém vazia e explica o bloqueio.

Nenhum módulo legado foi promovido após a matriz de classificação. A única fonte aprovada para evolução direta é a aplicação canônica. Por isso, não há módulos adicionais a validar neste checkpoint; os candidatos condicionados continuam isolados até receberem licença, procedência, compatibilidade e testes verificáveis.
