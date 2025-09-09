import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "TU_SUPABASE_URL";
const supabaseKey = "TU_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

async function cargarDatos() {
  const { data, error } = await supabase
    .from("cliente")
    .select("id, nombre, fecha_creacion, contenido_pedido (cantidad, tamaño, relleno, estado)");

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
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${cliente.contenido_pedido.map(p => `
            <tr>
              <td>${p.cantidad}</td>
              <td>${p.tamaño}</td>
              <td>${p.relleno}</td>
              <td>${p.estado}</td>
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
