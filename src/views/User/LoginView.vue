<template>
  <div class="containe flex min-h-screen justify-center items-center flex-col px-6 py-12 lg:px-8 bg-[url('src/assets/Ku.jpg')] bg-cover bg-center">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">

      
    </div>
    <div
      class="mt-2 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-xl bg-white/50 backdrop-blur-s p-12 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg">
    <h2 class="text-center text-2xl/9 font-bold tracking-tight text-gray-900 my-2">
        {{ 'Sign in to your account' }}
      </h2>
      
      <a-form @submit.prevent="handleSubmit" method="POST" :model="formState" name="basic" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="Email" name="email" :rules="[
          {
            required: true,
            type: 'email',
            message: 'Please input a valid email!',
          },
        ]">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label='Password' name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item class="text-center">
          <a-button class="w-full text-3xl" type="primary" html-type="submit" :loading="loading">{{ 'Login' }}</a-button>
        </a-form-item>
      </a-form>

      <!-- <p class="mt-10 text-center text-sm text-gray-500">
        {{ "Don't have an account?" }}
        <router-link :to="{ name: 'signup' }" class="text-primary font-semibold">{{ 'Register' }}</router-link>
      </p> -->
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import userService from '@/services/userService.js'
import { useUserStore } from '@/stores/userStore.js'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

const userStore = useUserStore()

// const toast = useToast()
const router = useRouter()
const $externalResults = ref({})
const loading = ref(false)

let serverError = ref([])

const formState = reactive({
  email: '',
  password: '',
});

const rules = computed(() => ({
  email: { required },
  password: { required },
}))

const v$ = useVuelidate(rules, formState, { $externalResults })

const onFinish = (values) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

async function handleSubmit() {

  $externalResults.value = []
  const isValid = await v$.value.$validate()
  if (!isValid) {
    toast.error('Please fill out all required fields.')
    return
  }

  try {
    loading.value = true
    const tokenResponse = await userService.getToken(formState.email, formState.password)
    const userToken = tokenResponse['data']

    const userDetailsResponse = await userService.getUserDetails(userToken['user_id'])
    const userDetails = userDetailsResponse['data']

    userStore.setUserAuth(true, userToken.access, userToken.refresh)
    userStore.setUser(userDetails)
    loading.value = false

    router.push({ name: 'student' })



  } catch (error) {
    const errorResponse = error['response']
    const errorData = errorResponse['data']
    if (errorResponse.status == 401) {
      serverError.value = errorData['detail'].split(',')
      toast.error(serverError.value[0], { timeout: 1500 })
    } else {
      toast.error("Something went wrong, Please try again with valid information", { timeout: 1500 })
    }
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.ant-row) {
  display: inline;
}
</style>
