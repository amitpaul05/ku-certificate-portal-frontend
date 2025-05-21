<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold text-blue-800 mb-4">Head Certificate Approvals</h1>

    <table class="w-full table-auto border border-gray-300 rounded shadow bg-white">
      <thead class="bg-blue-900 text-white text-left">
        <tr>
          <th class="px-4 py-2">#</th>
          <th class="px-4 py-2">Student Name</th>
          <th class="px-4 py-2">Approval Status</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(form, index) in filteredForms" :key="form.id" class="hover:bg-blue-50 transition">
          <td class="px-4 py-2">{{ index + 1 }}</td>
          <td class="px-4 py-2">{{ form.student_details.name }}</td>
          <td class="px-4 py-2">
            <StatusBadge :approved="form.is_head_approved" />
          </td>
          <td class="px-4 py-2 space-x-2">
            <button class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" @click="openModal(form)">
              View Details
            </button>
            <button
              v-if="form.is_head_approved === false"
              class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              @click="approve(form.id)">
              Approve
            </button>
            <button
              v-if="form.is_head_approved === false"
              class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              @click="reject(form.id)">
              Reject
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for form details (reuse from your code) -->
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

        <!-- Student Info -->
        <h3 class="text-lg font-semibold text-gray-700 mb-2">👨‍🎓 Student Details</h3>
        <div class="space-y-1 mb-4">
          <div v-for="(value, key) in selectedRecord.student" :key="key" class="flex justify-between border-b pb-1">
            <span class="font-medium text-gray-700 capitalize">{{ formatKey(key) }}:</span>
            <span class="text-gray-900">{{ formatValue(value) }}</span>
          </div>
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
