'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Receipt, Megaphone, Wrench, MoreHorizontal } from 'lucide-react'
import { CabecalhoPagina, Modal, Confirmar, EstadoVazio, Spinner, Toggle } from '@/components/ui/index'
import { getDespesas, criarDespesa, atualizarDespesa, deletarDespesa, getDespesasPorCategoria } from '@/lib/queries'
import { formatarMoeda, formatarData, CATEGORIA_CONFIG } from '@/lib/utils'
import type { Despesa, DespesaForm, DespesaCategoria } from '@/types'
import { CATEGORIAS_DESPESA } from '@/types'

const VAZIO: DespesaForm = {
  categoria: 'outros', descricao: '', valor: 0,
  data: new Date().toISOString().slice(0, 10), recorrente: false,
}

const ICONES_CAT = { trafego: Megaphone, ferramentas: Wrench, outros: MoreHorizontal }

export default function PaginaDespesas() {
  const [despesas,   setDespesas]  = useState<Despesa[]>([])
  const [catStats,   setCatStats]  = useState<DespesaCategoria[]>([])
  const [carregando, setCarreg]    = useState(true)
  const [modal,      setModal]     = useState(false)
  const [editando,   setEditando]  = useState<Despesa | null>(null)
  const [excluindo,  setExcluindo] = useState<Despesa | null>(null)
  const [form,       setForm]      = useState<DespesaForm>(VAZIO)
  const [salvando,   setSalvando]  = useState(false)
  const [erro,       setErro]      = useState('')
  const [filtro,     setFiltro]    = useState<string>('todos')

  async function carregar() {
    setCarreg(true)
    try {
      const [d, c] = await Promise.all([getDespesas(), getDespesasPorCategoria()])
      setDespesas(d); setCatStats(c)
    } finally { setCarreg(false) }
  }
  useEffect(() => { carregar() }, [])

  function abrirCriar() { setEditando(null); setForm(VAZIO); setErro(''); setModal(true) }
  function abrirEditar(d: Despesa) {
    setEditando(d)
    setForm({ categoria: d.categoria, descricao: d.descricao, valor: d.valor, data: d.data, recorrente: d.recorrente })
    setErro(''); setModal(true)
  }

  async function salvar() {
    if (!form.descricao.trim()) { setErro('Descrição é obrigatória'); return }
    if (form.valor <= 0)        { setErro('Valor deve ser maior que 0'); return }
    setSalvando(true)
    try {
      if (editando) await atualizarDespesa(editando.id, form)
      else          await criarDespesa(form)
      setModal(false); await carregar()
    } catch (e: any) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  async function excluir() {
    if (!excluindo) return
    setSalvando(true)
    try { await deletarDespesa(excluindo.id); setExcluindo(null); await carregar() }
    finally { setSalvando(false) }
  }

  const filtradas = filtro === 'todos' ? despesas : despesas.filter(d => d.categoria === filtro)
  const totalGeral = despesas.reduce((s, d) => s + Number(d.valor), 0)
  const totalFiltrado = filtradas.reduce((s, d) => s + Number(d.valor), 0)
  const maiorCategoria = catStats[0]

  return (
    <div className="p-7 max-w-5xl mx-auto">
      <CabecalhoPagina
        titulo="Despesas"
        subtitulo={`${despesas.length} entradas · Total: ${formatarMoeda(totalGeral)}`}
        acao={<button onClick={abrirCriar} className="btn-primario"><Plus size={14}/> Adicionar Despesa</button>}
      />

      {/* Inteligência de categorias */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {CATEGORIAS_DESPESA.map(cat => {
          const stat = catStats.find(c => c.categoria === cat.valor)
          const ativo = filtro === cat.valor
          return (
            <button key={cat.valor}
              onClick={() => setFiltro(ativo ? 'todos' : cat.valor)}
              className={`cartao-sm text-left transition-all hover:border-[#D4AF37]/20 ${ativo ? 'border-[#D4AF37]/30' : ''}`}
            >
              <p className="label">{cat.label}</p>
              <p className="font-display text-xl font-bold text-white">{formatarMoeda(stat?.total ?? 0)}</p>
              {stat && <p className="text-[10px] text-[#444] mt-1">{stat.pct.toFixed(1)}% do total</p>}
              {ativo && <span className="text-[9px] text-[#D4AF37] mt-0.5 block">Filtrado ×</span>}
            </button>
          )
        })}
      </div>

      {/* Banner maior vazamento */}
      {maiorCategoria && !carregando && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] mb-5">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0"/>
          <p className="text-xs text-[#666]">
            Maior categoria de gasto:{' '}
            <span className="text-[#D4AF37] font-medium capitalize">{CATEGORIA_CONFIG[maiorCategoria.categoria as keyof typeof CATEGORIA_CONFIG]?.label ?? maiorCategoria.categoria}</span>
            {' '}— {formatarMoeda(maiorCategoria.total)} ({maiorCategoria.pct.toFixed(1)}%)
          </p>
        </div>
      )}

      {carregando ? <Spinner /> : filtradas.length === 0 ? (
        <EstadoVazio icone={<Receipt size={22}/>} titulo="Nenhuma despesa encontrada"
          subtitulo={filtro !== 'todos' ? 'Sem despesas nesta categoria.' : 'Adicione sua primeira despesa.'}
          acao={<button onClick={abrirCriar} className="btn-primario"><Plus size={14}/> Adicionar Despesa</button>}
        />
      ) : (
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] text-[#333] uppercase tracking-widest">
            <span className="col-span-2">Categoria</span>
            <span className="col-span-4">Descrição</span>
            <span className="col-span-2">Data</span>
            <span className="col-span-2 text-right">Valor</span>
            <span className="col-span-1 text-center">Rec.</span>
            <span className="col-span-1"/>
          </div>

          {filtradas.map(desp => {
            const Icone = ICONES_CAT[desp.categoria]
            const catCfg = CATEGORIA_CONFIG[desp.categoria]
            return (
              <div key={desp.id}
                className="grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl bg-[#0F0F0F] border border-[#1A1A1A] hover:border-[#222] transition-colors animate-subir group">
                <div className="col-span-2">
                  <span className="tag flex items-center gap-1 w-fit text-[9px] border-[#1E1E1E] text-[#666] bg-[#141414]">
                    <Icone size={9}/>
                    {catCfg?.label ?? desp.categoria}
                  </span>
                </div>
                <span className="col-span-4 text-sm truncate text-white">{desp.descricao}</span>
                <span className="col-span-2 text-sm text-[#444]">{formatarData(desp.data)}</span>
                <span className="col-span-2 text-right font-mono text-sm font-medium text-red-400">
                  -{formatarMoeda(Number(desp.valor))}
                </span>
                <span className="col-span-1 flex justify-center">
                  {desp.recorrente && <span className="tag-cinza text-[9px]">rec</span>}
                </span>
                <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => abrirEditar(desp)} className="p-1 rounded text-[#333] hover:text-white">
                    <Pencil size={12}/>
                  </button>
                  <button onClick={() => setExcluindo(desp)} className="p-1 rounded text-[#333] hover:text-red-400">
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>
            )
          })}

          <div className="flex items-center justify-between px-4 py-3 border-t border-[#141414] mt-2">
            <span className="text-xs text-[#444]">{filtradas.length} itens</span>
            <span className="font-mono text-sm font-semibold text-red-400">{formatarMoeda(totalFiltrado)}</span>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal aberto={modal} onFechar={() => setModal(false)} titulo={editando ? 'Editar Despesa' : 'Adicionar Despesa'}>
        <div className="space-y-4">
          <div>
            <label className="label">Categoria *</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIAS_DESPESA.map(cat => (
                <button key={cat.valor}
                  onClick={() => setForm(p => ({ ...p, categoria: cat.valor as any }))}
                  className={`py-2.5 rounded-xl border text-sm transition-colors ${
                    form.categoria === cat.valor
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border-[#1E1E1E] text-[#555] hover:border-[#2A2A2A]'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Descrição *</label>
            <input className="input" placeholder="Ex: Google Ads — Cliente X"
              value={form.descricao}
              onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Valor (R$) *</label>
              <input type="number" min="0" step="0.01" className="input font-mono"
                placeholder="0,00" value={form.valor || ''}
                onChange={e => setForm(p => ({ ...p, valor: parseFloat(e.target.value) || 0 }))}/>
            </div>
            <div>
              <label className="label">Data *</label>
              <input type="date" className="input" value={form.data}
                onChange={e => setForm(p => ({ ...p, data: e.target.value }))}/>
            </div>
          </div>
          <Toggle
            ativo={form.recorrente}
            onChange={() => setForm(p => ({ ...p, recorrente: !p.recorrente }))}
            rotulo="Despesa recorrente mensal"
          />
          {erro && <p className="text-xs text-red-400">{erro}</p>}
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModal(false)} className="btn-fantasma flex-1 justify-center">Cancelar</button>
            <button onClick={salvar} disabled={salvando} className="btn-primario flex-1 justify-center">
              {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </div>
      </Modal>

      <Confirmar
        aberto={!!excluindo} onFechar={() => setExcluindo(null)} onConfirmar={excluir}
        carregando={salvando} titulo="Excluir Despesa"
        mensagem={`Excluir "${excluindo?.descricao}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  )
}
