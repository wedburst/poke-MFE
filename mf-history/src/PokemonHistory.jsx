import React, { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'pokemon_history'

const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const PokemonHistory = ({ theme = 'light', onSelect }) => {
  const [history, setHistory] = useState(getHistory)
  const isDark = theme === 'dark'

  const refresh = useCallback(() => setHistory(getHistory()), [])

  useEffect(() => {
    const handler = (e) => {
      if (!e.key || e.key === STORAGE_KEY) refresh()
    }
    window.addEventListener('storage', handler)
    window.addEventListener('pokemon_history_updated', refresh)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('pokemon_history_updated', refresh)
    }
  }, [refresh])

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('pokemon_history_updated'))
    refresh()
  }

  if (history.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 gap-3"
        style={{ fontFamily: 'system-ui, sans-serif', color: isDark ? '#9CA3AF' : '#6B7280' }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          alt="empty"
          style={{ width: 48, height: 48, opacity: 0.4 }}
        />
        <p style={{ fontSize: 14 }}>No visited Pokemon yet</p>
      </div>
    )
  }

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        color: isDark ? '#F9FAFB' : '#111827',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: isDark ? '#9CA3AF' : '#6B7280',
          }}
        >
          Recently Visited
        </h3>
        <button
          onClick={clearHistory}
          style={{
            fontSize: 11,
            color: '#EF4444',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 4,
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Clear All
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 12,
        }}
      >
        {history.map((pokemon) => (
          <button
            key={pokemon.name}
            onClick={() => onSelect && onSelect(pokemon.name)}
            style={{
              background: isDark ? '#1F2937' : '#F9FAFB',
              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
              borderRadius: 12,
              padding: '12px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = isDark
                ? '0 4px 12px rgba(0,0,0,0.4)'
                : '0 4px 12px rgba(0,0,0,0.12)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                background: '#EF4444',
                color: 'white',
                fontSize: 9,
                fontWeight: 700,
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {pokemon.visits > 99 ? '99+' : pokemon.visits}
            </span>
            <img
              src={pokemon.image}
              alt={pokemon.name}
              style={{ width: 56, height: 56, objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.src =
                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'capitalize',
                textAlign: 'center',
                color: isDark ? '#D1D5DB' : '#374151',
              }}
            >
              {pokemon.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PokemonHistory
