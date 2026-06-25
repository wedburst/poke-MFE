import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import PokemonDetail from '../PokemonDetail.jsx'

// ─── Fixture ──────────────────────────────────────────────────────────────────

const mockPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ type: { name: 'electric' } }],
  abilities: [
    { ability: { name: 'static' }, is_hidden: false },
    { ability: { name: 'lightning-rod' }, is_hidden: true },
  ],
  stats: [
    { stat: { name: 'hp' }, base_stat: 35 },
    { stat: { name: 'attack' }, base_stat: 55 },
    { stat: { name: 'defense' }, base_stat: 40 },
    { stat: { name: 'special-attack' }, base_stat: 50 },
    { stat: { name: 'special-defense' }, base_stat: 50 },
    { stat: { name: 'speed' }, base_stat: 90 },
  ],
  sprites: {
    front_default: 'https://example.com/pikachu-sprite.png',
    other: {
      'official-artwork': { front_default: 'https://example.com/pikachu-artwork.png' },
    },
  },
}

const mockFetchOk = () =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => mockPokemon,
  })

const mockFetchFail = () =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false })

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('PokemonDetail — no identifier', () => {
  it('shows the empty-state prompt when no props are given', () => {
    render(<PokemonDetail />)
    expect(screen.getByText('Select a Pokemon to see details')).toBeInTheDocument()
  })

  it('does not call fetch when no identifier is provided', () => {
    const spy = vi.spyOn(globalThis, 'fetch')
    render(<PokemonDetail />)
    expect(spy).not.toHaveBeenCalled()
  })
})

describe('PokemonDetail — loading', () => {
  it('shows a loading spinner while the request is in flight', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<PokemonDetail pokemonId="25" />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})

describe('PokemonDetail — success', () => {
  it('renders the pokemon name after a successful fetch', async () => {
    mockFetchOk()
    render(<PokemonDetail pokemonId="25" />)
    await waitFor(() => expect(screen.getByText('pikachu')).toBeInTheDocument())
  })

  it('renders the padded pokemon ID', async () => {
    mockFetchOk()
    render(<PokemonDetail pokemonId="25" />)
    await waitFor(() => expect(screen.getByText('#025')).toBeInTheDocument())
  })

  it('renders the pokemon type badge', async () => {
    mockFetchOk()
    render(<PokemonDetail pokemonId="25" />)
    await waitFor(() => expect(screen.getByText('electric')).toBeInTheDocument())
  })

  it('renders all stat labels', async () => {
    mockFetchOk()
    render(<PokemonDetail pokemonId="25" />)
    await waitFor(() => {
      expect(screen.getByText('HP')).toBeInTheDocument()
      expect(screen.getByText('Attack')).toBeInTheDocument()
      expect(screen.getByText('Defense')).toBeInTheDocument()
      expect(screen.getByText('Speed')).toBeInTheDocument()
    })
  })

  it('renders the correct HP value', async () => {
    mockFetchOk()
    render(<PokemonDetail pokemonId="25" />)
    await waitFor(() => expect(screen.getByText('35')).toBeInTheDocument())
  })

  it('renders height and weight', async () => {
    mockFetchOk()
    render(<PokemonDetail pokemonId="25" />)
    await waitFor(() => {
      expect(screen.getByText('0.4 m')).toBeInTheDocument()
      expect(screen.getByText('6.0 kg')).toBeInTheDocument()
    })
  })

  it('marks a hidden ability with the (hidden) label', async () => {
    mockFetchOk()
    render(<PokemonDetail pokemonId="25" />)
    await waitFor(() => expect(screen.getByText('(hidden)')).toBeInTheDocument())
  })

  it('fetches by name when pokemonName prop is used', async () => {
    const spy = mockFetchOk()
    render(<PokemonDetail pokemonName="pikachu" />)
    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu')
    )
  })

  it('re-fetches when the identifier prop changes', async () => {
    const spy = mockFetchOk()
    const { rerender } = render(<PokemonDetail pokemonId="25" />)
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1))
    rerender(<PokemonDetail pokemonId="6" />)
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2))
  })
})

describe('PokemonDetail — error', () => {
  it('shows an error message when the API returns a non-ok response', async () => {
    mockFetchFail()
    render(<PokemonDetail pokemonId="999" />)
    await waitFor(() =>
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument()
    )
  })

  it('shows error icon alongside the error message', async () => {
    mockFetchFail()
    render(<PokemonDetail pokemonId="999" />)
    await waitFor(() => expect(screen.getByText('⚠️')).toBeInTheDocument())
  })
})
