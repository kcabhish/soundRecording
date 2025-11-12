interface RecordingIndicatorProps {
  isPaused: boolean
  recordingTime: number
}

export default function RecordingIndicator({ isPaused, recordingTime }: RecordingIndicatorProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="recording-indicator">
      <span className={`recording-dot ${isPaused ? 'paused' : ''}`}></span>
      <span className="recording-text">
        {isPaused ? 'Paused' : 'Recording'} - {formatTime(recordingTime)}
      </span>
    </div>
  )
}
