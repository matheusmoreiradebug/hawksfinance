'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users, Mail, FileText, TrendingUp, DollarSign } from 'lucide-react'
import { CabecalhoPagina, Modal, Confirmar, EstadoVazio, Spinner, Toggle } from '@/components/ui/index'
import { getClientes, criarCliente, atualizarCliente, deletarCliente, getLucratividadeClientes } from '@/lib/queries'
import { formatarMoeda, formatarData, STATUS_CONFIG, calcularStatusCliente } from '@/lib/utils'
import type { Cliente, ClienteForm, LucratividadeCliente } from '@/types'

const VAZIO: ClienteForm = { nome: '', contato: '', notas: '', custo_estimado: 0 }

export default function PaginaClientes() {
  const [clientes,  setClientes]  = useState<Cliente[]>([])
  const [lucrat,    setLucrat]    = useState<LucratividadeCliente[]>([])
  const [carregando, setCarreg]   = useState(true)
  const [modal,     setModal]     = useState(false)
  const [editando,  setEditando]  = useState<Cliente | null>(null)
  const [excluindo, setExcluindo] = useState<Cliente | null>(null)
  const [form,      setForm]      = useState<ClienteForm>(VAZIO)
  const [salvando,  setSalvando]  = useState(false)
  const [erro,      setErro]      = useState('')
  const [vistaLucr, setVistaLucr] = useState(false)

  async function carregar() {
    setCarreg(true)
    try {
      const [c, l] = await Promise.all([getClientes(), getLucratividadeClientes()])
      setClientes(c); setLucrat(l)
    } finally { setCarreg(false) }
  }

  useEffect(() => { carregar() }, [])

  function abrirCriar() { setEditando(null); setForm(VAZIO); setErro(''); setModal(true) }
  function abrirEditar(c: Cliente) {
    setEditando(c)
    setForm({ nome: c.nome, contato: c.contato ?? '', notas: c.notas ?? '', custo_estimado: c.custo_estimado ?? 0 })
    setErro(''); setModal(true)
  }

  async function salvar() {
    if (!form.nome.trim()) { setErro('Nome é obrigatório'); return }
    setSalvando(true)
    try {
      if (editando) await atualizarCliente(editando.id, form)
      else          await criarCliente(form)
      setModal(false); await carregar()
    } catch (e: any) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  async function excluir() {
    if (!excluindo) return
    setSalvando(true)
    try { await deletarCliente(excluindo.id); setExcluindo(null); await carregar() }
    finally { setSalvando(false) }
  }

  // Mapa de lucratividade por cliente ID
  const mapaLucr = lucrat.reduce<Record<string, LucratividadeCliente>>(
    (acc, l) => { acc[l.id] = l; return acc }, {}
  )

  return (
    <div className="p-7 max-w-4xl mx-auto">
      <CabecalhoPagina
        titulo="Clientes"
        subtitulo={`${clientes.length} cliente${clientes.length !== 1 ? 's' : ''} cadastrado${clientes.length !== 1 ? 's' : ''}`}
        acao={
          <div className="flex items-center gap-3">
            <Toggle
              ativo={vistaLucr}
              onChange={() => setVistaLucr(p => !p)}
              rotulo="Ver lucratividade"
            />
            <button onClick={abrirCriar} className="btn-primario">
              <Plus size={14}/> Novo Cliente
            </button>
          </div>
        }
      />

      {carregando ? <Spinner /> : clientes.length === 0 ? (
        <EstadoVazio
          icone={<Users size={22}/>}
          titulo="Nenhum cliente ainda"
          subtitulo="Adicione seu primeiro cliente para começar a rastrear receitas."
          acao={<button onClick={abrirCriar} className="btn-primario"><Plus size={14}/> Novo Cliente</button>}
        />
      ) : (
        <div className="space-y-2">
          {clientes.map(cliente => {
            const lucr = mapaLucr[cliente.id]
            const status = lucr
              ? calcularStatusCliente(lucr.receita_total, Number(cliente.custo_estimado ?? 0))
              : null
            const cfg = status ? STATUS_CONFIG[status] : null

            return (
              <div
                key={cliente.id}
                className="cartao-sm flex items-start justify-between gap-4 hover:border-[#252525] transition-colors animate-subir"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-white">{cliente.nome}</p>
                    {cfg && (
                      <span className={`tag text-[10px] ${
                        status === 'lucrativo' ? 'tag-verde' :
                        status === 'margem_baixa' ? 'tag-amarelo' : 'tag-vermelho'
                      }`}>{cfg.label}</span>
                    )}
                  </div>

                  {cliente.contato && (
                    <div className="flex items-center gap-1.5 text-xs text-[#555] mb-1">
                      <Mail size={11}/>{cliente.contato}
                    </div>
                  )}
                  {cliente.notas && (
                    <div className="flex items-start gap-1.5 text-xs text-[#444] mt-1">
                      <FileText size={10} className="mt-0.5 flex-shrink-0"/>
                      <span className="line-clamp-1">{cliente.notas}</span>
                    </div>
                  )}

                  {/* Vista de lucratividade */}
                  {vistaLucr && lucr && (
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-[#141414]">
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-wider">Receita total</p>
                        <p className="text-xs font-mono text-[#00C48C]">{formatarMoeda(lucr.receita_total)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-wider">Custo est.</p>
                        <p className="text-xs font-mono text-red-400">{formatarMoeda(Number(cliente.custo_estimado ?? 0))}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-wider">Lucro cliente</p>
                        <p className={`text-xs font-mono ${lucr.lucro_cliente >= 0 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                          {formatarMoeda(lucr.lucro_cliente)}
                        </p>
                      </div>
                      {lucr.receita_total > 0 && (
                        <div>
                          <p className="text-[9px] text-[#444] uppercase tracking-wider">Margem</p>
                          <p className={`text-xs font-mono ${lucr.margem_pct >= 20 ? 'text-[#00C48C]' : lucr.margem_pct >= 0 ? 'text-[#F5A623]' : 'text-red-400'}`}>
                            {lucr.margem_pct.toFixed(1)}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-[#333]">{formatarData(cliente.created_at)}</span>
                  <button onClick={() => abrirEditar(cliente)}
                    className="p-1.5 rounded-lg text-[#444] hover:text-white hover:bg-[#141414] transition-colors">
                    <Pencil size={13}/>
                  </button>
                  <button onClick={() => setExcluindo(cliente)}
                    className="p-1.5 rounded-lg text-[#444] hover:text-red-400 hover:bg-red-950/20 transition-colors">
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal aberto={modal} onFechar={() => setModal(false)} titulo={editando ? 'Editar Cliente' : 'Novo Cliente'}>
        <div className="space-y-4">
          <div>
            <label className="label">Nome *</label>
            <input className="input" placeholder="Nome do cliente" value={form.nome}
              onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}/>
          </div>
          <div>
            <label className="label">Contato</label>
            <input className="input" placeholder="email@empresa.com ou telefone" value={form.contato ?? ''}
              onChange={e => setForm(p => ({ ...p, contato: e.target.value }))}/>
          </div>
          <div>
            <label className="label">Custo Estimado Mensal (R$)</label>
            <input type="number" min="0" step="0.01" className="input font-mono"
              placeholder="0,00" value={form.custo_estimado || ''}
              onChange={e => setForm(p => ({ ...p, custo_estimado: parseFloat(e.target.value) || 0 }))}/>
            <p className="text-[10px] text-[#444] mt-1">Usado para calcular lucratividade por cliente</p>
          </div>
          <div>
            <label className="label">Notas</label>
            <textarea className="input resize-none" rows={3} placeholder="Observações sobre este cliente..."
              value={form.notas ?? ''}
              onChange={e => setForm(p => ({ ...p, notas: e.target.value }))}/>
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
        carregando={salvando} titulo="Excluir Cliente"
        mensagem={`Excluir "${excluindo?.nome}"? As receitas vinculadas perderão a referência.`}
      />
    </div>
  )
}
