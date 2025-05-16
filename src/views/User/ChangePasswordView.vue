<template>
  <div
    class="container flex min-h-full justify-center items-center flex-col px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
      >
        {{ $t('Change Your Password') }}
      </h2>
    </div>
    <div
      class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-xl bg-[#fff] p-12 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg"
    >
      <a-form
        @submit.prevent="handleSubmit"
        method="POST"
        :model="user"
        name="basic"
        autocomplete="off"
      >
        <a-form-item
          :label="$t('Old Password')"
          name="old_password"
          :rules="[
            { required: true, message: 'Please input your old password!' },
          ]"
        >
          <a-input-password v-model:value="user.old_password" />
        </a-form-item>

        <a-form-item
          :label="$t('New Password')"
          name="new_password"
          :rules="[
            { required: true, message: 'Please input your new password!' },
          ]"
        >
          <a-input-password v-model:value="user.new_password" />
        </a-form-item>

        <a-form-item
          :label="$t('Confirm New Password')"
          name="confirm_new_password"
          :rules="[
            { required: true, message: 'Please confirm your new password!' },
            { validator: validateConfirmPassword },
          ]"
        >
          <a-input-password v-model:value="user.confirm_new_password" />
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
import { ref } from 'vue'
import userService from '@/services/userService.js'
import { toast } from 'vue3-toastify'
import { useUserStore } from '@/stores/userStore.js' // Import your user store


const userStore = useUserStore() // Initialize the user store to get the user data
const userId = userStore.user.id // Get the dynamic userId from the store

const user = ref({
  old_password: '',
  new_password: '',
  confirm_new_password: '',
})

// Validator function for the confirm password field
function validateConfirmPassword(rule, value) {
  if (!value) {
    return Promise.reject('Please confirm your new password!')
  }
  if (value !== user.value.new_password) {
    return Promise.reject('Passwords do not match!')
  }
  return Promise.resolve()
}

async function handleSubmit() {
  // Basic checks before submission
  if (!user.value.new_password || !user.value.confirm_new_password) {
    return
  }

  if (user.value.new_password !== user.value.confirm_new_password) {
    toast.error('New password and confirmation do not match.')
    return
  }

  try {
    const passwordData = {
      old_password: user.value.old_password,
      new_password: user.value.new_password,
      confirm_new_password: user.value.confirm_new_password,
    }

    // Call the user service to change the password
    await userService.changePassword(userId, passwordData)
    toast.success('Password changed successfully!', { timeout: 1500 })

    // Reset the form fields after success
    user.value.old_password = ''
    user.value.new_password = ''
    user.value.confirm_new_password = ''
  } catch (err) {
    console.error(err)
    toast.error('Failed to change password. Please try again.', {
      timeout: 1500,
    })
  }
}
</script>

<style scoped>
:deep(.ant-row) {
  display: inline;
}
</style>
