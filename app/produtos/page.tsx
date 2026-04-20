'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Package, List } from 'lucide-react'
import { CabecalhoPagina, Modal, Confirmar, EstadoVazio, Spinner } from '@/components/ui/index'
import { getProdutos, criarProduto, atualizarProduto, deletarProduto } from '@/lib/queries'
import { formatarMoeda, formatarData } from '@/lib/utils'
import type { Produto, ProdutoForm } from '@/types'

const VAZIO: ProdutoForm = { nome: '', preco: 0, entregaveis: '' }

export default function PaginaProdutos() {
  const [produtos,   setProdutos]  = useState<Produto[]>([])
  const [carregando, setCarreg]    = useState(true)
  const [modal,      setModal]     = useState(false)
  const [editando,   setEditando]  = useState<Produto | null>(null)
  const [excluindo,  setExcluindo] = useState<Produto | null>(null)
  const [form,       setForm]      = useState<ProdutoForm>(VAZIO)
  const [salvando,   setSalvando]  = useState(false)
  const [erro,       setErro]      = useState('')

  async function carregar() {
    setCarreg(true)
    try { setProdutos(await getProdutos()) }
    finally { setCarreg(false) }
  }
  useEffect(() => { carregar() }, [])

  function abrirCriar() { setEditando(null); setForm(VAZIO); setErro(''); setModal(true) }
  function abrirEditar(p: Produto) {
    setEditando(p)
    setForm({ nome: p.nome, preco: p.preco, entregaveis: p.entregaveis ?? '' })
    setErro(''); setModal(true)
  }

  async function salvar() {
    if (!form.nome.trim()) { setErro('Nome é obrigatório'); return }
    if (form.preco <= 0)   { setErro('Preço deve ser maior que 0'); return }
    setSalvando(true)
    try {
      if (editando) await atualizarProduto(editando.id, form)
      else          await criarProduto(form)
      setModal(false); await carregar()
    } catch (e: any) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  async function excluir() {
    if (!excluindo) return
    setSalvando(true)
    try { await deletarProduto(excluindo.id); setExcluindo(null); await carregar() }
    finally { setSalvando(false) }
  }

  const valorCatalogo = produtos.reduce((s, p) => s + p.preco, 0)

  return (
    <div className="p-7 max-w-5xl mx-auto">
      <CabecalhoPagina
        titulo="Produtos & Serviços"
        subtitulo={`${produtos.length} serviço${produtos.length !== 1 ? 's' : ''} · Valor do catálogo: ${formatarMoeda(valorCatalogo)}`}
        acao={
          <button onClick={abrirCriar} className="btn-primario">
            <Plus size={14}/> Novo Serviço
          </button>
        }
      />

      {carregando ? <Spinner /> : produtos.length === 0 ? (
        <EstadoVazio
          icone={<Package size={22}/>}
          titulo="Nenhum serviço ainda"
          subtitulo="Defina seus serviços para vinculá-los às receitas."
          acao={<button onClick={abrirCriar} className="btn-primario"><Plus size={14}/> Novo Serviço</button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {produtos.map(p => (
            <div key={p.id} className="cartao group hover:border-[#D4AF37]/15 transition-all animate-subir">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-white">{p.nome}</h3>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => abrirEditar(p)}
                    className="p-1.5 rounded text-[#444] hover:text-white hover:bg-[#141414] transition-colors">
                    <Pencil size={13}/>
                  </button>
                  <button onClick={() => setExcluindo(p)}
                    className="p-1.5 rounded text-[#444] hover:text-red-400 hover:bg-red-950/20 transition-colors">
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="font-display text-2xl font-bold text-[#D4AF37]">
                  {formatarMoeda(p.preco)}
                </span>
                <span className="text-xs text-[#444]">/mês</span>
              </div>

              {p.entregaveis && (
                <div className="border-t border-[#141414] pt-3 mt-2">
                  <div className="flex items-start gap-1.5 text-xs text-[#555]">
                    <List size={10} className="mt-0.5 flex-shrink-0"/>
                    <span className="line-clamp-3 leading-relaxed">{p.entregaveis}</span>
                  </div>
                </div>
              )}
              <p className="text-[10px] text-[#2A2A2A] mt-3">{formatarData(p.created_at)}</p>
            </div>
          ))}
        </div>
      )}

      <Modal aberto={modal} onFechar={() => setModal(false)} titulo={editando ? 'Editar Serviço' : 'Novo Serviço'}>
        <div className="space-y-4">
          <div>
            <label className="label">Nome do Serviço *</label>
            <input className="input" placeholder="Ex: Gestão Completa de Tráfego" value={form.nome}
              onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}/>
          </div>
          <div>
            <label className="label">Preço Mensal (R$) *</label>
            <input type="number" min="0" step="0.01" className="input font-mono"
              placeholder="0,00" value={form.preco || ''}
              onChange={e => setForm(p => ({ ...p, preco: parseFloat(e.target.value) || 0 }))}/>
          </div>
          <div>
            <label className="label">Entregáveis</label>
            <textarea className="input resize-none" rows={4}
              placeholder="Liste o que está incluído neste serviço..."
              value={form.entregaveis ?? ''}
              onChange={e => setForm(p => ({ ...p, entregaveis: e.target.value }))}/>
          </div>
          {erro && <p className="text-xs text-red-400">{erro}</p>}
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModal(false)} className="btn-fantasma flex-1 justify-center">Cancelar</button>
            <button onClick={salvar} disabled={salvando} className="btn-primario flex-1 justify-center">
              {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </div>
      </Modal>

      <Confirmar
        aberto={!!excluindo} onFechar={() => setExcluindo(null)} onConfirmar={excluir}
        carregando={salvando} titulo="Excluir Serviço"
        mensagem={`Excluir "${excluindo?.nome}"? As receitas não serão afetadas.`}
      />
    </div>
  )
}
