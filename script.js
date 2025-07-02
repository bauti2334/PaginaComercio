// Lista de productos
const productos = [
  {
    id: "p1",
    name: "Auriculares Bluetooth",
    description: "Auriculares inalámbricos con cancelación de ruido",
    price: 4999,
    oldPrice: 7999,
    image: "img/auriculares.jpg",
    tags: ["bluetooth", "auriculares"]
  },
  {
    id: "p2",
    name: "Kit Arduino Uno",
    description: "Kit completo de desarrollo con Arduino Uno R3",
    price: 8999,
    oldPrice: 12999,
    image: "img/arduino.jpg",
    tags: ["arduino", "kits", "electronica"]
  },
  {
    id: "p3",
    name: "Teclado Retro Iluminado",
    description: "Teclado mecánico retro con luces RGB",
    price: 12999,
    oldPrice: 17999,
    image: "img/teclado.jpg",
    tags: ["teclado", "retro", "iluminado"]
  }
];

// Renderizado por categoría
function renderCategories(productList) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  const categorias = {};

  productList.forEach(product => {
    product.tags.forEach(tag => {
      if (!categorias[tag]) categorias[tag] = [];
      categorias[tag].push(product);
    });
  });

  for (const categoria in categorias) {
    const section = document.createElement("section");
    section.innerHTML = `<h2 style="color: #f4a300">${categoria}</h2>`;

    const fila = document.createElement("div");
    fila.className = "fila-categoria";

    categorias[categoria].forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.onclick = () => {
        window.location.href = `producto.html?id=${product.id}`;
      };
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p><span class="price-old">$${product.oldPrice}</span><span class="price-new">$${product.price}</span></p>
        <button onclick="event.stopPropagation(); agregarAlCarrito('${product.id}');">Agregar al carrito</button>
      `;
      fila.appendChild(card);
    });

    section.appendChild(fila);
    container.appendChild(section);
  }
}

// Buscador funcional
function buscarProductos() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  const productosFiltrados = productos.filter((producto) =>
    producto.name.toLowerCase().includes(searchTerm) ||
    producto.description.toLowerCase().includes(searchTerm) ||
    (producto.tags || []).some(tag => tag.toLowerCase().includes(searchTerm))
  );

  renderCategories(productosFiltrados);
}

document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") buscarProductos();
});

// Carrusel
let currentSlide = 0;
let slides;

function showSlide(index) {
  slides = document.querySelectorAll(".carousel-slide");
  const total = slides.length;
  currentSlide = (index + total) % total;
  document.getElementById("carousel").style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

setInterval(() => nextSlide(), 8000);

// Publicidad - banners rotativos
const banners = [
  "¡Esto debe ser tuyo!",
  "OFERTA IMPERDIBLE",
  "Descuento solo hoy",
  "¡Compra ya y ahorra!"
];

function crearBanner() {
  const container = document.getElementById("banner-container");
  if (!container) return;
  const banner = document.createElement("div");
  banner.className = "banner-ad";
  banner.innerHTML = banners[Math.floor(Math.random() * banners.length)] + 
    `<span class="banner-close">&times;</span>`;

  banner.querySelector(".banner-close").onclick = () => {
    banner.remove();
  };

  container.appendChild(banner);

  setTimeout(() => {
    banner.style.opacity = 0;
    setTimeout(() => banner.remove(), 2000);
  }, 10000);
}

setInterval(crearBanner, 15000);
crearBanner();

// Notificaciones producto aleatorio
const notifBtn = document.getElementById("notifBtn");
const notifModal = document.getElementById("notifModal");
const notifClose = document.getElementById("notifClose");
const notifTitle = document.getElementById("notifTitle");
const notifImg = document.getElementById("notifImg");
const notifDesc = document.getElementById("notifDesc");
const notifPrice = document.getElementById("notifPrice");

notifBtn.onclick = () => {
  const prod = productos[Math.floor(Math.random() * productos.length)];
  notifTitle.textContent = prod.name;
  notifImg.src = prod.image;
  notifImg.alt = prod.name;
  notifDesc.textContent = prod.description;
  notifPrice.innerHTML = `<del>$${prod.oldPrice}</del> <strong>$${prod.price}</strong>`;
  notifModal.style.display = "block";
};

notifClose.onclick = () => {
  notifModal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === notifModal) notifModal.style.display = "none";
  if (e.target === cartModal) cartModal.style.display = "none";
};

// Carrito
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const cartClose = document.getElementById("cartClose");
const cartItemsContainer = document.getElementById("cartItems");
const clearCartBtn = document.getElementById("clearCart");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  document.getElementById("cartCount").textContent = carrito.length;
}

function renderizarCarrito() {
  cartItemsContainer.innerHTML = "";
  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }
  carrito.forEach((item, index) => {
    const prod = productos.find(p => p.id === item.id);
    if (!prod) return;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" />
      <div class="cart-item-info">
        <h4>${prod.name}</h4>
        <p><del>$${prod.oldPrice}</del> <strong>$${prod.price}</strong></p>
      </div>
      <button class="cart-item-remove" data-index="${index}">Eliminar</button>
    `;
    cartItemsContainer.appendChild(div);
  });
  // Agregar eventos eliminar
  document.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.target.getAttribute("data-index");
      carrito.splice(idx, 1);
      guardarCarrito();
      renderizarCarrito();
    };
  });
}

function agregarAlCarrito(id) {
  if (carrito.find(item => item.id === id)) {
    alert("El producto ya está en el carrito.");
    return;
  }
  carrito.push({id});
  guardarCarrito();
  alert("Producto agregado al carrito.");
}

cartBtn.onclick = () => {
  renderizarCarrito();
  cartModal.style.display = "block";
};

cartClose.onclick = () => {
  cartModal.style.display = "none";
};

clearCartBtn.onclick = () => {
  carrito = [];
  guardarCarrito();
  renderizarCarrito();
};

// Inicial
renderCategories(productos);
showSlide(0);
actualizarContador();
