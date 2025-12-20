<template>
  <div class="min-h-screen px-6 lg:px-12 py-12 lg:py-16">
    <div class="container mx-auto max-w-8xl">
      <div class="text-center mb-16 animate-fade-in-down">
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6">SignLent App</h1>
        <p class="text-xl lg:text-2xl text-cream/70">Connect your gloves and start translating</p>
      </div>

      <!-- Connection Status -->
      <div class="card mb-10 text-center p-10 lg:p-12 max-w-4xl mx-auto animate-scale-in">
        <div class="flex items-center justify-center gap-6 mb-8">
          <div :class="[
            'w-5 h-5 lg:w-6 lg:h-6 rounded-full transition-all duration-500',
            isConnected ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'
          ]"></div>
          <h2 class="text-3xl lg:text-4xl font-bold text-cream transition-all duration-500">
            {{ isConnected ? 'Connected' : 'Not Connected' }}
          </h2>
        </div>
        
        <button 
          v-if="!isConnected"
          @click="connectGloves"
          :disabled="isConnecting"
          class="btn-primary text-lg transition-all duration-500"
          :class="{ 'animate-pulse': isConnecting }"
        >
          <span class="flex items-center gap-2">
            <Icon name="mdi:bluetooth" class="w-6 h-6 transition-transform duration-300" :class="{ 'animate-spin': isConnecting }" />
            {{ isConnecting ? 'Connecting...' : 'Connect Gloves' }}
          </span>
        </button>
        
        <button 
          v-else
          @click="disconnectGloves"
          class="btn-secondary text-lg transition-all duration-500 hover:bg-red-600"
        >
          <span class="flex items-center gap-2">
            <Icon name="mdi:bluetooth-off" class="w-6 h-6" />
            Disconnect
          </span>
        </button>
      </div>

      <!-- Translation Display -->
      <div v-if="isConnected" class="space-y-8 lg:space-y-10">
        <!-- Mode Selection -->
        <div class="card p-8 lg:p-10 animate-fade-in-up">
          <h3 class="text-2xl lg:text-3xl font-bold text-cream mb-6">Translation Mode</h3>
          <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
            <button
              @click="translationMode = 'speech'"
              :class="[
                'p-6 lg:p-8 rounded-lg border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1',
                translationMode === 'speech' 
                  ? 'border-burgundy bg-burgundy/20 shadow-lg shadow-burgundy/30' 
                  : 'border-slate-blue/30 hover:border-slate-blue hover:shadow-lg'
              ]"
            >
              <Icon name="mdi:microphone" class="w-12 h-12 lg:w-14 lg:h-14 mx-auto mb-4 transition-all duration-300" :class="translationMode === 'speech' ? 'text-burgundy animate-pulse-slow' : 'text-cream'" />
              <p class="font-semibold text-cream text-lg lg:text-xl">Text-to-Speech</p>
            </button>
            
            <button
              @click="translationMode = 'subtitle'"
              :class="[
                'p-6 lg:p-8 rounded-lg border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1',
                translationMode === 'subtitle' 
                  ? 'border-burgundy bg-burgundy/20 shadow-lg shadow-burgundy/30' 
                  : 'border-slate-blue/30 hover:border-slate-blue hover:shadow-lg'
              ]"
            >
              <Icon name="mdi:television" class="w-12 h-12 lg:w-14 lg:h-14 mx-auto mb-4 transition-all duration-300" :class="translationMode === 'subtitle' ? 'text-burgundy animate-pulse-slow' : 'text-cream'" />
              <p class="font-semibold text-cream text-lg lg:text-xl">Fullscreen Subtitles</p>
            </button>
            
            <button
              @click="translationMode = 'both'"
              :class="[
                'p-6 lg:p-8 rounded-lg border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1',
                translationMode === 'both' 
                  ? 'border-burgundy bg-burgundy/20 shadow-lg shadow-burgundy/30' 
                  : 'border-slate-blue/30 hover:border-slate-blue hover:shadow-lg'
              ]"
            >
              <Icon name="mdi:format-list-bulleted-type" class="w-12 h-12 lg:w-14 lg:h-14 mx-auto mb-4 transition-all duration-300" :class="translationMode === 'both' ? 'text-burgundy animate-pulse-slow' : 'text-cream'" />
              <p class="font-semibold text-cream text-lg lg:text-xl">Both</p>
            </button>
          </div>
        </div>

        <!-- Translation Output -->
        <div class="card p-8 lg:p-10 animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl lg:text-3xl font-bold text-cream">Live Translation</h3>
            <button
              @click="showFullscreen = true"
              v-if="translationMode !== 'speech'"
              class="btn-secondary py-3 px-6 text-lg"
            >
              <span class="flex items-center gap-2">
                <Icon name="mdi:fullscreen" class="w-6 h-6" />
                Fullscreen
              </span>
            </button>
          </div>
          
          <div class="bg-navy-deeper rounded-lg p-8 lg:p-12 min-h-[250px] lg:min-h-[300px] flex items-center justify-center">
            <p class="text-3xl md:text-4xl lg:text-5xl text-center text-cream animate-fade-in leading-tight">
              {{ currentTranslation || 'Start signing to see translation...' }}
            </p>
          </div>
          
          <div class="mt-6 flex flex-wrap items-center gap-4 lg:gap-6">
            <button
              @click="toggleSpeech"
              :class="[
                'flex items-center gap-2 py-3 px-6 rounded-lg transition-all duration-300 text-lg',
                speechEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-blue hover:bg-navy-dark'
              ]"
            >
              <Icon :name="speechEnabled ? 'mdi:volume-high' : 'mdi:volume-off'" class="w-6 h-6" />
              <span>{{ speechEnabled ? 'Mute' : 'Enable Speech' }}</span>
            </button>
            
            <button
              @click="clearTranslation"
              class="btn-secondary py-3 px-6 text-lg"
            >
              <span class="flex items-center gap-2">
                <Icon name="mdi:delete" class="w-6 h-6" />
                Clear
              </span>
            </button>
          </div>
        </div>

        <!-- Settings and History Grid -->
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-10">
          <!-- Settings -->
          <div class="card p-8 lg:p-10">
            <h3 class="text-2xl lg:text-3xl font-bold text-cream mb-6">Settings</h3>
            
            <div class="space-y-8">
              <!-- Voice Speed -->
              <div>
                <label class="block text-cream mb-3 text-lg">Voice Speed</label>
                <input 
                  v-model="voiceSpeed" 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1"
                  class="w-full accent-burgundy h-3"
                />
                <p class="text-cream/50 text-base mt-2">{{ voiceSpeed }}x</p>
              </div>
              
              <!-- Font Size -->
              <div>
                <label class="block text-cream mb-3 text-lg">Subtitle Font Size</label>
                <input 
                  v-model="fontSize" 
                  type="range" 
                  min="24" 
                  max="72" 
                  step="4"
                  class="w-full accent-burgundy h-3"
                />
                <p class="text-cream/50 text-base mt-2">{{ fontSize }}px</p>
              </div>
              
              <!-- Auto-clear -->
              <div class="flex items-center justify-between">
                <label class="text-cream text-lg">Auto-clear after translation</label>
                <button
                  @click="autoClear = !autoClear"
                  :class="[
                    'w-14 h-7 rounded-full transition-all duration-300 relative',
                    autoClear ? 'bg-green-500' : 'bg-slate-blue'
                  ]"
                >
                  <div
                    :class="[
                      'w-6 h-6 rounded-full bg-white absolute top-0.5 transition-all duration-300',
                      autoClear ? 'left-7' : 'left-0.5'
                    ]"
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Translation History -->
          <div class="card p-8 lg:p-10">
            <h3 class="text-2xl lg:text-3xl font-bold text-cream mb-6">Translation History</h3>
            <div class="space-y-3 max-h-80 overflow-y-auto">
              <div
                v-for="(item, index) in translationHistory"
                :key="index"
                class="bg-navy-deeper rounded p-4 text-cream/70 hover:bg-navy-deeper/50 transition-colors duration-300"
              >
                <span class="text-sm text-cream/40">{{ item.time }}</span>
                <p class="text-lg">{{ item.text }}</p>
              </div>
              <p v-if="translationHistory.length === 0" class="text-cream/50 text-center py-8 text-lg">
                No translations yet
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Getting Started Guide -->
      <div v-else class="grid md:grid-cols-2 gap-8 lg:gap-10 mt-10">
        <div class="card p-8 lg:p-10">
          <Icon name="mdi:information" class="w-16 h-16 lg:w-20 lg:h-20 text-burgundy mb-6" />
          <h3 class="text-2xl lg:text-3xl font-bold text-cream mb-4">Getting Started</h3>
          <ol class="text-cream/70 space-y-3 list-decimal list-inside text-lg">
            <li>Turn on your SignLent smart gloves</li>
            <li>Click the "Connect Gloves" button above</li>
            <li>Select your device from the Bluetooth list</li>
            <li>Wait for the connection to establish</li>
            <li>Start signing!</li>
          </ol>
        </div>
        
        <div class="card p-8 lg:p-10">
          <Icon name="mdi:help-circle" class="w-16 h-16 lg:w-20 lg:h-20 text-burgundy mb-6" />
          <h3 class="text-2xl lg:text-3xl font-bold text-cream mb-4">Troubleshooting</h3>
          <ul class="text-cream/70 space-y-3 text-lg">
            <li>• Ensure Bluetooth is enabled on your device</li>
            <li>• Make sure the gloves are charged</li>
            <li>• Keep the gloves within 10 meters</li>
            <li>• Try restarting both devices if connection fails</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Fullscreen Subtitle Modal -->
    <Teleport to="body">
      <div
        v-if="showFullscreen"
        class="fixed inset-0 bg-black z-50 flex items-center justify-center p-8"
        @click="showFullscreen = false"
      >
        <div class="text-center">
          <p
            :style="{ fontSize: fontSize + 'px' }"
            class="text-white font-bold leading-tight animate-fade-in"
          >
            {{ currentTranslation || 'Waiting for translation...' }}
          </p>
          <button
            @click.stop="showFullscreen = false"
            class="mt-8 text-white/50 hover:text-white transition-colors duration-300"
          >
            <Icon name="mdi:close-circle" class="w-12 h-12" />
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const isConnected = ref(false)
const isConnecting = ref(false)
const translationMode = ref<'speech' | 'subtitle' | 'both'>('both')
const currentTranslation = ref('')
const speechEnabled = ref(true)
const voiceSpeed = ref(1)
const fontSize = ref(48)
const autoClear = ref(false)
const showFullscreen = ref(false)
const translationHistory = ref<Array<{ text: string; time: string }>>([])

