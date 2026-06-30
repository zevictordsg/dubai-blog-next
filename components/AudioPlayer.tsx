'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

const SPEEDS = [1, 1.25, 1.5, 1.75, 2]

interface AudioPlayerProps {
  src:   string
  title: string
}

function formatTime(s: number): string {
  if (!isFinite(s)) return '0:00'
  const m   = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef    = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const [playing,  setPlaying]  = useState(false)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed,    setSpeed]    = useState(0)

  const onTimeUpdate     = useCallback(() => { setCurrent(audioRef.current?.currentTime ?? 0) }, [])
  const onLoadedMetadata = useCallback(() => { setDuration(audioRef.current?.duration ?? 0)  }, [])
  const onEnded          = useCallback(() => setPlaying(false), [])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.addEventListener('timeupdate',     onTimeUpdate)
    el.addEventListener('loadedmetadata', onLoadedMetadata)
    el.addEventListener('ended',          onEnded)
    return () => {
      el.removeEventListener('timeupdate',     onTimeUpdate)
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
      el.removeEventListener('ended',          onEnded)
    }
  }, [onTimeUpdate, onLoadedMetadata, onEnded])

  const togglePlay = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    if (playing) { el.pause(); setPlaying(false) }
    else         { el.play();  setPlaying(true)  }
  }, [playing])

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el  = audioRef.current
    const bar = progressRef.current
    if (!el || !bar) return
    const rect  = bar.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    el.currentTime = ratio * el.duration
  }, [])

  const cycleSpeed = useCallback(() => {
    const next = (speed + 1) % SPEEDS.length
    setSpeed(next)
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next]
  }, [speed])

  const pct = duration > 0 ? (current / duration) * 100 : 0

  // ── No audio yet: show coming-soon state ──────────────────────────────────
  if (!src) {
    return (
      <div className="audio-player" role="region" aria-label="Player de áudio" style={{ opacity: .55, pointerEvents: 'none' }}>
        <div className="audio-play-btn" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 1.5L14 8L3 14.5V1.5Z" fill="rgba(50,50,50,.85)"/>
          </svg>
        </div>
        <span className="audio-label" style={{ flexShrink: 0 }}>{title}</span>
        <div className="audio-progress">
          <div className="audio-bar-wrap"><div className="audio-bar" style={{ width: '0%' }} /></div>
          <span className="audio-time">Em breve</span>
        </div>
        <span className="audio-speed">1×</span>
      </div>
    )
  }

  // ── Full player ───────────────────────────────────────────────────────────
  return (
    <div className="audio-player" role="region" aria-label="Player de áudio">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button className="audio-play-btn" onClick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproduzir'}>
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2"  y="1" width="4" height="14" rx="1.5" fill="rgba(50,50,50,.85)"/>
            <rect x="10" y="1" width="4" height="14" rx="1.5" fill="rgba(50,50,50,.85)"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 1.5L14 8L3 14.5V1.5Z" fill="rgba(50,50,50,.85)"/>
          </svg>
        )}
      </button>

      <span className="audio-label" style={{ flexShrink: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {title}
      </span>

      <div className="audio-progress">
        <div
          ref={progressRef}
          className="audio-bar-wrap"
          onClick={seek}
          role="slider"
          aria-label="Progresso"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
        >
          <div className="audio-bar" style={{ width: `${pct}%` }} />
        </div>
        <span className="audio-time">
          {duration > 0 ? formatTime(duration - current) : '--:--'}
        </span>
      </div>

      <button className="audio-speed" onClick={cycleSpeed} aria-label="Velocidade de reprodução">
        {SPEEDS[speed]}×
      </button>
    </div>
  )
}
