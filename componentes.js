function createHeader() {
  const header = document.createElement("header");
  header.className =
    "navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top";

  const container = document.createElement("div");
  container.className = "container";

  const brand = document.createElement("a");
  brand.className = "navbar-brand mx-auto";
  brand.href = "index.html";
  brand.style.fontFamily = "'Saint Carell', serif";
  brand.style.fontSize = "2.5rem";
  brand.style.fontWeight = "bold";
  brand.innerHTML = `
  <span style="color: #A0522D; font-weight: bold;">Café</span>
  <span style="color: #556B2F; font-weight: bold;">Store</span>
`;

  const nav = document.createElement("nav");
  nav.className = "ms-auto";

  const cartLink = document.createElement("a");
  cartLink.className = "btn btn-primary";
  cartLink.href = "carrinho.html";

  cartLink.innerHTML = `
    <i class="bi bi-cart-fill"></i> Carrinho 
    <span class="badge bg-danger">0</span> `;

  nav.appendChild(cartLink);
  container.appendChild(brand);
  container.appendChild(nav);
  header.appendChild(container);

  const toggler = document.createElement("button");
  toggler.className = "navbar-toggler";
  toggler.type = "button";
  toggler.setAttribute("data-bs-toggle", "collapse");
  toggler.setAttribute("data-bs-target", "#navbarMain");
  toggler.innerHTML = `<span class="navbar-toggler-icon"></span>`;

  container.prepend(toggler);

  const collapseDiv = document.createElement("div");
  collapseDiv.className = "collapse navbar-collapse";
  collapseDiv.id = "navbarMain";

  container.innerHTML = "";
  container.appendChild(toggler);
  container.appendChild(brand);
  container.appendChild(collapseDiv);
  container.appendChild(nav);

  return header;
}
