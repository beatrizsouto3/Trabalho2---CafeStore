//valor em real
const formatCurrency = (val) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    val
  );

function showToast(msg) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(container);
  }

  const el = document.createElement("div");
  el.className = "toast align-items-center text-white bg-success border-0";
  el.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi bi-check-circle-fill me-2"></i> ${msg}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;

  container.appendChild(el);
  const toast = new bootstrap.Toast(el, { delay: 3000 });
  toast.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}

let checkoutData = { fullName: "", address: "", complement: "", cep: "" };

document.addEventListener("DOMContentLoaded", () => navigateTo("home"));

//roteamento princiapl
function navigateTo(page) {
  const root = document.getElementById("root");
  if (!root) return;

  //renderiza pagina
  root.innerHTML = "";
  root.appendChild(createHeader());

  switch (page) {
    case "home":
      renderHomePage(root);
      break;
    case "cart":
      renderCartPage(root);
      break;
    case "checkout":
      checkoutData = { fullName: "", address: "", complement: "", cep: "" };
      renderCheckoutStep1(root);
      break;
    case "payment":
      renderCheckoutStep2(root);
      break;
    case "success":
      renderSuccessPage(root);
      break;
  }

  //footer nas paginas
  const footer = createFooter();
  root.appendChild(footer);
}

//acessar dados do carrinho
const getCart = () => JSON.parse(localStorage.getItem("coffeeCart")) || [];
const saveCart = (cart) =>
  localStorage.setItem("coffeeCart", JSON.stringify(cart));

function addToCart(product) {
  const cart = getCart();
  const item = cart.find((i) => i.id === product.id);
  item ? item.quantity++ : cart.push({ ...product, quantity: 1 });

  saveCart(cart);
  updateCartBadge();
  showToast(`${product.title} adicionado!`);
}

//atualiza qntd itns carrinho
function updateCartQuantity(id, change) {
  let cart = getCart();
  const item = cart.find((i) => i.id == id);
  if (!item) return;

  item.quantity += change;
  //qntd itens = 0 (remove)
  if (item.quantity <= 0) cart = cart.filter((i) => i.id != id);

  saveCart(cart);
  navigateTo("cart");
}

//remove produto
function removeProduct(id) {
  const cart = getCart().filter((i) => i.id != id);
  saveCart(cart);
  navigateTo("cart");
}

//calcula total da compra
const getCartTotal = () =>
  getCart().reduce((acc, item) => acc + item.price * item.quantity, 0);

function clearCart() {
  localStorage.removeItem("coffeeCart");
  updateCartBadge();
}

function updateCartBadge() {
  const count = getCart().reduce((acc, item) => acc + item.quantity, 0);
  setTimeout(() => {
    const badge = document.querySelector(".navbar .badge");
    if (badge) badge.textContent = count;
  }, 0);
}

//renderiza header
function createHeader() {
  const header = document.createElement("header");
  header.className =
    "navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top";

  const container = document.createElement("div");
  container.className = "container";

  const brand = document.createElement("a");
  brand.className = "navbar-brand mx-auto";
  brand.href = "#";
  brand.style.fontFamily = "'Saint Carell', serif";
  brand.style.fontSize = "3.5rem";
  brand.innerHTML = `<span class="text-cafe">Café</span><span class="text-store">Stores</span>`;
  brand.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("home");
  });

  const nav = document.createElement("nav");
  nav.className = "ms-auto";
  const cartLink = document.createElement("a");
  cartLink.className = "btn btn-store";
  cartLink.href = "#";
  cartLink.innerHTML = `<i class="bi bi-cart-fill"></i> Carrinho <span class="badge ms-1" style="background-color: #A0522D;">0</span>`;
  cartLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("cart");
  });
  nav.appendChild(cartLink);

  //modo escuro
  const themeBtn = document.createElement("button");
  themeBtn.id = "theme-toggle-btn";
  themeBtn.className = "btn btn-light btn-sm ms-2 border";
  themeBtn.onclick = toggleTheme;

  const isDark = document.body.classList.contains("dark-mode");
  themeBtn.innerHTML = isDark
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-fill"></i>';

  nav.appendChild(cartLink);
  nav.appendChild(themeBtn);

  //mobile
  const toggler = document.createElement("button");
  toggler.className = "navbar-toggler";
  toggler.setAttribute("data-bs-toggle", "collapse");
  toggler.setAttribute("data-bs-target", "#navbarMain");
  toggler.innerHTML = `<span class="navbar-toggler-icon"></span>`;

  const collapseDiv = document.createElement("div");
  collapseDiv.className = "collapse navbar-collapse";
  collapseDiv.id = "navbarMain";

  container.append(toggler, brand, collapseDiv, nav);
  header.appendChild(container);

  updateCartBadge();
  return header;
}

