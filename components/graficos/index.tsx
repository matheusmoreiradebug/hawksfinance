'use client'

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, PieChart, Pie, Legend,
} from 'recharts'
import { formatarMoedaCompacta, formatarMes, gerarPrevisao, CATEGORIA_CONFIG } from '@/lib/utils'
import type { ResumoMensal, DespesaCategoria } from '@/types'

// ─── Tooltip customizado ──────────────────────────────────────────────────────

function TooltipBase({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0F0F0F] border border-[#1E1E1E] rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-[#555] text-[10px] uppercase tracking-widest mb-2">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
          <span className="text-[#666] text-xs">{e.name}:</span>
          <span className="font-mono text-xs font-medium" style={{ color: e.color }}>
            {formatarMoedaCompacta(e.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Gráfico: Receitas vs Despesas ────────────────────────────────────────────

export function GraficoReceitasDespesas({ dados }: { dados: ResumoMensal[] }) {
  const chartData = dados.map(d => ({
    name:     formatarMes(d.mes),
    Receitas: d.total_receitas,
    Despesas: d.total_despesas,
  }))

  return (
    <div className="cartao">
      <p className="secao-titulo mb-0.5">Receitas vs Despesas</p>
      <p className="text-xs text-[#444] mb-5">Últimos 12 meses</p>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gDep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#FF4444" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#FF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#141414" vertical={false}/>
          <XAxis dataKey="name" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false}
                 tickFormatter={formatarMoedaCompacta} width={68}/>
          <Tooltip content={<TooltipBase/>}/>
          <Legend wrapperStyle={{ fontSize: '11px', color: '#555' }} iconType="circle" iconSize={7}/>
          <Area type="monotone" dataKey="Receitas" stroke="#D4AF37" strokeWidth={1.5}
                fill="url(#gRec)" dot={false} activeDot={{ r: 3, fill: '#D4AF37' }}/>
          <Area type="monotone" dataKey="Despesas" stroke="#FF4444" strokeWidth={1.5}
                fill="url(#gDep)" dot={false} activeDot={{ r: 3, fill: '#FF4444' }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Gráfico: Evolução do Lucro ───────────────────────────────────────────────

export function GraficoLucro({ dados }: { dados: ResumoMensal[] }) {
  const chartData = dados.map(d => ({
    name:  formatarMes(d.mes),
    Lucro: d.lucro,
  }))

  return (
    <div className="cartao">
      <p className="secao-titulo mb-0.5">Evolução do Lucro</p>
      <p className="text-xs text-[#444] mb-5">Verde = positivo · Vermelho = negativo</p>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#141414" vertical={false}/>
          <XAxis dataKey="name" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false}
                 tickFormatter={formatarMoedaCompacta} width={68}/>
          <Tooltip content={<TooltipBase/>} cursor={{ fill: 'rgba(255,255,255,0.02)' }}/>
          <Bar dataKey="Lucro" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {chartData.map((e, i) => (
              <Cell key={i} fill={e.Lucro >= 0 ? '#00C48C' : '#FF4444'} fillOpacity={0.75}/>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Gráfico: Previsão de Fluxo de Caixa ─────────────────────────────────────

export function GraficoPrevisao({
  receitaRecorrente, mediaDespesas, saldoAtual
}: { receitaRecorrente: number; mediaDespesas: number; saldoAtual: number }) {
  const pontos = gerarPrevisao(receitaRecorrente, mediaDespesas, saldoAtual, 12)
  const chartData = [
    { name: 'Agora', saldo_previsto: saldoAtual },
    ...pontos.map(p => ({ name: p.label, saldo_previsto: p.saldo_previsto })),
  ]
  const ficaNegativo = pontos.some(p => p.saldo_previsto < 0)

  return (
    <div className="cartao">
      <div className="flex items-start justify-between mb-0.5">
        <p className="secao-titulo">Previsão de Caixa — 12 meses</p>
        {ficaNegativo && (
          <span className="tag-vermelho text-[10px]">⚠ Fica negativo</span>
        )}
      </div>
      <p className="text-xs text-[#444] mb-5">Baseado em receitas e despesas recorrentes</p>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#141414" vertical={false}/>
          <XAxis dataKey="name" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false}
                 tickFormatter={formatarMoedaCompacta} width={68}/>
          <ReferenceLine y={0} stroke="#FF4444" strokeDasharray="4 4" strokeOpacity={0.4}/>
          <Tooltip content={<TooltipBase/>}/>
          <Line type="monotone" dataKey="saldo_previsto" stroke="#D4AF37" strokeWidth={1.5}
                dot={false} activeDot={{ r: 3, fill: '#D4AF37' }} strokeDasharray="6 3"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Gráfico: Despesas por Categoria (rosca) ─────────────────────────────────

export function GraficoDespesasCategoria({ dados }: { dados: DespesaCategoria[] }) {
  const cores: Record<string, string> = {
    trafego:     '#D4AF37',
    ferramentas: '#6B7280',
    outros:      '#374151',
  }
  const chartData = dados.map(d => ({
    name:  CATEGORIA_CONFIG[d.categoria as keyof typeof CATEGORIA_CONFIG]?.label ?? d.categoria,
    value: d.total,
    cor:   cores[d.categoria] ?? '#888',
    pct:   d.pct,
  }))

  if (!chartData.length) return (
    <div className="cartao flex items-center justify-center h-40">
      <p className="text-sm text-[#444]">Sem dados de despesas</p>
    </div>
  )

  return (
    <div className="cartao">
      <p className="secao-titulo mb-0.5">Despesas por Categoria</p>
      <p className="text-xs text-[#444] mb-4">Onde o dinheiro está saindo</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
               dataKey="value" paddingAngle={3}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.cor} opacity={0.85}/>
            ))}
          </Pie>
          <Tooltip formatter={(v: any) => formatarMoedaCompacta(v)}/>
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-3">
        {chartData.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.cor }}/>
            <span className="text-xs text-[#888] flex-1">{d.name}</span>
            <span className="text-xs font-mono text-white">{d.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
