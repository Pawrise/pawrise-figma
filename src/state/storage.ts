import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
export const PREFIX = "pawrise:v1:"
export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    const value = JSON.parse(raw)
    if (value === null || typeof value !== typeof fallback || Array.isArray(value) !== Array.isArray(fallback)) return fallback
    return value as T
  } catch { return fallback }
}
// Keys are fixed for a mounted component; dog-specific screens are keyed by dog id.
export function useStoredState<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readStored(key, fallback))
  useEffect(() => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) }
    catch { window.dispatchEvent(new Event("pawrise-storage-error")) }
  }, [key, value])
  return [value, setValue]
}
export function resetDemo() {
  for (const key of Object.keys(localStorage)) if (key.startsWith(PREFIX)) localStorage.removeItem(key)
  window.location.reload()
}
