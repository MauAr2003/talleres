'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Página Protegida</h1>

          <div className="space-y-4 mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bienvenido</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{user.username}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rol</p>
                <p className="text-gray-900 dark:text-white font-medium capitalize">{user.role}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ID de Usuario</p>
                <p className="text-gray-900 dark:text-white font-medium font-mono text-sm">{user.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sucursal</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.branch_id}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Esta es una página protegida. Solo usuarios autenticados pueden verla.</p>
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
    </MainLayout>
  );
}
