import React, { Suspense, lazy, useEffect } from 'react'
import useStore from '../store/useStore.js'

const PokemonDetail = lazy(() => import('mf_detail/PokemonDetail'))

function ErrorFallback({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
        Could not load detail module.
        <br />Make sure mf-detail is running on port 3001.
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Retry
      </button>
    </div>
  )
}

class DetailErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />
    }
    return this.props.children
  }
}

export default function DetailPanel() {
  const selectedPokemonId = useStore((s) => s.selectedPokemonId)
  const selectedPokemonName = useStore((s) => s.selectedPokemonName)
  const clearSelectedPokemon = useStore((s) => s.clearSelectedPokemon)
  const theme = useStore((s) => s.theme)

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && clearSelectedPokemon()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [clearSelectedPokemon])

  if (!selectedPokemonId) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 animate-fade-in"
        onClick={clearSelectedPokemon}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 capitalize">
            {selectedPokemonName || 'Pokemon Detail'}
          </h2>
          <button
            onClick={clearSelectedPokemon}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* MF1 Content */}
        <div className="flex-1 overflow-y-auto">
          <DetailErrorBoundary key={selectedPokemonId}>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Loading detail...</span>
                  </div>
                </div>
              }
            >
              <PokemonDetail pokemonId={selectedPokemonId} theme={theme} />
            </Suspense>
          </DetailErrorBoundary>
        </div>
      </div>
    </>
  )
}
