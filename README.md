# 🦅 Hawks Finance v2 — Centro de Controle Financeiro

Sistema de inteligência financeira para a Hawks Agência Digital.  
**Não é só CRUD — é um sistema de tomada de decisão.**

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilização | Tailwind CSS (Black + Gold) |
| Backend | Supabase (PostgreSQL + RLS) |
| Deploy | Vercel |
| Fontes | Cormorant Garamond + DM Sans + JetBrains Mono |

---

## Início Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** → cole `supabase/schema.sql` → execute
3. Copie a **URL do projeto** e a **chave anon** em Settings → API

### 3. Variáveis de ambiente

```bash
cp .env.local.example .env.local
# Edite com sua URL e chave do Supabase
```

### 4. Rodar localmente

```bash
npm run dev
# Acesse http://localhost:3000
```

### 5. Deploy no Vercel

```bash
npx vercel
# Adicione as variáveis de ambiente no painel do Vercel
```

---

## Funcionalidades v2

### 🎯 Centro de Controle (Dashboard)
- Saldo atual, receita mensal, despesas, lucro líquido
- Alertas automáticos de risco financeiro
- Previsão de caixa para 12 meses
- Top clientes por receita com status de margem
- Identificação de clientes em risco
- Mapa de maior categoria de despesa

### 🔔 Sistema de Alertas Inteligentes
| Alerta | Condição |
|--------|----------|
| ⛔ Despesas acima da receita | `despesa_mes > receita_mes` |
| ⛔ Saldo negativo | `saldo_atual < 0` |
| ⚠️ Caixa em risco | Dias até negativo < 60 |
| ⚠️ Receita recorrente insuficiente | `rec_receita < rec_despesa` |
| ⚠️ Mês com prejuízo | `lucro_mes < 0` |

### 👥 Lucratividade por Cliente
- Badge **Verde** = Margem ≥ 20%
- Badge **Amarelo** = Margem entre 0% e 20%
- Badge **Vermelho** = Prejuízo
- Custo estimado por cliente (campo manual)
- Vista de lucratividade com toggle

### 💸 Inteligência de Despesas
- Agrupamento por categoria (Tráfego, Ferramentas, Outros)
- Percentual de cada categoria no total
- Destaque do maior vazamento de dinheiro
- Filtro por categoria na listagem

### 📈 Previsão de Caixa
- Projeção baseada em receitas e despesas recorrentes
- Linha de referência zero (quando fica negativo)
- Alerta de "saldo fica negativo em X meses"
- Cálculo de dias até o caixa zerar

### 🔄 Recorrência Avançada
- Receitas com intervalo: **Mensal / Semanal / Anual**
- Despesas recorrentes marcáveis
- Dashboard separa recorrente vs pontual

---

## Estrutura do Projeto

```
hawks-finance-v2/
├── app/
│   ├── layout.tsx              ← Root layout + Sidebar
│   ├── globals.css             ← Design system (Black + Gold)
│   ├── page.tsx                ← Centro de Controle (Dashboard)
│   ├── clientes/page.tsx       ← CRUD + lucratividade
│   ├── produtos/page.tsx       ← Catálogo de serviços
│   ├── receitas/page.tsx       ← Receitas + recorrência
│   ├── despesas/page.tsx       ← Despesas + inteligência
│   └── configuracoes/page.tsx  ← Config e guia
├── components/
│   ├── layout/Sidebar.tsx      ← Navegação lateral
│   ├── ui/index.tsx            ← CartaoStat, Modal, PainelAlertas, Toggle...
│   └── graficos/index.tsx      ← 4 gráficos (Recharts)
├── lib/
│   ├── supabase.ts             ← Cliente Supabase
│   ├── queries.ts              ← Todas as queries + analytics
│   └── utils.ts                ← formatarMoeda, gerarAlertas, calcularStatus...
├── types/index.ts              ← Tipos TypeScript completos
└── supabase/schema.sql         ← Schema + views + dados de exemplo
```

---

## Schema do Banco

```sql
clientes   → id, nome, contato, notas, custo_estimado, created_at
produtos   → id, nome, preco, entregaveis, created_at
receitas   → id, cliente_id, produto_id, valor, data,
             recorrente, intervalo_recorrencia, descricao
despesas   → id, categoria, descricao, valor, data, recorrente

-- Views analíticas
resumo_mensal          → receitas e despesas por mês (12 meses)
lucratividade_clientes → receita, custo, lucro, por cliente
despesas_por_categoria → total e % por categoria
```

---

## Design System

| Token | Valor |
|-------|-------|
| Background | `#080808` |
| Superfície | `#0F0F0F` |
| Borda | `#1A1A1A` |
| Ouro (primário) | `#D4AF37` |
| Verde (lucro) | `#00C48C` |
| Vermelho (perigo) | `#FF4444` |
| Amarelo (aviso) | `#F5A623` |
| Fonte display | Cormorant Garamond |
| Fonte corpo | DM Sans |
| Fonte mono | JetBrains Mono |

---

## Lógica de Decisão

```
Lucratividade do cliente:
  margem = (receita - custo) / receita × 100
  ≥ 20% → Lucrativo  (verde)
  0–20% → Margem Baixa (amarelo)
  < 0%  → Prejuízo   (vermelho)

Dias até caixa zerar:
  dias = saldo_atual / (despesa_mes / 30)

Previsão de caixa:
  saldo_mês_n = saldo_atual + (receita_recorrente - despesa_recorrente) × n
```

---

## Segurança (Produção)

1. Ative Supabase Auth
2. Atualize as políticas RLS para exigir `auth.uid()`
3. Remova os dados de exemplo do schema
4. Use `service_role` apenas em routes server-side (nunca no cliente)
