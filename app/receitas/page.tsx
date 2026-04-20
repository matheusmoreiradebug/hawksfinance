'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, TrendingUp } from 'lucide-react'
import { CabecalhoPagina, Modal, Confirmar, EstadoVazio, Spinner, Toggle } from '@/components/ui/index'
import { getReceitas, getClientes, getProdutos, criarReceita, atualizarReceita, deletarReceita } from '@/lib/queries'
import { formatarMoeda, formatarData } from '@/lib/utils'
import type { Receita, ReceitaForm, Cliente, Produto } from '@/types'
import { INTERVALOS_RECORRENCIA } from '@/types'

const VAZIO: ReceitaForm = {
  cliente_id: null, produto_id: null, valor: 0,
  data: new Date().toISOString().slice(0, 10),
  recorrente: false, intervalo_recorrencia: 'mensal', descricao: '',
}

export default function PaginaReceitas() {
  const [receitas,   setReceitas]  = useState<Receita[]>([])
  const [clientes,   setClientes]  = useState<Cliente[]>([])
  const [produtos,   setProdutos]  = useState<Produto[]>([])
  const [carregando, setCarreg]    = useState(true)
  const [modal,      setModal]     = useState(false)
  const [editando,   setEditando]  = useState<Receita | null>(null)
  const [excluindo,  setExcluindo] = useState<Receita | null>(null)
  const [form,       setForm]      = useState<ReceitaForm>(VAZIO)
  const [salvando,   setSalvando]  = useState(false)
  const [erro,       setErro]      = useState('')

  async function carregar() {
    setCarreg(true)
    try {
      const [r, c, p] = await Promise.all([getReceitas(), getClientes(), getProdutos()])
      setReceitas(r); setClientes(c); setProdutos(p)
    } finally { setCarreg(false) }
  }
  useEffect(() => { carregar() }, [])

  function abrirCriar() { setEditando(null); setForm(VAZIO); setErro(''); setModal(true) }
  function abrirEditar(r: Receita) {
    setEditando(r)
    setForm({
      cliente_id: r.cliente_id, produto_id: r.produto_id,
      valor: r.valor, data: r.data, recorrente: r.recorrente,
      intervalo_recorrencia: r.intervalo_recorrencia ?? 'mensal',
      descricao: r.descricao ?? '',
    })
    setErro(''); setModal(true)
  }

  function selecionarProduto(prodId: string) {
    const prod = produtos.find(p => p.id === prodId)
    setForm(prev => ({ ...prev, produto_id: prodId || null, valor: prod ? prod.preco : prev.valor }))
  }

  async function salvar() {
    if (form.valor <= 0) { setErro('Valor deve ser maior que 0'); return }
    if (!form.data)      { setErro('Data é obrigatória'); return }
    setSalvando(true)
    try {
      if (editando) await atualizarReceita(editando.id, form)
      else          await criarReceita(form)
      setModal(false); await carregar()
    } catch (e: any) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  async function excluir() {
    if (!excluindo) return
    setSalvando(true)
    try { await deletarReceita(excluindo.id); setExcluindo(null); await carregar() }
    finally { setSalvando(false) }
  }

  const total    = receitas.reduce((s, r) => s + Number(r.valor), 0)
  const recorr   = receitas.filter(r => r.recorrente).reduce((s, r) => s + Number(r.valor), 0)
  const pontual  = total - recorr

  return (
    <div className="p-7 max-w-5xl mx-auto">
      <CabecalhoPagina
        titulo="Receitas"
        subtitulo={`${receitas.length} entradas · ${formatarMoeda(recorr)} recorrente/mês`}
        acao={<button onClick={abrirCriar} className="btn-primario"><Plus size={14}/> Adicionar Receita</button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { r: 'Total de Receitas',  v: total,   c: 'text-[#D4AF37]' },
          { r: 'Recorrente / mês',   v: recorr,  c: 'text-[#00C48C]' },
          { r: 'Pontual',            v: pontual, c: 'text-[#666]' },
        ].map(s => (
          <div key={s.r} className="cartao-sm">
            <p className="label">{s.r}</p>
            <p className={`font-display text-xl font-bold ${s.c}`}>{formatarMoeda(s.v)}</p>
          </div>
        ))}
      </div>

      {carregando ? <Spinner /> : receitas.length === 0 ? (
        <EstadoVazio icone={<TrendingUp size={22}/>} titulo="Nenhuma receita ainda"
          subtitulo="Registre sua primeira receita para começar."
          acao={<button onClick={abrirCriar} className="btn-primario"><Plus size={14}/> Adicionar Receita</button>}
        />
      ) : (
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] text-[#333] uppercase tracking-widest">
            <span className="col-span-3">Cliente</span>
            <span className="col-span-3">Serviço</span>
            <span className="col-span-2">Data</span>
            <span className="col-span-2 text-right">Valor</span>
            <span className="col-span-1 text-center">Rec.</span>
            <span className="col-span-1"/>
          </div>
          {receitas.map(rec => (
            <div key={rec.id}
              className="grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl bg-[#0F0F0F] border border-[#1A1A1A] hover:border-[#222] transition-colors animate-subir group">
              <span className="col-span-3 text-sm truncate text-white">
                {rec.cliente?.nome ?? <span className="text-[#333] italic">Sem cliente</span>}
              </span>
              <span className="col-span-3 text-sm text-[#555] truncate">
                {rec.produto?.nome ?? rec.descricao ?? <span className="italic">—</span>}
              </span>
              <span className="col-span-2 text-sm text-[#444]">{formatarData(rec.data)}</span>
              <span className="col-span-2 text-right font-mono text-sm font-medium text-[#00C48C]">
                +{formatarMoeda(Number(rec.valor))}
              </span>
              <span className="col-span-1 flex justify-center">
                {rec.recorrente && (
                  <span className="tag-ouro text-[9px]">
                    {rec.intervalo_recorrencia ?? 'rec'}
                  </span>
                )}
              </span>
              <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => abrirEditar(rec)} className="p-1 rounded text-[#333] hover:text-white">
                  <Pencil size={12}/>
                </button>
                <button onClick={() => setExcluindo(rec)} className="p-1 rounded text-[#333] hover:text-red-400">
                  <Trash2 size={12}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal aberto={modal} onFechar={() => setModal(false)} titulo={editando ? 'Editar Receita' : 'Adicionar Receita'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Cliente</label>
              <select className="input" value={form.cliente_id ?? ''}
                onChange={e => setForm(p => ({ ...p, cliente_id: e.target.value || null }))}>
                <option value="">Sem cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Serviço</label>
              <select className="input" value={form.produto_id ?? ''}
                onChange={e => selecionarProduto(e.target.value)}>
                <option value="">Sem serviço</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
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
          <div>
            <label className="label">Descrição</label>
            <input className="input" placeholder="Observação sobre esta receita" value={form.descricao ?? ''}
              onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}/>
          </div>

          <Toggle
            ativo={form.recorrente}
            onChange={() => setForm(p => ({ ...p, recorrente: !p.recorrente }))}
            rotulo="Receita recorrente"
          />

          {form.recorrente && (
            <div>
              <label className="label">Intervalo de Recorrência</label>
              <div className="grid grid-cols-3 gap-2">
                {INTERVALOS_RECORRENCIA.map(opt => (
                  <button key={opt.valor}
                    onClick={() => setForm(p => ({ ...p, intervalo_recorrencia: opt.valor }))}
                    className={`py-2 rounded-xl border text-sm transition-colors ${
                      form.intervalo_recorrencia === opt.valor
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'border-[#1E1E1E] text-[#555] hover:border-[#2A2A2A]'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
        carregando={salvando} titulo="Excluir Receita"
        mensagem={`Excluir receita de ${formatarMoeda(Number(excluindo?.valor ?? 0))}? Esta ação não pode ser desfeita.`}
      />
    </div>
  )
}
