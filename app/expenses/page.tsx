'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Receipt, Megaphone, Wrench, MoreHorizontal } from 'lucide-react'
import { PageHeader }    from '@/components/layout/PageHeader'
import { Modal }         from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState }    from '@/components/ui/EmptyState'
import { Spinner }       from '@/components/ui/Spinner'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '@/lib/queries'
import { formatCurrency, formatDate, categoryLabel, EXPENSE_CATEGORIES } from '@/lib/utils'
import type { Expense, ExpenseForm } from '@/types'

const EMPTY: ExpenseForm = {
  category:    'other',
  description: '',
  amount:      0,
  date:        new Date().toISOString().slice(0, 10),
  recurring:   false,
}

const CAT_ICONS = {
  traffic: Megaphone,
  tools:   Wrench,
  other:   MoreHorizontal,
}

const CAT_COLORS = {
  traffic: 'text-gold border-gold/30 bg-gold/10',
  tools:   'text-blue-400 border-blue-400/30 bg-blue-400/10',
  other:   'text-hawk-sub border-hawk-border bg-hawk-muted',
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState<Expense | null>(null)
  const [deleting, setDeleting] = useState<Expense | null>(null)
  const [form,     setForm]     = useState<ExpenseForm>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [filter,   setFilter]   = useState<string>('all')

  async function load() {
    setLoading(true)
    try { setExpenses(await getExpenses()) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null); setForm(EMPTY); setError(''); setModal(true)
  }
  function openEdit(e: Expense) {
    setEditing(e)
    setForm({ category: e.category, description: e.description, amount: e.amount, date: e.date, recurring: e.recurring })
    setError(''); setModal(true)
  }

  async function handleSave() {
    if (!form.description.trim()) { setError('Description is required'); return }
    if (form.amount <= 0)         { setError('Amount must be greater than 0'); return }
    setSaving(true)
    try {
      if (editing) await updateExpense(editing.id, form)
      else         await createExpense(form)
      setModal(false); await load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!deleting) return
    setSaving(true)
    try { await deleteExpense(deleting.id); setDeleting(null); await load() }
    finally { setSaving(false) }
  }

  const filtered = filter === 'all' ? expenses : expenses.filter(e => e.category === filter)
  const total    = filtered.reduce((s, e) => s + Number(e.amount), 0)

  const byCategory = EXPENSE_CATEGORIES.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.value).reduce((s, e) => s + Number(e.amount), 0),
  }))

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Expenses"
        subtitle={`${expenses.length} entries · Total ${formatCurrency(expenses.reduce((s, e) => s + Number(e.amount), 0))}`}
        action={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> Add Expense
          </button>
        }
      />

      {/* Category Breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {byCategory.map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilter(filter === cat.value ? 'all' : cat.value)}
            className={`card-sm text-left transition-all hover:border-gold/30 ${filter === cat.value ? 'border-gold/40' : ''}`}
          >
            <p className="label">{cat.label}</p>
            <p className="font-display text-xl font-bold text-white">{formatCurrency(cat.total)}</p>
            {filter === cat.value && <span className="text-[10px] text-gold mt-1 block">Filtered ×</span>}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState
          icon={<Receipt size={24} />}
          title="No expenses found"
          subtitle={filter !== 'all' ? 'No expenses in this category.' : 'Add your first expense.'}
          action={
            <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={14} /> Add Expense
            </button>
          }
        />
      ) : (
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-hawk-sub uppercase tracking-wider">
            <span className="col-span-2">Category</span>
            <span className="col-span-4">Description</span>
            <span className="col-span-2">Date</span>
            <span className="col-span-2 text-right">Amount</span>
            <span className="col-span-1 text-center">Rec.</span>
            <span className="col-span-1" />
          </div>

          {filtered.map(expense => {
            const Icon = CAT_ICONS[expense.category]
            return (
              <div
                key={expense.id}
                className="grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-lg bg-hawk-surface border border-hawk-border hover:border-hawk-muted transition-colors animate-fade-up group"
              >
                <div className="col-span-2">
                  <span className={`tag flex items-center gap-1 w-fit text-[10px] ${CAT_COLORS[expense.category]}`}>
                    <Icon size={9} />
                    {categoryLabel(expense.category)}
                  </span>
                </div>
                <span className="col-span-4 text-sm truncate">{expense.description}</span>
                <span className="col-span-2 text-sm text-hawk-sub">{formatDate(expense.date)}</span>
                <span className="col-span-2 text-right font-mono font-medium text-hawk-danger">
                  -{formatCurrency(Number(expense.amount))}
                </span>
                <span className="col-span-1 flex justify-center">
                  {expense.recurring && <span className="tag-gray text-[10px]">rec</span>}
                </span>
                <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(expense)} className="p-1 rounded text-hawk-sub hover:text-white">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleting(expense)} className="p-1 rounded text-hawk-sub hover:text-hawk-danger">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}

          {/* Total row */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-hawk-border mt-2">
            <span className="text-sm text-hawk-sub">{filtered.length} items</span>
            <span className="font-mono font-semibold text-hawk-danger">{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Expense' : 'Add Expense'}>
        <div className="space-y-4">
          <div>
            <label className="label">Category *</label>
            <div className="grid grid-cols-3 gap-2">
              {EXPENSE_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setForm(p => ({ ...p, category: cat.value as any }))}
                  className={`py-2 rounded-lg border text-sm transition-colors ${
                    form.category === cat.value
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-hawk-border text-hawk-sub hover:border-hawk-muted'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Description *</label>
            <input
              className="input"
              placeholder="e.g. Google Ads — Client X"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
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
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Expense'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete Expense"
        message={`Delete "${deleting?.description}"? This cannot be undone.`}
      />
    </div>
  )
}
