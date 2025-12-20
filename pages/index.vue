<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center justify-center px-6 lg:px-12">
      <div class="absolute inset-0 bg-gradient-to-br from-burgundy/10 via-navy-deeper to-slate-blue/10"></div>
      
      <div class="container mx-auto relative z-10 max-w-8xl">
        <div class="text-center max-w-5xl mx-auto">
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-slide-down">
            <span class="gradient-text">Breaking Barriers</span><br />
            <span class="text-cream">Through Sign Language</span>
          </h1>
          
          <p class="text-xl md:text-2xl lg:text-3xl text-cream/80 mb-10 animate-slide-up max-w-4xl mx-auto leading-relaxed">
            Real-time sign language translation powered by smart gloves. 
            Communicate freely with speech output and fullscreen subtitles.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
            <NuxtLink to="/translator" class="btn-primary text-lg">
              <span class="flex items-center gap-2">
                <Icon name="mdi:hand-wave" class="w-6 h-6" />
                Try the App
              </span>
            </NuxtLink>
            <button @click="scrollToFeatures" class="btn-secondary text-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      <!-- Animated floating elements -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-20 left-10 w-20 h-20 bg-burgundy/20 rounded-full animate-float" style="animation-delay: 0s"></div>
        <div class="absolute top-40 right-20 w-32 h-32 bg-slate-blue/20 rounded-full animate-float" style="animation-delay: 1s"></div>
        <div class="absolute bottom-40 left-1/4 w-24 h-24 bg-burgundy/10 rounded-full animate-float" style="animation-delay: 2s"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="py-24 lg:py-32 px-6 lg:px-12 bg-navy-dark/50">
      <div class="container mx-auto max-w-8xl">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-6">Key Features</h2>
          <p class="text-xl lg:text-2xl text-cream/70">Everything you need to communicate effectively</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <FeatureCard
            icon="mdi:bluetooth"
            title="Wireless Connection"
            description="Connect seamlessly to smart gloves via Bluetooth for hands-free operation."
          />
          <FeatureCard
            icon="mdi:microphone"
            title="Text-to-Speech"
            description="Hear translated words spoken aloud from your mobile device in real-time."
          />
          <FeatureCard
            icon="mdi:television"
            title="Fullscreen Subtitles"
            description="Display large, readable subtitles on screen as a secondary camera feed."
          />
          <FeatureCard
            icon="mdi:lightning-bolt"
            title="Real-Time Translation"
            description="Instant recognition and translation of sign language gestures."
          />
          <FeatureCard
            icon="mdi:cog"
            title="Customizable Settings"
            description="Adjust voice, speed, subtitle size, and more to your preferences."
          />
          <FeatureCard
            icon="mdi:shield-check"
            title="Privacy First"
            description="All processing happens on your device. Your data stays with you."
          />
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-24 lg:py-32 px-6 lg:px-12">
      <div class="container mx-auto max-w-8xl">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-6">How It Works</h2>
          <p class="text-xl lg:text-2xl text-cream/70">Simple steps to start communicating</p>
        </div>
        
        <div class="max-w-6xl mx-auto space-y-16 lg:space-y-20">
          <div v-for="(step, index) in steps" :key="index" 
               class="flex flex-col md:flex-row items-center gap-10 lg:gap-16"
               :class="index % 2 === 1 ? 'md:flex-row-reverse' : ''">
            <div class="flex-1">
              <div class="card p-8 lg:p-10">
                <div class="flex items-center gap-5 mb-6">
                  <div class="w-14 h-14 lg:w-16 lg:h-16 bg-burgundy rounded-full flex items-center justify-center text-2xl lg:text-3xl font-bold">
                    {{ index + 1 }}
                  </div>
                  <h3 class="text-2xl lg:text-3xl font-bold text-cream">{{ step.title }}</h3>
                </div>
                <p class="text-cream/70 text-lg lg:text-xl leading-relaxed">{{ step.description }}</p>
              </div>
            </div>
            <div class="flex-1 flex justify-center">
              <div class="w-40 h-40 lg:w-48 lg:h-48 bg-burgundy/20 rounded-full flex items-center justify-center">
                <Icon :name="step.icon" class="w-20 h-20 lg:w-24 lg:h-24 text-burgundy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 lg:py-32 px-6 lg:px-12 bg-gradient-to-r from-burgundy/20 via-navy-dark to-slate-blue/20">
      <div class="container mx-auto text-center max-w-8xl">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-8">
          Ready to Start?
        </h2>
        <p class="text-xl lg:text-2xl text-cream/80 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join thousands who are already breaking communication barriers with SignLent.
        </p>
        <NuxtLink to="/translator" class="btn-primary inline-block text-lg">
          <span class="flex items-center gap-2">
            <Icon name="mdi:rocket-launch" class="w-6 h-6" />
            Launch App
          </span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const featuresSection = ref<HTMLElement | null>(null)

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const steps = [
  {
    title: 'Connect Your Gloves',
    description: 'Pair your smart gloves with the app via Bluetooth. Quick and easy setup in seconds.',
    icon: 'mdi:bluetooth-connect'
  },
  {
    title: 'Start Signing',
    description: 'Begin using sign language naturally. Our AI recognizes your gestures in real-time.',
    icon: 'mdi:hand-back-right'
  },
  {
    title: 'Choose Your Output',
    description: 'Select between voice output, fullscreen subtitles, or both for your audience.',
    icon: 'mdi:format-text'
  },
  {
    title: 'Communicate Freely',
    description: 'Engage in natural conversations without barriers. Everyone understands you.',
    icon: 'mdi:chat'
  }
]

useHead({
  title: 'SignLent - Sign Language Translation',
  meta: [
    { name: 'description', content: 'Break communication barriers with real-time sign language translation through smart gloves.' }
  ]
})
</script>
