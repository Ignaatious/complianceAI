import { useState, useEffect } from 'react'

const DEADLINE = new Date('2026-08-02T00:00:00Z').getTime()

export function useCountdown() {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const diff = DEADLINE - now
  const isPast = diff <= 0

  if (isPast) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalDays: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isPast, totalDays: days }
}
