<template>
  <div class="card transform hover:-translate-y-2 transition-all duration-500 hover:shadow-burgundy/20 hover:shadow-2xl group">
    <div class="flex items-center mb-4">
      <div class="p-3 bg-burgundy/20 rounded-lg transition-all duration-300 group-hover:bg-burgundy/30 group-hover:scale-110 group-hover:rotate-3">
        <Icon :name="icon" class="w-8 h-8 text-burgundy transition-transform duration-300 group-hover:scale-110" />
      </div>
    </div>
    <h3 class="text-xl font-bold text-cream mb-2 transition-colors duration-300 group-hover:text-burgundy">{{ title }}</h3>
    <p class="text-cream/70 transition-colors duration-300 group-hover:text-cream/90">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>
