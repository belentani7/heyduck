# PVC-U Ω-Max no DuckOS/RnF

## Escopo implementado

O conteúdo de `pasted_content_6.txt` foi tratado como um manifesto de arquitetura e não como uma instrução para migrar o projeto para Next.js ou afirmar capacidades inexistentes. O código base continua em React 19, tRPC 11, Express e Drizzle, e recebeu um subconjunto verificável chamado `PVC-U Ω-Max · grounded subset`.

No fluxo de tarefas, a Esfera 1 valida a estrutura com Zod. A Esfera 2 aplica regras semânticas puras para limitar tamanho e rejeitar caracteres de controle. Cada validação produz um envelope com protocolo, versão, `validationId`, `traceId`, camada, status, dados e problemas. O servidor mantém RBAC e ownership; uma tarefa só é persistida depois de passar pela validação.

No transporte frontend, o cliente agora envia `X-Client-Version`, `Accept-Version` e `X-Trace-Id` em todas as chamadas tRPC. O `TaskPanel` utiliza a mesma validação compartilhada, mostra estados de validação e erro acessíveis e mantém a confirmação de persistência separada da sugestão visual.

## Limites explícitos

O manifesto original contém conceitos que não foram apresentados como implementados: migração Next.js, XState, SDK OpenTelemetry, assinatura HMAC no cliente, QKD, criptografia homomórfica, PINNs, limite de Landauer por linha de código, reescrita automática de axiomas, tokenização financeira e alegações de segurança absoluta. Essas partes exigiriam desenho independente, dependências, revisão de segurança, custos e validação externa; afirmar que já existem seria enganoso.

O envelope atual é calculado em memória e não constitui ainda um `Validation Ledger` persistente. O próximo incremento seguro seria persistir somente eventos de validação mínimos, com política de retenção e acesso administrativo, depois de uma decisão explícita sobre dados pessoais e volume.

## Evidências

A implementação está em `shared/pvcU.ts`, o procedimento de tarefas e o perfil estão em `server/routers.ts`, os headers estão em `client/src/main.tsx`, e a UX da entidade demonstrativa está em `client/src/components/TaskPanel.tsx`. Os testes cobrem aprovação estrutural, rejeição semântica, traceId, perfil grounded e limites declarados. A suíte Vitest e o build de produção foram executados após a integração.
