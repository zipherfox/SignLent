<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center justify-center px-6">
      <div class="absolute inset-0 bg-gradient-to-br from-burgundy/10 via-navy-deeper to-slate-blue/10"></div>
      
      <div class="container mx-auto relative z-10">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-slide-down">
            <span class="gradient-text">Breaking Barriers</span><br />
            <span class="text-cream">Through Sign Language</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-cream/80 mb-8 animate-slide-up">
            Real-time sign language translation powered by smart gloves. 
            Communicate freely with speech output and fullscreen subtitles.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <NuxtLink to="/translator" class="btn-primary">
              <span class="flex items-center gap-2">
                <Icon name="mdi:hand-wave" class="w-5 h-5" />
                Try the App
              </span>
            </NuxtLink>
            <button @click="scrollToFeatures" class="btn-secondary">
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
    <section ref="featuresSection" class="py-20 px-6 bg-navy-dark/50">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold gradient-text mb-4">Key Features</h2>
          <p class="text-xl text-cream/70">Everything you need to communicate effectively</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
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
    <section class="py-20 px-6">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold gradient-text mb-4">How It Works</h2>
          <p class="text-xl text-cream/70">Simple steps to start communicating</p>
        </div>
        
        <div class="max-w-4xl mx-auto space-y-12">
          <div v-for="(step, index) in steps" :key="index" 
               class="flex flex-col md:flex-row items-center gap-8"
               :class="index % 2 === 1 ? 'md:flex-row-reverse' : ''">
            <div class="flex-1">
              <div class="card">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 bg-burgundy rounded-full flex items-center justify-center text-2xl font-bold">
                    {{ index + 1 }}
                  </div>
                  <h3 class="text-2xl font-bold text-cream">{{ step.title }}</h3>
                </div>
                <p class="text-cream/70">{{ step.description }}</p>
              </div>
            </div>
            <div class="flex-1 flex justify-center">
              <div class="w-32 h-32 bg-burgundy/20 rounded-full flex items-center justify-center">
                <Icon :name="step.icon" class="w-16 h-16 text-burgundy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-6 bg-gradient-to-r from-burgundy/20 via-navy-dark to-slate-blue/20">
      <div class="container mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold gradient-text mb-6">
          Ready to Start?
        </h2>
        <p class="text-xl text-cream/80 mb-8 max-w-2xl mx-auto">
          Join thousands who are already breaking communication barriers with SignLent.
        </p>
        <NuxtLink to="/translator" class="btn-primary inline-block">
          <span class="flex items-center gap-2">
            <Icon name="mdi:rocket-launch" class="w-5 h-5" />
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
