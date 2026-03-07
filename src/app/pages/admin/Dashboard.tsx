import { Users, FileText, MapPin, Flag, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export function Dashboard() {
  const stats = [
    {
      title: 'Víctimas Registradas',
      value: '24',
      description: 'Total de casos documentados',
      icon: Users,
      trend: '+2 este mes',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Testimonios Publicados',
      value: '18',
      description: 'Historias compartidas',
      icon: FileText,
      trend: '+5 nuevos',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Lugares de Memoria',
      value: '12',
      description: 'Puntos en el mapa',
      icon: MapPin,
      trend: '3 regiones',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Casos Reportados',
      value: '7',
      description: 'Pendientes de revisión',
      icon: Flag,
      trend: 'Requieren atención',
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Eventos Programados',
      value: '5',
      description: 'Próximas actividades',
      icon: Calendar,
      trend: '2 este mes',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Visitas al Sitio',
      value: '1,234',
      description: 'Este mes',
      icon: TrendingUp,
      trend: '+15% vs mes anterior',
      color: 'from-[#d4af37] to-[#c49d2f]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-[#2d4a5c] to-[#1a1a1a] rounded-xl p-8 text-white">
        <h2 className="font-display text-3xl mb-2">Bienvenido al Panel Administrativo</h2>
        <p className="text-white/80">
          Gestiona la información del proyecto Santuarios de la Memoria - Samaná, Caldas
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardDescription className="text-xs uppercase tracking-wide">
                      {stat.title}
                    </CardDescription>
                    <CardTitle className="text-4xl mt-2">{stat.value}</CardTitle>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-1">{stat.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nuevo testimonio publicado', time: 'Hace 2 horas', user: 'Admin Principal' },
                { action: 'Víctima actualizada: María López', time: 'Hace 5 horas', user: 'Editor 1' },
                { action: 'Caso reportado aprobado', time: 'Hace 1 día', user: 'Moderador' },
                { action: 'Evento creado: Conmemoración Anual', time: 'Hace 2 días', user: 'Admin Principal' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37] mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.time} • {item.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas pendientes y sugerencias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">Revisar 7 casos reportados</p>
                    <p className="text-xs text-gray-500 mt-1">Pendientes de aprobación</p>
                  </div>
                  <Flag className="w-5 h-5 text-amber-500" />
                </div>
              </button>

              <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">Actualizar línea de tiempo</p>
                    <p className="text-xs text-gray-500 mt-1">Agregar eventos de 2025</p>
                  </div>
                  <Calendar className="w-5 h-5 text-indigo-500" />
                </div>
              </button>

              <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">Verificar testimonios nuevos</p>
                    <p className="text-xs text-gray-500 mt-1">5 testimonios sin revisar</p>
                  </div>
                  <FileText className="w-5 h-5 text-green-500" />
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
