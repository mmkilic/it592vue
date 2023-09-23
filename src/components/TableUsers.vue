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
        bordered
        head-variant = "dark"
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
          <b-icon icon="gear" scale="1.5" class="mx-1" @click="actionEdit(row.item, $event.target)"></b-icon>
          <b-icon icon="trash" scale="1.5" class="mx-2" @click="actionDelete(row.item)"></b-icon>
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
        @show="showAddUser"
        @ok="okAddUser"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="MMK"
            label-for="mmk-input"
            invalid-feedback="MMK is required"
            :state="userState"
          >
            <b-form-input
              id="mmk-input"
              v-model="user.mmk"
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
          <b-form-group label="E-mail" label-for="email-input" invalid-feedback="E-mail is invalid" :state="mailState">
            <b-form-input type= "email" id="email-input" v-model="user.email" :state="mailState" required></b-form-input>
          </b-form-group>
          <b-form-group label="Password" label-for="password-input">
            <b-form-input type= "password" id="password-input" v-model="user.password"></b-form-input>
          </b-form-group>
          <b-form-group label="Department" label-for="department" :state="departmentState">
            <b-form-select v-model="user.department" :options="departments" :state="departmentState" required></b-form-select>
          </b-form-group>
          <b-form-group label="Role" label-for="role" :state="roleState">
            <b-form-select v-model="user.role" :options="roles" :state="roleState" required></b-form-select>
          </b-form-group>
          <b-form-group label="Manager" label-for="manager">
            <b-form-select v-model="managerId" :options="managers" value-field="id" text-field="fullName">
              <b-form-select-option value=0>NONE</b-form-select-option>
            </b-form-select>
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
            label="MMK"
            label-for="mmk-input"
          >
            <b-form-input
              id="mmk-input"
              v-model="user.mmk"
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
          key: "mmk",
          label: "MMK",
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
        mmk: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        department: ""
      },
      userEmpty: {
        id: 0,
        mmk: "",
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
      roles: ["MECHANIC","ELECTRIC","MANAGER","OTHER"],
      userState: null,
      mailState: null,
      departmentState: null,
      roleState: null
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
      this.userState = this.$refs.form.checkValidity();
      this.mailState = this.$refs.form[3].checkValidity();
      this.departmentState = this.user.department !== "";
      this.roleState = this.user.role !== "";
      return this.userState && this.mailState && this.departmentState && this.roleState;
    },
    async showAddUser() {
      this.userState = null;
      this.mailState = null,
      this.departmentState = null,
      this.roleState = null
      this.user = JSON.parse(JSON.stringify(this.userEmpty));
      // Manager List
      await axios
        .get("/user/manager")
        .then((response) => {
          this.managers = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async okAddUser(bvModalEvt) {
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
      await axios.post("/user", this.user)
      .then(response => {
        success = response.data;
      })
      .catch(e =>{
        success = false;
        console.log(e);
      });
      if(success){
        this.handleSubmit("modal-user-add");
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
    actionEdit(item, button) {
      this.showAddUser();
      this.user = item;
      if(this.user.manager != null){
        this.managerId = this.user.manager.id;
      }
      this.$root.$emit("bv::show::modal", "modal-user-edit", button);
    },
    async okEdit(bvModalEvt) {
      bvModalEvt.preventDefault();
      
      if(this.user.manager != null){
        this.user.manager.id = this.managerId;
      }
      // Backend connection
      let success = false;
      await axios.put("/user", this.user)
      .then(response => {
        success = response.data;
      })
      .catch(e =>{
        success = false;
        console.log(e);
      });
      if(success){
        this.handleSubmit("modal-user-edit");
      }
      else{
        alert("An error occurred while recording!");
      }
    },
    async actionDelete(item){
      await axios.delete(`/user/${item.id}`)
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
  },
};
</script>

<style></style>
