import { Plus, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export function MapManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-[#1a1a1a]">Mapa de Memoria</h2>
          <p className="text-gray-600 mt-1">Gestiona los lugares de memoria en el mapa</p>
        </div>
        <Button className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Marcador
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold text-[#1a1a1a]">12</div>
            </div>
            <p className="text-sm text-gray-600">Lugares Registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">3</div>
            <p className="text-sm text-gray-600">Regiones Cubiertas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <p className="text-sm text-gray-600">Con Fotografías</p>
          </CardContent>
        </Card>
      </div>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa Interactivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Vista de mapa interactivo</p>
              <p className="text-sm text-gray-500 mt-2">
                Aquí se mostrará el mapa con los marcadores de memoria
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations List */}
      <Card>
        <CardHeader>
          <CardTitle>Lugares Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Plaza Principal de Samaná', coords: '5.4167, -75.0167', visits: 24 },
              { name: 'Vereda La Pradera', coords: '5.4200, -75.0200', visits: 18 },
              { name: 'Parque Municipal', coords: '5.4150, -75.0150', visits: 31 },
            ].map((location, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{location.name}</p>
                    <p className="text-xs text-gray-500">{location.coords}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{location.visits}</p>
                  <p className="text-xs text-gray-500">visitas</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
