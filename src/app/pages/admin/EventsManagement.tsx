import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function EventsManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const events = [
    {
      id: 1,
      title: 'Conmemoración Anual 2026',
      date: '2026-03-20',
      location: 'Plaza Principal, Samaná',
      status: 'Programado',
      attendees: 150,
    },
    {
      id: 2,
      title: 'Taller de Memoria Histórica',
      date: '2026-04-15',
      location: 'Casa de la Cultura',
      status: 'Programado',
      attendees: 45,
    },
    {
      id: 3,
      title: 'Homenaje a las Víctimas',
      date: '2026-02-10',
      location: 'Parque Municipal',
      status: 'Finalizado',
      attendees: 200,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-[#1a1a1a]">Gestión de Eventos</h2>
          <p className="text-gray-600 mt-1">Administra eventos y actividades conmemorativas</p>
        </div>
        <Button className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2">
          <Plus className="w-4 h-4" />
          Crear Evento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#1a1a1a]">5</div>
            <p className="text-sm text-gray-600">Eventos Programados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">12</div>
            <p className="text-sm text-gray-600">Realizados Este Año</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">1,234</div>
            <p className="text-sm text-gray-600">Asistentes Totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por título o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    {event.date}
                  </div>
                </div>
                <Badge
                  className={
                    event.status === 'Programado'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ubicación</p>
                  <p className="text-sm font-medium">{event.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Asistentes estimados</p>
                  <p className="text-sm font-medium">{event.attendees} personas</p>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Edit className="w-3 h-3" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
