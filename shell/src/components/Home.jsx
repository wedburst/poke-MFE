import React from 'react'
import { useQuery } from '@tanstack/react-query'
import useStore from '../store/useStore.js'
import Navbar from './Navbar.jsx'
import PokemonCard, { getPokemonId, getPokemonImage } from './PokemonCard.jsx'
import SearchModal from './SearchModal.jsx'
import DetailPanel from './DetailPanel.jsx'
import HistorySection from './HistorySection.jsx'

const CATEGORIES = [
  { id: 'fire', label: 'Fire', emoji: '🔥' },
  { id: 'water', label: 'Water', emoji: '💧' },
  { id: 'grass', label: 'Grass', emoji: '🌿' },
  { id: 'electric', label: 'Electric', emoji: '⚡' },
  { id: 'psychic', label: 'Psychic', emoji: '🔮' },
  { id: 'ghost', label: 'Ghost', emoji: '👻' },
  { id: 'dragon', label: 'Dragon', emoji: '🐉' },
  { id: 'fighting', label: 'Fighting', emoji: '🥊' },
  { id: 'ice', label: 'Ice', emoji: '❄️' },
  { id: 'poison', label: 'Poison', emoji: '☠️' },
]

const TYPE_COLORS = {
  fire: '#F97316', water: '#3B82F6', grass: '#22C55E', electric: '#EAB308',
  psychic: '#EC4899', ghost: '#7C3AED', dragon: '#6366F1', fighting: '#DC2626',
  poison: '#A855F7', ground: '#D97706', rock: '#78716C', ice: '#06B6D4',
  bug: '#84CC16', normal: '#9CA3AF', dark: '#374151', steel: '#94A3B8',
  fairy: '#F472B6', flying: '#38BDF8',
}

async function fetchPokemonByType(type) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
  if (!res.ok) throw new Error('Failed to fetch')
  const data = await res.json()
  return data.pokemon.slice(0, 10).map(({ pokemon }) => pokemon)
}

function PokemonGrid({ category }) {
  const selectPokemon = useStore((s) => s.selectPokemon)
  const typeColor = TYPE_COLORS[category]

  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemon-type', category],
    queryFn: () => fetchPokemonByType(category),
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-gray-100 dark:bg-gray-800 h-36 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-500 dark:text-gray-400">
        <span className="text-3xl">⚠️</span>
        <p className="text-sm">Failed to load {category} Pokemon</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
      {data?.map((pokemon) => (
        <PokemonCard
          key={pokemon.name}
          name={pokemon.name}
          url={pokemon.url}
          typeColor={typeColor}
          onClick={(id, name, image) => selectPokemon(id, name, image)}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const selectedCategory = useStore((s) => s.selectedCategory)
  const setSelectedCategory = useStore((s) => s.setSelectedCategory)

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory)
  const typeColor = TYPE_COLORS[selectedCategory] || '#9CA3AF'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Explore Pokemon
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
            Browse by type or search for a specific Pokemon
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-md shadow-black/10'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                style={isActive ? { backgroundColor: TYPE_COLORS[cat.id] } : {}}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Pokemon grid for selected category */}
        <section className="mt-6">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: typeColor }}
            />
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
              {activeCategory?.emoji} {activeCategory?.label} Type
            </h2>
          </div>
          <PokemonGrid category={selectedCategory} />
        </section>

        {/* MF2: History */}
        <HistorySection />
      </main>

      {/* Overlays */}
      <SearchModal />
      <DetailPanel />
    </div>
  )
}
