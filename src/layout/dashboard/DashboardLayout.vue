<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" name="Dashboard" icon="ti-panel"/>
        <sidebar-link v-if="manager" to="/user" name="New User" icon="ti-user"/>
        <sidebar-link v-if="manager" to="/project" name="New Project" icon="ti-view-list-alt"/>
        <sidebar-link v-if="noOther" to="/designer" name="Designer" icon="ti-bell"/>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click.native="toggleSidebar">
      </dashboard-content>
      <content-footer></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent
  },
  data(){
    return{
      manager: false,
      noOther: true
    };
  },
  created: function (){
    const user = JSON.parse(localStorage.getItem('user'));
    if(user.role === 'MANAGER') {
      this.manager = true;
    }
    if(user.role === 'OTHER') {
      this.noOther = false;
    }
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>

<style lang="scss">
</style>