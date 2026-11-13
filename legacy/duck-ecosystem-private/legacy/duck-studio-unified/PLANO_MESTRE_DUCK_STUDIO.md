# Plano Mestre de Evolução — Duck Studio Unified

## 1. Objetivo real e princípio de continuidade

O Duck Studio deve evoluir como o sistema digital de um artista e produtor: uma presença pública elegante, uma área privada para clientes, uma camada criativa para organizar produção, um acervo de ativos com acesso controlado e uma operação comercial supervisionada. O objetivo não é prometer autonomia financeira, produção automática de música ou ações comerciais sem controle. O objetivo é reduzir trabalho repetitivo, tornar o processo de criação e atendimento rastreável e oferecer ao operador condições concretas para decidir, revisar e crescer com consistência.

O projeto parte da aplicação canônica auditada em `apps/duck-studio-platform`. Nenhum legado será mesclado em massa. Os repositórios históricos permanecem como fontes de referência, sujeitos a uma matriz de classificação e a adaptações pequenas, testadas e rastreáveis. Esse modelo segue a própria arquitetura preservada do ecossistema Duck: integrar por manifestos, adaptadores, políticas, aprovações e evidências, sem apagar a identidade ou a procedência de cada origem.

> **Critério de verdade:** uma capacidade só pode ser exibida como real quando houver integração, permissão, ativo e validação correspondentes. Na ausência desses elementos, a interface deve dizer claramente se a capacidade está bloqueada, planejada, indisponível ou aguardando material do operador.

## 2. Horizonte de valor e indicadores de avanço

| Horizonte | Resultado desejado | Sinal verificável |
|---|---|---|
| Artístico | A identidade e o catálogo do artista são apresentados com clareza e qualidade. | Portfólio autorizado, créditos, projetos e páginas públicas localizadas publicados pelo operador. |
| Criativo | Briefs e projetos deixam de depender de mensagens dispersas. | Cada projeto ativo possui objetivo, referências, etapas, versões e feedback centralizados. |
| Relacional | O cliente entende seu projeto, entregáveis e próximos passos sem expor dados de terceiros. | Portal autenticado com isolamento de dados por usuário e histórico de interações. |
| Operacional | A equipe prioriza e acompanha tarefas com controle humano. | Tarefa, alerta ou automação possui origem, risco, estado, responsável e histórico. |
| Comercial | Produtos e licenças reais podem ser publicados e vendidos sem inventar termos ou preços. | Catálogo ativo, checkout integrado, confirmação de pedido e licença emitida com evidência. |
| Sustentabilidade | O operador decide onde investir tempo e recursos a partir de dados observados. | Painel de cenários alimentado por métricas reais, sem projeções tratadas como garantia. |

## 3. Arquitetura unificada

O produto será organizado em seis planos interligados. Eles permitem que a experiência visual, a produção musical, a IA e o comércio evoluam sem permitir que uma camada não verificada produza afirmações ou ações externas indevidas.

| Plano | Responsabilidade | Base existente | Evolução prevista |
|---|---|---|---|
| Experiência | Site público, idiomas, identidade esmeralda, glassmorfismo e navegação. | Landing, catálogo e rotas pt-BR/ES/EN. | Refinar conteúdo real, SEO, acessibilidade e movimento de alta qualidade. |
| Clientes | Briefs, projetos, entregas, feedback e licenças. | Portal autenticado, projetos, marcos e feedback. | Melhorar acompanhamento de status, comentários, entregáveis versionados e notificações. |
| Criativo | Direção musical, organização de faixas, ativos, versões e produção assistida. | Beat Lab e modelos de dados de ativos. | Implementar prova de conceito de áudio no navegador e fluxo de revisão de produção. |
| Inteligência | Assistente de IA, classificação, síntese, tradução e orientação contextual. | Infraestrutura de IA no servidor e interface de chat disponível. | Criar recursos de IA com escopo restrito, custo visível, revisão humana e logs. |
| Operação | CRM, tarefas, aprovações, pausa, privacidade, métricas e alertas. | CRM, governança de três nós e controles de automação. | Conectar gatilhos reais, notificações ao proprietário e regras idempotentes. |
| Evidência | Procedência, direitos, status de verdade, auditoria e validação. | Modelos de eventos, controles e documentos de auditoria. | Formalizar registro de origem, adaptadores, evidências de teste e decisões de publicação. |

