'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface WeatherData {
  temperature: number
  weatherCode: number
}

const CONDITIONS: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Clear sky',       icon: '☀️' },
  1:  { label: 'Mainly clear',    icon: '🌤️' },
  2:  { label: 'Partly cloudy',   icon: '⛅' },
  3:  { label: 'Overcast',        icon: '☁️' },
  45: { label: 'Foggy',           icon: '🌫️' },
  48: { label: 'Icy fog',         icon: '🌫️' },
  51: { label: 'Light drizzle',   icon: '🌦️' },
  53: { label: 'Drizzle',         icon: '🌦️' },
  55: { label: 'Heavy drizzle',   icon: '🌦️' },
  61: { label: 'Light rain',      icon: '🌧️' },
  63: { label: 'Rain',            icon: '🌧️' },
  65: { label: 'Heavy rain',      icon: '🌧️' },
  71: { label: 'Light snow',      icon: '🌨️' },
  73: { label: 'Snow',            icon: '🌨️' },
  75: { label: 'Heavy snow',      icon: '❄️' },
  77: { label: 'Snow grains',     icon: '🌨️' },
  80: { label: 'Light showers',   icon: '🌧️' },
  81: { label: 'Showers',         icon: '🌧️' },
  82: { label: 'Heavy showers',   icon: '⛈️' },
  85: { label: 'Snow showers',    icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '🌨️' },
  95: { label: 'Thunderstorm',    icon: '⛈️' },
  96: { label: 'Thunderstorm',    icon: '⛈️' },
  99: { label: 'Thunderstorm',    icon: '⛈️' },
}

function getCondition(code: number) {
  return CONDITIONS[code] ?? { label: 'Unknown', icon: '🌡️' }
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=68.23&longitude=14.57&current=temperature_2m,weather_code&timezone=Europe%2FOslo'
    )
      .then(r => r.json())
      .then(data =>
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
        })
      )
      .catch(() => setError(true))
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const condition = weather ? getCondition(weather.weatherCode) : null

  return (
    <div className="relative w-[400px] h-[400px] rounded-3xl overflow-hidden shadow-2xl">
      <Image
        src="/landscape.png"
        alt="Lofoten landscape"
        fill
        className="object-cover"
        priority
      />

      {/* overlay to improve text legibility */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute inset-0 p-[18px] flex flex-col justify-between">
        {/* Top row — temperature centered to the height of the left stack */}
        <div className="flex justify-between items-center">
          <div className="text-white drop-shadow-sm">
            <p className="text-[18px] font-semibold leading-snug">Today</p>
            <p className="text-[18px] font-semibold leading-snug">{formatTime(time)}</p>
            <div className="mt-1 text-[14px] font-medium opacity-90">
              {condition && <span>{condition.icon} {condition.label}</span>}
              {!condition && !error && <span className="opacity-40">Loading…</span>}
              {error && <span className="opacity-40">Weather unavailable</span>}
            </div>
          </div>

          <div className="text-white drop-shadow-sm">
            {weather && (
              <p className="text-[72px] font-bold leading-none">{weather.temperature}°</p>
            )}
            {!weather && !error && (
              <p className="text-[72px] font-bold leading-none opacity-30">—°</p>
            )}
            {error && (
              <p className="text-[72px] font-bold leading-none opacity-30">?°</p>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="text-white drop-shadow-sm">
          <p className="text-[18px] font-semibold leading-snug">Lofoten</p>
          <p className="text-[14px] font-medium leading-snug">Norway</p>
        </div>
      </div>
    </div>
  )
}
