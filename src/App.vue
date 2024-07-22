
<template>
  <div class="wrapper" ref="wrapper">
    <div class="menubar" @click="toggleNav" :class="{ active: showNav }">
      <span><i class="fa-solid fa-bars"></i></span>
    </div>
    <navbar v-if="showNav" class="mobile-nav" :class="{ active: showNav }" ref="menubar">
      <RouterLink to="/" @click.native="closeNavOnClick">All products</RouterLink>
      <RouterLink to="/laptop" @click.native="closeNavOnClick">LAPTOP</RouterLink>
      <RouterLink to="/desktop" @click.native="closeNavOnClick">DESKTOP</RouterLink>
      <RouterLink to="/gaming" @click.native="closeNavOnClick">GAMING</RouterLink>
      <RouterLink to="/monitor" @click.native="closeNavOnClick">Monitor</RouterLink>
      <RouterLink to="/about" @click.native="closeNavOnClick">ABOUT US</RouterLink>
    </navbar>
    <div class="logo">
      <RouterLink to="/">
        <img src="./assets/image/logo.png" alt="">
      </RouterLink>
    </div>
    <nav ref="menubar">
      <RouterLink to="/laptop">LAPTOP</RouterLink>
      <RouterLink to="/desktop">DESKTOP</RouterLink>
      <RouterLink to="/gaming">GAMING</RouterLink>
      <RouterLink to="/monitor">Monitor</RouterLink>
      <RouterLink to="/about">ABOUT US</RouterLink>
    </nav>
    <div class="social">
      <span @click="favorite"><i class="fa-solid fa-heart"></i></span>
      <span @click="shipping"><i class="fa-solid fa-cart-shopping"></i><sup>{{ itemCount }}</sup></span>
      <span><i @click="acount_profile()" class="fa-solid fa-user">
          <div v-if="Account">

            <div v-if="!isLoggedInFromStorage">
              <div class="card_member">
                <div class="item_user">
                  <RouterLink to="/account/login" class="btn bg-info">Log in</RouterLink>
                  <h5>OR</h5>
                  <RouterLink to="/account/register" class="btn bg-success">Register</RouterLink>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="card_member">
                <div class="item_user">
                  <RouterLink to="/profile" class="btn bg-info">View Profile</RouterLink>
                  <h5>OR</h5>
                  <button class="btn bg-danger" @click="handleLogout">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </i></span>
    </div>
  </div>
  <transition name="fade">
    <router-view>
      
    </router-view>
  </transition>
  <footer_page />
</template>
<script>
import footer_page from './views/footer_page.vue'
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { API_BASE_URL } from './configURL/configUrl'; // Adjust the path based on your project structure

export default {
  components: {
    footer_page
  },
  data() {
    return {
      isOpen: false,
      Account: false,
      isLoggedInFromStorage: false,
      userRole: 'user',
      userId: null,
      showNav: false
    };
  },
  created() {
    const storedToken = localStorage.getItem('token');
    this.isLoggedInFromStorage = !!storedToken;

    if (this.isLoggedInFromStorage) {
      this.userRole = localStorage.getItem('userRole');
      this.userId = localStorage.getItem('userId');
      this.fetchUserRole();
    }
    document.addEventListener('click', this.closeNavOnClick); // Add event listener for clicks
  },
  computed: {
    itemCount() {
      return this.$store.getters.cartItemCountByQty;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.closeNavOnScroll);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeNavOnClick); // Remove event listener when component is destroyed
    window.removeEventListener('scroll', this.closeNavOnScroll);
  },
  methods: {
    toggleNav() {
      this.showNav = !this.showNav;
    },
    closeNavOnClick(event) {

    if (!event || !event.target || !this.$refs.wrapper || !this.$refs.menubar) {
        console.error('Error in closeNavOnClick: Event, event.target, wrapper, or menubar is undefined.');
        return;
    }
    
    if (!this.$refs.wrapper.contains(event.target) && !this.$refs.menubar.contains(event.target)) {
        this.showNav = false;
    }
},

    closeNavOnScroll() {
      this.showNav = false;
    },

    async fetchUserRole() {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/${this.userId}`);
        this.userRole = response.data.user.role;
        this.userID = response.data.user.userId;
        console.log('hello', this.userRole)
        console.log('userID =', this.userId)
      } catch (error) {
        console.error('Error fetching user role:', error.response.data.user);
      }
    },

    acount_profile() {
      this.Account = !this.Account;
    },

    handleLogout() {
      this.$store.dispatch('handleLogout')
        .catch(error => {
          console.error('Error logging out:', error);
        });
    },
    favorite() {
      this.$router.push('/favorite')
    },
    shipping() {
      this.$router.push('/shipping')
    }
  },
};
</script>



