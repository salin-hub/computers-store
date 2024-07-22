<template>
     <div v-if="loadingProducts" class="loading">
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    <div class="popup" v-else >
        <div v-if="product" class="view_product">
            <div class="thumbnail_pro">
                <img :src="product.image" alt="" width="100px">
            </div>
            <div class="view_product_detail">
                <h2>{{ product.name }}</h2>
                <p><li>{{ product.title }}</li></p>
                <p><li>model: {{ product.model }}</li></p>
                <p><li>category: {{ product.category }}</li></p>
                <p><li>year: {{ product.year }}</li></p>
                <div class="rating_view">
                    <span v-for="i in Math.round(product.rate)" :key="i">
                        <i class="fas fa-star"></i>
                    </span>
                    <span v-for="i in Math.round(5 - product.rate)" :key="i">
                        <i class="far fa-star"></i>
                    </span>
                    <span>({{ product.rate }} reviews)</span>
                </div>
                <span>Price: ${{ product.price }}</span>
                <div class="button_view">
                    <button @click="addToCart(product)" class="btn"><i class="fa-solid fa-truck-fast"></i><span>Add to cart</span></button>
                    <button @click=" toggleFavorite(product._id)" class="btn"><i class="fa"
                            :class="isFavorite(product._id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i><span>favorite</span></button>
                </div>
            </div>
        </div>
    </div>
    <section>
        <relatedProduct v-if="product" :categoryId="selectedCategoryId" :allProducts="allProducts" :category="product.category " :model="product.model"/>
    </section>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '../configURL/configUrl';
import relatedProduct from '../components/relateproduct.vue'
export default {
    components: {
        relatedProduct
    },
    data() {
        return {
            loadingProducts:true,
            product: null
        };
    },
    created() {
        this.fetchProductDetails();
        setTimeout(() => {
            this.loadingProducts = false
        },1000);
    },
    computed: {
        isFavorite() {
            // Access the isFavorite getter from the store
            return this.$store.getters.isFavorite;
        },
    },
    methods: {
        fetchProductDetails() {
            const productId = this.$route.params.productId;
            console.log(this.$route.params.productId)
            axios.get(`${API_BASE_URL}/products/${productId}`)
                .then(response => {
                    this.product = response.data;
                })
                .catch(error => {
                    console.error('Error fetching product details:', error);
                });
        },
        addToCart(product) {
            this.$store.dispatch('addToCart', product);
        },
        toggleFavorite(productId) {
            // Call the toggleFavorite action from the store
            this.$store.dispatch('toggleFavorite', productId);
        },
    }
};
</script>