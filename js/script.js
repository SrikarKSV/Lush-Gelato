// Selectors
const addToCartBtns = document.querySelectorAll("button.add-to-cart");
const addToCartFeaturedBtns = document.querySelectorAll(
  "button.add-to-cart-featured"
);
const header = document.querySelector("header");
const mainContainer = document.querySelector("#hero-text");
const openCartBtn = document.querySelector(".nav__item--cart");
const checkoutWrapper = document.querySelector(".checkout-cart-wrapper");
const cartProductWrapper = document.querySelector(".cart-products-wrapper");
const closeCartBtn = document.querySelector(".close-cart");
const addProductToCartBtns = document.querySelectorAll(".cartBtn");

// Event Listeners
addToCartBtns.forEach((addToCartBtn) => {
  addToCartBtn.addEventListener("mouseover", animateImg);
});

addToCartFeaturedBtns.forEach((addToCartFeaturedBtn) => {
  addToCartFeaturedBtn.addEventListener("mouseover", animateFeaturedImg);
});

openCartBtn.addEventListener("click", toggleCheckOut);
closeCartBtn.addEventListener("click", unToggleCheckOut);
checkoutWrapper.addEventListener("click", unToggleCheckOutOutisdeModal);
window.addEventListener("keydown", unToggleCheckOutEscape);

addProductToCartBtns.forEach((addProductToCartBtn) => {
  addProductToCartBtn.addEventListener("click", addToCart);
});

// Functions

// Add to cart
function addToCart(event) {
  productDetails = event.currentTarget.dataset;
  htmlString = `
        <img src="${productDetails.img}" alt="Mango Zap" class="checkout-cart__img">
        <div class="checkout-cart__product-details">
            <h4 class="special-flavours__product-name">${productDetails.title}</h4>
            <p class="special-flavours__product-price">$${productDetails.price}</p>
            <br>
            <button class="plus"><i class="fas fa-plus"></i></button>
            <input type="number" name="quantity" min="1" id="quantity" value="1">
            <button class="minus"><i class="fas fa-minus"></i></button><br>
            <button class="delete">Delete</button>
        </div>
  `;
  const div = document.createElement("div");
  div.classList.add("checkout-cart__product");
  div.innerHTML = htmlString;
  cartProductWrapper.appendChild(div);
}

// Toggle checkout cart
function toggleCheckOut() {
  checkoutWrapper.classList.add("checkout-cart-wrapper-open");
}

function unToggleCheckOut() {
  checkoutWrapper.classList.remove("checkout-cart-wrapper-open");
}

function unToggleCheckOutOutisdeModal(event) {
  const isOutside = !event.target.closest(".checkout-cart");
  if (isOutside) {
    unToggleCheckOut();
  }
}

function unToggleCheckOutEscape(event) {
  if (event.key === "Escape") {
    unToggleCheckOut();
  }
}

// Animate the images on hover
// The add to cart button is under an extra div
function animateImg(e) {
  const parent = e.currentTarget.parentElement.parentElement;
  animateImage(parent, "animate-img");
}

function animateFeaturedImg(e) {
  const parent = e.currentTarget.parentElement;
  animateImage(parent, "animate-featured-img");
}

function animateImage(parent, keyframeName) {
  const img = parent.querySelector("img");
  img.classList.add(keyframeName);
  img.addEventListener("animationend", () => {
    img.classList.remove(keyframeName);
  });
}

// Header scroll navbar

const headerObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        header.classList.add("nav-scrolled");
      } else {
        header.classList.remove("nav-scrolled");
      }
    });
  },
  { rootMargin: "-360px" }
);

headerObserver.observe(mainContainer);
