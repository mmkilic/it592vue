<template>
  <div>
    <b-container fluid>
      <!-- Top Fillter Area -->
      <b-row>
        <b-col lg="10" class="my-1">
          <b-form-group
            label="Filter"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''"
                  >Clear</b-button
                >
                <b-button v-b-modal.modal-prj-add>Add</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Table -->
      <b-table
        striped
        bordered
        head-variant = "dark"
        hover
        small
        :items="projects"
        :fields="tableFields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        stacked="md"
        responsive="sm"
        show-empty
        @filtered="onFiltered"
      >
        <template #cell(action)="row">
          <b-icon icon="plus-circle" scale="1.5" class="mx-1" @click="actionLink(row.item, $event.target)"></b-icon>
          <b-icon icon="gear" scale="1.5" class="mx-2" @click="actionEdit(row.item, $event.target)"></b-icon>
          <b-icon icon="trash" scale="1.5" class="mx-1" @click="actionDelete(row.item)"></b-icon>
        </template>
      </b-table>

      <!-- Bottom Page Area -->
      <b-row>
        <b-col sm="5" md="6" class="my-1">
          <b-form-group
            label="Per page"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col sm="7" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>

      <!-- Add Modal -->
      <b-modal
        id="modal-prj-add"
        ref="modal"
        title="Add New Project"
        size="lg"
        @show="projectShow"
        @ok="projectOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group label="Project Number"
            label-cols="4"
            label-for="number-input"
            invalid-feedback="Incorrect project number"
            :state="prjNumberState"
          >
            <b-form-input
              id="number-input"
              type="number"
              v-model="project.projectNumber.number"
              :state="prjNumberState"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Power (ONAN/ONAF)" label-cols="4" label-for="power-input">
            <b-row>
              <b-col>
                <b-form-input
                  type="number"
                  id="power-input"
                  v-model="project.projectInfo.powerOnan"
                ></b-form-input>
              </b-col>
              <b-col>
                <b-form-input
                  type="number"
                  id="power-input"
                  v-model="project.projectInfo.powerOnaf"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="Voltage (HV/LV)" label-cols="4" label-for="voltage-input">
            <b-row>
              <b-col>
                <b-form-input
                  type="number"
                  id="voltage-input"
                  v-model="project.projectInfo.highVoltage"
                ></b-form-input>
              </b-col>
              <b-col>
                <b-form-input
                  type="number"
                  id="voltage-input"
                  v-model="project.projectInfo.lowVoltage"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="Customer Name" label-cols="4" label-for="customerName">
            <b-form-input
              id="customerName"
              v-model="project.projectInfo.customerName"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Product Type" label-cols="4" label-for="productType">
            <b-form-select
              id="productType"
              size="sm"
              v-model="project.projectInfo.productType"
              :options="productTypes"
            ></b-form-select>
          </b-form-group>
          <b-form-group label="Industrial Model" label-cols="4" label-for="industrialModel">
            <b-form-select
              id="industrialModel"
              size="sm"
              v-model="project.projectInfo.industrialModel"
              :options="industrialModels"
            ></b-form-select>
          </b-form-group>
          <b-form-group label="Project Manager" label-cols="4" label-for="manager"
            invalid-feedback="Project manager is a required field"
            :state="prjManagerState"
          >
            <b-form-select 
              id="manager"
              size="sm"
              v-model="project.projectInfo.projectManger.id" 
              :options="projectManagers" 
              value-field="id" 
              text-field="fullName"
              :state="prjManagerState"
              required>
            </b-form-select>
          </b-form-group>
          <b-form-group label="GA Electrical Plan" label-cols="4" label-for="gaElectPlan">
            <b-row>
              <b-col>
                <b-form-input type="date" id="gaElectPlan" v-model="project.gaElectPlan"></b-form-input>
              </b-col>
              <b-col>
                <b-form-select 
                  id="gaElectPlan" 
                  size="sm"
                  v-model="gaElectDesignerId" 
                  :options="electricalDesigners" 
                  value-field="id" 
                  text-field="fullName">
                    <b-form-select-option value=0>NONE</b-form-select-option>
                  </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="GA Mechanical Plan" label-cols="4" label-for="gaMechPlan">
            <b-row>
              <b-col>
                <b-form-input type="date" id="gaMechPlan" v-model="project.gaMechPlan"></b-form-input>
              </b-col>
              <b-col>
                <b-form-select 
                  id="gaMechPlan"
                  size="sm"
                  v-model="gaMechDesignerId" 
                  :options="mechanicalDesigners" 
                  value-field="id" 
                  text-field="fullName">
                    <b-form-select-option value=0>NONE</b-form-select-option>
                  </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="BOM Electrical Plan" label-cols="4" label-for="gaElectPlan">
            <b-row>
              <b-col>
                <b-form-input type="date" id="bomElectPlan" v-model="project.bomElectPlan"></b-form-input>
              </b-col>
              <b-col>
                <b-form-select 
                  id="bomElectPlan" 
                  size="sm"
                  v-model="bomElectDesignerId" 
                  :options="electricalDesigners" 
                  value-field="id" 
                  text-field="fullName">
                    <b-form-select-option value=0>NONE</b-form-select-option>
                  </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="BOM Mechanical Plan" label-cols="4" label-for="bomMechPlan">
            <b-row>
              <b-col>
                <b-form-input type="date" id="bomMechPlan" v-model="project.bomMechPlan"></b-form-input>
              </b-col>
              <b-col>
                <b-form-select 
                  id="bomMechPlan" 
                  size="sm"
                  v-model="bomMechDesignerId" 
                  :options="mechanicalDesigners" 
                  value-field="id" 
                  text-field="fullName">
                    <b-form-select-option value=0>NONE</b-form-select-option>
                  </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
        </form>
      </b-modal>

      <!-- Edit Modal -->
      <b-modal
        id="modal-prj-edit"
        ref="modal"
        title="Add New Project"
        size="lg"
        @ok="actionEditOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group label="Project Number"
            label-cols="4"
            label-for="number-input"
          >
            <b-form-input
              id="number-input"
              type="number"
              v-model="project.projectNumber.number"
              disabled
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Power (ONAN/ONAF)" label-cols="4" label-for="power-input">
            <b-row>
              <b-col>
                <b-form-input
                  type="number"
                  id="power-input"
                  v-model="project.projectInfo.powerOnan"
                ></b-form-input>
              </b-col>
              <b-col>
                <b-form-input
                  type="number"
                  id="power-input"
                  v-model="project.projectInfo.powerOnaf"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="Voltage (HV/LV)" label-cols="4" label-for="voltage-input">
            <b-row>
              <b-col>
                <b-form-input
                  type="number"
                  id="voltage-input"
                  v-model="project.projectInfo.highVoltage"
                ></b-form-input>
              </b-col>
              <b-col>
                <b-form-input
                  type="number"
                  id="voltage-input"
                  v-model="project.projectInfo.lowVoltage"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="Customer Name" label-cols="4" label-for="customerName">
            <b-form-input
              id="customerName"
              v-model="project.projectInfo.customerName"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Product Type" label-cols="4" label-for="productType">
            <b-form-select
              id="productType"
              size="sm"
              v-model="project.projectInfo.productType"
              :options="productTypes"
            ></b-form-select>
          </b-form-group>
          <b-form-group label="Industrial Model" label-cols="4" label-for="industrialModel">
            <b-form-select
              id="industrialModel"
              size="sm"
              v-model="project.projectInfo.industrialModel"
              :options="industrialModels"
            ></b-form-select>
          </b-form-group>
          <b-form-group label="Project Manager" label-cols="4" label-for="manager"
            invalid-feedback="Project manager is a required field"
            :state="prjManagerState"
          >
            <b-form-select 
              id="manager"
              size="sm"
              v-model="project.projectInfo.projectManger.id" 
              :options="projectManagers" 
              value-field="id" 
              text-field="fullName"
              :state="prjManagerState"
              required>
            </b-form-select>
          </b-form-group>
          <b-form-group label="GA Electrical Plan" label-cols="4" label-for="gaElectPlan">
            <b-row>
              <b-col>
                <b-form-input type="date" id="gaElectPlan" v-model="project.gaElectPlan"></b-form-input>
              </b-col>
              <b-col>
                <b-form-select 
                  id="gaElectPlan" 
                  size="sm"
                  v-model="gaElectDesignerId" 
                  :options="electricalDesigners" 
                  value-field="id" 
                  text-field="fullName">
                    <b-form-select-option value=0>NONE</b-form-select-option>
                  </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="GA Mechanical Plan" label-cols="4" label-for="gaMechPlan">
            <b-row>
              <b-col>
                <b-form-input type="date" id="gaMechPlan" v-model="project.gaMechPlan"></b-form-input>
              </b-col>
              <b-col>
                <b-form-select 
                  id="gaMechPlan"
                  size="sm"
                  v-model="gaMechDesignerId" 
                  :options="mechanicalDesigners" 
                  value-field="id" 
                  text-field="fullName">
                    <b-form-select-option value=0>NONE</b-form-select-option>
                  </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="BOM Electrical Plan" label-cols="4" label-for="gaElectPlan">
            <b-row>
              <b-col>
                <b-form-input type="date" id="bomElectPlan" v-model="project.bomElectPlan"></b-form-input>
              </b-col>
              <b-col>
                <b-form-select 
                  id="bomElectPlan" 
                  size="sm"
                  v-model="bomElectDesignerId" 
                  :options="electricalDesigners" 
                  value-field="id" 
                  text-field="fullName">
                    <b-form-select-option value=0>NONE</b-form-select-option>
                  </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="BOM Mechanical Plan" label-cols="4" label-for="bomMechPlan">
            <b-row>
              <b-col>
                <b-form-input type="date" id="bomMechPlan" v-model="project.bomMechPlan"></b-form-input>
              </b-col>
              <b-col>
                <b-form-select 
                  id="bomMechPlan" 
                  size="sm"
                  v-model="bomMechDesignerId" 
                  :options="mechanicalDesigners" 
                  value-field="id" 
                  text-field="fullName">
                    <b-form-select-option value=0>NONE</b-form-select-option>
                  </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
        </form>
      </b-modal>

      <!-- Link Modal -->
      <b-modal
        id="modal-prj-link"
        ref="modal"
        title="Add New Project"
        size="sm"
        @ok="actionLinkOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            id="add-button-group"
            label="Add new linked project"
            label-cols-lg="8"
            content-cols-lg="4"
            label-for="add-button">
            <b-button id="add-button" variant="success" @click="actionLinkAdd">Add</b-button>
          </b-form-group>
          
          <b-input-group size="md" :prepend="mainProject.number+''" v-for="(i,index) in linkedProjectCount" v-bind:key=i>
            <b-form-input type="number" v-model="linkedProjects[index].number"></b-form-input>
          </b-input-group>
        </form>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["projects"],
  data() {
    return {
      tableFields: [
        {
          key: "id",
          sortable: true,
        },
        {
          key: "projectNumber.number",
          label: "Number",
          sortable: true,
        },
        {
          key: "projectInfo.productType",
          label: "Type",
          sortable: false,
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
          key: "projectInfo.lowVoltage",
          label: "HV",
          sortable: false,
        },
        {
          key: "projectInfo.highVoltage",
          label: "LV",
          sortable: false,
        },
        {
          key: "projectInfo.projectManger.fullName",
          label: "Project Manager",
          sortable: true,
        },
        {
          key: "createdDate",
          label: "Create Date",
          sortable: true,
        },
        {
          key: "Action",
          label: "Action",
          sortable: false,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 3,
      pageOptions: [3, 5, 10, 100],
      filter: null,
      filterOn: [],

      project: {
        id: 0,
        projectNumber: {
          id: 0,
          number: null,
        },
        projectInfo: {
          id: 0,
          powerOnan: 0,
          powerOnaf: null,
          lowVoltage: 0,
          highVoltage: 0,
          projectManger: { id: 0 },
          customerName: "",
          productType: "",
          industrialModel: ""
        },
        gaElectPlan: "",
        gaElectActual: "",
        gaMechPlan: "",
        gaElectActual: "",
        bomElectPlan: "",
        bomElectActual: "",
        bomMechPlan: "",
        bomMechActual: "",
        createdDate: "",
        creator: {id: 0}
      },
      projectEmpty: {
        id: 0,
        projectNumber: {
          id: 0,
          number: null,
        },
        projectInfo: {
          id: 0,
          powerOnan: 0,
          powerOnaf: null,
          lowVoltage: 0,
          highVoltage: 0,
          projectManger: { id: 0 },
          customerName: "",
          productType: "",
          industrialModel: ""
        },
        gaElectPlan: "",
        gaElectActual: "",
        gaMechPlan: "",
        gaElectActual: "",
        bomElectPlan: "",
        bomElectActual: "",
        bomMechPlan: "",
        bomMechActual: "",
        createdDate: "",
        creator: {id: 0}
      },
      gaElectDesignerId: 0,
      gaMechDesignerId: 0,
      bomElectDesignerId: 0,
      bomMechDesignerId: 0,
      prjNumberState: null,
      prjManagerState: null,
      projectManagers: [],
      electricalDesigners: [],
      mechanicalDesigners: [],
      productTypes: ["ODT", "MPT"],
      industrialModels: ["MTO", "LowETO", "HighETO"],

      mainProject: {id: 0, number: null},
      linkedProjectCount: 1,
      linkedProjects: [{id: 0, name: 0}]
    };
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.projects.length;
  },
  created(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.projectEmpty.creator.id = user.id;
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    checkFormValidity() {
      this.prjNumberState = this.project.projectNumber.number > 100000 && this.project.projectNumber.number <= 999999;
      this.prjManagerState = this.project.projectInfo.projectManger.id !== 0;
      return this.prjNumberState && this.prjManagerState;
    },
    async projectShow() {
      this.prjState = null;
      this.project = JSON.parse(JSON.stringify(this.projectEmpty));
      this.gaElectDesignerId= 0;
      this.gaMechDesignerId= 0;
      this.bomElectDesignerId= 0;
      this.bomMechDesignerId= 0;
      // user List
      await axios.get("/user/pm")
      .then((response) => {
        this.projectManagers = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
      await axios.get("/user/electric")
      .then((response) => {
        this.electricalDesigners = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
      await axios.get("/user/mechanic")
      .then((response) => {
        this.mechanicalDesigners = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
    },
    async projectOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      //let prj = Object.assign({}, this.project)
      const date = new Date();
      const month = date.getMonth()+1 >= 10 ? "" + (date.getMonth()+1) : "0" + (date.getMonth()+1);
      const day = date.getDate() >= 10 ? "" + date.getDate() : "0" + date.getDate();
      const nowDate = `${date.getFullYear()}-${month}-${day}`;
      this.project.createdDate = nowDate;

      if(this.gaElectDesignerId !== 0) this.project.gaElectDesigner = {id:this.gaElectDesignerId};
      if(this.gaMechDesignerId !== 0) this.project.gaMechDesigner = {id:this.gaMechDesignerId};
      if(this.bomElectDesignerId !== 0) this.project.bomElectDesigner = {id:this.bomElectDesignerId};
      if(this.bomMechDesignerId !== 0) this.project.bomMechDesigner = {id:this.bomMechDesignerId};

      console.log(this.project);

      // Backend connection
      let success = false;
      await axios.post("/prj", this.project)
      .then(response => {
        success = response.data;
      })
      .catch(e =>{
        success = false;
        console.log(e);
      });
      if(success){
        this.handleSubmit("modal-prj-add");
      }
      else{
        alert("An error occurred while recording!");
      }
    },
    handleSubmit(modalName) {
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide(modalName);
      });
      this.$router.go('/');
    },
    actionLink(item, button){
      this.mainProject = item.projectNumber;
      this.linkedProjectCount= 1;
      this.linkedProjects= [{id: 0, number:(this.mainProject.number+1), mainProject:this.mainProject}];

      this.$root.$emit("bv::show::modal", "modal-prj-link", button);
    },
    actionLinkAdd(){
      this.linkedProjects.push({id:0, number:(this.mainProject.number+this.linkedProjectCount+1), mainProject:this.mainProject});
      this.linkedProjectCount++
    },
    async actionLinkOk(bvModalEvt) {
      bvModalEvt.preventDefault();

      // Backend connection
      let success = false;

      await axios.post("/nbrs", this.linkedProjects)
        .then(response => {
        success = response.data;
      })
        .catch(e =>{
          success = false;
        console.log(e);
      });
 
     /*
      let linkedPrjs = this.linkedProjects;
      for(let i = 0; i<linkedPrjs.length; i++){
        await axios.post("http://localhost:8081/api/nbr", linkedPrjs[i])
        .then(response => {
          success = response.data;
        })
        .catch(e =>{
          success = false;
          console.log(e);
        });
      }
      */
      if(success){
        this.handleSubmit("modal-prj-link");
      }
      else{
        alert("An error occurred while recording!");
      }
    },
    actionEdit(item, button) {
      this.projectShow();
      this.project = item;

      if(item.gaElectDesigner !== null) this.gaElectDesignerId = item.gaElectDesigner.id;
      if(item.gaMechDesigner !== null) this.gaMechDesignerId = item.gaMechDesigner.id;
      if(item.bomElectDesigner !== null) this.bomElectDesignerId = item.bomElectDesigner.id;
      if(item.bomMechDesigner !== null) this.bomMechDesignerId = item.bomMechDesigner.id;

      this.$root.$emit("bv::show::modal", "modal-prj-edit", button);
    },
    async actionEditOk(bvModalEvt) {
      bvModalEvt.preventDefault();

      if(this.gaElectDesignerId !== 0) this.project.gaElectDesigner = {id:this.gaElectDesignerId};
      if(this.gaMechDesignerId !== 0) this.project.gaMechDesigner = {id:this.gaMechDesignerId};
      if(this.bomElectDesignerId !== 0) this.project.bomElectDesigner = {id:this.bomElectDesignerId};
      if(this.bomMechDesignerId !== 0) this.project.bomMechDesigner = {id:this.bomMechDesignerId};

      // Backend connection
      let success = false;
      await axios.put("/prj", this.project)
      .then(response => {
        success = response.data;
      })
      .catch(e =>{
        success = false;
        console.log(e);
      });
      if(success){
        this.handleSubmit("modal-prj-edit");
      }
      else{
        alert("An error occurred while recording!");
      }
    },
    async actionDelete(item){
      console.log(item.id);
      await axios.delete(`/prj/${item.id}`)
      .then(response => {
        if(response.data){
          alert("User was deleted.");
        }
        else{
          alert("User was not deleted!");
        }
      })
      .catch(e =>{
        console.log(e);
        alert("User was not deleted!");
      });
      this.$router.go('/');
    }
  }
};
</script>

<style></style>
