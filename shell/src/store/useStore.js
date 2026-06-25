import { create } from 'zustand'

const HISTORY_KEY = 'pokemon_history'
const HISTORY_EVENT = 'pokemon_history_updated'

export const addToHistory = (pokemon) => {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    const idx = history.findIndex((p) => p.name === pokemon.name)
    if (idx >= 0) {
      const [item] = history.splice(idx, 1)
      item.visits++
      history.unshift(item)
    } else {
      history.unshift({ name: pokemon.name, image: pokemon.image, visits: 1 })
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    window.dispatchEvent(new CustomEvent(HISTORY_EVENT))
  } catch {}
}

export const getLastVisited = () => {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    return history[0] ?? null
  } catch {
    return null
  }
}

const useStore = create((set, get) => ({
  // Auth
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem('poke_user') || 'null')
    } catch {
      return null
    }
  })(),
  login: (username) => {
    const user = { username, avatar: username[0].toUpperCase() }
    localStorage.setItem('poke_user', JSON.stringify(user))
    set({ user })
  },
  logout: () => {
    localStorage.removeItem('poke_user')
    set({ user: null, selectedPokemonId: null, selectedPokemonName: null })
  },

  // Theme
  theme: localStorage.getItem('poke_theme') || 'light',
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('poke_theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    set({ theme: next })
  },

  // Selected Pokemon (for detail panel)
  selectedPokemonId: null,
  selectedPokemonName: null,
  selectPokemon: (id, name, image) => {
    addToHistory({ name, image })
    sessionStorage.removeItem('toast_dismissed')
    set({
      selectedPokemonId: id,
      selectedPokemonName: name,
      toast: { name, image },
    })
  },
  clearSelectedPokemon: () => set({ selectedPokemonId: null, selectedPokemonName: null }),

  // Category
  selectedCategory: 'fire',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),

  // Search modal
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  // Toast
  toast: null,
  setToast: (toast) => set({ toast }),
  dismissToast: () => {
    sessionStorage.setItem('toast_dismissed', 'true')
    set({ toast: null })
  },
}))

export default useStore
