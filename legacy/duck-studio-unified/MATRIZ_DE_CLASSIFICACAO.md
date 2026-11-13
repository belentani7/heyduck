# Matriz de classificação de módulos Duck

## Regra de decisão

Cada fonte foi classificada por procedência, licença, compatibilidade, sinais de qualidade, ativos e risco. A classificação não autoriza a execução: ela apenas determina se uma fonte pode orientar uma adaptação futura, se deve permanecer isolada ou se já faz parte da aplicação ativa. A base canônica é o diretório `apps/duck-studio-platform` identificado no pacote unificado; as demais fontes permanecem registradas em área de auditoria.

| Estado | Significado prático |
|---|---|
| **Canônico** | Fonte única autorizada para evolução direta no projeto ativo. |
| **Referência aprovada** | Pode orientar uma adaptação, mas não deve ser copiada sem teste de compatibilidade e procedência por arquivo. |
| **Candidato condicionado** | Tem elementos úteis, porém depende de licença, escopo e testes antes de qualquer importação. |
| **Isolado** | Não deve ser integrado nem executado até análise posterior. |

## Matriz por origem

| Origem | Evidência estática | Compatibilidade e risco | Classificação | Decisão |
|---|---|---|---|---|
| `apps/duck-studio-platform` no pacote unificado | React, tRPC, Drizzle, migrações, 173 arquivos de trabalho e testes existentes. | Compatível com o ambiente ativo; estados de comércio e ativos já são explícitos. | **Canônico** | Evoluir diretamente, preservando rotas pt-BR/ES/EN e controles atuais. |
| [duck-unified-master](https://github.com/belentani7/duck-unified-master) | Licença MIT declarada; 678 arquivos TypeScript/TSX, 46 testes e dois workflows. | É uma consolidação histórica com cópias internas e duplicidades; a origem de cada submódulo precisa permanecer rastreável. | **Referência aprovada** | Usar para comparar procedência e adaptar somente trechos avaliados individualmente. |
| [duck-lab](https://github.com/belentani7/duck-lab) | 61 arquivos TypeScript/TSX; auditoria relata integração Web Audio, build e tipos aprovados. | Não declara licença; não inclui áudio real empacotado, persistência remota ou suíte de testes suficiente. | **Candidato condicionado** | Reimplementar conceitos aprovados em prova de conceito; não importar o módulo diretamente. |
| [duck-ecosystem](https://github.com/belentani7/duck-ecosystem) | 138 arquivos TypeScript/TSX, 17 testes e um workflow; arquitetura separa manifestos, adaptadores e estados de verdade. | Não declara licença e inclui partes Python/locais incompatíveis com a hospedagem gerenciada. | **Referência aprovada** | Adotar o contrato conceitual de manifesto, adaptador e evidência; manter código isolado. |
| [Duck-Omega](https://github.com/belentani7/Duck-Omega) | 135 arquivos TypeScript/TSX, 19 testes e dois workflows. | Sem licença declarada; escopo de IA necessita revisão de dados, custo e permissões. | **Candidato condicionado** | Avaliar componentes de interface e contratos de IA em lote separado. |
| [duck-belentani-os-audited-2026-08-23](https://github.com/belentani7/duck-belentani-os-audited-2026-08-23) | 134 arquivos TypeScript/TSX e 16 testes; referência de auditoria. | Sem licença declarada; provável sobreposição arquitetural com a base canônica. | **Referência aprovada** | Usar como evidência histórica, sem mesclagem de diretórios. |
| [duck-full-studio-pro](https://github.com/belentani7/duck-full-studio-pro) | 126 arquivos TypeScript/TSX, sete testes e um workflow. | Auditoria local aponta persistência e cofre de plugins incompletos; sem licença declarada. | **Candidato condicionado** | Avaliar apenas padrões de UI e documentação; não declarar vault ou integrações como reais. |
| [DUCK-ZION-PREMIUM](https://github.com/belentani7/DUCK-ZION-PREMIUM) | 344 arquivos TypeScript/TSX, cinco testes e 109 ativos de mídia. | Sem licença declarada; alto volume de ativos exige confirmação de direitos antes de qualquer uso. | **Isolado** | Preservar para curadoria visual e de ativos; não copiar mídia ou componentes. |
| [duck-zion-apex-public](https://github.com/belentani7/duck-zion-apex-public) | 110 arquivos TypeScript/TSX, cinco testes e um workflow. | Sem licença declarada e provável sobreposição visual com outras fontes ZION. | **Candidato condicionado** | Comparar somente após resolver a procedência dos módulos ZION. |
| [omega-max-duck](https://github.com/belentani7/omega-max-duck) | 113 arquivos TypeScript/TSX e seis testes. | Sem licença declarada; escopo de IA e automação ainda não verificado. | **Candidato condicionado** | Extrair requisitos e testes úteis sem incorporar implementações. |
| [duck-studio-suite](https://github.com/belentani7/duck-studio-suite) | 70 arquivos TypeScript/TSX e um `package.json`; sem testes detectados. | Sem licença declarada e cobertura insuficiente. | **Isolado** | Preservar somente como referência de produto. |
| [duck-music-lab](https://github.com/belentani7/duck-music-lab) | Três arquivos TypeScript/TSX e uma página HTML; sem testes. | Escopo reduzido, sem licença e sem validação de produção. | **Isolado** | Usar apenas como arquivo histórico. |
| [duck-apps](https://github.com/belentani7/duck-apps) | Nove arquivos JavaScript, seis Python, 15 páginas HTML e um ativo de mídia. | Tecnologias heterogêneas; execução exigiria dependências e revisão adicional; sem licença. | **Isolado** | Não executar nem importar; catalogar ideias de interface após revisão. |
| [duck-2026](https://github.com/belentani7/duck-2026) | Três arquivos JavaScript, nove páginas HTML e sem testes. | Variante estática sem licença e com alto risco de estados demonstrativos. | **Isolado** | Preservar como referência visual, sem integração de lógica. |
| [heyduck](https://github.com/belentani7/heyduck) | Seis arquivos JavaScript, sete páginas HTML e 128 ativos de mídia. | Sem licença, testes ou verificação de direitos de imagem. | **Isolado** | Não incorporar imagens ou código sem autorização documentada. |
| [DuckHTML](https://github.com/belentani7/DuckHTML) | Duas páginas HTML e sem testes. | Prototipagem estática, sem licença. | **Isolado** | Manter como arquivo histórico. |
| [Duck-Deck](https://github.com/belentani7/Duck-Deck) | Uma página HTML e um arquivo JavaScript, com um workflow e sem testes. | Material de apresentação, sem licença. | **Isolado** | Não integrar ao produto. |

## Duplicidades e segredos potenciais

A comparação por hash dos arquivos com até 10 MB, excluindo controle de versão e arquivos de ambiente, encontrou 642 grupos de arquivos idênticos e 2.517 ocorrências em grupos duplicados. Há duplicação de componentes, scripts e documentos entre consolidações anteriores, o que confirma a decisão de evitar cópia em massa. Foram identificados por nome um `.env` em `duck-lab` e um `.env.example` em `duck-unified-master`; ambos permaneceram isolados e não foram abertos nem copiados.

## Critérios de promoção para a base ativa

Um candidato só poderá ser promovido quando houver confirmação de direitos de uso, compatibilidade com a aplicação React/tRPC/Drizzle, ausência de segredos, teste automatizado de comportamento relevante, revisão de dependências e definição de estados `real`, `bloqueado`, `planejado` ou `indisponível`. Uma promoção deverá registrar o repositório, commit de origem, arquivos adaptados, responsável pela aprovação e evidência de validação.
