import React, { useState, useEffect } from 'react'

const TYPE_COLORS = {
  fire: '#F97316', water: '#3B82F6', grass: '#22C55E', electric: '#EAB308',
  psychic: '#EC4899', ghost: '#7C3AED', dragon: '#6366F1', fighting: '#DC2626',
  poison: '#A855F7', ground: '#D97706', rock: '#78716C', ice: '#06B6D4',
  bug: '#84CC16', normal: '#9CA3AF', dark: '#374151', steel: '#94A3B8',
  fairy: '#F472B6', flying: '#38BDF8',
}

// Uses inline styles exclusively so dark mode works without Tailwind in this package
const StatBar = ({ label, value, max = 255, isDark }) => {
  const barColor = value > 100 ? '#22C55E' : value > 60 ? '#EAB308' : '#F97316'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: isDark ? '#9CA3AF' : '#6B7280',
        width: 72, flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 13, fontWeight: 700,
        color: isDark ? '#F3F4F6' : '#1F2937',
        width: 28, textAlign: 'right', flexShrink: 0,
      }}>
        {value}
      </span>
      <div style={{
        flex: 1, height: 8,
        backgroundColor: isDark ? '#374151' : '#E5E7EB',
        borderRadius: 999, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 999,
          width: `${Math.min((value / max) * 100, 100)}%`,
          backgroundColor: barColor,
          transition: 'width 0.7s ease',
        }} />
      </div>
    </div>
  )
}

const PokemonDetail = ({ pokemonId, pokemonName, theme = 'light' }) => {
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const identifier = pokemonId || pokemonName
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!identifier) return
    setLoading(true)
    setError(null)
    setPokemon(null)
    fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`)
      .then((r) => {
        if (!r.ok) throw new Error('Pokemon not found')
        return r.json()
      })
      .then((data) => { setPokemon(data); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [identifier])

  const bg   = isDark ? '#111827' : '#FFFFFF'
  const text = isDark ? '#F9FAFB' : '#111827'
  const sub  = isDark ? '#9CA3AF' : '#6B7280'

  if (!identifier) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100%', gap: 12, color: sub, background: bg }}>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          alt="" style={{ width: 48, height: 48, opacity: 0.3 }} />
        <p style={{ fontSize: 14, margin: 0 }}>Select a Pokemon to see details</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', background: bg }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            border: `4px solid ${isDark ? '#374151' : '#E5E7EB'}`,
            borderTopColor: '#EF4444',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <span style={{ fontSize: 13, color: sub }}>Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100%', gap: 8, background: bg }}>
        <span style={{ fontSize: 36 }}>⚠️</span>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', margin: 0 }}>{error}</p>
      </div>
    )
  }

  if (!pokemon) return null

  const mainType  = pokemon.types[0]?.type.name
  const typeColor = TYPE_COLORS[mainType] || '#9CA3AF'

  // Prefer SVG without background (dream_world), fallback to PNG artwork
  const artwork =
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default

  const stats = [
    { label: 'HP',      value: pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat ?? 0 },
    { label: 'Attack',  value: pokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat ?? 0 },
    { label: 'Defense', value: pokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat ?? 0 },
    { label: 'Sp. Atk', value: pokemon.stats.find((s) => s.stat.name === 'special-attack')?.base_stat ?? 0 },
    { label: 'Sp. Def', value: pokemon.stats.find((s) => s.stat.name === 'special-defense')?.base_stat ?? 0 },
    { label: 'Speed',   value: pokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat ?? 0 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%',
      overflowY: 'auto', background: bg, color: text, fontFamily: 'system-ui, sans-serif' }}>

      {/* Hero */}
      <div style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '32px 24px 24px',
        background: `linear-gradient(135deg, ${typeColor}22, ${typeColor}44)`,
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.12,
          backgroundImage: `radial-gradient(circle at 70% 50%, ${typeColor} 0%, transparent 60%)`,
        }} />
        <img src={artwork} alt={pokemon.name} style={{
          position: 'relative', zIndex: 1,
          width: 160, height: 160, objectFit: 'contain',
          filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))',
        }} />
        <h2 style={{
          marginTop: 12, marginBottom: 2, fontSize: 22, fontWeight: 800,
          textTransform: 'capitalize', letterSpacing: '-0.02em', color: text,
        }}>
          {pokemon.name}
        </h2>
        <p style={{ fontSize: 13, fontWeight: 500, color: sub, margin: 0 }}>
          #{String(pokemon.id).padStart(3, '0')}
        </p>
      </div>

      {/* Types */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '16px 24px' }}>
        {pokemon.types.map(({ type }) => (
          <span key={type.name} style={{
            padding: '4px 16px', borderRadius: 999, color: '#fff',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            backgroundColor: TYPE_COLORS[type.name] || '#9CA3AF',
          }}>
            {type.name}
          </span>
        ))}
      </div>

      {/* Physical */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 32,
        margin: '0 24px', padding: '12px 24px', borderRadius: 12,
        backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
      }}>
        {[
          { label: 'Height', value: `${(pokemon.height / 10).toFixed(1)} m` },
          { label: 'Weight', value: `${(pokemon.weight / 10).toFixed(1)} kg` },
          { label: 'Exp',    value: pokemon.base_experience ?? '—' },
        ].map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: sub, margin: '0 0 2px' }}>
                {item.label}
              </p>
              <p style={{ fontSize: 17, fontWeight: 700, color: text, margin: 0 }}>
                {item.value}
              </p>
            </div>
            {i < arr.length - 1 && (
              <div style={{ width: 1, backgroundColor: isDark ? '#374151' : '#D1D5DB', alignSelf: 'stretch' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Abilities */}
      <div style={{ padding: '20px 24px 0' }}>
        <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: sub, margin: '0 0 10px' }}>
          Abilities
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {pokemon.abilities.map(({ ability, is_hidden }) => (
            <span key={ability.name} style={{
              padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              textTransform: 'capitalize',
              border: `1px solid ${is_hidden
                ? (isDark ? '#7C3AED' : '#A78BFA')
                : (isDark ? '#4B5563' : '#D1D5DB')}`,
              color: is_hidden
                ? (isDark ? '#C4B5FD' : '#7C3AED')
                : (isDark ? '#D1D5DB' : '#4B5563'),
            }}>
              {ability.name.replace('-', ' ')}
              {is_hidden && <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.8 }}>(hidden)</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '20px 24px 32px' }}>
        <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: sub, margin: '0 0 14px' }}>
          Base Stats
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stats.map((s) => (
            <StatBar key={s.label} label={s.label} value={s.value} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PokemonDetail