//rodapé
function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "bg-white border-top py-4 mt-5";

  const container = document.createElement("div");
  container.className = "container text-center";

  const year = new Date().getFullYear();

  container.innerHTML = `
    <p class="mb-1 text-muted small">
      &copy; ${year} <span style="font-family: 'Ameria', serif;">- Café Stores</span>.
    </p>
    <p class="mb-0">
      Desenvolvido por <strong class="text-cafe">Beatriz Souto</strong> | 
      <a href="https://github.com/beatrizsouto3" target="_blank" class="text-decoration-none fw-bold text-store">
        <i class="bi bi-github"></i> GitHub
      </a>
    </p>
  `;

  footer.appendChild(container);
  return footer;
}

//lista produtos API
async function renderHomePage(root) {
  const container = document.createElement("div");
  container.className = "container mt-4";

  container.innerHTML = `
    <h2 class="mb-4 text-cafe">✹ Nossos Cafés ✹</h2>
    <div id="product-list" class="row">
      <div class="text-center py-5 w-100">
        <div class="spinner-border text-store" role="status"></div>
        <p class="mt-2 text-muted">Carregando...</p>
      </div>
    </div>
  `;
  root.appendChild(container);

  try {
    //busca produtos da API
    const products = await fetchProducts();
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    //cria card ddo produto
    products.forEach((p) => list.appendChild(createProductCard(p)));
  } catch (e) {
    document.getElementById("product-list").innerHTML =
      '<p class="text-danger text-center w-100">Erro ao carregar API.</p>';
  }
}

//carrinho
function renderCartPage(root) {
  const container = document.createElement("div");
  container.className = "container mt-4";

  const cart = getCart();

  //carrinho vazio
  if (!cart.length) {
    container.innerHTML =
      '<h2 class="mb-4">Carrinho</h2><p class="alert alert-info">Seu carrinho está vazio.</p>';
    root.appendChild(container);
    return;
  }

  //tabela de itens - carrinho
  let html = `
    <h2 class="mb-4">Seu Carrinho de Compras</h2>
    <table class="table align-middle">
      <thead><tr><th style="width:15%">Produto</th><th style="width:40%"></th><th>Preço</th><th>Qtd.</th><th>Subtotal</th></tr></thead>
      <tbody>
  `;

  cart.forEach((item) => {
    html += `
      <tr>
        <td><img src="${
          item.image
        }" class="img-fluid rounded" style="width:80px;height:80px;object-fit:cover;"></td>
        <td><h5 class="mb-0">${
          item.title
        }</h5><button class="btn btn-link btn-sm text-danger p-0 btn-remove-product" data-id="${
      item.id
    }">Remover</button></td>
        <td>${formatCurrency(item.price)}</td>
        <td>
          <div class="d-flex align-items-center">
            <button class="btn btn-outline-secondary btn-sm btn-remove-one" data-id="${
              item.id
            }">-</button>
            <span class="mx-2">${item.quantity}</span>
            <button class="btn btn-outline-secondary btn-sm btn-add-one" data-id="${
              item.id
            }">+</button>
          </div>
        </td>
        <td><strong>${formatCurrency(item.price * item.quantity)}</strong></td>
      </tr>
    `;
  });

  html += `</tbody></table>
    <div class="mt-4 text-end">
      <h3>Total: <strong class="text-success">${formatCurrency(
        getCartTotal()
      )}</strong></h3>
      <button id="checkout-btn" class="btn btn-store btn-lg mt-2">Finalizar Compra</button>
    </div>`;

  container.innerHTML = html;
  root.appendChild(container);
  document
    .getElementById("checkout-btn")
    .addEventListener("click", () => navigateTo("checkout"));
}

