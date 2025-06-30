// Datos de productos (podés agregar/quitar o luego cargar JSON)
const products = [
  {
    id: "p1",
    name: "Zapatos deportivos",
    description: "Zapatos cómodos para correr y caminar.",
    price: 7500,
    oldPrice: 9000,
    image: "https://via.placeholder.com/300x200?text=Zapatos",
    mlLink: "https://articulo.mercadolibre.com.ar/MLA-123456789-zapatos-deportivos",
    category: "oferta"
  },
  {
    id: "p2",
    name: "Camiseta deportiva",
    description: "Camiseta transpirable para entrenar.",
    price: 3500,
    oldPrice: null,
    image: "https://via.placeholder.com/300x200?text=Camiseta",
    mlLink: "https://articulo.mercadolibre.com.ar/MLA-987654321-camiseta-deportiva",
    category: "stock"
  },
  {
    id: "p3",
    name: "Auriculares Bluetooth",
    description: "Auriculares inalámbricos con gran calidad de sonido.",
    price: 5500,
    oldPrice: 6000,
    image: "https://via.placeholder.com/300x200?text=Auriculares",
    mlLink: "https://articulo.mercadolibre.com.ar/MLA-1122334455-auriculares-bluetooth",
    category: "oferta"
  },
  {
    id: "p4",
    name: "Mochila para laptop",
    description: "Mochila resistente con múltiples compartimentos.",
    price: 4200,
    oldPrice: null,
    image: "https://via.placeholder.com/300x200?text=Mochila",
    mlLink: "https://articulo.mercadolibre.com.ar/MLA-556677889-mochila-para-laptop",
    category: "stock"
  }
];

// Función para mostrar productos en un contenedor
function renderProducts(containerId, category) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const filtered = products.filter(p => p.category === category);

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.setAttribute("data-id", p.id);
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>
        ${p.oldPrice ? `<span class="price-old">$${p.oldPrice.toLocaleString()}</span>` : ""}
        <span class="price">$${p.price.toLocaleString()}</span>
      </p>
    `;
    // Abrir modal al hacer click
    div.addEventListener("click", () => openModal(p.id));
    container.appendChild(div);
  });
}

// Modal
const modal = document.getElementById("productModal");
const closeModalBtn = document.getElementById("closeModal");

function openModal(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;

  document.getElementById("modalImg").src = p.image;
  document.getElementById("modalTitle").textContent = p.name;
  document.getElementById("modalDesc").textContent = p.description;
  document.getElementById("modalOldPrice").textContent = p.oldPrice ? `$${p.oldPrice.toLocaleString()}` : "";
  document.getElementById("modalPrice").textContent = `$${p.price.toLocaleString()}`;
  document.getElementById("modalBuy").href = p.mlLink;

  modal.style.display = "flex";
}

// Cerrar modal
closeModalBtn.onclick = () => {
  modal.style.display = "none";
};

// Cerrar modal si se clickea fuera del contenido
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

// Buscador en tiempo real
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase();
  ["offers", "stock"].forEach(section => {
    const container = document.getElementById(section);
    Array.from(container.children).forEach(productDiv => {
      const name = productDiv.querySelector("h3").textContent.toLowerCase();
      productDiv.style.display = name.includes(val) ? "" : "none";
    });
  });
});

// Mostrar productos al cargar la página
window.onload = () => {
  renderProducts("offers", "oferta");
  renderProducts("stock", "stock");
};