## 4. Frente pública do artista

A experiência pública será em português brasileiro como padrão, mantendo espanhol e inglês em rotas equivalentes. O visual deve preservar fundo escuro sofisticado, superfícies de vidro esmeralda espesso, tipografia legível, formas arredondadas e contraste alto. O movimento será discreto, orientado à leitura e à navegação, respeitando a preferência de redução de movimento. GSAP pode complementar animações de alto valor, mas somente após prova de conceito, medição de bundle e validação de acessibilidade; transições usuais devem permanecer em CSS ou nas ferramentas já presentes. [1]

| Área pública | Conteúdo permitido agora | Conteúdo bloqueado até validação |
|---|---|---|
| Início e manifesto | Proposta de valor, estética, serviços e caminhos de contato aprovados pelo operador. | Biografia, cases, números ou promessas não fornecidos. |
| Portfólio | Estrutura e estados vazios transparentes. | Obras, imagens, créditos, links e direitos de terceiros sem autorização. |
| Beats e produtos | Catálogo somente de itens reais em estado `active`. | Previews, preços, licenças, compra ou disponibilidade simulados. |
| Serviços | Fluxo de interesse, briefing e contato com finalidade declarada. | Prazos, garantias ou capacidades de produção não confirmadas. |
| Privacidade | Rota pública de privacidade, preferências e solicitação de direitos. | Declarações jurídicas absolutas sem revisão especializada. |

## 5. Portal de clientes e relacionamento

O portal é a fonte de verdade do projeto do cliente. Cada pessoa autenticada poderá acessar somente os próprios briefs, projetos, entregas autorizadas, feedback e licenças emitidas. O operador terá visão de CRM e administração separada, protegida por papel de acesso. A criação de qualquer dado deve registrar autor, data, contexto e estado, evitando que mensagens comerciais ou arquivos privados se confundam com conteúdo público.

| Fluxo | Estado inicial | Critério de aceite |
|---|---|---|
| Briefing | Estruturado por objetivo, referências, gênero, BPM e clima. | Cliente cria ou edita apenas o próprio brief; operador vê fila de revisão. |
| Projeto | Organizado por etapa, progresso e marcos. | Alterações relevantes aparecem no histórico e respeitam o vínculo com o cliente. |
| Feedback | Mensagens associadas ao projeto e ao autor. | Cliente e operador recebem contexto sem acesso a outros projetos. |
| Entregas | Arquivo, versão, aprovação e permissão. | Download exige autenticação, autorização e ativo registrado. |
| Licenças | Produto, termos, versão e número de licença. | Emissão só ocorre após pedido confirmado por integração real. |

## 6. Ferramenta de produção musical e Beat Lab

O Beat Lab já pode continuar como ambiente de direção musical e registro de proposta. A evolução para produção assistida deve começar como uma prova de conceito de sessão curta: transporte, BPM, pads ou sintetizador, rascunho de sequência, cadeia simples de ganho/filtro e exportação explícita de metadados. A Web Audio API foi projetada para grafos modulares de fontes e efeitos, e suporta sequenciamento de baixa latência; Tone.js é uma possível camada de transporte, sintetizadores e agendamento sobre essa API. [2] [3]

| Nível | Entrega | Limite de verdade |
|---|---|---|
| 1 — Direção | Brief musical, referências, BPM, gênero, clima e checklist. | Não gera áudio. |
| 2 — Esboço | Sequência MIDI ou eventos musicais, transporte e síntese simples no navegador. | Requer interação explícita para ativar áudio; não substitui uma DAW profissional. |
| 3 — Sessão | Faixas, ganho, panorama, filtros, automação curta e versão de rascunho. | Não promete compatibilidade com FL Studio, Ableton ou stems sem adaptador validado. |
| 4 — Revisão | Comentários ligados a minuto/versão e entrega de preview autorizado. | Arquivos devem vir de armazenamento privado, com direitos e metadados validados. |
| 5 — Integração local | Adaptador para estação Windows e DAW do operador. | Depende de software, APIs, permissões e ambiente local efetivamente configurados. |

