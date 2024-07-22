<template>
    <section class="view_shipping">
        <div class="card_item_pro">
            <div class="list">
                <h2>Shopping cart</h2>
            </div>
            <button class="btn bg-danger mb-2 clear" @click="clearall">
                <span>Clear all</span>
            </button>
            <div class="line"></div>
            <div v-if="products.length === 0" class="empty">
                <p>Your cart is empty.</p>
            </div>
            <div class="shop_product" v-else>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th v-if="!isMobile">Title</th>
                            <th v-if="!isMobile">Year</th>
                            <th>Quantity</th>
                            <th>Active</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cartItem in products" :key="cartItem.productDetail?._id">
                            <td>
                                <div class="thumbnail">
                                    <img :src="`${cartItem.productDetail?.image}`" alt="Product Image" />
                                </div>
                            </td>
                            <td>
                                <h3>{{ cartItem.productDetail?.name }}</h3>
                            </td>
                            <td v-if="!isMobile">
                                <p>{{ cartItem.productDetail?.title }}</p>
                            </td>
                            <td v-if="!isMobile">
                                <p>{{ cartItem.productDetail?.year }}</p>
                            </td>
                            <td>
                                <div class="add_remove">
                                    <span><i @click="removeOneFromCart(cartItem.productDetail?._id)"
                                            class="fa-solid fa-minus"></i></span>
                                    <div class="num_p1">
                                        <span>{{ cartItem.cartItem?.quantity }}</span>
                                    </div>
                                    <span><i @click="addOneToCart(cartItem.productDetail?._id)"
                                            class="fa-solid fa-plus"></i></span>
                                </div>
                            </td>
                            <td>
                                <div class="add_remove">
                                    <span><i @click="remove_product(cartItem.productDetail?._id)"
                                            class="fa-solid fa-trash"></i></span>
                                </div>
                            </td>
                            <td>
                                <p>${{ cartItem.productDetail?.price * cartItem.cartItem?.quantity }}</p>
                            </td>
                        </tr>

                        <tr>
                            <td :colspan="isMobile ? 4 : 6" class="text-right"><strong>Total Price:</strong></td>
                            <td><strong>${{ totalCartPrice() }}</strong></td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="haveproduct" class="addTopay">
                    <button class="btn bg-success process" @click="proceedToPay">PROCEED TO PAY</button>
                </div>
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
            products: [],
            haveproduct: true,
            selectedSortOption: 'default', // Add this line
            loadingproduct: true,
            isMobile: false
        };
    },

    created() {
        this.fetchProducts()
        this.isMobile = window.innerWidth < 768;
        // Add event listener to update isMobile when window size changes
        window.addEventListener('resize', this.updateIsMobile);
    },

    methods: {
        updateIsMobile() {
            this.isMobile = window.innerWidth < 768;
        },
        // Don't forget to remove the event listener when the component is destroyed
        beforeDestroy() {
            window.removeEventListener('resize', this.updateIsMobile);
        },
        async fetchProducts() {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');

                if (token && userId) {
                    // Send a request to your server to fetch products based on the user's cart
                    const response = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
                        params: {
                            search: this.searchProduct,
                            sort: this.selectedSortOption === 'default' ? '' : this.selectedSortOption.toLowerCase(),
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('Response from /cart/:userId:', response.data);

                    this.products = response.data.map(product => ({ ...product, quantity: 0 }));
                    this.loading = false;
                }
                this.loadingproduct = this.loadingproduct.length > 0
            } catch (error) {
                console.error('Error fetching products:', error);
                this.loading = false;
            }
        },
        async remove_product(productId) {
            try {
                const userId = localStorage.getItem('userId');

                // Make a DELETE request to your API endpoint to remove the item by ID
                await axios.delete(`${API_BASE_URL}/cart/${userId}/${productId}`);

                // Remove the item from local storage
                const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                const updatedCart = cartItems.filter(item => item.productDetail._id !== productId);
                localStorage.setItem('cart', JSON.stringify(updatedCart));

                // Update the local state after removing the item
                this.products = this.products.filter(product => product.productDetail._id !== productId);
                this.haveproduct = this.products.length > 0;

                console.log(`Item with ID ${productId} removed from the cart successfully!`);
            } catch (error) {
                console.error(`Error removing item with ID ${productId} from the cart:`, error);
            }
        },

        async clearall() {
            try {
                const userId = localStorage.getItem('userId');
                // Send a DELETE request to clear the cart for the specific user on the server
                await axios.delete(`${API_BASE_URL}/cart/${userId}`);

                // Clear the cart items in local storage
                localStorage.removeItem('cart');
                this.$store.commit('clearCart')
                // Update the local state
                this.products = [];
                this.haveproduct = false;

                console.log('Cart cleared successfully!');
            } catch (error) {
                // Handle errors
                console.error('Error clearing cart:', error.message);
                // You might want to show a user-friendly error message here
            }
        },


        removeOneFromCart(productId) {
            const product = this.products.find(item => item.productDetail._id === productId);
            this.$store.commit('removeOneFromCart', productId)
            if (product && product.cartItem.quantity > 1) {
                // If the quantity is more than 1, decrement it
                this.updateCartItemQuantity(productId, product.cartItem.quantity - 1);

                // Update local storage for the decremented quantity
                this.updateLocalStorage(productId, product.cartItem.quantity - 1);
            } else {
                // If the quantity is 1, remove the product from the cart
                this.remove_product(productId);

                // Remove from local storage
                this.removeFromLocalStorage(productId);
            }
        },
        updateLocalStorage(productId, quantity) {
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCart = cartItems.map(item => {
                if (item.productDetail._id === productId) {
                    item.cartItem.quantity = quantity;
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        },
        removeFromLocalStorage(productId) {
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCart = cartItems.filter(item => item.productDetail._id !== productId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        },

        addOneToCart(productId) {
            const product = this.products.find(item => item.productDetail._id === productId);

            // Increment the quantity
            this.updateCartItemQuantity(productId, product.cartItem.quantity + 1);

            // Update local storage for the incremented quantity
            this.updateLocalStorage(productId, product.cartItem.quantity + 1);
        },

        async updateCartItemQuantity(productId, quantity) {
            try {
                const userId = localStorage.getItem("userId");
                await axios.put(`${API_BASE_URL}/cart/${userId}/${productId}`, { quantity });

                // Update the local state after updating the quantity
                const updatedProduct = this.products.find(item => item.productDetail._id === productId);
                if (updatedProduct) {
                    updatedProduct.cartItem.quantity = quantity;
                }

                // console.log(`Quantity updated for item with ID ${productId}: ${quantity}`);
            } catch (error) {
                console.error(`Error updating quantity for item with ID ${productId}:`, error);
                // Handle error, show message to the user
            }
        },

        async placeOrder() {
            try {
                const userId = localStorage.getItem('userId');

                // Create an array of product IDs and quantities for the order
                const orderItems = this.products.map(item => ({
                    product: item.productDetail._id,
                    price: item.productDetail.price,
                    quantity: item.cartItem.quantity,
                }));

                // Send a POST request to your server to place the order
                const response = await axios.post(`${API_BASE_URL}/orders/${userId}`, { orderItems });

                // Process the response as needed
                // console.log('Order placed successfully!', response.data);

                // Optionally, clear the cart after placing the order
                // await this.clearCart();

                // Redirect to a confirmation or thank you page
                this.$router.push({ name: 'payment' });
            } catch (error) {
                console.error('Error placing order:', error);
                // Handle error, show message to the user
            }
        },

        proceedToPay() {
            this.$router.push({ name: 'invoice' });
            console.log('Proceeding to payment...');
        },
        totalCartPrice() {
            return this.products.reduce((total, cartItem) => {
                // Ensure that cartItem.productDetail and cartItem.cartItem are defined
                if (cartItem.productDetail && cartItem.cartItem) {
                    // Calculate the total price for each cart item and accumulate it
                    total += cartItem.productDetail.price * cartItem.cartItem.quantity;
                }
                return total;
            }, 0).toFixed(2); // Convert the total to a fixed decimal representation
        },

    },
};
</script>
<style>
.view_shipping{
    margin-bottom: 15rem;
}
</style>

  