<!--
      Copyright (C) 2019  SuperGreenLab <towelie@supergreenlab.com>
      Author: Constantin Clauzel <constantin.clauzel@gmail.com>

      This program is free software: you can redistribute it and/or modify
      it under the terms of the GNU General Public License as published by
      the Free Software Foundation, either version 3 of the License, or
      (at your option) any later version.

      This program is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU General Public License for more details.

      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
 -->

<template>
  <section :id='$style.container'>
    <div :id='$style.header'>
      <Header />
    </div>
    <div :id='$style.body'>
      <div :id='$style.shipdisclaimer'>
        <b>NORMAL SHIPPING IS BACK!</b><br /><br />
        The loooooong wait is over! We're now shipping worlwide, 24h after you order.<br /><br />
        <h4>Thanks for your support:)</h4>
      </div>
      <div>
        <Shipping />
        <div :id='$style.buy'>
          <div :id='$style.promocode'>
            <TextInput label='Promo code' v-model='promocode' name='promocode' optional='true' />
            <a :id='$style.buybutton' :class='!valid ? $style.invalid : $style.valid' href='javascript:void(0)' @click='buy'>PAY NOW <b>{{ priceConv(totalPrice) }}</b></a>
            <div :class='$style.block'>
              <img src='~assets/img/powered-by-stripe.png' width="300"><br />
            </div>
            <!--<div :class='$style.block'>
              <img src='~assets/img/crypto.png'>
            </div>-->
            <div :class='$style.block'>
              <img src='~assets/img/paypal.png'>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <div :id='$style.loading' v-if='loading'>
      <div :id='$style.loadingcontainer'>
        <Loading label='Preparing your order, please wait' />
      </div>
    </div>
  </section>
</template>

<script>
import Header from '~/components/header.vue'
import Shipping from '~/components/shipping-form.vue'
import TextInput from '~/components/shipping-text.vue'
import Loading from '~/components/loading.vue'
import Footer from '~/components/homesection-footer.vue'
import OutOfStock from '~/components/outofstock.vue'

import priceConv from '~/lib/price.js'

export default {
  components: {Header, Shipping, TextInput, Loading, Footer, OutOfStock,},
  data() {
    return {
      loading: false,
      showPreOrderForm: false,
    }
  },
  destroyed() {
    if (this.timeout) clearTimeout(this.timeout)
  },
  computed: {
    valid() {
      return false
    },
    promocode: {
      get() {
        return this.$store.state.checkout.promocode.value
      },
      set(value) {
        this.$store.commit('checkout/updateCheckout', {key: 'promocode', value})
        this.$store.commit('checkout/setDiscount', 0)
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => this.$store.dispatch('checkout/setPromocode', { code: value }), 400)
      },
    },
    promo() {
      const discount = this.$store.state.checkout.discount.value,
            promocode = this.$store.state.checkout.promocode.value
      if (!promocode || !discount) return {promocode: '', discount: 0}
      return {promocode, discount}
    },
    cart() {
      return this.$store.state.checkout.cart
    },
    totalPrice() {
      return this.$store.getters['checkout/getTotalPrice']
    },
 },
  methods: {
    priceConv(dols) {
      return priceConv(dols)
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  width: 100%
  flex-direction: column
  justify-content: center
  align-items: center

#header
  position: fixed
  width: 100%
  top: 0 
  left: 0
  z-index: 1000

#body
  width: 100%
  max-width: 900pt
  padding: 50pt 0 0 0

#buy
  display: flex
  flex-direction: column
  align-items: flex-end
  justify-content: flex-end
  text-align: right
  margin: 40pt 50pt 20pt 0
  @media only screen and (max-width: 600px)
    margin: 30pt 10pt 20pt 0

#buybutton
  display: block
  background-color: #3BB30B
  padding: 8pt 25pt
  margin: 5pt 0 0 0
  border-radius: 5pt
  color: white
  text-decoration: none
  text-align: center
  font-weight: 500

#buybutton > b
  font-weight: 600

#promocode
  text-align: left

#preorderoverlay
  background-color: white

#loading
  display: flex
  align-items: center
  justify-content: center
  position: fixed
  width: 100vw
  height: 100vh
  top: 0
  left: 0
  background-color: rgba(255, 255, 255, 0.6)
  z-index: 1000

#loadingcontainer
  position: relative
  width: 200pt
  height: 100pt

.invalid
  opacity: 0.6
  cursor: default !important

.valid:hover
  background-color: #2F880B

.block
  display: flex

.blockicon
  width: 20pt
  height: 20pt
  margin: 5pt

#shipdisclaimer
  background-color: #f2f2f2
  padding: 20pt 15pt
  color: #717171
  font-size: 1.2em
  text-align: center

#shipdisclaimer > b
  color: #3BB30B

#shipdisclaimer > h4
  text-align: center;

#shipdisclaimer > a
  color: #717171

#shipdisclaimer > a:hover
  color: #3BB30B

</style>