## 7. Acervo digital e gestão de ativos

Os ativos devem permanecer fora do repositório de código e ser armazenados em área privada. O registro de metadados deve conter tipo, origem, hash, tamanho, versão, status e nível de acesso. A fonte atual já prevê áudio, imagem, vídeo, presets, documentos e arquivos de projeto, além do vínculo entre um ativo e sua função de preview, capa, arquivo licenciado ou documentação.

| Etapa | Regra de tratamento | Resultado |
|---|---|---|
| Recebimento | Operador envia ativo e registra origem, autor, direitos, finalidade e tipo. | Ativo `pending`, privado e sem exposição pública. |
| Validação | Conferir integridade, formato, metadados, direitos e público autorizado. | Ativo `active` ou `archived` com justificativa. |
| Associação | Vincular ativo a portfólio, projeto, produto ou licença. | Relação explícita e auditável, sem duplicação de arquivo. |
| Entrega | Gerar acesso temporário apenas para a pessoa autorizada. | Download controlado e registrável. |
| Retirada | Arquivar a referência, revogar acesso e manter evidência administrativa adequada. | Conteúdo deixa de ser oferecido sem apagar a procedência operacional. |

## 8. IA assistiva, não autônoma

A IA deverá atuar como copilot: propor sínteses de brief, estruturar perguntas, gerar rascunhos internos, resumir feedback, sugerir taxonomia de ativos, apoiar tradução e identificar lacunas em uma licença ou entrega. Toda chamada deve ocorrer no servidor, com modelo selecionado dinamicamente, dados mínimos necessários, orçamento de uso, entrada e saída registradas e revisão humana antes de uma ação externa. O catálogo de modelos deve ser consultado em tempo de execução antes de selecionar um identificador ou custo específico. [4]

| Caso de uso | Entrada permitida | Saída | Supervisão exigida |
|---|---|---|---|
| Assistente de briefing | Dados fornecidos pelo cliente no próprio projeto. | Perguntas, resumo e direcionamento musical. | Cliente ou operador confirma antes de salvar como decisão. |
| Resumo de feedback | Comentários de um projeto acessível ao solicitante. | Lista de temas e próximos passos. | Operador valida prioridades e resposta final. |
| Curadoria de ativos | Metadados e descrições autorizadas. | Etiquetas, categorias e sinais de duplicidade. | Não altera permissões nem publica ativos. |
| Tradução editorial | Textos públicos aprovados. | Variante pt-BR, ES ou EN para revisão. | Publicação permanece manual. |
| Assistente operacional | Tarefas, estados e bloqueios já auditados. | Diagnóstico e proposta de ação. | Não envia e-mail, altera pedido ou libera arquivo por conta própria. |

## 9. Automação supervisionada e notificações

Todo fluxo automático deverá passar por três nós: **regras e permissão**, **risco e consistência**, e **aprovação humana quando aplicável**. A pausa global deve prevalecer sobre qualquer gatilho. Cada tentativa deve registrar origem, insumos mínimos, resultado, erro, nível de risco e responsável. Notificações ao proprietário serão utilizadas para novos briefs, feedback, aprovações aguardando decisão, solicitações de privacidade e bloqueios críticos, sem se confundir com comunicação automática ao cliente.

| Evento | Ação automática segura | Ação que exige aprovação explícita |
|---|---|---|
| Novo brief | Criar registro, classificação inicial e alerta ao proprietário. | Alterar escopo, preço, prazo ou aceitar o pedido. |
| Novo feedback | Vincular ao projeto e notificar o operador. | Responder em nome do artista. |
| Entrega aprovada | Atualizar estado e registrar evidência. | Liberar ativo licenciado se pedido ou termos não estiverem confirmados. |
| Pedido de privacidade | Criar protocolo e suspender comunicação comercial quando cabível. | Excluir dados sem confirmação humana de identidade e revisão do caso. |
| Evento de pagamento | Registrar evento recebido apenas após verificação de assinatura. | Emitir licença ou enviar arquivo se houver inconsistência, duplicidade ou pausa global. |

### Alternativas de execução para rotinas automáticas

Antes de ativar rotinas recorrentes, o operador deve escolher entre alternativas que preservam supervisão e custo previsível. A tabela apresenta opções viáveis, sem selecionar uma delas antecipadamente.

