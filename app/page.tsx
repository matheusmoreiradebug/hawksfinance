'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Wallet, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { CartaoStat, PainelAlertas, Spinner, CabecalhoPagina } from '@/components/ui/index'
import { GraficoReceitasDespesas, GraficoLucro, GraficoPrevisao, GraficoDespesasCategoria } from '@/components/graficos/index'
import { getDadosDashboard, getResumoMensal, getLucratividadeClientes, getDespesasPorCategoria } from '@/lib/queries'
import { formatarMoeda, formatarMoedaCompacta, STATUS_CONFIG } from '@/lib/utils'
import type { DadosDashboard, ResumoMensal, LucratividadeCliente, DespesaCategoria } from '@/types'

export default function PaginaPainel() {
  const [carregando, setCarregando]   = useState(true)
  const [dados,      setDados]        = useState<DadosDashboard | null>(null)
  const [mensal,     setMensal]       = useState<ResumoMensal[]>([])
  const [clientes,   setClientes]     = useState<LucratividadeCliente[]>([])
  const [categorias, setCategorias]   = useState<DespesaCategoria[]>([])
  const [alertasFechados, setFechados] = useState<number[]>([])

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const [d, m, c, cat] = await Promise.all([
        getDadosDashboard(), getResumoMensal(12),
        getLucratividadeClientes(), getDespesasPorCategoria(),
      ])
      setDados(d); setMensal(m); setClientes(c); setCategorias(cat)
    } finally { setCarregando(false) }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const alertasVisiveis = dados?.alertas.filter((_, i) => !alertasFechados.includes(i)) ?? []
  const topClientes     = clientes.slice(0, 5)
  const clientesRisco   = clientes.filter(c => c.status !== 'lucrativo')
  const maiorCategoria  = categorias[0]

  if (carregando) return (
    <div className="p-8"><Spinner /></div>
  )

  if (!dados) return null

  const data = new Date()
  const dataStr = data.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="p-7 max-w-[1400px] mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8 animate-subir">
        <div>
          <h1 className="font-display text-[28px] font-bold text-white tracking-tight">
            Centro de Controle
          </h1>
          <p className="text-[#444] text-sm mt-1 capitalize">{dataStr}</p>
        </div>
        <button onClick={carregar} className="btn-fantasma text-sm">
          <RefreshCw size={13} />
          Atualizar
        </button>
      </div>

      {/* Alertas */}
      <PainelAlertas
        alertas={alertasVisiveis}
        onFechar={i => setFechados(p => [...p, i])}
      />

      {/* KPIs principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CartaoStat
          rotulo="Saldo Atual"
          valor={dados.saldo_atual}
          destaque
          className="col-span-2 lg:col-span-1 delay-1"
          icone={<Wallet size={15}/>}
        />
        <CartaoStat
          rotulo="Receita do Mês"
          valor={dados.receita_mes}
          icone={<TrendingUp size={15}/>}
          className="delay-2"
        />
        <CartaoStat
          rotulo="Despesas do Mês"
          valor={dados.despesa_mes}
          perigo
          icone={<TrendingDown size={15}/>}
          className="delay-3"
        />
        <CartaoStat
          rotulo="Lucro Líquido"
          valor={dados.lucro_mes}
          perigo={dados.lucro_mes < 0}
          className="delay-4"
        />
      </div>

      {/* Gráficos - linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GraficoReceitasDespesas dados={mensal} />
        <GraficoLucro dados={mensal} />
      </div>

      {/* Gráficos - linha 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <GraficoPrevisao
            receitaRecorrente={dados.receita_recorrente}
            mediaDespesas={dados.despesa_recorrente || dados.despesa_mes}
            saldoAtual={dados.saldo_atual}
          />
        </div>
        <GraficoDespesasCategoria dados={categorias} />
      </div>

      {/* Linha de inteligência */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top clientes */}
        <div className="cartao">
          <p className="secao-titulo mb-4">Top Clientes — Receita</p>
          <div className="space-y-3">
            {topClientes.length === 0 && (
              <p className="text-[#444] text-sm">Sem dados de clientes.</p>
            )}
            {topClientes.map((c, i) => {
              const cfg = STATUS_CONFIG[c.status]
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-[10px] text-[#333] w-4 text-right font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate text-white">{c.nome}</p>
                      <span className={`tag text-[9px] px-1.5 py-0.5 border flex-shrink-0 ${
                        c.status === 'lucrativo' ? 'tag-verde' :
                        c.status === 'margem_baixa' ? 'tag-amarelo' : 'tag-vermelho'
                      }`}>{cfg.label}</span>
                    </div>
                    <div className="w-full bg-[#141414] rounded-full h-1">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${Math.min(100, (c.receita_total / (topClientes[0]?.receita_total || 1)) * 100)}%`,
                          background: cfg.cor,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono flex-shrink-0" style={{ color: cfg.cor }}>
                    {formatarMoedaCompacta(c.receita_total)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recorrência */}
        <div className="cartao">
          <p className="secao-titulo mb-4">Visão Recorrente</p>
          <div className="space-y-2">
            {[
              { r: 'Receita Recorrente / mês',  v: dados.receita_recorrente,                                      c: 'text-[#00C48C]' },
              { r: 'Despesa Recorrente / mês',  v: dados.despesa_recorrente,                                      c: 'text-red-400' },
              { r: 'Saldo Recorrente / mês',    v: dados.receita_recorrente - dados.despesa_recorrente,
                c: dados.receita_recorrente - dados.despesa_recorrente >= 0 ? 'text-[#D4AF37]' : 'text-red-400' },
            ].map(row => (
              <div key={row.r} className="flex items-center justify-between py-2.5 border-b border-[#141414] last:border-0">
                <span className="text-xs text-[#555]">{row.r}</span>
                <span className={`text-sm font-mono font-medium ${row.c}`}>
                  {formatarMoeda(row.v)}
                </span>
              </div>
            ))}
          </div>

          {dados.dias_ate_negativo !== null && (
            <div className={`mt-4 p-3 rounded-xl border text-xs ${
              dados.dias_ate_negativo < 30
                ? 'border-red-900/40 bg-red-950/10 text-red-400'
                : 'border-[#F5A623]/25 bg-[#F5A623]/5 text-[#F5A623]'
            }`}>
              <p className="font-medium mb-0.5">⏱ Reserva de caixa</p>
              <p className="opacity-80">~{dados.dias_ate_negativo} dias com o ritmo atual</p>
            </div>
          )}
        </div>

        {/* Clientes em risco */}
        <div className="cartao">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-[#F5A623]" />
            <p className="secao-titulo">Clientes em Risco</p>
          </div>
          {clientesRisco.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[#00C48C] text-sm font-medium">✓ Todos os clientes são lucrativos</p>
            </div>
          ) : (
            <div className="space-y-2">
              {clientesRisco.map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-[#141414] last:border-0">
                  <div>
                    <p className="text-sm text-white">{c.nome}</p>
                    <p className="text-[10px] text-[#444]">
                      Margem: {c.margem_pct.toFixed(1)}%
                    </p>
                  </div>
                  <span className={`tag text-[10px] ${
                    c.status === 'margem_baixa' ? 'tag-amarelo' : 'tag-vermelho'
                  }`}>
                    {STATUS_CONFIG[c.status].label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {maiorCategoria && (
            <div className="mt-4 pt-4 border-t border-[#141414]">
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Maior vazamento</p>
              <p className="text-sm text-[#D4AF37] font-medium capitalize">{maiorCategoria.categoria}</p>
              <p className="text-xs text-[#555]">{formatarMoeda(maiorCategoria.total)} ({maiorCategoria.pct.toFixed(1)}%)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
