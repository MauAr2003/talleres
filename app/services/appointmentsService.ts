const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CreateAppointmentData {
  appointment_date: string;
  client_id: string;
  vehicle_id: string;
  appointment_type: string;
  branch_id: string;
  user_id: string;
  advisor_id: string;
  start_time: string;
  end_time: string;
  estimated_duration: number;
  status: string;
  sequence?: string;
  notes?: string;
}

export const appointmentsService = {
  async createAppointment(data: CreateAppointmentData, accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la cita');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en appointmentsService.createAppointment:', error);
      throw error;
    }
  }
};
