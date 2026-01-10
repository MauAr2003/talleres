'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { serviceOrdersService, ServiceOrder } from '../services/serviceOrdersService';
import { appointmentsService } from '../services/appointmentsService';

export default function OrdenServicioPage() {
  const { accessToken } = useAuth();
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar órdenes de servicio, citas, clientes y vehículos cuando el componente se monte
  useEffect(() => {
    if (accessToken) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Cargar órdenes de servicio, citas, clientes y vehículos en paralelo
      const [ordersResponse, appointmentsResponse, clientsResponse, vehiclesResponse] = await Promise.all([
        serviceOrdersService.getServiceOrders(accessToken!),
        appointmentsService.getAppointments(accessToken!),
        appointmentsService.getClients(accessToken!),
        appointmentsService.getVehicles(accessToken!)
      ]);

      setServiceOrders(ordersResponse.data || []);
      setAppointments(appointmentsResponse.data || []);
      setClients(clientsResponse.data || []);
      setVehicles(vehiclesResponse.data || []);
    } catch (error: any) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar las órdenes de servicio');
    } finally {
      setLoading(false);
    }
  };

  // Función para encontrar una cita por su ID
  const getAppointmentById = (appointmentId: string) => {
    return appointments.find(appt => appt._id === appointmentId);
  };

  // Función para encontrar un cliente por su ID
  const getClientById = (clientId: string) => {
    return clients.find(client => (client._id || client.id) === clientId);
  };

  // Función para encontrar un vehículo por su ID
  const getVehicleById = (vehicleId: string) => {
    return vehicles.find(vehicle => (vehicle._id || vehicle.id) === vehicleId);
  };

  // Filtrar órdenes por estado (esta es una aproximación temporal)
  // Más adelante podrías tener un campo específico para el pipeline
  const diagnosticoOrders = serviceOrders.filter(order =>
    order.appointment_status === 'diagnostico' || order.appointment_status === 'programado'
  );

  const cotizacionOrders = serviceOrders.filter(order =>
    order.appointment_status === 'cotizacion'
  );

  const autorizacionOrders = serviceOrders.filter(order =>
    order.appointment_status === 'autorizacion' || order.appointment_status === 'confirmada'
  );

  const terminadoOrders = serviceOrders.filter(order =>
    order.appointment_status === 'completado' || order.appointment_status === 'completada'
  );

  const getStatusBadge = (status: string) => {
    const badges = {
      'programado': 'bg-blue-500 text-white',
      'en_proceso': 'bg-yellow-500 text-white',
      'completado': 'bg-green-500 text-white',
      'cancelado': 'bg-red-500 text-white'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-400 text-white';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOrderCard = (order: any) => {
    const appointment = getAppointmentById(order.appointment_id);
    const client = getClientById(order.client_id);
    const vehicle = getVehicleById(order.vehicle_id);

    // Obtener el nombre del cliente
    const clientName = client?.name || client?.full_name ||
      `${client?.first_name || ''} ${client?.last_name || ''}`.trim() ||
      order.client_id;

    // Obtener el VIN del vehículo
    const vehicleVIN = vehicle?.vin || order.vehicle_id;

    return (
      <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mb-4">
        {/* Header con Folio/Sequence y Estado */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {appointment?.sequence || order._id.slice(-8)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.appointment_status)}`}>
            {order.appointment_status}
          </span>
        </div>

        {/* Tipo de servicio */}
        {appointment?.appointment_type && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1 mb-2">
            <p className="text-xs text-blue-700 dark:text-blue-300 capitalize">
              {appointment.appointment_type}
            </p>
          </div>
        )}

        {/* Cliente */}
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-semibold">Cliente:</span>{' '}
          <span className="text-gray-900 dark:text-white">{clientName}</span>
        </div>

        {/* Vehículo - VIN */}
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-semibold">VIN del vehículo:</span>{' '}
          <span className="font-mono text-gray-900 dark:text-white">{vehicleVIN}</span>
        </div>

        {/* Asesor */}
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-semibold">Asesor:</span>{' '}
          <span className="text-gray-900 dark:text-white">{order.advisor_id}</span>
        </div>

        {/* Duración estimada */}
        {appointment?.estimated_duration && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-semibold">Duración:</span>{' '}
            <span className="text-gray-900 dark:text-white">{appointment.estimated_duration} min</span>
          </div>
        )}

        {/* Fecha de la cita */}
        {appointment?.appointment_date && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-semibold">Fecha de cita:</span>{' '}
            <span className="text-gray-900 dark:text-white">{formatDate(appointment.appointment_date)}</span>
          </div>
        )}

        {/* Notas */}
        {appointment?.notes && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-semibold">Notas:</span>{' '}
            <span className="italic text-gray-900 dark:text-white line-clamp-2">"{appointment.notes}"</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pipeline del Taller</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Vista Kanban de las órdenes de trabajo en proceso</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando órdenes de servicio...</span>
          </div>
        ) : (
          /* Kanban Board - 4 Columnas */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Columna 1: Diagnóstico */}
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Diagnóstico</h2>
              </div>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                {diagnosticoOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {diagnosticoOrders.map(renderOrderCard)}
            </div>
          </div>

          {/* Columna 2: Cotización */}
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cotización</h2>
              </div>
              <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                {cotizacionOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {cotizacionOrders.map(renderOrderCard)}
            </div>
          </div>

          {/* Columna 3: Autorización */}
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Autorización</h2>
              </div>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-medium">
                {autorizacionOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {autorizacionOrders.map(renderOrderCard)}
            </div>
          </div>

          {/* Columna 4: Terminado */}
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Terminado</h2>
              </div>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                {terminadoOrders.length}
              </span>
            </div>
            <div className="space-y-3">
              {terminadoOrders.map(renderOrderCard)}
            </div>
          </div>
        </div>
        )}
      </div>
    </MainLayout>
  );
}
