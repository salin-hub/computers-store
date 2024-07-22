<template>
    <div class="search-bar">
        <div class="cute_search">
            <div class="feild">
                <input type="text" v-model="searchQuery" @input="searchProducts" placeholder="Search products...">
                <button @click="searchProducts">Search</button>
            </div>
        </div>
    </div>
    <section v-if="searchQuery" class="center_slide">
        <div class="item">
            <div v-if="filteredProducts.length > 0">
                <div v-for="product in filteredProducts" :key="product.id" class="for_search">
                    <div class="thumbnail_search">
                        <img :src="product.image" alt="">
                    </div>
                    <router-link :to="{ name: 'viewproduct', params: { productId: product._id } }">
                        <h1>{{ product.name }}</h1>
                    </router-link>
                    <p>${{ product.price }}</p>
                </div>
            </div>
            <div v-else>
                <p>No products found.</p>
            </div>
        </div>
    </section>
</template>

  
<script>
import Viewproduct from '@/components/Viewproduct.vue';
import { API_BASE_URL } from '@/configURL/configUrl';
import axios from 'axios';

export default {
    components: {
        Viewproduct
    },
    data() {
        return {
            list: [],
            filteredProducts: [],
            searchQuery: ''
        }
    },
    mounted() {
        // Fetch initial list of products when the component is mounted
        this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                this.list = response.data;
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        searchProducts() {
            this.filteredProducts = this.list.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase())||
                product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    }
}
</script>
  