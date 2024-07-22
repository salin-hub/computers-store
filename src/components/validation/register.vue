<template>
  <div class="container" id="signup">
    <div class="cart_form">
      <h2>Register Now</h2>
      <form @submit.prevent="saveData" class="form_data">
        <label for="fullName">Full Name:</label>
        <div class="password_containers">
          <span><i class="fa-solid fa-user"></i></span>
          <input type="text" id="fullName" v-model="registerData.fullName" placeholder="Full Name..." required>
        </div>
        <label for="emailReg">Email address:</label>
        <div class="password_containers">
          <span><i class="fa-regular fa-envelope"></i></span>
          <input type="email" id="emailReg" v-model="registerData.email" placeholder="Email..." required>
        </div>
        <label for="passwordReg">Password:</label>
        <div class="password_containers">
          <span><i class="fa-solid fa-lock"></i></span>
          <input :type="showPassword ? 'text' : 'password'" id="passwordReg" v-model="registerData.password" placeholder="Password..." required>
          <span @click="togglePasswordVisibility" class="view_pass">
            <i :class="showPassword ? 'fa-solid fa-eye':'fa-solid fa-eye-slash'"></i>
          </span>
        </div>
        <label for="confirmPassword">Confirm Password:</label>
        <div class="password_containers">
          <span><i class="fa-solid fa-lock"></i></span>
          <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="registerData.confirmPassword" placeholder="Confirm Password..." required>
          <span @click="toggleConfirmPasswordVisibility" class="view_pass">
            <i :class="showConfirmPassword ? 'fa-solid fa-eye': 'fa-solid fa-eye-slash'"></i>
          </span>
        </div>
        <div class="z-1 d-flex flex-column justify-content-center align-items-center">
          <button type="submit" :disabled="loading" class="btn bg-success">Register</button>
          <span v-if="loading">Registering...</span>
          <span>Or</span>
          <span class="text-secondary">Already have an account?</span>
          <p class="li" @click="islogin()">Log in</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import { API_BASE_URL } from '../../configURL/configUrl';
export default {
  data() {
    return {
      registerData: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      loading: false,
      passwordStrength: {
        score: 0,
        feedback: '',
      },
      showPassword: false,
      showConfirmPassword: false,
    };
  },
  methods: {
    async saveData() {
      try {
        this.loading = true;

        // Check password strength before submitting
        this.checkPasswordStrength();

        if (this.passwordStrength.score < 3) {
          // Inform the user that the password is weak
          Swal.fire({
            icon: 'warning',
            title: 'Weak Password',
            text: 'Please choose a stronger password.',
          });
          return;
        }

        // Check if passwords match
        if (this.registerData.password !== this.registerData.confirmPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Password Mismatch',
            text: 'Passwords do not match. Please confirm your password.',
          });
          return;
        }

        // Continue with registration logic
        const response = await axios.post(`${API_BASE_URL}/register`, this.registerData);

        // Registration successful
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        this.$router.push('/');
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Registration is successful!',
        }).then(() => {
          // Reload the page after successful login
          window.location.reload();
        });
      } catch (error) {
        Swal.fire({
          icon: 'warning',
          title: 'User Already Exists',
          text: 'An account with this email already exists. Please login instead.',
        });
        return;
      } finally {
        this.loading = false;
      }
    },
    checkPasswordStrength() {
      const result = zxcvbn(this.registerData.password);

      this.passwordStrength.score = result.score;
      this.passwordStrength.feedback = result.feedback.suggestions.join(' ');
    },

    islogin() {
      this.$router.push('/account/login');
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
  },
};
</script>

