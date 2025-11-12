import { useState } from 'react'
import { TranscriptionMethod } from '../hooks/useAudioRecorder'

interface TranscriptionDisplayProps {
  transcript: string
  interimTranscript: string
  isTranscribing: boolean
  transcriptionMethod: TranscriptionMethod
  hasAudio: boolean
  onCopy: () => Promise<boolean>
  onDownload: () => void
  onTranscribeWithWhisper?: () => void
}

function TranscriptionDisplay({ 
  transcript, 
  interimTranscript, 
  isTranscribing,
  transcriptionMethod,
  hasAudio,
  onCopy,
  onDownload,
  onTranscribeWithWhisper
}: TranscriptionDisplayProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = async () => {
    const success = await onCopy()
    if (success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  // Show section if there's content or if Whisper method is selected with audio
  const shouldShow = transcript || interimTranscript || isTranscribing || 
    (transcriptionMethod === 'whisper' && hasAudio)

  if (!shouldShow) {
    return null
  }

  return (
    <div className="transcription-section">
      <div className="transcription-header">
        <h3>📝 Transcription</h3>
        {isTranscribing && transcriptionMethod === 'webspeech' && (
          <span className="transcription-status">Listening...</span>
        )}
        {isTranscribing && transcriptionMethod === 'whisper' && (
          <span className="transcription-status">Processing...</span>
        )}
      </div>
      
      {/* Whisper transcribe button */}
      {transcriptionMethod === 'whisper' && hasAudio && !transcript && !isTranscribing && (
        <div className="whisper-transcribe-section">
          <p className="transcribe-prompt">Recording complete. Click below to transcribe with Whisper API.</p>
          <button
            onClick={onTranscribeWithWhisper}
            className="btn-primary"
          >
            🤖 Transcribe with Whisper
          </button>
        </div>
      )}

      {/* Transcription content */}
      {(transcript || interimTranscript || (isTranscribing && transcriptionMethod === 'webspeech')) && (
        <div className="transcription-content">
          <div className="transcript-text">
            {transcript && <span className="final-transcript">{transcript}</span>}
            {interimTranscript && (
              <span className="interim-transcript">{interimTranscript}</span>
            )}
            {!transcript && !interimTranscript && transcriptionMethod === 'webspeech' && (
              <span className="transcript-placeholder">
                Start speaking to see transcription...
              </span>
            )}
          </div>
        </div>
      )}

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
