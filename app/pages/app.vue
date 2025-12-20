<template>
  <div class="app-page">
    <div class="container">
      <h1 class="page-title text-center mb-4">SignLent Translator</h1>

      <!-- Connection Section -->
      <div class="card connection-card">
        <h2 class="mb-3">
          <span class="icon">🤝</span> Glove Connection
        </h2>
        
        <div v-if="!isConnected" class="connection-status">
          <p class="status-text mb-3">
            <span class="status-indicator disconnected"></span>
            Not Connected
          </p>
          <button @click="connectGloves" class="btn btn-primary" :disabled="isConnecting">
            {{ isConnecting ? 'Connecting...' : 'Connect to Gloves' }}
          </button>
          <p class="help-text mt-2">
            Make sure your Bluetooth is enabled and gloves are powered on.
          </p>
        </div>

        <div v-else class="connection-status">
          <p class="status-text mb-3">
            <span class="status-indicator connected"></span>
            Connected to Sign Language Gloves
          </p>
          <button @click="disconnectGloves" class="btn btn-secondary">
            Disconnect
          </button>
        </div>
      </div>

      <!-- Translation Display -->
      <div class="card translation-card">
        <h2 class="mb-3">
          <span class="icon">💬</span> Translation
        </h2>
        
        <div class="translation-display">
          <p v-if="!currentTranslation" class="placeholder-text">
            Translations will appear here...
          </p>
          <p v-else class="translation-text">
            {{ currentTranslation }}
          </p>
        </div>

        <div class="translation-history mt-3">
          <h3 class="mb-2">History</h3>
          <div v-if="translationHistory.length === 0" class="history-empty">
            No translations yet
          </div>
          <div v-else class="history-list">
            <div 
              v-for="(item, index) in translationHistory" 
              :key="index" 
              class="history-item"
            >
              <span class="history-time">{{ item.time }}</span>
              <span class="history-text">{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <h2 class="section-title mb-3">Translation Features</h2>
        
        <div class="features-grid">
          <!-- Text-to-Speech Feature -->
          <div class="card feature-card">
            <h3 class="mb-2">
              <span class="icon">🔊</span> Text-to-Speech
            </h3>
            <p class="mb-3">
              Enable voice output to hear translations spoken aloud on your device.
            </p>
            
            <div class="feature-controls">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="isSpeechEnabled" 
                  @change="toggleSpeech"
                  class="toggle-checkbox"
                />
                <span class="toggle-slider"></span>
                <span class="toggle-text">
                  {{ isSpeechEnabled ? 'Enabled' : 'Disabled' }}
                </span>
              </label>

              <div v-if="isSpeechEnabled" class="volume-control mt-3">
                <label for="volume">Volume:</label>
                <input 
                  type="range" 
                  id="volume" 
                  v-model="volume" 
                  min="0" 
                  max="100" 
                  class="volume-slider"
                />
                <span class="volume-value">{{ volume }}%</span>
              </div>

              <button 
                v-if="isSpeechEnabled && currentTranslation"
                @click="speakText(currentTranslation)" 
                class="btn btn-secondary mt-3"
              >
                🔊 Test Speech
              </button>
            </div>
          </div>

          <!-- Fullscreen Subtitles Feature -->
          <div class="card feature-card">
            <h3 class="mb-2">
              <span class="icon">📺</span> Fullscreen Subtitles
            </h3>
            <p class="mb-3">
              Display translations in fullscreen mode. Perfect for presentations and secondary displays.
            </p>
            
            <div class="feature-controls">
              <button 
                @click="toggleFullscreen" 
                class="btn btn-primary"
                :disabled="!isConnected"
              >
                {{ isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
              </button>
              
              <p class="help-text mt-2">
                Press ESC to exit fullscreen mode
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Demo Section -->
      <div class="card demo-card" v-if="isConnected">
        <h3 class="mb-3">Demo Mode</h3>
        <p class="mb-3">
          Test the translation features with sample text:
        </p>
        <div class="demo-buttons">
          <button @click="simulateTranslation('Hello')" class="btn btn-secondary">
            Hello
          </button>
          <button @click="simulateTranslation('Thank you')" class="btn btn-secondary">
            Thank you
          </button>
          <button @click="simulateTranslation('How are you?')" class="btn btn-secondary">
            How are you?
          </button>
          <button @click="simulateTranslation('Good morning')" class="btn btn-secondary">
            Good morning
          </button>
        </div>
      </div>
    </div>

    <!-- Fullscreen Subtitle Overlay -->
    <Teleport to="body">
      <div v-if="isFullscreen" class="fullscreen-overlay" @click="exitFullscreen">
        <div class="fullscreen-content">
          <p class="fullscreen-text">
            {{ currentTranslation || 'Waiting for translation...' }}
          </p>
          <p class="fullscreen-hint">Click anywhere or press ESC to exit</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// State
const isConnected = ref(false)
const isConnecting = ref(false)
const currentTranslation = ref('')
const translationHistory = ref([])
const isSpeechEnabled = ref(false)
const volume = ref(80)
const isFullscreen = ref(false)

// Speech Synthesis
let speechSynthesis = null

onMounted(() => {
  if (typeof window !== 'undefined') {
    speechSynthesis = window.speechSynthesis
    
    // Keyboard listener for ESC key
    document.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeyDown)
  }
})

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    exitFullscreen()
  }
}

