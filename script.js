// Lista de productos (simulados)
const productos = [
  {
    id: "p1",
    name: "Auriculares Bluetooth",
    description: "Auriculares inalámbricos con cancelación de ruido",
    price: 4999,
    oldPrice: 7999,
    image: "img/auriculares1.jpg",
    tags: ["bluetooth", "auriculares"]
  },
  {
    id: "p2",
    name: "Kit Arduino Uno",
    description: "Kit completo de desarrollo con Arduino Uno R3",
    price: 8999,
    oldPrice: 12999,
    image: "img/arduino1.jpg",
    tags: ["arduino", "kits", "electronica"]
  },
  {
    id: "p3",
    name: "Teclado Retro Iluminado",
    description: "Teclado mecánico retro con luces RGB",
    price: 12999,
    oldPrice: 17999,
    image: "img/teclado1.jpg",
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

document.getElementById("searchBtn").addEventListener("click", buscarProductos);

// Carrusel de imágenes grande
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

// Auto avance cada 8 segundos
setInterval(() => showSlide(currentSlide + 1), 8000);

// Mostrar primera imagen
showSlide(0);

// Carrito y Notificaciones
const notifBtn = document.getElementById("notifBtn");
const notifCount = document.getElementById("notifCount");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");

function actualizarContadoresCabecera() {
  // Simulamos notificaciones aleatorias
  const notificaciones = Math.floor(Math.random() * 3);
  notifCount.textContent = notificaciones;
  notifCount.style.visibility = notificaciones > 0 ? "visible" : "hidden";

  // Contamos productos en carrito
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  cartCount.textContent = carrito.length;
  cartCount.style.visibility = carrito.length > 0 ? "visible" : "hidden";
}

notifBtn.onclick = () => {
  alert("¡Tienes nuevas ofertas e imperdibles!");
};

cartBtn.onclick = () => {
  alert("Aquí se mostraría el carrito de compras.");
};

window.addEventListener("load", () => {
  actualizarContadoresCabecera();
  renderCategories(productos);
});
