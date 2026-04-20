'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Package,
  TrendingUp, Receipt, Settings, Bird,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',             label: 'Painel',    icon: LayoutDashboard },
  { href: '/clientes',     label: 'Clientes',  icon: Users },
  { href: '/produtos',     label: 'Produtos',  icon: Package },
  { href: '/receitas',     label: 'Receitas',  icon: TrendingUp },
  { href: '/despesas',     label: 'Despesas',  icon: Receipt },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#0A0A0A] border-r border-[#141414] flex flex-col h-screen">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#141414]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
            <Bird size={18} className="text-black" strokeWidth={2} />
          </div>
          <div>
            <p className="font-display font-bold text-xl leading-none tracking-wide">Hawks</p>
            <p className="text-[9px] text-[#555] uppercase tracking-[0.2em] mt-0.5">Finance</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const ativo = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                ativo
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15'
                  : 'text-[#666] hover:text-white hover:bg-[#141414]'
              )}
            >
              <Icon size={15} strokeWidth={ativo ? 2 : 1.5} />
              <span className={cn('font-medium', !ativo && 'font-normal')}>{label}</span>
              {ativo && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37] opacity-80" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 border-t border-[#141414] pt-4 space-y-0.5">
        <Link
          href="/configuracoes"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
            path === '/configuracoes'
              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15'
              : 'text-[#666] hover:text-white hover:bg-[#141414]'
          )}
        >
          <Settings size={15} strokeWidth={1.5} />
          Configurações
        </Link>
        <div className="px-3 pt-3">
          <p className="text-[10px] text-[#333]">Hawks Agência Digital</p>
          <p className="text-[10px] text-[#222]">v2.0.0</p>
        </div>
      </div>
    </aside>
  )
}
