//pega o carrinho no localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("coffeeCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("coffeeCart", JSON.stringify(cart));
}

//adiciona produto
function addToCart(product) {
  let cart = getCart();

  //procura item existente
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartBadge();
}

//icone carrihno
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const cartBadge = document.querySelector(".badge.bg-danger");
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }
}

//atualizar contador
document.addEventListener("DOMContentLoaded", updateCartBadge);

//remover uma unidade de item
function removeOneFromCart(productId) {
  let cart = getCart();

  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity -= 1; // Diminui a quantidade
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }

    saveCart(cart);
    updateCartBadge();
  }
}

//remover um item
function removeProductFromCart(productId) {
  let cart = getCart();

  cart = cart.filter((item) => item.id !== productId);

  saveCart(cart);
  updateCartBadge();
}

//calcular total
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

//limpar carrinho
function clearCart() {
  localStorage.removeItem("coffeeCart");
  updateCartBadge();
}
