import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InternalApp.css';

function InternalApp() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const handleStartRecording = () => {
    setIsRecording(true);
    // Placeholder for actual recognition logic
    setTimeout(() => {
      setRecognizedText('Hello! Welcome to SignLent.');
      setIsRecording(false);
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="internal-app-container">
      <header className="app-header">
        <h1>🤟 SignLent Recognition</h1>
        <button className="logout-button" onClick={handleLogout}>
          Back to Home
        </button>
      </header>

      <main className="app-main">
        <section className="video-section">
          <h2>Camera Feed</h2>
          <div className="video-placeholder">
            <div className="camera-icon">📹</div>
            <p>Camera feed will appear here</p>
            <p className="note">
              Note: This is a placeholder. Actual implementation would use webcam access.
            </p>
          </div>
        </section>

        <section className="controls-section">
          <h2>Controls</h2>
          <div className="control-buttons">
            {!isRecording ? (
              <button className="start-button" onClick={handleStartRecording}>
                Start Recognition
              </button>
            ) : (
              <button className="stop-button" onClick={handleStopRecording}>
                Stop Recognition
              </button>
            )}
          </div>
          {isRecording && (
            <div className="recording-indicator">
              <span className="pulse"></span>
              <span>Recording...</span>
            </div>
          )}
        </section>

        <section className="output-section">
          <h2>Recognized Text</h2>
          <div className="output-display">
            {recognizedText ? (
              <p className="recognized-text">{recognizedText}</p>
            ) : (
              <p className="placeholder-text">
                Recognized sign language will appear here...
              </p>
            )}
          </div>
        </section>

        <section className="instructions-section">
          <h3>How to Use:</h3>
          <ol>
            <li>Allow camera access when prompted</li>
            <li>Position yourself in front of the camera</li>
            <li>Click "Start Recognition" to begin</li>
            <li>Perform sign language gestures</li>
            <li>View the recognized text in real-time</li>
          </ol>
        </section>
      </main>
    </div>
  );
}

export default InternalApp;
