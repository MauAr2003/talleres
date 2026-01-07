const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiClient {
  private static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  static async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAccessToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return response;
  }

  static async get(endpoint: string, options: RequestInit = {}): Promise<Response> {
    return this.fetch(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  static async post(endpoint: string, data?: any, options: RequestInit = {}): Promise<Response> {
    return this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put(endpoint: string, data?: any, options: RequestInit = {}): Promise<Response> {
    return this.fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete(endpoint: string, options: RequestInit = {}): Promise<Response> {
    return this.fetch(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}
