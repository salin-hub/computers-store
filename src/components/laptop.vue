<template>
    <section>
        <div class="search-bar">
            <div class="cute_search">
                <div class="feild">
                    <input type="text" v-model="searchQuery" @input="applySearch" placeholder="Search products...">
                    <button @click="search">Search</button>
                </div>
            </div>
        </div>
        <div class="custom-dropdown">
            <span>Sort by: </span>
            <!-- Select dropdown for sorting -->
            <select v-model="selectedSortOption" class="dropdown-select">
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="yearLowToHigh">Year: Low to High</option>
                <option value="yearHighToLow">Year: High to Low</option>
            </select>
        </div>
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
        <div v-else class="control_slide">
            <div v-for="(modelGroup, category) in sortedProductsByCategory" :key="category" class="category">
                <div v-for="(products, model) in modelGroup" :key="model" class="model-group">
                    <h1>{{ model }}</h1>
                    <div class="line"></div>
                    <div class="product_list">
                        <div class="product" v-for="product in products" :key="product.id">
                            <!-- Your existing product details rendering code -->
                            <div class="image_product">
                                <img :src="product.image" alt="">
                                <div class="favorite" @click="toggleFavorite(product._id)">
                                    <i class="fa"
                                        :class="isFavorite(product._id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                                </div>
                            </div>
                            <div class="product_detail">
                                <router-link :to="{ name: 'viewproduct', params: { productId: product._id } }">
                                    <h2>{{ product.name }}</h2>
                                </router-link>
                                <p>{{ product.title }}</p>
                            </div>
                            <div class="rating">
                                <span v-for="i in Math.round(product.rate)" :key="i">
                                    <i class="fas fa-star"></i>
                                </span>
                                <span v-for="i in Math.round(5 - product.rate)" :key="i">
                                    <i class="far fa-star"></i>
                                </span>
                                <span>
                                    ({{ product.rate }} reviews)
                                </span>
                            </div>
                            <div class="price">
                                <p>price: {{ product.price }}$</p>
                                <span @click="addToCart(product)"><i class="fa-solid fa-cart-shopping"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!loadingProducts && filteredProducts.length === 0" class="view_product">
            <h1>please check your Internet. Try a gain later !!</h1>
      </div>
        </div>
        
    </section>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '../configURL/configUrl';
import Viewproduct from './Viewproduct.vue';

export default {
    components: {
        Viewproduct
    },
    data() {
        return {
            loadingProducts: true,
            selectedSortOption: 'priceLowToHigh', // Default sorting option
            categorys: ['Laptop'], // Your categories
            products: [],
            searchQuery: '', // Search query
            filteredProducts: [], // Filtered products based on search query
        };
    },
    computed: {
        isFavorite() {
            return this.$store.getters.isFavorite;
        },
        sortedProductsByCategory() {
            const sortedByCategory = {};

            this.categorys.forEach(category => {
                const filteredProducts = this.filteredProductsByCategory(category);
                const groupedByModel = {};

                filteredProducts.forEach(product => {
                    if (!groupedByModel[product.model]) {
                        groupedByModel[product.model] = [];
                    }
                    groupedByModel[product.model].push(product);
                });

                for (const model in groupedByModel) {
                    if (this.selectedSortOption === 'priceLowToHigh') {
                        groupedByModel[model] = groupedByModel[model].sort((a, b) => a.price - b.price);
                    } else if (this.selectedSortOption === 'priceHighToLow') {
                        groupedByModel[model] = groupedByModel[model].sort((a, b) => b.price - a.price);
                    } else if (this.selectedSortOption === 'yearLowToHigh') {
                        groupedByModel[model] = groupedByModel[model].sort((a, b) => a.year - b.year);
                    } else if (this.selectedSortOption === 'yearHighToLow') {
                        groupedByModel[model] = groupedByModel[model].sort((a, b) => b.year - a.year);
                    }
                }

                sortedByCategory[category] = groupedByModel;
            });

            return sortedByCategory;
        },
    },
    created() {
        this.fetchProducts();
        setTimeout(() => {
            this.loadingProducts = false; // Set loading to false after 2 seconds
        }, 1000);
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                this.products = response.data;
                this.filteredProducts = [...this.products]; // Initialize filteredProducts with all products
            } catch (error) {
                console.error(error);
            }
        },
        addToCart(product) {
            this.$store.dispatch('addToCart', product);
        },
        toggleFavorite(productId) {
            this.$store.dispatch('toggleFavorite', productId);
        },
        filteredProductsByCategory(category) {
            return this.filteredProducts.filter(product =>
                product.category.toLowerCase() === category.toLowerCase() &&
                (product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    product.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
            );
        },
        applySearch() {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        search() {
            // This method can be used for additional search actions if necessary
            this.applySearch();
        },
    },
};
</script>

