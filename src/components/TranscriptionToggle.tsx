interface TranscriptionToggleProps {
  enabled: boolean
  onToggle: () => void
  isSupported: boolean
  disabled?: boolean
}

function TranscriptionToggle({ 
  enabled, 
  onToggle, 
  isSupported,
  disabled = false 
}: TranscriptionToggleProps) {
  if (!isSupported) {
    return (
      <div className="transcription-toggle">
        <div className="unsupported-message">
          ⚠️ Speech recognition is not supported in this browser. 
          Please use Chrome or Edge for transcription features.
        </div>
      </div>
    )
  }

  return (
    <div className="transcription-toggle">
      <label className="toggle-label">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          disabled={disabled}
          className="toggle-checkbox"
        />
        <span className="toggle-text">
          {enabled ? '🎤 Transcription On' : '🔇 Transcription Off'}
        </span>
      </label>
      {enabled && (
        <span className="toggle-hint">
          Real-time speech-to-text will start when you begin recording
        </span>
      )}
    </div>
  )
}

export default TranscriptionToggle
