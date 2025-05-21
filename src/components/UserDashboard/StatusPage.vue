<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold text-blue-800 mb-4">
      Certificate Approval Status
    </h1>

    <div
      v-if="statusRecords.length > 0 && isFullyApproved"
      class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
    >
      🎉 <strong>Congratulations!</strong> Your request is approved. Please
      visit the Academic Section to collect your certificate.
    </div>

    <table
      class="w-full table-auto border border-gray-300 rounded shadow bg-white"
    >
      <thead class="bg-blue-900 text-white text-left">
        <tr>
          <th class="px-4 py-2">Student ID</th>
          <th class="px-4 py-2">Discipline</th>
          <th class="px-4 py-2">Hall</th>
          <th class="px-4 py-2">Librarian</th>
          <th class="px-4 py-2">Hall Provost</th>
          <th class="px-4 py-2">Head</th>
          <th class="px-4 py-2">DSA</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(record, index) in statusRecords"
          :key="index"
          class="hover:bg-blue-50 transition"
        >
          <td class="px-4 py-2">{{ record.student_name }}</td>
          <td class="px-4 py-2">{{ record.discipline }}</td>
          <td class="px-4 py-2">{{ record.hall }}</td>
          <td class="px-4 py-2">
            <StatusBadge :approved="record.librarian" />
          </td>
          <td class="px-4 py-2">
            <StatusBadge :approved="record.hall_provost" />
          </td>
          <td class="px-4 py-2">
            <StatusBadge :approved="record.head" />
          </td>
          <td class="px-4 py-2">
            <StatusBadge :approved="record.dsa" />
          </td>
          <td class="px-4 py-2">
            <button
              class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              @click="openModal(index)"
            >
              View Details
            </button>
          </td>
          <td>
            <template v-if="userType !== 'student' && canApprove(record)">
              <button
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                @click="submitApproval(record.id)"
              >
                Approve
              </button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Form Details</h2>

        <div
          v-for="section in detailSections"
          :key="section.label"
          class="mb-4"
        >
          <h3 class="text-lg font-semibold text-gray-700 mb-2">
            {{ section.label }}
          </h3>
          <div class="space-y-1">
            <div
              v-for="(value, key) in section.data"
              :key="key"
              class="flex justify-between border-b pb-1"
            >
              <span class="font-medium text-gray-700 capitalize"
                >{{ formatKey(key) }}:</span
              >
              <span class="text-gray-900">{{ formatValue(value) }}</span>
            </div>
          </div>
        </div>

        <!-- Approval Section -->
        <div
          class="mt-6 border-t pt-4"
        >
          <h3 class="font-semibold mb-2">🔐 {{ currentRoleLabel }} Approval</h3>
          <div class="flex items-center gap-4 mb-4">
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import StatusBadge from "./StatusBadge.vue";
import formService from "@/services/formService";
import { toast } from "vue3-toastify";
import { useUserStore } from "@/stores/userStore";

const rawUserType = useUserStore().user.user_type; // plain string
const teacherDetails = useUserStore().user.teacherDetails;

const userType = ref(rawUserType);

if (rawUserType === "teacher") {
  if (teacherDetails?.head_info) {
    userType.value = "head";
  } else if (teacherDetails?.provost_info) {
    userType.value = "provost";
  } else if (teacherDetails?.dsa_info) {
    userType.value = "dsa";
  }
}

// Helper to check approval conditions
const canApprove = (record) => {
  if (userType.value === "librarian") {
    return true
  }
  if (userType.value === "provost") {
    return record.librarian;
  }
  if (userType.value === "head") {
    return record.librarian && record.hall_provost;
  }
  if (userType.value === "dsa") {
    return record.librarian && record.hall_provost && record.head;
  }
  return false;
};

// Props
const props = defineProps({
  loggedInRole: String, // 'student', 'librarian', 'hall_provost', 'head', 'dsa'
});

