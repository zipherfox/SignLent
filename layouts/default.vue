<template>
  <div class="min-h-screen bg-navy-deeper">
    <header class="fixed w-full top-0 z-50 bg-navy-deeper/80 backdrop-blur-lg border-b border-slate-blue/20">
      <nav class="container mx-auto px-6 lg:px-12 py-5 max-w-8xl">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-2xl lg:text-3xl font-bold gradient-text hover:scale-105 transition-transform duration-300">
            SignLent
          </NuxtLink>
          
          <div class="hidden md:flex items-center space-x-10 text-lg">
            <NuxtLink to="/" class="text-cream hover:text-burgundy transition-colors duration-300">Home</NuxtLink>
            <NuxtLink to="/translator" class="text-cream hover:text-burgundy transition-colors duration-300">App</NuxtLink>
            <NuxtLink to="/about" class="text-cream hover:text-burgundy transition-colors duration-300">About</NuxtLink>
          </div>

          <button @click="toggleMenu" class="md:hidden text-cream">
            <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="w-6 h-6" />
          </button>
        </div>

        <!-- Mobile menu -->
        <Transition name="slide-down">
          <div v-if="isMenuOpen" class="md:hidden mt-4 pb-4 space-y-4">
            <NuxtLink to="/" @click="toggleMenu" class="block text-cream hover:text-burgundy transition-colors duration-300">Home</NuxtLink>
            <NuxtLink to="/translator" @click="toggleMenu" class="block text-cream hover:text-burgundy transition-colors duration-300">App</NuxtLink>
            <NuxtLink to="/about" @click="toggleMenu" class="block text-cream hover:text-burgundy transition-colors duration-300">About</NuxtLink>
          </div>
        </Transition>
      </nav>
    </header>

    <main class="pt-24">
      <slot />
    </main>

    <footer class="bg-navy-dark border-t border-slate-blue/20 mt-20">
      <div class="container mx-auto px-6 lg:px-12 py-12 max-w-8xl">
        <div class="grid md:grid-cols-3 gap-12 lg:gap-16">
          <div>
            <h3 class="text-2xl font-bold gradient-text mb-4">SignLent</h3>
            <p class="text-cream/70 text-lg">Breaking communication barriers through technology.</p>
          </div>
          
          <div>
            <h4 class="font-semibold text-cream mb-4 text-lg">Quick Links</h4>
            <div class="space-y-3">
              <NuxtLink to="/" class="block text-cream/70 hover:text-burgundy transition-colors duration-300 text-lg">Home</NuxtLink>
              <NuxtLink to="/translator" class="block text-cream/70 hover:text-burgundy transition-colors duration-300 text-lg">App</NuxtLink>
              <NuxtLink to="/about" class="block text-cream/70 hover:text-burgundy transition-colors duration-300 text-lg">About</NuxtLink>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold text-cream mb-4 text-lg">Contact</h4>
            <p class="text-cream/70 text-lg">support@signlent.com</p>
          </div>
        </div>
        
        <div class="border-t border-slate-blue/20 mt-10 pt-8 text-center text-cream/50">
          <p>&copy; 2025 SignLent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Close menu when route changes
const route = useRoute()
watch(() => route.path, () => {
  isMenuOpen.value = false
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
