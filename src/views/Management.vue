<template>
  <div class="management">
    <h1 class="my-2">New Project</h1>
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <management-form />
      </div>
      <div class="col-md-3"></div>
    </div>
    <hr>
    <h1 class="my-2">Project List</h1>
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col align-self-center">
        <b-spinner class="align-middle" v-if="loading" />
        <management-table :projects=projects v-else></management-table>
      </div>
      <div class="col-md-2"></div>
    </div>
  </div>
</template>

<script>
import ManagementForm from "../components/ManagementForm.vue";
import ManagementTable from '../components/ManagementTable.vue';
import axios from "axios";

export default {
  components: { ManagementForm, ManagementTable },
  data() {
    return {
      projects: {},
      loading: true,
    };
  },
  created: async function () {
    await axios.get("http://localhost:8081/api/prj")
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