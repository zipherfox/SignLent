<template>
  <div class="home-page">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Welcome to SignLent</h1>
          <p class="hero-subtitle">
            Breaking barriers in communication by translating sign language in real-time
          </p>
          <div class="hero-buttons">
            <NuxtLink to="/app" class="btn btn-primary">Get Started</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title text-center mb-4">How It Works</h2>
        
        <div class="features-grid">
          <div class="card feature-card">
            <div class="feature-icon">🤝</div>
            <h3>Connect Your Gloves</h3>
            <p>
              Pair your smart sign language gloves with the web app through Bluetooth 
              to start capturing sign language gestures.
            </p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon">🔊</div>
            <h3>Text-to-Speech</h3>
            <p>
              Translated words are spoken aloud through your device's speakers, 
              perfect for mobile and tablet users on the go.
            </p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon">📺</div>
            <h3>Fullscreen Subtitles</h3>
            <p>
              Display large, easy-to-read subtitles in fullscreen mode. 
              Use your device as a secondary display for presentations or conversations.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="about">
      <div class="container">
        <div class="card">
          <h2 class="mb-3">About SignLent</h2>
          <p class="mb-2">
            SignLent is designed to help people who don't understand sign language 
            communicate more effectively with the deaf and hard-of-hearing community. 
            Our technology bridges the communication gap through multiple translation methods.
          </p>
          <p class="mb-2">
            Whether you're in a meeting, giving a presentation, or having a casual conversation, 
            SignLent provides flexible options to make communication accessible to everyone.
          </p>
          <p>
            <strong>Key Features:</strong>
          </p>
          <ul class="feature-list">
            <li>Real-time sign language translation</li>
            <li>Voice output for audio accessibility</li>
            <li>Large subtitle display for visual accessibility</li>
            <li>Bluetooth connectivity for wireless operation</li>
            <li>Cross-platform compatibility (desktop, tablet, mobile)</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container text-center">
        <h2 class="mb-3">Ready to Get Started?</h2>
        <p class="mb-4">
          Launch the app and connect your sign language gloves to begin translating.
        </p>
        <NuxtLink to="/app" class="btn btn-primary">Launch Application</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.hero {
  padding: 4rem 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: var(--color-cream);
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--color-slate-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.features {
  padding: 4rem 0;
}

.section-title {
  font-size: 2.5rem;
  color: var(--color-cream);
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: var(--color-cream);
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--color-slate-light);
  line-height: 1.6;
}

.about {
  padding: 2rem 0;
}

.about h2 {
  color: var(--color-cream);
  font-size: 2rem;
}

.about p {
  color: var(--color-slate-light);
  line-height: 1.8;
  font-size: 1.1rem;
}

.feature-list {
  margin-top: 1rem;
  padding-left: 2rem;
  color: var(--color-slate-light);
  line-height: 2;
}

.feature-list li {
  margin-bottom: 0.5rem;
}

.cta {
  padding: 4rem 0;
}

.cta h2 {
  font-size: 2.5rem;
  color: var(--color-cream);
}

.cta p {
  font-size: 1.25rem;
  color: var(--color-slate-light);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
