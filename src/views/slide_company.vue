<template>
  <div class="controll_slide_company">
    <div class="left" @click="scrollLeft"><i class="fa-solid fa-chevron-left"></i></div>
    <div class="controll_slide" ref="slideContainer">
      <div class="item_company" v-for="company_item in slide_company" :key="company_item.model" @click="handleClick(company_item)">
        <img :src="company_item.image" :alt="company_item.model">
      </div>
    </div>
    <div class="left" @click="scrollRight"><i class="fa-solid fa-chevron-right"></i></div>
  </div>
</template>

<script>
import image1 from "../assets/image/logodell.png"
import image2 from "../assets/image/logo_asus.jpg"
import image3 from "../assets/image/apple_logo.jpg"
import image4 from "../assets/image/hp_logo.jpg"
import image5 from "../assets/image/lenovo_logo.png"
import image6 from "../assets/image/Acer-logo.jpg"
import "../assets/home.css"

export default {
  data() {
    return {
      slide_company: [
        { image: image1, model: "Dell" },
        { image: image2, model: "Asus" },
        { image: image3, model: "Apple" },
        { image: image4, model: "HP" },
        { image: image5, model: "Lenovo" },
        { image: image6, model: "Acer" },
        { image: image7, model: "Xiaomi" },
        { image: image8, model: "MSI" },
      ],
      scrollStep: 200 // Adjust this value to control the scroll distance
    };
  },
  methods: {
    handleClick(company_item) {
      if (company_item.image) {
        this.$router.push({ 
          name: 'showmodel',
          query: { model: company_item.model } 
        });
      }
    },
    scrollLeft() {
      this.$refs.slideContainer.scrollLeft -= this.scrollStep;
    },
    scrollRight() {
      this.$refs.slideContainer.scrollLeft += this.scrollStep;
    }
  }
}
</script>

<style>
.controll_slide_company {
  height: 5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem 0 2rem ;
}

.left {
  display: none;
  display: flex;
  align-items: center;
  width: 2rem;
  justify-content: center;
}
.left i{
  visibility: hidden;
  font-size: 2rem;
}
.controll_slide {
  display: flex;
  gap: 10px;
  padding: 10px;
  overflow-x: auto; /* Changed to hidden */
}

.item_company {
  padding: 5px;
  border-radius: 10px;
  min-width: 10rem;
  height: 4rem;
  border: 1px solid black;
  transition: .1s linear;
}

.item_company img {
  border-radius: 10px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item_company:hover {
  transform: scale(1.1);
}

.controll_slide::-webkit-scrollbar {
  display: none;
}

/* Responsive CSS */
@media screen and (max-width: 768px) {
  .controll_slide {
    width: 100%;
  }

  .item_company {
    padding: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2rem;
    min-width: 5rem;
    border-radius: 2px;
  }
  .item_company img{
    border-radius: 2px;
  }
  .left i{
    visibility: visible;
  font-size: 1rem;
}
}
</style>
