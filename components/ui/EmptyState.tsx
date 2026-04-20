import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon:     React.ReactNode
  title:    string
  subtitle?: string
  action?:  React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      <div className="w-14 h-14 rounded-2xl bg-hawk-muted border border-hawk-border flex items-center justify-center text-hawk-sub mb-4">
        {icon}
      </div>
      <p className="font-medium text-white mb-1">{title}</p>
      {subtitle && <p className="text-sm text-hawk-sub mb-4">{subtitle}</p>}
      {action}
    </div>
  )
}
