<template>
  <span
    :class="[
      'inline-block px-3 py-1 text-sm font-semibold rounded-full',
      approved ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
    ]"
  >
    {{ approved ? 'Approved' : 'Not Approved Yet' }}
  </span>
</template>

<script setup>
defineProps({
  approved: Boolean
})
</script>
