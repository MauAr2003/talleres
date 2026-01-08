'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentsService } from '../../services/appointmentsService';

interface NuevaCitaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Función para obtener la fecha de mañana a las 9:00 AM en formato datetime-local
const getTomorrowAt9AM = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  // Formato: YYYY-MM-DDTHH:mm
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  const hours = String(tomorrow.getHours()).padStart(2, '0');
  const minutes = String(tomorrow.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Función para calcular la hora de fin basada en inicio + duración
const calculateEndTime = (startTime: string, durationMinutes: number) => {
  if (!startTime) return '';
  const start = new Date(startTime);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const year = end.getFullYear();
  const month = String(end.getMonth() + 1).padStart(2, '0');
  const day = String(end.getDate()).padStart(2, '0');
  const hours = String(end.getHours()).padStart(2, '0');
  const minutes = String(end.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function NuevaCitaModal({ isOpen, onClose }: NuevaCitaModalProps) {
  const { accessToken, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Inicializar con valores por defecto
  const defaultStartTime = getTomorrowAt9AM();
  const defaultEndTime = calculateEndTime(defaultStartTime, 60);

  const [formData, setFormData] = useState({
    // Campos requeridos
    appointment_date: defaultStartTime,
    client_id: '',
    vehicle_id: '',
    appointment_type: '',
    branch_id: user?.branch_id || '',
    user_id: user?.id || '',
    advisor_id: '',
    start_time: defaultStartTime,
    end_time: defaultEndTime,
    estimated_duration: 60,
    status: 'programado',
    // Campos opcionales
    sequence: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Función para convertir fecha a ISO con segundos en 0
      const toISOWithZeroSeconds = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        date.setSeconds(0, 0); // Setear segundos y milisegundos a 0
        return date.toISOString();
      };

      // Construir el JSON en el formato requerido
      const payload: any = {
        appointment_date: toISOWithZeroSeconds(formData.appointment_date),
        client_id: formData.client_id,
        vehicle_id: formData.vehicle_id,
        appointment_type: formData.appointment_type,
        branch_id: formData.branch_id,
        user_id: formData.user_id,
        advisor_id: formData.advisor_id,
        start_time: toISOWithZeroSeconds(formData.start_time),
        end_time: toISOWithZeroSeconds(formData.end_time),
        estimated_duration: Number(formData.estimated_duration),
        status: formData.status
      };

      // Agregar campos opcionales solo si tienen valor
      if (formData.sequence) {
        payload.sequence = formData.sequence;
      }
      if (formData.notes) {
        payload.notes = formData.notes;
      }

      console.log('Enviando cita:', JSON.stringify(payload, null, 2));

      // Llamar al servicio de appointments
      if (!accessToken) {
        throw new Error('No hay token de acceso. Por favor, inicia sesión nuevamente.');
      }

      const response = await appointmentsService.createAppointment(payload, accessToken);

      console.log('Cita creada exitosamente:', response);

      // Limpiar formulario con valores por defecto
      const newDefaultStartTime = getTomorrowAt9AM();
      const newDefaultEndTime = calculateEndTime(newDefaultStartTime, 60);

      setFormData({
        appointment_date: newDefaultStartTime,
        client_id: '',
        vehicle_id: '',
        appointment_type: '',
        branch_id: user?.branch_id || '',
        user_id: user?.id || '',
        advisor_id: '',
        start_time: newDefaultStartTime,
        end_time: newDefaultEndTime,
        estimated_duration: 60,
        status: 'programado',
        sequence: '',
        notes: ''
      });

      // Cerrar modal
      onClose();

      // TODO: Actualizar la lista de citas después de crear una nueva

    } catch (err: any) {
      console.error('Error al crear cita:', err);
      setError(err.message || 'Error al crear la cita. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: name === 'estimated_duration' ? Number(value) : value
      };

      // Si cambia start_time o estimated_duration, recalcular end_time automáticamente
      if (name === 'start_time') {
        updatedData.end_time = calculateEndTime(value, prev.estimated_duration);
      } else if (name === 'estimated_duration') {
        updatedData.end_time = calculateEndTime(prev.start_time, Number(value));
      }

      return updatedData;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-8 pt-8 pb-2 flex items-start justify-between z-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Generar Nueva Cita</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completa el formulario para agendar tu cita de servicio</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors -mt-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Client ID */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Cliente <span className="text-red-500">*</span>
              </label>
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              >
                <option value="">Selecciona un cliente</option>
                <option value="client1">Cliente 1</option>
                <option value="client2">Cliente 2</option>
              </select>
            </div>

            {/* Vehicle ID */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Vehículo <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicle_id"
                value={formData.vehicle_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              >
                <option value="">Selecciona un vehículo</option>
                <option value="vehicle1">Vehículo 1</option>
                <option value="vehicle2">Vehículo 2</option>
              </select>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Tipo de Reparación <span className="text-red-500">*</span>
              </label>
              <select
                name="appointment_type"
                value={formData.appointment_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              >
                <option value="">Selecciona un tipo</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="reparacion">Reparación</option>
                <option value="diagnostico">Diagnóstico</option>
                <option value="revision">Revisión</option>
              </select>
            </div>

            {/* Branch ID - Hidden (se envía automáticamente) */}
            <input
              type="hidden"
              name="branch_id"
              value={formData.branch_id}
            />

            {/* User ID - Hidden (se envía automáticamente) */}
            <input
              type="hidden"
              name="user_id"
              value={formData.user_id}
            />

            {/* End Time - Hidden (calculado automáticamente) */}
            <input
              type="hidden"
              name="end_time"
              value={formData.end_time}
            />

            {/* Status - Hidden (programado por defecto) */}
            <input
              type="hidden"
              name="status"
              value={formData.status}
            />

            {/* Estimated Duration - Hidden (60 minutos por defecto) */}
            <input
              type="hidden"
              name="estimated_duration"
              value={formData.estimated_duration}
            />

            {/* Advisor ID */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Asesor <span className="text-red-500">*</span>
              </label>
              <select
                name="advisor_id"
                value={formData.advisor_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              >
                <option value="">Selecciona un asesor</option>
                <option value="advisor1">Asesor 1</option>
                <option value="advisor2">Asesor 2</option>
              </select>
            </div>

            {/* Appointment Date */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date.split('T')[0]}
                onChange={(e) => {
                  const date = e.target.value;
                  const time = formData.start_time.split('T')[1] || '09:00';
                  const newDateTime = `${date}T${time}`;
                  setFormData(prev => ({
                    ...prev,
                    appointment_date: newDateTime,
                    start_time: newDateTime,
                    end_time: calculateEndTime(newDateTime, prev.estimated_duration)
                  }));
                }}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time.split('T')[1] || ''}
                onChange={(e) => {
                  const time = e.target.value;
                  const date = formData.start_time.split('T')[0];
                  const newDateTime = `${date}T${time}`;
                  setFormData(prev => ({
                    ...prev,
                    start_time: newDateTime,
                    appointment_date: newDateTime,
                    end_time: calculateEndTime(newDateTime, prev.estimated_duration)
                  }));
                }}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Duración Estimada (minutos) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="estimated_duration"
                value={formData.estimated_duration}
                onChange={handleChange}
                placeholder="60"
                min="15"
                step="15"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Notes - Full Width - Opcional */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Notas Adicionales
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Observaciones o comentarios sobre la cita..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando Cita...
                </>
              ) : (
                'Generar Cita'
              )}
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Los campos marcados con <span className="text-red-500">*</span> son obligatorios
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
