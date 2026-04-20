import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, startOfMonth, endOfMonth, addMonths, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { LucratividadeCliente, PontoPrevisto, Alerta, DadosDashboard } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Formatação ───────────────────────────────────────────────────────────────

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', minimumFractionDigits: 2
  }).format(valor)
}

export function formatarMoedaCompacta(valor: number): string {
  if (Math.abs(valor) >= 1_000_000) return `R$ ${(valor / 1_000_000).toFixed(1)}M`
  if (Math.abs(valor) >= 1_000)     return `R$ ${(valor / 1_000).toFixed(1)}K`
  return formatarMoeda(valor)
}

export function formatarData(dateStr: string): string {
  try { return format(parseISO(dateStr), "dd 'de' MMM yyyy", { locale: ptBR }) }
  catch { return dateStr }
}

export function formatarMes(mesStr: string): string {
  try { return format(parseISO(mesStr + '-01'), 'MMM yy', { locale: ptBR }) }
  catch { return mesStr }
}

export function mesAtualRange() {
  const now = new Date()
  return {
    inicio: format(startOfMonth(now), 'yyyy-MM-dd'),
    fim:    format(endOfMonth(now),   'yyyy-MM-dd'),
  }
}

// ─── Status de Lucratividade ─────────────────────────────────────────────────

export function calcularStatusCliente(
  receita: number,
  custo: number
): LucratividadeCliente['status'] {
  if (receita <= 0) return 'prejuizo'
  const margem = custo > 0 ? ((receita - custo) / receita) * 100 : 100
  if (margem < 0)  return 'prejuizo'
  if (margem < 20) return 'margem_baixa'
  return 'lucrativo'
}

export const STATUS_CONFIG = {
  lucrativo:    { label: 'Lucrativo',      cor: '#00C48C', classe: 'tag-verde'  },
  margem_baixa: { label: 'Margem Baixa',   cor: '#F5A623', classe: 'tag-amarelo'},
  prejuizo:     { label: 'Prejuízo',       cor: '#FF4444', classe: 'tag-vermelho'},
} as const

export const CATEGORIA_CONFIG = {
  trafego:     { label: 'Tráfego',     cor: '#D4AF37' },
  ferramentas: { label: 'Ferramentas', cor: '#6B7280' },
  outros:      { label: 'Outros',      cor: '#4B5563' },
} as const

// ─── Previsão de Fluxo de Caixa ──────────────────────────────────────────────

export function gerarPrevisao(
  receitaRecorrente: number,
  mediaDedespacas: number,
  saldoAtual: number,
  meses = 12
): PontoPrevisto[] {
  const pontos: PontoPrevisto[] = []
  let saldo = saldoAtual
  for (let i = 1; i <= meses; i++) {
    const data = addMonths(new Date(), i)
    saldo = saldo + receitaRecorrente - mediaDedespacas
    pontos.push({
      label:             format(data, 'MMM yy', { locale: ptBR }),
      receita_prevista:  receitaRecorrente,
      despesa_prevista:  mediaDedespacas,
      saldo_previsto:    saldo,
    })
  }
  return pontos
}

export function calcularDiasAteNegativo(
  saldoAtual: number,
  mediaDedespacasDia: number
): number | null {
  if (mediaDedespacasDia <= 0 || saldoAtual <= 0) return null
  return Math.floor(saldoAtual / mediaDedespacasDia)
}

// ─── Alertas Inteligentes ────────────────────────────────────────────────────

export function gerarAlertas(dados: Omit<DadosDashboard, 'alertas'>): Alerta[] {
  const alertas: Alerta[] = []

  if (dados.despesa_mes > dados.receita_mes)
    alertas.push({
      tipo: 'perigo',
      titulo: 'Despesas acima da receita',
      mensagem: `Este mês as despesas (${formatarMoeda(dados.despesa_mes)}) superam as receitas (${formatarMoeda(dados.receita_mes)}). Revise seus custos imediatamente.`
    })

  if (dados.saldo_atual < 0)
    alertas.push({
      tipo: 'perigo',
      titulo: 'Saldo negativo',
      mensagem: `O saldo atual é ${formatarMoeda(dados.saldo_atual)}. Ação urgente necessária.`
    })

  if (dados.dias_ate_negativo !== null && dados.dias_ate_negativo < 60)
    alertas.push({
      tipo: dados.dias_ate_negativo < 30 ? 'perigo' : 'aviso',
      titulo: `Caixa em risco`,
      mensagem: `Com o ritmo atual, o caixa zera em aproximadamente ${dados.dias_ate_negativo} dias.`
    })

  if (dados.receita_recorrente < dados.despesa_recorrente)
    alertas.push({
      tipo: 'aviso',
      titulo: 'Receita recorrente insuficiente',
      mensagem: `Despesas recorrentes (${formatarMoeda(dados.despesa_recorrente)}) superam receitas recorrentes (${formatarMoeda(dados.receita_recorrente)}). Risco de fluxo negativo.`
    })

  if (dados.lucro_mes < 0 && dados.saldo_atual > 0)
    alertas.push({
      tipo: 'aviso',
      titulo: 'Mês com prejuízo',
      mensagem: `Lucro do mês em ${formatarMoeda(dados.lucro_mes)}. Monitore a tendência.`
    })

  return alertas
}
