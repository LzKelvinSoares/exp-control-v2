export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 text-slate-700 px-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center">
        <span className="text-3xl font-bold text-emerald-400">E</span>
      </div>
      <h1 className="text-2xl font-bold">Sem conexão</h1>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        Você está offline. Verifique sua conexão e tente novamente.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}
