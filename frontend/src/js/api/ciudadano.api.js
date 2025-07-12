const API_URL = "http://localhost:4100/ciudadanos";

export async function crearCiudadano(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function listarCiudadanos() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function obtenerCiudadanoPorId(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

export async function actualizarCiudadano(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function eliminarCiudadano(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  return await res.json();
} 