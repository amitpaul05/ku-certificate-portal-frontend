import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/User/LoginView.vue";
import SignupView from "@/views/User/SignupView.vue";
import DashboardView from "@/views/dashboard/DashboardView.vue";
import Student from "@/components/UserDashboard/Student.vue";

import StudentForm from "@/components/UserDashboard/StudentForm.vue";
import StatusPage from "@/components/UserDashboard/StatusPage.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes: [
  //   {
  //     path: "/",
  //     name: "login",
  //     component: LoginView,
  //   },
  //   {
  //     path: "/signup",
  //     name: "signup",
  //     component: SignupView,
  //   },
  //   {
  //     path: "/dashboard",
  //     name: "dashboard",
  //     component: DashboardView,
  //   },
  //   {
  //     path: "/student",
  //     name: "student",
  //     component: Student,
  //   },

  //   {
  //     path: "/studentform",
  //     name: "studentForm",
  //     component: StudentForm,
  //   },
  //   {
  //     path: "/statuspage",
  //     name: "statuspage",
  //     component: StatusPage,
  //   },
    
  // ],


  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      children: [
        {
          path: "/studentform",
          name: "studentForm",
          component: StudentForm,
        },
      
    {
      path: "/student",
      name: "student",
      component: Student,
    },

    {
      path: "/studentform",
      name: "studentForm",
      component: StudentForm,
    },
    {
      path: "/statuspage",
      name: "statuspage",
      component: StatusPage,
    },
        
      ],
    },
  ],
});

export default router;
