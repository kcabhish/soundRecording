import './App.css'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import ErrorMessage from './components/ErrorMessage'
import RecordingIndicator from './components/RecordingIndicator'
import RecordingControls from './components/RecordingControls'
import PlaybackSection from './components/PlaybackSection'
import InfoSection from './components/InfoSection'
import TranscriptionMethodSelector from './components/TranscriptionMethodSelector'
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
    transcriptionMethod,
    whisperApiKey,
    isSpeechRecognitionSupported,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    downloadRecording,
    clearRecording,
    setTranscriptionMethod,
    saveWhisperApiKey,
    transcribeWithWhisper,
    downloadTranscript,
    copyTranscript
  } = useAudioRecorder()

  return (
    <div className="App">
      <h1>🎤 Sound Recorder</h1>
      
      <ErrorMessage message={error} />

      <div className="recording-container">
        <TranscriptionMethodSelector
          currentMethod={transcriptionMethod}
          onMethodChange={setTranscriptionMethod}
          whisperApiKey={whisperApiKey}
          onApiKeySave={saveWhisperApiKey}
          isSpeechRecognitionSupported={isSpeechRecognitionSupported}
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
          transcriptionMethod={transcriptionMethod}
          hasAudio={!!audioURL}
          onCopy={copyTranscript}
          onDownload={downloadTranscript}
          onTranscribeWithWhisper={transcribeWithWhisper}
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
