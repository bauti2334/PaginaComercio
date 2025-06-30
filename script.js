document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      id: "p1",
      name: "Auricular Bluetooth A1",
      description: "Auricular inalámbrico con sonido HD.",
      price: 5500,
      oldPrice: 10000,
      image: "https://via.placeholder.com/300x200?text=Auricular+Bluetooth+A1",
      mlLink: "https://articulo.mercadolibre.com.ar/MLA-1122334455",
      categories: ["Bluetooth", "Auriculares"]
    },
    {
      id: "p2",
      name: "Arduino UNO R3",
      description: "Microcontrolador para proyectos electrónicos.",
      price: 4200,
      oldPrice: 8000,
      image: "https://via.placeholder.com/300x200?text=Arduino+UNO",
      mlLink: "https://articulo.mercadolibre.com.ar/MLA-556677889",
      categories: ["Arduinos"]
    },
    // Puedes seguir agregando más productos aquí...
  ];

  const cart = [];
  const mainContent = document.getElementById("mainContent");
  const filterSelect = document.getElementById("filterSelect");
  const searchInput = document.getElementById("searchInput");
  const notifyBtn = document.getElementById("notifyBtn");
  const adContainer = document.getElementById("adContainer");
  const cartIcon = document.getElementById("cartIcon");
  const cartModal = document.getElementById("cartModal");
  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  // PRODUCT MODAL
  const productModal = document.getElementById("productModal");
  const closeModalBtn = document.getElementById("closeModal");
  const addToCartBtn = document.getElementById("addToCartBtn");

  let currentModalProduct = null;

  function renderCategories(productsList) {
    mainContent.innerHTML = "";
    const grouped = groupByCategory(productsList);

    for (const category in grouped) {
      const section = document.createElement("section");
      section.className = "category-section";

      const title = document.createElement("h2");
      title.className = "category-title";
      title.textContent = category;
      section.appendChild(title);

      const container = document.createElement("div");
      container.className = "category-products";

      grouped[category].forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>
            ${product.oldPrice ? `<span class="price-old">$${product.oldPrice}</span>` : ""}
            <span class="price">$${product.price}</span>
          </p>
        `;
        productDiv.onclick = () => openProductModal(product.id);
        container.appendChild(productDiv);
      });

      container.addEventListener("wheel", e => {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      });

      section.appendChild(container);
      mainContent.appendChild(section);
    }
  }

  function groupByCategory(list) {
    const map = {};
    list.forEach(p => {
      p.categories.forEach(c => {
        if (!map[c]) map[c] = [];
        if (map[c].length < 9) map[c].push(p);
      });
    });
    return map;
  }

  function openProductModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    currentModalProduct = p;
    document.getElementById("modalImg").src = p.image;
    document.getElementById("modalTitle").textContent = p.name;
    document.getElementById("modalDesc").textContent = p.description;
    document.getElementById("modalOldPrice").textContent = p.oldPrice ? `$${p.oldPrice}` : "";
    document.getElementById("modalPrice").textContent = `$${p.price}`;
    document.getElementById("modalBuy").href = p.mlLink;
    productModal.style.display = "flex";
  }

  function closeProductModal() {
    productModal.style.display = "none";
  }

  closeModalBtn.onclick = closeProductModal;
  window.onclick = e => {
    if (e.target === productModal) closeProductModal();
    if (e.target === cartModal) cartModal.style.display = "none";
    if (e.target === notificationModal) notificationModal.style.display = "none";
  };

  addToCartBtn.onclick = () => {
    if (!currentModalProduct) return;
    cart.push(currentModalProduct);
    updateCartCount();
    closeProductModal();
  };

  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  cartIcon.onclick = () => {
    renderCart();
    cartModal.style.display = "flex";
  };

  closeCart.onclick = () => {
    cartModal.style.display = "none";
  };

  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((p, index) => {
      total += p.price;

      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <div class="cart-item-details">
          <strong>${p.name}</strong><br>
          $${p.price}
        </div>
        <button class="cart-item-remove" data-index="${index}">Eliminar</button>
      `;
      cartItems.appendChild(item);
    });

    cartTotal.textContent = `$${total}`;
    document.querySelectorAll(".cart-item-remove").forEach(btn => {
      btn.onclick = () => {
        const i = btn.dataset.index;
        cart.splice(i, 1);
        updateCartCount();
        renderCart();
      };
    });
  }

  // FILTRO
  function getCategories() {
    const set = new Set();
    products.forEach(p => p.categories.forEach(c => set.add(c)));
    return [...set].sort();
  }

  function renderFilterOptions(cats) {
    filterSelect.innerHTML = "";
    cats.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      filterSelect.appendChild(opt);
    });
  }

  function filterProducts() {
    const text = searchInput.value.toLowerCase();
    const selectedCats = Array.from(filterSelect.selectedOptions).map(o => o.value);

    return products.filter(p => {
      const matchText = p.name.toLowerCase().includes(text) || p.description.toLowerCase().includes(text);
      const matchCat = selectedCats.length === 0 || selectedCats.some(cat => p.categories.includes(cat));
      return matchText && matchCat;
    });
  }

  searchInput.addEventListener("input", () => renderCategories(filterProducts()));
  filterSelect.addEventListener("change", () => renderCategories(filterProducts()));

  // NOTIFICACIONES
  const notificationMessages = [
    "¡Esto debe ser tuyo!",
    "OFERTA IMPERDIBLE",
    "¡Últimas unidades!",
    "¡No te lo pierdas!",
    "Descuento especial solo hoy"
  ];

  const notificationModal = document.getElementById("notificationModal");
  const notificationTitle = document.getElementById("notificationTitle");
  const notificationText = document.getElementById("notificationText");
  const closeNotification = document.getElementById("closeNotification");
  const notificationCloseBtn = document.getElementById("notificationCloseBtn");

  function showRandomNotification() {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomMsg = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];

    notificationTitle.textContent = randomMsg;
    notificationText.textContent = `${randomProduct.name} a solo $${randomProduct.price}!`;
    notificationModal.style.display = "flex";
  }

  closeNotification.onclick = () => notificationModal.style.display = "none";
  notificationCloseBtn.onclick = () => notificationModal.style.display = "none";
  notifyBtn.onclick = showRandomNotification;

  // ANUNCIOS
  const adMessages = [
    "¡Compra ya y aprovecha!",
    "Envío gratis en pedidos mayores a $5000",
    "Promoción especial solo hoy",
    "¡Productos nuevos añadidos!",
    "Descuentos exclusivos para ti"
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

    setTimeout(() => {
      if (adContainer.contains(div)) adContainer.removeChild(div);
    }, 10000);
  }

  function scheduleAds() {
    setInterval(() => {
      if (adContainer.children.length < 3) {
        const msg = adMessages[Math.floor(Math.random() * adMessages.length)];
        createAdBanner(msg);
      }
    }, 20000);
  }

  function init() {
    renderFilterOptions(getCategories());
    renderCategories(products);
    scheduleAds();
  }

  init();
});
