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
              <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Type to Search"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
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
          <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">Edit</b-button>
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
            <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"></b-form-select>
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
        title="Add New User"
        size="xl"
        @show="projectShow"
        @ok="projectOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="Project Number"
            label-for="number-input"
            invalid-feedback="Project Number is required"
            :state="prjState"
          >
            <b-form-input
              id="number-input"
              v-model="project.projectNumber.number"
              :state="prjState"
              required
            ></b-form-input>
          </b-form-group>
          <div class="row"> 
            <div class="col-6">
              <b-form-group label="Power (ONAN/ONAF)" label-for="power-input"></b-form-group>
            </div>
            <div class="col-3">
              <b-form-input type= "number" id="power-input" v-model="project.projectInfo.powerOnan"></b-form-input>
            </div>
            <div class="col-3">
              <b-form-input type= "number" id="power-input" v-model="project.projectInfo.powerOnaf"></b-form-input>
            </div>
          </div>
          <div class="row"> 
            <div class="col-6">
              <b-form-group label="Voltage (HV/LV)" label-for="voltage-input"></b-form-group>
            </div>
            <div class="col-3">
              <b-form-input type= "number" id="voltage-input" v-model="project.projectInfo.highVoltage"></b-form-input>
            </div>
            <div class="col-3">
              <b-form-input type= "number" id="voltage-input" v-model="project.projectInfo.lowVoltage"></b-form-input>
            </div>
          </div>
          <b-form-group label="Project Name" label-for="pn-input">
            <b-form-input id="pn-input" v-model="project.projectInfo.projectName"></b-form-input>
          </b-form-group>


        </form>
      </b-modal>

    </b-container>
  </div>
</template>

<script>
import ManagementModalEdit from './ManagementModalEdit.vue';
export default {
  components: { ManagementModalEdit },
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
          powerOnaf: 0,
          lowVoltage: 0,
          highVoltage: 0,
          projectManger: {id: 0},
          projectName: "",
          customerName: "",
          endUserCountry: "",
          productType: "",
          industrialModel: "",
          createDate: "",
          drwaingReleaseDate: "",
          invoiceDate: ""
        },
        gaElectPlan: "",
        gaElectActual: "",
        gaElectDesigner: {id: 0},
        gaMechPlan: "",
        gaElectActual: "",
        gaMechDesigner: {id: 0},
        gaDeadlinePlan: "",
        gaDeadlineActual: "",
        approvalPlan: "",
        approvalActual: "",
        bomElectPlan: "",
        bomElectActual: "",
        bomElectDesigner: {id: 0},
        bomMechPlan: "",
        bomMechActual: "",
        bomMechDesigner: {id: 0},
        bomDeadlinePlan: "",
        bomDeadlineActual: "",
        status: "",
        createdDate: "",
        creator: {id: 0},
      },
      prjState: null
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
      const valid = this.$refs.form.checkValidity();
      this.userState = valid;
      return valid;
    },
    async projectShow() {
      this.prjState = null;
      //this.project
      // Manager List
    },
    async projectOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
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
