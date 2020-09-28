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
const totalCostLabel = document.querySelector("#total-cost");
const nav = document.querySelector(".nav__links");
const burger = document.querySelector(".burger");
const navLinks = document.querySelectorAll(".nav__links a");
const countdownTimer = document.querySelector(".limited-time__time");
const addedProductsToCart = [];

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

burger.addEventListener("click", () => {
  nav.classList.toggle("nav-open");
  burger.classList.toggle("toggle");
});

navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    nav.classList.toggle("nav-open");
    burger.classList.toggle("toggle");
  });
});

// Functions

function createCartItem(productDetails) {
  const htmlString = `
  <div class="checkout-cart__product" data-producttitle="${productDetails.title}">
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
        </div>
  `;
  const htmlFragment = document
    .createRange()
    .createContextualFragment(htmlString);
  // Adding event listeners to buttons
  const addBtn = htmlFragment.querySelector(".plus");
  addBtn.addEventListener("click", addOneMoreproduct);

  const subtractBtn = htmlFragment.querySelector(".minus");
  subtractBtn.addEventListener("click", subtractOneMoreproduct);

  const deleteBtn = htmlFragment.querySelector(".delete");
  deleteBtn.addEventListener("click", deleteProduct);

  const input = htmlFragment.querySelector("#quantity");
  input.addEventListener("input", addMoreProducts);

  return htmlFragment;
}

// Add to cart
function addToCart(event) {
  if (!addedProductsToCart.includes(event.currentTarget)) {
    addedProductsToCart.push(event.currentTarget);
    const productDetails = event.currentTarget.dataset;

    const htmlFragment = createCartItem(productDetails);
    // Pushing to local storage
    const cartItems = getItemsFromLS();
    cartItems.push(event.currentTarget.dataset.title);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    cartProductWrapper.appendChild(htmlFragment);
    // Disabling the button
    const addToCartBtn = event.currentTarget;
    addToCartBtn.classList.add("already-added");
    addTotalPrice();
  } else {
    navigator.vibrate(100, 200, 300, 400, 480, 400, 300, 200, 100);
  }
}

function getCartBtnIndex(event) {
  // The title of the product
  const productTitle =
    event.currentTarget.parentElement.parentElement.dataset.producttitle;
  // Use findindex too for index
  const cartBtnIndex = addedProductsToCart.findIndex((cart) => {
    return cart.dataset.title === productTitle;
  });
  return cartBtnIndex;
}

// Delete product
function deleteProduct(event) {
  // Parent element
  const productWrapper = event.currentTarget.parentElement.parentElement;
  const cartBtnIndex = getCartBtnIndex(event);
  addedProductsToCart[cartBtnIndex].classList.remove("already-added");
  addedProductsToCart[cartBtnIndex].dataset.quantity = 1;

  // Deleting from local storage
  const cartItems = getItemsFromLS();
  const cartItemIndex = cartItems.indexOf(
    addedProductsToCart[cartBtnIndex].dataset.title
  );
  if (cartItemIndex > -1) {
    cartItems.splice(cartItemIndex, 1);
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  addedProductsToCart.splice(cartBtnIndex, 1);
  productWrapper.classList.add("delete-product-from-cart");
  productWrapper.addEventListener("transitionend", () => {
    productWrapper.remove();
  });
  // Calculating the total
  addTotalPrice();
  event.stopPropagation();
}

// Add and subtract buttons
function addOneMoreproduct(event) {
  const input = event.currentTarget.nextElementSibling;
  const newValue = 1 + parseInt(input.value);
  input.value = newValue;
  const cartBtnIndex = getCartBtnIndex(event);
  addedProductsToCart[cartBtnIndex].dataset.quantity =
    parseInt(addedProductsToCart[cartBtnIndex].dataset.quantity) + 1;
  addTotalPrice();
}

function subtractOneMoreproduct(event) {
  const input = event.currentTarget.previousElementSibling;
  const newValue = parseInt(input.value) - 1;
  if (newValue >= 1) {
    input.value = newValue;
    const cartBtnIndex = getCartBtnIndex(event);
    addedProductsToCart[cartBtnIndex].dataset.quantity =
      parseInt(addedProductsToCart[cartBtnIndex].dataset.quantity) - 1;
  }
  addTotalPrice();
}

function addMoreProducts(event) {
  const noOfProducts = parseInt(event.currentTarget.value);
  if (noOfProducts >= 1) {
    const cartBtnIndex = getCartBtnIndex(event);
    addedProductsToCart[cartBtnIndex].dataset.quantity = noOfProducts;
    addTotalPrice();
  }
}

// Add the total price

function addTotalPrice() {
  let totalPrice = 0;
  addedProductsToCart.forEach((product) => {
    totalPrice += product.dataset.price * product.dataset.quantity;
  });
  totalCostLabel.textContent = totalPrice.toFixed(2);
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

// Countdown timer
const startingMinutes = 59;
let time = startingMinutes * 60;
function countDown() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  countdownTimer.innerHTML = `${minutes}:${seconds}`;
  time--;
  time = time < 0 ? 0 : time;
}
setInterval(countDown, 1000);

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
  { rootMargin: "-175px" }
);

headerObserver.observe(mainContainer);

// Getting products from local storage
function getItemsFromLS() {
  let cartItems;
  if (localStorage.getItem("cartItems") === null) {
    cartItems = [];
  } else {
    cartItems = JSON.parse(localStorage.getItem("cartItems"));
  }
  return cartItems;
}

// Loading from local storage
function getSavedItems() {
  console.log("Working");
  const cartItems = getItemsFromLS();
  cartItems.forEach((cartItem) => {
    addProductToCartBtns.forEach((cartBtn) => {
      if (cartBtn.dataset.title === cartItem) {
        const htmlFragment = createCartItem(cartBtn.dataset);

        cartProductWrapper.appendChild(htmlFragment);
        // Disabling the button
        cartBtn.classList.add("already-added");
        addedProductsToCart.push(cartBtn);
        addTotalPrice();
      }
    });
  });
}

getSavedItems();
