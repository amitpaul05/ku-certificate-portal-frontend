<template>
  <a-layout has-sider>
    <a-layout-sider
     :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="!min-w-[250px]"
    >
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <template v-for="(item, index) in dashboardMenus" :key="item.id">
          <template
            v-if="
              item.upperTitle &&
              (index === 0 ||
                dashboardMenus[index - 1].upperTitle !== item.upperTitle)
            "
          >
            <a-menu-item-group>
              <span
                :class="[!collapsed ? 'block' : 'hidden']"
                class="section-title font-semibold text-slate-400 pl-3 mb-5"
                >{{ item.upperTitle }}</span
              >
            </a-menu-item-group>
          </template>

          <router-link :to="{ name: item.link }">
            <a-menu-item :key="item.id" class="text-[16px] font-monserrat group">
              <component
                :is="item.icon"
                class="size-5 inline-block mr-3 mt-[-4px]"
              />
              <span class="font-medium text-slate-300 group-hover:text-white title">{{ item.title }}</span>
            </a-menu-item>
          </router-link>
        </template>
        <li class="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center" @click="handleSignOut"> Sign Out </li>
      </a-menu>
      
    </a-layout-sider >
    <a-layout :style="{ marginLeft: '240px' }">
      <NavBar v-model:collapsed="collapsed"></NavBar>
      <a-layout-content class="bg-background my-6 mx-4 p-6 min-h-[280px]">
        <Student v-if="route.name === 'dashboard'" />
        <RouterView></RouterView>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
import Student from '@/components/UserDashboard/Student.vue'
import {
  BriefcaseIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  ArchiveBoxIcon,
  TruckIcon,
  TagIcon,
  PaperAirplaneIcon,
  DocumentIcon,
  TicketIcon,
  InboxStackIcon,
  ClipboardDocumentCheckIcon,
  DocumentCurrencyDollarIcon,
  CalculatorIcon,
  BanknotesIcon,
  NewspaperIcon

} from '@heroicons/vue/24/solid'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
// import Dashboard from '@/components/Dashboard/Dashboard.vue'

// State management for the sidebar collapse and menu selection
const selectedKeys = ref(['1'])
const collapsed = ref(false)
const route = useRoute()
const path = ref('')

onMounted(() => {
  path.value = route.fullPath
})

function handleSignOut() {
  useUserStore().signOutCurrenUser()
  router.push({ name: 'login' }) // redirect to login or homepage
}

watch(
  () => route.fullPath,
  newPath => {
    path.value = newPath
  },
)

const dashboardMenus = [
  {
    id: 1,
    title: 'Dashboard',
    icon: HomeIcon,
    link: 'student',
  },
]
</script>

<style>

.router-link-exact-active .title {
  color: #fff;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  background: url(/src/assets/images/logo.svg);
  margin: 10px auto;
  background-size: contain;
  background-position: 100%;
  background-repeat: no-repeat;
  height: 80px;
  max-width: 80px;
  background-color: #c1c1c1;
  border-radius: 50%;
}

.site-layout .site-layout-background {
  background: #fff;
}

.ant-layout.ant-layout-has-sider {
  min-height: 100vh;
}

.ant-layout-sider-collapsed {
  min-width: unset !important;
}

.ant-menu .ant-menu-item-group {
  margin-top: 25px;
}

.ant-menu .ant-menu-item-group:first {
  margin-top: 0;
}
</style>
