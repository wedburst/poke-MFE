import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserDropdown from '../../components/UserDropdown.jsx'
import useStore from '../../store/useStore.js'

const MOCK_USER = { username: 'ash', avatar: 'A' }

beforeEach(() => {
  localStorage.clear()
  useStore.setState({ user: MOCK_USER })
})

describe('UserDropdown', () => {
  it('renders the avatar letter', () => {
    render(<UserDropdown />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('renders the username', () => {
    render(<UserDropdown />)
    expect(screen.getByText('ash')).toBeInTheDocument()
  })

  it('dropdown is closed by default', () => {
    render(<UserDropdown />)
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
  })

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<UserDropdown />)
    await user.click(screen.getByText('ash'))
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('shows "Signed in as" and username inside the dropdown', async () => {
    const user = userEvent.setup()
    render(<UserDropdown />)
    await user.click(screen.getByText('ash'))
    expect(screen.getByText('Signed in as')).toBeInTheDocument()
  })

  it('closes dropdown and calls logout when Sign Out is clicked', async () => {
    const user = userEvent.setup()
    render(<UserDropdown />)
    await user.click(screen.getByText('ash'))
    await user.click(screen.getByText('Sign Out'))
    expect(useStore.getState().user).toBeNull()
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <UserDropdown />
        <button>Outside</button>
      </div>
    )
    await user.click(screen.getByText('ash'))
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
    await user.click(screen.getByText('Outside'))
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
  })
})
