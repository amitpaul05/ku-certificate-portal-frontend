<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold text-blue-800 mb-4">Certificate Approval Status</h1>

    <div v-if="statusRecords.length > 0 && isFullyApproved"
         class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      🎉 <strong>Congratulations!</strong> Your request is approved.
      Please visit the Academic Section to collect your certificate.
    </div>

    <table class="w-full table-auto border border-gray-300 rounded shadow bg-white">
      <thead class="bg-blue-900 text-white text-left">
        <tr>
          <th class="px-4 py-2">#</th>
          <th class="px-4 py-2">Librarian</th>
          <th class="px-4 py-2">Hall Provost</th>
          <th class="px-4 py-2">Head</th>
          <th class="px-4 py-2">DSA</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in statusRecords" :key="index" class="hover:bg-blue-50 transition">
          <td class="px-4 py-2">{{ index + 1 }}</td>
          <td class="px-4 py-2">
            <StatusBadge
              :label="record.librarian ? 'Approved' : 'Pending'"
              :bgClass="record.librarian ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'"
            />
          </td>
          <td class="px-4 py-2">
            <StatusBadge
              :label="record.hall_provost ? 'Approved' : 'Pending'"
              :bgClass="record.hall_provost ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'"
            />
          </td>
          <td class="px-4 py-2">
            <StatusBadge
              :label="record.head ? 'Approved' : 'Pending'"
              :bgClass="record.head ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'"
            />
          </td>
          <td class="px-4 py-2">
            <StatusBadge
              :label="record.dsa ? 'Approved' : 'Pending'"
              :bgClass="record.dsa ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'"
            />
          </td>
          <td class="px-4 py-2">
            <button
              class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              @click="openModal(index)"
            >
              View Details
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Form Details</h2>

        <div v-for="section in detailSections" :key="section.label" class="mb-4">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ section.label }}</h3>
          <div class="space-y-1">
            <div v-for="(value, key) in section.data" :key="key" class="flex justify-between border-b pb-1">
              <span class="font-medium text-gray-700 capitalize">{{ formatKey(key) }}:</span>
              <span class="text-gray-900">{{ formatValue(value) }}</span>
            </div>
          </div>
        </div>

        <!-- Approval Section -->
        <div
          v-if="canApprove"
          class="mt-6 border-t pt-4"
        >
          <h3 class="font-semibold mb-2">🔐 {{ currentRoleLabel }} Approval</h3>
          <div class="flex items-center gap-4 mb-4">
            <label class="flex items-center gap-2">
              <input type="radio" v-model="approvalDecision" value="approved" /> Approved
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" v-model="approvalDecision" value="rejected" /> Rejected
            </label>
          </div>
          <button
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            :disabled="!approvalDecision"
            @click="submitApproval"
          >
            Submit Decision
          </button>
        </div>

        <div class="flex justify-end mt-4">
          <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import StatusBadge from './StatusBadge.vue';
import formService from '@/services/formService';
import { toast } from 'vue3-toastify';

const allFormList = ref([]);
const statusRecords = ref([]);
const isFullyApproved = ref(false);

const showModal = ref(false);
const selectedRecord = ref(null);
const selectedRecordIndex = ref(null);
const approvalDecision = ref(null);
const currentRole = ref(null);

const userRole = ref(localStorage.getItem('role')); // 'student', 'librarian', 'hall_provost', 'head', 'dsa'

const currentRoleLabel = computed(() => {
  return currentRole.value?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || '';
});

const canApprove = computed(() => {
  if (!currentRole.value || currentRole.value !== userRole.value) return false;

  const record = statusRecords.value[selectedRecordIndex.value];
  if (!record) return false;

  if (currentRole.value === 'hall_provost') return record.librarian;
  if (currentRole.value === 'head') return record.librarian && record.hall_provost;
  if (currentRole.value === 'dsa') return record.librarian && record.hall_provost && record.head;
  return true;
});

const detailSections = computed(() => [
  { label: 'Basic Information', data: selectedRecord.value?.basic || {} },
  { label: 'Student Details', data: selectedRecord.value?.student || {} },
  { label: 'Discipline Details', data: selectedRecord.value?.discipline || {} },
  { label: 'Hall Details', data: selectedRecord.value?.hall || {} },
]);

const openModal = (index) => {
  const form = allFormList.value[index];
  selectedRecordIndex.value = index;

  selectedRecord.value = {
    basic: {
      degree: form.degree,
      total_credit: form.total_credit,
      earned_credit: form.earned_credit,
      cgpa: form.cgpa,
      date_of_last_exam: form.date_of_last_exam,
      is_paid: form.is_paid,
      is_head_approved: form.is_head_approved,
      is_librarian_approved: form.is_librarian_approved,
      is_dsa_approved: form.is_dsa_approved,
      is_controller_approved: form.is_controller_approved,
    },
    student: form.student_details,
    discipline: form.discipline_details,
    hall: form.hall_details
  };

  const status = {
    librarian: form.is_librarian_approved,
    hall_provost: form.hall_details?.current_provost !== null,
    head: form.is_head_approved,
    dsa: form.is_dsa_approved
  };

  statusRecords.value[index] = status;

  if (!status.librarian) currentRole.value = 'librarian';
  else if (!status.hall_provost) currentRole.value = 'hall_provost';
  else if (!status.head) currentRole.value = 'head';
  else if (!status.dsa) currentRole.value = 'dsa';
  else currentRole.value = null;

  approvalDecision.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitApproval = async () => {
  if (!currentRole.value || !approvalDecision.value) return;

  const formId = allFormList.value[selectedRecordIndex.value].id;
  const isApproved = approvalDecision.value === 'approved';

  try {
    await formService.updateApproval(formId, currentRole.value, isApproved);
    toast.success(`Successfully ${approvalDecision.value} by ${currentRoleLabel.value}`);
    await getAllForm();
    closeModal();
  } catch (error) {
    console.error(error);
    toast.error("Approval failed");
  }
};

const getAllForm = async () => {
  try {
    const response = await formService.getAllForm();
    allFormList.value = response.data.results;

    statusRecords.value = response.data.results.map(form => ({
      librarian: form.is_librarian_approved,
      hall_provost: form.hall_details?.current_provost !== null,
      head: form.is_head_approved,
      dsa: form.is_dsa_approved
    }));

    if (statusRecords.value.length > 0) {
      isFullyApproved.value = Object.values(statusRecords.value[0]).every(Boolean);
    }
  } catch (error) {
    console.error("Error fetching form data:", error);
    toast.error("Something went wrong");
  }
};

onMounted(getAllForm);

const formatKey = (key) => key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
const formatValue = (value) => typeof value === 'boolean' ? (value ? '✅ Approved' : '❌ Not Approved') : (value ?? '—');
</script>

<style scoped>
input[type="radio"] {
  accent-color: green;
}
</style>
