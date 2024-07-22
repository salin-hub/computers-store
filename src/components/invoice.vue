<template>
  <section>
    <div class="list">
      <h2>Please select</h2>
    </div>
    <div class="shop_product">
      <table class="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.productDetail._id">
            <td>
              <div class="thumbnail">
                <img :src="item.productDetail.image" alt="Product Image" />
              </div>
            </td>

            <td>
              <h3>{{ item.productDetail.name }}</h3>
            </td>
            <td>
              <p>{{ item.cartItem.quantity }}</p>
            </td>
            <td>
              <p>${{ (item.productDetail.price * item.cartItem.quantity).toFixed(2) }}</p>
            </td>
            <td>
              <p><input type="checkbox" v-model="selectedItems" :value="item.productDetail._id" /></p>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="invoice-total">
        <p>Total Price: ${{ calculateTotalPrice() }}</p>
        <button @click="placeOrder" :disabled="!haveSelectedItems" class="btn bg-success">Place Order</button>
      </div>
    </div>
  </section>
</template>

  
<script>
import axios from 'axios';
import { API_BASE_URL } from '@/configURL/configUrl';
export default {
  data() {
    return {
      cartItems: [], // Replace this with your actual cart items
      selectedItems: [],
    };
  },
  created() {
    this.fetchProducts();
  },
  computed: {
    haveSelectedItems() {
      return this.selectedItems.length > 0;
    },
  },
  methods: {
    calculateTotalPrice() {
      return this.cartItems
        .filter(item => this.selectedItems.includes(item.productDetail._id))
        .reduce((total, item) => total + item.productDetail.price * item.cartItem.quantity, 0)
        .toFixed(2);
    },
    async fetchProducts() {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
          // Send a request to your server to fetch products based on the user's cart
          const response = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Response from /cart/:userId:', response.data);

          this.cartItems = response.data.map(product => ({ ...product, quantity: 0 }));
        } else {
          // If no token or userId is found, fetch products without considering the user's cart
          const response = await axios.get(`${API_BASE_URL}/products`, {
            params: {
              // Add other parameters if needed
            },
          });

          this.cartItems = response.data.map(product => ({ ...product, quantity: 0 }));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async placeOrder() {
  try {
    const userId = localStorage.getItem('userId');

    // Ensure at least one item is selected
    if (this.selectedItems.length === 0) {
      console.error('No items selected.');
      return;
    }

    // Create array of product IDs and quantities for the order
    const orderItems = this.cartItems
      .filter(item => this.selectedItems.includes(item.productDetail._id)) // Include only selected items
      .map(item => ({
        product: item.productDetail._id,
        price: item.productDetail.price,
        quantity: item.cartItem.quantity,
      }));

    // Send POST request to place the order
    const response = await axios.post(`${API_BASE_URL}/orders/${userId}`, { orderItems });

    // Remove selected items from the cart before placing the order
    await Promise.all(this.selectedItems.map(productId => this.removeItem(productId)));

    // Show success message and redirect to a confirmation page
    if (response.status === 200 || response.status === 201) {
      // Show success message to the user
      Swal.fire({
        icon: 'success',
        title: 'Done',
        text: 'Order placed successfully!',
        confirmButtonText: 'Close',
      });

      // Redirect to a confirmation page
      this.$router.push({ name: 'shipping' });
    } else {
      // Handle error response from the server
      console.error('Failed to place order. Server returned error status:', response.status);
    }
  } catch (error) {
    console.error('Error placing order:', error);
  }
},



    async removeItem(productId) {
      try {
        const userId = localStorage.getItem('userId');

        // Make a DELETE request to your API endpoint to remove the item by ID
        await axios.delete(`${API_BASE_URL}/cart/${userId}/${productId}`);

        // Remove the item from the local state after deleting it from the API
        this.cartItems = this.cartItems.filter(item => item.productDetail._id !== productId);

        // Remove the item from local storage as well
        const storedCartItems = JSON.parse(localStorage.getItem('cart'));
        const updatedCartItems = storedCartItems.filter(item => item.productDetail._id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));

        console.log(`Item with ID ${productId} removed from the cart successfully!`);
      } catch (error) {
        console.error(`Error removing item with ID ${productId} from the cart:`, error);
      }
    }


  }
};
</script>
  
<style scoped>
/* Add your component-specific styles here */
</style>
  