// Connection functions
const connectGloves = async () => {
  isConnecting.value = true
  
  // Simulate Bluetooth connection
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isConnected.value = true
  isConnecting.value = false
  
  // Add connection message
  addToHistory('Connected to gloves')
}

const disconnectGloves = () => {
  isConnected.value = false
  currentTranslation.value = ''
  addToHistory('Disconnected from gloves')
}

// Translation functions
const simulateTranslation = (text) => {
  currentTranslation.value = text
  addToHistory(text)
  
  if (isSpeechEnabled.value) {
    speakText(text)
  }
}

const addToHistory = (text) => {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  translationHistory.value.unshift({
    text,
    time
  })
  
  // Keep only last 10 items
  if (translationHistory.value.length > 10) {
    translationHistory.value = translationHistory.value.slice(0, 10)
  }
}

// Text-to-Speech functions
const toggleSpeech = () => {
  if (isSpeechEnabled.value && currentTranslation.value) {
    speakText(currentTranslation.value)
  }
}

const speakText = (text) => {
  if (!speechSynthesis) return
  
  // Cancel any ongoing speech
  speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.volume = volume.value / 100
  utterance.rate = 1
  utterance.pitch = 1
  
  speechSynthesis.speak(utterance)
}

// Fullscreen functions
const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exitFullscreen()
  } else {
    enterFullscreen()
  }
}

const enterFullscreen = () => {
  isFullscreen.value = true
  
  // Request fullscreen API if available
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {
      // Fallback to CSS fullscreen
    })
  }
}

const exitFullscreen = () => {
  isFullscreen.value = false
  
  if (document.exitFullscreen && document.fullscreenElement) {
    document.exitFullscreen()
  }
}
</script>

<style scoped>
.app-page {
  animation: fadeIn 0.5s ease-in;
}

.page-title {
  font-size: 2.5rem;
  color: var(--color-cream);
  margin-top: 1rem;
}

.connection-card {
  background: linear-gradient(135deg, var(--color-slate) 0%, var(--color-slate-light) 100%);
}

.connection-status {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-text {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-cream);
}

.status-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2s infinite;
}

.status-indicator.connected {
  background-color: #4ade80;
}

.status-indicator.disconnected {
  background-color: #ef4444;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.help-text {
  color: var(--color-slate-light);
  font-size: 0.9rem;
  text-align: center;
}

.translation-card {
  margin-top: 2rem;
}

.translation-display {
  background-color: var(--color-navy);
  border-radius: 8px;
  padding: 2rem;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  color: var(--color-slate-light);
  font-style: italic;
}

.translation-text {
  font-size: 2rem;
  color: var(--color-cream);
  text-align: center;
  font-weight: 500;
}

.translation-history h3 {
  color: var(--color-cream);
  font-size: 1.25rem;
}

.history-empty {
  color: var(--color-slate-light);
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  background-color: var(--color-navy);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.history-time {
  color: var(--color-slate-light);
  font-size: 0.85rem;
  min-width: 60px;
}

.history-text {
  color: var(--color-cream);
  flex: 1;
}

.features-section {
  margin-top: 2rem;
}

.section-title {
  color: var(--color-cream);
  font-size: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card h3 {
  color: var(--color-cream);
  font-size: 1.5rem;
}

.feature-card p {
  color: var(--color-slate-light);
  line-height: 1.6;
}

.icon {
  font-size: 1.5rem;
}

.feature-controls {
  display: flex;
  flex-direction: column;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.toggle-checkbox {
  position: relative;
  width: 50px;
  height: 26px;
  appearance: none;
  background-color: var(--color-navy);
  border-radius: 13px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-checkbox:checked {
  background-color: var(--color-burgundy);
}

.toggle-checkbox::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--color-cream);
  top: 3px;
  left: 3px;
  transition: transform 0.3s;
}

.toggle-checkbox:checked::before {
  transform: translateX(24px);
}

.toggle-text {
  color: var(--color-cream);
  font-weight: 500;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.volume-control label {
  color: var(--color-cream);
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background-color: var(--color-navy);
  outline: none;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--color-burgundy);
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--color-burgundy);
  cursor: pointer;
  border: none;
}

.volume-value {
  color: var(--color-cream);
  min-width: 45px;
  font-weight: 500;
}

.demo-card {
  margin-top: 2rem;
  background: linear-gradient(135deg, var(--color-burgundy) 0%, #A02F42 100%);
}

.demo-card h3 {
  color: var(--color-cream);
}

.demo-card p {
  color: var(--color-cream);
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Fullscreen Overlay */
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-navy);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  animation: fadeIn 0.3s ease-in;
}

.fullscreen-content {
  text-align: center;
  padding: 2rem;
}

.fullscreen-text {
  font-size: 5rem;
  font-weight: bold;
  color: var(--color-cream);
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.fullscreen-hint {
  font-size: 1.5rem;
  color: var(--color-slate-light);
  opacity: 0.7;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .translation-text {
    font-size: 1.5rem;
  }

  .fullscreen-text {
    font-size: 3rem;
  }

  .fullscreen-hint {
    font-size: 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .demo-buttons {
    flex-direction: column;
  }
}
</style>
