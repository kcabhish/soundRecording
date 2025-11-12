import { useState, useRef, useEffect } from 'react'

// Extend Window interface for webkit prefix
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioURL, setAudioURL] = useState<string>('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string>('')
  const [transcript, setTranscript] = useState<string>('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState<string>('')
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize speech recognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let interim = ''
        let final = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcriptPiece + ' '
          } else {
            interim += transcriptPiece
          }
        }

        if (final) {
          setTranscript(prev => prev + final)
        }
        setInterimTranscript(interim)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setError(`Transcription error: ${event.error}`)
        }
      }

      recognition.onend = () => {
        // Restart recognition if still recording and transcription is enabled
        if (isRecording && !isPaused && transcriptionEnabled && recognitionRef.current) {
          try {
            recognition.start()
          } catch (e) {
            console.log('Recognition restart failed:', e)
          }
        } else {
          setIsTranscribing(false)
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.log('Error stopping recognition:', e)
        }
      }
    }
  }, [])

  // Handle transcription state changes
  useEffect(() => {
    if (!recognitionRef.current) return

    if (isRecording && transcriptionEnabled && !isPaused) {
      try {
        recognitionRef.current.start()
        setIsTranscribing(true)
      } catch (e: any) {
        if (e.message !== 'recognition already started') {
          console.error('Error starting recognition:', e)
        }
      }
    } else {
      try {
        recognitionRef.current.stop()
        setIsTranscribing(false)
        setInterimTranscript('')
      } catch (e) {
        console.log('Error stopping recognition:', e)
      }
    }
  }, [isRecording, isPaused, transcriptionEnabled])

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
    setTranscript('')
    setInterimTranscript('')
  }

  const toggleTranscription = () => {
    setTranscriptionEnabled(prev => !prev)
  }

  const downloadTranscript = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transcript-${new Date().toISOString()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const copyTranscript = async () => {
    if (transcript) {
      try {
        await navigator.clipboard.writeText(transcript)
        return true
      } catch (err) {
        console.error('Failed to copy transcript:', err)
        return false
      }
    }
    return false
  }

  const isSpeechRecognitionSupported = () => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  }

  return {
    isRecording,
    isPaused,
    audioURL,
    recordingTime,
    error,
    transcript,
    interimTranscript,
    isTranscribing,
    transcriptionEnabled,
    isSpeechRecognitionSupported: isSpeechRecognitionSupported(),
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    downloadRecording,
    clearRecording,
    toggleTranscription,
    downloadTranscript,
    copyTranscript
  }
}
