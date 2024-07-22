<template>
    <div class="historys">
        <div class="list">
            <h2>Order History</h2>
        </div>
        <div v-if="orderedItems.length === 0" class="empty">
                <p>Your history is empty.</p>
            </div>
        <div class="history_t" v-else>
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>QTY</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orderedItems" :key="order._id">
                        <td><p>{{ order.orderID }}</p></td>
                        <td>
                            <h3>{{ order.product.name }}</h3>
                        </td>
                        <td>
                            <p>{{ order.quantity }}</p>
                        </td>
                        <td>
                            <p>${{ order.totalPrice }}</p>
                        </td>
                        <td>
                            <p>{{ formatDate(order.orderDate) }}</p>
                        </td>
                        <td><p>{{ order.status }}</p></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import { API_BASE_URL } from '@/configURL/configUrl';
export default {
    data() {
        return {
            orderedItems: [],
        };
    },
    created() {
        this.fetchOrderedHistory();
    },
    methods: {
        async fetchOrderedHistory() {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`${API_BASE_URL}/orders/${userId}`);
                this.orderedItems = response.data;
            } catch (error) {
                console.error('Error fetching ordered history:', error);
            }
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        },
    },
};
</script>
<style>
 .table th{
        background-color: rgb(250, 115, 115);
    }
    .empty{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
    }
  @media (max-width: 770px) {
    .history_t{
        display: flex;
        justify-content: center;
        margin: 0;
    }
    .table th{
        background-color: rgb(250, 115, 115);
    }
  }
  
</style>