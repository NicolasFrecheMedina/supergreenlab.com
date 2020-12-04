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

import { products, sellingPoints, sellers, brandProducts, brands, regions } from '~/config/products.json'

export const state = () => {
  let defaults = {
    region: regions[0],
    regions,
    products,
    sellingPoints,
    sellers,
    brandProducts,
    brands
  }
  const saved = window.localStorage.getItem('eshop')
  if (saved) {
    defaults = Object.assign({}, defaults, saved)
  }
  return defaults
}

const storeState = (state) => {
  window.localStorage.setItem('eshop', JSON.stringify(state))
}

//const arrayContained = (a1, a2) => a1.every(a => a2.indexOf(a) !== -1)
const arrayContained = (a1, a2) => a1.findIndex(a => a2.indexOf(a) !== -1) !== -1
const productsWithTypes = (state, types) => state.products.filter(p => arrayContained(Array.isArray(types) ? types : [types], p.type))

export const mutations = {
  setRegion(state, region) {
    state.region = region
    storeState(state)
  },
}

const findSellingPoint = (region, sellingPoints) => {
  let sellingPoint = sellingPoints.find(sp => sp.regions.indexOf(region.id) != -1)
  if (!sellingPoint && region.in) {
    return findSellingPoint(state.regions.find(r => r.id == region.in[0]))
  } else if (!sellingPoint) {
    return sellingPoints[0]
  }
  return sellingPoint
}

export const getters = {
  bundles: state => {
    return productsWithTypes(state, 'SGL_BUNDLE')
  },
  leds: state => {
    return productsWithTypes(state, 'SGL_LED')
  },
  accessories: state => {
    return productsWithTypes(state, 'SGL_ACCESSORIES')
  },
  sellingPointWithSlug: state => slug => state.sellingPoints.find(sp => sp.slug == slug),
  productWithSlug: state => slug => state.products.find(p => p.slug == slug),
  productsWithTypes: state => types => productsWithTypes(state, types),

  product: state => id => state.products.find(p => p.id == id),
  brandProduct: state => id => state.brandProducts.find(bp => bp.id == id),
  brand: state => id => state.brands.find(b => b.id == id),
  seller: state => id => state.sellers.find(s => s.id == id),
  variants: state => id => {
    let brandProduct = state.brandProducts.find(bp => bp.id == id)
    if (brandProduct.variantOf) {
      brandProduct = state.brandProducts.find(bp => bp.id == brandProduct.variantOf[0])
    }
    return [brandProduct].concat(state.brandProducts.filter(bp => bp.variantOf && bp.variantOf[0] == brandProduct.id))
  },

  sellingPoint: state => sellingPoints => {
    let { region } = state
    return findSellingPoint(region, sellingPoints)
  },
  sellingPointForBrandProduct: (state, getters) => id => findSellingPoint(state.regions, state.sellingPoints.filter(sp => sp.BrandProduct[0] == id)),
  sellingPointForProduct: (state, getters) => id => findSellingPoint(state.regions, state.sellingPoints.filter(sp => sp.Product[0] == id)),
}
