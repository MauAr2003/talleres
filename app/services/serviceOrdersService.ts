const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ServiceOrder {
  _id: string;
  appointment_id: string;
  branch_id: string;
  created_by: string;
  assigned_to?: string;
  client_id: string;
  vehicle_id: string;
  advisor_id: string;
  appointment_status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  __v: number;
}

export interface ServiceOrdersResponse {
  ok: boolean;
  message: string;
  data: ServiceOrder[];
}

export const serviceOrdersService = {
  async getServiceOrders(accessToken: string): Promise<ServiceOrdersResponse> {
    try {
      const response = await fetch(`${API_URL}/service-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener las órdenes de servicio');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en serviceOrdersService.getServiceOrders:', error);
      throw error;
    }
  }
};
