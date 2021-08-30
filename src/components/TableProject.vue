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
          <b-button
            size="sm"
            @click="info(row.item, row.index, $event.target)"
            class="mr-1"
            >Edit</b-button
          >
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
          <b-form-group
            label="Project Number"
            label-cols="4"
            label-for="number-input"
            invalid-feedback="Incorrect project number"
            :state="prjState"
          >
            <b-form-input
              id="number-input"
              type="number"
              v-model="project.projectNumber.number"
              :state="prjState"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Power (ONAN/ONAF)"
            label-cols="4"
            label-for="power-input"
          >
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
          <b-form-group
            label="Voltage (HV/LV)"
            label-cols="4"
            label-for="voltage-input"
          >
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
          <b-form-group
            label="Customer Name"
            label-cols="4"
            label-for="customerName"
          >
            <b-form-input
              id="customerName"
              v-model="project.projectInfo.customerName"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Product Type"
            label-cols="4"
            label-for="productType"
          >
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
          <b-form-group label="Manager" label-cols="4" label-for="manager">
            <b-form-select 
              id="manager"
              size="sm"
              v-model="project.projectInfo.projectManger.id" 
              :options="projectManagers" 
              value-field="id" 
              text-field="fullName">
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
                  v-model="project.gaElectDesigner.id" 
                  :options="electricalDesigners" 
                  value-field="id" 
                  text-field="fullName"></b-form-select>
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
                  v-model="project.gaMechDesigner.id" 
                  :options="mechanicalDesigners" 
                  value-field="id" 
                  text-field="fullName"></b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="GA Deadline" label-cols="4" label-for="gaDeadlinePlan">
            <b-form-input type="date" id="gaDeadlinePlan" v-model="project.gaDeadlinePlan"></b-form-input>
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
                  v-model="project.bomElectDesigner.id" 
                  :options="electricalDesigners" 
                  value-field="id" 
                  text-field="fullName"></b-form-select>
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
                  v-model="project.bomMechDesigner.id" 
                  :options="mechanicalDesigners" 
                  value-field="id" 
                  text-field="fullName"></b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="BOM Deadline" label-cols="4" label-for="bomDeadlinePlan">
            <b-form-input type="date" id="bomDeadlinePlan" v-model="project.bomDeadlinePlan"></b-form-input>
          </b-form-group>
          <b-form-group label="Invoice Date" label-cols="4" label-for="invoiceDate">
            <b-form-input type="date" id="invoiceDate" v-model="project.invoiceDate"></b-form-input>
          </b-form-group>
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
          label: "Project Owner",
          sortable: true,
        },
        {
          key: "projectInfo.createDate",
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
      perPage: 2,
      pageOptions: [2, 5, 10, 100],
      filter: null,
      filterOn: [],

      project: {
        id: 0,
        projectNumber: {
          id: 0,
          number: 0,
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
        gaElectDesigner: { id: 0 },
        gaMechPlan: "",
        gaElectActual: "",
        gaMechDesigner: { id: 0 },
        gaDeadlinePlan: "",
        gaDeadlineActual: "",
        bomElectPlan: "",
        bomElectActual: "",
        bomElectDesigner: { id: 0 },
        bomMechPlan: "",
        bomMechActual: "",
        bomMechDesigner: { id: 0 },
        bomDeadlinePlan: "",
        bomDeadlineActual: "",
        invoiceDate: "",
        status: "NONE",
        createdDate: "",
        creator: { id: 0 },
      },
      prjState: null,
      projectManagers: [],
      electricalDesigners: [],
      mechanicalDesigners: [],
      productTypes: ["ODT", "MPT"],
      industrialModels: ["MTO", "LowETO", "HighETO"],
    };
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.projects.length;
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    checkFormValidity() {
      this.prjState = this.project.projectNumber.number > 100000 && this.project.projectNumber.number <= 999999;
      return this.prjState;
    },
    async projectShow() {
      this.prjState = null;
      this.project = {
        id: 0,
        projectNumber: {
          id: 0,
          number: 0,
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
        gaElectDesigner: { id: 0 },
        gaMechPlan: "",
        gaElectActual: "",
        gaMechDesigner: { id: 0 },
        gaDeadlinePlan: "",
        gaDeadlineActual: "",
        bomElectPlan: "",
        bomElectActual: "",
        bomElectDesigner: { id: 0 },
        bomMechPlan: "",
        bomMechActual: "",
        bomMechDesigner: { id: 0 },
        bomDeadlinePlan: "",
        bomDeadlineActual: "",
        invoiceDate: "",
        status: "NONE",
        createdDate: "",
        creator: { id: 1 },
      };

      // user List
      await axios
        .get("http://localhost:8081/api/user/manager")
        .then((response) => {
          this.projectManagers = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
      await axios
        .get("http://localhost:8081/api/user/electric")
        .then((response) => {
          this.electricalDesigners = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
      await axios
        .get("http://localhost:8081/api/user/mechanic")
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
      // Backend connection
      let success = false;
      /*
      let error = "";
      await axios.put("http://localhost:8081/api/nbr", this.project.projectNumber)
      .then(response => {
        success = response.data;
      })
      .catch(e =>{
        success = false;
        error = "Recording error for project number";
        console.log(e);
      });
      await axios.put("http://localhost:8081/api/info", this.project.projectInfo)
      .then(response => {
        success = response.data;
      })
      .catch(e =>{
        success = false;
        error = "Recording error for project info";
        console.log(e);
      });
      
      await axios.post("http://localhost:8081/api/prj", this.project)
      .then(response => {
        success = response.data;
      })
      .catch(e =>{
        success = false;
        error = "Recording error for project info";
        console.log(e);
      });
      if(success){
        this.handleSubmit();
      }
      else{
        alert("Recording error for the project!");
      }
      */
      // Backend connection
      console.log(this.project);
    },
    handleSubmit() {
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-user-add");
      });
    },
  },
};
</script>

<style></style>
