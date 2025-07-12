import {
  crearCiudadano,
  listarCiudadanos,
  actualizarCiudadano,
  eliminarCiudadano,
  obtenerCiudadanoPorId
} from "../api/ciudadano.api.js";

let idCiudadanoEditar = null;

// Renderiza la lista de ciudadanos en la tabla
async function renderCiudadanos() {
  const response = await listarCiudadanos();
  const data = response.data || [];
  const tbody = document.getElementById("tbodyCiudadanos");
  tbody.innerHTML = "";
  data.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.codigo_universal}</td>
      <td>${c.nombre}</td>
      <td>${c.apellido}</td>
      <td>${c.planeta_origen}</td>
      <td>${c.estado}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editarCiudadano('${c.id_ciudadano}')">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-danger btn-sm" onclick="borrarCiudadano('${c.id_ciudadano}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Crear ciudadano desde el modal
async function handleCrearCiudadano(e) {
  e.preventDefault();
  const data = {
    codigo_universal: document.getElementById('codigo_universal').value,
    qr_code: document.getElementById('qr_code').value,
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
    planeta_origen: document.getElementById('planeta_origen').value,
    ciudad_origen: document.getElementById('ciudad_origen').value,
    direccion_actual: document.getElementById('direccion_actual').value,
    telefono: document.getElementById('telefono').value,
    email: document.getElementById('email').value,
    foto: document.getElementById('foto').value,
    estado: document.getElementById('estado').value,
    registrado_por: 1 // Cambia esto por el id del usuario logueado
  };
  const res = await crearCiudadano(data);
  if(res.status === "ok") {
    Swal.fire({ icon: 'success', title: '¡Ciudadano creado!', showConfirmButton: false, timer: 1500 });
  } else {
    Swal.fire({ icon: 'error', title: 'Error', text: res.message });
  }
  // Cierra el modal
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('crearCiudadanoModal'));
  modal.hide();
  await renderCiudadanos();
  e.target.reset();
}

// Eliminar ciudadano
async function borrarCiudadano(id) {
  const confirm = await Swal.fire({
    title: '¿Seguro que quieres eliminar este ciudadano?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  if (confirm.isConfirmed) {
    const res = await eliminarCiudadano(id);
    if(res.status === "ok") {
      Swal.fire({ icon: 'success', title: '¡Ciudadano eliminado!', showConfirmButton: false, timer: 1500 });
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message });
    }
    renderCiudadanos();
  }
}
window.borrarCiudadano = borrarCiudadano;

// Editar ciudadano: abre el modal y carga los datos
async function editarCiudadano(id) {
  idCiudadanoEditar = id;
  const response = await obtenerCiudadanoPorId(id);
  const c = response.data;
  if (c) {
    document.getElementById('edit_nombre').value = c.nombre || "";
    document.getElementById('edit_apellido').value = c.apellido || "";
    document.getElementById('edit_fecha_nacimiento').value = c.fecha_nacimiento ? c.fecha_nacimiento.split('T')[0] : "";
    document.getElementById('edit_planeta_origen').value = c.planeta_origen || "";
    document.getElementById('edit_estado').value = c.estado || "activo";
    // Abre el modal
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editarCiudadanoModal'));
    modal.show();
  }
}
window.editarCiudadano = editarCiudadano;

// Guardar cambios de edición
async function handleEditarCiudadano(e) {
  e.preventDefault();
  const data = {
    nombre: document.getElementById('edit_nombre').value,
    apellido: document.getElementById('edit_apellido').value,
    fecha_nacimiento: document.getElementById('edit_fecha_nacimiento').value,
    planeta_origen: document.getElementById('edit_planeta_origen').value,
    estado: document.getElementById('edit_estado').value
  };
  const res = await actualizarCiudadano(idCiudadanoEditar, data);
  if(res.status === "ok") {
    Swal.fire({ icon: 'success', title: '¡Ciudadano actualizado!', showConfirmButton: false, timer: 1500 });
  } else {
    Swal.fire({ icon: 'error', title: 'Error', text: res.message });
  }
  // Cierra el modal
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editarCiudadanoModal'));
  modal.hide();
  renderCiudadanos();
}

// Vincular eventos al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  renderCiudadanos();
  document.getElementById("formCrearCiudadano").addEventListener("submit", handleCrearCiudadano);
  document.getElementById("editarCiudadano").addEventListener("submit", handleEditarCiudadano);
});

export { renderCiudadanos, borrarCiudadano, editarCiudadano }; 