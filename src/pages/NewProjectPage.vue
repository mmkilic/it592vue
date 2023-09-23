<template>
  <div class="management">
    <h3 class="my-2">Project List</h3>
    <div class="px-5 align-self-center">
      <b-spinner class="align-middle" v-if="loading" />
      <table-project :projects=projects v-else></table-project>
    </div>
  </div>
</template>

<script>
import TableProject from '../components/TableProject.vue';
import axios from "axios";

export default {
  components: { TableProject },
  data() {
    return {
      projects: [],
      loading: true,
    };
  },
  created: async function () {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user.role !== 'MANAGER'){
      this.$router.push('dashboard');
    } 
    await axios.get("/prj")
    .then(response => {
      this.projects = response.data;
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