<template>
    <section>
        <div class="list">
            <h2>Favorite products</h2>
        </div>
        <div class="list_product">
            <div v-if="favorites.length > 0 && !loading" class="product_list">
                <div class="product" v-for="favorite in favorites" :key="favorite._id" >
                    <div class="image_product">
                        <img :src="favorite.product.image" alt="">
                    </div>
                    <div class="product_detail">
                        <router-link :to="{ name: 'viewproduct', params: { productId: favorite.product._id } }">
                            <h2>{{ favorite.product.name }}</h2>
                        </router-link>
                        <p>{{ favorite.product.title }}</p>
                    </div>
                    <div class="rating">
                        <span v-for="i in Math.round(favorite.product.rate)" :key="i">
                            <i class="fas fa-star"></i>
                        </span>
                        <span v-for="i in Math.round(5 - favorite.product.rate)" :key="i">
                            <i class="far fa-star"></i>
                        </span>
                        <span>
                            ({{ favorite.product.rate }} reviews)
                        </span>
                    </div>
                    <div class="actives">
                        <div class="price_fa">
                            <p>${{ favorite.product.price }}</p>
                        </div>
                        <button @click="addToCart(favorite.product)" class="btn  button bg-success">
                            <i class="fa-solid fa-cart-shopping"></i>Cart
                        </button>
                        <button @click="removeFromFavorites(favorite.product._id)" type="button" class="btn button bg-danger">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="favorites.length === 0 && !loading" class="not_add_cart ">
            <p>No favorite products added yet.</p>
        </div>
    </section>
</template>
  
<script>
import axios from 'axios';
import { API_BASE_URL } from '@/configURL/configUrl';
import Viewproduct from './Viewproduct.vue';

export default {
    components:Viewproduct,
    data() {
        return {
            favorites: [],
            loading: false,
            loadingproduct: true
        };
    },
    created() {
        this.fetchFavorites();
    },
    methods: {
        async fetchFavorites() {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`${API_BASE_URL}/favorites/${userId}`);
                this.favorites = response.data;
                this.loadingproduct = false; // Set loading to false once data is loaded
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        },
        async removeFromFavorites(productId) {
            try {
                // Remove from Vuex state
                await this.$store.dispatch('removeFavorite', productId);
                // Remove from localStorage
                const updatedFavorites = this.favorites.filter(favorite => favorite.product._id !== productId);
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                // Update local favorites array
                this.favorites = updatedFavorites;
                console.log('Favorite removed successfully');
            } catch (error) {
                console.error('Error removing favorite:', error);
            }
        },
        addToCart(product) {
            this.$store.dispatch('addToCart', product);
        },
    }
};
</script>
