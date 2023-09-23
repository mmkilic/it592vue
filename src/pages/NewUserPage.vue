<template>
  <div>
    <h3 class="my-2">User List</h3>
      <div class="px-5 align-self-center">
        <b-spinner class="align-middle" v-if="loading" />
        <table-users :users=users v-else></table-users>
      </div>
  </div>
</template>

<script>
import TableUsers from '../components/TableUsers.vue';
import axios from "axios";

export default {
  components: { TableUsers },
  data() {
    return {
      users: [],
      loading: true,
    };
  },
  created: async function () {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user.role !== 'MANAGER'){
      this.$router.push('dashboard');
    } 
    await axios.get("/user")
    .then(response => {
      this.users = response.data;
      this.loading = false;
    })
    .catch(e => {
      console.log(e);
      this.loading = false;
    })
  },
};
</script>

<style>
</style>