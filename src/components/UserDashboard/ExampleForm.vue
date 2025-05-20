<template>
  <div>
    <a-button
      @click="handleBack"
      class="font-monserrat font-medium flex gap-3 items-center"
      type="primary"
      html-type="submit"
    >
      <ArrowLongLeftIcon class="size-5" /> {{ $t('Go Back') }}
    </a-button>
    <div
      class="flex min-h-full justify-center items-center flex-col px-6 py-12 lg:px-8"
    >
      <a-typography-title :level="2" class="text-center font-monserrat !font-bold !text-main">
        {{ recordId ? $t('Edit Booking Company') : $t('Create Booking Company') }}
      </a-typography-title>
      <div class="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-xl mt-10 p-8 rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <a-form
          @submit.prevent="handleSubmit"
          method="POST"
          :model="bookingCompanyDefaultValue"
          name="basic"
          autocomplete="off"
        >
          <a-form-item :label="$t('Company')" name="company" style="width: 100%">
            <a-select
              v-model:value="selectedCompany"
              show-search
              placeholder="Select a company"
              style="width: 200px"
              :options="options"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChange"
            ></a-select>
          </a-form-item>

          <a-form-item
            :label="${$t('Title')} [en]"
            name="title_en"
            :rules="[
              { required: true, message: 'Please provide your company name!' },
            ]"
          >
            <a-input
              v-model:value="bookingCompanyDefaultValue.title_en"
              aria-required="true"
            />
          </a-form-item>

          <a-form-item
            :label="$t('Code')"
            name="code"
            :rules="[
              {
                required: true,
                message: 'Please provide your code!',
              },
            ]"
          >
            <a-input v-model:value="bookingCompanyDefaultValue.code" />
          </a-form-item>

          <a-form-item class="text-center">
            <a-button
              class="w-full font-monserrat font-medium"
              type="primary"
              html-type="submit"
            >
            {{ recordId ? $t('Update Booking Company') : $t('Add Booking Company') }}
            </a-button>
          </a-form-item>
          
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLongLeftIcon } from '@heroicons/vue/24/outline'
import bookingCompanyService from '@/services/bookingCompanyService'
import companyService from '@/services/companyService'

const toast = useToast()
const router = useRouter()
const $externalResults = ref({})
const route = useRoute()
const selectedCompany = ref(null)
const options = ref([])
const allCompanyList = ref([])
const bookingCompanyDefaultValue = ref({
  title: '',
  title_en: '',
  title_bn: '',
  title_zh_hans: '',
  code: '',
  company: null,
})
const recordId = route.params.id

const getAllCompany = async () => {
  try {
    const response = await companyService.getAllCompanies()
    allCompanyList.value = response.data.results
    options.value = response.data.results.map(company => ({
      value: company.id,
      label: company.name,
    }))
  } catch (error) {
    console.log(error)
    toast.error('Something went wrong', { timeout: 1500 })
  }
}

onMounted(async () => {
  await getAllCompany()
  if (recordId) {
    try {
      const response =
        await bookingCompanyService.getBookingCompanyById(recordId)
      bookingCompanyDefaultValue.value = response.data

      if (response.data.company && allCompanyList.value.length) {
        const previousSelectedCompany = allCompanyList.value.find(
          item => item.id === response.data.company,
        )
        if (previousSelectedCompany) {
          bookingCompanyDefaultValue.value.company = previousSelectedCompany.id
          selectedCompany.value = previousSelectedCompany.id
        }
      }
    } catch (err) {
      console.error('Failed to fetch academy details:', err)
    }
  }
})

const handleChange = value => {
  selectedCompany.value = value
  bookingCompanyDefaultValue.value.company = value
}

const handleBlur = () => {
  console.log('blur')
}

const handleFocus = () => {
  console.log('focus')
}

const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

const rules = computed(() => ({
  title: { required },
  code: { required },
}))

const v$ = useVuelidate(rules, bookingCompanyDefaultValue, { $externalResults })

async function handleSubmit() {

//   const locale = localStorage.getItem('locale')

//   if (locale && locale.toLocaleLowerCase() === 'bn') {
//     bookingCompanyDefaultValue.value.title = bookingCompanyDefaultValue.value.title_bn
//   } else {
//     bookingCompanyDefaultValue.value.title = bookingCompanyDefaultValue.value.title_en
//   }


  $externalResults.value = []
  const isValid = await v$.value.$validate()
  if (!isValid) {
    toast.error('Please fill out all required fields.')
    return
  }

  try {
    if (recordId) {
      await bookingCompanyService.updateBookingCompany(
        recordId,
        bookingCompanyDefaultValue.value,
      )
      toast.success('Booking Company updated successfully', { timeout: 1500 })
    } else {
      await bookingCompanyService.createBookingCompany(
        bookingCompanyDefaultValue.value,
      )
      toast.success('Booking Company created successfully', { timeout: 1500 })
    }

    v$.value.$reset()
    router.push({ name: 'booking-company' })
  } catch (err) {
    console.error(err)
    toast.error('Something went wrong. Please try again.', {
      timeout: 1500,
    })
  }
}

function handleBack() {
  router.back()
}
</script>

<style scoped>
:deep(.ant-row) {
  display: inline;
}
</style>