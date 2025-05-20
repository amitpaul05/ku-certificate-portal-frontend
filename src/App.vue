
<script setup></script>

<template>
  <div class="bg-[#F9FAFB] lg:px-0 basis-custom">
    <a-config-provider :theme="{
      token: {
        colorPrimary: '#18bc9c',
        fontFamily: 'Montserrat, sans-serif',
      },
    }">
      <RouterView />
    </a-config-provider>
  </div>
</template>