# Pesquisa técnica para evolução do Duck Studio

## Produção musical no navegador

A base técnica para a evolução do Beat Lab deve usar a Web Audio API como camada nativa de áudio. A documentação da MDN descreve um grafo modular de fontes, nós de efeito e destino de áudio, adequado para mistura, filtros, espacialização, análise e sequenciamento com temporização de baixa latência. A biblioteca Tone.js pode ser considerada uma camada de maior nível para transporte global, agendamento, sintetizadores e efeitos, desde que seja adicionada somente após uma prova de conceito e auditoria de licença, bundle e acessibilidade. [1] [2]

| Decisão de arquitetura | Evidência | Limite obrigatório |
|---|---|---|
| Inicializar áudio por interação explícita da pessoa usuária. | Navegadores bloqueiam a reprodução antes de uma ação do usuário; a documentação do Tone.js exige iniciar o contexto após clique ou teclado. [2] | Não iniciar áudio automaticamente nem simular reprodução. |
| Modelar cada faixa como fonte, cadeia de efeitos e saída no grafo de áudio. | A Web Audio API foi projetada para roteamento modular entre fontes, nós e destino. [1] | Não prometer processamento profissional de stems sem teste de desempenho e ativos reais. |
| Usar transporte e agendamento musical para loops, BPM e sequenciamento. | Tone.js oferece transporte global e agendamento sincronizado sobre Web Audio. [2] | Não declarar compatibilidade com projetos de DAW de terceiros sem adaptador validado. |
| Manter áudio e ativos separados do código da aplicação. | O projeto canônico já modela ativos com chave privada, hash, versão e nível de acesso. | Todo preview, stem ou preset precisa de origem, licença e autorização verificadas. |

## Movimento e comércio controlados

O GSAP oferece primitivas de animação, linha do tempo, utilitários, integração com React e recursos de responsividade e acessibilidade. Ele será considerado somente para transições de alto valor visual da identidade Duck, com respeito explícito à preferência de movimento reduzido e sem substituir interações nativas de teclado. [3]

O Shopify Storefront API fornece as primitivas de produtos, coleções, carrinho e preços contextuais para uma vitrine própria. A documentação diferencia acesso público e privado, e determina que o token privado seja tratado como segredo no servidor. A ativação continua condicionada à conexão de uma loja elegível, à autorização do operador e às permissões efetivamente concedidas. [4]

| Área | Direção proposta | Condição para ativação |
|---|---|---|
| Movimento visual | Usar animações breves, reversíveis e não essenciais apenas quando ampliarem hierarquia, orientação ou percepção de qualidade. | Prova de conceito, preferência de movimento reduzido, orçamento de bundle e teste por teclado. |
| Vitrine própria | Apresentar somente produtos reais `active` e encaminhar a um fluxo de carrinho e checkout do provedor. | Loja confirmada, produtos, preços, termos, previews e permissões de storefront válidos. |
| Eventos comerciais | Registrar somente eventos reais confirmados e processá-los com idempotência, pausa e aprovação conforme o nível de risco. | Webhook autenticado, verificação de assinatura, política de retenção e responsável humano definido. |

## Segurança, privacidade e eventos externos

O OWASP ASVS fornece uma referência aberta para verificar controles técnicos de segurança e orientar requisitos de desenvolvimento seguro. Ele será usado como base de validação para autenticação, autorização, validação de entrada, gerenciamento de sessões, registros de auditoria e proteção de arquivos. [5]

Para qualquer integração futura com Shopify, cada entrega deverá ter assinatura HMAC validada sobre o corpo bruto da requisição antes do processamento. O identificador de entrega deverá ser persistido para deduplicação, e o endpoint deverá responder rapidamente, deixando tarefas posteriores em estado auditável e sujeito a aprovação. [6]

| Controle | Regra operacional proposta | Evidência exigida |
|---|---|---|
| Ação externa | Bloquear se não houver adaptador, credencial, permissão ou aprovação aplicável. | Evento de auditoria com estado `blocked` ou `awaiting_approval`. |
| Webhook comercial | Validar HMAC, registrar o identificador, rejeitar mensagens inválidas e tornar o processamento idempotente. | Teste automatizado de assinatura, duplicidade e falha. |
| Dados pessoais | Tratar o pedido de acesso, exclusão ou retirada de consentimento como fluxo autenticado e revisado. | Solicitação registrada, confirmação humana de identidade e trilha de decisão. |
| Segredos | Manter tokens privados apenas no servidor e fora de pacotes, logs e cliente. | Varredura de padrões, arquivo de ambiente não versionado e revisão antes de publicação. |

## Privacidade no contexto brasileiro

A Lei Geral de Proteção de Dados Pessoais (LGPD) disciplina o tratamento de dados pessoais, inclusive em meios digitais, e declara como objetivo a proteção da liberdade, da privacidade e do livre desenvolvimento da personalidade. O portal deverá aplicar minimização de dados, transparência de finalidades, consentimento quando cabível, acesso restrito por papel, retenção definida e fluxos verificáveis para solicitações dos titulares. A implementação técnica não substitui revisão jurídica aplicável ao negócio, aos contratos e às jurisdições atendidas. [7]

| Área do portal | Limite de implementação |
|---|---|
| Briefs, projetos e feedback | Coletar somente o necessário para o serviço contratado e restringir visualização ao cliente autorizado e à equipe definida. |
| CRM e comunicações | Separar interesse comercial de consentimento, registrar origem e permitir retirada de consentimento. |
| Solicitações de privacidade | Exigir confirmação humana de identidade antes de acesso, exclusão ou retirada de consentimento. |
| IA assistiva | Não processar material de cliente por IA sem finalidade definida, transparência e controle de acesso. |

## Referências

[1] [Web Audio API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

[2] [Tone.js — documentação oficial](https://tonejs.github.io/)

[3] [GSAP — documentação oficial](https://gsap.com/docs/v3/)

[4] [Shopify Storefront API — documentação oficial](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api)

[5] [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

[6] [Shopify — Verify webhook deliveries](https://shopify.dev/docs/apps/build/webhooks/verify-deliveries)

[7] [Lei nº 13.709/2018 — LGPD, Presidência da República](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