// State
const allFormList = ref([]);
const statusRecords = ref([]);
const isFullyApproved = ref(false);
const showModal = ref(false);
const selectedRecord = ref(null);
const selectedRecordIndex = ref(null);
const approvalDecision = ref(null);
const currentRole = ref(null);



// Derived
const currentRoleLabel = computed(() => {
  return (
    currentRole.value
      ?.replace("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || ""
  );
});

const detailSections = computed(() => [
  { label: "Basic Information", data: selectedRecord.value?.basic || {} },
  { label: "Student Details", data: selectedRecord.value?.student || {} },
  { label: "Discipline Details", data: selectedRecord.value?.discipline || {} },
  { label: "Hall Details", data: selectedRecord.value?.hall || {} },
]);

// Open modal
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
      is_provost_approved: form.is_provost_approved,
    },
    student: form.student_details,
    discipline: form.discipline_details,
    // hall: form.hall_details,
    hall: {
      name: form.hall_details?.name || "—", // ✅ Only pick the hall name
    },
  };

  const status = {
    librarian: form.is_librarian_approved,
    hall_provost: form.hall_details?.current_provost !== null,
    head: form.is_head_approved,
    dsa: form.is_dsa_approved,
  };

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleApproveClick = (recordId) => {
  submitApproval(recordId);
};

const getAllForm = async () => {
  try {
    const response = await formService.getAllForm();
    allFormList.value = response.data.results;

    statusRecords.value = response.data.results.map((form) => ({
      student_name: form.student_details.student_id,
      discipline: form.discipline_details.name,
      hall: form.hall_details.name,
      id: form.id,
      librarian: form.is_librarian_approved,
      hall_provost: form.is_provost_approved,
      head: form.is_head_approved,
      dsa: form.is_dsa_approved,
    }));

    if (statusRecords.value.length > 0) {
      isFullyApproved.value = Object.values(statusRecords.value[0]).every(
        Boolean
      );
    }
  } catch (error) {
    
    toast.error("Something went wrong");
  }
};

const submitApproval = async (id) => {
 
  const user = useUserStore().user;
  const librarianDetails = user.librarianDetails;
  const teacherDetails = user.teacherDetails;
  

  let formData = {};
  let updateMethod = null;
  let roleLabel = "";


  if (user.user_type === "librarian") {
    if (!librarianDetails?.id) {
      toast.error("Invalid librarian info");
      return;
    }
    formData = {
      is_librarian_approved: true,
      librarian_approved_by: librarianDetails.id,
    };
    updateMethod = formService.updateByLibrarianForm;
    roleLabel = "Librarian";
  } else if (teacherDetails?.provost_info) {
    formData = {
      is_provost_approved: true,
      provost_approved_by: teacherDetails.provost_info.id,
    };
    updateMethod = formService.updateByProvostForm;
    roleLabel = "Provost";
  } else if (teacherDetails?.head_info) {
    formData = {
      is_head_approved: true,
      head_approved_by: teacherDetails.head_info.id,
    };
    updateMethod = formService.updateByHeadForm;
    roleLabel = "Head";
  } else if (teacherDetails?.dsa_info) {
    formData = {
      is_dsa_approved: true,
      dsa_approved_by: teacherDetails.dsa_info.id,
    };
    updateMethod = formService.updateByDsaForm;
    roleLabel = "DSA";
  } else {
    toast.error("Unauthorized role");
    return;
  }


  try {
    await updateMethod(id, formData);
    toast.success(`Successfully approved by ${roleLabel}`);
    await getAllForm(); // refresh form list
  } catch (error) {
    toast.error("Approval failed");
  }
};

onMounted(getAllForm);

const formatKey = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
const formatValue = (value) =>
  typeof value === "boolean"
    ? value
      ? "✅ Approved"
      : "❌ Not Approved"
    : value ?? "—";
</script>

<style scoped>
input[type="radio"] {
  accent-color: green;
}
</style>