| Abordagem | Trade-offs | Custo | Complexidade de configuração |
|---|---|---|---|
| Rotinas gerenciadas do próprio site | Executam tarefas determinísticas periódicas, como limpeza, resumo diário ou alerta de pendência; oferecem painel de parâmetros e registros. | Baixo para começar; depende de uso do site. | Moderada; exige endpoint idempotente, autenticação, teste e publicação prévia. |
| Gatilhos por evento | Reagem a envio de brief, feedback, upload ou webhook de serviço externo; tendem a oferecer menor latência. | Baixo a moderado; depende de integrações e volume. | Moderada; exige validação de assinatura, idempotência, política de falha e observabilidade. |
| Análise agentiva em baixa frequência | Útil para curadoria, pesquisa ou relatórios que realmente demandam julgamento de IA e múltiplas etapas. | Variável por execução e volume de IA. | Baixa a moderada; exige definição clara do que o agente pode registrar e como retorna resultados. |
| Serviço contínuo dedicado | Indicado somente para processamento constante, conexão em tempo real ou fila de longa duração. | Maior e recorrente. | Alta; requer justificativa de capacidade, monitoramento e manutenção. |

Nenhuma rotina recorrente será ativada antes da publicação da versão que contém o manipulador correspondente, da definição de frequência, de testes de idempotência e de uma regra de pausa/recuperação. Processamentos pesados de áudio, transcodificação em lote e ferramentas dependentes de sistema operacional não pertencem ao ambiente web padrão; eles devem ser tratados em uma estação local ou infraestrutura dedicada apenas quando a necessidade estiver comprovada.

## 10. Comércio, licenças e sustentabilidade

O comércio deve permanecer desacoplado da experiência artística. A vitrine poderá ser própria, mas produtos, carrinho, checkout, pagamento e fulfillment deverão operar em um provedor efetivamente conectado. O Shopify Storefront API fornece primitivas para catálogo, coleções, carrinho e preços contextuais; tokens privados permanecem apenas no servidor. [5] Eventos de pedido deverão validar HMAC sobre o corpo bruto, deduplicar entregas e registrar resultado de forma idempotente. [6]

| Fase comercial | Pré-requisito | Critério de aceite |
|---|---|---|
| Catálogo interno | Produtos, termos e licenças em rascunho, sem exibição pública. | Operador consegue revisar versão, categoria, moeda, status e ativos vinculados. |
| Catálogo público | Produtos reais marcados como `active`, com preview e termos autorizados. | Nenhum item demonstrativo é exibido como oferta real. |
| Checkout | Loja confirmada, integração habilitada e fluxo de pagamento testado em ambiente apropriado. | Pedido confirmado chega com assinatura verificada e registro único. |
| Licença | Termos ativos, produto vinculado e pagamento conciliado. | Número de licença, versão de termos, território e status persistidos. |
| Entrega licenciada | Ativo validado e licença ativa do cliente. | URL temporária liberada somente à conta autorizada. |

O painel de sustentabilidade deverá trabalhar com métricas observadas: visitas qualificadas, conversão, ticket médio, custo variável e tempo operacional. Ele pode apresentar sensibilidades baseadas nas premissas escolhidas pelo operador, mas nunca garantias de receita, recomendação financeira personalizada ou transações automáticas.

## 11. Segurança, privacidade e qualidade

O OWASP ASVS será a referência de verificação técnica para controles de autenticação, autorização, entrada, sessão, arquivos e auditoria. [7] A LGPD disciplina o tratamento de dados pessoais em meios digitais; os fluxos de cliente, CRM, comunicação e IA devem tratar finalidade, acesso, retenção e solicitações de titulares de modo transparente, sem substituir análise jurídica aplicável. [8]

