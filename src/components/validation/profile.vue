<template>
    <div class="d-flex justify-content-center m-3 loading" v-if="loadingproduct" style=" height: 30rem;">
        <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else>
        <div v-if="user" class="bord_profile">
            <div class="profile_p">
                <img src="../../assets/image/image.png" alt="">
            </div>
            <div class="detail_pro">
                <h1>Username : <span>{{ user.fullName }}</span></h1>
                <h1>Email : <span>{{ user.email }}</span></h1>
                <h1>Role : <span>{{ user.role }}</span></h1>
            </div>
            <span @click="handleLogout" class="btn bg-danger m-1">Logout</span>
            <RouterLink to="/order-history" class="btn bg-primary">Order History</RouterLink>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { API_BASE_URL } from '../../configURL/configUrl'; // Adjust the path based on your project structure

export default {
    data() {
        return {
            user: null,
            loadingproduct: true,
            isLoggedInFromStorage: false,
            reload_logout: true
        };
    },
    components: { RouterLink },
    created() {
        this.fetchUser();
        setTimeout(() => {
            this.loadingproduct = false
        }, 2000)
    },
    methods: {
        async fetchUser() {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
                this.user = response.data.user;
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.error('User not found');
                } else {
                    console.error('Error fetching user data:', error);
                }
            }
        },

        handleLogout() {
            this.$store.dispatch('handleLogout')
                .catch(error => {
                    console.error('Error logging out:', error);
                    // Handle logout failure if necessary
                });
        }
    }
}

</script>
<style>
.profile_p img {
    width: 90%;
    height: 70%;
}
</style>