//informações de entrega
function renderCheckoutStep1(root) {
  const container = document.createElement("div");
  container.className = "container mt-5";
  container.innerHTML = `
    <div class="row g-5"><div class="col-md-8 mx-auto"><div class="card p-4 shadow-sm">
      <h4 class="mb-3 text-cafe">1. Informações de Entrega</h4>
      <form id="address-form" class="needs-validation" novalidate>
        <div class="row g-3">
          <div class="col-12"><label class="form-label">Nome Completo</label><input type="text" id="fullname" class="form-control" required></div>
          <div class="col-md-5"><label class="form-label">CEP</label><input type="text" id="cep" class="form-control" required></div>
          <div class="col-12"><label class="form-label">Endereço</label><input type="text" id="address" class="form-control" required></div>
          <div class="col-12"><label class="form-label">Complemento</label><input type="text" id="complement" class="form-control"></div>
        </div>
        <hr class="my-4">
        <button class="w-100 btn btn-store btn-lg" type="submit">Ir para Pagamento</button>
      </form>
    </div></div></div>
  `;
  root.appendChild(container);

  const form = document.getElementById("address-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
    } else {
      //salva dados
      checkoutData = {
        fullName: document.getElementById("fullname").value,
        cep: document.getElementById("cep").value,
        address: document.getElementById("address").value,
        complement: document.getElementById("complement").value,
      };
      navigateTo("payment");
    }
  });
}

//pagamento
function renderCheckoutStep2(root) {
  const total = getCartTotal();
  const container = document.createElement("div");
  container.className = "container mt-5";

  container.innerHTML = `
    <div class="row g-5">
      <div class="col-md-7">
        <h4 class="mb-3 text-cafe">2. Forma de Pagamento</h4>
        <div class="alert alert-light border shadow-sm mb-4">
          <h6 class="text-store fw-bold">Entrega para:</h6>
          <p class="mb-0 text-muted">${checkoutData.fullName}<br>${
    checkoutData.address
  } - CEP: ${checkoutData.cep}</p>
        </div>
        <div class="card p-4 shadow-sm">
          <h5 class="mb-3">Escolha como pagar:</h5>
          
          <div class="form-check mb-2">
            <input id="pix" name="paymentMethod" type="radio" class="form-check-input" checked>
            <label class="fw-bold" for="pix">
              <i class="bi bi-qr-code me-2 text-store"></i> PIX
            </label>
          </div>

          <div class="form-check mb-2">
            <input id="credit" name="paymentMethod" type="radio" class="form-check-input">
            <label class="fw-bold" for="credit">
              <i class="bi bi-credit-card-fill me-2 text-store"></i> Cartão
            </label>
          </div>

          <div class="form-check mb-4">
            <input id="boleto" name="paymentMethod" type="radio" class="form-check-input">
            <label class="fw-bold" for="boleto">
              <i class="bi bi-upc-scan me-2 text-store"></i> Boleto
            </label>
          </div>

          <hr>
          <div id="payment-details"></div>
        </div>
      </div>
      <div class="col-md-5">
        <h4 class="d-flex justify-content-between align-items-center mb-3"><span class="text-store">Resumo</span><span class="badge bg-success rounded-pill">${
          getCart().length
        }</span></h4>
        <ul id="order-summary" class="list-group mb-3 shadow-sm"></ul>
      </div>
    </div>
  `;
  root.appendChild(container);

  renderOrderSummary();

  const updatePayment = () => {
    const method = document.querySelector(
      'input[name="paymentMethod"]:checked'
    ).id;
    const area = document.getElementById("payment-details");
    area.innerHTML = "";

    if (method === "pix") {
      area.innerHTML = `
    <div class="text-center">
      <p>Pague <strong>${formatCurrency(total)}</strong> via QR Code:</p>
      
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126360014BR.GOV.BCB.PIX0114%2B55849942433205204000053039865802BR5923Ana%20Beatriz%20Souto%20Silva6009SAO%20PAULO62140510itZzyQWEcU630492FD" 
           class="img-fluid mb-3" style="max-width:150px" alt="QR Code Pix">
      
      <div class="mb-3">
        <small class="text-muted">Ou copie o código:</small>
        <div class="input-group mt-1">
          <input type="text" class="form-control form-control-sm" value="00020126360014BR.GOV.BCB.PIX0114+55849942433205204000053039865802BR5923Ana Beatriz Souto Silva6009SAO PAULO62140510itZzyQWEcU630492FD" readonly>
          <button class="btn btn-outline-secondary btn-sm" onclick="navigator.clipboard.writeText(this.previousElementSibling.value); showToast('Código copiado!')">Copiar</button>
        </div>
      </div>

      <button class="btn btn-store w-100 btn-lg" onclick="finishOrder()">Confirmar PIX</button>
    </div>`;
    } else if (method === "credit") {
      area.innerHTML = `
        <form onsubmit="event.preventDefault(); finishOrder();">
          <div class="mb-3"><label>Número</label><input class="form-control" required></div>
          <div class="row mb-3"><div class="col-6"><label>Validade</label><input class="form-control" required></div><div class="col-6"><label>CVV</label><input class="form-control" required></div></div>
          <button class="btn btn-store w-100 btn-lg">Pagar Cartão</button>
        </form>`;
    } else {
      area.innerHTML = `
        <form onsubmit="event.preventDefault(); finishOrder();">
          <div class="mb-3"><label>Pagador</label><input class="form-control" value="${checkoutData.fullName}" readonly></div>
          <div class="mb-3"><label>CPF/CNPJ</label><input class="form-control" required></div>
          <button class="btn btn-store w-100 btn-lg">Gerar Boleto</button>
        </form>`;
    }
  };

  document
    .querySelectorAll('input[name="paymentMethod"]')
    .forEach((r) => r.addEventListener("change", updatePayment));
  updatePayment();
}
//finaliza pedido
window.finishOrder = () => {
  clearCart();
  navigateTo("success");
};

