import { supabase, checkAuth, logout } from "./utils.js";

checkAuth();
document.getElementById("logout")?.addEventListener("click", logout);

const form = document.getElementById("cliente-form");
const pedidosContainer = document.getElementById("pedidos-container");
const btnAgregarPedido = document.getElementById("agregarPedido");
const mensaje = document.getElementById("mensaje");

function agregarPedidoForm() {
  const div = document.createElement("div");
  div.classList.add("pedido-form");
  div.innerHTML = `
    <label>Cantidad:</label>
    <input type="number" class="cantidad" required>
    <label>Tamaño:</label>
    <input type="text" class="tamaño" required>
    <label>Relleno:</label>
    <input type="text" class="relleno" required>
    <label>Estado:</label>
    <select class="estado" required>
      <option value="Pendiente">Pendiente</option>
      <option value="En preparación">En preparación</option>
      <option value="Entregado">Entregado</option>
    </select>
    <button type="button" class="eliminarPedido">❌</button>
    <hr>
  `;
  div.querySelector(".eliminarPedido").addEventListener("click", () => div.remove());
  pedidosContainer.appendChild(div);
}

btnAgregarPedido.addEventListener("click", agregarPedidoForm);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombreCliente = document.getElementById("nombreCliente").value;

  const { data: cliente, error: errorCliente } = await supabase
    .from("cliente")
    .insert([{ nombre: nombreCliente }])
    .select()
    .single();

  if (errorCliente) {
    mensaje.textContent = "❌ Error creando cliente: " + errorCliente.message;
    return;
  }

  const pedidos = [];
  document.querySelectorAll(".pedido-form").forEach(div => {
    pedidos.push({
      cliente_id: cliente.id,
      cantidad: parseInt(div.querySelector(".cantidad").value),
      tamaño: div.querySelector(".tamaño").value,
      relleno: div.querySelector(".relleno").value,
      estado: div.querySelector(".estado").value
    });
  });

  if (pedidos.length > 0) {
    const { error: errorPedidos } = await supabase.from("contenido_pedido").insert(pedidos);
    if (errorPedidos) {
      mensaje.textContent = "❌ Error creando pedidos: " + errorPedidos.message;
      return;
    }
  }

  mensaje.style.color = "green";
  mensaje.textContent = "✅ Cliente y pedidos creados correctamente";
  form.reset();
  pedidosContainer.innerHTML = "";
});
