<template>
  <div>
    <!--Report Cards-->
    <dashboard-report></dashboard-report>
    
    <!-- Table -->
    <div>
      <b-spinner class="align-middle" v-if="loading" />
      <table-dashboard :projects="projects" v-else></table-dashboard>
    </div>

  </div>
</template>
<script>
import TableDashboard from '../components/TableDashboard.vue';
import DashboardReport from '../components/DashboardReport.vue';
import axios from "axios";

export default {
  components: {
    TableDashboard,
    DashboardReport
  },
  data() {
    return {
      statsCards: [
        {
          type: "warning",
          icon: "ti-bolt",
          title: "ODT-GA",
          value: "105GB",
          footerText: "On-Time / Project Count",
          footerIcon: "ti-reload"
        },
        {
          type: "success",
          icon: "ti-bolt",
          title: "MPT-GA",
          value: "$1,345",
          footerText: "On-Time / Project Count",
          footerIcon: "ti-calendar"
        },
        {
          type: "danger",
          icon: "ti-pulse",
          title: "ODT-BOM",
          value: "23",
          footerText: "On-Time / Project Count",
          footerIcon: "ti-timer"
        },
        {
          type: "info",
          icon: "ti-pulse",
          title: "MPT-BOM",
          value: "+45",
          footerText: "On-Time / Project Count",
          footerIcon: "ti-reload"
        }
      ],
      loading: true,
      projects: [],
    };
  },
  created: async function () {
    await axios.get("/prj")
    .then(response => {
      this.projects = response.data;
      this.projects.forEach(prj => {
        axios.get(`/nbr/sub/${prj.projectNumber.id}`)
        .then(response => {
          prj.projectNumber.subProjects = response.data;
        })
      });
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
