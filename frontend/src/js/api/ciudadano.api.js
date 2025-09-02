import { apiClient, handleApiError } from '../utils/api.js';

const CIUDADANOS_ENDPOINT = '/ciudadanos';

export async function crearCiudadano(data) {
  try {
    return await apiClient.post(CIUDADANOS_ENDPOINT, data);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function listarCiudadanos() {
  try {
    return await apiClient.get(CIUDADANOS_ENDPOINT);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function obtenerCiudadanoPorId(id) {
  try {
    return await apiClient.get(`${CIUDADANOS_ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function actualizarCiudadano(id, data) {
  try {
    return await apiClient.put(`${CIUDADANOS_ENDPOINT}/${id}`, data);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function eliminarCiudadano(id) {
  try {
    return await apiClient.delete(`${CIUDADANOS_ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
} 