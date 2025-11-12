interface PlaybackSectionProps {
  audioURL: string
  onDownload: () => void
  onClear: () => void
}

export default function PlaybackSection({ audioURL, onDownload, onClear }: PlaybackSectionProps) {
  if (!audioURL) return null

  return (
    <div className="playback-container">
      <h3>Recording Complete!</h3>
      <audio controls src={audioURL} />
      <div className="playback-controls">
        <button onClick={onDownload} className="btn-download">
          Download Recording
        </button>
        <button onClick={onClear} className="btn-clear">
          Clear
        </button>
      </div>
    </div>
  )
}
