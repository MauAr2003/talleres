'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function PaginaProtegida() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Página Protegida</h1>

          <div className="space-y-4 mb-8">
            <div className="border-b pb-4">
              <p className="text-sm text-gray-600 mb-1">Bienvenido</p>
              <p className="text-xl font-semibold text-gray-900">{user.username}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Rol</p>
                <p className="text-gray-900 font-medium capitalize">{user.role}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">ID de Usuario</p>
                <p className="text-gray-900 font-medium font-mono text-sm">{user.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Sucursal</p>
                <p className="text-gray-900 font-medium">{user.branch_id}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-gray-600 mb-4">Esta es una página protegida. Solo usuarios autenticados pueden verla.</p>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out"
            >
              {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
