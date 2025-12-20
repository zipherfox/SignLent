<template>
  <div class="min-h-screen px-6 py-12">
    <div class="container mx-auto max-w-4xl">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold gradient-text mb-4 animate-slide-down">About SignLent</h1>
        <p class="text-xl text-cream/70 animate-slide-up">
          Empowering communication through innovation
        </p>
      </div>

      <div class="space-y-12">
        <!-- Mission -->
        <div class="card animate-fade-in">
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-burgundy/20 rounded-lg">
              <Icon name="mdi:bullseye-arrow" class="w-8 h-8 text-burgundy" />
            </div>
            <h2 class="text-3xl font-bold text-cream">Our Mission</h2>
          </div>
          <p class="text-cream/70 text-lg leading-relaxed">
            SignLent is dedicated to breaking down communication barriers between the deaf/hard-of-hearing community 
            and those who don't understand sign language. Through innovative smart glove technology and real-time 
            translation, we're making every conversation accessible and inclusive.
          </p>
        </div>

        <!-- Technology -->
        <div class="card animate-fade-in" style="animation-delay: 0.1s">
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-burgundy/20 rounded-lg">
              <Icon name="mdi:chip" class="w-8 h-8 text-burgundy" />
            </div>
            <h2 class="text-3xl font-bold text-cream">The Technology</h2>
          </div>
          <p class="text-cream/70 text-lg leading-relaxed mb-4">
            Our smart gloves use advanced motion sensors and machine learning to recognize sign language gestures 
            with high accuracy. The system processes movements in real-time, translating them into text and speech.
          </p>
          <ul class="space-y-2 text-cream/70">
            <li class="flex items-start gap-2">
              <Icon name="mdi:check-circle" class="w-6 h-6 text-burgundy flex-shrink-0 mt-0.5" />
              <span>High-precision motion sensors in each finger</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="mdi:check-circle" class="w-6 h-6 text-burgundy flex-shrink-0 mt-0.5" />
              <span>AI-powered gesture recognition</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="mdi:check-circle" class="w-6 h-6 text-burgundy flex-shrink-0 mt-0.5" />
              <span>Low-latency Bluetooth connectivity</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="mdi:check-circle" class="w-6 h-6 text-burgundy flex-shrink-0 mt-0.5" />
              <span>Long battery life (8+ hours of continuous use)</span>
            </li>
          </ul>
        </div>

        <!-- Features Breakdown -->
        <div class="card animate-fade-in" style="animation-delay: 0.2s">
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-burgundy/20 rounded-lg">
              <Icon name="mdi:feature-search" class="w-8 h-8 text-burgundy" />
            </div>
            <h2 class="text-3xl font-bold text-cream">Key Features</h2>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-navy-deeper rounded-lg p-6">
              <Icon name="mdi:microphone" class="w-10 h-10 text-burgundy mb-3" />
              <h3 class="text-xl font-bold text-cream mb-2">Text-to-Speech</h3>
              <p class="text-cream/70">
                Natural-sounding voice output speaks translated words aloud, allowing for verbal communication 
                even when the listener doesn't understand sign language.
              </p>
            </div>
            
            <div class="bg-navy-deeper rounded-lg p-6">
              <Icon name="mdi:television" class="w-10 h-10 text-burgundy mb-3" />
              <h3 class="text-xl font-bold text-cream mb-2">Fullscreen Display</h3>
              <p class="text-cream/70">
                Large, readable subtitles fill the screen, perfect for presentations, meetings, or any situation 
                where visual clarity is essential.
              </p>
            </div>
            
            <div class="bg-navy-deeper rounded-lg p-6">
              <Icon name="mdi:bluetooth" class="w-10 h-10 text-burgundy mb-3" />
              <h3 class="text-xl font-bold text-cream mb-2">Wireless Freedom</h3>
              <p class="text-cream/70">
                Connect wirelessly to your device via Bluetooth. No cables, no restrictions—just natural 
                communication.
              </p>
            </div>
            
            <div class="bg-navy-deeper rounded-lg p-6">
              <Icon name="mdi:cog" class="w-10 h-10 text-burgundy mb-3" />
              <h3 class="text-xl font-bold text-cream mb-2">Customizable</h3>
              <p class="text-cream/70">
                Adjust voice speed, subtitle size, auto-clear preferences, and more to match your personal 
                communication style.
              </p>
            </div>
          </div>
        </div>

        <!-- Use Cases -->
        <div class="card animate-fade-in" style="animation-delay: 0.3s">
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-burgundy/20 rounded-lg">
              <Icon name="mdi:account-group" class="w-8 h-8 text-burgundy" />
            </div>
            <h2 class="text-3xl font-bold text-cream">Use Cases</h2>
          </div>
          
          <div class="space-y-4 text-cream/70">
            <div class="flex items-start gap-3">
              <Icon name="mdi:store" class="w-6 h-6 text-slate-blue flex-shrink-0 mt-1" />
              <div>
                <h4 class="font-semibold text-cream mb-1">Retail & Customer Service</h4>
                <p>Enable deaf/hard-of-hearing employees to serve customers effectively without interpreters.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <Icon name="mdi:school" class="w-6 h-6 text-slate-blue flex-shrink-0 mt-1" />
              <div>
                <h4 class="font-semibold text-cream mb-1">Education</h4>
                <p>Students can participate fully in classroom discussions and presentations.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <Icon name="mdi:briefcase" class="w-6 h-6 text-slate-blue flex-shrink-0 mt-1" />
              <div>
                <h4 class="font-semibold text-cream mb-1">Business Meetings</h4>
                <p>Professional communication in conferences, interviews, and team collaborations.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <Icon name="mdi:hospital-building" class="w-6 h-6 text-slate-blue flex-shrink-0 mt-1" />
              <div>
                <h4 class="font-semibold text-cream mb-1">Healthcare</h4>
                <p>Improve patient-provider communication for better healthcare outcomes.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center py-12">
          <h2 class="text-3xl font-bold gradient-text mb-6">Ready to Experience SignLent?</h2>
          <NuxtLink to="/app" class="btn-primary inline-block">
            <span class="flex items-center gap-2">
              <Icon name="mdi:rocket-launch" class="w-5 h-5" />
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
