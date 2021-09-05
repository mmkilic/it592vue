<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-md-6 col-xl-3" v-for="stats in statsCards" :key="stats.title">
        <stats-card>
          <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{stats.title}}</p>
            {{stats.value}}
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{stats.footerText}}
          </div>
        </stats-card>
      </div>
    </div>

    <!-- Table -->
    <div>
      <b-spinner class="align-middle" v-if="loading" />
      <table-dashboard :projects="projects" v-else></table-dashboard>
    </div>

  </div>
</template>
<script>
import { StatsCard } from "@/components/index";
import TableDashboard from '../components/TableDashboard.vue';
import axios from "axios";

export default {
  components: {
    StatsCard,
    TableDashboard
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
