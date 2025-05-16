<template>
  <div
    class="container flex min-h-full justify-center items-center flex-col px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- <img
        class="mx-auto w-[200px]"
        src="/src/assets/images/logo.png"
        alt="Your Company"
      /> -->
      <h2
        class="text-center text-2xl/9 font-bold tracking-tight text-gray-900"
      >
        {{ 'Sign up to your account' }}
      </h2>
    </div>
    <div
      class="mt-2 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-xl bg-[#fff] p-12 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg"
    >
      <a-form
        @submit.prevent="handleSubmit"
        method="POST"
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="First Name"
          name="first_name"
          :rules="[{ required: true, message: 'Please input your firstname!' }]"
        >
          <a-input v-model:value="formState.first_name" aria-required="true" />
        </a-form-item>

        <a-form-item
          label="Last Name"
          name="last_name"
          :rules="[{ required: true, message: 'Please input your lastname!' }]"
        >
          <a-input v-model:value="formState.last_name" />
        </a-form-item>

        <a-form-item
          label="Phone Number"
          name="phone_number"
          :rules="[
            { required: true, message: 'Please input your phone number!' },
          ]"
        >
          <a-input v-model:value="formState.phone_number" />
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          :rules="[
            {
              required: true,
              type: 'email',
              message: 'Please input a valid email!',
            },
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item class="text-center">
          <a-button class="w-full" type="primary" html-type="submit" :loading="loading" :disabled="loading"
            >{{ 'Submit' }}</a-button
          >
        </a-form-item>
      </a-form>
      <p class="mt-10 text-center text-sm text-gray-500">
        {{ 'Already a member?' }}
        <router-link :to="{ name: 'login' }" class="text-primary font-semibold">
          {{ "Log in here" }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { email, required, minLength } from '@vuelidate/validators'
import userService from '@/services/userService.js'
import { useUserStore } from '@/stores/userStore.js'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { toast } from 'vue3-toastify'

// const toast = useToast()
const userStore = useUserStore()
const router = useRouter()
const $externalResults = ref({})
const loading = ref(false)

const formState = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})

const rules = computed(() => ({
  first_name: { required },
  last_name: { required },
  email: { required, email },
  password: { required, minLength: minLength(6) },
}))

const v$ = useVuelidate(rules, formState, { $externalResults })

const onFinish = values => {
  console.log('Success:', values)
}

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo)
}

let signUpUser = reactive({})

async function handleSubmit() {
  $externalResults.value = []
  const isValid = await v$.value.$validate()
  if (!isValid) {
    // Optionally show validation errors
    toast.error('Please fill out all required fields.')
    return
  }

  try {
    loading.value = true
    const response = await userService.registerUser(formState)
    signUpUser = response['data']
    toast.success('You have successfully created an account')
  } catch (signupError) {
    const errorResponse = signupError['response']
    if (errorResponse.status == '400') {
      $externalResults.value = errorResponse.data['errors']
      toast.error(signupError.response.data.errors.phone_number[0], {
        timeout: 1500,
      })
    } else {
      toast.error(
        'Something went wrong, Please try again with valid information',
        { timeout: 1500 },
      )
    }
  }

  try {
    if (signUpUser) {
      const tokenResponse = await userService.getToken(
        signUpUser.phone_number,
        formState.password,
      )
      const userDetailsResponse = await userService.getUserDetails(
        signUpUser.id,
      )

      const userToken = tokenResponse['data']
      const userDetails = userDetailsResponse['data']

      userStore.setUserAuth(true, userToken.access, userToken.refresh)
      userStore.setUser(userDetails)

      loading.value = false

      router.push({ name: 'dashboard' })
    }
  } catch (error) {
    console.log(error)
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.ant-row) {
  display: inline;
}
</style>
