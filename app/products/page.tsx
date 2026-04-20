'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Package, DollarSign, List } from 'lucide-react'
import { PageHeader }    from '@/components/layout/PageHeader'
import { Modal }         from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState }    from '@/components/ui/EmptyState'
import { Spinner }       from '@/components/ui/Spinner'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/queries'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Product, ProductForm } from '@/types'

const EMPTY: ProductForm = { name: '', price: 0, deliverables: '' }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [form,     setForm]     = useState<ProductForm>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  async function load() {
    setLoading(true)
    try { setProducts(await getProducts()) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null); setForm(EMPTY); setError(''); setModal(true)
  }
  function openEdit(p: Product) {
    setEditing(p)
    setForm({ name: p.name, price: p.price, deliverables: p.deliverables ?? '' })
    setError(''); setModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Name is required'); return }
    if (form.price <= 0)   { setError('Price must be greater than 0'); return }
    setSaving(true)
    try {
      if (editing) await updateProduct(editing.id, form)
      else         await createProduct(form)
      setModal(false); await load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!deleting) return
    setSaving(true)
    try { await deleteProduct(deleting.id); setDeleting(null); await load() }
    finally { setSaving(false) }
  }

  const totalMRR = products.reduce((s, p) => s + p.price, 0)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Products & Services"
        subtitle={`${products.length} service${products.length !== 1 ? 's' : ''} · Catalog value ${formatCurrency(totalMRR)}`}
        action={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> New Product
          </button>
        }
      />

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Package size={24} />}
          title="No products yet"
          subtitle="Define your services to link them to revenues."
          action={
            <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={14} /> New Product
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map(product => (
            <div
              key={product.id}
              className="card hover:border-gold/20 transition-colors animate-fade-up group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-white">{product.name}</h3>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(product)}
                    className="p-1.5 rounded text-hawk-sub hover:text-white hover:bg-hawk-muted transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleting(product)}
                    className="p-1.5 rounded text-hawk-sub hover:text-hawk-danger hover:bg-hawk-danger/10 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                <DollarSign size={14} className="text-gold" />
                <span className="font-display text-xl font-semibold text-gold">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs text-hawk-sub">/month</span>
              </div>

              {product.deliverables && (
                <div className="border-t border-hawk-border pt-3 mt-3">
                  <div className="flex items-start gap-1.5 text-xs text-hawk-sub">
                    <List size={11} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-3">{product.deliverables}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-hawk-sub/40 mt-3">{formatDate(product.created_at)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit Service' : 'New Service'}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Service Name *</label>
            <input
              className="input"
              placeholder="e.g. Full Traffic Management"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Monthly Price (R$) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input font-mono"
              placeholder="0.00"
              value={form.price || ''}
              onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <label className="label">Deliverables</label>
            <textarea
              className="input resize-none"
              rows={4}
              placeholder="List what's included in this service..."
              value={form.deliverables ?? ''}
              onChange={e => setForm(p => ({ ...p, deliverables: e.target.value }))}
            />
          </div>

          {error && <p className="text-xs text-hawk-danger">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-ghost flex-1 text-sm">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 text-sm">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete Product"
        message={`Delete "${deleting?.name}"? This won't delete associated revenues.`}
      />
    </div>
  )
}
