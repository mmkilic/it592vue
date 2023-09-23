<template>
  <b-navbar toggleable="lg" variant="success">
    <b-navbar-brand href="/">Project Follower</b-navbar-brand>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right>
        <!-- Using 'button-content' slot -->
        <template #button-content>
          <em>{{user.fullName}}</em>
        </template>
        <b-dropdown-item @click="logout">Logout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {
      user: {fullName: ""}
    };
  },
  created(){
    this.user = JSON.parse(localStorage.getItem('user'));
  },
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.$router.push('login');
    },
  }
};
</script>
<style>
</style>
