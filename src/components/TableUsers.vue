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
          <b-icon icon="gear" scale="1.5" class="mr-2" @click="actionEdit(row.item, $event.target)"></b-icon>
          <b-icon icon="trash" scale="1.5" class="ml-2" @click="actionDelete(row.item)"></b-icon>
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
            <select id="manager" class="form-select" v-model="managerId">
              <option
              :key=0
              :value=0
              >NONE</option>
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
        id="modal-user-edit"
        ref="modal"
        title="Edit User"
        @ok="okEdit"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="SESA"
            label-for="sesa-input"
          >
            <b-form-input
              id="sesa-input"
              v-model="user.sesa"
              disabled
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
            <select id="manager" class="form-select" v-model="managerId">
              <option
              :key=0
              :value=0
              >NONE</option>
              <option
              v-for="manager in managers"
              :key="manager.id"
              :value="manager.id"
              >{{manager.fullName}}</option>
            </select>
          </b-form-group>
        </form>
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
          label: "SESA",
          sortable: true,
        },
        {
          key: "firstName",
          label: "Name",
          sortable: true,
        },
        {
          key: "lastName",
          label: "Surname",
          sortable: true,
        },
        {
          key: "department",
          label: "Department",
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
        department: ""
      },
      managerId: 0,
      managers: [],
      departments: ["ENGINEERING","TENDERING","PROJECT", "OTHER"],
      roles: ["DESIGNER","MANAGER","OTHER"],
      userState: null
    };
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.users.length;
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
        department: ""
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
      if(this.managerId != 0){
        this.user.manager = {id: this.managerId};
      }
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
    actionEdit(item, button) {
      this.getManagers();
      this.user = item;
      if(this.user.manager != null){
        this.managerId = this.user.manager.id;
      }
      this.$root.$emit("bv::show::modal", "modal-user-edit", button);
    },
    async okEdit(bvModalEvt) {
      if(this.user.manager != null){
        this.user.manager.id = this.managerId;
      }
      // Backend connection
      let success = false;
      await axios.put("http://localhost:8081/api/user", this.user)
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
    async actionDelete(item){
      await axios.delete(`http://localhost:8081/api/user/${item.id}`)
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
    }
  },
};
</script>

<style></style>
