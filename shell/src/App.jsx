import React, { useEffect } from 'react'
import useStore, { getLastVisited } from './store/useStore.js'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  const user = useStore((s) => s.user)
  const theme = useStore((s) => s.theme)
  const setToast = useStore((s) => s.setToast)

  // Apply saved theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])

  // Show toast on page load if history exists and not dismissed
  useEffect(() => {
    if (!user) return
    const dismissed = sessionStorage.getItem('toast_dismissed')
    if (!dismissed) {
      const last = getLastVisited()
      if (last) setToast(last)
    }
  }, [user])

  if (!user) return <Login />

  return (
    <>
      <Home />
      <Toast />
    </>
  )
}
