<template>
    <div class="control_slide">
        <div class="slide-container">
            <Transition name="fade" mode="out-in">
                <div :key="currentSlide" class="slide">
                    <div class="content">
                        <div class="image">
                            <div class="title_slide">
                                <h1>{{ slides[currentSlide].title }}</h1>
                                <h1>{{ slides[currentSlide].description }}</h1>
                            </div>
                            <img :src="slides[currentSlide].image" alt="Slide Image" />
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
    <div>
        <slidecompany />
    </div>
    <div class="custom-dropdown">
        <span>Sort by: </span>
        <select v-model="selectedSortOption" @change="applySort" class="dropdown-select">
            <option value="default">Default</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="year-asc">Year (Old to New)</option>
            <option value="year-desc">Year (New to Old)</option>
            <option value="model-asc">Model (A to Z)</option>
            <option value="model-desc">Model (Z to A)</option>
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
    <section v-else class="center_prooduct">

        <div class="list_product">
            <Searching />
            <div class="lists">
                <h1>Latest Product</h1>
            </div>
            <div class="line"></div>
            <div class="product_list">
                <div class="product" v-for="product in sortedProducts">
                    <div class="image_product">
                        <img :src="product.image" alt="">
                        <div class="favorite" @click="toggleFavorite(product)">
                            <!-- Use font-awesome icons based on favorite status -->
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
    </section>
    <section class="center_prooduct">
        <div v-for="category in categorys" :key="category">
            <div class="lists">
                <h1>{{ category }}</h1>
            </div>
            <div class="line"></div>
            <div class="product_list">
                <div class="product" v-for="product in sortedProductsByCategory[category]">
                    <div class="image_product">
                        <img :src="product.image" alt="">
                        <div class="favorite" @click="toggleFavorite(product)">
                            <!-- Use font-awesome icons based on favorite status -->
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
                        <span>({{ product.rate }} reviews)</span>
                    </div>
                    <div class="price">
                        <p>price: {{ product.price }}$</p>
                        <span @click="addToCart(product)"><i class="fa-solid fa-cart-shopping"></i></span>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>


<script>
import searching from './searching.vue';
import Viewproduct from '@/components/Viewproduct.vue';
import axios from 'axios';
import { API_BASE_URL } from '../configURL/configUrl'; // Adjust the path based on your project structure
import Searching from './searching.vue';
import slidecompany from '../views/slide_company.vue'
export default {
    components: {
        Viewproduct,
        searching,
        Searching,
        slidecompany
    },
    data() {
        return {
            loadingProducts: true,
            selectedSortOption: 'default',
            currentSlide: 0,
            slides: [
                { title: 'default slide', image: '../src/assets/image/1.png', description: 'Please wait for render ' },
                
            ],
            latestproduct: [],
            autoPlayInterval: null,
            categorys: ['Laptop', 'Desktop', 'Monitor', 'Gaming'],
        };
    },
    computed: {
        isFavorite() {
            return productId => this.$store.getters.isFavorite(productId);
        },
        sortedProducts() {
            if (Array.isArray(this.latestproduct)) {
                return [...this.latestproduct].slice().sort((a, b) => new Date(b.createdAt) - Date(a.createdAt));
            } else {
                console.error('latestproduct is not an array');
                return [];
            }
        },
        sortedProductsByCategory() {
            const sortedByCategory = {};
            this.categorys.forEach(category => {
                if (Array.isArray(this.latestproduct)) {
                    // Filter products by category
                    const productsInCategory = this.latestproduct.filter(product => product.category.toLowerCase() === category.toLowerCase());
                    // Sort filtered products
                    sortedByCategory[category] = productsInCategory.slice().sort((a, b) => b._id - a._id);
                } else {
                    console.error('latestproduct is not an array');
                    sortedByCategory[category] = [];
                }
            });
            return sortedByCategory;
        },

    },
    created() {
        this.fetchSlides();
        this.fetchproduct();
        setTimeout(() => {
            this.loadingProducts = false
        }, 1000);
        this.autoPlayTimeout = setTimeout(this.nextSlide, 100);
    },
    beforeDestroy() {
        // Clear the timeout when the component is destroyed
        clearTimeout(this.autoPlayTimeout);
    },
    methods: {
        async fetchSlides() {
            try {
                const response = await axios.get(`${API_BASE_URL}/banners`); // Replace with your API endpoint
                this.slides = response.data;
            } catch (error) {
                console.error('Error fetching slides:', error);
            }
        },
        async fetchproduct() {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                let products = response.data;

                // Sort the products by creation date (latest first)
                products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                // Update the latestproduct data property
                this.latestproduct = products;

                this.products = response.data.map(product => ({ ...product, quantity: 0 })).reverse();
                this.loadingproduct = false;
            } catch (error) {
                console.error(error);
            }
        },
        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            // Call the method recursively after 5 seconds
            this.autoPlayTimeout = setTimeout(this.nextSlide, 5000);
        },
        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        },
        toggleSeeMore(category) {
            this.$set(this.showMore, category, !this.showMore[category]);
        },
        handleImageError(product) {
            // Handle image load errors (e.g., replace with a placeholder)
            product.image = require('@/assets/image/error-placeholder.png');
        },
        async toggleFavorite(product) {
            try {
                // Dispatch toggleFavorite action with product ID
                await this.$store.dispatch('toggleFavorite', product._id);
            } catch (error) {
                console.error('Error toggling favorite:', error);
                // Handle error, show user notification, etc.
            }
        },
        addToCart(product) {
            this.$store.dispatch('addToCart', product);
        },
        applySort() {
            switch (this.selectedSortOption) {
                case 'price-asc':
                    this.latestproduct.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    this.latestproduct.sort((a, b) => b.price - a.price);
                    break;
                case 'year-asc':
                    this.latestproduct.sort((a, b) => a.year - b.year);
                    break;
                case 'year-desc':
                    this.latestproduct.sort((a, b) => b.year - a.year);
                    break;
                case 'model-asc':
                    this.latestproduct.sort((a, b) => (a.model ?? '').localeCompare(b.model ?? ''));
                    break;
                case 'model-desc':
                    this.latestproduct.sort((a, b) => (b.model ?? '').localeCompare(a.model ?? ''));
                    break;
                default:
                    this.fetchproduct()
                    break;
            }
        },

    }
};
</script>
<style></style>