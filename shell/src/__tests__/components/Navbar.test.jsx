import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../../components/Navbar.jsx'
import useStore from '../../store/useStore.js'

beforeEach(() => {
  localStorage.clear()
  useStore.setState({
    user: { username: 'ash', avatar: 'A' },
    theme: 'light',
    isSearchOpen: false,
  })
})

describe('Navbar', () => {
  it('renders the Pokédex brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('Pokédex')).toBeInTheDocument()
  })

  it('renders the search trigger button', () => {
    render(<Navbar />)
    expect(screen.getByText(/search pokemon/i)).toBeInTheDocument()
  })

  it('clicking the search trigger opens the search modal in the store', async () => {
    const user = userEvent.setup()
    render(<Navbar />)
    await user.click(screen.getByText(/search pokemon/i))
    expect(useStore.getState().isSearchOpen).toBe(true)
  })

  it('renders a theme toggle button', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('clicking the theme toggle switches theme in the store', async () => {
    const user = userEvent.setup()
    render(<Navbar />)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(useStore.getState().theme).toBe('dark')
  })

  it('renders the user dropdown with the logged-in username', () => {
    render(<Navbar />)
    expect(screen.getByText('ash')).toBeInTheDocument()
  })
})
