// Productos simulados
const productos = [
  {
    id: "p1",
    name: "Auriculares Bluetooth",
    description: "Auriculares inalámbricos con cancelación de ruido",
    price: 4999,
    oldPrice: 7999,
    image: "img/auriculares1.jpg",
    tags: ["bluetooth", "auriculares"],
    mlLink: "https://www.mercadolibre.com.ar/auriculares-bluetooth/p1"
  },
  {
    id: "p2",
    name: "Kit Arduino Uno",
    description: "Kit completo de desarrollo con Arduino Uno R3",
    price: 8999,
    oldPrice: 12999,
    image: "img/arduino1.jpg",
    tags: ["arduino", "kits", "electronica"],
    mlLink: "https://www.mercadolibre.com.ar/kit-arduino-unoo/p2"
  },
  {
    id: "p3",
    name: "Teclado Retro Iluminado",
    description: "Teclado mecánico retro con luces RGB",
    price: 12999,
    oldPrice: 17999,
    image: "img/teclado1.jpg",
    tags: ["teclado", "retro", "iluminado"],
    mlLink: "https://www.mercadolibre.com.ar/teclado-retro/p3"
  }
];

// Renderizar categorías con scroll horizontal
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
    section.innerHTML = `<h2>${categoria}</h2>`;

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
        <p><del>$${product.oldPrice}</del> <strong>$${product.price}</strong></p>
      `;
      fila.appendChild(card);
    });

    section.appendChild(fila);
    container.appendChild(section);
  }
}

// Buscador con sugerencias
const searchInput = document.getElementById("searchInput");
const searchSuggestions = document.querySelector(".suggestions-list");

function buscarProductos() {
  const term = searchInput.value.toLowerCase().trim();
  if (!term) {
    renderCategories(productos);
    clearSuggestions();
    return;
  }
  const filtered = productos.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term) ||
    p.tags.some(t => t.toLowerCase().includes(term))
  );
  renderCategories(filtered);
  updateSuggestions(filtered, term);
}

function updateSuggestions(filteredProducts, term) {
  clearSuggestions();
  if (filteredProducts.length === 0) return;

  filteredProducts.slice(0, 7).forEach(prod => {
    const li = document.createElement("li");
    li.innerHTML = prod.name.replace(new RegExp(term, "gi"), (match) => `<strong>${match}</strong>`);
    li.onclick = () => {
      searchInput.value = prod.name;
      clearSuggestions();
      buscarProductos();
    };
    searchSuggestions.appendChild(li);
  });
  searchSuggestions.style.display = "block";
}

function clearSuggestions() {
  searchSuggestions.innerHTML = "";
  searchSuggestions.style.display = "none";
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase().trim();
  if (term.length === 0) {
    renderCategories(productos);
    clearSuggestions();
  } else {
    buscarProductos();
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    buscarProductos();
    clearSuggestions();
  }
});

document.getElementById("searchBtn").addEventListener("click", () => {
  buscarProductos();
  clearSuggestions();
});

// Carrusel
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");

function showSlide(index) {
  const total = slides.length;
  currentSlide = (index + total) % total;
  document.getElementById("carousel").style.transform = `translateX(-${currentSlide * 100}%)`;
}

document.getElementById("nextCarousel").addEventListener("click", () => {
  showSlide(currentSlide + 1);
});
document.getElementById("prevCarousel").addEventListener("click", () => {
  showSlide(currentSlide - 1);
});
setInterval(() => showSlide(currentSlide + 1), 8000);
showSlide(0);

// Notificaciones
const notifBtn = document.getElementById("notifBtn");
const notifCount = document.getElementById("notifCount");
const notifDropdown = document.getElementById("notifDropdown");
const notifList = document.getElementById("notifList");
const notifCloseBtn = document.getElementById("notifCloseBtn");

const notificacionesSimuladas = [
  "¡Oferta flash en auriculares Bluetooth!",
  "Nuevo stock de Kit Arduino Uno disponible",
  "Teclado Retro con descuento especial"
];

function actualizarNotificaciones() {
  notifList.innerHTML = "";
  notificacionesSimuladas.forEach(mensaje => {
    const li = document.createElement("li");
    li.textContent = mensaje;
    notifList.appendChild(li);
  });
  notifCount.textContent = notificacionesSimuladas.length;
  notifCount.classList.add("visible");
}

notifBtn.addEventListener("click", () => {
  notifDropdown.classList.toggle("visible");
  if (!cartDropdown.classList.contains("hidden")) {
    cartDropdown.classList.add("hidden");
  }
});

// Carrito
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartDropdown = document.getElementById("cartDropdown");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartCloseBtn = document.getElementById("cartCloseBtn");
const cartBuyBtn = document.getElementById("cartBuyBtn");

function cargarCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito() {
  const carrito = cargarCarrito();
  cartList.innerHTML = "";

  if (carrito.length === 0) {
    cartList.innerHTML = "<li>Carrito vacío</li>";
    cartCount.classList.remove("visible");
    cartTotal.textContent = "$0.00";
    return;
  }

  cartCount.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  cartCount.classList.add("visible");

  let total = 0;
  carrito.forEach(item => {
    const prod = productos.find(p => p.id === item.id);
    if (prod) {
      total += prod.price * item.cantidad;
      const li = document.createElement("li");
      li.innerHTML = `${prod.name} x${item.cantidad} - $${(prod.price * item.cantidad).toFixed(2)}`;
      cartList.appendChild(li);
    }
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}

cartBtn.addEventListener("click", () => {
  cartDropdown.classList.toggle("visible");
  if (!notifDropdown.classList.contains("hidden")) {
    notifDropdown.classList.add("hidden");
  }
  actualizarCarrito();
});

cartCloseBtn.addEventListener("click", () => {
  cartDropdown.classList.remove("visible");
});

cartBuyBtn.addEventListener("click", () => {
  const carrito = cargarCarrito();
  carrito.forEach(item => {
    const prod = productos.find(p => p.id === item.id);
    if (prod && prod.mlLink) {
      window.open(prod.mlLink, "_blank");
    }
  });
});

// Añadir producto al carrito
function agregarAlCarrito(id) {
  let carrito = cargarCarrito();
  const exist = carrito.find(item => item.id === id);
  if (exist) {
    exist.cantidad++;
  } else {
    carrito.push({ id: id, cantidad: 1 });
  }
  guardarCarrito(carrito);
  actualizarCarrito();
}

// Al cargar la página
window.addEventListener("load", () => {
  actualizarNotificaciones();
  actualizarCarrito();
  renderCategories(productos);
});
