import './App.css'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import ErrorMessage from './components/ErrorMessage'
import RecordingIndicator from './components/RecordingIndicator'
import RecordingControls from './components/RecordingControls'
import PlaybackSection from './components/PlaybackSection'
import InfoSection from './components/InfoSection'
import TranscriptionToggle from './components/TranscriptionToggle'
import TranscriptionDisplay from './components/TranscriptionDisplay'

function App() {
  const {
    isRecording,
    isPaused,
    audioURL,
    recordingTime,
    error,
    transcript,
    interimTranscript,
    isTranscribing,
    transcriptionEnabled,
    isSpeechRecognitionSupported,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    downloadRecording,
    clearRecording,
    toggleTranscription,
    downloadTranscript,
    copyTranscript
  } = useAudioRecorder()

  return (
    <div className="App">
      <h1>🎤 Sound Recorder</h1>
      
      <ErrorMessage message={error} />

      <div className="recording-container">
        <TranscriptionToggle
          enabled={transcriptionEnabled}
          onToggle={toggleTranscription}
          isSupported={isSpeechRecognitionSupported}
          disabled={isRecording}
        />

        {isRecording && (
          <RecordingIndicator 
            isPaused={isPaused} 
            recordingTime={recordingTime} 
          />
        )}

        <RecordingControls
          isRecording={isRecording}
          isPaused={isPaused}
          onStart={startRecording}
          onPause={pauseRecording}
          onResume={resumeRecording}
          onStop={stopRecording}
        />

        <TranscriptionDisplay
          transcript={transcript}
          interimTranscript={interimTranscript}
          isTranscribing={isTranscribing}
          onCopy={copyTranscript}
          onDownload={downloadTranscript}
        />

        <PlaybackSection
          audioURL={audioURL}
          onDownload={downloadRecording}
          onClear={clearRecording}
        />
      </div>

      <InfoSection />
    </div>
  )
}

export default App
