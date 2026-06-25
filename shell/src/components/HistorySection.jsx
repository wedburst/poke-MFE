import React, { Suspense, lazy } from 'react'
import useStore from '../store/useStore.js'

const PokemonHistory = lazy(() => import('mf_history/PokemonHistory'))

class HistoryErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
          History module unavailable. Make sure mf-history is running on port 3002.
        </p>
      )
    }
    return this.props.children
  }
}

export default function HistorySection() {
  const theme = useStore((s) => s.theme)
  const selectPokemon = useStore((s) => s.selectPokemon)

  const handleSelect = (name) => {
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${name}.png`
    selectPokemon(name, name, image)
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
        <span className="text-xl">🕓</span>
        Visit History
        <span className="ml-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          MF2
        </span>
      </h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        <HistoryErrorBoundary>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <PokemonHistory theme={theme} onSelect={handleSelect} />
          </Suspense>
        </HistoryErrorBoundary>
      </div>
    </section>
  )
}
