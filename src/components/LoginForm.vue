<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-1" label="SESA number:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.sesa"
          placeholder="SESA100100"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" block variant="primary">Login</b-button>
    </b-form>

    <b-card class="mt-3" header="Form Data Result" v-if="show">
      <pre class="m-0">{{ user }}</pre>
    </b-card>
  </div>
</template>

<script>
import axios from "axios"

const userUrl = "http://localhost:8081/api/user"

export default {
    data() {
      return {
        form: {
          sesa: '',
          password: ''
        },
        user: {},
        show: false
      }
    },
    methods: {
      onSubmit(event) {
        this.show = true
        axios.get(userUrl + `/${this.form.sesa}/${this.form.password}`)
        .then(response => {
          this.user = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
        event.preventDefault()
      }
    }
  }
</script>

<style scoped>
</style>