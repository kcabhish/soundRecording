import { useState } from 'react'
import { TranscriptionMethod } from '../hooks/useAudioRecorder'

interface TranscriptionMethodSelectorProps {
  currentMethod: TranscriptionMethod
  onMethodChange: (method: TranscriptionMethod) => void
  whisperApiKey: string
  onApiKeySave: (key: string) => void
  isSpeechRecognitionSupported: boolean
  disabled?: boolean
}

function TranscriptionMethodSelector({
  currentMethod,
  onMethodChange,
  whisperApiKey,
  onApiKeySave,
  isSpeechRecognitionSupported,
  disabled = false
}: TranscriptionMethodSelectorProps) {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState(whisperApiKey)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleMethodChange = (method: TranscriptionMethod) => {
    onMethodChange(method)
    if (method === 'whisper' && !whisperApiKey) {
      setShowApiKeyInput(true)
    }
  }

  const handleSaveApiKey = () => {
    onApiKeySave(apiKeyInput)
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      setShowApiKeyInput(false)
    }, 2000)
  }

  return (
    <div className="transcription-method-selector">
      <h3>🎯 Transcription Method</h3>
      
      <div className="method-options">
        <label className={`method-option ${currentMethod === 'none' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="transcription-method"
            value="none"
            checked={currentMethod === 'none'}
            onChange={() => handleMethodChange('none')}
            disabled={disabled}
          />
          <div className="method-info">
            <span className="method-name">🚫 None</span>
            <span className="method-description">No transcription</span>
          </div>
        </label>

        <label className={`method-option ${currentMethod === 'webspeech' ? 'selected' : ''} ${!isSpeechRecognitionSupported ? 'disabled' : ''}`}>
          <input
            type="radio"
            name="transcription-method"
            value="webspeech"
            checked={currentMethod === 'webspeech'}
            onChange={() => handleMethodChange('webspeech')}
            disabled={disabled || !isSpeechRecognitionSupported}
          />
          <div className="method-info">
            <span className="method-name">🎤 Web Speech API</span>
            <span className="method-description">
              Real-time transcription (Chrome/Edge only, Free)
            </span>
          </div>
        </label>

        <label className={`method-option ${currentMethod === 'whisper' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="transcription-method"
            value="whisper"
            checked={currentMethod === 'whisper'}
            onChange={() => handleMethodChange('whisper')}
            disabled={disabled}
          />
          <div className="method-info">
            <span className="method-name">🤖 OpenAI Whisper</span>
            <span className="method-description">
              High-quality post-recording transcription (Requires API key, ~$0.006/min)
            </span>
          </div>
        </label>
      </div>

      {!isSpeechRecognitionSupported && (
        <div className="warning-message">
          ⚠️ Web Speech API is not supported in this browser. Use Chrome or Edge for real-time transcription.
        </div>
      )}

      {currentMethod === 'whisper' && (
        <div className="whisper-config">
          <div className="api-key-status">
            {whisperApiKey ? (
              <div className="key-configured">
                <span>✓ API Key Configured</span>
                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="btn-text"
                  disabled={disabled}
                >
                  {showApiKeyInput ? 'Hide' : 'Change'}
                </button>
              </div>
            ) : (
              <div className="key-missing">
                <span>⚠️ API Key Required</span>
                <button
                  onClick={() => setShowApiKeyInput(true)}
                  className="btn-primary-small"
                  disabled={disabled}
                >
                  Configure
                </button>
              </div>
            )}
          </div>

          {showApiKeyInput && (
            <div className="api-key-input-section">
              <label htmlFor="whisper-api-key">OpenAI API Key:</label>
              <div className="api-key-input-group">
                <input
                  id="whisper-api-key"
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-..."
                  className="api-key-input"
                  disabled={disabled}
                />
                <button
                  onClick={handleSaveApiKey}
                  className="btn-primary-small"
                  disabled={!apiKeyInput || disabled}
                >
                  {saveSuccess ? '✓ Saved' : 'Save'}
                </button>
              </div>
              <p className="api-key-note">
                Your API key is stored locally in your browser. Get your key from{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                  OpenAI Platform
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TranscriptionMethodSelector
