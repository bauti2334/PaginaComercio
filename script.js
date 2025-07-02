// ✅ Lista de productos
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

// ✅ Renderizado por categoría
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
        <p><del>$${product.oldPrice}</del> <strong>$${product.price}</strong></p>
      `;
      fila.appendChild(card);
    });

    section.appendChild(fila);
    container.appendChild(section);
  }
}

// ✅ Buscador
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

// ✅ Carrusel
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

// ✅ Iniciar
document.addEventListener("DOMContentLoaded", () => {
  renderCategories(productos);
});
