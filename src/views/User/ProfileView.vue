<template>
  <div
    class="container flex min-h-full justify-center items-center flex-col px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
      >
        {{ $t('Your Profile') }}
      </h2>
    </div>
    <div
      class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-xl  bg-[#fff] p-12 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg"
    >
      <a-form
        @submit.prevent="handleSubmit"
        method="POST"
        :model="userProfile"
        name="basic"
        autocomplete="off"
      >
        <a-form-item
          :label="$t('First Name')"
          name="firstName"
          :rules="[{ required: true, message: 'Please input your firstname!' }]"
        >
          <a-input v-model:value="userProfile.firstName" aria-required="true"/>
        </a-form-item>

        <a-form-item
          :label="$t('Last Name')"
          name="lastName"
          :rules="[{ required: true, message: 'Please input your lastname!' }]"
        >
          <a-input v-model:value="userProfile.lastName" />
        </a-form-item>

        <a-form-item
          :label="$t('Email')"
          name="email"
          :rules="[
            {
              required: true,
              type: 'email',
              message: 'Please input a valid email!',
            },
          ]"
        >
          <a-input v-model:value="userProfile.email" />
        </a-form-item>

        <a-form-item class="text-center">
          <a-button class="w-full" type="primary" html-type="submit"
            >{{ $t('Submit') }}</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { email, required } from '@vuelidate/validators'
import userService from '@/services/userService.js'
import { useUserStore } from '@/stores/userStore.js'
import useVuelidate from '@vuelidate/core'
import { toast } from 'vue3-toastify'

// const toast = useToast()
const userStore = useUserStore()
const $externalResults = ref({})

const userProfile = ref({
  firstName: '',
  lastName: '',
  email: '',
})


const rules = computed(() => ({
  firstName: { required },
  lastName: { required },
  email: { required, email },
}))


const v$ = useVuelidate(rules, userProfile, { $externalResults })


function getuserProfile() {
  userProfile.value.firstName = userStore.user.firstName
  userProfile.value.lastName = userStore.user.lastName
  userProfile.value.email = userStore.user.email
}

onMounted(() => {
  getuserProfile()
})


async function handleSubmit() {
 $externalResults.value = []
  const isValid = await v$.value.$validate()
  if (!isValid) {
    // Optionally show validation errors
    toast.error('Please fill out all required fields.')
    return
  }
  try {
    const formData = {
      first_name: userProfile.value.firstName,
      last_name: userProfile.value.lastName,
      email: userProfile.value.email,
    }

    const response = await userService.updateUserProfile(userStore.user.id, formData)
    userStore.setUserProfile(response.data)
    getuserProfile()
    toast.success('Profile updated successfully!!', { timeout: 2000 })
  } catch (err) {
    console.log(err)
    toast.error('Something went wrong!!', { timeout: 2000 })
  }
}
</script>

<style scoped>
:deep(.ant-row) {
  display: inline;
}
</style>

