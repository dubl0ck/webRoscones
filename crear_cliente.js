import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "TU_SUPABASE_URL";
const supabaseKey = "TU_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById("cliente-form");
const pedidosContainer = document.getElementById("pedidos-container");
const btnAgregarPedido = document.getElementById("agregarPedido");
const mensaje = document.getElementById("mensaje");

// 👉 Función para añadir un formulario de pedido
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

  // botón eliminar pedido
  div.querySelector(".eliminarPedido").addEventListener("click", () => {
    div.remove();
  });

  pedidosContainer.appendChild(div);
}

// 👉 Evento para añadir pedidos dinámicamente
btnAgregarPedido.addEventListener("click", agregarPedidoForm);

// 👉 Enviar formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombreCliente = document.getElementById("nombreCliente").value;

  // 1. Insertar cliente
  const { data: cliente, error: errorCliente } = await supabase
    .from("cliente")
    .insert([{ nombre: nombreCliente }])
    .select()
    .single();

  if (errorCliente) {
    mensaje.textContent = "❌ Error creando cliente: " + errorCliente.message;
    return;
  }

  // 2. Insertar pedidos asociados
  const pedidos = [];
  document.querySelectorAll(".pedido-form").forEach(div => {
    const cantidad = parseInt(div.querySelector(".cantidad").value);
    const tamaño = div.querySelector(".tamaño").value;
    const relleno = div.querySelector(".relleno").value;
    const estado = div.querySelector(".estado").value;

    pedidos.push({
      cliente_id: cliente.id,
      cantidad,
      tamaño,
      relleno,
      estado
    });
  });

  if (pedidos.length > 0) {
    const { error: errorPedidos } = await supabase
      .from("contenido_pedido")
      .insert(pedidos);

    if (errorPedidos) {
      mensaje.textContent = "❌ Error creando pedidos: " + errorPedidos.message;
      return;
    }
  }

  mensaje.style.color = "green";
  mensaje.textContent = "✅ Cliente y pedidos creados correctamente";

  // limpiar formulario
  form.reset();
  pedidosContainer.innerHTML = "";
});
