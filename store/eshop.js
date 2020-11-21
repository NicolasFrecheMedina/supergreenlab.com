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

import { products } from '~/config/products.json'

export const state = () => ({
  products,
})

const productsWithType = (state, type) => state.products.filter(p => p.type.indexOf(type) !== -1)

export const getters = {
  bundles: state => {
    return productsWithType(state, 'SGL_BUNDLE')
  },
  leds: state => {
    return productsWithType(state, 'SGL_LED')
  },
  accessories: state => {
    return productsWithType(state, 'SGL_ACCESSORIES')
  },
  productWithSlug: state => slug => state.products.find(p => p.slug == slug),
  productsWithType: state => type => productsWithType(state, type)
}