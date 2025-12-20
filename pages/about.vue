<template>
  <div class="min-h-screen px-6 lg:px-12 py-12 lg:py-16">
    <div class="container mx-auto max-w-8xl">
      <div class="text-center mb-20">
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6 animate-slide-down">About SignLent</h1>
        <p class="text-xl lg:text-2xl text-cream/70 animate-slide-up">
          Empowering communication through innovation
        </p>
      </div>

      <div class="space-y-16 lg:space-y-20">
        <!-- Mission -->
        <div class="card p-8 lg:p-12 animate-fade-in">
          <div class="flex items-center gap-6 mb-8">
            <div class="p-4 lg:p-5 bg-burgundy/20 rounded-lg">
              <Icon name="mdi:bullseye-arrow" class="w-12 h-12 lg:w-14 lg:h-14 text-burgundy" />
            </div>
            <h2 class="text-3xl lg:text-4xl font-bold text-cream">Our Mission</h2>
          </div>
          <p class="text-cream/70 text-xl lg:text-2xl leading-relaxed">
            SignLent is dedicated to breaking down communication barriers between the deaf/hard-of-hearing community 
            and those who don't understand sign language. Through innovative smart glove technology and real-time 
            translation, we're making every conversation accessible and inclusive.
          </p>
        </div>

        <!-- Technology -->
        <div class="card p-8 lg:p-12 animate-fade-in" style="animation-delay: 0.1s">
          <div class="flex items-center gap-6 mb-8">
            <div class="p-4 lg:p-5 bg-burgundy/20 rounded-lg">
              <Icon name="mdi:chip" class="w-12 h-12 lg:w-14 lg:h-14 text-burgundy" />
            </div>
            <h2 class="text-3xl lg:text-4xl font-bold text-cream">The Technology</h2>
          </div>
          <p class="text-cream/70 text-xl lg:text-2xl leading-relaxed mb-8">
            Our smart gloves use advanced motion sensors and machine learning to recognize sign language gestures 
            with high accuracy. The system processes movements in real-time, translating them into text and speech.
          </p>
          <ul class="space-y-4 text-cream/70 text-lg lg:text-xl">
            <li class="flex items-start gap-4">
              <Icon name="mdi:check-circle" class="w-8 h-8 text-burgundy flex-shrink-0 mt-1" />
              <span>High-precision motion sensors in each finger</span>
            </li>
            <li class="flex items-start gap-4">
              <Icon name="mdi:check-circle" class="w-8 h-8 text-burgundy flex-shrink-0 mt-1" />
              <span>AI-powered gesture recognition</span>
            </li>
            <li class="flex items-start gap-4">
              <Icon name="mdi:check-circle" class="w-8 h-8 text-burgundy flex-shrink-0 mt-1" />
              <span>Low-latency Bluetooth connectivity</span>
            </li>
            <li class="flex items-start gap-4">
              <Icon name="mdi:check-circle" class="w-8 h-8 text-burgundy flex-shrink-0 mt-1" />
              <span>Long battery life (8+ hours of continuous use)</span>
            </li>
          </ul>
        </div>

        <!-- Features Breakdown -->
        <div class="card p-8 lg:p-12 animate-fade-in" style="animation-delay: 0.2s">
          <div class="flex items-center gap-6 mb-8">
            <div class="p-4 lg:p-5 bg-burgundy/20 rounded-lg">
              <Icon name="mdi:feature-search" class="w-12 h-12 lg:w-14 lg:h-14 text-burgundy" />
            </div>
            <h2 class="text-3xl lg:text-4xl font-bold text-cream">Key Features</h2>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8 lg:gap-10">
            <div class="bg-navy-deeper rounded-lg p-8 lg:p-10">
              <Icon name="mdi:microphone" class="w-14 h-14 lg:w-16 lg:h-16 text-burgundy mb-6" />
              <h3 class="text-2xl lg:text-3xl font-bold text-cream mb-4">Text-to-Speech</h3>
              <p class="text-cream/70 text-lg lg:text-xl leading-relaxed">
                Natural-sounding voice output speaks translated words aloud, allowing for verbal communication 
                even when the listener doesn't understand sign language.
              </p>
            </div>
            
            <div class="bg-navy-deeper rounded-lg p-8 lg:p-10">
              <Icon name="mdi:television" class="w-14 h-14 lg:w-16 lg:h-16 text-burgundy mb-6" />
              <h3 class="text-2xl lg:text-3xl font-bold text-cream mb-4">Fullscreen Display</h3>
              <p class="text-cream/70 text-lg lg:text-xl leading-relaxed">
                Large, readable subtitles fill the screen, perfect for presentations, meetings, or any situation 
                where visual clarity is essential.
              </p>
            </div>
            
            <div class="bg-navy-deeper rounded-lg p-8 lg:p-10">
              <Icon name="mdi:bluetooth" class="w-14 h-14 lg:w-16 lg:h-16 text-burgundy mb-6" />
              <h3 class="text-2xl lg:text-3xl font-bold text-cream mb-4">Wireless Freedom</h3>
              <p class="text-cream/70 text-lg lg:text-xl leading-relaxed">
                Connect wirelessly to your device via Bluetooth. No cables, no restrictions—just natural 
                communication.
              </p>
            </div>
            
            <div class="bg-navy-deeper rounded-lg p-8 lg:p-10">
              <Icon name="mdi:cog" class="w-14 h-14 lg:w-16 lg:h-16 text-burgundy mb-6" />
              <h3 class="text-2xl lg:text-3xl font-bold text-cream mb-4">Customizable</h3>
              <p class="text-cream/70 text-lg lg:text-xl leading-relaxed">
                Adjust voice speed, subtitle size, auto-clear preferences, and more to match your personal 
                communication style.
              </p>
            </div>
          </div>
        </div>

        <!-- Use Cases -->
        <div class="card p-8 lg:p-12 animate-fade-in" style="animation-delay: 0.3s">
          <div class="flex items-center gap-6 mb-8">
            <div class="p-4 lg:p-5 bg-burgundy/20 rounded-lg">
              <Icon name="mdi:account-group" class="w-12 h-12 lg:w-14 lg:h-14 text-burgundy" />
            </div>
            <h2 class="text-3xl lg:text-4xl font-bold text-cream">Use Cases</h2>
          </div>
          
          <div class="space-y-6 lg:space-y-8 text-cream/70">
            <div class="flex items-start gap-6">
              <Icon name="mdi:store" class="w-10 h-10 lg:w-12 lg:h-12 text-slate-blue flex-shrink-0 mt-1" />
              <div>
                <h4 class="font-semibold text-cream mb-2 text-xl lg:text-2xl">Retail & Customer Service</h4>
                <p class="text-lg lg:text-xl leading-relaxed">Enable deaf/hard-of-hearing employees to serve customers effectively without interpreters.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-6">
              <Icon name="mdi:school" class="w-10 h-10 lg:w-12 lg:h-12 text-slate-blue flex-shrink-0 mt-1" />
              <div>
                <h4 class="font-semibold text-cream mb-2 text-xl lg:text-2xl">Education</h4>
                <p class="text-lg lg:text-xl leading-relaxed">Students can participate fully in classroom discussions and presentations.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-6">
              <Icon name="mdi:briefcase" class="w-10 h-10 lg:w-12 lg:h-12 text-slate-blue flex-shrink-0 mt-1" />
              <div>
                <h4 class="font-semibold text-cream mb-2 text-xl lg:text-2xl">Business Meetings</h4>
                <p class="text-lg lg:text-xl leading-relaxed">Professional communication in conferences, interviews, and team collaborations.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-6">
              <Icon name="mdi:hospital-building" class="w-10 h-10 lg:w-12 lg:h-12 text-slate-blue flex-shrink-0 mt-1" />
              <div>
                <h4 class="font-semibold text-cream mb-2 text-xl lg:text-2xl">Healthcare</h4>
                <p class="text-lg lg:text-xl leading-relaxed">Improve patient-provider communication for better healthcare outcomes.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center py-16 lg:py-20">
          <h2 class="text-3xl lg:text-5xl font-bold gradient-text mb-8">Ready to Experience SignLent?</h2>
          <NuxtLink to="/translator" class="btn-primary inline-block text-lg">
            <span class="flex items-center gap-2">
              <Icon name="mdi:rocket-launch" class="w-6 h-6" />
              Try the App Now
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'About - SignLent',
  meta: [
    { name: 'description', content: 'Learn about SignLent\'s mission to break communication barriers through sign language translation technology.' }
  ]
})
</script>
