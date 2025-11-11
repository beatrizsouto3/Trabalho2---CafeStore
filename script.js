//roda a funçõa principal
document.addEventListener("DOMContentLoaded", initApp);

//função principal
async function initApp() {
  const root = document.getElementById("root");
  if (!root) return;

  const header = createHeader();
  root.appendChild(header);

  const mainContainer = document.createElement("div");
  mainContainer.className = "container mt-4";

  const title = document.createElement("h2");
  title.className = "mb-4";
  title.textContent = "Cafés Disponíveis";
  title.style.color = "#A0522D";
  mainContainer.appendChild(title);

  const productRow = document.createElement("div");
  productRow.className = "row";

  //busca os cafés e criação dos cards
  try {
    const products = await fetchProducts();
    products.forEach((product) => {
      const card = createProductCard(product);
      productRow.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar os produtos:", error);
  }

  mainContainer.appendChild(productRow);
  root.appendChild(mainContainer);
}

//busca na API local
async function fetchProducts() {
  const apiEndpoint = "http://localhost:3000/coffee";

  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    throw error;
  }
}

//cria um card
function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4 mb-4";

  const card = document.createElement("div");
  card.className = "card h-100";

  const img = document.createElement("img");
  img.src = product.image;
  img.className = "card-img-top";
  img.alt = product.title;
  img.style.height = "250px";
  img.style.objectFit = "cover";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body d-flex flex-column";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = product.title;

  const description = document.createElement("p");
  description.className = "card-text";
  description.textContent = product.description;

  const ingredients = document.createElement("p");
  ingredients.className = "card-text";
  ingredients.innerHTML = `<strong>Ingredientes:</strong> ${product.ingredients.join(
    ", "
  )}`;

  const price = document.createElement("p");
  price.className = "card-text fw-bold fs-5";
  price.textContent = `R$ ${product.price.toFixed(2).replace(".", ",")}`;

  const button = document.createElement("a");
  button.href = "#";
  button.className = "btn mt-auto";
  button.style.backgroundColor = "#556B2F";
  button.style.color = "#FFFFFF";
  button.style.borderColor = "#556B2F";
  button.textContent = "Adicionar ao Carrinho";

  button.addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(product);
  });

  //monta o card
  cardBody.appendChild(title);
  cardBody.appendChild(description);
  cardBody.appendChild(ingredients);
  cardBody.appendChild(price);
  cardBody.appendChild(button);

  card.appendChild(img);
  card.appendChild(cardBody);

  col.appendChild(card);
  return col;
}
