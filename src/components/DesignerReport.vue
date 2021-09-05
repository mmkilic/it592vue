<template>
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
</template>

<script>
import {StatsCard} from "@/components/index";

export default {

  components: { StatsCard},

  data() {
    return {
      statsCards: [
        {
          type: "warning",
          icon: "ti-check-box",
          title: "Task",
          value: "105GB",
          footerText: "Completed task count"
        },
        {
          type: "success",
          icon: "ti-thumb-up",
          title: "On-Time",
          value: "$1,345",
          footerText: "On-time project rate"
        },
        {
          type: "danger",
          icon: "ti-thumb-down",
          title: "Late",
          value: "23",
          footerText: "Late project rate"
        },
        {
          type: "info",
          icon: "ti-plug",
          title: "Continue",
          value: "+45",
          footerText: "Ongoing project count"
        }
      ],
    }
  },
};
</script>

<style>
.verticalLine {
  border-right: thick solid #137523;
}
</style>