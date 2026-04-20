'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users, Mail, FileText } from 'lucide-react'
import { PageHeader }    from '@/components/layout/PageHeader'
import { Modal }         from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState }    from '@/components/ui/EmptyState'
import { Spinner }       from '@/components/ui/Spinner'
import { getClients, createClient, updateClient, deleteClient } from '@/lib/queries'
import { formatDate }    from '@/lib/utils'
import type { Client, ClientForm } from '@/types'

const EMPTY: ClientForm = { name: '', contact: '', notes: '' }

export default function ClientsPage() {
  const [clients,  setClients]  = useState<Client[]>([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState<Client | null>(null)
  const [deleting, setDeleting] = useState<Client | null>(null)
  const [form,     setForm]     = useState<ClientForm>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  async function load() {
    setLoading(true)
    try { setClients(await getClients()) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setError('')
    setModal(true)
  }

  function openEdit(c: Client) {
    setEditing(c)
    setForm({ name: c.name, contact: c.contact ?? '', notes: c.notes ?? '' })
    setError('')
    setModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    try {
      if (editing) await updateClient(editing.id, form)
      else         await createClient(form)
      setModal(false)
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleting) return
    setSaving(true)
    try {
      await deleteClient(deleting.id)
      setDeleting(null)
      await load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} client${clients.length !== 1 ? 's' : ''} registered`}
        action={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} />
            New Client
          </button>
        }
      />

      {loading ? (
        <Spinner />
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<Users size={24} />}
          title="No clients yet"
          subtitle="Add your first client to start tracking revenues."
          action={
            <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={14} /> New Client
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {clients.map(client => (
            <div
              key={client.id}
              className="card-sm flex items-start justify-between gap-4 hover:border-hawk-muted transition-colors animate-fade-up"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white mb-1">{client.name}</p>
                {client.contact && (
                  <div className="flex items-center gap-1.5 text-sm text-hawk-sub mb-1">
                    <Mail size={12} />
                    {client.contact}
                  </div>
                )}
                {client.notes && (
                  <div className="flex items-start gap-1.5 text-xs text-hawk-sub mt-1">
                    <FileText size={11} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{client.notes}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-hawk-sub">{formatDate(client.created_at)}</span>
                <button
                  onClick={() => openEdit(client)}
                  className="p-1.5 rounded-lg text-hawk-sub hover:text-white hover:bg-hawk-muted transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleting(client)}
                  className="p-1.5 rounded-lg text-hawk-sub hover:text-hawk-danger hover:bg-hawk-danger/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit Client' : 'New Client'}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              className="input"
              placeholder="Client name"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Contact (email / phone)</label>
            <input
              className="input"
              placeholder="contact@example.com"
              value={form.contact ?? ''}
              onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Any notes about this client..."
              value={form.notes ?? ''}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            />
          </div>

          {error && <p className="text-xs text-hawk-danger">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-ghost flex-1 text-sm">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 text-sm">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete Client"
        message={`Delete "${deleting?.name}"? Associated revenues will lose their client link.`}
      />
    </div>
  )
}
