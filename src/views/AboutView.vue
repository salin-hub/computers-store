<template>
  <div>
    <h2>About Us</h2>

    <p>
      Welcome to our Computer Store Management System. We are dedicated to providing quality products and services to our
      customers.
      Whether you're a tech enthusiast, a gamer, or a professional, we have the right solutions for you.
    </p>

    <h3>Our Mission</h3>
    <p>
      Our mission is to offer a wide range of high-quality computer products, from laptops and desktops to accessories and
      peripherals.
      We strive to create an excellent shopping experience for our customers and provide top-notch customer support.
    </p>

    <h3>Our Team</h3>
    <p>
      Meet our passionate and knowledgeable team of experts who are here to assist you with any inquiries and ensure you
      find the
      perfect products for your needs.
    </p>

    <h3>Contact Information</h3>
    <p>
      If you have any questions or feedback, feel free to reach out to us:
    </p>
    <ul>
      <li>Email : item2y3@gmail.com</li>
      <li>Phone : +855 12345678</li>
      <li>Address : Phnom Penh</li>
    </ul>
  </div>
  <div>
    <slidecompany/>
  </div>
</template>

<script>
import slidecompany from './slide_company.vue';
export default {
  components:{
    slidecompany
  }
  // Add any necessary logic or data properties here
};
</script>

<style scoped>
/* Add your custom styling for the About Us page here */

/* Page layout */
div {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2,
h3 {
  color: #333;
}

p {
  color: #555;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 8px;
}</style>
