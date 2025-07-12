import { Grid, h } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const url = "http://localhost:4100/ciudadano";
let gridInstance = null;
let modalEditar;
let formularioEditar;
let idCiudadanoEditar = null;
let btnCrear = document.querySelector("#btnCrear");
let modoFormulario = 'crear'; // Para saber si estamos creando o editando

document.addEventListener('DOMContentLoaded', () => {
    inicializarGrid();
    modalEditar = new bootstrap.Modal(document.getElementById('editarCiudadanoModal'));
    formularioEditar = document.getElementById('editarCiudadano');
    
    // Manejar el envío del formulario
    formularioEditar.addEventListener('submit', handleSubmitForm);

    // Evento para el botón crear
    btnCrear.addEventListener('click', () => {
        modoFormulario = 'crear';
        limpiarFormulario();
        modalEditar.show();
    });
});

function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('apodo').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('planetaOrigen').value = '';
    document.getElementById('planetaResidencia').value = '';
    document.getElementById('QR').value = '';
    document.getElementById('estado').value = '1'; // Por defecto "Vivo"
    idCiudadanoEditar = null;
}

async function handleSubmitForm(e) {
    e.preventDefault();
    
    try {
        const formData = {
            Nombre: document.getElementById('nombre').value,
            Apellido: document.getElementById('apellido').value,
            Apodo: document.getElementById('apodo').value,
            FechaNacimiento: document.getElementById('fecha').value,
            planetaOrigen: document.getElementById('planetaOrigen').value,
            planetaRedidencia: document.getElementById('planetaResidencia').value,
            foto: "tin",
            QR: document.getElementById('QR').value,
            estado: parseInt(document.getElementById('estado').value)
        };

        console.log('Datos a enviar:', formData);

        // URL y método según el modo (crear o editar)
        const config = {
            method: modoFormulario === 'crear' ? 'POST' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        };

        const endpoint = modoFormulario === 'crear' 
            ? `${url}/crear`
            : `${url}/editar/${idCiudadanoEditar}`;

        const response = await fetch(endpoint, config);
        const responseData = await response.json();

        if (response.ok && responseData.estado === "ok") {
            alert(modoFormulario === 'crear' ? 'Ciudadano creado correctamente' : 'Ciudadano actualizado correctamente');
            modalEditar.hide();
            await actualizarTabla();
        } else {
            throw new Error(responseData.data || 'Error al procesar la solicitud');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

async function obtenerDatos() {
    try {
        const response = await fetch(url + '/traerTodo');
        const datos = await response.json();
        return datos.data.map(ciudadano => ({
            codigo: ciudadano.Codigo,
            nombre: ciudadano.Nombre,
            apellido: ciudadano.Apellido,
            apodo: ciudadano.Apodo,
            fechaNacimiento: new Date(ciudadano.FechaNacimiento).toLocaleDateString('es-ES'),
            planetaOrigen: ciudadano.planetaOrigen,
            planetaResidencia: ciudadano.planetaRedidencia,
            qr: ciudadano.QR,
            estado: formatearEstado(ciudadano.estado),
            acciones: ciudadano.Codigo
        }));
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return [];
    }
}

function formatearEstado(estado) {
    switch(estado) {
        case 0: return 'Muerto';
        case 1: return 'Vivo';
        case 2: return 'Congelado';
        default: return 'Desconocido';
    }
}

function inicializarGrid() {
    gridInstance = new Grid({
        columns: [
            { 
                name: 'Código',
                id: 'codigo'
            },
            { 
                name: 'Nombre',
                id: 'nombre'
            },
            { 
                name: 'Apellido',
                id: 'apellido'
            },
            { 
                name: 'Apodo',
                id: 'apodo'
            },
            { 
                name: 'Fecha Nacimiento',
                id: 'fechaNacimiento'
            },
            { 
                name: 'Planeta Origen',
                id: 'planetaOrigen'
            },
            { 
                name: 'Planeta Residencia',
                id: 'planetaResidencia'
            },
            { 
                name: 'QR',
                id: 'qr'
            },
            { 
                name: 'Estado',
                id: 'estado'
            },
            {
                name: 'Acciones',
                formatter: (_, row) => {
                    return h('div', null, [
                        h('button', {
                            className: 'btn btn-primary btn-sm me-2',
                            onClick: () => editarCiudadano(row.cells[0].data)
                        }, [
                            h('i', { className: 'bi bi-pencil-fill' })
                        ]),
                        h('button', {
                            className: 'btn btn-danger btn-sm',
                            onClick: () => borrarCiudadano(row.cells[0].data)
                        }, [
                            h('i', { className: 'bi bi-trash' })
                        ])
                    ]);
                }
            }
        ],
        data: [],
        search: true,
        pagination: {
            enabled: true,
            limit: 5
        },
        sort: true,
        language: {
            search: {
                placeholder: 'Buscar...'
            },
            pagination: {
                previous: 'Anterior',
                next: 'Siguiente',
                showing: 'Mostrando',
                results: () => 'registros'
            }
        }
    }).render(document.getElementById("tablaCiudadano"));

    actualizarTabla();
}

async function actualizarTabla() {
    const datos = await obtenerDatos();
    gridInstance.updateConfig({
        data: datos
    }).forceRender();
}

async function editarCiudadano(codigo) {
    try {
        modoFormulario = 'editar';
        idCiudadanoEditar = codigo;
        const response = await fetch(`${url}/traerTodo`);
        const datos = await response.json();
        const ciudadano = datos.data.find(c => c.Codigo === codigo);

        if (ciudadano) {
            document.getElementById('nombre').value = ciudadano.Nombre;
            document.getElementById('apellido').value = ciudadano.Apellido;
            document.getElementById('apodo').value = ciudadano.Apodo;
            document.getElementById('fecha').value = ciudadano.FechaNacimiento.split('T')[0];
            document.getElementById('planetaOrigen').value = ciudadano.planetaOrigen;
            document.getElementById('planetaResidencia').value = ciudadano.planetaRedidencia;
            document.getElementById('QR').value = ciudadano.QR;
            document.getElementById('estado').value = ciudadano.estado;
            
            modalEditar.show();
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('No se pudo cargar los datos del ciudadano');
    }
}

async function borrarCiudadano(codigo) {
    try {
        if (confirm('¿Estás seguro de que quieres cambiar el estado a muerto?')) {
            const response = await fetch(`${url}/eliminar/${codigo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    estado: 0  // 0 = Muerto
                })
            });

            if (response.ok) {
                alert('Estado del ciudadano actualizado a muerto');
                await actualizarTabla();
            } else {
                throw new Error('Error al actualizar estado');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo actualizar el estado del ciudadano');
    }
}