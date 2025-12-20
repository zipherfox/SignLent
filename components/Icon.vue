<template>
  <span class="inline-flex items-center justify-center" :class="className">
    <component :is="iconComponent" />
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  class?: string
}>()

const className = computed(() => props.class || '')

const iconMap: Record<string, string> = {
  'mdi:hand-wave': '👋',
  'mdi:bluetooth': '🔵',
  'mdi:bluetooth-connect': '🔗',
  'mdi:bluetooth-off': '⛔',
  'mdi:microphone': '🎤',
  'mdi:television': '📺',
  'mdi:lightning-bolt': '⚡',
  'mdi:cog': '⚙️',
  'mdi:shield-check': '🛡️',
  'mdi:hand-back-right': '✋',
  'mdi:format-text': '📝',
  'mdi:chat': '💬',
  'mdi:rocket-launch': '🚀',
  'mdi:menu': '☰',
  'mdi:close': '✕',
  'mdi:information': 'ℹ️',
  'mdi:help-circle': '❓',
  'mdi:fullscreen': '⛶',
  'mdi:volume-high': '🔊',
  'mdi:volume-off': '🔇',
  'mdi:delete': '🗑️',
  'mdi:close-circle': '⊗',
  'mdi:bullseye-arrow': '🎯',
  'mdi:chip': '🔌',
  'mdi:check-circle': '✓',
  'mdi:feature-search': '🔍',
  'mdi:account-group': '👥',
  'mdi:store': '🏪',
  'mdi:school': '🏫',
  'mdi:briefcase': '💼',
  'mdi:hospital-building': '🏥',
  'mdi:format-list-bulleted-type': '📋'
}

const iconComponent = computed(() => {
  return {
    template: `<span>${iconMap[props.name] || '•'}</span>`
  }
})
</script>
