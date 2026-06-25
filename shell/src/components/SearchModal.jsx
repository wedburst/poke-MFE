import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import useStore from '../store/useStore.js'
import { getPokemonId, getPokemonImage } from './PokemonCard.jsx'

const PAGE_SIZE = 30

async function fetchPokemonList({ pageParam = 0 }) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${pageParam}`)
  if (!res.ok) throw new Error('Failed to fetch')
  const data = await res.json()
  return {
    results: data.results,
    nextOffset: data.next ? pageParam + PAGE_SIZE : null,
  }
}

async function fetchPokemonByName(name) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`)
  if (!res.ok) throw new Error('Pokemon not found')
  return res.json()
}

export default function SearchModal() {
  const isSearchOpen = useStore((s) => s.isSearchOpen)
  const closeSearch = useStore((s) => s.closeSearch)
  const selectPokemon = useStore((s) => s.selectPokemon)
  const theme = useStore((s) => s.theme)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef(null)
  const sentinelRef = useRef(null)
  const isDark = theme === 'dark'

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350)
    return () => clearTimeout(t)
  }, [query])

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setDebouncedQuery('')
    }
  }, [isSearchOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeSearch() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeSearch])

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useStore.getState().openSearch()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Exact name search query
  const searchEnabled = debouncedQuery.length >= 2
  const { data: searchResult, isLoading: isSearchLoading, error: searchError } = useQuery({
    queryKey: ['pokemon-search', debouncedQuery],
    queryFn: () => fetchPokemonByName(debouncedQuery),
    enabled: searchEnabled,
    retry: false,
  })

  // Infinite list (no search)
  const {
    data: listData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isListLoading,
  } = useInfiniteQuery({
    queryKey: ['pokemon-infinite-list'],
    queryFn: fetchPokemonList,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  })

  // Intersection Observer for infinite scroll
  const observerRef = useRef(null)
  const connectObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect()
    if (!sentinelRef.current || !hasNextPage) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage() },
      { threshold: 0.1 }
    )
    observerRef.current.observe(sentinelRef.current)
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    connectObserver()
    return () => observerRef.current?.disconnect()
  }, [connectObserver])

  const handleSelect = (id, name, image) => {
    selectPokemon(id, name, image)
    closeSearch()
  }

  const allPokemons = listData?.pages.flatMap((p) => p.results) ?? []

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col animate-fade-in" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={closeSearch}
      />

      {/* Modal */}
      <div className="relative z-10 flex flex-col w-full h-full sm:h-auto sm:max-h-[85vh] sm:mt-16 sm:mx-auto sm:max-w-2xl sm:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3 px-5 py-4">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribí el nombre exacto: pikachu, charizard, mewtwo..."
              className="flex-1 text-base bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              onClick={closeSearch}
              className="hidden sm:flex px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              ESC
            </button>
          </div>
          {/* Search hint */}
          <div className="px-5 pb-3 flex items-start gap-2">
            <span className="text-yellow-500 text-xs mt-px">💡</span>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              La búsqueda es por <strong className="text-gray-600 dark:text-gray-300">nombre exacto</strong> en minúsculas.{' '}
              Ej: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">pikachu</code>,{' '}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">charizard</code>,{' '}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">mr-mime</code>.{' '}
              No funciona por fragmento.
              {query.length === 1 && (
                <span className="ml-1 text-amber-500"> Escribí al menos 2 letras para buscar.</span>
              )}
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Exact search results */}
          {searchEnabled && (
            <>
              {isSearchLoading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Buscando "<strong className="text-gray-600 dark:text-gray-300">{debouncedQuery}</strong>"...
                  </p>
                </div>
              )}
              {searchError && (
                <div className="flex flex-col items-center py-10 gap-3">
                  <span className="text-4xl">🔍</span>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    No se encontró "<strong>{debouncedQuery}</strong>"
                  </p>
                  <div className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed max-w-xs">
                    <p>Recordá que la búsqueda es exacta. Intentá con:</p>
                    <p className="mt-1 font-mono">
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">pikachu</code>{' '}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">charizard</code>{' '}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">bulbasaur</code>
                    </p>
                  </div>
                </div>
              )}
              {searchResult && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                    Resultado
                  </p>
                  <SearchResultCard pokemon={searchResult} onSelect={handleSelect} />
                </div>
              )}
            </>
          )}

          {/* Infinite list */}
          {!searchEnabled && (
            <>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                All Pokemon
              </p>
              {isListLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {allPokemons.map((pokemon) => {
                    const id = getPokemonId(pokemon.url)
                    const image = getPokemonImage(id)
                    return (
                      <button
                        key={pokemon.name}
                        onClick={() => handleSelect(id, pokemon.name, image)}
                        className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 border border-transparent hover:border-red-200 dark:hover:border-red-900 transition group"
                      >
                        <img
                          src={image}
                          alt={pokemon.name}
                          className="w-14 h-14 object-contain group-hover:scale-110 transition-transform"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                          }}
                        />
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          #{String(id).padStart(3, '0')}
                        </span>
                        <span className="text-xs font-semibold capitalize text-gray-700 dark:text-gray-300 text-center">
                          {pokemon.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="py-4 flex justify-center">
                {isFetchingNextPage && (
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                )}
                {!hasNextPage && allPokemons.length > 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">All Pokemon loaded</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SearchResultCard({ pokemon, onSelect }) {
  const id = String(pokemon.id)
  const image =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    getPokemonImage(id)
  const mainType = pokemon.types?.[0]?.type?.name

  const TYPE_COLORS = {
    fire: '#F97316', water: '#3B82F6', grass: '#22C55E', electric: '#EAB308',
    psychic: '#EC4899', ghost: '#7C3AED', dragon: '#6366F1', fighting: '#DC2626',
    poison: '#A855F7', ground: '#D97706', rock: '#78716C', ice: '#06B6D4',
    bug: '#84CC16', normal: '#9CA3AF', dark: '#374151', steel: '#94A3B8',
    fairy: '#F472B6', flying: '#38BDF8',
  }

  return (
    <button
      onClick={() => onSelect(id, pokemon.name, image)}
      className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 border border-transparent hover:border-red-200 dark:hover:border-red-900 transition text-left"
    >
      <img src={image} alt={pokemon.name} className="w-16 h-16 object-contain" />
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500">#{String(id).padStart(3, '0')}</p>
        <p className="text-lg font-bold capitalize text-gray-900 dark:text-white">{pokemon.name}</p>
        <div className="flex gap-2 mt-1">
          {pokemon.types?.map(({ type }) => (
            <span
              key={type.name}
              className="px-2 py-0.5 rounded-full text-white text-xs font-semibold capitalize"
              style={{ backgroundColor: TYPE_COLORS[type.name] || '#9CA3AF' }}
            >
              {type.name}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
