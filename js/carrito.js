// ===============================
// 🛒 Carrito de Compras TPSG
// Código mejorado con buenas prácticas ES6+
// ===============================

// === Selectores del DOM ===
const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const btnVaciarCarrito = document.querySelector("#vaciar-carrito");

let articulosCarrito = [];

// === Inicialización ===
document.addEventListener("DOMContentLoaded", () => {
  cargarEventListeners();
  // Cargar carrito desde LocalStorage si existe
  articulosCarrito = JSON.parse(localStorage.getItem("carritoTPSG")) || [];
  renderizarCarrito();
});

// === Funciones de eventos ===
function cargarEventListeners() {
  // Agregar curso al carrito
  listaCursos.addEventListener("click", handleAgregarCurso);

  // Eliminar curso del carrito
  carrito.addEventListener("click", handleEliminarCurso);

  // Vaciar carrito completo
  btnVaciarCarrito.addEventListener("click", vaciarCarrito);
}

// === Agregar Curso ===
function handleAgregarCurso(e) {
  e.preventDefault();

  const btn = e.target.closest(".agregar-carrito");
  if (!btn) return;

  const cardCurso = btn.closest(".card");
  if (!cardCurso) return;

  const infoCurso = extraerDatosCurso(cardCurso);
  agregarOCantidad(infoCurso);
  renderizarCarrito();
}

// Extrae la información de un curso desde su tarjeta
function extraerDatosCurso(cursoElemento) {
  return {
    imagen: cursoElemento.querySelector("img").src,
    titulo: cursoElemento.querySelector("h4").textContent.trim(),
    precio: cursoElemento.querySelector(".precio span").textContent.trim(),
    id: cursoElemento.querySelector("a").dataset.id,
    cantidad: 1,
  };
}

// Agrega un curso nuevo o incrementa su cantidad
function agregarOCantidad(cursoNuevo) {
  const existe = articulosCarrito.some(curso => curso.id === cursoNuevo.id);

  if (existe) {
    articulosCarrito = articulosCarrito.map(curso =>
      curso.id === cursoNuevo.id
        ? { ...curso, cantidad: curso.cantidad + 1 }
        : curso
    );
  } else {
    articulosCarrito = [...articulosCarrito, cursoNuevo];
  }

  sincronizarStorage();
}

// === Eliminar Curso ===
function handleEliminarCurso(e) {
  const btn = e.target.closest(".borrar-curso");
  if (!btn) return;

  const id = btn.dataset.id;
  articulosCarrito = articulosCarrito.filter(curso => curso.id !== id);

  renderizarCarrito();
  sincronizarStorage();
}

// === Vaciar Carrito ===
function vaciarCarrito() {
  articulosCarrito = [];
  renderizarCarrito();
  sincronizarStorage();
}

// === Renderizar Carrito ===
function renderizarCarrito() {
  limpiarHTML();

  if (articulosCarrito.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="5" style="text-align:center; color:#666;">
        Tu carrito está vacío 🛍️
      </td>
    `;
    contenedorCarrito.appendChild(row);
    return;
  }

  articulosCarrito.forEach(({ imagen, titulo, precio, cantidad, id }) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${imagen}" width="80" alt="${titulo}"></td>
      <td>${titulo}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td>
        <a href="#" class="borrar-curso" data-id="${id}" title="Eliminar curso">❌</a>
      </td>
    `;
    contenedorCarrito.appendChild(row);
  });
}

// === Utilidades ===
function limpiarHTML() {
  contenedorCarrito.innerHTML = "";
}

function sincronizarStorage() {
  localStorage.setItem("carritoTPSG", JSON.stringify(articulosCarrito));
}
