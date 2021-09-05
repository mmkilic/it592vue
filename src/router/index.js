import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: "active"
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const user = JSON.parse(localStorage.getItem('user'));

  if(authRequired && user === null){
    return next('/login');
  }
  next();
});

Vue.use(VueRouter);

export default router;
