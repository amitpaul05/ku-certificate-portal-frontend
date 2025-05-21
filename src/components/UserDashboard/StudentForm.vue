<template>
  <div>
    <a-button
      @click="handleBack"
      class="font-monserrat font-medium flex gap-3 items-center"
      type="primary"
      html-type="submit"
    >
      <ArrowLongLeftIcon class="size-5" /> Go Back
    </a-button>
    <div
      class="flex min-h-full justify-center items-center flex-col px-6 py-12 lg:px-8"
    >
      <div
        class="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-xl mt-10 p-8 rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
      >
        <a-form
          @submit.prevent="handleSubmit"
          method="POST"
          :model="formserviceDefaultValue"
          name="basic"
          autocomplete="off"
        >
          <a-form-item
            label="Hall Name"
            name="hallname"
            :rules="[
              { required: true, message: 'Please provide your Hall Name!' },
            ]"
          >
            <a-select
              v-model:value="formserviceDefaultValue.hall"
              show-search
              placeholder="Select a Hall"
              style="width: 100%"
              :options="options"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChange"
            />
          </a-form-item>

          <a-form-item
            label="Degree"
            name="degree"
            :rules="[
              { required: true, message: 'Please provide your Degree!' },
            ]"
          >
            <a-select
              v-model:value="formserviceDefaultValue.degree"
              placeholder="Select a Degree"
              style="width: 100%"
            >
              <a-select-option value="bachelor">Bachelor</a-select-option>
              <a-select-option value="masters">Masters</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="Total Credit"
            name="totalCredit"
            :rules="[
              { required: true, message: 'Please provide your Total Credit!' },
            ]"
          >
            <a-input-number
              placeholder="0.00"
              v-model:value="formserviceDefaultValue.total_credit"
              :step="0.01"
              :min="0"
              style="width: 100%"
              aria-required="true"
            />
          </a-form-item>

          <a-form-item
            label="Earned Credit"
            name="earnedCredit"
            :rules="[
              { required: true, message: 'Please provide your Earned Credit!' },
            ]"
          >
            <a-input-number
              placeholder="0.00"
              v-model:value="formserviceDefaultValue.earned_credit"
              :step="0.01"
              :min="0"
              style="width: 100%"
              aria-required="true"
            />
          </a-form-item>

          <a-form-item
            label="CGPA"
            name="cgpa"
            :rules="[{ required: true, message: 'Please provide your CGPA!' }]"
          >
            <a-input-number
              placeholder="0.00"
              v-model:value="formserviceDefaultValue.cgpa"
              :step="0.01"
              :min="0"
              :max="4"
              style="width: 100%"
              aria-required="true"
            />
          </a-form-item>

         <a-form-item
            label="Date of Last Exam"
            name="date"
            :rules="[{ required: true, message: 'Please select a date!' }]"
          >
            <a-date-picker
              v-model:value="formserviceDefaultValue.date_of_last_exam"
              valueFormat="YYYY-MM-DD"
              @change="handleDateChange"
            />
          </a-form-item>

          <!-- <a-form-item
            label="Last Date of Exam"
            name="examDate"
            :rules="[
              {
                required: true,
                message: 'Please provide the Last Date of Exam!',
              },
            ]"
          >
            <a-date-picker
              v-model:value="formserviceDefaultValue.pas"
              picker="year"
              style="width: 100%"
              placeholder="Select Year"
            />
          </a-form-item> -->

          <a-form-item class="text-center">
            <a-button
              type="primary"
              html-type="submit"
              class="w-full font-monserrat font-medium"
            >
              {{ recordId ? "Update Student Info" : "Submit Student Info" }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { toast } from "vue3-toastify";
import { useUserStore } from "@/stores/userStore";
import { useRoute, useRouter } from "vue-router";
import studentService from "@/services/studentService";
import formService from "@/services/formService";
import hallService from "@/services/hallService";


const router = useRouter();
const $externalResults = ref({});
const route = useRoute();

const selected = ref(null);
const options = ref([]);
const allHallList = ref([]);
const selectedHall = ref(null);

const formserviceDefaultValue = ref({
  degree: "",
  total_credit: null,
  earned_credit: null,
  cgpa: null,
  date_of_last_exam: null,
  student: useUserStore().user.studentDetails.student_id,
  discipline: useUserStore().user.studentDetails.discipline,
  hall: null,
});

const recordId = route.params.id;
const getAllHall = async () => {
  try {
    const response = await hallService.getAllHall();
    allHallList.value = response.data.results;
    options.value = response.data.results.map((hall) => ({
      value: hall.id,
      label: hall.name,
    }));
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong", { timeout: 1500 });
  }
};

onMounted(async () => {
  await getAllHall();
  console.log("user", useUserStore().user.studentDetails);
});

const handleChange = (value) => {
  selectedHall.value = value;
  formserviceDefaultValue.value.hall = value;
};

const handleDateChange = (date, dateString) => {
  formserviceDefaultValue.value.date_of_last_exam = dateString;
};

const handleBlur = () => {
  console.log("blur");
};

const handleFocus = () => {
  console.log("focus");
};

const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

const rules = computed(() => ({
  hall: { required },
  cgpa: { required },
}));

async function handleSubmit() {

  console.log("Form data:", formserviceDefaultValue.value);
  try {
    await formService.createForm(formserviceDefaultValue.value);
    toast.success("Form created successfully", { timeout: 1500 });

    router.push({ name: "student" });
  } catch (err) {
    // console.error(err);
    toast.error("Something went wrong. Please try again.", {
      timeout: 1500,
    });
  }
}

function handleBack() {
  router.back();
}
</script>

<style scoped>
:deep(.ant-row) {
  display: inline;
}
</style>
