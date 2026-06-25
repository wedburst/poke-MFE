import React from 'react'

export default function PokemonDetail({ pokemonId, pokemonName }) {
  const id = pokemonId || pokemonName
  if (!id) return <p>Select a Pokemon to see details</p>
  return <div data-testid="mock-pokemon-detail">Detail: {id}</div>
}
