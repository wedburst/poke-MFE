import React from 'react'

export default function PokemonHistory({ onSelect }) {
  return (
    <div data-testid="mock-pokemon-history">
      <button onClick={() => onSelect?.('pikachu')}>select pikachu</button>
    </div>
  )
}
