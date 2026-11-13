# 02 — Bohr / Identidade Orgânica

Retrato vivo de Duck dentro de **DUCK Living Machine**. O módulo transforma a energia recebida do Portal Vivo em uma identidade perceptível e em dados utilizáveis pelo Motor de Produção.

## Posição no organismo

`01 Rawls Portal Vivo` → **`02 Bohr Identidade Orgânica`** → `03 Kant Motor de Produção`

Bohr não repete o hero de Rawls e não decide o processo de Kant. Sua responsabilidade é traduzir estado visual em caráter: mostrar Duck como jovem, brasileiro, tecnológico, divertido, humano e profissional; permitir ao visitante escolher uma energia; entregar essa decisão como contrato estável.

## Artefato

- Retrato fotográfico dominante com três enquadramentos reais de Duck.
- Arco incompleto que aplica fechamento Gestalt e funciona como sinal vivo.
- Seis traços de identidade, com ênfase contextual em vez de métricas inventadas.
- Três estados selecionáveis: `precisao`, `jogo` e `impacto`.
- Ritmo visual que muda sem iniciar áudio.
- Saída textual permanente para compreender o estado sem depender da animação.
- Continuidade visual 01–02–03 explícita no trilho superior e no rodapé.

## Dependência de 01 — Rawls Portal Vivo

Evento consumido: `duck:portal:state`.

Rawls deve emitir:

```js
bus.emit("portal:state", {
  identityLevel: 0.8,
  inkProgress: 0.65,
  dominantColor: "#6bf178",
  motionMode: "full"
});
```

| Entrada | Tipo | Faixa ou valores | Uso em Bohr |
| --- | --- | --- | --- |
| `identityLevel` | `number` | `0..1` | Intensidade do sinal, scanner, traços e ritmo |
| `inkProgress` | `number` | `0..1` | Impregnação de fundo, arco e atmosfera cromática |
| `dominantColor` | CSS color | Cor válida | Cor ativa herdada do Portal |
| `motionMode` | `string` | `full`, `reduced`, `paused` | Movimento integral, reduzido ou pausado |

Se o evento ocorreu antes da montagem, Bohr recupera o último estado com `bus.read("portal:state")`. Dados ausentes ou inválidos mantêm valores seguros. Sem bus, o lifecycle recebe uma exceção e o próprio fragmento revela uma mensagem legível.

## Saída para 03 — Kant Motor de Produção

Evento principal: `duck:identity:change`.

```js
bus.on("identity:change", ({ identityTraits, selectedMood, visualRhythm }) => {
  // Kant converte caráter e ritmo em decisões de produção.
});
```

Payload:

```js
{
  source: "02",
  identityTraits: [
    { name: "jovem", weight: 0.86 },
    { name: "brasileiro", weight: 0.86 },
    { name: "tecnologico", weight: 1 },
    { name: "divertido", weight: 0.86 },
    { name: "humano", weight: 1 },
    { name: "profissional", weight: 1 }
  ],
  selectedMood: "precisao",
  visualRhythm: {
    tempo: 104,
    cadence: "steady",
    pulseMs: 577,
    energy: 0.68,
    intensity: 0.8
  },
  inherited: {
    inkProgress: 0.65,
    dominantColor: "#6bf178",
    motionMode: "full"
  }
}
```

Bohr também emite `duck:identity:ready` ao montar. Kant pode ouvir `identity:change`, recuperar o último payload com `bus.read("identity:change")` e usar `selectedMood` como estado inicial de sua etapa “entender”.

## Estado público mínimo

O módulo registra somente:

- `document.documentElement.dataset.duckIdentityLevel`
- `document.documentElement.dataset.duckIdentityMood`
- `document.documentElement.dataset.duckVisualRhythm`

O payload completo permanece no Duck Bus. Isso evita duplicar o estado estruturado no DOM.

## Coerência com os cinco responsáveis

- **Rawls / 01:** cor, intensidade, tinta e preferência de movimento entram sem importação direta.
- **Bohr / 02:** fotografia e presença humana permanecem como figura; controles e sinais são fundo funcional.
- **Kant / 03:** recebe nomes, pesos, mood e ritmo em um único evento determinístico.
- **Sartre / 04:** Bohr não cria áudio nem concorre com o Laboratório Sonoro; apenas prepara intenção visual.
- **Hume / 05:** Bohr não duplica singles, créditos ou CTA; a marca e o retrato estabelecem confiança para que a obra a prove no final.

## Gestalt

- **Figura–fundo:** Duck ocupa a maior área e mantém contraste prioritário.
- **Proximidade:** cada mood agrupa número, nome e tradução perceptiva.
- **Semelhança:** botões equivalentes compartilham estrutura; o estado escolhido inverte figura e fundo.
- **Fechamento:** o arco não completa a forma; o olhar completa a órbita em torno do retrato.
- **Continuidade:** o sinal 01–02–03 atravessa o módulo e o ritmo segue para Kant.
- **Destino comum:** traços associados ao mood mudam juntos.
- **Prägnanz:** uma imagem dominante, uma frase dominante e uma escolha principal.

## Acessibilidade

- Heading próprio e região semântica.
- Textos e saída funcional permanecem disponíveis sem JavaScript ou animação.
- Botões nativos com `aria-pressed` e grupo nomeado.
- Navegação entre moods com setas, `Home` e `End`.
- Alterações anunciadas por `aria-live="polite"`.
- Foco visível herdado do núcleo.
- `prefers-reduced-motion`, `forced-colors` e modo `paused` respeitados.
- Fotografias decorativas alternativas usam `alt=""`; o retrato inicial possui descrição.
- Nenhum áudio inicia neste módulo.

## Rendimento

- Imagens de 1024 px, já existentes no projeto; nenhum recurso remoto.
- URLs resolvidas por `import.meta.url`, válidas no fragmento e após integração.
- Animações CSS limitadas a transformações, opacidade e stroke.
- `IntersectionObserver` pausa órbita, pulso e medidor fora do viewport.
- Movimento de ponteiro usa um único `requestAnimationFrame` e fica desativado em modo reduzido.
- GSAP é opcional e utiliza `gsap.context()` com `revert()`; o módulo funciona com transições CSS se GSAP não estiver disponível.

## Montagem

```js
import { mount, destroy } from "./living-machine/modules/02-identidad-organica/module.js";

const root = document.querySelector('[data-duck-module="02"]');
mount(root, bus);

// Ao desmontar a Living Machine:
destroy();
```

O orquestrador deve carregar `module.css`, inserir o conteúdo de `artifact.html` e chamar `mount(root, bus)` pelo lifecycle canônico.

## Verificação executável

```powershell
node --check .\living-machine\modules\02-identidad-organica\module.js
```

Critérios adicionais:

1. Os quatro arquivos do módulo existem.
2. Não há IDs duplicados dentro do fragmento.
3. As quatro imagens referenciadas existem.
4. `mount()` emite `duck:identity:ready`.
5. Cada mood emite `duck:identity:change` com as três saídas canônicas.
6. `destroy()` remove listeners, observers, frames e contexto GSAP.
7. O conteúdo continua compreensível com animação pausada.
