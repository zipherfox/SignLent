<template>
  <div class="min-h-screen px-6 py-12">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold gradient-text mb-4">SignLent App</h1>
        <p class="text-xl text-cream/70">Connect your gloves and start translating</p>
      </div>

      <!-- Connection Status -->
      <div class="card mb-8 text-center">
        <div class="flex items-center justify-center gap-4 mb-6">
          <div :class="[
            'w-4 h-4 rounded-full transition-all duration-300',
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          ]"></div>
          <h2 class="text-2xl font-bold text-cream">
            {{ isConnected ? 'Connected' : 'Not Connected' }}
          </h2>
        </div>
        
        <button 
          v-if="!isConnected"
          @click="connectGloves"
          :disabled="isConnecting"
          class="btn-primary"
        >
          <span class="flex items-center gap-2">
            <Icon name="mdi:bluetooth" class="w-5 h-5" />
            {{ isConnecting ? 'Connecting...' : 'Connect Gloves' }}
          </span>
        </button>
        
        <button 
          v-else
          @click="disconnectGloves"
          class="btn-secondary"
        >
          <span class="flex items-center gap-2">
            <Icon name="mdi:bluetooth-off" class="w-5 h-5" />
            Disconnect
          </span>
        </button>
      </div>

      <!-- Translation Display -->
      <div v-if="isConnected" class="space-y-6">
        <!-- Mode Selection -->
        <div class="card">
          <h3 class="text-xl font-bold text-cream mb-4">Translation Mode</h3>
          <div class="grid md:grid-cols-3 gap-4">
            <button
              @click="translationMode = 'speech'"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-300',
                translationMode === 'speech' 
                  ? 'border-burgundy bg-burgundy/20' 
                  : 'border-slate-blue/30 hover:border-slate-blue'
              ]"
            >
              <Icon name="mdi:microphone" class="w-8 h-8 mx-auto mb-2" :class="translationMode === 'speech' ? 'text-burgundy' : 'text-cream'" />
              <p class="font-semibold text-cream">Text-to-Speech</p>
            </button>
            
            <button
              @click="translationMode = 'subtitle'"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-300',
                translationMode === 'subtitle' 
                  ? 'border-burgundy bg-burgundy/20' 
                  : 'border-slate-blue/30 hover:border-slate-blue'
              ]"
            >
              <Icon name="mdi:television" class="w-8 h-8 mx-auto mb-2" :class="translationMode === 'subtitle' ? 'text-burgundy' : 'text-cream'" />
              <p class="font-semibold text-cream">Fullscreen Subtitles</p>
            </button>
            
            <button
              @click="translationMode = 'both'"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-300',
                translationMode === 'both' 
                  ? 'border-burgundy bg-burgundy/20' 
                  : 'border-slate-blue/30 hover:border-slate-blue'
              ]"
            >
              <Icon name="mdi:format-list-bulleted-type" class="w-8 h-8 mx-auto mb-2" :class="translationMode === 'both' ? 'text-burgundy' : 'text-cream'" />
              <p class="font-semibold text-cream">Both</p>
            </button>
          </div>
        </div>

        <!-- Translation Output -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-cream">Live Translation</h3>
            <button
              @click="showFullscreen = true"
              v-if="translationMode !== 'speech'"
              class="btn-secondary py-2 px-4"
            >
              <span class="flex items-center gap-2">
                <Icon name="mdi:fullscreen" class="w-5 h-5" />
                Fullscreen
              </span>
            </button>
          </div>
          
          <div class="bg-navy-deeper rounded-lg p-6 min-h-[200px] flex items-center justify-center">
            <p class="text-2xl md:text-4xl text-center text-cream animate-fade-in">
              {{ currentTranslation || 'Start signing to see translation...' }}
            </p>
          </div>
          
          <div class="mt-4 flex items-center gap-4">
            <button
              @click="toggleSpeech"
              :class="[
                'flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300',
                speechEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-blue hover:bg-navy-dark'
              ]"
            >
              <Icon :name="speechEnabled ? 'mdi:volume-high' : 'mdi:volume-off'" class="w-5 h-5" />
              <span>{{ speechEnabled ? 'Mute' : 'Enable Speech' }}</span>
            </button>
            
            <button
              @click="clearTranslation"
              class="btn-secondary py-2 px-4"
            >
              <span class="flex items-center gap-2">
                <Icon name="mdi:delete" class="w-5 h-5" />
                Clear
              </span>
            </button>
          </div>
        </div>

        <!-- Settings -->
        <div class="card">
          <h3 class="text-xl font-bold text-cream mb-4">Settings</h3>
          
          <div class="space-y-6">
            <!-- Voice Speed -->
            <div>
              <label class="block text-cream mb-2">Voice Speed</label>
              <input 
                v-model="voiceSpeed" 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1"
                class="w-full accent-burgundy"
              />
              <p class="text-cream/50 text-sm mt-1">{{ voiceSpeed }}x</p>
            </div>
            
            <!-- Font Size -->
            <div>
              <label class="block text-cream mb-2">Subtitle Font Size</label>
              <input 
                v-model="fontSize" 
                type="range" 
                min="24" 
                max="72" 
                step="4"
                class="w-full accent-burgundy"
              />
              <p class="text-cream/50 text-sm mt-1">{{ fontSize }}px</p>
            </div>
            
            <!-- Auto-clear -->
            <div class="flex items-center justify-between">
              <label class="text-cream">Auto-clear after translation</label>
              <button
                @click="autoClear = !autoClear"
                :class="[
                  'w-12 h-6 rounded-full transition-all duration-300 relative',
                  autoClear ? 'bg-green-500' : 'bg-slate-blue'
                ]"
              >
                <div
                  :class="[
                    'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300',
                    autoClear ? 'left-6' : 'left-0.5'
                  ]"
                ></div>
              </button>
            </div>
          </div>
        </div>

        <!-- Translation History -->
        <div class="card">
          <h3 class="text-xl font-bold text-cream mb-4">Translation History</h3>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(item, index) in translationHistory"
              :key="index"
              class="bg-navy-deeper rounded p-3 text-cream/70 hover:bg-navy-deeper/50 transition-colors duration-300"
            >
              <span class="text-xs text-cream/40">{{ item.time }}</span>
              <p>{{ item.text }}</p>
            </div>
            <p v-if="translationHistory.length === 0" class="text-cream/50 text-center py-4">
              No translations yet
            </p>
          </div>
        </div>
      </div>

      <!-- Getting Started Guide -->
      <div v-else class="grid md:grid-cols-2 gap-6 mt-8">
        <div class="card">
          <Icon name="mdi:information" class="w-12 h-12 text-burgundy mb-4" />
          <h3 class="text-xl font-bold text-cream mb-2">Getting Started</h3>
          <ol class="text-cream/70 space-y-2 list-decimal list-inside">
            <li>Turn on your SignLent smart gloves</li>
            <li>Click the "Connect Gloves" button above</li>
            <li>Select your device from the Bluetooth list</li>
            <li>Wait for the connection to establish</li>
            <li>Start signing!</li>
          </ol>
        </div>
        
        <div class="card">
          <Icon name="mdi:help-circle" class="w-12 h-12 text-burgundy mb-4" />
          <h3 class="text-xl font-bold text-cream mb-2">Troubleshooting</h3>
          <ul class="text-cream/70 space-y-2">
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
