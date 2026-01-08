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
  },

  async getClients(accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener los clientes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en appointmentsService.getClients:', error);
      throw error;
    }
  },

  async getVehiclesByClient(clientId: string, accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/vehicles?client_id=${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener los vehículos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en appointmentsService.getVehiclesByClient:', error);
      throw error;
    }
  },

  async getAppointments(accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener las citas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en appointmentsService.getAppointments:', error);
      throw error;
    }
  },

  async getVehicles(accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/vehicles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener los vehículos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en appointmentsService.getVehicles:', error);
      throw error;
    }
  }
};
