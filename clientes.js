import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "https://zxipywyhobtlxaaerazi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aXB5d3lob2J0bHhhYWVyYXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzE5ODYsImV4cCI6MjA3MjkwNzk4Nn0.YB_mgNKRBrJ8-Z7jnT5_xeQV0zrmAiRqVZ8JqgLxjVs";
const supabase = createClient(supabaseUrl, supabaseKey);

async function cargarDatos() {
  const { data, error } = await supabase
    .from("cliente")
    .select("id, nombre, fecha_creacion, contenido_pedido (cantidad, tamaño, relleno)");

  if (error) {
    console.error(error);
    return;
  }

  const contenedor = document.getElementById("listaClientes");
  contenedor.innerHTML = "";

  data.forEach(cliente => {
    // Bloque por cliente
    const divCliente = document.createElement("div");
    divCliente.classList.add("cliente-bloque");

    divCliente.innerHTML = `
      <h3>${cliente.nombre}</h3>
      <p><strong>Fecha de creación:</strong> ${new Date(cliente.fecha_creacion).toLocaleDateString()}</p>
    `;

    // Tabla de pedidos
    if (cliente.contenido_pedido.length > 0) {
      const tabla = document.createElement("table");
      tabla.border = "1";
      tabla.innerHTML = `
        <thead>
          <tr>
            <th>Cantidad</th>
            <th>Tamaño</th>
            <th>Relleno</th>
          </tr>
        </thead>
        <tbody>
          ${cliente.contenido_pedido.map(p => `
            <tr>
              <td>${p.cantidad}</td>
              <td>${p.tamaño}</td>
              <td>${p.relleno}</td>
            </tr>
          `).join("")}
        </tbody>
      `;
      divCliente.appendChild(tabla);
    } else {
      divCliente.innerHTML += `<p><em>Este cliente no tiene pedidos.</em></p>`;
    }

    contenedor.appendChild(divCliente);
  });
}

cargarDatos();

