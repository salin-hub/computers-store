// store.js

import { createStore } from 'vuex';
import axios from 'axios';
import router from '@/router'; // Import the router instance
import { API_BASE_URL } from '../configURL/configUrl'; // Assuming you have a configuration file for API base URL

const store = createStore({
  state: {

    userId: '',
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  },
  mutations: {
    clearCart(state) {
      state.cartItems = 0
      state.cart = []; // Clear the cart array
    },
    addToCart(state, { product, quantity }) {
      const existingItem = state.cart.find(item => item.productId === product._id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ ...product, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart(state, productId) {
      state.cart = state.cart.filter(item => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setFavorites(state, favorites) {
      state.favorites = favorites;
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    setCart(state, cartItems) {
      state.cart = cartItems;
      localStorage.setItem('cart', JSON.stringify(cartItems));
    },
    clearUserData(state) {
      state.userId = '';
      state.favorites = [];
      localStorage.removeItem('userId');
      localStorage.removeItem('favorites');
      localStorage.removeItem('cart');
    },
    toggleFavorite(state, productId) {
      const index = state.favorites.indexOf(productId);
      if (index === -1) {
        state.favorites.push(productId);
      } else {
        state.favorites.splice(index, 1);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    removeFavorite(state, productId) {
      state.favorites = state.favorites.filter(id => id !== productId);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
  actions: {
    async handleLogout({ commit }) {
      try {
        // Display a confirmation alert before logging out
        const confirmLogout = await Swal.fire({
          icon: 'warning',
          title: 'Confirm Logout',
          text: 'Are you sure you want to logout?',
          showCancelButton: true,
          confirmButtonText: 'Yes, logout',
          cancelButtonText: 'No, cancel',
        });
    
        // Proceed with logout if the user confirms
        if (confirmLogout.isConfirmed) {
          await axios.post(`${API_BASE_URL}/logout`);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          commit('clearUserData'); // Clear user data including favorites
    
          // Show logout success alert
          Swal.fire({
            icon: 'success',
            title: 'Logout Successful',
            text: 'You have been successfully logged out.',
          });
    
          // Wait for 5 seconds before reloading the page
          setTimeout(() => {
            window.location.reload();
          }, 5000); // 5000 milliseconds = 5 seconds
    
          router.push('/account/login');
          console.log('Logout successful');
        }
      } catch (error) {
        console.error('Logout failed', error.response.data);
      }
    },
    
    
    async handleLogin({ commit, dispatch }, loginData) {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, loginData);
        const userData = response.data;
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('userRole', userData.userRole)
        const favoritesResponse = await axios.get(`${API_BASE_URL}/favorites/${userData.userId}`);
        const favorites = favoritesResponse.data;

        // Set favorites in Vuex state
        commit('setFavorites', favorites);
        setTimeout(() => {
          window.location.reload();
        }, 2000); 
        await Promise.all([
          dispatch('fetchCart'),
        ]);

        commit('setUserId', userData.userId);
        commit('userRole', userData.userRole)
        router.push('/');
        Swal.fire({
          position: "center",
          icon: "success",
          title: "You are login success!!",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'something is wrong',
          text: 'please login agan!!',
        });
        throw error;
      }
    },

    async addToCart({ commit, state, dispatch }, product) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        Swal.fire({
          icon: 'error',
          title: 'Fail',
          text: 'Please login or register!',
        });
        router.push({name:'login'});
        return;
      }
      const quantity = 1;
      try {
        const response = await axios.post(`${API_BASE_URL}/add-to-cart`, {
          userId: userId,
          productId: product._id,
          quantity: quantity,
        });
        await dispatch('fetchCart');
      } catch (error) {
        console.error('Error adding to cart:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add to cart. Please try again later!',
        });
      }
    },
    async fetchCart({ commit }) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
        const cartItems = response.data;
        commit('setCart', cartItems);
        console.log('Cart fetched successfully:', cartItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
    },
    async fetchFavorites({ commit }) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${API_BASE_URL}/favorites/${userId}`);
        const favorites = response.data;
        commit('setFavorites', favorites);
        console.log('Favorites fetched successfully:', favorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
    },
    async toggleFavorite({ commit, dispatch, state }, productId) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        router.push('/account/login');
        return;
      }
      try {
        const isFavorite = state.favorites.includes(productId);
        if (isFavorite) {
          await axios.delete(`${API_BASE_URL}/favorites/${userId}/${productId}`, {
            data: {
              userId: userId,
              productId: productId,
            },
          });
          const updatedFavorites = state.favorites.filter(id => id !== productId);
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          commit('removeFavorite', productId);
        } else {
          await axios.post(`${API_BASE_URL}/add/favorites`, {
            userId: userId,
            productId: productId,
          });
          const updatedFavorites = [...state.favorites, productId];
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          commit('toggleFavorite', productId);
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to toggle favorite status. Please try again later!',
        });
      }
    },
    async removeFavorite({ commit, state }, productId) {
      const userId = localStorage.getItem('userId');
      try {
        // Make an API call to remove the favorite
        await axios.delete(`${API_BASE_URL}/favorites/${userId}/${productId}`);
        // Update state by committing mutation
        commit('removeFavorite', productId);
        console.log('Favorite removed successfully');
      } catch (error) {
        console.error('Error removing favorite:', error);
        throw error; // Optionally, re-throw the error to handle it in the component
      }
    },
  },
  getters: {
    cartItemCountByQty: state => {
      let totalCount = 0;

      // Add items from the state.cart
      totalCount += state.cart.reduce((total, cartItem) => {
        // Check if cartItem.cartItem.quantity is defined before adding it to total
        if (cartItem.cartItem && cartItem.cartItem.quantity !== undefined) {
          return total + cartItem.cartItem.quantity;
        }
        return total;
      }, 0);

      // Add items from localStorage if present
      const localStorageCart = JSON.parse(localStorage.getItem('cart'));
      if (localStorageCart && Array.isArray(localStorageCart)) {
        totalCount += localStorageCart.reduce((total, cartItem) => {
          // Check if cartItem.quantity is defined before adding it to total
          if (cartItem && cartItem.quantity !== undefined) {
            return total + cartItem.quantity;
          }
          return total;
        }, 0);
      }

      return totalCount;
    },
    favoritesCount: state => {
      return state.favorites.length;
    },
    isFavorite: state => (productId) => {
      return state.favorites.includes(productId);
    }
  }
});

export default store;
