'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { formatCurrencyCompact, generateForecast } from '@/lib/utils'

interface ForecastChartProps {
  recurringRevenue:  number
  avgExpenses:       number
  currentBalance:    number
  horizon?:          30 | 90 | 365
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const bal = payload[0]?.value ?? 0
  return (
    <div className="bg-hawk-surface border border-hawk-border rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-hawk-sub text-xs mb-2">{label}</p>
      <p className={`font-mono font-semibold ${bal >= 0 ? 'text-hawk-success' : 'text-hawk-danger'}`}>
        {formatCurrencyCompact(bal)}
      </p>
    </div>
  )
}

const HORIZON_MONTHS: Record<number, number> = { 30: 1, 90: 3, 365: 12 }

export function ForecastChart({
  recurringRevenue, avgExpenses, currentBalance, horizon = 365
}: ForecastChartProps) {
  const months = HORIZON_MONTHS[horizon] ?? 12
  const data   = generateForecast(recurringRevenue, avgExpenses, currentBalance, months)

  const chartData = [
    { name: 'Now', projected_balance: currentBalance },
    ...data.map(d => ({ name: d.label, projected_balance: d.projected_balance })),
  ]

  const goesNegative = data.some(d => d.projected_balance < 0)

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm font-medium text-white">Cash Flow Forecast</p>
          <p className="text-xs text-hawk-sub mt-0.5">
            Based on recurring revenue & avg. expenses
          </p>
        </div>
        {goesNegative && (
          <span className="tag-red text-[10px]">⚠ Goes negative</span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={220} className="mt-6">
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
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
          <ReferenceLine y={0} stroke="#FF4444" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="projected_balance"
            stroke="#D4AF37"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#D4AF37' }}
            strokeDasharray="6 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
