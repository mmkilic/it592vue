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
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Table -->
      <b-table
        striped
        bordered
        head-variant="dark"
        small
        responsive="sm"
        show-empty
        sort-icon-left
        :items="projects"
        :fields="tableFields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        @filtered="onFiltered"
      >
        <template #head()="data">
          <span style="font-size:16px">{{ data.label }}</span>
        </template>
        <template v-slot:[`cell(projectNumber.number)`]="row">
          <a href="#" @click="actionLink(row.item, $event.target)">{{row.value}}</a>
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

      <!-- Info Modal -->
      <b-modal
        id="modal-prj-info"
        ref="modal"
        title="Project Info"
        size="xl"
        ok-only
        @ok="infoOk"
      >
        <b-row class="pb-2">
          <b-col cols="2"><label>Project Number:</label></b-col>
          <b-col cols="2"><span>{{prjInfo.number}}</span></b-col>
          <b-col cols="2"><label>Related Projects:</label></b-col>
          <b-col><span>{{prjInfo.relating}}</span></b-col>
        </b-row>
        <b-row class="pb-2">
          <b-col cols="2"><label>Power (ONAN/ONAF):</label></b-col>
          <b-col cols="2"><span>{{prjInfo.power}} kVA</span></b-col>
          <b-col cols="2"><label>Voltage (HV/LV):</label></b-col>
          <b-col cols="2"><span>{{prjInfo.voltage}} V</span></b-col>
          <b-col cols="2"><label>Customer:</label></b-col>
          <b-col><span>{{prjInfo.customer}}</span></b-col>
        </b-row>
        <b-row class="pb-2">
          <b-col cols="2"><label>Product Type:</label></b-col>
          <b-col cols="2"><span>{{prjInfo.productType}}</span></b-col>
          <b-col cols="2"><label>Inductrial Model:</label></b-col>
          <b-col cols="2"><span>{{prjInfo.industrialModel}}</span></b-col>
          <b-col cols="2"><label>Project Manager:</label></b-col>
          <b-col><span>{{prjInfo.projectManager}}</span></b-col>
        </b-row>
        <b-row class="pb-2">
          <b-col cols="2"><label>Creator:</label></b-col>
          <b-col cols="3"><div class="p-1 border bg-light text-center">{{prjInfo.creator}}</div></b-col>
          <b-col><div class="p-1 border bg-light text-center">{{prjInfo.createdDate}}</div></b-col>
        </b-row>
        <b-row class="pb-2">
          <b-col cols="2"><label>GA Electrical:</label></b-col>
          <b-col cols="3"><div class="p-1 border bg-light text-center">{{prjInfo.gaElectDesigner}}</div></b-col>
          <b-col cols="3"><div id="gaep" class="p-1 border bg-info text-light text-center">{{prjInfo.gaElectPlan}}</div></b-col>
          <b-tooltip target="gaep" title="Plan Date"></b-tooltip>
          <b-col><div id="gaea" class="p-1 border bg-success text-light text-center">{{prjInfo.gaElectActual}}</div></b-col>
          <b-tooltip target="gaea" title="Actual Date"></b-tooltip>
        </b-row>
        <b-row class="pb-2">
          <b-col cols="2"><label>GA Mechanical:</label></b-col>
          <b-col cols="3"><div class="p-1 border bg-light text-center">{{prjInfo.gaMechDesigner}}</div></b-col>
          <b-col cols="3"><div id="gamp" class="p-1 border bg-info text-light text-center">{{prjInfo.gaMechPlan}}</div></b-col>
          <b-tooltip target="gamp" title="Plan Date"></b-tooltip>
          <b-col><div id="gama" class="p-1 border bg-success text-light text-center">{{prjInfo.gaMechActual}}</div></b-col>
          <b-tooltip target="gama" title="Actual Date"></b-tooltip>
        </b-row>
        <b-row class="pb-2">
          <b-col cols="2"><label>BoM Electrical</label></b-col>
          <b-col cols="3"><div class="p-1 border bg-light text-center">{{prjInfo.bomElectDesigner}}</div></b-col>
          <b-col cols="3"><div id="bomep" class="p-1 border bg-info text-light text-center">{{prjInfo.bomElectPlan}}</div></b-col>
          <b-tooltip target="bomep" title="Plan Date"></b-tooltip>
          <b-col><div id="bomea" class="p-1 border bg-success text-light text-center">{{prjInfo.bomElectActual}}</div></b-col>
          <b-tooltip target="bomea" title="Actual Date"></b-tooltip>
        </b-row>
        <b-row class="pb-2">
          <b-col cols="2"><label>BoM Mechanical</label></b-col>
          <b-col cols="3"><div class="p-1 border bg-light text-center">{{prjInfo.bomMechDesigner}}</div></b-col>
          <b-col cols="3"><div id="bommp" class="p-1 border bg-info text-light text-center">{{prjInfo.bomMechPlan}}</div></b-col>
          <b-tooltip target="bommp" title="Plan Date"></b-tooltip>
          <b-col><div id="bomma" class="p-1 border bg-success text-light text-center">{{prjInfo.bomMechActual}}</div></b-col>
          <b-tooltip target="bomma" title="Actual Date"></b-tooltip>
        </b-row>
      </b-modal>
    </b-container>
  </div>
