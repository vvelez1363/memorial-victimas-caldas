import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

export function VictimsManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const victims = [
    {
      id: 1,
      name: 'Carlos Andrés Martínez',
      disappearanceDate: '2002-03-15',
      location: 'Samaná, Caldas',
      status: 'Documentado',
      photo: true,
      familyContact: 'María Martínez',
    },
    {
      id: 2,
      name: 'Ana María Gómez',
      disappearanceDate: '2003-07-22',
      location: 'Vereda La Pradera',
      status: 'Documentado',
      photo: true,
      familyContact: 'Juan Gómez',
    },
    {
      id: 3,
      name: 'Pedro Luis Sánchez',
      disappearanceDate: '2001-11-08',
      location: 'Samaná, Caldas',
      status: 'En investigación',
      photo: false,
      familyContact: 'Rosa Sánchez',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-[#1a1a1a]">Gestión de Víctimas</h2>
          <p className="text-gray-600 mt-1">Administra los registros de víctimas de desaparición</p>
        </div>
        <Button className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Registro
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#1a1a1a]">24</div>
            <p className="text-sm text-gray-600">Total Registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">18</div>
            <p className="text-sm text-gray-600">Documentados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">6</div>
            <p className="text-sm text-gray-600">En Investigación</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">20</div>
            <p className="text-sm text-gray-600">Con Fotografía</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar y Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, fecha o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Víctimas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Fecha Desaparición</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Contacto Familiar</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {victims.map((victim) => (
                  <TableRow key={victim.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                          {victim.photo ? '📷' : '👤'}
                        </div>
                        {victim.name}
                      </div>
                    </TableCell>
                    <TableCell>{victim.disappearanceDate}</TableCell>
                    <TableCell>{victim.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant={victim.status === 'Documentado' ? 'default' : 'secondary'}
                        className={
                          victim.status === 'Documentado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }
                      >
                        {victim.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{victim.familyContact}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
