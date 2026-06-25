import React, { useEffect } from 'react'
import useStore from '../store/useStore.js'

export default function Toast() {
  const toast = useStore((s) => s.toast)
  const dismissToast = useStore((s) => s.dismissToast)
  const selectPokemon = useStore((s) => s.selectPokemon)

  // Auto dismiss after 6 seconds
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismissToast, 6000)
    return () => clearTimeout(timer)
  }, [toast, dismissToast])

  if (!toast) return null

  const handleClick = () => {
    const id = toast.name
    selectPokemon(id, toast.name, toast.image)
    dismissToast()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in-up">
      <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl px-4 py-3 max-w-sm">
        <img
          src={toast.image}
          alt={toast.name}
          className="w-12 h-12 object-contain shrink-0"
          onError={(e) => {
            e.currentTarget.src =
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Last visited
          </p>
          <button
            onClick={handleClick}
            className="text-sm font-bold text-gray-900 dark:text-white capitalize hover:text-red-500 dark:hover:text-red-400 transition truncate block"
          >
            {toast.name}
          </button>
        </div>
        <button
          onClick={dismissToast}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition shrink-0"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
