import { Plus, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function TimelineManagement() {
  const events = [
    {
      id: 1,
      date: '2002-03-15',
      title: 'Desaparición de Carlos Andrés Martínez',
      description: 'Primer caso documentado en Samaná',
      type: 'victim',
    },
    {
      id: 2,
      date: '2005-06-20',
      title: 'Creación del Comité de Memoria',
      description: 'Familiares se organizan para exigir verdad',
      type: 'milestone',
    },
    {
      id: 3,
      date: '2025-01-10',
      title: 'Lanzamiento del Proyecto PRY-335',
      description: 'Universidad de Caldas inicia proyecto de memoria',
      type: 'milestone',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-[#1a1a1a]">Línea de Tiempo</h2>
          <p className="text-gray-600 mt-1">Administra eventos históricos del proyecto</p>
        </div>
        <Button className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold text-[#1a1a1a]">28</div>
            </div>
            <p className="text-sm text-gray-600">Eventos Totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">18</div>
            <p className="text-sm text-gray-600">Casos de Víctimas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">10</div>
            <p className="text-sm text-gray-600">Hitos del Proyecto</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Históricos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, idx) => (
              <div key={event.id} className="relative pl-8 pb-8 border-l-2 border-gray-200 last:pb-0">
                <div className="absolute left-0 top-0 w-4 h-4 -ml-[9px] rounded-full bg-[#d4af37] border-4 border-white ring-2 ring-gray-200" />
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                      <h3 className="font-medium text-[#1a1a1a]">{event.title}</h3>
                    </div>
                    <Badge
                      className={
                        event.type === 'victim'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }
                    >
                      {event.type === 'victim' ? 'Víctima' : 'Hito'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
