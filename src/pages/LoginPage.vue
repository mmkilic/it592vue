<template>
  <div class="container my-3 " >
    <h2 class="center">Login Form</h2>
    <div class="row py-4">
      <div class="col mx-auto">
        <b-form @submit="onSubmit">
          <b-form-group
            id="input-group-1"
            label="MMK number:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="mmk"
              placeholder="MMK100100"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Password:"
            label-for="input-2"
          >
            <b-form-input
              id="input-2"
              v-model="password"
              type="password"
              placeholder="Enter password"
              required
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" block variant="primary">Login</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const userUrl = "/user";

export default {
  data() {
    return {
      mmk: "",
      password: ""
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      axios.get(userUrl + `/${this.mmk}/${this.password}`)
      .then((response) => {
        localStorage.setItem('user', JSON.stringify(response.data));
        this.$router.push({path: "/"});
      })
      .catch((e) => {
        console.log(e);
      });
    },
  },
};
</script>

<style scoped>
</style>