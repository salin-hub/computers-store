<template>
    <section>
      <div class="footer">
        <div class="social_bar">
          <div class="logo_shop">
            <img src="../assets/image/Logo.png" alt="">
          </div>
          <div class="social_icon">
            <ul>
              <li @click="openSocialLink('https://web.facebook.com/ITEDFERUPP')"><i class="fa-brands fa-facebook"></i></li>
              <li @click="openSocialLink('https://www.instagram.com/lim_bunhov/')"><i class="fa-brands fa-instagram"></i></li>
              <li @click="openSocialLink('https://t.me/itedfe')"><i class="fa-brands fa-telegram"></i></li>
              <li @click="openSocialLink('https://www.messenger.com/t/490038448174874')"><i class="fa-brands fa-facebook-messenger"></i></li>
            </ul>
    
          </div>
    
        </div>
        <div class="detial_us_footer">
          <div class="contact_us_footer">
            <div><span><i class="fa-solid fa-phone-volume"></i>+855 12345678</span></div>
            <div><span><i class="fa-solid fa-location-dot"></i>Phnom Penh</span></div>
            <div><span><i class="fa-regular fa-envelope"></i>item2y3@gmail.com</span></div>
          </div>
        </div>
      </div>
      </section>
    
    </template>
    <script>
    export default {
      methods: {
        openSocialLink(link) {
          window.open(link, '_blank');
        }
      }
    };
    </script>