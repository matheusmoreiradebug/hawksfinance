-- ============================================================
-- HAWKS FINANCE v2 — SCHEMA ATUALIZADO
-- Execute no SQL Editor do Supabase
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- CLIENTES (atualizado com cost_estimate)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome           TEXT NOT NULL,
  contato        TEXT,
  notas          TEXT,
  custo_estimado NUMERIC(12,2) DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PRODUTOS / SERVIÇOS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produtos (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome         TEXT NOT NULL,
  preco        NUMERIC(12,2) NOT NULL DEFAULT 0,
  entregaveis  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- RECEITAS (atualizado: recorrencia)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS receitas (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id           UUID REFERENCES clientes(id) ON DELETE SET NULL,
  produto_id           UUID REFERENCES produtos(id) ON DELETE SET NULL,
  valor                NUMERIC(12,2) NOT NULL DEFAULT 0,
  data                 DATE NOT NULL DEFAULT CURRENT_DATE,
  recorrente           BOOLEAN DEFAULT FALSE,
  intervalo_recorrencia TEXT CHECK (intervalo_recorrencia IN ('mensal', 'semanal', 'anual')) DEFAULT 'mensal',
  descricao            TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- DESPESAS (atualizado: recorrencia)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS despesas (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria   TEXT NOT NULL CHECK (categoria IN ('trafego', 'ferramentas', 'outros')),
  descricao   TEXT NOT NULL,
  valor       NUMERIC(12,2) NOT NULL DEFAULT 0,
  data        DATE NOT NULL DEFAULT CURRENT_DATE,
  recorrente  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────
ALTER TABLE clientes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_clientes"  ON clientes  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_produtos"  ON produtos  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_receitas"  ON receitas  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_despesas"  ON despesas  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────
-- VIEWS ANALÍTICAS
-- ─────────────────────────────────────────

-- Resumo mensal (últimos 12 meses)
CREATE OR REPLACE VIEW resumo_mensal AS
SELECT
  TO_CHAR(serie, 'YYYY-MM') AS mes,
  COALESCE((
    SELECT SUM(r.valor) FROM receitas r
    WHERE TO_CHAR(r.data, 'YYYY-MM') = TO_CHAR(serie, 'YYYY-MM')
  ), 0) AS total_receitas,
  COALESCE((
    SELECT SUM(d.valor) FROM despesas d
    WHERE TO_CHAR(d.data, 'YYYY-MM') = TO_CHAR(serie, 'YYYY-MM')
  ), 0) AS total_despesas
FROM generate_series(
  DATE_TRUNC('month', NOW() - INTERVAL '11 months'),
  DATE_TRUNC('month', NOW()),
  '1 month'::INTERVAL
) AS serie
ORDER BY mes;

-- Lucratividade por cliente
CREATE OR REPLACE VIEW lucratividade_clientes AS
SELECT
  c.id,
  c.nome,
  c.contato,
  c.custo_estimado,
  COALESCE(SUM(r.valor), 0)   AS receita_total,
  COUNT(r.id)                  AS qtd_transacoes,
  MAX(r.data)                  AS ultima_transacao,
  COALESCE(SUM(r.valor), 0) - COALESCE(c.custo_estimado, 0) AS lucro_cliente
FROM clientes c
LEFT JOIN receitas r ON r.cliente_id = c.id
GROUP BY c.id, c.nome, c.contato, c.custo_estimado
ORDER BY lucro_cliente DESC;

-- Despesas por categoria
CREATE OR REPLACE VIEW despesas_por_categoria AS
SELECT
  categoria,
  SUM(valor) AS total,
  COUNT(*) AS quantidade
FROM despesas
GROUP BY categoria
ORDER BY total DESC;

-- ─────────────────────────────────────────
-- DADOS DE EXEMPLO
-- ─────────────────────────────────────────
INSERT INTO clientes (nome, contato, notas, custo_estimado) VALUES
  ('Acme Ltda',         'joao@acme.com.br',   'Cliente enterprise. Renova trimestralmente.',  2000.00),
  ('Nova Digital',      'ana@novadigital.io',  'Campanhas de performance, alto volume.',        1500.00),
  ('Sphere Marcas',     'oi@sphere.co',        'Social media + tráfego pago.',                 800.00);

INSERT INTO produtos (nome, preco, entregaveis) VALUES
  ('Gestão de Tráfego',    3500.00, 'Google Ads + Meta Ads, relatório semanal, otimização mensal'),
  ('Pack Redes Sociais',   1800.00, '20 posts/mês, stories, gestão de comunidade'),
  ('Suite Digital Completa',6500.00,'Tráfego + social + SEO + reunião mensal de estratégia'),
  ('Landing Page',         2200.00,'Design completo, copy, variante A/B');

INSERT INTO receitas (cliente_id, produto_id, valor, data, recorrente, intervalo_recorrencia, descricao)
SELECT c.id, p.id, p.preco,
  (NOW() - (n || ' days')::INTERVAL)::DATE,
  TRUE, 'mensal', 'Mensalidade'
FROM clientes c CROSS JOIN produtos p CROSS JOIN generate_series(0, 2) AS n(n)
LIMIT 9;

INSERT INTO despesas (categoria, descricao, valor, data, recorrente) VALUES
  ('trafego',      'Google Ads — Acme',          1200.00, NOW()::DATE, FALSE),
  ('trafego',      'Meta Ads — Nova Digital',      850.00, NOW()::DATE, FALSE),
  ('ferramentas',  'Notion Team',                   48.00, (NOW()-'30 days'::INTERVAL)::DATE, TRUE),
  ('ferramentas',  'Figma Professional',             45.00, (NOW()-'30 days'::INTERVAL)::DATE, TRUE),
  ('ferramentas',  'SEMrush',                       120.00, (NOW()-'30 days'::INTERVAL)::DATE, TRUE),
  ('outros',       'Contabilidade',                 400.00, (NOW()-'15 days'::INTERVAL)::DATE, TRUE),
  ('outros',       'Material de escritório',         89.00, (NOW()-'5 days'::INTERVAL)::DATE,  FALSE);
