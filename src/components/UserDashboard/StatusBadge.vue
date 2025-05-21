<!-- StatusBadge.vue -->
<template>
  <span
    :class="[
      'px-2 py-1 text-xs font-semibold rounded-full',
      approved ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
    ]"
  >
    {{ approved ? 'Approved' : 'Pending' }}
  </span>
</template>

<script setup>
defineProps({ approved: Boolean });
</script>
