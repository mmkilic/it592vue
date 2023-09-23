<template>
  <div>
    <designer-report :user="user"></designer-report>
    <div class="px-3 align-self-center">
      <b-spinner class="align-middle" v-if="loading" />
      <designer-task :user="user" :projects="projects" v-else></designer-task>
    </div>
  </div>
</template>

<script>
import DesignerTask from "../components/DesignerTask.vue";
import DesignerReport from "../components/DesignerReport.vue";
import axios from "axios";

export default {
  components: { DesignerTask, DesignerReport },
  data() {
    return {
      user: { id: 0, fullName: "" },
      loading: true,
      projects: [],
      
    };
  },
  created: async function () {
    this.user = JSON.parse(localStorage.getItem("user"));
    await axios
      .get(`/prj/user/${this.user.id}`)
      .then((response) => {
        this.projects = response.data;
        this.loading = false;
      })
      .catch((e) => {
        console.log(e);
        this.loading = true;
      });
  }
};
</script>

<style>
</style>