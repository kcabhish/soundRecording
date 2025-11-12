import './App.css'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import ErrorMessage from './components/ErrorMessage'
import RecordingIndicator from './components/RecordingIndicator'
import RecordingControls from './components/RecordingControls'
import PlaybackSection from './components/PlaybackSection'
import InfoSection from './components/InfoSection'

function App() {
  const {
    isRecording,
    isPaused,
    audioURL,
    recordingTime,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    downloadRecording,
    clearRecording
  } = useAudioRecorder()

  return (
    <div className="App">
      <h1>🎤 Sound Recorder</h1>
      
      <ErrorMessage message={error} />

      <div className="recording-container">
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
