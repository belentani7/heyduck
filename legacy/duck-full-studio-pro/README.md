# DUCK Full Studio Pro

DUCK Full Studio Pro é um workspace gráfico para produção musical: projetos privados, upload e revisão de stems, comentários por timestamp, auditoria de ações, catálogo legal de referências para FL Studio e CoLab local multilíngue.

## Stack

| Camada | Tecnologia |
|---|---|
| Interface | React 19, TypeScript, Tailwind 4, shadcn/ui e TanStack Query |
| Transporte | tRPC 11 e SuperJSON |
| Persistência | Drizzle ORM e MySQL |
| Arquivos | Adaptador de armazenamento S3/Forge |
| Autenticação | Manus OAuth |
| Testes | Vitest |

## Estrutura relevante

```text
client/src/                 interface e rotas
server/duckStudioRouters.ts adaptador tRPC do estúdio
server/duckStudio/          domínio, validação, acesso e infraestrutura
drizzle/schema.ts           modelo de dados e índices
docs/                       arquitetura e contratos
```

## Operação para mantenedores

O projeto é servido pela plataforma administrada e o usuário final não precisa usar terminal. Em ambiente de desenvolvimento autorizado, as verificações são `pnpm check`, `pnpm test` e `pnpm build`. As variáveis de infraestrutura, OAuth, banco e armazenamento são fornecidas pelo ambiente; nunca as adicione ao repositório.

## Segurança

Projetos privados são associados ao `ownerOpenId`. Antes de acessar stems, comentários, logs ou URL derivada de arquivo, o backend valida a propriedade. A plataforma não fornece ainda um portal externo por token, pagamentos, mensageria ou uma IA treinada; essas extensões exigem integração e aprovação separadas.

## Documentação

Consulte `PROJECT-BRIEF.md` para o escopo, `docs/arquitetura.md` para a visão técnica, `docs/contratos-trpc.md` para os procedimentos, `DECISIONS.md` para decisões e `HANDOFF.md` para continuidade.
