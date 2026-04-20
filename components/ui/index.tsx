'use client'

import { useEffect } from 'react'
import { X, TrendingUp, TrendingDown, Minus, AlertTriangle, Info, XCircle, Users, Package } from 'lucide-react'
import { cn, formatarMoeda } from '@/lib/utils'
import type { Alerta } from '@/types'

// ─── CartaoStat ──────────────────────────────────────────────────────────────

interface CartaoStatProps {
  rotulo: string
  valor: number
  tendencia?: number
  destaque?: boolean
  perigo?: boolean
  icone?: React.ReactNode
  className?: string
  compacto?: boolean
}

export function CartaoStat({
  rotulo, valor, tendencia, destaque, perigo, icone, className, compacto
}: CartaoStatProps) {
  const isPos = tendencia !== undefined && tendencia > 0
  const isNeg = tendencia !== undefined && tendencia < 0

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-5 border transition-all',
      destaque
        ? 'bg-[#0F0F0F] border-[#D4AF37]/20 brilho-ouro'
        : 'bg-[#0F0F0F] border-[#1A1A1A]',
      perigo && valor < 0 && 'border-red-900/30',
      'animate-subir',
      className
    )}>
      {destaque && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 to-transparent pointer-events-none" />
      )}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <p className="label">{rotulo}</p>
          {icone && <div className="text-[#444]">{icone}</div>}
        </div>
        <p className={cn(
          'font-display font-bold tracking-tight',
          compacto ? 'text-2xl' : 'text-3xl',
          destaque && 'text-[#D4AF37]',
          perigo && valor < 0 && 'text-red-400',
          !destaque && !(perigo && valor < 0) && 'text-white'
        )}>
          {formatarMoeda(valor)}
        </p>
        {tendencia !== undefined && (
          <div className={cn(
            'flex items-center gap-1 mt-2 text-xs',
            isPos ? 'text-[#00C48C]' : isNeg ? 'text-red-400' : 'text-[#555]'
          )}>
            {isPos ? <TrendingUp size={11}/> : isNeg ? <TrendingDown size={11}/> : <Minus size={11}/>}
            <span>{Math.abs(tendencia).toFixed(1)}% vs mês anterior</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  aberto: boolean
  onFechar: () => void
  titulo: string
  children: React.ReactNode
  className?: string
}

export function Modal({ aberto, onFechar, titulo, children, className }: ModalProps) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onFechar])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onFechar} />
      <div className={cn(
        'relative bg-[#0F0F0F] border border-[#1E1E1E] rounded-2xl w-full max-w-md animate-subir shadow-2xl',
        className
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#141414]">
          <h2 className="font-display font-semibold text-lg">{titulo}</h2>
          <button onClick={onFechar} className="text-[#555] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#141414]">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Painel de Alertas ────────────────────────────────────────────────────────

const ICONES_ALERTA = { perigo: XCircle, aviso: AlertTriangle, info: Info }
const ESTILOS_ALERTA = {
  perigo: 'border-red-900/40 bg-red-950/15 text-red-400',
  aviso:  'border-[#F5A623]/25 bg-[#F5A623]/5 text-[#F5A623]',
  info:   'border-blue-800/40 bg-blue-950/15 text-blue-400',
}

interface PainelAlertasProps {
  alertas: Alerta[]
  onFechar?: (i: number) => void
}

export function PainelAlertas({ alertas, onFechar }: PainelAlertasProps) {
  if (!alertas.length) return null
  return (
    <div className="space-y-2 mb-6">
      {alertas.map((a, i) => {
        const Icone = ICONES_ALERTA[a.tipo]
        return (
          <div key={i} className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-xl border text-sm animate-subir',
            ESTILOS_ALERTA[a.tipo]
          )}>
            <Icone size={15} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs uppercase tracking-wider mb-0.5 opacity-80">{a.titulo}</p>
              <p className="opacity-90 text-xs leading-relaxed">{a.mensagem}</p>
            </div>
            {onFechar && (
              <button onClick={() => onFechar(i)} className="opacity-50 hover:opacity-100 flex-shrink-0">
                <X size={13} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── EstadoVazio ─────────────────────────────────────────────────────────────

export function EstadoVazio({
  icone, titulo, subtitulo, acao
}: { icone: React.ReactNode; titulo: string; subtitulo?: string; acao?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#141414] border border-[#1E1E1E] flex items-center justify-center text-[#444] mb-4">
        {icone}
      </div>
      <p className="font-medium text-white mb-1">{titulo}</p>
      {subtitulo && <p className="text-sm text-[#555] mb-5">{subtitulo}</p>}
      {acao}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <div className="w-5 h-5 border-2 border-[#1E1E1E] border-t-[#D4AF37] rounded-full animate-spin" />
    </div>
  )
}

// ─── Confirmar ────────────────────────────────────────────────────────────────

export function Confirmar({
  aberto, onFechar, onConfirmar, titulo, mensagem, carregando
}: {
  aberto: boolean; onFechar: () => void; onConfirmar: () => void
  titulo: string; mensagem: string; carregando?: boolean
}) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={titulo}>
      <p className="text-[#666] text-sm mb-6 leading-relaxed">{mensagem}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onFechar} className="btn-fantasma">Cancelar</button>
        <button onClick={onConfirmar} disabled={carregando} className="btn-perigo disabled:opacity-50">
          {carregando ? 'Excluindo...' : 'Confirmar exclusão'}
        </button>
      </div>
    </Modal>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

export function Toggle({
  ativo, onChange, rotulo
}: { ativo: boolean; onChange: () => void; rotulo?: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={onChange}
        className={cn('toggle', ativo ? 'bg-[#D4AF37]' : 'bg-[#1E1E1E]')}
      >
        <div className={cn('toggle-thumb', ativo && 'translate-x-[18px]')} />
      </div>
      {rotulo && <span className="text-sm text-[#888]">{rotulo}</span>}
    </label>
  )
}

// ─── Cabeçalho da Página ─────────────────────────────────────────────────────

export function CabecalhoPagina({
  titulo, subtitulo, acao, className
}: { titulo: string; subtitulo?: string; acao?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between mb-8', className)}>
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">{titulo}</h1>
        {subtitulo && <p className="text-[#555] text-sm mt-1">{subtitulo}</p>}
      </div>
      {acao && <div>{acao}</div>}
    </div>
  )
}
