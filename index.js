import Carousel from './6-module/3-task/index.js';
import slides from './6-module/3-task/slides.js';

import RibbonMenu from './7-module/1-task/index.js';
import categories from './7-module/1-task/categories.js';

import StepSlider from './7-module/4-task/index.js';
import ProductGrid from './8-module/2-task/index.js';

import CartIcon from './8-module/1-task/index.js';
import Cart from './8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    let carousel = new Carousel(slides);
    document.body.querySelector('.container[data-carousel-holder]').append(carousel.elem);
    let ribbonMenu = new RibbonMenu(categories);
    document.body.querySelector('[data-ribbon-holder]').append(ribbonMenu.elem);
    let stepSlider = new StepSlider({steps: 5, value: 3});
    document.body.querySelector('[data-slider-holder]').append(stepSlider.elem);
    let cartIcon = new CartIcon();
    document.body.querySelector('[data-cart-icon-holder]').append(cartIcon.elem);
    let cart = new Cart(cartIcon);

    let response = await fetch('./products.json');
    let products = await response.json();
    let productGrid = new ProductGrid(products);
    document.body.querySelector('[data-products-grid-holder]').append(productGrid.elem);

    productGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: stepSlider.value,
      category: ribbonMenu.value
    });

    function find (productID){
      for (let product of products){
        if (product["id"] === productID){
          return product;
        }
      }
    }

    document.body.addEventListener('product-add', (event) => cart.addProduct(find(event.detail)));
    stepSlider.elem.addEventListener('slider-change', (event) => productGrid.updateFilter({
      maxSpiciness: event.detail
    }));
    ribbonMenu.elem.addEventListener('ribbon-select', (event) => productGrid.updateFilter({
      category: event.detail
    }));
    document.getElementById('nuts-checkbox').addEventListener('change', (event) => productGrid.updateFilter({
      noNuts: event.target.checked
    }));
    document.getElementById('vegeterian-checkbox').addEventListener('change', (event) => productGrid.updateFilter({
      vegeterianOnly: event.target.checked
    }));
  }
}
