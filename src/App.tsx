import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioURL, setAudioURL] = useState<string>('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string>('')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      // Try to find a supported MIME type
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/mpeg'
      ]
      
      let selectedMimeType = ''
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          console.log('Using MIME type:', mimeType)
          break
        }
      }
      
      const options = selectedMimeType ? { mimeType: selectedMimeType } : {}
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          console.log('Audio chunk received:', event.data.size, 'bytes')
        }
      }

      mediaRecorder.onstop = () => {
        console.log('Recording stopped. Total chunks:', audioChunksRef.current.length)
        const mimeType = selectedMimeType || 'audio/webm'
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        console.log('Created blob:', audioBlob.size, 'bytes, type:', audioBlob.type)
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(100) // Collect data every 100ms
      console.log('Recording started with state:', mediaRecorder.state)
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      startTimer()
    } catch (err) {
      setError('Failed to access microphone. Please grant permission and try again.')
      console.error('Error accessing microphone:', err)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      stopTimer()
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      startTimer()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      stopTimer()
    }
  }

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement('a')
      a.href = audioURL
      a.download = `recording-${new Date().toISOString()}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const clearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }
    setAudioURL('')
    setRecordingTime(0)
  }

  return (
    <div className="App">
      <h1>🎤 Sound Recorder</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="recording-container">
        {isRecording && (
          <div className="recording-indicator">
            <span className={`recording-dot ${isPaused ? 'paused' : ''}`}></span>
            <span className="recording-text">
              {isPaused ? 'Paused' : 'Recording'} - {formatTime(recordingTime)}
            </span>
          </div>
        )}

        <div className="controls">
          {!isRecording ? (
            <button onClick={startRecording} className="btn-start">
              Start Recording
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button onClick={pauseRecording} className="btn-pause">
                  Pause
                </button>
              ) : (
                <button onClick={resumeRecording} className="btn-resume">
                  Resume
                </button>
              )}
              <button onClick={stopRecording} className="btn-stop">
                Stop Recording
              </button>
            </>
          )}
        </div>

        {audioURL && (
          <div className="playback-container">
            <h3>Recording Complete!</h3>
            <audio controls src={audioURL} />
            <div className="playback-controls">
              <button onClick={downloadRecording} className="btn-download">
                Download Recording
              </button>
              <button onClick={clearRecording} className="btn-clear">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="info">
        <p>Click "Start Recording" to begin recording audio from your microphone.</p>
        <p>You can pause, resume, and stop the recording at any time.</p>
      </div>
    </div>
  )
}

export default App
