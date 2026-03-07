import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  Users,
  FileText,
  MapPin,
  Clock,
  Flag,
  Calendar,
  UserCog,
  Settings,
  LogOut,
  Heart,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Gestión de Víctimas', href: '/admin/victims', icon: Users },
    { name: 'Testimonios', href: '/admin/testimonies', icon: FileText },
    { name: 'Mapa de Memoria', href: '/admin/map', icon: MapPin },
    { name: 'Línea de Tiempo', href: '/admin/timeline', icon: Clock },
    { name: 'Casos Reportados', href: '/admin/reports', icon: Flag },
    { name: 'Eventos', href: '/admin/events', icon: Calendar },
    { name: 'Usuarios Admin', href: '/admin/users', icon: UserCog },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-[#F6F3ED]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-[#2E4739] to-[#254032] text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B2916F] to-[#9a7d5f] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <div>
                  <div className="font-display text-sm text-white">Santuarios</div>
                  <div className="text-xs text-white/60">Admin Panel</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-white/10 rounded transition-colors mx-auto"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-[#B2916F] text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen ? (
            <div className="mb-3">
              <div className="text-sm font-medium text-white">{user?.name}</div>
              <div className="text-xs text-white/60">{user?.email}</div>
            </div>
          ) : null}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`${
              sidebarOpen ? 'w-full' : 'w-full px-2'
            } justify-start gap-3 text-white hover:bg-white/10 hover:text-white`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="bg-[#FFFDF8] border-b border-[#2E4739]/10 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display text-[#2E4739]">
                Panel Administrativo
              </h1>
              <p className="text-sm text-[#6b6b5b]">
                Gestión de Santuarios de la Memoria
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2 border-[#2E4739] text-[#2E4739] hover:bg-[#2E4739] hover:text-white">
                <Heart className="w-4 h-4" />
                Ver Sitio Público
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}