/*
 * Copyright (C) 2019  SuperGreenLab <towelie@supergreenlab.com>
 * Author: Constantin Clauzel <constantin.clauzel@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Vue from 'vue'

// return this.bundle.canorder && Object.keys(this.$store.state.checkout).findIndex((k) => typeof this.$store.state.checkout[k].value !== 'undefined' && !this.$store.state.checkout[k].value && !this.$store.state.checkout[k].optional) == -1

export const state = () => {
  let defaults = {
    cart: [],
    promocode: {value: '', valid: true, optional: true,},
    discount: {value: 0, valid: true, optional: true},
  };
  if (window.localStorage.getItem('checkout')) {
    defaults = Object.assign(defaults, JSON.parse(window.localStorage.getItem('checkout')))
  }
  return defaults
};

const storeState = (state) => {
  window.localStorage.setItem('checkout', JSON.stringify(state))
}

export const actions = {
  async setPromocode(context, {code}) {
    try {
      if (cancel) {
        cancel()
        cancel = null
      }
      const { data: discount } = await axios.get(`https://shopapi.supergreenlab.com/discount?code=${code}`, {
        cancelToken: new CancelToken((c) => {
          cancel = c
        })
      })
      cancel = null
      context.commit('setPromocode', code)
      context.commit('setDiscount', discount.discount)
    } catch(e) {
      context.commit('setDiscount', 0)
    }
  },
}

export const mutations = {
  addToCart(state, { n, product, sellingPoint }) {
    const i = state.cart.findIndex(i => i.sellingPoint.id == sellingPoint.id)
    if (n <= 0 && i !== -1) {
      state.cart.splice(i, 1)
    } else if (i == -1) {
      state.cart.push({ n, product, sellingPoint })
    } else {
      Vue.set(state.cart, i, Object.assign({}, state.cart[i], { n } ))
    }
    storeState(state)
  },
  setCart(state, lineItems) {
    state.cart = [lineItems]
    storeState(state)
  },
  setPromocode(state, promocode) {
    state.promocode.value = promocode
    storeState(state)
  },
  setDiscount(state, discount) {
    state.discount.value = discount
    storeState(state)
  },
}

export const getters = {
  getTotalPrice: (state) => state.cart.reduce((t, lineItem) => t + lineItem.sellingPoint.price, 0)
}
