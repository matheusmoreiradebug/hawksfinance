import { AlertTriangle, Info, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Alert } from '@/types'

interface AlertBannerProps {
  alerts:    Alert[]
  onDismiss?: (index: number) => void
}

const ICONS = {
  danger:  XCircle,
  warning: AlertTriangle,
  info:    Info,
}

const STYLES = {
  danger:  'border-hawk-danger/30 bg-hawk-danger/5 text-hawk-danger',
  warning: 'border-hawk-warning/30 bg-hawk-warning/5 text-hawk-warning',
  info:    'border-blue-500/30 bg-blue-500/5 text-blue-400',
}

export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  if (!alerts.length) return null

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert, i) => {
        const Icon = ICONS[alert.type]
        return (
          <div
            key={i}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border text-sm animate-fade-up',
              STYLES[alert.type]
            )}
          >
            <Icon size={15} className="flex-shrink-0" />
            <span className="flex-1">{alert.message}</span>
            {onDismiss && (
              <button onClick={() => onDismiss(i)} className="opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
