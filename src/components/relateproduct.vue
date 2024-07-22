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
    <div v-else >
        <h1>Related Products</h1>
        <div class="line"></div>
        <div v-if="relatedProducts.length > 0" class="product_list">
            <div v-for="(relatedProduct, index) in relatedProducts" :key="index" class="product">
                <div class="image_product">
                    <img :src="relatedProduct.image" alt="Related Product Thumbnail">
                    <div class="favorite" @click="toggleFavorite(relatedProduct._id)">
                        <i class="fa"
                            :class="isFavorite(relatedProduct._id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                    </div>
                </div>
                <div class="product_detail">
                    <h2 @click="navigateToProduct(relatedProduct._id)">{{ relatedProduct.name }}</h2>
                    <p>{{ relatedProduct.title }}</p>
                </div>
                <div class="rating">
                    <span v-for="i in Math.round(relatedProduct.rate)" :key="i">
                        <i class="fas fa-star"></i>
                    </span>
                    <span v-for="i in Math.round(5 - relatedProduct.rate)" :key="i">
                        <i class="far fa-star"></i>
                    </span>
                    ({{ relatedProduct.rate }} reviews)
                </div>
                <div class="price">
                    <p>price: {{ relatedProduct.price }}$</p>
                    <span @click="addToCart(relatedProduct)"><i class="fa-solid fa-cart-shopping"></i></span>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import { API_BASE_URL } from '../configURL/configUrl';

export default {
    props: {
        category: {
            type: String
        }
    },
    data() {
        return {
            loadingProducts:true,
            relatedProducts: [], // Array to store related products

        };
    },
    created() {
        this.fetchRelatedProducts();
        setTimeout(() => {
            this.loadingProducts=false
        }, 1000);
    },
    computed: {
        isFavorite() {
            // Access the isFavorite getter from the store
            return this.$store.getters.isFavorite;
        },
    },
    methods: {
        async fetchRelatedProducts() {
            try {
                // Make an API request to fetch related products by category
                const response = await axios.get(`${API_BASE_URL}/products/byCategory/${this.category}`);
                this.relatedProducts = response.data;
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        },
        addToCart(product) {
            this.$store.dispatch('addToCart', product);
        },
        toggleFavorite(productId) {
            // Call the toggleFavorite action from the store
            this.$store.dispatch('toggleFavorite', productId);
        },
        navigateToProduct(productId) {
    // Programmatically navigate to the product details page
    this.$router.replace({ name: 'viewproduct', params: { productId: productId } });

    setTimeout(() => {
        // Reload the page
        window.location.reload();
    }, 100);
}

    }
};
</script>
  