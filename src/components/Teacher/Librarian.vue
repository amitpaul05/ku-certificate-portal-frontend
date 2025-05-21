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
          <td class="px-4 py-2"><StatusBadge :approved="record.librarian" /></td>
          <td class="px-4 py-2"><StatusBadge :approved="record.hall_provost" /></td>
          <td class="px-4 py-2"><StatusBadge :approved="record.head" /></td>
          <td class="px-4 py-2"><StatusBadge :approved="record.dsa" /></td>
          <td class="px-4 py-2">
            <button class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" @click="openModal(index)">
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

        <!-- Basic Info -->
        <h3 class="text-lg font-semibold text-gray-700 mb-2">🎓 Basic Information</h3>
        <div class="space-y-1 mb-4">
          <div v-for="(value, key) in selectedRecord.basic" :key="key" class="flex justify-between border-b pb-1">
            <span class="font-medium text-gray-700 capitalize">{{ formatKey(key) }}:</span>
            <span class="text-gray-900">{{ formatValue(value) }}</span>
          </div>
        </div>

        <!-- Student Details -->
        <h3 class="text-lg font-semibold text-gray-700 mb-2">👨‍🎓 Student Details</h3>
        <div class="space-y-1 mb-4">
          <div v-for="(value, key) in selectedRecord.student" :key="key" class="flex justify-between border-b pb-1">
            <span class="font-medium text-gray-700 capitalize">{{ formatKey(key) }}:</span>
            <span class="text-gray-900">{{ formatValue(value) }}</span>
          </div>
        </div>

        <!-- Discipline Details -->
        <h3 class="text-lg font-semibold text-gray-700 mb-2">🏫 Discipline Details</h3>
        <div class="space-y-1 mb-4">
          <div v-for="(value, key) in selectedRecord.discipline" :key="key" class="flex justify-between border-b pb-1">
            <span class="font-medium text-gray-700 capitalize">{{ formatKey(key) }}:</span>
            <span class="text-gray-900">{{ formatValue(value) }}</span>
          </div>
        </div>

        <!-- Hall Details -->
        <h3 class="text-lg font-semibold text-gray-700 mb-2">🏠 Hall Details</h3>
        <div class="space-y-1 mb-4">
          <div v-for="(value, key) in selectedRecord.hall" :key="key" class="flex justify-between border-b pb-1">
            <span class="font-medium text-gray-700 capitalize">{{ formatKey(key) }}:</span>
            <span class="text-gray-900">{{ formatValue(value) }}</span>
          </div>
        </div>

        <!-- Librarian Approval -->
        <div v-if="!selectedRecord.basic.is_librarian_approved" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Librarian Approval:</label>
          <div class="flex items-center gap-4">
            <label class="inline-flex items-center">
              <input type="radio" name="librarian_approval" value="approve" v-model="librarianApprovalStatus"
                class="form-radio text-green-600" />
              <span class="ml-2 text-green-700">Approve</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="librarian_approval" value="reject" v-model="librarianApprovalStatus"
                class="form-radio text-red-600" />
              <span class="ml-2 text-red-700">Reject</span>
            </label>
          </div>

          <button :disabled="!librarianApprovalStatus"
            class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="submitLibrarianApproval">
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
import { ref, onMounted } from 'vue'
import formService from '@/services/formService'
import { toast } from 'vue3-toastify'
import StatusBadge from '@/components/UserDashboard/StatusBadge.vue'

const allFormList = ref([])
const statusRecords = ref([])
const isFullyApproved = ref(false)

const showModal = ref(false)
const selectedRecord = ref(null)
const librarianApprovalStatus = ref(null)

const openModal = (index) => {
  const form = allFormList.value[index]
  selectedRecord.value = {
    basic: {
      degree: form.degree,
      total_credit: form.total_credit,
      earned_credit: form.earned_credit,
      cgpa: form.cgpa,
      date_of_last_exam: form.date_of_last_exam,
      is_paid: form.is_paid,
      is_librarian_approved: form.is_librarian_approved,
      is_head_approved: form.is_head_approved,
      is_dsa_approved: form.is_dsa_approved,
      is_controller_approved: form.is_controller_approved,
    },
    student: form.student_details,
    discipline: form.discipline_details,
    hall: form.hall_details,
  }
  librarianApprovalStatus.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const getAllLibrarian = async () => {
  try {
    const response = await formService.getAllLibrarian()
    allFormList.value = response.data.results

    statusRecords.value = response.data.results.map(form => ({
      librarian: form.is_librarian_approved,
      hall_provost: form.hall_details?.current_provost !== null,
      head: form.is_head_approved,
      dsa: form.is_dsa_approved,
    }))

    if (statusRecords.value.length > 0) {
      isFullyApproved.value = Object.values(statusRecords.value[0]).every(Boolean)
    }
  } catch (error) {
    console.error("Error fetching form data:", error)
    toast.error("Something went wrong", { timeout: 1500 })
  }
}

const submitLibrarianApproval = async () => {
  try {
    if (!selectedRecord.value?.student?.id) {
      toast.error("No student record selected")
      return
    }

    const form = allFormList.value.find(
      form => form.student_details.id === selectedRecord.value.student.id
    )

    if (!form) {
      toast.error("Form not found")
      return
    }

    if (librarianApprovalStatus.value === 'approve') {
      await formService.approveLibrarian(form.id)
      toast.success("Form approved by Librarian ✅", { timeout: 1500 })
    } else {
      toast.info("Form marked as Rejected ❌", { timeout: 1500 })
    }

    closeModal()
    getAllLibrarian()
  } catch (error) {
    console.error("Approval error:", error)
    toast.error("Failed to submit approval", { timeout: 1500 })
  }
}

onMounted(getAllLibrarian)

const formatKey = (key) => {
  return key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())
}

const formatValue = (value) => {
  if (typeof value === 'boolean') return value ? '✅ Approved' : '❌ Not Approved'
  if (value === null || value === undefined) return '—'
  return value
}
</script>

<style scoped>
/* Optional styles */
</style>
