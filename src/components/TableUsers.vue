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
                <b-button v-b-modal.modal-user-add>Add</b-button>
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
        :items="users"
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
        id="modal-user-add"
        ref="modal"
        title="Add New User"
        @show="getManagers"
        @ok="handleOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="SESA"
            label-for="sesa-input"
            invalid-feedback="SESA is required"
            :state="userState"
          >
            <b-form-input
              id="sesa-input"
              v-model="user.sesa"
              :state="userState"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Name" label-for="name-input">
            <b-form-input id="name-input" v-model="user.firstName"></b-form-input>
          </b-form-group>
          <b-form-group label="Surname" label-for="surname-input">
            <b-form-input id="surname-input" v-model="user.lastName"></b-form-input>
          </b-form-group>
          <b-form-group label="E-mail" label-for="email-input" invalid-feedback="E-mail is invalid">
            <b-form-input type= "email" id="email-input" :state="userState" v-model="user.email"></b-form-input>
          </b-form-group>
          <b-form-group label="Password" label-for="password-input">
            <b-form-input type= "password" id="password-input" v-model="user.password"></b-form-input>
          </b-form-group>
          <b-form-group label="Department" label-for="department">
            <select id="department" class="form-select" v-model="user.department">
              <option
              v-for="department in departments"
              :key="department"
              >{{department}}</option>
            </select>
          </b-form-group>
          <b-form-group label="Role" label-for="role">
            <select id="role" class="form-select" v-model="user.role">
              <option
              v-for="role in roles"
              :key="role"
              >{{role}}</option>
            </select>
          </b-form-group>
          <b-form-group label="Manager" label-for="manager">
            <select id="manager" class="form-select" v-model="user.manager.id">
              <option
              v-for="manager in managers"
              :key="manager.id"
              :value="manager.id"
              >{{manager.fullName}}</option>
            </select>
          </b-form-group>
        </form>
      </b-modal>

      <!-- Edit Modal -->
      <b-modal
        :id="infoModal.id"
        :title="infoModal.title"
        ok-only
        @hide="resetInfoModal"
      >
        <b-form @submit="onFiltered">
          <b-form-group
            id="input-group-1"
            label-cols-lg="3"
            label="Project number:"
            label-for="input-1"
          >
            <b-form-input
              id="number-1"
              type="text"
              v-model="user.sesa"
              required
            ></b-form-input>
            <pre>{{ users }}</pre>
          </b-form-group>

          <b-button type="submit" block variant="primary">Update</b-button>
        </b-form>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["users"],
  data() {
    return {
      tableFields: [
        {
          key: "id",
          sortable: true,
        },
        {
          key: "sesa",
          label: "Number",
          sortable: true,
        },
        {
          key: "firstName",
          label: "ONAN",
          sortable: true,
        },
        {
          key: "lastName",
          label: "ONAF",
          sortable: true,
        },
        {
          key: "department",
          label: "HV",
          sortable: false,
        },
        {
          key: "Action",
          label: "Action",
          sortable: false,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 100],
      filter: null,
      filterOn: [],

      user: {
        id: 0,
        sesa: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        department: "",
        manager: {
          id: 0,
        },
      },
      managers: [],
      departments: ["ENGINEERING","TENDERING","PROJECT", "OTHER"],
      roles: ["DESIGNER","MANAGER","OTHER"],
      userState: null,

      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
    };
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.users.length;
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.userState = valid;
      return valid;
    },
    async getManagers() {
      this.userState = null;
      this.user = {
        id: 0,
        sesa: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        department: "",
        manager: {
          id: 0,
        },
      };
      // Manager List
      await axios
        .get("http://localhost:8081/api/user/manager")
        .then((response) => {
          this.managers = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
        this.managers.push({id: 0, fullName: "NONE"})
    },
    async handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Backend connection
      let success = false;
      await axios.post("http://localhost:8081/api/user", this.user)
      .then(response => {
        success = response.data;
      })
      .catch(e =>{
        success = false;
        console.log(e);
      });
      if(success){
        this.handleSubmit();
      }
      else{
        alert("DB record was not completed properly!");
      }
    },
    handleSubmit() {
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-user-add");
      });
    },

    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>

<style></style>
