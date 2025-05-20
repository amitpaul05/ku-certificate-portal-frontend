<template>

    <h1>
        this is from dashboard
    </h1>
</template>

<script setup>
import hallService from '@/services/hallService';
import { useUserStore } from '@/stores/userStore';
console.log("user",useUserStore().user.id)
req = hallService.getAllHalls()
console.log(req)

</script>