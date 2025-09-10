import { supabase, checkAuth, logout } from "./utils.js";

checkAuth(); // obligar login antes de cargar datos

// Logout
document.getElementById("logout")?.addEventListener("click", logout);

async function cargarDatos() {
  const { data, error } = await supabase
    .from("cliente")

  if (error) {
    console.error(error);
    return;
  }

  const contenedor = document.getElementById("listaClientes");
  contenedor.innerHTML = "";

  data.forEach(cliente => {
    const divCliente = document.createElement("div");
    divCliente.classList.add("cliente-bloque");

    divCliente.innerHTML = `
      <h3>${cliente.nombre}</h3>
      <p><strong>Fecha de creación:</strong> ${new Date(cliente.fecha_creacion).toLocaleDateString()}</p>
    `;

    if (cliente.contenido_pedido.length > 0) {
      const tabla = document.createElement("table");
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
          ${cliente.contenido_pedido.map(p => {
            const estadoClass = p.estado.replace(/\s+/g, "-").toLowerCase();
            return `
              <tr>
                <td>${p.cantidad}</td>
                <td>${p.tamaño}</td>
                <td>${p.relleno}</td>
                <td class="estado ${estadoClass}">${p.estado}</td>
              </tr>
            `;
          }).join("")}
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
