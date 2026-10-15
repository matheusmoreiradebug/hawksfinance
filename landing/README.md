# Hawks Finance — Landing Page

Landing page cinematográfica do Hawks Finance. Projeto Next.js isolado do
dashboard (que segue na raiz do repositório, em Next 14), para que o deploy de
um não afete o outro.

```bash
cd landing
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck
```

Deploy na Vercel: crie um projeto apontando **Root Directory = `landing`**.

---

## Premissas do briefing

O briefing chegou com os campos entre colchetes em branco. As premissas abaixo
saíram do próprio repositório e podem ser trocadas em `content/site.ts`:

| Campo | Premissa |
|---|---|
| Empresa | Hawks Finance (Hawks Agência Digital) |
| Produto | Sistema de inteligência financeira: margem por cliente, previsão de caixa, alertas |
| Público | Donos de agências digitais |
| Conversão | Agendar demonstração via WhatsApp |
| Diferencial | Lucratividade **por cliente** + caixa projetado em 12 meses + alertas antes do prejuízo |
| Dor | Faturamento cresce, caixa não; tráfego e ferramentas consomem margem sem aparecer |

### Antes de publicar (TODOs em `content/site.ts`)
- `WHATSAPP_NUMBER`: número oficial.
- `site.url` e `site.email`: domínio e e-mail finais.
- `climax.urgency`: só manter se a limitação de implantações for real (ou `null`).
- FAQ "Quanto tempo leva": confirmar o prazo de implantação.
- `proof.scenario`: é um **cenário ilustrativo**, rotulado assim na página. Trocar por um case real autorizado quando houver.
- Depoimentos e logos de clientes: não foram inventados. Quando existirem, entram na cena Prova.

---

## 1. Roteiro de cenas e copy final

| # | Cena | Arquivo | Copy principal | Movimento |
|---|---|---|---|---|
| — | Navegação | `sections/nav.tsx` | Produto · Como funciona · Oferta · Perguntas · **Agendar demo** | Vira glass ao rolar |
| 1 | Abertura | `sections/hero.tsx` | **Saiba quanto cada cliente realmente lucra.** / Margem por cliente, caixa projetado para 12 meses e alertas antes do prejuízo. Num único painel. | Stagger em CSS puro (sem JS), saída do blur, glow em drift, preview com parallax |
| 2 | Tensão | `sections/tension.tsx` | Sua agência fecha mais contratos. / O caixa não acompanha. / Tráfego e ferramentas consomem margem em silêncio. / O cliente que mais fatura pode ser o que dá prejuízo. / E você só descobre no fim do mês. → **Faturar não é lucrar.** | Cada frase acende conforme o scroll |
| 3 | Virada | `sections/shift.tsx` | **Um centro de controle. Não mais uma planilha.** Quatro leituras: Lucratividade, Alertas, Previsão, Despesas | Sticky no desktop (texto e painel trocam com o scroll); sequência no mobile. CTA ao fim |
| 4 | Mecanismo | `sections/mechanism.tsx` | **Da planilha ao controle em quatro passos.** Estruture → Registre → Leia → Decida | Linha de progresso ligada ao scroll acende cada etapa |
| 5 | Prova | `sections/proof.tsx` | **Clareza que se mede.** 12 meses · 5 alertas · 20% · 1 painel + cenário ilustrativo + marquee | Count-up, stagger, marquee em CSS. CTA ao fim |
| 6 | Oferta | `sections/offer.tsx` | **Tudo o que você recebe.** Núcleo → 6 inclusos → bônus (diagnóstico financeiro) → CTA | Card com borda em gradiente azul, itens em stagger |
| 7 | Objeções | `sections/faq.tsx` | Planilha, porte da agência, prazo, segurança, integração bancária, contador | Accordion Radix, JSON-LD FAQPage |
| 8 | Clímax | `sections/climax.tsx` | **Pare de adivinhar. Comece a decidir.** + urgência | Tela cheia, glow azul, reveal com blur |

O CTA aparece na nav fixa, no hero, ao fim da Virada, ao fim da Prova, na
Oferta e no Clímax. No mobile, uma barra fixa no rodapé surge depois do hero e
some quando o CTA final entra na tela.

---

## Arquitetura

