# DuckOS RnF — execução local e pacote Windows

DuckOS RnF é uma plataforma local-first para produção musical. A interface web pode ser usada no navegador durante o desenvolvimento e a mesma interface é carregada pela shell Electron para gerar um aplicativo Windows.

## Execução local

No Windows, instale Node.js 22+, pnpm e Python 3.11+. Execute `scripts/start-duck-local.ps1`. O script cria um ambiente virtual para o núcleo FastAPI, inicia o serviço local na interface de loopback e levanta o dashboard.

A aplicação funciona sem API key. O assistente usa regras locais e a memória do cliente é mantida no armazenamento local da aplicação. Integrações externas devem ser adicionadas posteriormente por adaptadores server-side e nunca devem expor chaves ao navegador.

## Construção do EXE

Execute `scripts/build-installer.ps1` em Windows. O processo valida TypeScript, executa Vitest, gera o bundle web e chama o `electron-builder` configurado em `desktop/package.json`. O resultado esperado é um instalador NSIS e uma versão portable em `desktop/release/`.

A construção de um executável assinado exige um certificado de assinatura de código pertencente ao proprietário. Sem esse certificado, o Windows pode apresentar avisos de reputação, mesmo que os artefatos sejam legítimos.

## Segurança

A shell Electron usa `contextIsolation`, `sandbox` e `nodeIntegration: false`. O backend local só deve escutar em loopback por padrão. Plugins externos não podem ser executados ou instalados apenas por serem encontrados: o fluxo exige inventário, SHA-256, auditoria estática, revisão de licença e aprovação manual. O vault não deve executar código de repositórios baixados automaticamente.

## Escopo atual e extensões

O dashboard, carregamento motivacional, assistente local, áudio Web Audio, fila visual, base do vault e scaffolding de EXE estão em construção incremental. Clientes, entregas, licenças, contratos, finanças, sincronização online e a auditoria de grande volume de repositórios devem ser conectados às tabelas e procedimentos antes de serem considerados produção.

## Estado de empaquetado verificado

El bundle web y el backend local se validan en Linux; el backend se congela como `backend/dist/duckos-core` y el shell Electron usa el binario correspondiente por plataforma. El artefacto Windows portable `desktop/release/DuckOS-RnF-0.1.0-x64.exe` fue generado correctamente con compresión `store`. El objetivo NSIS permanece configurado, pero el host Linux no tiene Wine (`spawn wine ENOENT`); para generar el instalador NSIS final debe ejecutarse `pnpm exec electron-builder --win nsis --publish never` en Windows o en un runner Windows/Wine. La firma digital también requiere un certificado real del propietario.

## Smoke integrado

O script `node scripts/smoke-electron.cjs` valida o backend congelado via `GET /health` e tenta iniciar Electron sob Xvfb. Neste host, após disponibilizar o payload oficial Linux do Electron e reconstruir o backend PyInstaller, o smoke passou com `{"ok":true,"backend":"healthy","electron":"running-under-xvfb"}`. O script ainda mantém o fallback explícito para CI/Windows quando o payload não estiver instalado.
