document.addEventListener("DOMContentLoaded", renderCheckoutPage);

function renderCheckoutPage() {
  const root = document.getElementById("root");
  if (!root) return;
  const header = createHeader();
  updateCartBadge();

  const container = document.createElement("div");
  container.className = "container mt-5";
  container.innerHTML = `
    <div class="row g-5">
      <div class="col-md-7 col-lg-8">
        <h4 class="mb-3">Informações de Entrega</h4>
        
        <form id="checkout-form" class="needs-validation" novalidate>
          <div class="mb-3">
            <label for="address" class="form-label">Endereço</label>
            <input type="text" class="form-control" id="address" placeholder="Rua, número e bairro" required>
            <div class="invalid-feedback">
              Por favor, insira seu endereço de entrega.
            </div>
          </div>

          <hr class="my-4">

          <h4 class="mb-3">Pagamento</h4>

          <div class="my-3">
            <div class="form-check">
              <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked required>
              <label class="form-check-label" for="credit">Cartão de Crédito</label>
            </div>
            <div class="form-check">
              <input id="pix" name="paymentMethod" type="radio" class="form-check-input" required>
              <label class="form-check-label" for="pix">PIX</label>
            </div>
            <div class="form-check">
              <input id="boleto" name="paymentMethod" type="radio" class="form-check-input" required>
              <label class="form-check-label" for="boleto">Boleto</label>
            </div>
          </div>

          <hr class="my-4">

          <button class="w-100 btn btn-success btn-lg" type="submit">
            Finalizar Compra
          </button>
        </form>
      </div>

      <div class="col-md-5 col-lg-4">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Seu Pedido</span>
          <span class="badge bg-primary rounded-pill">0</span> </h4>
        
        <ul id="order-summary-list" class="list-group mb-3">
          </ul>

      </div>
    </div>
  `;

  root.appendChild(container);

  renderOrderSummary();

  setupFormValidation();
}

function renderOrderSummary() {
  const list = document.getElementById("order-summary-list");
  const counterBadge = document.querySelector(".col-md-5 .badge");
  if (!list || !counterBadge) return;

  const cart = getCart();
  const total = getCartTotal();
  list.innerHTML = "";

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between lh-sm";
    li.innerHTML = `
      <div>
        <h6 class="my-0">${item.title}</h6>
        <small class="text-muted">Qtd: ${item.quantity}</small>
      </div>
      <span class="text-muted">R$ ${(item.price * item.quantity)
        .toFixed(2)
        .replace(".", ",")}</span>
    `;
    list.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.className = "list-group-item d-flex justify-content-between";
  totalLi.innerHTML = `
    <span>Total (BRL)</span>
    <strong>R$ ${total.toFixed(2).replace(".", ",")}</strong>
  `;
  list.appendChild(totalLi);

  counterBadge.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

function setupFormValidation() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
    } else {
      clearCart();

      const root = document.getElementById("root");
      root.innerHTML = `
        <div class="container text-center mt-5">
          <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
          <h1 class="display-4 mt-3">Compra Confirmada!</h1>
          <p class="lead">Obrigado por comprar conosco. Seu pedido foi recebido.</p>
          <a href="index.html" class="btn btn-primary btn-lg mt-3">
            Voltar ao Início
          </a>
        </div>
      `;
    }
  });
}
