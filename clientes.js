import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "https://zxipywyhobtlxaaerazi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aXB5d3lob2J0bHhhYWVyYXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzE5ODYsImV4cCI6MjA3MjkwNzk4Nn0.YB_mgNKRBrJ8-Z7jnT5_xeQV0zrmAiRqVZ8JqgLxjVs";
const supabase = createClient(supabaseUrl, supabaseKey);

async function cargarDatos() {
  const { data, error } = await supabase
    .from("cliente")
    .select("id, nombre, fecha_creacion, contenido_pedido (id, cantidad, tamaño, relleno, estado)");

  if (error) {
    console.error(error);
    console.error("Error al cargar los datos de Supabase");
    return;
  }

  const contenedor = document.getElementById("listaClientes");
  contenedor.innerHTML = "";

  data.forEach(cliente => {
    // Bloque por cliente
    const divCliente = document.createElement("div");
    divCliente.classList.add("cliente-bloque");
    divCliente.setAttribute("data-cliente-id", cliente.id);

    divCliente.innerHTML = `
      <h3>${cliente.nombre}</h3>
      <p><strong>Fecha de creación:</strong> ${new Date(cliente.fecha_creacion).toLocaleDateString()}</p>
      <button class="eliminarCliente">❌ Eliminar cliente</button>
    `;


    // Tabla de pedidos
     if (cliente.contenido_pedido.length > 0) {
      const tabla = document.createElement("table");
      tabla.innerHTML = `
        <thead>
          <tr>
            <th>Cantidad</th>
            <th>Tamaño</th>
            <th>Relleno</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${cliente.contenido_pedido.map(p => {
            const estadoClass = p.estado.replace(/\s+/g, "-").toLowerCase();
            return `
              <tr data-pedido-id="${p.id}">
                <td>${p.cantidad}</td>
                <td>${p.tamaño}</td>
                <td>${p.relleno}</td>
                <td>
                  <select class="estado ${estadoClass}">
                    <option value="Pendiente" ${p.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                    <option value="En preparación" ${p.estado === "En preparación" ? "selected" : ""}>En preparación</option>
                    <option value="Entregado" ${p.estado === "Entregado" ? "selected" : ""}>Entregado</option>
                  </select>
                </td>
                <td>
                  <button class="eliminarPedido">❌</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      `;

      // añadir listeners a los selects
      tabla.querySelectorAll("select.estado").forEach(select => {
        select.addEventListener("change", async (e) => {
          const tr = e.target.closest("tr");
          const pedidoId = tr.getAttribute("data-pedido-id");
          const nuevoEstado = e.target.value;

          // actualizar en supabase
          const { error } = await supabase
            .from("contenido_pedido")
            .update({ estado: nuevoEstado })
            .eq("id", pedidoId);

          if (error) {
            alert("❌ Error actualizando estado: " + error.message);
            return;
          }

          // actualizar estilos
          e.target.className = "estado " + nuevoEstado.replace(/\s+/g, "-").toLowerCase();
        });
      });
      
      // 🔹 Event listener para actualizar estado
      tabla.querySelectorAll("select.estado").forEach(select => {
        select.addEventListener("change", async (e) => {
          const tr = e.target.closest("tr");
          const pedidoId = Number(tr.getAttribute("data-pedido-id"));
          const nuevoEstado = e.target.value;

          const { error } = await supabase
            .from("contenido_pedido")
            .update({ estado: nuevoEstado })
            .eq("id", pedidoId);

          if (error) {
            alert("❌ Error actualizando estado: " + error.message);
            return;
          }

          e.target.className = "estado " + nuevoEstado.replace(/\s+/g, "-").toLowerCase();
        });
      });

      // 🔹 Event listener para eliminar pedido
      tabla.querySelectorAll("button.eliminarPedido").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const tr = e.target.closest("tr");
          const pedidoId = Number(tr.getAttribute("data-pedido-id"));

          if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;

          const { error } = await supabase
            .from("contenido_pedido")
            .delete()
            .eq("id", pedidoId);

          if (error) {
            alert("❌ Error eliminando pedido: " + error.message);
            return;
          }

          tr.remove(); // borrar de la tabla sin recargar
        });
      });

      divCliente.appendChild(tabla);
      } else {
        divCliente.innerHTML += `<p><em>Este cliente no tiene pedidos.</em></p>`;
      }

      // 🔹 Listener para eliminar cliente completo
    divCliente.querySelector(".eliminarCliente").addEventListener("click", async () => {
      if (!confirm(`¿Seguro que deseas eliminar al cliente "${cliente.nombre}" y todos sus pedidos?`)) return;

      const { error } = await supabase
        .from("cliente")
        .delete()
        .eq("id", cliente.id);

      if (error) {
        alert("❌ Error eliminando cliente: " + error.message);
        return;
      }

      divCliente.remove();
    });

    contenedor.appendChild(divCliente);
  });
}

cargarDatos();