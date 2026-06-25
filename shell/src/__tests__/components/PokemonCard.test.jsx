import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PokemonCard, { getPokemonId, getPokemonImage } from '../../components/PokemonCard.jsx'

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/25/'

describe('getPokemonId', () => {
  it('extracts numeric id from PokeAPI URL', () => {
    expect(getPokemonId(POKEMON_URL)).toBe('25')
  })

  it('handles URLs without trailing slash', () => {
    expect(getPokemonId('https://pokeapi.co/api/v2/pokemon/132')).toBe('132')
  })

  it('returns null for falsy input', () => {
    expect(getPokemonId(null)).toBeNull()
    expect(getPokemonId('')).toBeNull()
  })
})

describe('getPokemonImage', () => {
  it('builds official-artwork URL from an id', () => {
    expect(getPokemonImage('25')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    )
  })
})

describe('PokemonCard', () => {
  it('renders the pokemon name capitalised', () => {
    render(<PokemonCard name="pikachu" url={POKEMON_URL} />)
    expect(screen.getByText('pikachu')).toBeInTheDocument()
  })

  it('renders the pokemon number with zero-padding', () => {
    render(<PokemonCard name="pikachu" url={POKEMON_URL} />)
    expect(screen.getByText('#025')).toBeInTheDocument()
  })

  it('calls onClick with (id, name, image) when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<PokemonCard name="pikachu" url={POKEMON_URL} onClick={onClick} />)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledWith(
      '25',
      'pikachu',
      getPokemonImage('25')
    )
  })

  it('does not throw when onClick is not provided', async () => {
    const user = userEvent.setup()
    render(<PokemonCard name="pikachu" url={POKEMON_URL} />)
    await expect(user.click(screen.getByRole('button'))).resolves.not.toThrow()
  })

  it('renders an img element with the artwork URL', () => {
    render(<PokemonCard name="pikachu" url={POKEMON_URL} />)
    const img = screen.getByRole('img', { name: 'pikachu' })
    expect(img).toHaveAttribute('src', getPokemonImage('25'))
  })
})
