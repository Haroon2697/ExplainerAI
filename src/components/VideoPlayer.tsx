import { useCallback, useRef, useState } from 'react'
import { Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { cn, labelFromSeconds } from '@/lib/utils'

/**
 * Lightweight custom player. The chrome is ours (so it matches the product),
 * but playback is a plain <video> — no library, no wrapper state machine.
 */
export function VideoPlayer({
  src,
  poster,
  className,
}: {
  src: string | null
  poster?: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [failed, setFailed] = useState(false)

  const toggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }, [])

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !duration) return
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    video.currentTime = ratio * duration
  }

  if (!src || failed) {
    return (
      <div
        className={cn(
          'relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-ink-200 bg-ink-900',
          className,
        )}
      >
        <div className="absolute inset-0 grid-bg opacity-10" aria-hidden />
        <div className="relative text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-inset ring-white/15">
            <Play className="ml-0.5 h-6 w-6" />
          </span>
          <p className="text-sm font-semibold text-white">
            {src ? 'Preview unavailable offline' : 'Render not finished yet'}
          </p>
          <p className="mt-1 text-[12.5px] text-white/60">
            {src ? 'The sample stream could not load in this environment.' : 'The video appears here once composing completes.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative aspect-video w-full overflow-hidden rounded-2xl border border-ink-200 bg-ink-950 shadow-card',
        className,
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onClick={toggle}
        onError={() => setFailed(true)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => {
          const video = e.currentTarget
          setCurrent(video.currentTime)
          setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0)
        }}
        onEnded={() => setPlaying(false)}
      />

      {/* Centre play affordance, hidden while playing */}
      {!playing && (
        <button
          onClick={toggle}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-ink-950/30 transition-colors hover:bg-ink-950/40"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-pop transition-transform duration-300 ease-smooth hover:scale-105">
            <Play className="ml-1 h-7 w-7 fill-current" />
          </span>
        </button>
      )}

      {/* Control bar */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300',
          playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100',
        )}
      >
        <div onClick={seek} className="group/bar mb-2.5 cursor-pointer py-1.5">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/25 transition-all duration-200 group-hover/bar:h-1.5">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3 text-white">
          <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="transition-opacity hover:opacity-80">
            {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          </button>

          <button
            onClick={() => {
              const video = videoRef.current
              if (!video) return
              video.muted = !video.muted
              setMuted(video.muted)
            }}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="transition-opacity hover:opacity-80"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <span className="font-mono text-[11px] tabular-nums text-white/80">
            {labelFromSeconds(current)} / {labelFromSeconds(duration)}
          </span>

          <button
            onClick={() => void videoRef.current?.requestFullscreen?.()}
            aria-label="Fullscreen"
            className="ml-auto transition-opacity hover:opacity-80"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