| Controle | Regra de implementação | Evidência de aceite |
|---|---|---|
| Autorização | Procedimentos protegidos e verificações de proprietário por recurso. | Testes negativos impedem acesso a dados de outro cliente. |
| Armazenamento | Arquivo em armazenamento privado; banco mantém chave e metadados, não bytes. | URL de entrega falha sem sessão, licença ou associação válida. |
| Segredos | Credenciais apenas no servidor e fora de commits, ZIPs, cliente e logs. | Varredura de padrões e revisão de arquivos de ambiente antes de publicar. |
| IA | Dados mínimos, saída estruturada, log de uso e confirmação humana para impacto externo. | Teste de permissões, validação de esquema e estado de bloqueio. |
| Acessibilidade | Navegação por teclado, foco visível, contraste, semântica e redução de movimento. | Revisão manual nas rotas públicas e fluxos essenciais do portal. |
| Qualidade | Build, TypeScript, Vitest, auditoria de dependências e revisão de rotas. | Pipeline aprovado antes de qualquer publicação. |

## 12. Roteiro de execução e critérios de aceite

| Marco | Escopo | Resultado mensurável | Dependências externas |
|---|---|---|---|
| M0 — Consolidação segura | Importar a fonte canônica, preservar legados, documentar inventário e matriz. | Base ativa corresponde à fonte canônica e todos os legados estão isolados. | Nenhuma. |
| M1 — Regressão e experiência | Revalidar rotas pt-BR/ES/EN, portal, CRM, privacidade e governança; refinar UI sem mudar a verdade do conteúdo. | Build, tipos, testes e rotas essenciais aprovados. | Nenhuma. |
| M2 — Acervo e entregas | Concluir metadados, upload administrativo, associação de ativo, entrega restrita e trilha de acesso. | Ativo autorizado percorre recebimento, revisão e entrega a cliente autorizado. | Arquivos e direitos fornecidos pelo operador. |
| M3 — Beat Lab funcional | Prova de conceito de sessão musical no navegador, sem prometer DAW completo. | Transporte, rascunho e sessão curta funcionam após interação explícita. | Testes com navegadores e ativos de demonstração autorizados. |
| M4 — IA assistiva | Briefing, síntese de feedback e assistência operacional com logs e confirmação. | Saídas estruturadas, revisão humana e proteção por papel de acesso. | Definição de orçamento e política de dados. |
| M5 — Automação e alertas | Notificações ao proprietário, pausa, aprovações e rotinas idempotentes. | Evento real gera alerta, evento bloqueado não executa ação externa. | Decisão sobre frequência, canais e publicação. |
| M6 — Comércio real | Shopify, produtos, licenças, checkout, webhook e entrega licenciada. | Pedido verificado produz licença e acesso somente quando os critérios forem satisfeitos. | Loja, credenciais, produtos, termos, preços e aprovações. |
| M7 — Operação contínua | Métricas reais, auditorias periódicas, revisão de acessibilidade e gestão de backlog. | Painel usa dados observados e as decisões possuem evidência. | Processo do operador e dados de uso. |

## 13. Bloqueios assumidos e decisões pendentes

| Bloqueio | Impacto | Decisão necessária do operador |
|---|---|---|
| Loja não conectada | Não há carrinho, checkout ou emissão automática de licença. | Confirmar se haverá loja existente ou uma nova loja de desenvolvimento. |
| Ativos sem curadoria | Não há portfólio, preview, preset, stem ou download real publicável. | Fornecer arquivos, direitos, créditos, categoria e política de acesso. |
| Termos e preços não aprovados | Produtos não podem ser ofertados como comerciais. | Aprovar textos de licença, territórios, valores, moeda e política de reembolso. |
| Integrações externas indefinidas | E-mail, pagamento, webhooks e alertas externos não podem ser ativados. | Definir provedores, finalidades, destinatários e limiar de aprovação. |
| Produção local ainda não conectada | O ambiente web não deve alegar integrar DAW ou plugins instalados no Windows. | Definir estação de trabalho, DAW, plugins e permissões a integrar por adaptador. |

## 14. Referências

[1] [GSAP — documentação oficial](https://gsap.com/docs/v3/)

[2] [Web Audio API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

[3] [Tone.js — documentação oficial](https://tonejs.github.io/)

[4] [Catálogo e integração de modelos de IA do ambiente](./PESQUISA_TECNICA.md)

[5] [Shopify Storefront API — documentação oficial](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api)

[6] [Shopify — Verify webhook deliveries](https://shopify.dev/docs/apps/build/webhooks/verify-deliveries)

[7] [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

[8] [Lei nº 13.709/2018 — LGPD, Presidência da República](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
