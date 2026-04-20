'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCurrencyCompact, formatMonth } from '@/lib/utils'
import type { MonthlySummary } from '@/types'

interface RevenueChartProps {
  data: MonthlySummary[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-hawk-surface border border-hawk-border rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-hawk-sub mb-2 text-xs uppercase tracking-wider">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-hawk-sub capitalize">{entry.name}:</span>
          <span className="font-mono font-medium" style={{ color: entry.color }}>
            {formatCurrencyCompact(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map(d => ({
    name:     formatMonth(d.month),
    Revenue:  d.total_revenue,
    Expenses: d.total_expenses,
    Profit:   d.profit,
  }))

  return (
    <div className="card">
      <p className="text-sm font-medium text-white mb-1">Revenue vs Expenses</p>
      <p className="text-xs text-hawk-sub mb-6">Last 12 months</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#FF4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#FF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#888' }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="Revenue"
            stroke="#D4AF37"
            strokeWidth={2}
            fill="url(#gradRevenue)"
            dot={false}
            activeDot={{ r: 4, fill: '#D4AF37' }}
          />
          <Area
            type="monotone"
            dataKey="Expenses"
            stroke="#FF4444"
            strokeWidth={2}
            fill="url(#gradExpenses)"
            dot={false}
            activeDot={{ r: 4, fill: '#FF4444' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
