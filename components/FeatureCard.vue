<template>
  <div class="card transform hover:-translate-y-2 transition-all duration-300">
    <div class="flex items-center mb-4">
      <div class="p-3 bg-burgundy/20 rounded-lg">
        <Icon :name="icon" class="w-8 h-8 text-burgundy" />
      </div>
    </div>
    <h3 class="text-xl font-bold text-cream mb-2">{{ title }}</h3>
    <p class="text-cream/70">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>
