import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Login from "@/pages/LoginPage.vue";
import Dashboard from "@/pages/Dashboard.vue";
import NewUser from "@/pages/NewUserPage.vue";
import NewProject from "@/pages/NewProjectPage.vue";
import Designer from "@/pages/DesignerPage.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',  
    component: Login
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "user",
        name: "user",
        component: NewUser
      },
      {
        path: "project",
        name: "project",
        component: NewProject
      },
      {
        path: "designer",
        name: "designer",
        component: Designer
      }
    ]
  },
  { path: "*", component: NotFound }
];

export default routes;
