import { describe, it, expect, beforeEach, vi } from 'vitest'
import useStore, { addToHistory, getLastVisited } from '../../store/useStore.js'

const HISTORY_KEY = 'pokemon_history'

const resetStore = () =>
  useStore.setState({
    user: null,
    theme: 'light',
    selectedPokemonId: null,
    selectedPokemonName: null,
    isSearchOpen: false,
    selectedCategory: 'fire',
    toast: null,
  })

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  resetStore()
})

// ─── addToHistory ────────────────────────────────────────────────────────────

describe('addToHistory', () => {
  it('adds a new pokemon with visits = 1', () => {
    addToHistory({ name: 'pikachu', image: 'pika.png' })
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY))
    expect(history).toHaveLength(1)
    expect(history[0]).toEqual({ name: 'pikachu', image: 'pika.png', visits: 1 })
  })

  it('increments visits when the same pokemon is added again', () => {
    addToHistory({ name: 'pikachu', image: 'pika.png' })
    addToHistory({ name: 'pikachu', image: 'pika.png' })
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY))
    expect(history).toHaveLength(1)
    expect(history[0].visits).toBe(2)
  })

  it('moves a revisited pokemon to the front', () => {
    addToHistory({ name: 'charizard', image: 'char.png' })
    addToHistory({ name: 'pikachu', image: 'pika.png' })
    addToHistory({ name: 'charizard', image: 'char.png' })
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY))
    expect(history[0].name).toBe('charizard')
    expect(history[0].visits).toBe(2)
  })

  it('dispatches the pokemon_history_updated custom event', () => {
    const listener = vi.fn()
    window.addEventListener('pokemon_history_updated', listener)
    addToHistory({ name: 'bulbasaur', image: 'bulb.png' })
    expect(listener).toHaveBeenCalledTimes(1)
    window.removeEventListener('pokemon_history_updated', listener)
  })
})

// ─── getLastVisited ───────────────────────────────────────────────────────────

describe('getLastVisited', () => {
  it('returns null when history is empty', () => {
    expect(getLastVisited()).toBeNull()
  })

  it('returns the first item in history', () => {
    addToHistory({ name: 'mewtwo', image: 'mew.png' })
    addToHistory({ name: 'pikachu', image: 'pika.png' })
    expect(getLastVisited().name).toBe('pikachu')
  })
})

// ─── login / logout ───────────────────────────────────────────────────────────

describe('login', () => {
  it('sets user in store with username and uppercase avatar', () => {
    useStore.getState().login('ash')
    const { user } = useStore.getState()
    expect(user).toEqual({ username: 'ash', avatar: 'A' })
  })

  it('persists user to localStorage', () => {
    useStore.getState().login('misty')
    expect(JSON.parse(localStorage.getItem('poke_user'))).toEqual({
      username: 'misty',
      avatar: 'M',
    })
  })
})

describe('logout', () => {
  it('clears user from store and localStorage', () => {
    useStore.getState().login('ash')
    useStore.getState().logout()
    expect(useStore.getState().user).toBeNull()
    expect(localStorage.getItem('poke_user')).toBeNull()
  })

  it('clears selected pokemon on logout', () => {
    useStore.setState({ selectedPokemonId: '25', selectedPokemonName: 'pikachu' })
    useStore.getState().logout()
    expect(useStore.getState().selectedPokemonId).toBeNull()
    expect(useStore.getState().selectedPokemonName).toBeNull()
  })
})

// ─── toggleTheme ──────────────────────────────────────────────────────────────

describe('toggleTheme', () => {
  it('switches from light to dark', () => {
    useStore.setState({ theme: 'light' })
    useStore.getState().toggleTheme()
    expect(useStore.getState().theme).toBe('dark')
  })

  it('switches from dark to light', () => {
    useStore.setState({ theme: 'dark' })
    useStore.getState().toggleTheme()
    expect(useStore.getState().theme).toBe('light')
  })

  it('persists theme to localStorage', () => {
    useStore.setState({ theme: 'light' })
    useStore.getState().toggleTheme()
    expect(localStorage.getItem('poke_theme')).toBe('dark')
  })

  it('adds "dark" class to document.documentElement', () => {
    useStore.setState({ theme: 'light' })
    useStore.getState().toggleTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})

// ─── selectPokemon ────────────────────────────────────────────────────────────

describe('selectPokemon', () => {
  it('sets selectedPokemonId and selectedPokemonName', () => {
    useStore.getState().selectPokemon('25', 'pikachu', 'pika.png')
    const { selectedPokemonId, selectedPokemonName } = useStore.getState()
    expect(selectedPokemonId).toBe('25')
    expect(selectedPokemonName).toBe('pikachu')
  })

  it('records the visit in history', () => {
    useStore.getState().selectPokemon('25', 'pikachu', 'pika.png')
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY))
    expect(history[0].name).toBe('pikachu')
  })

  it('sets toast to the visited pokemon', () => {
    useStore.getState().selectPokemon('25', 'pikachu', 'pika.png')
    expect(useStore.getState().toast).toEqual({ name: 'pikachu', image: 'pika.png' })
  })

  it('clears the toast_dismissed sessionStorage flag', () => {
    sessionStorage.setItem('toast_dismissed', 'true')
    useStore.getState().selectPokemon('25', 'pikachu', 'pika.png')
    expect(sessionStorage.getItem('toast_dismissed')).toBeNull()
  })
})

// ─── search modal ─────────────────────────────────────────────────────────────

describe('search modal', () => {
  it('opens and closes', () => {
    expect(useStore.getState().isSearchOpen).toBe(false)
    useStore.getState().openSearch()
    expect(useStore.getState().isSearchOpen).toBe(true)
    useStore.getState().closeSearch()
    expect(useStore.getState().isSearchOpen).toBe(false)
  })
})

// ─── toast ────────────────────────────────────────────────────────────────────

describe('dismissToast', () => {
  it('sets toast to null', () => {
    useStore.setState({ toast: { name: 'pikachu', image: 'pika.png' } })
    useStore.getState().dismissToast()
    expect(useStore.getState().toast).toBeNull()
  })

  it('sets toast_dismissed in sessionStorage', () => {
    useStore.getState().dismissToast()
    expect(sessionStorage.getItem('toast_dismissed')).toBe('true')
  })
})
