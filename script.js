// Productos con categorías tags (array de strings)
const products = [
  {
    id: "p1",
    name: "Zapatos deportivos",
    description: "Zapatos cómodos para correr y caminar.",
    price: 7500,
    oldPrice: 15000,
    image: "https://via.placeholder.com/300x200?text=Zapatos",
    mlLink: "https://articulo.mercadolibre.com.ar/MLA-123456789-zapatos-deportivos",
    categories: ["oferta", "ropa"]
  },
  {
    id: "p2",
    name: "Camiseta deportiva",
    description: "Camiseta transpirable para entrenar.",
    price: 3500,
    oldPrice: null,
    image: "https://via.placeholder.com/300x200?text=Camiseta",
    mlLink: "https://articulo.mercadolibre.com.ar/MLA-987654321-camiseta-deportiva",
    categories: ["ropa"]
  },
  {
    id: "p3",
    name: "Auriculares Bluetooth",
    description: "Auriculares inalámbricos con gran calidad de sonido.",
    price: 5500,
    oldPrice: 10000,
    image: "https://via.placeholder.com/300x200?text=Auriculares",
    mlLink: "https://articulo.mercadolibre.com.ar/MLA-1122334455-auriculares-bluetooth",
    categories: ["oferta", "electronica"]
  },
  {
    id: "p4",
    name: "Mochila para laptop",
    description: "Mochila resistente con múltiples compartimentos.",
    price: 4200,
    oldPrice: null,
    image: "https://via.placeholder.com/300x200?text=Mochila",
    mlLink: "https://articulo.mercadolibre.com.ar/MLA-556677889-mochila-para-laptop",
    categories: ["hogar"]
  }
];

// Mostrar productos en el grid
const productGrid = document.getElementById("productGrid");

// Renderiza productos filtrados
function renderProducts(filteredProducts) {
  productGrid.innerHTML = "";
  filteredProducts.forEach(p => {
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
    div.addEventListener("click", () => openModal(p.id));
    productGrid.appendChild(div);
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
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

// Filtros

const searchInput = document.getElementById("searchInput");
const categoryCheckboxes = document.querySelectorAll(".category-filter");

function filterProducts() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategories = Array.from(categoryCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const filtered = products.filter(p => {
    // Buscar por texto
    const matchesText = p.name.toLowerCase().includes(searchText);
    // Categorías: al menos una coincida
    const matchesCategory = p.categories.some(cat => selectedCategories.includes(cat));
    return matchesText && matchesCategory;
  });

  renderProducts(filtered);
}

// Eventos para filtros
searchInput.addEventListener("input", filterProducts);
categoryCheckboxes.forEach(cb => cb.addEventListener("change", filterProducts));

// Carga inicial
window.onload = () => {
  filterProducts();
};

// Mensajes llamativos para la notificación
const notifMessages = [
  "¡Esto debe ser tuyo!",
  "OFERTA IMPERDIBLE",
  "Solo por hoy",
  "¡No te lo pierdas!",
  "Descuento exclusivo",
  "Compra ahora y ahorra",
];

// Crear carteles publicitarios (pueden ser estáticos o rotar)
const adsTexts = [
  "Envío gratis en compras > $5000",
  "¡30% OFF en auriculares!",
  "Compra 2 y lleva 3",
  "Descuentos exclusivos en ropa",
];

// Crear y mostrar los carteles
function createAds() {
  const adsContainer = document.getElementById("adsContainer");
  adsContainer.innerHTML = "";
  adsTexts.forEach(text => {
    const ad = document.createElement("div");
    ad.className = "ad-banner";
    ad.textContent = text;
    adsContainer.appendChild(ad);
  });
}

// Mostrar notificación con producto random y mensaje
function showRandomNotif() {
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  const randomMessage = notifMessages[Math.floor(Math.random() * notifMessages.length)];

  alert(`${randomProduct.name}\n${randomMessage}\nPrecio: $${randomProduct.price.toLocaleString()}`);
}

// Crear ads al cargar
window.onload = () => {
  filterProducts();  // Ya estaba para renderizar productos
  createAds();
};

// Evento click en botón notificaciones
document.getElementById("notifBtn").addEventListener("click", showRandomNotif);

