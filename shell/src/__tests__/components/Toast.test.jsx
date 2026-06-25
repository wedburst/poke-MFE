import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toast from '../../components/Toast.jsx'
import useStore from '../../store/useStore.js'

const TOAST_POKEMON = { name: 'pikachu', image: 'https://example.com/pikachu.png' }

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  useStore.setState({ toast: null, selectedPokemonId: null, selectedPokemonName: null })
})

describe('Toast', () => {
  it('renders nothing when toast is null', () => {
    const { container } = render(<Toast />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the pokemon name when toast is set', () => {
    useStore.setState({ toast: TOAST_POKEMON })
    render(<Toast />)
    expect(screen.getByText('pikachu')).toBeInTheDocument()
  })

  it('renders the "Last visited" label', () => {
    useStore.setState({ toast: TOAST_POKEMON })
    render(<Toast />)
    expect(screen.getByText('Last visited')).toBeInTheDocument()
  })

  it('renders the pokemon image', () => {
    useStore.setState({ toast: TOAST_POKEMON })
    render(<Toast />)
    expect(screen.getByRole('img', { name: 'pikachu' })).toHaveAttribute(
      'src',
      TOAST_POKEMON.image
    )
  })

  it('calls dismissToast when the close button is clicked', async () => {
    const user = userEvent.setup()
    useStore.setState({ toast: TOAST_POKEMON })
    render(<Toast />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(useStore.getState().toast).toBeNull()
    expect(sessionStorage.getItem('toast_dismissed')).toBe('true')
  })

  it('clicking the pokemon name selects it and dismisses the toast', async () => {
    const user = userEvent.setup()
    useStore.setState({ toast: TOAST_POKEMON })
    render(<Toast />)
    await user.click(screen.getByText('pikachu'))
    expect(useStore.getState().selectedPokemonId).toBe('pikachu')
    expect(useStore.getState().toast).toBeNull()
  })

  it('auto-dismisses after 6 seconds', async () => {
    vi.useFakeTimers()
    useStore.setState({ toast: TOAST_POKEMON })
    render(<Toast />)
    expect(screen.getByText('pikachu')).toBeInTheDocument()
    await act(async () => {
      vi.advanceTimersByTime(6000)
    })
    expect(useStore.getState().toast).toBeNull()
    vi.useRealTimers()
  })
})
