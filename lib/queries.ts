import { supabase } from './supabase'
import {
  calcularStatusCliente, calcularDiasAteNegativo,
  gerarAlertas, mesAtualRange
} from './utils'
import type {
  Cliente, Produto, Receita, Despesa,
  ClienteForm, ProdutoForm, ReceitaForm, DespesaForm,
  ResumoMensal, LucratividadeCliente, DespesaCategoria, DadosDashboard
} from '@/types'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

// ─── CLIENTES ──────────────────────────────────────────────────────────────────

export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from('clientes').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function criarCliente(form: ClienteForm) {
  const { data, error } = await supabase.from('clientes').insert(form).select().single()
  if (error) throw error
  return data
}

export async function atualizarCliente(id: string, form: Partial<ClienteForm>) {
  const { data, error } = await supabase.from('clientes').update(form).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletarCliente(id: string) {
  const { error } = await supabase.from('clientes').delete().eq('id', id)
  if (error) throw error
}

// ─── PRODUTOS ─────────────────────────────────────────────────────────────────

export async function getProdutos(): Promise<Produto[]> {
  const { data, error } = await supabase
    .from('produtos').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function criarProduto(form: ProdutoForm) {
  const { data, error } = await supabase.from('produtos').insert(form).select().single()
  if (error) throw error
  return data
}

export async function atualizarProduto(id: string, form: Partial<ProdutoForm>) {
  const { data, error } = await supabase.from('produtos').update(form).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletarProduto(id: string) {
  const { error } = await supabase.from('produtos').delete().eq('id', id)
  if (error) throw error
}

// ─── RECEITAS ─────────────────────────────────────────────────────────────────

export async function getReceitas(): Promise<Receita[]> {
  const { data, error } = await supabase
    .from('receitas')
    .select('*, cliente:clientes(id,nome), produto:produtos(id,nome,preco)')
    .order('data', { ascending: false })
  if (error) throw error
  return (data ?? []) as Receita[]
}

export async function criarReceita(form: ReceitaForm) {
  const { data, error } = await supabase.from('receitas').insert(form).select().single()
  if (error) throw error
  return data
}

export async function atualizarReceita(id: string, form: Partial<ReceitaForm>) {
  const { data, error } = await supabase.from('receitas').update(form).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletarReceita(id: string) {
  const { error } = await supabase.from('receitas').delete().eq('id', id)
  if (error) throw error
}

// ─── DESPESAS ─────────────────────────────────────────────────────────────────

export async function getDespesas(): Promise<Despesa[]> {
  const { data, error } = await supabase
    .from('despesas').select('*').order('data', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function criarDespesa(form: DespesaForm) {
  const { data, error } = await supabase.from('despesas').insert(form).select().single()
  if (error) throw error
  return data
}

export async function atualizarDespesa(id: string, form: Partial<DespesaForm>) {
  const { data, error } = await supabase.from('despesas').update(form).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletarDespesa(id: string) {
  const { error } = await supabase.from('despesas').delete().eq('id', id)
  if (error) throw error
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

export async function getResumoMensal(meses = 12): Promise<ResumoMensal[]> {
  const resultados: ResumoMensal[] = []
  for (let i = meses - 1; i >= 0; i--) {
    const ref   = subMonths(new Date(), i)
    const inicio = format(startOfMonth(ref), 'yyyy-MM-dd')
    const fim    = format(endOfMonth(ref),   'yyyy-MM-dd')
    const mes    = format(ref, 'yyyy-MM')

    const [{ data: rec }, { data: dep }] = await Promise.all([
      supabase.from('receitas').select('valor').gte('data', inicio).lte('data', fim),
      supabase.from('despesas').select('valor').gte('data', inicio).lte('data', fim),
    ])

    const total_receitas  = (rec  ?? []).reduce((s, r) => s + Number(r.valor), 0)
    const total_despesas  = (dep  ?? []).reduce((s, d) => s + Number(d.valor), 0)
    resultados.push({ mes, total_receitas, total_despesas, lucro: total_receitas - total_despesas })
  }
  return resultados
}

export async function getLucratividadeClientes(): Promise<LucratividadeCliente[]> {
  const [{ data: clientes }, { data: receitas }] = await Promise.all([
    supabase.from('clientes').select('*'),
    supabase.from('receitas').select('cliente_id, valor, data'),
  ])
  if (!clientes) return []

  return clientes.map(c => {
    const recsCliente = (receitas ?? []).filter(r => r.cliente_id === c.id)
    const receita_total = recsCliente.reduce((s, r) => s + Number(r.valor), 0)
    const custo = Number(c.custo_estimado ?? 0)
    const lucro_cliente = receita_total - custo
    const margem_pct = receita_total > 0 ? (lucro_cliente / receita_total) * 100 : -100
    const status = calcularStatusCliente(receita_total, custo)
    const datas  = recsCliente.map(r => r.data).sort()

    return {
      id: c.id, nome: c.nome, contato: c.contato,
      custo_estimado: custo, receita_total, lucro_cliente,
      margem_pct, status,
      qtd_transacoes: recsCliente.length,
      ultima_transacao: datas[datas.length - 1] ?? null,
    }
  }).sort((a, b) => b.lucro_cliente - a.lucro_cliente)
}

export async function getDespesasPorCategoria(): Promise<DespesaCategoria[]> {
  const { data } = await supabase.from('despesas').select('categoria, valor')
  if (!data) return []

  const mapa: Record<string, number> = {}
  let total = 0
  data.forEach(d => {
    mapa[d.categoria] = (mapa[d.categoria] ?? 0) + Number(d.valor)
    total += Number(d.valor)
  })

  return Object.entries(mapa).map(([categoria, soma]) => ({
    categoria,
    total: soma,
    quantidade: data.filter(d => d.categoria === categoria).length,
    pct: total > 0 ? (soma / total) * 100 : 0,
  })).sort((a, b) => b.total - a.total)
}

export async function getDadosDashboard(): Promise<DadosDashboard> {
  const [receitas, despesas] = await Promise.all([getReceitas(), getDespesas()])

  const { inicio, fim } = mesAtualRange()

  const receitaMes  = receitas.filter(r => r.data >= inicio && r.data <= fim)
                               .reduce((s, r) => s + Number(r.valor), 0)
  const despesaMes  = despesas.filter(d => d.data >= inicio && d.data <= fim)
                               .reduce((s, d) => s + Number(d.valor), 0)
  const lucroMes    = receitaMes - despesaMes

  const totalReceitas  = receitas.reduce((s, r) => s + Number(r.valor), 0)
  const totalDespesas  = despesas.reduce((s, d) => s + Number(d.valor), 0)
  const saldo_atual    = totalReceitas - totalDespesas

  const receitaRec  = receitas.filter(r => r.recorrente).reduce((s, r) => s + Number(r.valor), 0)
  const despesaRec  = despesas.filter(d => d.recorrente).reduce((s, d) => s + Number(d.valor), 0)

  const mediaDespesasDia = despesaMes / 30
  const dias_ate_negativo = calcularDiasAteNegativo(saldo_atual, mediaDespesasDia)

  const base = { saldo_atual, receita_mes: receitaMes, despesa_mes: despesaMes,
                  lucro_mes: lucroMes, receita_recorrente: receitaRec,
                  despesa_recorrente: despesaRec, dias_ate_negativo }

  return { ...base, alertas: gerarAlertas(base) }
}
