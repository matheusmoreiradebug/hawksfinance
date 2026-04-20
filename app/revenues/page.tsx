'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, TrendingUp, RefreshCw } from 'lucide-react'
import { PageHeader }    from '@/components/layout/PageHeader'
import { Modal }         from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState }    from '@/components/ui/EmptyState'
import { Spinner }       from '@/components/ui/Spinner'
import {
  getRevenues, getClients, getProducts,
  createRevenue, updateRevenue, deleteRevenue,
} from '@/lib/queries'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Revenue, RevenueForm, Client, Product } from '@/types'

const EMPTY: RevenueForm = {
  client_id:   null,
  product_id:  null,
  amount:      0,
  date:        new Date().toISOString().slice(0, 10),
  recurring:   false,
  description: '',
}

export default function RevenuesPage() {
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [clients,  setClients]  = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState<Revenue | null>(null)
  const [deleting, setDeleting] = useState<Revenue | null>(null)
  const [form,     setForm]     = useState<RevenueForm>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  async function load() {
    setLoading(true)
    try {
      const [r, c, p] = await Promise.all([getRevenues(), getClients(), getProducts()])
      setRevenues(r); setClients(c); setProducts(p)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null); setForm(EMPTY); setError(''); setModal(true)
  }

  function openEdit(r: Revenue) {
    setEditing(r)
    setForm({
      client_id:   r.client_id,
      product_id:  r.product_id,
      amount:      r.amount,
      date:        r.date,
      recurring:   r.recurring,
      description: r.description ?? '',
    })
    setError(''); setModal(true)
  }

  function handleProductChange(productId: string) {
    const product = products.find(p => p.id === productId)
    setForm(prev => ({
      ...prev,
      product_id: productId || null,
      amount: product ? product.price : prev.amount,
    }))
  }

  async function handleSave() {
    if (form.amount <= 0) { setError('Amount must be greater than 0'); return }
    if (!form.date)       { setError('Date is required'); return }
    setSaving(true)
    try {
      if (editing) await updateRevenue(editing.id, form)
      else         await createRevenue(form)
      setModal(false); await load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!deleting) return
    setSaving(true)
    try { await deleteRevenue(deleting.id); setDeleting(null); await load() }
    finally { setSaving(false) }
  }

  const total = revenues.reduce((s, r) => s + Number(r.amount), 0)
  const recurring = revenues.filter(r => r.recurring).reduce((s, r) => s + Number(r.amount), 0)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Revenues"
        subtitle={`${revenues.length} entries · ${formatCurrency(recurring)} recurring/mo`}
        action={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> Add Revenue
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Revenue',    value: total,                color: 'text-gold' },
          { label: 'Recurring / mo',   value: recurring,            color: 'text-hawk-success' },
          { label: 'One-time',         value: total - recurring,    color: 'text-hawk-sub' },
        ].map(s => (
          <div key={s.label} className="card-sm">
            <p className="label">{s.label}</p>
            <p className={`font-display text-xl font-bold ${s.color}`}>{formatCurrency(s.value)}</p>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : revenues.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={24} />}
          title="No revenues yet"
          subtitle="Record your first revenue to start tracking."
          action={
            <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={14} /> Add Revenue
            </button>
          }
        />
      ) : (
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-hawk-sub uppercase tracking-wider">
            <span className="col-span-3">Client</span>
            <span className="col-span-3">Product</span>
            <span className="col-span-2">Date</span>
            <span className="col-span-2 text-right">Amount</span>
            <span className="col-span-1 text-center">Rec.</span>
            <span className="col-span-1" />
          </div>

          {revenues.map(rev => (
            <div
              key={rev.id}
              className="grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-lg bg-hawk-surface border border-hawk-border hover:border-hawk-muted transition-colors animate-fade-up group"
            >
              <span className="col-span-3 text-sm truncate">
                {rev.client?.name ?? <span className="text-hawk-sub italic">No client</span>}
              </span>
              <span className="col-span-3 text-sm text-hawk-sub truncate">
                {rev.product?.name ?? rev.description ?? <span className="italic">—</span>}
              </span>
              <span className="col-span-2 text-sm text-hawk-sub">{formatDate(rev.date)}</span>
              <span className="col-span-2 text-right font-mono font-medium text-hawk-success">
                +{formatCurrency(Number(rev.amount))}
              </span>
              <span className="col-span-1 flex justify-center">
                {rev.recurring && <span className="tag-gold text-[10px]">rec</span>}
              </span>
              <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(rev)} className="p-1 rounded text-hawk-sub hover:text-white">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleting(rev)} className="p-1 rounded text-hawk-sub hover:text-hawk-danger">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit Revenue' : 'Add Revenue'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Client</label>
              <select
                className="input"
                value={form.client_id ?? ''}
                onChange={e => setForm(p => ({ ...p, client_id: e.target.value || null }))}
              >
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Product / Service</label>
              <select
                className="input"
                value={form.product_id ?? ''}
                onChange={e => handleProductChange(e.target.value)}
              >
                <option value="">No product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount (R$) *</label>
              <input
                type="number" min="0" step="0.01"
                className="input font-mono"
                placeholder="0.00"
                value={form.amount || ''}
                onChange={e => setForm(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="label">Date *</label>
              <input
                type="date"
                className="input"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="label">Description (optional)</label>
            <input
              className="input"
              placeholder="Extra notes about this revenue"
              value={form.description ?? ''}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setForm(p => ({ ...p, recurring: !p.recurring }))}
              className={`w-9 h-5 rounded-full transition-colors ${form.recurring ? 'bg-gold' : 'bg-hawk-muted'} relative`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.recurring ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-hawk-sub">Recurring monthly</span>
          </label>

          {error && <p className="text-xs text-hawk-danger">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-ghost flex-1 text-sm">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 text-sm">
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Revenue'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete Revenue"
        message={`Delete this revenue of ${formatCurrency(Number(deleting?.amount ?? 0))}? This cannot be undone.`}
      />
    </div>
  )
}
