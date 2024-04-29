<script>
import MainNavigation from '@/components/NavBar.vue';
let id = 0;
export default {
  data() {
    return {
      navHeight: 0,
      products: [{
        name: 'udeng putih',
        price: 150000,
        img: 'udeng1.jpeg'       
      },
      {
        name :'udeng hitam',
        price: 200000,
        img: 'udeng5.jpg'
      }],
    };
  },
  components: {
    Navigation: MainNavigation
  },
  methods: {
    wrap(array){
      return array.map(element => {
        return {
          ...element,
          id: id++
        }
      });
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
  <section class="hero" :style="{ '--nav-height': `${navHeight}px` }">
    <div class="container">
      <section class="py-1">
        <div class="product-head">
          <div class="text-head">Udeng</div>
        </div>
        <Slider />
      </section>
    </div>
  </section>
  <section class="products px-5">
    <div class="filter px-5 pt-4">
      <select class="form-select filter border-black" aria-label="Default select example">
        <option selected>Udeng</option>
        <option value="1">Kemeja Pria</option>
        <option value="2">Saput Songket</option>
        <option value="3">kamen Batik</option>
        <option value="4">Sandal</option>
      </select>
    </div>
    <div class="py-5 row">
      
      <!-- <div class="product col-3" v-for="product in wrap(products)" :key="product.id">
        <img :src="`@/assets/img/products/udeng/${ product.img }`" class="card-img-top" alt="..." />
        <div class="product-text text-center">
          <h4 class="my-3">{{ product.name }}</h4>
          <div class="star d-flex justify-content-center">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="price my-3 py-2 px-3 border border-3 border-black mx-auto">
            <span> Rp. {{ product.price }}</span>
          </div>
        </div>
      </div> -->
      <div class="product col-3" >
        <img src="../assets/img/products/udeng/udeng1.jpeg" class="card-img-top" alt="..." />
        <div class="product-text text-center">
          <h4 class="my-3">Udeng Putih Sutra</h4>
          <div class="star d-flex justify-content-center">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="price my-3 py-2 px-3 border border-3 border-black mx-auto">
            <span>$15.00</span>
          </div>
        </div>
      </div>
      <div class="product col-3" >
        <img src="../assets/img/products/udeng/udeng2.jpg" class="card-img-top" alt="..." />
        <div class="product-text text-center">
          <h4 class="my-3">Udeng Putih Sutra</h4>
          <div class="star d-flex justify-content-center">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="price my-3 py-2 px-3 border border-3 border-black mx-auto">
            <span>$15.00</span>
          </div>
        </div>
      </div>
      <div class="product col-3" >
        <img src="../assets/img/products/udeng/udeng3.jpeg" class="card-img-top" alt="..." />
        <div class="product-text text-center">
          <h4 class="my-3">Udeng Putih Sutra</h4>
          <div class="star d-flex justify-content-center">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="price my-3 py-2 px-3 border border-3 border-black border-black mx-auto">
            <span>$15.00</span>
          </div>
        </div>
      </div>
      <div class="product col-3" >
        <img src="../assets/img/products/udeng/udeng4.jpeg" class="card-img-top" alt="..." />
        <div class="product-text text-center">
          <h4 class="my-3">Udeng Putih Sutra</h4>
          <div class="star d-flex justify-content-center">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="price my-3 py-2 px-3 border border-3 border-black mx-auto">
            <span>$15.00</span>
          </div>
        </div>
      </div>
      <div class="product col-3" >
        <img src="../assets/img/products/udeng/udeng5.jpg" class="card-img-top" alt="..." />
        <div class="product-text text-center">
          <h4 class="my-3">Udeng Putih Sutra</h4>
          <div class="star d-flex justify-content-center">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="price my-3 py-2 px-3 border border-3 border-black mx-auto">
            <span>$15.00</span>
          </div>
        </div>
      </div>
      <div class="product col-3" >
        <img src="../assets/img/products/udeng/udeng7.jpeg" class="card-img-top" alt="..." />
        <div class="product-text text-center">
          <h4 class="my-3">Udeng Putih Sutra</h4>
          <div class="star d-flex justify-content-center">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="price my-3 py-2 px-3 border border-3 border-black mx-auto">
            <span>$15.00</span>
          </div>
        </div>
      </div>
      <div class="product col-3" >
        <img src="../assets/img/products/udeng/udeng3.jpeg" class="card-img-top" alt="..." />
        <div class="product-text text-center">
          <h4 class="my-3">Udeng Putih Sutra</h4>
          <div class="star d-flex justify-content-center">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="price my-3 py-2 px-3 border border-3 border-black mx-auto">
            <span>$15.00</span>
          </div>
        </div>
      </div>
      <div class="product col-3" >
        <img src="../assets/img/products/udeng/udeng1.jpeg" class="card-img-top" alt="..." />
        <div class="product-text text-center">
          <h4 class="my-3">Udeng Putih Sutra</h4>
          <div class="star d-flex justify-content-center">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="price my-3 py-2 px-3 border border-3 border-black mx-auto">
            <span>$15.00</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.hero {
  background-color: #fcf5ed;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(@/assets/img/products/banner.jpg);
  /* padding-top: calc(var(--nav-height) + 10px); */
}
.product-head {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-repeat: no-repeat;
  padding: 60px 0px;
  transition: all 500ms;
  background-attachment: fixed;
  margin-bottom: 30px;
}
.text-head {
  font-size: 2rem;
  font-family: 'poppins', sans-serif;
  font-weight: 600;
}

.products{
  background-color: hsl(32, 71%, 96%);
}

.filter{
  width: 150px;
}

.product{
  margin-bottom: 20px;
}

.product img{
  border-radius: 15px;
  height: 350px;
  object-fit: fill;
}

.product-text h4{
  font-family: "Poppins", serif;
  color: #000000;
  font-weight: 700;

}

.star i{
  color: #FFD600;
  font-size: 1.4rem;
  margin: 0 5px;
}

.price{
  border-radius: 15px;
  max-width: fit-content;
}

@media only screen and (min-width:1700px) {
  .product{
    width: 500px;
  }

  .product img{
    height: 600px;
  }
}

@media only screen and (max-width:1000px){
  .filter{
    width: 100%;
  }

  .product{
    width: 80%;
  }
}
</style>
