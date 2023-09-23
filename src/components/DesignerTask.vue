<template>
  <div>
    <b-row class="p-3">
      <b-col class="verticalLine p-3">
        <h4 class="text-center">General Arrangement Taskes</h4>
        <b-table striped hover :items="gaProjects" :fields="fields">
          <template #cell(action)="row">
            <b-button @click="actionGaComplete(row.item)">Complete</b-button>
          </template>
        </b-table>
      </b-col>
      <b-col class="p-3">
        <h4 class="text-center">Bill of Materials Taskes</h4>
        <b-table striped hover :items="bomProjects" :fields="fields">
          <template #cell(action)="row">
            <b-button @click="actionBomComplete(row.item)">Complete</b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ['user','projects'],
  data() {
    return {
      fields: [
        {
          key: "projectNumber.number",
          label: "Number",
          sortable: true,
        },
        {
          key: "projectInfo.customerName",
          label: "Customer",
          sortable: true,
        },
        {
          key: "projectInfo.powerOnan",
          label: "ONAN",
          sortable: true,
        },
        {
          key: "projectInfo.powerOnaf",
          label: "ONAF",
          sortable: true,
        },
        {
          key: "Action",
          label: "Action",
          sortable: false,
        },
      ],
      gaProjects: [],
      bomProjects: [],
    };
  },
  created(){

    if(this.user.role === 'ELECTRIC'){
      
      for(let i = 0; i<this.projects.length; i++){
        if(this.projects[i].gaElectDesigner !== null && this.projects[i].gaElectDesigner.id === this.user.id){
          if(this.projects[i].gaElectActual === null) this.gaProjects.push(this.projects[i]);
        }
        
        if(this.projects[i].bomElectDesigner !== null && this.projects[i].bomElectDesigner.id === this.user.id ){
          if(this.projects[i].bomElectActual === null) this.bomProjects.push(this.projects[i]);
        }
      }
    }

    if(this.user.role === 'MECHANIC'){
      for(let i = 0; i<this.projects.length; i++){
        if(this.projects[i].gaMechDesigner !== null && this.projects[i].gaMechDesigner.id === this.user.id ){
          if(this.projects[i].gaMechActual === null) this.gaProjects.push(this.projects[i]);
        }
        if(this.projects[i].bomMechDesigner !== null && this.projects[i].bomMechDesigner.id === this.user.id ){
          if(this.projects[i].bomMechActual === null) this.bomProjects.push(this.projects[i]);
        }
      }
    }
  },
  methods:{
    nowDate(){
      const date = new Date();
      const month = date.getMonth()+1 >= 10 ? "" + (date.getMonth()+1) : "0" + (date.getMonth()+1);
      const day = date.getDate() >= 10 ? "" + date.getDate() : "0" + date.getDate();
      return `${date.getFullYear()}-${month}-${day}`;
    },
    async updateProject(item){
      // Backend connection
      let success = false;
      await axios.put("/prj", item)
      .then(response => {
        success = response.data;
      })
      .catch(e =>{
        success = false;
        console.log(e);
      });
      if(success){
        this.$router.go('/');
      }
      else{
        alert("An error occurred while updating project!");
      }
    },
    actionGaComplete(item){
      if(this.user.role === 'ELECTRIC') item.gaElectActual = this.nowDate();
      if(this.user.role === 'MECHANIC') item.gaMechActual = this.nowDate();

      this.updateProject(item);
    },
    actionBomComplete(item){
      if(this.user.role === 'ELECTRIC') item.bomElectActual = this.nowDate();
      if(this.user.role === 'MECHANIC') item.bomMechActual = this.nowDate();

      this.updateProject(item);
    }
  }
};
</script>

<style>
.verticalLine {
  border-right: thick solid #137523;
}
</style>