```
landing/
├── app/                 layout (metadata, JSON-LD, fontes), page, OG image, robots, sitemap, icon
├── components/
│   ├── sections/        uma cena por arquivo
│   ├── ui/              Button (shadcn), CtaButton (magnético), Badge, Card, Accordion, CountUp, Marquee, Logo
│   ├── motion/          Reveal, FadeInGroup, Parallax, SmoothScroll (Lenis), Providers
│   └── visuals/         mockups de produto em HTML/SVG (zero imagens)
├── content/site.ts      toda a copy, tipada
└── lib/                 cn(), constantes de movimento, fontes
```

- Componentes server por padrão; `"use client"` só onde há movimento ou estado.
- Cenas abaixo da dobra carregadas com `next/dynamic` (chunks separados).
- Sistema de movimento em `lib/motion.ts`: ease `[0.22, 1, 0.36, 1]`, 0.4–0.8 s.
- Só `transform` e `opacity` são animados (o blur de entrada é pontual e desligado em reduced motion).
- `prefers-reduced-motion`: `MotionConfig reducedMotion="user"`, Lenis desligado, parallax e blur zerados, keyframes CSS neutralizados.
- Lenis desligado em telas de toque (scroll nativo é melhor no mobile).

---

## 3. Assets

A página atual roda **sem nenhum asset externo**: os visuais de produto são
mockups em HTML/SVG, a imagem Open Graph é gerada no build (`app/opengraph-image.tsx`)
e o ícone é SVG. Assets opcionais para elevar a prova:

| Asset | Onde entra | Especificação |
|---|---|---|
| Vídeo do hero (opcional) | fundo do hero, atrás do gradiente | Loop de 6–10 s, 1920×1080, WebM (VP9) + MP4 (H.264), **< 3 MB**, sem áudio, com poster AVIF/WebP < 60 KB, `preload="metadata"`, `muted playsInline loop` |
| Screenshots reais do dashboard | substituir mockups em `components/visuals` | PNG → servido via `next/image`, 2400 px de largura, tema escuro, dados anonimizados |
| Logos de clientes | cena Prova (marquee) | SVG monocromático branco, altura 24–32 px, mesma área visual entre logos, com autorização de uso |
| Depoimentos | cena Prova | Nome, cargo, agência, foto 256×256 AVIF, frase de até 30 palavras com resultado concreto |
| Logo oficial Hawks | `components/ui/logo.tsx` e `app/icon.svg` | SVG, versão símbolo + versão horizontal, positivo e negativo |

---

## 4. Checklist de performance (validado)

Lighthouse 12.8 mobile (Moto G Power emulado, 4G lento, CPU 4×), build de produção, 3 execuções:

| Métrica | Meta | Resultado |
|---|---|---|
| Performance | 95+ | **95–97** |
| Accessibility | — | 96 |
| Best Practices | — | **100** |
| SEO | — | **100** |
| LCP | < 2.5 s | **2.4 s** (simulado) |
| CLS | < 0.1 | **0.002** |
| TBT (proxy de INP) | < 200 ms | 120–200 ms |

- [x] H1 sem animação de entrada: é o elemento de LCP e pinta no primeiro frame (qualquer animação no H1 fazia o Chrome não registrar o LCP).
- [x] Entrada do hero em keyframes CSS, sem esperar a hidratação.
- [x] CSS crítico inline (`experimental.inlineCss`), sem requisição de CSS bloqueante.
- [x] Fonte Geist Sans variável local (58 KB) com preload; Geist Mono sem preload.
- [x] Cenas abaixo da dobra com code-splitting; marquee em CSS puro.
- [x] Zero imagens no caminho crítico; gráficos em SVG inline.
- [x] Todas as rotas pré-renderizadas como estáticas.
- [x] Sem overflow horizontal em 375 px e 1440 px; sem erros no console.
- [x] Contraste AA no CTA (branco sobre `#2563EB`, 5.2:1) e nos cinzas de texto.
- [x] Navegação por teclado, foco visível, link "Pular para o conteúdo", um único H1.

Ponto conhecido de acessibilidade: as frases da cena Tensão e as etapas do
Mecanismo começam esmaecidas e ganham contraste total conforme o scroll; o
Lighthouse mede o estado inicial e aponta isso. Com reduced motion ativo,
elas já aparecem com contraste total.
