import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient'; // Ajusta la ruta a tu cliente de axios/fetch
import './GestionMesas.css';

const GestionMesas = () => {
  const [salones, setSalones] = useState([]);
  const [salonSeleccionado, setSalonSeleccionado] = useState('');
  const [mesas, setMesas] = useState([]);
  
  // Estado para la creación masiva
  const [cantidad, setCantidad] = useState(1);
  
  // Estados de interfaz
  const [cargandoSalones, setCargandoSalones] = useState(true);
  const [cargandoMesas, setCargandoMesas] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  // Modal para ver/imprimir el QR de una mesa
  const [mesaQR, setMesaQR] = useState(null);

  // 1. Cargar la lista de salones al montar el componente
  useEffect(() => {
    obtenerSalones();
  }, []);

  // 2. Cargar las mesas cada vez que cambie el salón seleccionado
  useEffect(() => {
    if (salonSeleccionado) {
      obtenerMesas(salonSeleccionado);
    } else {
      setMesas([]);
    }
  }, [salonSeleccionado]);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => {
      setMensaje({ tipo: '', texto: '' });
    }, 4000);
  };

  const obtenerSalones = async () => {
    setCargandoSalones(true);
    try {
      const response = await apiClient.get('/salones');
      // Maneja tanto { salones: [...] } como array directo [...]
      const listaSalones = response.data.salones || response.data || [];
      setSalones(listaSalones);

      if (listaSalones.length > 0) {
        setSalonSeleccionado(listaSalones[0]._id);
      }
    } catch (error) {
      mostrarMensaje('error', error.response?.data?.message || 'Error al obtener la lista de salones');
    } finally {
      setCargandoSalones(false);
    }
  };

  const obtenerMesas = async (salonId) => {
    setCargandoMesas(true);
    try {
      const response = await apiClient.get(`/mesas/${salonId}`);
      const listaMesas = response.data.mesas || response.data || [];
      setMesas(listaMesas);
    } catch (error) {
      mostrarMensaje('error', error.response?.data?.message || 'Error al obtener las mesas del salón');
    } finally {
      setCargandoMesas(false);
    }
  };

  const handleCrearMesas = async (e) => {
    e.preventDefault();
    if (!salonSeleccionado) {
      mostrarMensaje('error', 'Selecciona un salón antes de agregar mesas');
      return;
    }

    if (cantidad < 1) {
      mostrarMensaje('error', 'La cantidad debe ser al menos 1');
      return;
    }

    setProcesando(true);
    try {
      const response = await apiClient.post('/mesas', {
        cantidad: Number(cantidad),
        salonId: salonSeleccionado
      });

      mostrarMensaje('exito', response.data.message || 'Mesas creadas exitosamente');
      setCantidad(1);
      obtenerMesas(salonSeleccionado);
    } catch (error) {
      mostrarMensaje('error', error.response?.data?.message || 'Error al agregar las mesas');
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarMesa = async (mesaId, numero) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar la Mesa #${numero}?`);
    if (!confirmacion) return;

    setProcesando(true);
    try {
      await apiClient.delete(`/mesas/${mesaId}`);
      mostrarMensaje('exito', `Mesa #${numero} eliminada correctamente`);
      setMesas((prev) => prev.filter((m) => m._id !== mesaId));
    } catch (error) {
      mostrarMensaje('error', error.response?.data?.message || 'No se pudo eliminar la mesa');
    } finally {
      setProcesando(false);
    }
  };

  const abrirModalQR = (mesa) => {
    setMesaQR(mesa);
  };

  const cerrarModalQR = () => {
    setMesaQR(null);
  };

  const imprimirQR = () => {
    window.print();
  };

  // URL para el código QR (apunta a la vista del cliente)
  const getQRUrl = (token) => `${window.location.origin}/cliente/mesa/${token}`;

  return (
    <div className="gestion-mesas-container">
      <header className="gestion-mesas-header">
        <h2>Gestión de Mesas</h2>
        <p>Administra la distribución de mesas y genera sus códigos QR por salón.</p>
      </header>

      {mensaje.texto && (
        <div className={`alert-banner ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Panel Superior: Selección de Salón y Formulario */}
      <div className="gestion-mesas-controls">
        <div className="control-group">
          <label htmlFor="select-salon">Salón Activo:</label>
          {cargandoSalones ? (
            <span className="spinner-sm">Cargando salones...</span>
          ) : (
            <select
              id="select-salon"
              value={salonSeleccionado}
              onChange={(e) => setSalonSeleccionado(e.target.value)}
              disabled={procesando}
            >
              {salones.length === 0 ? (
                <option value="">No hay salones registrados</option>
              ) : (
                salones.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.nombre}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        <form className="control-group form-crear-mesas" onSubmit={handleCrearMesas}>
          <label htmlFor="input-cantidad">Agregar Mesas:</label>
          <div className="input-with-button">
            <input
              id="input-cantidad"
              type="number"
              min="1"
              max="50"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              disabled={procesando || !salonSeleccionado}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={procesando || !salonSeleccionado}
            >
              {procesando ? 'Agregando...' : '+ Crear Mesas'}
            </button>
          </div>
        </form>
      </div>

      {/* Grid de Mesas */}
      <div className="mesas-grid-container">
        {cargandoMesas ? (
          <div className="loading-state">Obteniendo mesas del salón...</div>
        ) : mesas.length === 0 ? (
          <div className="empty-state">
            {salonSeleccionado
              ? 'No hay mesas registradas en este salón. ¡Agrega la primera arriba!'
              : 'Selecciona un salón para ver sus mesas.'}
          </div>
        ) : (
          <div className="mesas-grid">
            {mesas.map((mesa) => (
              <div key={mesa._id} className="mesa-card">
                <div className="mesa-card-header">
                  <span className="mesa-numero">Mesa #{mesa.numero}</span>
                  <span className={`badge-estado estado-${mesa.estado?.toLowerCase()}`}>
                    {mesa.estado}
                  </span>
                </div>

                <div className="mesa-card-body">
                  <div className="qr-preview" onClick={() => abrirModalQR(mesa)}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        getQRUrl(mesa.qr_token)
                      )}`}
                      alt={`QR Mesa ${mesa.numero}`}
                    />
                    <small>Haz clic para ampliar</small>
                  </div>
                </div>

                <div className="mesa-card-actions">
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => abrirModalQR(mesa)}
                  >
                    🔍 Ver QR
                  </button>
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => handleEliminarMesa(mesa._id, mesa.numero)}
                    disabled={procesando || mesa.estado !== 'Libre'}
                    title={mesa.estado !== 'Libre' ? 'Solo puedes eliminar mesas libres' : 'Eliminar mesa'}
                  >
                    🗑️ Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Visualización e Impresión de Código QR */}
      {mesaQR && (
        <div className="modal-overlay" onClick={cerrarModalQR}>
          <div className="modal-content print-area" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close no-print" onClick={cerrarModalQR}>
              ×
            </button>
            
            <div className="qr-modal-body">
              <h3>Mesa #{mesaQR.numero}</h3>
              <p className="qr-salon-name">
                {salones.find((s) => s._id === salonSeleccionado)?.nombre || 'Salón'}
              </p>

              <div className="qr-large-container">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    getQRUrl(mesaQR.qr_token)
                  )}`}
                  alt={`QR Mesa ${mesaQR.numero}`}
                />
              </div>

              <p className="qr-instruction">
                Escanea este código QR con tu celular para revisar la carta y realizar pedidos.
              </p>
            </div>

            <div className="modal-actions no-print">
              <button className="btn-primary" onClick={imprimirQR}>
                🖨️ Imprimir QR
              </button>
              <button className="btn-secondary" onClick={cerrarModalQR}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMesas;