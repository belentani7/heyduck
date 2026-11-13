# 03 Kant — Motor de Produção

## Propósito

Transforma intenção em decisões musicais visíveis mediante uma máquina conceptual de quatro etapas: **entender, encontrar, construir e entregar**. Explica o trabalho de Duck sem atribuir-lhe equipamento, créditos, métricas ou métodos não documentados.

O desenho trata o processo como uma corrente contínua. A etapa ativa move a mesma linha verde, atualiza a leitura central e prepara parâmetros conceptuais para o laboratório sonoro. Duck continua sendo o autor; a máquina é uma representação legível do seu critério.

## Dependência anterior: 02 Bohr — Identidade Orgânica

Escuta no `bus` o evento:

```text
duck:identity
```

Contrato de entrada:

```js
{
  identityTraits: string[] | string,
  selectedMood: string,
  visualRhythm: string | number
}
```

- `identityTraits` alimenta a telemetria visível, limitada a seis traços.
- `selectedMood` define uma configuração inicial de energia, densidade e direção.
- `visualRhythm` ajusta moderadamente o indício de tempo.
- Dados ausentes ou desconhecidos recebem valores locais neutros; o módulo continua legível.

## Saída seguinte: 04 Sartre — Laboratório Sonoro

Publica no mesmo `bus` o evento:

```text
duck:production
```

Contrato de saída:

```js
{
  source: '03-kant-motor-producao',
  processStage: 'understand' | 'find' | 'build' | 'deliver',
  tempoHint: number,
  textureHint: 'leve' | 'tátil' | 'larga' | 'granular',
  spaceHint: 'íntimo' | 'próximo' | 'aberto' | 'compacto'
}
```

`tempoHint`, `textureHint` e `spaceHint` são **indícios de interface**, não afirmações sobre obras publicadas. Sartre pode utilizá-los como estado inicial dos seus controles, mantendo o áudio desligado até gesto explícito.

## API de integração

```js
import { mount, destroy } from './modules/03-motor-produccion/module.js';

const root = document.querySelector('[data-duck-module="03"]');
mount(root, duckBus);

// Antes de retirar o módulo:
destroy();
```

`bus` deve implementar `addEventListener`, `removeEventListener` e `dispatchEvent`. Se não cumprir o contrato, o módulo usa `document` como fallback.

## Estado público mínimo

Mantém durante a montagem:

- `document.documentElement.dataset.duckProcessStage`
- `document.documentElement.dataset.duckTempoHint`
- `document.documentElement.dataset.duckTextureHint`
- `document.documentElement.dataset.duckSpaceHint`

`destroy()` elimina estes valores, listeners, observador e contexto GSAP.

## Gestalt e coerência com os cinco módulos

- **Figura–fundo:** uma etapa domina; telemetria e controles permanecem subordinados.
- **Proximidade:** cada etapa reúne nome, função e microexplicação.
- **Semelhança:** as quatro decisões usam a mesma gramática visual.
- **Fechamento:** o núcleo `D` e os glifos incompletos convidam a completar forma e fluxo.
- **Continuidade:** uma única linha atravessa as quatro etapas e preserva o movimento vindo de Rawls e Bohr.
- **Destino comum:** linha, etapa, leitura e saída mudam como uma decisão única.
- **Prägnanz:** há uma ação principal por estado: escolher a próxima decisão.

A paleta usa morado profundo, verde ácido, creme e negro tinta. A tipografia referencia Archivo Black, DM Mono e Manrope presentes no núcleo. A linguagem é jovem e tecnológica, mas o conteúdo descreve trabalho humano. A saída é deliberadamente compacta para Sartre poder transformá-la em som sem acoplamento interno.

## Acessibilidade

- Etapas implementadas como botões nativos com `aria-pressed`.
- Foco visível de alto contraste.
- Controles com `label`, `output` e valores nativos de teclado.
- Leitura de estado com `aria-live="polite"`.
- Contraste alto na paleta canônica.
- Layout responsivo em quatro, duas e uma coluna.
- `prefers-reduced-motion` elimina transições e rotações prolongadas.
- Toda informação animada também aparece como texto.

## Movimento e desempenho

- GSAP e CustomEase são usados quando já estão fornecidos pelo núcleo.
- Sem GSAP, a experiência permanece funcional com transições CSS.
- Não existem imports de rede, canvas, WebGL, áudio nem timers permanentes.
- `IntersectionObserver` pausa a órbita CSS fora do viewport.
- Nenhuma lista ultrapassa quatro elementos; não requer virtualização.
- O módulo não inicializa Lenis nem ScrollTrigger; estes pertencem ao orquestrador.

## Falhas isoladas

- Root inexistente: lança erro explícito sem alterar outros módulos.
- Estrutura HTML incompleta: mostra alerta local e lança erro rastreável.
- Payload incompleto: aplica defaults locais e mantém a leitura.
- GSAP ausente: preserva conteúdo, controles e bus.
- Bus inválido: utiliza `document`, sem importar outro módulo.

## Verificação

Executar desde esta pasta:

```powershell
Get-Content -LiteralPath .\module.js -Raw | node --input-type=module --check
```

Verificações de integração:

1. Montar o fragmento e importar `mount()`.
2. Emitir `duck:identity` com `identityTraits`, `selectedMood` e `visualRhythm`.
3. Confirmar atualização da telemetria e controles.
4. Ativar as quatro etapas por clique e teclado.
5. Confirmar um `duck:production` por mudança, com os quatro campos de saída.
6. Ativar movimento reduzido e confirmar leitura sem depender da animação.
7. Executar `destroy()` e confirmar remoção de listeners e datasets.
