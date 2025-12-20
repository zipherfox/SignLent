<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="emit('close')">
    <div class="bg-navy-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
      <div class="sticky top-0 bg-navy-dark border-b border-slate-blue/20 p-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold gradient-text">{{ title }}</h2>
        <button @click="emit('close')" class="text-cream hover:text-burgundy transition-colors duration-300">
          <Icon name="mdi:close" class="w-6 h-6" />
        </button>
      </div>
      
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>
