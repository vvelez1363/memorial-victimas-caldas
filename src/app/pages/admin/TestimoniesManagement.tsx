import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Video, FileText, Mic } from 'lucide-react';
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

export function TestimoniesManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const testimonies = [
    {
      id: 1,
      author: 'María Martínez',
      relation: 'Hermana',
      type: 'text',
      victim: 'Carlos Andrés Martínez',
      date: '2025-01-15',
      status: 'Publicado',
    },
    {
      id: 2,
      author: 'Juan Gómez',
      relation: 'Padre',
      type: 'video',
      victim: 'Ana María Gómez',
      date: '2025-02-20',
      status: 'Publicado',
    },
    {
      id: 3,
      author: 'Rosa Sánchez',
      relation: 'Madre',
      type: 'audio',
      victim: 'Pedro Luis Sánchez',
      date: '2025-03-01',
      status: 'Pendiente',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Mic className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-[#1a1a1a]">Gestión de Testimonios</h2>
          <p className="text-gray-600 mt-1">Administra testimonios de familiares y comunidad</p>
        </div>
        <Button className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Testimonio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#1a1a1a]">18</div>
            <p className="text-sm text-gray-600">Total Testimonios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">12</div>
            </div>
            <p className="text-sm text-gray-600">Texto</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">4</div>
            </div>
            <p className="text-sm text-gray-600">Video</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">2</div>
            </div>
            <p className="text-sm text-gray-600">Audio</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Testimonios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por autor, víctima o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Testimonios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Autor</TableHead>
                  <TableHead>Relación</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Víctima</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonies.map((testimony) => (
                  <TableRow key={testimony.id}>
                    <TableCell className="font-medium">{testimony.author}</TableCell>
                    <TableCell>{testimony.relation}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(testimony.type)}
                        <span className="capitalize">{testimony.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{testimony.victim}</TableCell>
                    <TableCell>{testimony.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={testimony.status === 'Publicado' ? 'default' : 'secondary'}
                        className={
                          testimony.status === 'Publicado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }
                      >
                        {testimony.status}
                      </Badge>
                    </TableCell>
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
