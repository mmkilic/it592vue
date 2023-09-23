<template>
  <div>
    <b-row>
      <b-col>
        <h4 class="m-1 pb-4">Annual Department Report</h4>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectedYear" :options="years" @change="updateByYear"></b-form-select>
      </b-col>
    </b-row>
    <!--Stats cards-->
    <div class="row">
      <div class="col-md-6 col-xl-3" v-for="stats in statsCards" :key="stats.type">
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
  data() {
    return {
      statsCards: [
        {
          type: "warning",
          icon: "ti-check-box",
          title: "Project",
          value: "",
          footerText: "Completed project count",
        },
        {
          type: "success",
          icon: "ti-stats-up",
          title: 'On-Time',
          value: "",
          footerText: "On-time rate for GA (ODT-MPT)",
        },
        {
          type: "danger",
          icon: "ti-stats-up",
          title: 'On-Time',
          value: "",
          footerText: "On-time rate BoM (ODT-MPT)",
        },
        {
          type: "info",
          icon: "ti-plug",
          title: "Continue",
          value: "",
          footerText: "Ongoing project count (ODT-MPT)",
        },
      ],
      projects: [],
      years: ["2020", "2021", "2022"],
      selectedYear: "2021",
      report: {
        projectCount: 0,
        ontimeRateOdtGa: 0,
        ontimeRateOdtBom: 0,
        ontimeRateMptGa: 0,
        ontimeRateMptBom: 0,
        ongoingOdtCount: 0,
        ongoingMptCount: 0
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
      this.statsCards[0].value = this.report.projectCount + ' pcs';
      this.statsCards[1].value = this.report.ontimeRateOdtGa + '-' + this.report.ontimeRateMptGa + ' %';
      this.statsCards[2].value = this.report.ontimeRateOdtBom + '-' + this.report.ontimeRateMptBom + ' %';
      this.statsCards[3].value = this.report.ongoingOdtCount + '-' + this.report.ongoingMptCount + ' pcs';
    },
    setReport(prjs){
      let totalProjectCount = 0;
      let ontimeOdtGaCount = 0;
      let ontimeOdtBomCount = 0;
      let ongoingOdtCount = 0;
      let ontimeMptGaCount = 0;
      let ontimeMptBomCount = 0;
      let ongoingMptCount = 0;
      
      for (let i = 0; i < prjs.length; ++i) {
        totalProjectCount += 1;
        if (prjs[i].projectInfo.productType === 'ODT') {
          if (prjs[i].bomMechActual === null) {
            ongoingOdtCount += 1;
          } else {
            if (new Date(prjs[i].gaMechPlan) >= new Date(prjs[i].gaMechActual)) ontimeOdtGaCount += 1;
            if (new Date(prjs[i].bomMechPlan) >= new Date(prjs[i].bomMechActual)) ontimeOdtBomCount += 1;
          }
        }
        if (prjs[i].projectInfo.productType === 'MPT') {
          if (prjs[i].bomMechActual === null) {
            ongoingMptCount += 1;
          } else {
            if (new Date(prjs[i].gaMechPlan) >= new Date(prjs[i].gaMechActual)) ontimeMptGaCount += 1;
            if (new Date(prjs[i].bomMechPlan) >= new Date(prjs[i].bomMechActual)) ontimeMptBomCount += 1;
          }
        }
      }

      this.report.projectCount = totalProjectCount - ongoingOdtCount - ongoingMptCount;
      this.report.ontimeRateOdtGa = this.report.projectCount>0 ? Math.round(100 * ontimeOdtGaCount / this.report.projectCount) : 0;
      this.report.ontimeRateOdtBom = this.report.projectCount>0 ? Math.round(100 * ontimeOdtBomCount / this.report.projectCount) : 0;
      this.report.ontimeRateMptGa = this.report.projectCount>0 ? Math.round(100 * ontimeMptGaCount / this.report.projectCount) : 0;
      this.report.ontimeRateMptBom = this.report.projectCount>0 ? Math.round(100 * ontimeMptBomCount / this.report.projectCount) : 0;
      this.report.ongoingOdtCount = ongoingOdtCount;
      this.report.ongoingMptCount = ongoingMptCount;
    }
  }
};
</script>

<style>
.verticalLine {
  border-right: thick solid #137523;
}
</style>