// Simulate glove connection
const connectGloves = async () => {
  isConnecting.value = true
  
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isConnected.value = true
  isConnecting.value = false
  
  // Start demo translation
  startDemoTranslation()
}

const disconnectGloves = () => {
  isConnected.value = false
  currentTranslation.value = ''
  stopDemoTranslation()
}

const toggleSpeech = () => {
  speechEnabled.value = !speechEnabled.value
  if (speechEnabled.value && currentTranslation.value) {
    speakText(currentTranslation.value)
  }
}

const clearTranslation = () => {
  currentTranslation.value = ''
}

const speakText = (text: string) => {
  if ('speechSynthesis' in window && speechEnabled.value) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = voiceSpeed.value
    window.speechSynthesis.speak(utterance)
  }
}

// Demo translation simulation
let demoInterval: NodeJS.Timeout | null = null
const demoWords = [
  'Hello',
  'How are you?',
  'Nice to meet you',
  'Thank you',
  'Good morning',
  'Have a great day',
  'See you later',
  'I understand'
]

const startDemoTranslation = () => {
  let index = 0
  demoInterval = setInterval(() => {
    const word = demoWords[index % demoWords.length]
    currentTranslation.value = word
    
    // Add to history
    translationHistory.value.unshift({
      text: word,
      time: new Date().toLocaleTimeString()
    })
    
    // Keep only last 10 items
    if (translationHistory.value.length > 10) {
      translationHistory.value.pop()
    }
    
    // Speak if enabled
    if (translationMode.value !== 'subtitle' && speechEnabled.value) {
      speakText(word)
    }
    
    // Auto-clear if enabled
    if (autoClear.value) {
      setTimeout(() => {
        if (currentTranslation.value === word) {
          currentTranslation.value = ''
        }
      }, 3000)
    }
    
    index++
  }, 5000)
}

const stopDemoTranslation = () => {
  if (demoInterval) {
    clearInterval(demoInterval)
    demoInterval = null
  }
}

onUnmounted(() => {
  stopDemoTranslation()
})

useHead({
  title: 'App - SignLent',
  meta: [
    { name: 'description', content: 'Connect your smart gloves and start translating sign language in real-time.' }
  ]
})
</script>
