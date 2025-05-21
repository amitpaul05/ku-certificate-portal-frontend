<template>
  <div class="flex min-h-screen">
    

    <!-- Main Layout -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="h-16 bg-white shadow flex mx-auto items-center px-4">
        <h1 class="text-xl font-semibold">Welcome to KU CERTIFICATE CLEARANCE PORTAL</h1>
      </header>

      <StatusPage />

      <!-- Content -->
      <main v-if="user_type === 'student'" class="p-4 flex-1 bg-gray-100">

        <div class="flex justify-center pt-20 relative">
          <div
            class="bg-white w-[50%] text-2xl p-6 rounded-lg shadow hover:bg-blue-100/50 hover:scale-105 flex justify-center text-blue-600 font-semibold cursor-pointer transition -mt-10 hover:underline"
            @click="goToForm"> Apply for New Certificate
          </div>
        </div>

      </main>

      <!-- Footer -->
      <footer class="h-16 bg-white text-center text-sm text-gray-500 flex items-center justify-center">
        Automatic Certificate Clearance Portal ©{{ new Date().getFullYear() }} Created by ECE 21
      </footer>
    </div>
  </div>
</template>

<script setup>

import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import studentService from '@/services/studentService'
import { useUserStore } from '@/stores/userStore';
import StatusPage from './StatusPage.vue';


const user_type = useUserStore().user.user_type

const collapsed = ref(false)
const router = useRouter()
const allCompanyList = ref([])
const options = ref([])
const selectedCompany = ref(null)

const goToForm = () => {
  router.push({ name: 'studentForm' })
}

const goToStatus = () => {
  router.push({ name: 'statuspage' })
}
const goToLogin = () => {
  localStorage.removeItem('token')
  router.push({ name: 'login' })
}



const getAllStudent = async () => {
  try {
    const response = await studentService.getAllStudent()
    allCompanyList.value = response.data.results
    options.value = response.data.results.map(company => ({
      value: company.id,
      label: company.name,
    }))
  } catch (error) {
    
    toast.error('Something went wrong', { timeout: 1500 })
  }
}

onMounted(async () => {
  await getAllStudent()
  
})


</script>

<style></style>
