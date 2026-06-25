import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PokemonHistory from '../PokemonHistory.jsx'

const STORAGE_KEY = 'pokemon_history'

const seedHistory = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const PIKACHU = { name: 'pikachu', image: 'https://example.com/pikachu.png', visits: 3 }
const CHARIZARD = { name: 'charizard', image: 'https://example.com/charizard.png', visits: 1 }

beforeEach(() => {
  localStorage.clear()
})

describe('PokemonHistory — empty state', () => {
  it('shows the empty-state message when there is no history', () => {
    render(<PokemonHistory />)
    expect(screen.getByText('No visited Pokemon yet')).toBeInTheDocument()
  })

  it('does not render the "Clear All" button when history is empty', () => {
    render(<PokemonHistory />)
    expect(screen.queryByText('Clear All')).not.toBeInTheDocument()
  })
})

describe('PokemonHistory — with history', () => {
  beforeEach(() => {
    seedHistory([PIKACHU, CHARIZARD])
  })

  it('renders each pokemon name', () => {
    render(<PokemonHistory />)
    expect(screen.getByText('pikachu')).toBeInTheDocument()
    expect(screen.getByText('charizard')).toBeInTheDocument()
  })

  it('renders the visit count badge for each pokemon', () => {
    render(<PokemonHistory />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders pokemon images', () => {
    render(<PokemonHistory />)
    expect(screen.getByRole('img', { name: 'pikachu' })).toHaveAttribute(
      'src',
      PIKACHU.image
    )
  })

  it('renders the "Recently Visited" heading', () => {
    render(<PokemonHistory />)
    expect(screen.getByText('Recently Visited')).toBeInTheDocument()
  })

  it('renders the "Clear All" button', () => {
    render(<PokemonHistory />)
    expect(screen.getByText('Clear All')).toBeInTheDocument()
  })

  it('calls onSelect with the pokemon name when a card is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<PokemonHistory onSelect={onSelect} />)
    await user.click(screen.getByRole('button', { name: /pikachu/i }))
    expect(onSelect).toHaveBeenCalledWith('pikachu')
  })

  it('clears localStorage and shows empty state after "Clear All"', async () => {
    const user = userEvent.setup()
    render(<PokemonHistory />)
    await user.click(screen.getByText('Clear All'))
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(screen.getByText('No visited Pokemon yet')).toBeInTheDocument()
  })

  it('caps badge at 99+ for very-high visit counts', () => {
    seedHistory([{ ...PIKACHU, visits: 150 }])
    render(<PokemonHistory />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })
})

describe('PokemonHistory — reactivity', () => {
  it('updates when pokemon_history_updated custom event is dispatched', () => {
    render(<PokemonHistory />)
    expect(screen.getByText('No visited Pokemon yet')).toBeInTheDocument()

    seedHistory([PIKACHU])
    fireEvent(window, new CustomEvent('pokemon_history_updated'))

    expect(screen.getByText('pikachu')).toBeInTheDocument()
  })

  it('updates when the storage event fires with the history key', () => {
    render(<PokemonHistory />)
    seedHistory([PIKACHU])
    fireEvent(window, new StorageEvent('storage', { key: STORAGE_KEY }))
    expect(screen.getByText('pikachu')).toBeInTheDocument()
  })

  it('ignores storage events for unrelated keys', () => {
    render(<PokemonHistory />)
    seedHistory([PIKACHU])
    fireEvent(window, new StorageEvent('storage', { key: 'other_key' }))
    expect(screen.queryByText('pikachu')).not.toBeInTheDocument()
  })
})

describe('PokemonHistory — dark theme', () => {
  it('renders without errors in dark mode', () => {
    seedHistory([PIKACHU])
    render(<PokemonHistory theme="dark" />)
    expect(screen.getByText('pikachu')).toBeInTheDocument()
  })
})
