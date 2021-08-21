<template>
  <div class="login">
    <h1 class="my-5"> Login </h1>
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <login-form />
      </div>
      <div class="col-md-3"></div>
    </div>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";

export default {
  name: "Login",
  components: {
    LoginForm,
  },
};
</script>

<style scoped>
</style>