let product = "Socks"
let eventBus = new Vue();

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: [String, Number],
            required: false
        },
        details: {
            type: Array,
            required: false
        }
    },
    template: `
    <div>
      <ul>
        <span class="tab"
              v-for="(tab, index) in tabs"
              :key="index"
              :class="{ activeTab: selectedTab === tab }"
              @click="selectedTab = tab">
          {{ tab }}
        </span>
      </ul>

      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
            <p>Recommendation: {{ review.recommendation }}</p>
          </li>
        </ul>
      </div>

      <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
      </div>

      <div v-show="selectedTab === 'Shipping'">
        <p>Shipping Cost: {{ shipping }}</p>
      </div>

      <div v-show="selectedTab === 'Details'">
        <product-details :details="details"></product-details>
      </div>
    </div>
  `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    }
});

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
      <div class="product-image">
        <img :src="image" :alt="altText" />
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <a :href="link">More products like this</a> 
        <p>{{ sale }}</p>
        <p v-if="inStock">In Stock</p>
        <p v-else :class="{ 'out-of-stock': !inStock }">Out of Stock</p>
        <span v-if="onSale">On Sale</span>
        <p>{{ description }}</p>
        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>
        <div
          class="color-box"
          v-for="(variant, index) in variants"
          :key="variant.variantId"
          :style="{ backgroundColor: variant.variantColor }"
          @mouseover="updateProduct(index)">
        </div>

        <button
          v-on:click="addToCart"
          :disabled="!inStock"
          :class="{ disabledButton: !inStock }">
          Add to cart
        </button> <br>
         <button v-on:click="removeFromCart">
            Remove from cart
         </button>
      </div>
      <product-tabs
        :reviews="reviews"
        :shipping="shipping"
        :details="details">
      </product-tabs>
    </div>
  `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            selectedVariant: 0,
            altText: "A pair of socks",
            description: "A pair of warm, fuzzy socks.",
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            onSale: true,
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99;
            }
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!';
            } else {
                return this.brand + ' ' + this.product + ' are not on sale.';
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    }
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div class="product-details">
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
    </div>
  `
});

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <label>Would you recommend this product?</label>
        <label>
          <input type="radio" v-model="recommendation" value="yes"> Yes
        </label>
        <label>
          <input type="radio" v-model="recommendation" value="no"> No
        </label>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null, // Практическая работа №10
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            // Проверка заполненности полей (включая recommendation)
            if (this.name && this.review && this.rating && this.recommendation) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation // Практическая работа №10
                };
                // Отправка события через шину событий (Урок 12)
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommendation = null;
            } else {
                if (!this.name) this.errors.push("Name required.");
                if (!this.review) this.errors.push("Review required.");
                if (!this.rating) this.errors.push("Rating required.");
                if (!this.recommendation) this.errors.push("Recommendation required."); // Практическая работа №10
            }
        }
    }
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id) {
            this.cart.splice(this.cart.indexOf(itemId => itemId === id), 1);
        }
    }
});