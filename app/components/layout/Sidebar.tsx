'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';

const menuItems = [
  { name: 'Dashboard', icon: '/icons/dashboardWhite.svg', path: '/dashboard' },
  { name: 'Citas', icon: '/icons/citasWhite.svg', path: '/citas' },
  { name: 'Orden de servicio', icon: '/icons/servicioWhite.svg', path: '/orden-servicio' },
  { name: 'Orden de Trabajo', icon: '/icons/trabajoWhite.svg', path: '/orden-trabajo' },
  { name: 'Recepción', icon: '/icons/trabajoWhite.svg', path: '/recepcion' },
  { name: 'Cotizaciones', icon: '/icons/finanzasWhite.svg', path: '/cotizaciones' },
  { name: 'Inventario', icon: '/icons/inventarioWhite.svg', path: '/inventario' },
  { name: 'Compras', icon: '/icons/comprasWhite.svg', path: '/compras' },
  { name: 'Proveedores', icon: '/icons/proveedoresWhite.svg', path: '/proveedores' },
  { name: 'Finanzas', icon: '/icons/finanzasWhite.svg', path: '/finanzas' },
  { name: 'Configuración', icon: '/icons/configWhite.svg', path: '/configuracion' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Image
          src="/icons/CarSystemBlack.png"
          alt="CarSystem"
          width={120}
          height={32}
          className="dark:hidden"
        />
        <Image
          src="/icons/CasSystemWhite.png"
          alt="CarSystem"
          width={120}
          height={32}
          className="hidden dark:block"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 sidebar-nav">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={20}
                      height={20}
                      className={`w-full h-full object-contain ${
                        isActive
                          ? 'brightness-0 invert'
                          : 'brightness-0 dark:brightness-100 dark:invert-0'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions - Notifications and Theme Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-3">
          {/* Notifications Button */}
          <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full notification-badge"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
