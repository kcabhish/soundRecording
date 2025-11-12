interface RecordingControlsProps {
  isRecording: boolean
  isPaused: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

export default function RecordingControls({
  isRecording,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop
}: RecordingControlsProps) {
  return (
    <div className="controls">
      {!isRecording ? (
        <button onClick={onStart} className="btn-start">
          Start Recording
        </button>
      ) : (
        <>
          {!isPaused ? (
            <button onClick={onPause} className="btn-pause">
              Pause
            </button>
          ) : (
            <button onClick={onResume} className="btn-resume">
              Resume
            </button>
          )}
          <button onClick={onStop} className="btn-stop">
            Stop Recording
          </button>
        </>
      )}
    </div>
  )
}
