document.addEventListener("DOMContentLoaded", () => {
  // Datos de productos
  const products = [
    {
      id: "p1",
      name: "Auricular Bluetooth A1",
      description: "Auricular inalámbrico con sonido HD y diseño ergonómico.",
      price: 5500,
      oldPrice: 10000,
      image: "https://via.placeholder.com/300x200?text=Auricular+A1",
      mlLink: "https://mercadolibre.com.ar/producto1",
      categories: ["Auriculares", "Bluetooth"],
      features: {
        "Conectividad": "Bluetooth 5.0",
        "Duración batería": "8 horas",
        "Color": "Negro"
      }
    },
    {
      id: "p2",
      name: "Arduino UNO R3",
      description: "Ideal para iniciarte en la electrónica y la programación.",
      price: 4200,
      oldPrice: 8000,
      image: "https://via.placeholder.com/300x200?text=Arduino+UNO",
      mlLink: "https://mercadolibre.com.ar/producto2",
      categories: ["Arduinos"],
      features: {
        "Microcontrolador": "ATmega328P",
        "Voltaje": "5V",
        "Entradas/Salidas": "14 digitales, 6 analógicas"
      }
    },
    // Agregar más productos si querés...
  ];

  // Estado carrito
  let cart = [];

  // Referencias DOM
  const main = document.getElementById("mainContent");
  const filterSelect = document.getElementById("filterSelect");
  const searchInput = document.getElementById("searchInput");
  const notifyBtn = document.getElementById("notifyBtn");
  const cartIcon = document.getElementById("cartIcon");
  const cartCount = document.getElementById("cartCount");

  // MODALES
  const productModal = createModal("productModal");
  const cartModal = createModal("cartModal");
  const notificationModal = createModal("notificationModal");

  // Contenedores dentro de modales
  productModal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="closeProductModal">&times;</span>
      <img id="modalImg" src="" alt="" style="width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px;"/>
      <h2 id="modalTitle"></h2>
      <p id="modalDesc"></p>
      <p><del id="modalOldPrice" style="color:#ccc;"></del> <strong id="modalPrice" style="color:#f4a300; font-size:1.3em;"></strong></p>
      <a id="modalBuy" href="#" target="_blank" class="buy-btn">Comprar en MercadoLibre</a>
      <button id="addToCartBtn" class="buy-btn" style="margin-top:10px; background:#e07f8f;">Agregar al carrito</button>
    </div>
  `;

  cartModal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="closeCartModal">&times;</span>
      <h2>Tu carrito</h2>
      <div id="cartItems" style="max-height:300px; overflow-y:auto; margin-bottom:15px;"></div>
      <h3>Total: <span id="cartTotal">$0</span></h3>
      <button id="checkoutBtn" class="buy-btn">Finalizar Compra</button>
    </div>
  `;

  notificationModal.innerHTML = `
    <div class="modal-content notification-content">
      <span class="close" id="closeNotificationModal">&times;</span>
      <h2 id="notificationTitle"></h2>
      <p id="notificationText"></p>
      <button id="notificationCloseBtn" class="buy-btn">Cerrar</button>
    </div>
  `;

  // Función para crear modal y agregar al body si no existe
  function createModal(id) {
    let modal = document.getElementById(id);
    if (!modal) {
      modal = document.createElement("div");
      modal.id = id;
      modal.className = "modal";
      document.body.appendChild(modal);
    }
    return modal;
  }

  // Variables para modal producto
  let currentProduct = null;

  // Abrir modal producto
  function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    productModal.querySelector("#modalImg").src = currentProduct.image;
    productModal.querySelector("#modalImg").alt = currentProduct.name;
    productModal.querySelector("#modalTitle").textContent = currentProduct.name;
    productModal.querySelector("#modalDesc").textContent = currentProduct.description;
    productModal.querySelector("#modalOldPrice").textContent = currentProduct.oldPrice ? `$${currentProduct.oldPrice}` : "";
    productModal.querySelector("#modalPrice").textContent = `$${currentProduct.price}`;
    productModal.querySelector("#modalBuy").href = currentProduct.mlLink;

    productModal.style.display = "flex";
  }

  // Cerrar modales
  productModal.querySelector("#closeProductModal").onclick = () => productModal.style.display = "none";
  cartModal.querySelector("#closeCartModal").onclick = () => cartModal.style.display = "none";
  notificationModal.querySelector("#closeNotificationModal").onclick = () => notificationModal.style.display = "none";
  notificationModal.querySelector("#notificationCloseBtn").onclick = () => notificationModal.style.display = "none";

  // Añadir producto al carrito desde modal
  productModal.querySelector("#addToCartBtn").onclick = () => {
    if (!currentProduct) return;
    cart.push(currentProduct);
    updateCartCount();
    productModal.style.display = "none";
    showNotification("¡Producto agregado al carrito!", `${currentProduct.name} ha sido añadido.`);
  };

  // Mostrar notificación modal
  function showNotification(title, text) {
    notificationModal.querySelector("#notificationTitle").textContent = title;
    notificationModal.querySelector("#notificationText").textContent = text;
    notificationModal.style.display = "flex";
  }

  // Actualizar contador carrito
  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  // Mostrar carrito
  cartIcon.onclick = () => {
    renderCart();
    cartModal.style.display = "flex";
  };

  // Renderizar carrito en modal
  function renderCart() {
    const container = cartModal.querySelector("#cartItems");
    container.innerHTML = "";

    if (cart.length === 0) {
      container.innerHTML = "<p>Tu carrito está vacío.</p>";
      cartModal.querySelector("#cartTotal").textContent = "$0";
      return;
    }

    let total = 0;
    cart.forEach((p, i) => {
      total += p.price;

      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      div.style.marginBottom = "8px";

      div.innerHTML = `
        <div>
          <strong>${p.name}</strong><br />
          $${p.price}
        </div>
        <button style="background:#e07f8f; border:none; color:#fff; padding:5px 10px; border-radius:6px; cursor:pointer;" data-index="${i}">Eliminar</button>
      `;

      div.querySelector("button").onclick = (e) => {
        const index = e.target.getAttribute("data-index");
        cart.splice(index, 1);
        updateCartCount();
        renderCart();
      };

      container.appendChild(div);
    });

    cartModal.querySelector("#cartTotal").textContent = `$${total}`;
  }

  // Finalizar compra (redirecciona a MercadoLibre del primer producto)
  cartModal.querySelector("#checkoutBtn").onclick = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    // Abrir MercadoLibre del primer producto en carrito (podrías modificar lógica)
    window.open(cart[0].mlLink, "_blank");
  };

  // Render productos por categorías en grilla
  function renderCategories(list) {
    main.innerHTML = "";

    const grouped = groupByCategory(list);

    for (const category in grouped) {
      const section = document.createElement("section");
      section.style.marginBottom = "40px";

      const title = document.createElement("h2");
      title.textContent = category;
      title.style.color = "#f4a300";
      title.style.marginBottom = "12px";
      section.appendChild(title);

      const container = document.createElement("div");
      container.style.display = "grid";
      container.style.gridTemplateColumns = "repeat(auto-fill, minmax(260px, 1fr))";
      container.style.gap = "20px";

      grouped[category].forEach(product => {
        const card = document.createElement("div");
        card.style.background = "rgba(0,0,0,0.8)";
        card.style.border = "2px solid #f4a300";
        card.style.borderRadius = "12px";
        card.style.padding = "12px";
        card.style.cursor = "pointer";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.alignItems = "center";
        card.style.color = "#fff";
        card.style.transition = "transform 0.2s ease";
        card.onmouseenter = () => card.style.transform = "scale(1.05)";
        card.onmouseleave = () => card.style.transform = "scale(1)";

        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}" style="width:100%; height:160px; object-fit:contain; border-radius:8px; margin-bottom:10px;" />
          <h3>${product.name}</h3>
          <p><del style="color:#bbb;">$${product.oldPrice}</del> <strong style="color:#e07f8f;">$${product.price}</strong></p>
        `;

       card.onclick = () => {
  window.location.href = `producto.html?id=${product.id}`;
};


        container.appendChild(card);
      });

      section.appendChild(container);
      main.appendChild(section);
    }
  }

  // Agrupar productos por categoría (máx 9 por categoría)
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

  // Filtrar productos por texto y categorías seleccionadas
  function filterProducts() {
    const text = searchInput.value.toLowerCase();
    const selectedCats = Array.from(filterSelect.selectedOptions).map(o => o.value);

    return products.filter(p => {
      const matchesText = p.name.toLowerCase().includes(text) || p.description.toLowerCase().includes(text);
      const matchesCat = selectedCats.length === 0 || selectedCats.some(cat => p.categories.includes(cat));
      return matchesText && matchesCat;
    });
  }

  // Actualizar productos mostrados cuando cambian filtros o texto
  searchInput.addEventListener("input", () => renderCategories(filterProducts()));
  filterSelect.addEventListener("change", () => renderCategories(filterProducts()));

  // Cargar categorías en select (multiselección)
  function loadCategories() {
    const cats = new Set();
    products.forEach(p => p.categories.forEach(c => cats.add(c)));

    cats.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      filterSelect.appendChild(opt);
    });
  }

  // Notificaciones con mensajes aleatorios y producto random
  const notificationMessages = [
    "¡Esto debe ser tuyo!",
    "OFERTA IMPERDIBLE",
    "¡Últimas unidades!",
    "¡No te lo pierdas!",
    "Descuento especial solo hoy"
  ];

  notifyBtn.onclick = () => {
    const prod = products[Math.floor(Math.random() * products.length)];
    const msg = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
    showNotification(msg, `${prod.name} a solo $${prod.price}!`);
  };

  // Publicidad dinámica
  const adContainer = document.getElementById("adContainer");
  const adMessages = [
    "¡Compra ya y aprovecha!",
    "Envío gratis en pedidos mayores a $5000",
    "Promoción especial solo hoy",
    "¡Productos nuevos añadidos!",
    "Descuentos exclusivos para ti"
  ];

  function createAd(text) {
    const ad = document.createElement("div");
    ad.className = "ad-banner";
    ad.textContent = text;

    const closeBtn = document.createElement("span");
    closeBtn.className = "ad-close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      adContainer.removeChild(ad);
    };

    ad.appendChild(closeBtn);
    adContainer.appendChild(ad);

    setTimeout(() => {
      if (adContainer.contains(ad)) adContainer.removeChild(ad);
    }, 10000);
  }

  function scheduleAds() {
    setInterval(() => {
      if (adContainer.children.length < 3) {
        const msg = adMessages[Math.floor(Math.random() * adMessages.length)];
        createAd(msg);
      }
    }, 20000);
  }

  // Inicialización
  function init() {
    loadCategories();
    renderCategories(products);
    updateCartCount();
    scheduleAds();
  }

  init();

  // Cerrar modales al hacer click afuera
  window.onclick = e => {
    if (e.target === productModal) productModal.style.display = "none";
    if (e.target === cartModal) cartModal.style.display = "none";
    if (e.target === notificationModal) notificationModal.style.display = "none";
  };
});
