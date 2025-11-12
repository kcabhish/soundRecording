import { useState } from 'react'

interface TranscriptionDisplayProps {
  transcript: string
  interimTranscript: string
  isTranscribing: boolean
  onCopy: () => Promise<boolean>
  onDownload: () => void
}

function TranscriptionDisplay({ 
  transcript, 
  interimTranscript, 
  isTranscribing,
  onCopy,
  onDownload 
}: TranscriptionDisplayProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = async () => {
    const success = await onCopy()
    if (success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  if (!transcript && !interimTranscript && !isTranscribing) {
    return null
  }

  return (
    <div className="transcription-section">
      <div className="transcription-header">
        <h3>📝 Transcription</h3>
        {isTranscribing && <span className="transcription-status">Listening...</span>}
      </div>
      
      <div className="transcription-content">
        <div className="transcript-text">
          {transcript && <span className="final-transcript">{transcript}</span>}
          {interimTranscript && (
            <span className="interim-transcript">{interimTranscript}</span>
          )}
          {!transcript && !interimTranscript && (
            <span className="transcript-placeholder">
              Start speaking to see transcription...
            </span>
          )}
        </div>
      </div>

      {transcript && (
        <div className="transcription-actions">
          <button 
            onClick={handleCopy}
            className="btn btn-secondary"
            disabled={!transcript}
          >
            {copySuccess ? '✓ Copied!' : '📋 Copy'}
          </button>
          <button 
            onClick={onDownload}
            className="btn btn-secondary"
            disabled={!transcript}
          >
            💾 Download
          </button>
        </div>
      )}
    </div>
  )
}

export default TranscriptionDisplay
