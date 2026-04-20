import { cn, formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label:       string
  value:       number
  trend?:      number       // percent change
  prefix?:     string
  suffix?:     string
  highlight?:  boolean
  danger?:     boolean
  className?:  string
  compact?:    boolean
  icon?:       React.ReactNode
}

export function StatCard({
  label, value, trend, highlight, danger, className, compact, icon
}: StatCardProps) {
  const isPositive = trend !== undefined && trend > 0
  const isNegative = trend !== undefined && trend < 0

  return (
    <div
      className={cn(
        'card animate-fade-up relative overflow-hidden',
        highlight && 'border-gold/30 shadow-gold-sm',
        danger    && 'border-hawk-danger/30',
        className
      )}
    >
      {highlight && (
        <div className="absolute inset-0 bg-glow-gold pointer-events-none" />
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <p className="label">{label}</p>
          {icon && <div className="text-hawk-sub">{icon}</div>}
        </div>

        <p className={cn(
          'font-display font-bold',
          compact ? 'text-2xl' : 'text-3xl',
          highlight && 'text-gold',
          danger    && value < 0 && 'text-hawk-danger',
          !highlight && !danger && 'text-white'
        )}>
          {formatCurrency(value)}
        </p>

        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 mt-2 text-xs',
            isPositive && 'text-hawk-success',
            isNegative && 'text-hawk-danger',
            !isPositive && !isNegative && 'text-hawk-sub'
          )}>
            {isPositive && <TrendingUp size={12} />}
            {isNegative && <TrendingDown size={12} />}
            {!isPositive && !isNegative && <Minus size={12} />}
            <span>{Math.abs(trend).toFixed(1)}% vs last month</span>
          </div>
        )}
      </div>
    </div>
  )
}
