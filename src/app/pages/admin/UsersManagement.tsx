import { useState, useMemo } from "react";
import { Plus, Search, Edit, Trash2, Shield } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Modal } from "@/app/components/ui/modal";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Role = "admin" | "editor" | "moderator";
type Status = "Activo" | "Inactivo";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  lastLogin: string;
  status: Status;
}

type UserFormData = Omit<User, "id" | "lastLogin">;

const EMPTY_FORM: UserFormData = {
  name: "",
  email: "",
  role: "editor",
  status: "Activo",
};

const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "Administrador Principal",
    email: "admin@santuarios.edu.co",
    role: "admin",
    lastLogin: "2026-03-06",
    status: "Activo",
  },
  {
    id: 2,
    name: "María García",
    email: "maria.g@santuarios.edu.co",
    role: "editor",
    lastLogin: "2026-03-05",
    status: "Activo",
  },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos.l@santuarios.edu.co",
    role: "moderator",
    lastLogin: "2026-03-04",
    status: "Activo",
  },
];

// ── Helpers de estilo ─────────────────────────────────────────────────────────
const labelClass =
  "block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1";

const inputClass = (hasError: boolean) =>
  [
    "w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors",
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-500"
      : "border-gray-300 focus:border-[#d4af37]",
  ].join(" ");

const roleBadge = (role: Role) => {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-purple-100 text-purple-800">Administrador</Badge>
      );
    case "editor":
      return <Badge className="bg-blue-100 text-blue-800">Editor</Badge>;
    case "moderator":
      return <Badge className="bg-green-100 text-green-800">Moderador</Badge>;
  }
};

// ── UserForm ──────────────────────────────────────────────────────────────────
function UserForm({
  initial = EMPTY_FORM,
  onSave,
  onCancel,
  saveLabel = "Guardar",
}: {
  initial?: UserFormData;
  onSave: (data: UserFormData) => void;
  onCancel: () => void;
  saveLabel?: string;
}) {
  const [form, setForm] = useState<UserFormData>({ ...initial });
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: !form.name.trim(),
    email: !form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
  };

  const isValid = !errors.name && !errors.email;

  const handleSave = () => {
    setSubmitted(true);
    if (!isValid) return;
    onSave(form);
  };

  return (
    <div className="space-y-4">
      {/* Nombre */}
      <div>
        <label className={labelClass}>
          Nombre completo <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Ej. María García"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={inputClass(submitted && errors.name)}
        />
        {submitted && errors.name && (
          <p className="text-xs text-red-500 mt-1">El nombre es obligatorio.</p>
        )}
      </div>

      {/* Correo */}
      <div>
        <label className={labelClass}>
          Correo electrónico <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Ej. usuario@santuarios.edu.co"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={inputClass(submitted && errors.email)}
        />
        {submitted && errors.email && (
          <p className="text-xs text-red-500 mt-1">Ingresa un correo válido.</p>
        )}
      </div>

      {/* Rol + Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Rol</label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value as Role }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4af37] transition-colors"
          >
            <option value="admin">Administrador</option>
            <option value="editor">Editor</option>
            <option value="moderator">Moderador</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value as Status }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4af37] transition-colors"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {submitted && !isValid && (
        <p className="text-xs text-red-500 font-semibold">
          Por favor completa los campos obligatorios marcados con{" "}
          <span className="text-red-500">*</span>.
        </p>
      )}

      <div className="flex justify-end gap-3 pt-1">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f]"
          onClick={handleSave}
        >
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function UsersManagement() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState<User | null>(null);
  const [modalDelete, setModalDelete] = useState<User | null>(null);

  // Stats dinámicas
  const stats = {
    admins: users.filter((u) => u.role === "admin").length,
    editors: users.filter((u) => u.role === "editor").length,
    moderators: users.filter((u) => u.role === "moderator").length,
    total: users.length,
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, searchTerm]);

  const handleCreate = (form: UserFormData) => {
    setUsers((prev) => [
      ...prev,
      {
        id: Date.now(),
        lastLogin: "—",
        ...form,
      },
    ]);
    setModalCreate(false);
  };

  const handleEdit = (form: UserFormData) => {
    if (!modalEdit) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === modalEdit.id ? { ...u, ...form } : u)),
    );
    setModalEdit(null);
  };

  const handleDelete = () => {
    if (!modalDelete) return;
    setUsers((prev) => prev.filter((u) => u.id !== modalDelete.id));
    setModalDelete(null);
  };

  const tableHeads: { label: string; right?: boolean }[] = [
    { label: "Nombre" },
    { label: "Correo Electrónico" },
    { label: "Rol" },
    { label: "Último Acceso" },
    { label: "Estado" },
    { label: "Acciones", right: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-[#1a1a1a]">
            Usuarios Administradores
          </h2>
          <p className="text-gray-600 mt-1">
            Gestiona los usuarios con acceso al panel
          </p>
        </div>
        <Button
          className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2"
          onClick={() => setModalCreate(true)}
        >
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
              <div className="text-2xl font-bold text-purple-600">
                {stats.admins}
              </div>
            </div>
            <p className="text-sm text-gray-600">Administradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {stats.editors}
            </div>
            <p className="text-sm text-gray-600">Editores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.moderators}
            </div>
            <p className="text-sm text-gray-600">Moderadores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {stats.total}
            </div>
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
                  {tableHeads.map(({ label, right }) => (
                    <TableHead
                      key={label}
                      className={`font-bold text-[#1a1a1a]${right ? " text-right" : ""}`}
                    >
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{roleBadge(user.role)}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "Activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Editar"
                          onClick={() => setModalEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600"
                          title="Eliminar"
                          onClick={() => setModalDelete(user)}
                        >
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
                <p className="font-medium text-sm text-purple-900">
                  Administrador
                </p>
                <p className="text-xs text-purple-700">
                  Acceso completo a todas las funciones del sistema
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Edit className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-blue-900">
                  Editor de Contenido
                </p>
                <p className="text-xs text-blue-700">
                  Puede crear y editar contenido, pero no eliminar
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-green-900">Moderador</p>
                <p className="text-xs text-green-700">
                  Revisa y aprueba casos reportados por la comunidad
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL Crear */}
      <Modal
        open={modalCreate}
        onClose={() => setModalCreate(false)}
        title="Nuevo Usuario"
        maxWidth="500px"
      >
        <UserForm
          onSave={handleCreate}
          onCancel={() => setModalCreate(false)}
          saveLabel="Crear Usuario"
        />
      </Modal>

      {/* MODAL Editar */}
      <Modal
        open={!!modalEdit}
        onClose={() => setModalEdit(null)}
        title="Editar Usuario"
        maxWidth="500px"
      >
        {modalEdit && (
          <UserForm
            initial={{
              name: modalEdit.name,
              email: modalEdit.email,
              role: modalEdit.role,
              status: modalEdit.status,
            }}
            onSave={handleEdit}
            onCancel={() => setModalEdit(null)}
            saveLabel="Guardar Cambios"
          />
        )}
      </Modal>

      {/* MODAL Eliminar */}
      <Modal
        open={!!modalDelete}
        onClose={() => setModalDelete(null)}
        title="Confirmar eliminación"
        maxWidth="420px"
      >
        {modalDelete && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar al usuario
            </p>
            <p className="text-lg font-bold text-[#1a1a1a]">
              {modalDelete.name}?
            </p>
            <p className="text-sm text-gray-400">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalDelete(null)}>
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                Sí, eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
