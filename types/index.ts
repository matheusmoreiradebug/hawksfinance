// ─── Entidades do Banco ───────────────────────────────────────────────────────

export interface Cliente {
  id: string
  nome: string
  contato: string | null
  notas: string | null
  custo_estimado: number
  created_at: string
}

export interface Produto {
  id: string
  nome: string
  preco: number
  entregaveis: string | null
  created_at: string
}

export interface Receita {
  id: string
  cliente_id: string | null
  produto_id: string | null
  valor: number
  data: string
  recorrente: boolean
  intervalo_recorrencia: 'mensal' | 'semanal' | 'anual' | null
  descricao: string | null
  created_at: string
  // Joins
  cliente?: Cliente | null
  produto?: Produto | null
}

export interface Despesa {
  id: string
  categoria: 'trafego' | 'ferramentas' | 'outros'
  descricao: string
  valor: number
  data: string
  recorrente: boolean
  created_at: string
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface ResumoMensal {
  mes: string
  total_receitas: number
  total_despesas: number
  lucro: number
}

export interface LucratividadeCliente {
  id: string
  nome: string
  contato: string | null
  custo_estimado: number
  receita_total: number
  qtd_transacoes: number
  ultima_transacao: string | null
  lucro_cliente: number
  margem_pct: number
  status: 'lucrativo' | 'margem_baixa' | 'prejuizo'
}

export interface DespesaCategoria {
  categoria: string
  total: number
  quantidade: number
  pct: number
}

export interface PontoPrevisto {
  label: string
  receita_prevista: number
  despesa_prevista: number
  saldo_previsto: number
}

export interface DadosDashboard {
  saldo_atual: number
  receita_mes: number
  despesa_mes: number
  lucro_mes: number
  receita_recorrente: number
  despesa_recorrente: number
  dias_ate_negativo: number | null
  alertas: Alerta[]
}

export interface Alerta {
  tipo: 'perigo' | 'aviso' | 'info'
  titulo: string
  mensagem: string
}

// ─── Formulários ──────────────────────────────────────────────────────────────

export type ClienteForm = Omit<Cliente, 'id' | 'created_at'>
export type ProdutoForm  = Omit<Produto, 'id' | 'created_at'>
export type ReceitaForm  = Omit<Receita, 'id' | 'created_at' | 'cliente' | 'produto'>
export type DespesaForm  = Omit<Despesa, 'id' | 'created_at'>

// ─── Constantes ───────────────────────────────────────────────────────────────

export const CATEGORIAS_DESPESA = [
  { valor: 'trafego',      label: 'Tráfego',      cor: '#D4AF37' },
  { valor: 'ferramentas',  label: 'Ferramentas',   cor: '#6B7280' },
  { valor: 'outros',       label: 'Outros',        cor: '#374151' },
] as const

export const INTERVALOS_RECORRENCIA = [
  { valor: 'mensal',  label: 'Mensal'  },
  { valor: 'semanal', label: 'Semanal' },
  { valor: 'anual',   label: 'Anual'   },
] as const
