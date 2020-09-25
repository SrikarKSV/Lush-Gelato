// Selectors
const addToCartBtns = document.querySelectorAll("button.add-to-cart");
const addToCartFeaturedBtns = document.querySelectorAll(
  "button.add-to-cart-featured"
);

// Event Listeners
addToCartBtns.forEach((addToCartBtn) => {
  addToCartBtn.addEventListener("mouseover", animateImg);
});

addToCartFeaturedBtns.forEach((addToCartFeaturedBtn) => {
  addToCartFeaturedBtn.addEventListener("mouseover", animateFeaturedImg);
});

// Functions

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