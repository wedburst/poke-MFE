import React from 'react'
import { createRoot } from 'react-dom/client'
import PokemonHistory from './PokemonHistory.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PokemonHistory theme="light" onSelect={() => {}} />
  </React.StrictMode>
)
