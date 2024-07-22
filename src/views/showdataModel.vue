<template>
  <div v-if="loadingProducts" class="view_products">
    <div class="loading">
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
  </div>
  <div v-else>
    <div class="title_model">
      <h1>filter product by model:</h1>
      <h1>{{ model }}</h1>
    </div>
    <div class="line"></div>
    <div v-if="ModelProduct.length === 0" class="view_products">
      <h1>This model {{ model }} coming soon !!</h1>
    </div>
    <div class="center_prooduct">
      <div v-if="ModelProduct.length > 0" class="product_list">

        <div v-for="(products, index) in ModelProduct" :key="index" class="product">
          <div class="image_product">
            <img :src="products.image">
            <div class="favorite" @click="toggleFavorite(products._id)">
              <i class="fa" :class="isFavorite(products._id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
            </div>
          </div>
          <div class="product_detail">
            <h2 @click="navigateToProduct(products._id)">{{ products.name }}</h2>
            <p>{{ products.title }}</p>
          </div>
          <div class="rating">
            <span v-for="i in Math.round(products.rate)" :key="i">
              <i class="fas fa-star"></i>
            </span>
            <span v-for="i in Math.round(5 - products.rate)" :key="i">
              <i class="far fa-star"></i>
            </span>
            <span> ({{ products.rate }} reviews)</span>
           
          </div>
          <div class="price">
            <p>price: {{ products.price }}$</p>
            <span @click="addToCart(products)"><i class="fa-solid fa-cart-shopping"></i></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '../configURL/configUrl';
import "../assets/home.css";
export default {
  data() {
    return {
      model: '',
      loadingProducts: true,
      ModelProduct: [], // Array to store related products
    };
  },
  created() {
    this.model = this.$route.query.model || 'Default Model'; // Retrieve the model from query params
    this.fetchModelProducts();
    setTimeout(() => {
      this.loadingProducts = false;
    }, 1000);
  },
  computed: {
    isFavorite() {
      // Access the isFavorite getter from the store
      return this.$store.getters.isFavorite;
    },
  },
  methods: {
    async fetchModelProducts() {
      try {
        // Make an API request to fetch related products by model
        const response = await axios.get(`${API_BASE_URL}/products/byModel/${this.model}`);
        this.ModelProduct = response.data;
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
      this.$router.push({ name: 'viewproduct', params: { productId } });

      setTimeout(() => {
        // Reload the page
        window.location.reload();
      }, 100);
    }
  }
};
</script>
<style>
.view_products {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50vh;
}

.view_product h1 {
  text-align: center;
  color: red;
}
</style>