//pagamento efetuado
function renderSuccessPage(root) {
  const container = document.createElement("div");
  container.className = "container text-center mt-5 animate-fade-in";
  container.innerHTML = `
    <div class="card p-5 shadow border-0 mx-auto" style="max-width: 600px;">
      <div class="mb-4"><i class="bi bi-check-circle-fill text-store" style="font-size: 6rem;"></i></div>
      <h1 class="fw-bold text-cafe">Pagamento Confirmado!</h1>
      <p class="text-muted mt-3">Obrigado, <strong>${checkoutData.fullName}</strong>!<br>Seu pedido está sendo preparado.</p>
      <button id="back-home" class="btn btn-store btn-lg mt-4 px-5">Voltar para a Loja</button>
    </div>
  `;
  root.appendChild(container);
  document
    .getElementById("back-home")
    .addEventListener("click", () => navigateTo("home"));
}

//API
async function fetchProducts() {
  const res = await fetch("http://localhost:3000/coffee");
  if (!res.ok) throw new Error(res.status);
  return await res.json();
}

//cria card do produto
function createProductCard(p) {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4 mb-4";
  col.innerHTML = `
    <div class="card h-100 product-card-hover">
      <img src="${
        p.image
      }" class="card-img-top" style="height:250px;object-fit:cover">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${p.title}</h5>
        <p class="card-text small">${p.description}</p>
        <p class="card-text small"><strong>Ing.:</strong> ${p.ingredients.join(
          ", "
        )}</p>
        <p class="card-text fw-bold fs-5">${formatCurrency(p.price)}</p>
        <button class="btn btn-store mt-auto add-btn">Adicionar</button>
      </div>
    </div>
  `;
  col.querySelector(".add-btn").addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(p);
  });
  return col;
}

function renderOrderSummary() {
  const list = document.getElementById("order-summary");
  if (!list) return;
  list.innerHTML =
    getCart()
      .map(
        (i) => `
    <li class="list-group-item d-flex justify-content-between lh-sm">
      <div><h6 class="my-0">${i.title}</h6><small class="text-muted">Qtd: ${
          i.quantity
        }</small></div>
      <span class="text-muted">${formatCurrency(i.price * i.quantity)}</span>
    </li>
  `
      )
      .join("") +
    `<li class="list-group-item d-flex justify-content-between bg-light"><span class="fw-bold">Total</span><strong class="text-success">${formatCurrency(
      getCartTotal()
    )}</strong></li>`;
}

//lógica adicionar, retirar e remover item
document.addEventListener("click", (e) => {
  const btnAdd = e.target.closest(".btn-add-one");
  const btnRem = e.target.closest(".btn-remove-one");
  const btnTrash = e.target.closest(".btn-remove-product");

  if (btnAdd) updateCartQuantity(parseInt(btnAdd.dataset.id), 1);
  if (btnRem) updateCartQuantity(parseInt(btnRem.dataset.id), -1);
  if (btnTrash && confirm("Remover item?"))
    removeProduct(parseInt(btnTrash.dataset.id));
});

//lógica modo escuro
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-mode");

  localStorage.setItem("theme", isDark ? "dark" : "light");

  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById("theme-toggle-btn");
  if (!btn) return;

  const isDark = document.body.classList.contains("dark-mode");
  btn.innerHTML = isDark
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-fill"></i>';
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
});
