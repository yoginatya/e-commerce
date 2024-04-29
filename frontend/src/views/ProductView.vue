<script>
import MainNavigation from '@/components/NavBar.vue';
let id = 0;
export default {
  data() {
    return {
      navHeight: 0,
      counter: 0
    };
  },
  components: {
    Navigation: MainNavigation
  },
  methods: {
    wrap(array) {
      return array.map((element) => {
        return {
          ...element,
          id: id++
        };
      });
    },
    increment() {
      this.counter++;
    },
    decrement(){
      this.counter = Math.max(0,this.counter - 1);
      // this.counter--;  
    }
  },

  mounted() {
    const nav = document.querySelector('.navbar');

    this.navHeight = nav.clientHeight;
  }
};
</script>
<template>
  <navigation />
  <section class="hero py-5">
    <div class="container py-5">
      <div class="container product">
        <div class="d-flex justify-content-center">
          <img src="../assets/img/products/udeng/udeng1.jpeg" class="mx-5" alt="" />
          <div class="d-flex align-items-center justify-content-evenly title py-3">
            <div class="name">
              <h2>Udeng Putih Sutra</h2>
              <div class="star d-flex my-4">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
              </div>
              <div class="price text-start my-4 py-2 px-3 border border-2 border-black">
                <span>Rp. 150.000</span>
              </div>
            </div>
            <h3>Stock : 30</h3>
          </div>
        </div>
        <div class="deskripsi py-4">
          <h3>deskripsi</h3>
          <div class="des-body">
            <h5>
              "Udeng Batik Bali dengan Motif Bunga Eksotis. Udeng ini dibuat dengan teliti
              menggunakan kain katun berkualitas tinggi
            </h5>
            .
          </div>
        </div>
        <div class="add d-flex justify-content-between">
          <div class="item-counter d-flex align-items-center border border-black border-2">
            <button @click="decrement" class="py-2 px-3" id="decrement-btn">-</button>
            <div id="counter-value" class="number py-2 px-3">{{ counter }}</div>
            <button @click="increment" class="py-2 px-3" id="increment-btn">+</button>
          </div>
          <div class="addcart">
            <div type="button" class="btn btn-outline-warning px-3">Masukan keranjang</div>
          </div>
        </div>
        <div class="review py-5">
          <h3>Review</h3>
          <div class="user">
            <div class="profile d-flex">
              <img src="..\assets\img\mengesa.jpg" alt="">
              p
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.hero {
  background-color: #fcf5ed;
  font-family: 'Poppins', serif;
}

.product {
  width: 80%;
}

.product img {
  border-radius: 20px;
  width: 400px;
  box-shadow: #000000;
}
.title h2 {
  color: #000000;
  font-weight: 700;
}

.star i {
  color: #ffd600;
  font-size: 1.4rem;
  margin: 0 5px;
}

.price {
  font-size: 1.4rem;
  border-radius: 15px;
  max-width: fit-content;
  font-family: 'Poppins', serif;
  font-weight: 500;
}

h3 {
  font-weight: 700;
}

.item-counter{
  width: fit-content; 
  border-radius: 5px;
}

.item-counter button{
  border: none;
  background-color: transparent;
}

.item-counter button:hover{
  background-color: #FFC55A;
}
</style>
