'use client'

import { useState } from 'react'
import { CabecalhoPagina } from '@/components/ui/index'
import { CheckCircle2, ExternalLink, Database, Globe, Shield, Zap } from 'lucide-react'

export default function PaginaConfiguracoes() {
  const [testado,   setTestado]   = useState<null | 'ok' | 'falha'>(null)
  const [testando,  setTestando]  = useState(false)

  async function testarConexao() {
    setTestando(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.from('clientes').select('id').limit(1)
      setTestado(error ? 'falha' : 'ok')
    } catch { setTestado('falha') }
    finally { setTestando(false) }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <div className="p-7 max-w-2xl mx-auto">
      <CabecalhoPagina titulo="Configurações" subtitulo="Configuração do sistema e integrações" />

      {/* Conexão */}
      <div className="cartao mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
            <Database size={15} className="text-[#D4AF37]"/>
          </div>
          <h2 className="font-medium text-white">Conexão Supabase</h2>
        </div>

        <div className="space-y-1 mb-5">
          {[
            { r: 'URL do Projeto', v: url ? url.replace('https://', '').slice(0, 32) + '…' : 'Não configurado' },
            { r: 'Chave Anon',     v: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '••••••••••••••••' : 'Não configurada' },
          ].map(row => (
            <div key={row.r} className="flex items-center justify-between py-2.5 border-b border-[#141414] last:border-0">
              <span className="text-xs text-[#555]">{row.r}</span>
              <span className="text-xs font-mono text-white truncate max-w-[220px]">{row.v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs text-[#555]">Status</span>
            {testado === 'ok'   && <span className="tag-verde text-[10px] flex items-center gap-1"><CheckCircle2 size={9}/> Conectado</span>}
            {testado === 'falha' && <span className="tag-vermelho text-[10px]">Falha na conexão</span>}
            {testado === null   && <span className="tag-cinza text-[10px]">Não testado</span>}
          </div>
        </div>

        <button onClick={testarConexao} disabled={testando} className="btn-fantasma w-full justify-center">
          {testando ? 'Testando...' : 'Testar Conexão'}
        </button>
      </div>

      {/* Guia de configuração */}
      <div className="cartao mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
            <Globe size={15} className="text-[#D4AF37]"/>
          </div>
          <h2 className="font-medium text-white">Guia de Configuração</h2>
        </div>

        <ol className="space-y-3">
          {[
            'Crie um projeto em supabase.com',
            'Execute supabase/schema.sql no SQL Editor',
            'Copie a URL do projeto e a chave anon',
            'Defina as variáveis em .env.local',
            'Deploy no Vercel com as mesmas variáveis de ambiente',
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                {i + 1}
              </span>
              <span className="text-sm text-[#666]">{text}</span>
            </li>
          ))}
        </ol>

        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-[#D4AF37] hover:underline mt-5">
          Abrir Dashboard Supabase <ExternalLink size={12}/>
        </a>
      </div>

      {/* Funcionalidades v2 */}
      <div className="cartao mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
            <Zap size={15} className="text-[#D4AF37]"/>
          </div>
          <h2 className="font-medium text-white">Funcionalidades v2</h2>
        </div>
        <ul className="space-y-2">
          {[
            'Sistema de alertas inteligentes em tempo real',
            'Lucratividade por cliente com badge de status',
            'Previsão de caixa para 12 meses',
            'Inteligência de despesas por categoria',
            'Cálculo de dias até o caixa zerar',
            'Receitas com intervalo de recorrência (mensal / semanal / anual)',
            'Interface completa em Português do Brasil',
          ].map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#666]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 flex-shrink-0"/>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Segurança */}
      <div className="cartao">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
            <Shield size={15} className="text-[#D4AF37]"/>
          </div>
          <h2 className="font-medium text-white">Segurança</h2>
        </div>
        <ul className="space-y-2 text-sm text-[#555]">
          <li>• Row Level Security (RLS) ativado por padrão no schema</li>
          <li>• Para produção, adicione Supabase Auth e restrinja as políticas RLS</li>
          <li>• Nunca exponha a chave <code className="font-mono text-xs bg-[#141414] px-1.5 py-0.5 rounded">service_role</code> no lado cliente</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-[#222]">Hawks Finance v2.0.0 · Sistema de Controle Financeiro</p>
      </div>
    </div>
  )
}
