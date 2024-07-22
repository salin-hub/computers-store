<template>
  <div class="main-login">
    <div class="container" id="login">
      <div class="cart_form">
        <h2>Login Form</h2>
        <form @submit.prevent="handleLogin" class="form_data">
          <label>Email address:</label>
          <div class="password_containers">
            <span><i class="fa-regular fa-envelope"></i></span>
            <input type="email" id="loginEmail" v-model="loginData.email" placeholder="Email..." required
              @input="clearError">
          </div>
          <label for="loginPassword">Password:</label>
          <div class="password_containers">
            <span><i class="fa-solid fa-lock"></i></span>
            <input :type="showPassword ? 'text' : 'password'" id="loginPassword" v-model="loginData.password"
              placeholder="Password..." required @input="clearError">
            <span @click="togglePasswordVisibility" class="view_pass">
              <i :class="showPassword ? 'fa-solid fa-eye':'fa-solid fa-eye-slash'"></i>
            </span>
          </div>
          <div class="z-1 d-flex flex-column justify-content-center align-items-center">
            <button type="submit" class="btn btn-primary">Login</button>
            <span>Not a member? <a @click="toggleForm">Register</a></span>
          </div>
        </form>
        <div v-if="loginError" class="error-message">{{ loginError }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: true,
      loginData: {
        email: '',
        password: '',
      },
      fetchedUserData: null,
      loginError: null, // Added property to track login error
      showPassword: false, // Added property to track password visibility
    };
  },
  methods: {
    async handleLogin() {
      try {
        await this.$store.dispatch('handleLogin', this.loginData);
        // Login successful, clear form and error message
        this.loginData = {
          email: '',
          password: ''
        };
        this.loginError = '';
      } catch (error) {
        this.loginError = 'Incorrect email or password. Please try again.';
        console.error('Login failed', error);
      }
    },

    clearError() {
      // Clear login error when user interacts with input fields
      this.loginError = null;
    },

    toggleForm() {
      this.isRegister = !this.isRegister;
      this.$router.push('/account/register');
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

