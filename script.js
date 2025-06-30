document.addEventListener("DOMContentLoaded", () => {
  // Lista productos con categorías y detalles
  const products = [
    {
      id: "p1",
      name: "Auricular Bluetooth A1",
      description: "Auricular inalámbrico con sonido HD.",
      price: 5500,
      oldPrice: 10000,
      image: "https://via.placeholder.com/300x200?text=Auricular+Bluetooth+A1",
      mlLink: "https://articulo.mercadolibre.com.ar/MLA-1122334455-auriculares-bluetooth",
      categories: ["Bluetooth", "Auriculares"]
    },
    {
      id: "p2",
      name: "Arduino UNO R3",
      description: "Microcontrolador para proyectos electrónicos.",
      price: 4200,
      oldPrice: null,
      image: "https://via.placeholder.com/300x200?text=Arduino+UNO",
      mlLink: "https://articulo.mercadolibre.com.ar/MLA-556677889-arduino-uno-r3",
      categories: ["Arduinos"]
    },
    {
      id: "p3",
      name: "Auricular Bluetooth B2",
      description: "Auricular inalámbrico cómodo y ligero.",
      price: 6200,
      oldPrice: 9000,
      image: "https://via.placeholder.com/300x200?text=Auricular+Bluetooth+B2",
      mlLink: "#",
      categories: ["Bluetooth", "Auriculares"]
    },
    {
      id: "p4",
      name: "Arduino Mega 2560",
      description: "Placa de desarrollo avanzada.",
      price: 7500,
      oldPrice: null,
      image: "https://via.placeholder.com/300x200?text=Arduino+Mega+2560",
      mlLink: "#",
      categories: ["Arduinos"]
    },
    {
      id: "p5",
      name: "Auricular Cableado C3",
      description: "Auricular con cable para audio nítido.",
      price: 2800,
      oldPrice: 3500,
      image: "https://via.placeholder.com/300x200?text=Auricular+Cableado+C3",
      mlLink: "#",
      categories: ["Auriculares"]
    },
    {
      id: "p6",
      name: "Auricular Bluetooth C4",
      description: "Auricular inalámbrico con micrófono.",
      price: 6000,
      oldPrice: 8000,
      image: "https://via.placeholder.com/300x200?text=Auricular+Bluetooth+C4",
      mlLink: "#",
      categories: ["Bluetooth", "Auriculares"]
    },
    {
      id: "p7",
      name: "Arduino Nano",
      description: "Placa pequeña para proyectos compactos.",
      price: 3500,
      oldPrice: null,
      image: "https://via.placeholder.com/300x200?text=Arduino+Nano",
      mlLink: "#",
      categories: ["Arduinos"]
    },
    {
      id: "p8",
      name: "Auricular Gaming D5",
      description: "Auricular para juegos con sonido surround.",
      price: 8500,
      oldPrice: 11000,
      image: "https://via.placeholder.com/300x200?text=Auricular+Gaming+D5",
      mlLink: "#",
      categories: ["Auriculares"]
    },
    {
      id: "p9",
      name: "Auricular Bluetooth E6",
      description: "Auricular inalámbrico con cancelación de ruido.",
      price: 9200,
      oldPrice: 12000,
      image: "https://via.placeholder.com/300x200?text=Auricular+Bluetooth+E6",
      mlLink: "#",
      categories: ["Bluetooth", "Auriculares"]
    }
  ];

  const mainContent = document.getElementById("mainContent");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const notifyBtn = document.getElementById("notifyBtn");
  const adContainer = document.getElementById("adContainer");

  // Modal producto
  const productModal = document.getElementById("productModal");
  const closeModalBtn = document.getElementById("closeModal");

  // Modal notificaciones
  const notificationModal = document.getElementById("notificationModal");
  const closeNotificationBtn = document.getElementById("closeNotification");
  const notificationCloseBtn = document.getElementById("notificationCloseBtn");
  const notificationTitle = document.getElementById("notificationTitle");
  const notificationText = document.getElementById("notificationText");

  // Función para crear producto
  function createProductElement(p) {
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
    div.addEventListener("click", () => openProductModal(p.id));
    return div;
  }

  // Agrupar productos por categoría max 9
  function groupProductsByCategory(productsList) {
    const map = {};
    productsList.forEach(p => {
      p.categories.forEach(cat => {
        if (!map[cat]) map[cat] = [];
        if (map[cat].length < 9) map[cat].push(p);
      });
    });
    return map;
  }

  // Obtener todas las categorías únicas para filtro
  function getAllCategories(productsList) {
    const set = new Set();
    productsList.forEach(p => p.categories.forEach(c => set.add(c)));
    return Array.from(set).sort();
  }

  // Renderizar opciones del filtro (multiple select)
  function renderFilterOptions(categories) {
    filterSelect.innerHTML = "";
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      filterSelect.appendChild(option);
    });
  }

  // Filtrar productos según texto y categorías seleccionadas
  function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCats = Array.from(filterSelect.selectedOptions).map(opt => opt.value);

    return products.filter(p => {
      const matchesText = p.name.toLowerCase().includes(searchText) || p.description.toLowerCase().includes(searchText);
      const matchesCategory = selectedCats.length === 0 || selectedCats.some(cat => p.categories.includes(cat));
      return matchesText && matchesCategory;
    });
  }

  // Renderizar categorías y productos (carrusel horizontal)
  function renderCategories(productsList) {
    mainContent.innerHTML = "";
    const grouped = groupProductsByCategory(productsList);

    if (Object.keys(grouped).length === 0) {
      mainContent.innerHTML = "<p>No se encontraron productos.</p>";
      return;
    }

    Object.entries(grouped).forEach(([category, prods]) => {
      const section = document.createElement("section");
      section.className = "category-section";

      const title = document.createElement("h2");
      title.className = "category-title";
      title.textContent = category;
      section.appendChild(title);

      const productsContainer = document.createElement("div");
      productsContainer.className = "category-products";

      prods.forEach(p => {
        const prodElem = createProductElement(p);
        productsContainer.appendChild(prodElem);
      });

      // Scroll horizontal con rueda del mouse
      productsContainer.addEventListener("wheel", (e) => {
        e.preventDefault();
        productsContainer.scrollLeft += e.deltaY;
      });

      section.appendChild(productsContainer);
      mainContent.appendChild(section);
    });
  }

  // Abrir modal producto
  function openProductModal(productId) {
    const p = products.find(x => x.id === productId);
    if (!p) return;

    document.getElementById("modalImg").src = p.image;
    document.getElementById("modalTitle").textContent = p.name;
    document.getElementById("modalDesc").textContent = p.description;
    document.getElementById("modalOldPrice").textContent = p.oldPrice ? `$${p.oldPrice.toLocaleString()}` : "";
    document.getElementById("modalPrice").textContent = `$${p.price.toLocaleString()}`;
    document.getElementById("modalBuy").href = p.mlLink;

    productModal.style.display = "flex";
  }

  // Cerrar modal producto
  closeModalBtn.onclick = () => {
    productModal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === productModal) {
      productModal.style.display = "none";
    }
    if (e.target === notificationModal) {
      notificationModal.style.display = "none";
    }
  };

  // Mostrar notificación random
  const notificationMessages = [
    "¡Esto debe ser tuyo!",
    "OFERTA IMPERDIBLE",
    "¡Últimas unidades!",
    "¡No te lo pierdas!",
    "Descuento especial solo hoy",
  ];

  function showRandomNotification() {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomMsg = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];

    notificationTitle.textContent = randomMsg;
    notificationText.textContent = `${randomProduct.name} a solo $${randomProduct.price.toLocaleString()}!`;

    notificationModal.style.display = "flex";
  }

  // Cerrar modal notificaciones
  closeNotificationBtn.onclick = () => {
    notificationModal.style.display = "none";
  };
  notificationCloseBtn.onclick = () => {
    notificationModal.style.display = "none";
  };

  // Carteles de publicidad (aparecen periódicamente)
  const adMessages = [
    "¡Compra ya y aprovecha!",
    "Envío gratis en pedidos mayores a $5000",
    "Promoción especial solo hoy",
    "¡Productos nuevos añadidos!",
    "Descuentos exclusivos para ti",
  ];

  function createAdBanner(text) {
    const div = document.createElement("div");
    div.className = "ad-banner";
    div.textContent = text;

    const closeBtn = document.createElement("span");
    closeBtn.className = "ad-close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      adContainer.removeChild(div);
    };

    div.appendChild(closeBtn);
    adContainer.appendChild(div);

    // Al hacer click en el cartel, también se cierra
    div.onclick = () => {
      if (adContainer.contains(div)) adContainer.removeChild(div);
    };

    // Se auto elimina después de 10 segundos si sigue visible
    setTimeout(() => {
      if (adContainer.contains(div)) adContainer.removeChild(div);
    }, 10000);
  }

  // Mostrar carteles cada 20 segundos (máx 3 visibles)
  function scheduleAds() {
    setInterval(() => {
      if (adContainer.children.length < 3) {
        const msg = adMessages[Math.floor(Math.random() * adMessages.length)];
        createAdBanner(msg);
      }
    }, 20000);
  }

  // Inicializar página
  function init() {
    // Cargar filtro categorías
    const categories = getAllCategories(products);
    renderFilterOptions(categories);

    // Render inicial
    renderCategories(products);

    // Event listeners filtros y búsqueda
    searchInput.addEventListener("input", () => {
      renderCategories(filterProducts());
    });

    filterSelect.addEventListener("change", () => {
      renderCategories(filterProducts());
    });

    // Botón notificaciones
    notifyBtn.addEventListener("click", () => {
      showRandomNotification();
    });

    // Iniciar carteles
    scheduleAds();
  }

  init();
});
