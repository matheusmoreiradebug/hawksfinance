'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { CheckCircle2, ExternalLink, Database, Globe, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [tested, setTested] = useState<null | 'ok' | 'fail'>(null)
  const [testing, setTesting] = useState(false)

  async function testConnection() {
    setTesting(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.from('clients').select('id').limit(1)
      setTested(error ? 'fail' : 'ok')
    } catch {
      setTested('fail')
    } finally {
      setTesting(false)
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <PageHeader title="Settings" subtitle="System configuration and connections" />

      {/* Connection Card */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Database size={18} className="text-gold" />
          <h2 className="font-medium">Supabase Connection</h2>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between py-2 border-b border-hawk-border">
            <span className="text-xs text-hawk-sub">Project URL</span>
            <span className="text-xs font-mono text-white truncate max-w-xs">
              {url ? url.replace('https://', '').slice(0, 30) + '…' : 'Not configured'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-hawk-border">
            <span className="text-xs text-hawk-sub">Anon Key</span>
            <span className="text-xs font-mono text-hawk-sub">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '••••••••••••••••' : 'Not configured'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-hawk-sub">Status</span>
            {tested === 'ok'   && <span className="tag-green text-xs flex items-center gap-1"><CheckCircle2 size={10} /> Connected</span>}
            {tested === 'fail' && <span className="tag-red text-xs">Connection failed</span>}
            {tested === null   && <span className="tag-gray text-xs">Not tested</span>}
          </div>
        </div>

        <button
          onClick={testConnection}
          disabled={testing}
          className="btn-ghost text-sm w-full"
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {/* Setup Guide */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Globe size={18} className="text-gold" />
          <h2 className="font-medium">Setup Guide</h2>
        </div>

        <ol className="space-y-3 text-sm text-hawk-sub">
          {[
            { step: '1', text: 'Create a project at supabase.com' },
            { step: '2', text: 'Run supabase/schema.sql in the SQL Editor' },
            { step: '3', text: 'Copy your project URL and anon key' },
            { step: '4', text: 'Set them in .env.local as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY' },
            { step: '5', text: 'Deploy on Vercel with the same env vars' },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {step}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>

        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gold hover:underline mt-4"
        >
          Open Supabase Dashboard <ExternalLink size={13} />
        </a>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <Shield size={18} className="text-gold" />
          <h2 className="font-medium">Security Notes</h2>
        </div>
        <ul className="space-y-2 text-sm text-hawk-sub">
          <li>• Row Level Security (RLS) is enabled by default in the schema</li>
          <li>• For production, add Supabase Auth and restrict RLS policies to authenticated users</li>
          <li>• Never expose your <code className="font-mono text-xs bg-hawk-muted px-1 py-0.5 rounded">service_role</code> key on the client side</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-hawk-sub/40">Hawks Finance v1.0.0 · Built for Hawks Digital Agency</p>
      </div>
    </div>
  )
}
