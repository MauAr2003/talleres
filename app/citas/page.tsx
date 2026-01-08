'use client';

import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import NuevaCitaModal from '../components/citas/NuevaCitaModal';

// TODO: BORRAR ESTOS DATOS CUANDO SE IMPLEMENTE EL BACKEND
const citasMock = [
  {
    folio: 'APT-2026-001',
    fecha: '02/01/2026',
    hora: '09:00',
    cliente: {
      nombre: 'Juan Pérez',
      telefono: '55-1234-5678'
    },
    vehiculo: 'Toyota Camry 2020 - ABC-123',
    servicio: 'Mantenimiento Preventivo',
    asesor: 'María López',
    estado: 'confirmada'
  },
  {
    folio: 'APT-2026-002',
    fecha: '02/01/2026',
    hora: '10:00',
    cliente: {
      nombre: 'María González',
      telefono: '55-2345-6789'
    },
    vehiculo: 'Honda Civic 2019 - XYZ-789',
    servicio: 'Cambio de Frenos',
    asesor: 'Juan Pérez',
    estado: 'en_servicio'
  },
  {
    folio: 'APT-2026-003',
    fecha: '02/01/2026',
    hora: '12:00',
    cliente: {
      nombre: 'Carlos López',
      telefono: '55-3456-7890'
    },
    vehiculo: 'Nissan Sentra 2021 - DEF-456',
    servicio: 'Afinación',
    asesor: 'María López',
    estado: 'pendiente'
  },
  {
    folio: 'APT-2026-004',
    fecha: '02/01/2026',
    hora: '14:00',
    cliente: {
      nombre: 'Ana Martínez',
      telefono: '55-4567-8901'
    },
    vehiculo: 'Mazda 3 2018 - GHI-789',
    servicio: 'Diagnóstico Motor',
    asesor: 'Juan Pérez',
    estado: 'confirmada'
  }
];

export default function CitasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEstadoBadge = (estado: string) => {
    const badges = {
      pendiente: 'bg-gray-400 text-white',
      confirmada: 'bg-blue-500 text-white',
      en_servicio: 'bg-green-500 text-white',
      completada: 'bg-purple-500 text-white',
      cancelada: 'bg-red-500 text-white'
    };

    const labels = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      en_servicio: 'En Servicio',
      completada: 'Completada',
      cancelada: 'Cancelada'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[estado as keyof typeof badges]}`}>
        {labels[estado as keyof typeof labels]}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Citas</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gestión de citas y agendamiento</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Nueva Cita
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 flex items-center gap-4 transition-colors duration-300">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por cliente, folio o vehículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="en_servicio">En Servicio</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        {/* Citas Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Citas Programadas</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Folio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha y Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vehículo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Asesor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {citasMock.map((cita) => (
                  <tr key={cita.folio} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {cita.folio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>{cita.fecha}</div>
                      <div className="text-gray-500 dark:text-gray-400">{cita.hora}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">{cita.cliente.nombre}</div>
                      <div className="text-gray-500 dark:text-gray-400">{cita.cliente.telefono}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {cita.vehiculo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {cita.servicio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {cita.asesor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getEstadoBadge(cita.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors">
                          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors">
                          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Nueva Cita */}
        <NuevaCitaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}