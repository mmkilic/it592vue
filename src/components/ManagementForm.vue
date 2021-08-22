<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-1"
        label="Project number:"
        label-for="input-1"
      >
        <b-form-input
          id="number-1"
          type="number"
          v-model="projectNumber.number"
          placeholder="282100"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" block variant="primary">Save</b-button>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";

const apiUrl = "http://localhost:8081/api";

export default {
  data() {
    return {
      projectNumber: {
        number: "",
      }
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      axios.post(apiUrl + "/nbr", this.projectNumber)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style>
</style>