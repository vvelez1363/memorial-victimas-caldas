import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield } from 'lucide-react';
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

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    {
      id: 1,
      name: 'Administrador Principal',
      email: 'admin@santuarios.edu.co',
      role: 'admin',
      lastLogin: '2026-03-06',
      status: 'Activo',
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.g@santuarios.edu.co',
      role: 'editor',
      lastLogin: '2026-03-05',
      status: 'Activo',
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos.l@santuarios.edu.co',
      role: 'moderator',
      lastLogin: '2026-03-04',
      status: 'Activo',
    },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Administrador</Badge>;
      case 'editor':
        return <Badge className="bg-blue-100 text-blue-800">Editor</Badge>;
      case 'moderator':
        return <Badge className="bg-green-100 text-green-800">Moderador</Badge>;
      default:
        return <Badge>Usuario</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-[#1a1a1a]">Usuarios Administradores</h2>
          <p className="text-gray-600 mt-1">Gestiona los usuarios con acceso al panel</p>
        </div>
        <Button className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">1</div>
            </div>
            <p className="text-sm text-gray-600">Administradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <p className="text-sm text-gray-600">Editores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-sm text-gray-600">Moderadores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">4</div>
            <p className="text-sm text-gray-600">Total Usuarios</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o correo..."
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
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
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

      {/* Roles Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-purple-900">Administrador</p>
                <p className="text-xs text-purple-700">Acceso completo a todas las funciones del sistema</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Edit className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-blue-900">Editor de Contenido</p>
                <p className="text-xs text-blue-700">Puede crear y editar contenido, pero no eliminar</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-green-900">Moderador</p>
                <p className="text-xs text-green-700">Revisa y aprueba casos reportados por la comunidad</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