</template>

<script>

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
          key: "gaMechPlan",
          label: "GA-Deadline",
          sortable: true,
        },
        {
          key: "bomMechPlan",
          label: "BOM-Deadline",
          sortable: true,
        },
        {
          key: "status",
          label: "Status",
          sortable: false,
        },
        {
          key: "expiryGa",
          label: "Expiry-GA",
          sortable: false,
        },
        {
          key: "expiryBom",
          label: "Expiry-BOM",
          sortable: false,
        }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 50, 100],
      filter: null,
      filterOn: [],
      prjInfo: {
        number: "",
        relating: [],
        power: "",
        voltage: "",
        customer: "",
        productType: "",
        industrialModel: "",
        projectManager: "",
        creator: "",
        createdDate: "",
        gaElectPlan: "",
        gaElectActual: "",
        gaElectDesigner: "",
        gaMechPlan: "",
        gaMechActual: "",
        gaMechDesigner: "",
        bomElectPlan: "",
        bomElectActual: "",
        bomElectDesigner: "",
        bomMechPlan: "",
        bomMechActual: "",
        bomMechDesigner: ""
      }
    };
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.projects.length;
  },
  created(){
    let prjs = this.projects;
    for(let i=0; i<prjs.length; i++){
      if(prjs[i].bomMechActual === null) {
        prjs[i].status = 'ACTIVE';
        if(prjs[i].gaMechActual !== null) prjs[i].expiryGa = (new Date(prjs[i].gaMechPlan) - new Date(prjs[i].gaMechActual)) / (24 * 60 * 60 *1000);
      }
      else{
        if(new Date(prjs[i].gaMechPlan) >= new Date(prjs[i].gaMechActual)) prjs[i].status = 'ONTIME';
        else prjs[i].status = 'DELAY';
        prjs[i].expiryBom = (new Date(prjs[i].bomMechPlan) - new Date(prjs[i].bomMechActual)) / (24 * 60 * 60 *1000);
        if(prjs[i].gaMechActual !== null) prjs[i].expiryGa = (new Date(prjs[i].gaMechPlan) - new Date(prjs[i].gaMechActual)) / (24 * 60 * 60 *1000);
      }
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async actionLink(item, button){
      this.prjInfo.number = item.projectNumber.number;
      this.prjInfo.power = item.projectInfo.powerOnaf === 0 ? item.projectInfo.powerOnan : item.projectInfo.powerOnan +"-"+ item.projectInfo.powerOnaf;
      this.prjInfo.voltage = item.projectInfo.highVoltage +"-"+ item.projectInfo.lowVoltage;
      this.prjInfo.customer = item.projectInfo.customerName;
      this.prjInfo.productType = item.projectInfo.productType;
      this.prjInfo.industrialModel = item.projectInfo.industrialModel;
      this.prjInfo.projectManager = item.projectInfo.projectManger.fullName;
      this.prjInfo.creator = item.creator == null ? "-" : item.creator.fullName;
      this.prjInfo.createdDate = item.createdDate;
      this.prjInfo.gaElectPlan = item.gaElectPlan;
      this.prjInfo.gaElectActual = item.gaElectActual;
      this.prjInfo.gaElectDesigner = item.gaElectDesigner == null ? "-" : item.gaElectDesigner.fullName;
      this.prjInfo.gaMechPlan = item.gaMechPlan;
      this.prjInfo.gaMechActual = item.gaMechActual;
      this.prjInfo.gaMechDesigner = item.gaMechDesigner == null ? "-" : item.gaMechDesigner.fullName;
      this.prjInfo.bomElectPlan = item.bomElectPlan;
      this.prjInfo.bomElectActual = item.bomElectActual;
      this.prjInfo.bomElectDesigner = item.bomElectDesigner == null ? "-" : item.bomElectDesigner.fullName;
      this.prjInfo.bomMechPlan = item.bomMechPlan;
      this.prjInfo.bomMechActual = item.bomMechActual;
      this.prjInfo.bomMechDesigner = item.bomMechDesigner == null ? "-" : item.bomMechDesigner.fullName;
      this.prjInfo.relating = [];

      item.projectNumber.subProjects.forEach(element => {
        this.prjInfo.relating.push(element.number);
      });
      
      if(this.prjInfo.relating.length === 0)
        this.prjInfo.relating = "-";
      else
        this.prjInfo.relating = this.prjInfo.relating.toString();

      this.$root.$emit("bv::show::modal", "modal-prj-info", button);
    },
    infoOk(){

    }
  }
};
</script>

<style scope>
  b-form-input {
    background-color: #DBF9FC;
  }
</style>
