'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { formatCurrencyCompact, formatMonth } from '@/lib/utils'
import type { MonthlySummary } from '@/types'

interface ProfitChartProps {
  data: MonthlySummary[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value ?? 0
  return (
    <div className="bg-hawk-surface border border-hawk-border rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-hawk-sub text-xs uppercase tracking-wider mb-2">{label}</p>
      <p className={`font-mono font-semibold ${val >= 0 ? 'text-hawk-success' : 'text-hawk-danger'}`}>
        {formatCurrencyCompact(val)}
      </p>
    </div>
  )
}

export function ProfitChart({ data }: ProfitChartProps) {
  const chartData = data.map(d => ({
    name:   formatMonth(d.month),
    Profit: d.profit,
  }))

  return (
    <div className="card">
      <p className="text-sm font-medium text-white mb-1">Monthly Profit</p>
      <p className="text-xs text-hawk-sub mb-6">Positive = green · Negative = red</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#888', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#888', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCurrencyCompact}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="Profit" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.Profit >= 0 ? '#00C48C' : '#FF4444'}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
