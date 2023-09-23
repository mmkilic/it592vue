<template>
  <div>
    <b-row>
      <b-col>
        <h3 class="m-1 pb-4">Designer Page - {{ user.fullName }}</h3>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectedYear" :options="years" @change="updateByYear"></b-form-select>
      </b-col>
    </b-row>
    <!--Stats cards-->
    <div class="row">
      <div class="col-md-6 col-xl-3" v-for="stats in statsCards" :key="stats.title">
        <stats-card>
          <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{ stats.title }}</p>
            {{ stats.value }}
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{ stats.footerText }}
          </div>
        </stats-card>
      </div>
    </div>
  </div>
</template>

<script>
import { StatsCard } from "@/components/index";
import axios from "axios";

export default {
  components: { StatsCard },
  props: ['user'],
  data() {
    return {
      statsCards: [
        {
          type: "warning",
          icon: "ti-check-box",
          title: "Task",
          value: "",
          footerText: "Completed task count",
        },
        {
          type: "success",
          icon: "ti-thumb-up",
          title: "On-Time",
          value: "",
          footerText: "On-time project rate",
        },
        {
          type: "danger",
          icon: "ti-thumb-down",
          title: "Late",
          value: "",
          footerText: "Late project rate",
        },
        {
          type: "info",
          icon: "ti-plug",
          title: "Continue",
          value: "",
          footerText: "Ongoing project count",
        },
      ],
      projects: [],
      years: ["2020", "2021", "2022"],
      selectedYear: "2021",
      report: {
        activeTaskCount: 0,
        ontimeRate: 0,
        lateRate: 0,
        ongoingProjectCount: 0,
      },
    };
  },
  async created(){
    await this.getProjects(this.selectedYear);
    await this.setReport(this.projects);
    this.setCardValues();
  },
  methods: {
    async updateByYear() {
      await this.getProjects(this.selectedYear);
      await this.setReport(this.projects);
      this.setCardValues();
    },
    async getProjects(year) {
      await axios.get(`/prj/year/${year}`)
      .then((response) => {
        this.projects = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
    },
    setCardValues() {
      this.statsCards[0].value = this.report.activeTaskCount + ' pcs';
      this.statsCards[1].value = this.report.ontimeRate + '%';
      this.statsCards[2].value = this.report.lateRate + '%';
      this.statsCards[3].value = this.report.ongoingProjectCount + ' pcs';
    },
    setReport(prjs){
      let taskCount = 0;
      let ontimeCount = 0;
      let lateCount = 0;
      let ongoingCount = 0;
      if (this.user.role === "ELECTRIC") {
        for (let i = 0; i < prjs.length; ++i) {
          if (prjs[i].gaElectDesigner !== null && this.user.id === prjs[i].gaElectDesigner.id) {
            taskCount += 1;
            if (prjs[i].gaElectActual === null) {
              ongoingCount += 1;
            } else {
              if (new Date(prjs[i].gaElectPlan) >= new Date(prjs[i].gaElectActual)) ontimeCount += 1;
              else lateCount += 1;
            }
          }
          if (prjs[i].bomElectDesigner !== null && this.user.id === prjs[i].bomElectDesigner.id) {
            taskCount += 1;
            if (prjs[i].bomElectActual === null) {
              ongoingCount += 1;
            } else {
              if (new Date(prjs[i].bomElectPlan) >= new Date(prjs[i].bomElectActual)) ontimeCount += 1;
              else lateCount += 1;
            }
          }
        }
      }

      if (this.user.role === "MECHANIC") {
        for (let i = 0; i < prjs.length; ++i) {
          if (prjs[i].gaMechDesigner !== null && this.user.id === prjs[i].gaMechDesigner.id) {
            taskCount += 1;
            if (prjs[i].gaMechActual === null) {
              ongoingCount += 1;
            } else {
              if (new Date(prjs[i].gaMechPlan) >= new Date(prjs[i].gaMechActual)) ontimeCount += 1;
              else lateCount += 1;
            }
          }
          if (prjs[i].bomMechDesigner !== null && this.user.id === prjs[i].bomMechDesigner.id) {
            taskCount += 1;
            if (prjs[i].bomMechActual === null) {
              ongoingCount += 1;
            } else {
              if (new Date(prjs[i].bomMechPlan) >= new Date(prjs[i].bomMechActual)) ontimeCount += 1;
              else lateCount += 1;
            }
          }
        }
      }

      this.report.activeTaskCount = taskCount - ongoingCount;
      this.report.ontimeRate = (taskCount - ongoingCount) >0 ? Math.round(100 * ontimeCount / (taskCount - ongoingCount)) : 0;
      this.report.lateRate = (taskCount - ongoingCount) >0 ? Math.round(100 * lateCount / (taskCount - ongoingCount)) : 0;
      this.report.ongoingProjectCount = ongoingCount;
    }
  }
};
</script>

<style>
.verticalLine {
  border-right: thick solid #137523;
}
</style>