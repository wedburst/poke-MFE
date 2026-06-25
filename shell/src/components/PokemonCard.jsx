import React from 'react'

const TYPE_COLORS = {
  fire: '#F97316', water: '#3B82F6', grass: '#22C55E', electric: '#EAB308',
  psychic: '#EC4899', ghost: '#7C3AED', dragon: '#6366F1', fighting: '#DC2626',
  poison: '#A855F7', ground: '#D97706', rock: '#78716C', ice: '#06B6D4',
  bug: '#84CC16', normal: '#9CA3AF', dark: '#374151', steel: '#94A3B8',
  fairy: '#F472B6', flying: '#38BDF8',
}

export const getPokemonId = (url) => {
  if (!url) return null
  const parts = url.replace(/\/$/, '').split('/')
  return parts[parts.length - 1]
}

export const getPokemonImage = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

export default function PokemonCard({ name, url, typeColor, onClick }) {
  const id = getPokemonId(url)
  const image = getPokemonImage(id)

  return (
    <button
      onClick={() => onClick && onClick(id, name, image)}
      className="group relative flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-gray-900 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200"
        style={{ backgroundColor: typeColor || '#9CA3AF' }}
      />

      {/* Image */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' +
              id + '.png'
          }}
        />
      </div>

      {/* Info */}
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
        #{String(id).padStart(3, '0')}
      </p>
      <p className="text-sm font-bold capitalize text-gray-800 dark:text-gray-200 text-center">
        {name}
      </p>
    </button>
  )
}
