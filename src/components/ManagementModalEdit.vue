<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-1" label-cols-lg="3" label="Project number:" label-for="input-1">
        <b-form-input id="number-1" type="text" v-model="fullName" required></b-form-input>
        <pre>{{ project }}</pre>
      </b-form-group>

      <b-button type="submit" block variant="primary">Update</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  props: ["project"],
  data(){
    return{
      fullName: "asd",
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
    },
  },
}
</script>

<style>

</style>