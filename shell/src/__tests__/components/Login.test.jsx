import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/Login.jsx'
import useStore from '../../store/useStore.js'

beforeEach(() => {
  localStorage.clear()
  useStore.setState({ user: null, theme: 'light' })
})

// Always restore real timers so a frozen fake-timer test can't bleed into the next
afterEach(() => {
  vi.useRealTimers()
})

describe('Login', () => {
  it('renders the Pokédex heading', () => {
    render(<Login />)
    expect(screen.getByText('Pokédex')).toBeInTheDocument()
  })

  it('renders username and password inputs', () => {
    const { container } = render(<Login />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument()
  })

  it('shows error when submitting with empty username', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText('Username is required')).toBeInTheDocument()
  })

  it('shows error when username is filled but password is empty', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.type(screen.getByRole('textbox'), 'ash')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('clears the username error when resubmitting with a name', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText('Username is required')).toBeInTheDocument()
    await user.type(screen.getByRole('textbox'), 'ash')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument()
  })

  it('submit button is enabled initially and has the correct label', () => {
    render(<Login />)
    const button = screen.getByRole('button', { name: /sign in/i })
    expect(button).not.toBeDisabled()
    expect(button).toBeInTheDocument()
  })

  it('calls login with the trimmed username after a successful submit', async () => {
    // Real timers — the 600 ms delay just makes this test run for ~600 ms
    const user = userEvent.setup()
    const { container } = render(<Login />)
    await user.type(screen.getByRole('textbox'), '  ash  ')
    await user.type(container.querySelector('input[type="password"]'), '1234')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(useStore.getState().user?.username).toBe('ash'), {
      timeout: 2000,
    })
  }, 8000)

  it('renders the theme toggle button', () => {
    render(<Login />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('theme button toggles the store theme', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(useStore.getState().theme).toBe('dark')
  })
})
