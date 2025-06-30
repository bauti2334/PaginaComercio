document.addEventListener("DOMContentLoaded", () => {
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

  // Elementos DOM
  const productGrid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryCheckboxes = document.querySelectorAll(".category-filter");

  // Modal producto
  const modal = document.getElementById("productModal");
  const closeModalBtn = document.getElementById("closeModal");

  // Modal notificaciones
  const notifModal = document.getElementById("notifModal");
  const closeNotifModalBtn = document.getElementById("closeNotifModal");
  const notifTitle = document.getElementById("notifTitle");
  const notifMessage = document.getElementById("notifMessage");
  const notifPrice = document.getElementById("notifPrice");
  const notifBuyBtn = document.getElementById("notifBuyBtn");

  // Botón notificaciones
  const notifBtn = document.getElementById("notifBtn");

  // Ads container y variables para ads
  const adsContainer = document.getElementById("adsContainer");
  const adsTexts = [
    "Envío gratis en compras > $5000",
    "¡30% OFF en auriculares!",
    "Compra 2 y lleva 3",
    "Descuentos exclusivos en ropa",
  ];
  let currentAdIndex = 0;
  let adTimeoutId = null;

  // Mensajes notificaciones
  const notifMessages = [
    "¡Esto debe ser tuyo!",
    "OFERTA IMPERDIBLE",
    "Solo por hoy",
    "¡No te lo pierdas!",
    "Descuento exclusivo",
    "Compra ahora y ahorra",
  ];

  // Función para renderizar productos
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

  // Filtrar productos según input y categorías
  function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const filtered = products.filter(p => {
      const matchesText = p.name.toLowerCase().includes(searchText);
      const matchesCategory = p.categories.some(cat => selectedCategories.includes(cat));
      return matchesText && matchesCategory;
    });

    renderProducts(filtered);
  }

  // Abrir modal producto
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

  // Cerrar modal producto
  closeModalBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = e => {
    if (e.target === modal) modal.style.display = "none";
    if (e.target === notifModal) notifModal.style.display = "none";
  };

  // Mostrar cartel publicitario
  function showAd() {
    adsContainer.innerHTML = "";
    if (currentAdIndex >= adsTexts.length) currentAdIndex = 0;

    const adText = adsTexts[currentAdIndex];
    currentAdIndex++;

    const ad = document.createElement("div");
    ad.className = "ad-banner";

    const closeBtn = document.createElement("button");
    closeBtn.className = "ad-close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.title = "Cerrar publicidad";
    closeBtn.onclick = () => {
      adsContainer.innerHTML = "";
      scheduleNextAd();
    };

    ad.textContent = adText;
    ad.appendChild(closeBtn);
    adsContainer.appendChild(ad);

    adTimeoutId = setTimeout(() => {
      adsContainer.innerHTML = "";
      scheduleNextAd();
    }, 5000);
  }

  // Programar siguiente cartel
  function scheduleNextAd() {
    adTimeoutId = setTimeout(() => {
      showAd();
    }, 3000);
  }

  // Mostrar notificación modal
  function showRandomNotif() {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomMessage = notifMessages[Math.floor(Math.random() * notifMessages.length)];

    notifTitle.textContent = randomProduct.name;
    notifMessage.textContent = randomMessage;
    notifPrice.textContent = `Precio: $${randomProduct.price.toLocaleString()}`;
    notifBuyBtn.onclick = () => {
      window.open(randomProduct.mlLink, "_blank");
    };

    notifModal.style.display = "flex";
  }

  // Cerrar modal notificación
  closeNotifModalBtn.onclick = () => {
    notifModal.style.display = "none";
  };

  // Eventos filtros y botón notificación
  searchInput.addEventListener("input", filterProducts);
  categoryCheckboxes.forEach(cb => cb.addEventListener("change", filterProducts));
  notifBtn.addEventListener("click", showRandomNotif);

  // Inicializar
  filterProducts();
  showAd();
});

