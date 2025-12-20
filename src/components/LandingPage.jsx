import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/app');
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>🤟 SignLent</h1>
        <p className="tagline">Empowering Communication Through Sign Language</p>
      </header>

      <section className="about-section">
        <h2>About SignLent</h2>
        <p>
          SignLent is an innovative sign language recognition application 
          that uses cutting-edge technology to bridge the communication gap between 
          sign language users and those who don't understand sign language.
        </p>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📹</span>
            <h3>Real-Time Recognition</h3>
            <p>Instantly recognize sign language gestures through your webcam</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <h3>AI-Powered</h3>
            <p>Advanced machine learning models for accurate recognition</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🌐</span>
            <h3>Accessible</h3>
            <p>Easy-to-use interface accessible from any modern web browser</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📚</span>
            <h3>Learning Mode</h3>
            <p>Practice and improve your sign language skills</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Sign in to access the sign language recognition application</p>
        <button className="signin-button" onClick={handleSignIn}>
          Sign In to App
        </button>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 SignLent. Making communication accessible for everyone.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
