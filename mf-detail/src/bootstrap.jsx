import React from 'react'
import { createRoot } from 'react-dom/client'
import PokemonDetail from './PokemonDetail.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PokemonDetail pokemonId={1} />
  </React.StrictMode>
)
