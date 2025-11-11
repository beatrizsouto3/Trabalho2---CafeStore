document.addEventListener("DOMContentLoaded", renderCartPage);

function renderCartPage() {
  const root = document.getElementById("root");
  if (!root) return;

  if (typeof createHeader === "function") {
    const header = createHeader();
    root.appendChild(header);
    updateCartBadge();
  }

  const container = document.createElement("div");
  container.className = "container mt-4";

  const title = document.createElement("h2");
  title.className = "mb-4";
  title.textContent = "Seu Carrinho de Compras";
  container.appendChild(title);

  //rederiza itens do carrinho
  const cartItemsContainer = document.createElement("div");
  cartItemsContainer.id = "cart-items-container";
  container.appendChild(cartItemsContainer);

  root.appendChild(container);

  //desenha itens
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById("cart-items-container");
  if (!container) return;
  container.innerHTML = "";

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="alert alert-info">Seu carrinho está vazio.</p>';
    return;
  }

  const table = document.createElement("table");
  table.className = "table align-middle";
  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col" style="width: 15%;">Produto</th>
        <th scope="col" style="width: 40%;"></th>
        <th scope="col" style="width: 15%;">Preço</th>
        <th scope="col" style="width: 15%;">Qtd.</th>
        <th scope="col" style="width: 15%;">Subtotal</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");

  cart.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img src="${item.image}" alt="${
      item.title
    }" class="img-fluid rounded" style="width: 80px; height: 80px; object-fit: cover;">
      </td>
      <td>
        <h5 class="mb-0">${item.title}</h5>
        <button class="btn btn-link btn-sm text-danger p-0 btn-remove-product" data-id="${
          item.id
        }">
          Remover
        </button>
      </td>
      <td>R$ ${item.price.toFixed(2).replace(".", ",")}</td>
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
      <td>
        <strong>R$ ${(item.price * item.quantity)
          .toFixed(2)
          .replace(".", ",")}</strong>
      </td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  const total = getCartTotal();
  const summary = document.createElement("div");
  summary.className = "mt-4 text-end";
  summary.innerHTML = `
    <h3>Total: <strong class="text-success">R$ ${total
      .toFixed(2)
      .replace(".", ",")}</strong></h3>
    <a href="finalizar.html" class="btn btn-success btn-lg mt-2">
      Finalizar Compra
    </a>
  `;
  container.appendChild(summary);
  addCartButtonListeners();
}

function addCartButtonListeners() {
  document.querySelectorAll(".btn-add-one").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      const cart = getCart();
      const product = cart.find((item) => item.id === id);
      if (product) {
        addToCart(product);
        renderCartItems();
      }
    });
  });

  document.querySelectorAll(".btn-remove-one").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      removeOneFromCart(id);
      renderCartItems();
    });
  });

  //lixeira (remover)
  document.querySelectorAll(".btn-remove-product").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      if (confirm("Tem certeza que quer remover este item do carrinho?")) {
        removeProductFromCart(id);
        renderCartItems();
      }
    });
  });
}
