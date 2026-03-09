import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Modal } from "@/app/components/ui/modal";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  status: "Programado" | "Finalizado";
  attendees: number | "";
}

type EventFormData = Omit<Event, "id">;

const EMPTY_FORM: EventFormData = {
  title: "",
  date: "",
  location: "",
  status: "Programado",
  attendees: "",
};

const INITIAL_EVENTS: Event[] = [
  {
    id: 1,
    title: "Conmemoración Anual 2026",
    date: "2026-03-20",
    location: "Plaza Principal, Samaná",
    status: "Programado",
    attendees: 150,
  },
  {
    id: 2,
    title: "Taller de Memoria Histórica",
    date: "2026-04-15",
    location: "Casa de la Cultura",
    status: "Programado",
    attendees: 45,
  },
  {
    id: 3,
    title: "Homenaje a las Víctimas",
    date: "2026-02-10",
    location: "Parque Municipal",
    status: "Finalizado",
    attendees: 200,
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

// ── EventForm ─────────────────────────────────────────────────────────────────
function EventForm({
  initial = EMPTY_FORM,
  onSave,
  onCancel,
  saveLabel = "Guardar",
}: {
  initial?: EventFormData;
  onSave: (data: EventFormData) => void;
  onCancel: () => void;
  saveLabel?: string;
}) {
  const [form, setForm] = useState<EventFormData>({ ...initial });
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    title: !form.title.trim(),
    date: !form.date.trim(),
    location: !form.location.trim(),
    attendees: form.attendees === "" || Number(form.attendees) < 0,
  };

  const isValid = !Object.values(errors).some(Boolean);

  const handleSave = () => {
    setSubmitted(true);
    if (!isValid) return;
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>
          Título <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Ej. Conmemoración Anual 2026"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={inputClass(submitted && errors.title)}
        />
        {submitted && errors.title && (
          <p className="text-xs text-red-500 mt-1">El título es obligatorio.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Fecha <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className={inputClass(submitted && errors.date)}
          />
          {submitted && errors.date && (
            <p className="text-xs text-red-500 mt-1">
              La fecha es obligatoria.
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as Event["status"],
              }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4af37] transition-colors"
          >
            <option value="Programado">Programado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Ubicación <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Ej. Plaza Principal, Samaná"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className={inputClass(submitted && errors.location)}
        />
        {submitted && errors.location && (
          <p className="text-xs text-red-500 mt-1">
            La ubicación es obligatoria.
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          Asistentes estimados <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={0}
          placeholder="Ej. 150"
          value={form.attendees}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              attendees: e.target.value === "" ? "" : Number(e.target.value),
            }))
          }
          className={inputClass(submitted && errors.attendees)}
        />
        {submitted && errors.attendees && (
          <p className="text-xs text-red-500 mt-1">
            Ingresa un número válido de asistentes.
          </p>
        )}
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
export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState<Event | null>(null);
  const [modalDelete, setModalDelete] = useState<Event | null>(null);

  const scheduled = events.filter((e) => e.status === "Programado").length;
  const finished = events.filter((e) => e.status === "Finalizado").length;
  const totalAttendees = events.reduce(
    (sum, e) => sum + (Number(e.attendees) || 0),
    0,
  );

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return events.filter(
      (e) =>
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q),
    );
  }, [events, searchTerm]);

  const handleCreate = (form: EventFormData) => {
    setEvents((prev) => [...prev, { id: Date.now(), ...form }]);
    setModalCreate(false);
  };

  const handleEdit = (form: EventFormData) => {
    if (!modalEdit) return;
    setEvents((prev) =>
      prev.map((e) => (e.id === modalEdit.id ? { ...e, ...form } : e)),
    );
    setModalEdit(null);
  };

  const handleDelete = () => {
    if (!modalDelete) return;
    setEvents((prev) => prev.filter((e) => e.id !== modalDelete.id));
    setModalDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-[#1a1a1a]">
            Gestión de Eventos
          </h2>
          <p className="text-gray-600 mt-1">
            Administra eventos y actividades conmemorativas
          </p>
        </div>
        <Button
          className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2"
          onClick={() => setModalCreate(true)}
        >
          <Plus className="w-4 h-4" />
          Crear Evento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{scheduled}</div>
            <p className="text-sm text-gray-600">Eventos Programados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{finished}</div>
            <p className="text-sm text-gray-600">Realizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#1a1a1a]">
              {totalAttendees.toLocaleString()}
            </div>
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
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No se encontraron eventos.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
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
                      event.status === "Programado"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
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
                    <p className="text-sm text-gray-600 mb-1">
                      Asistentes estimados
                    </p>
                    <p className="text-sm font-medium">
                      {event.attendees} personas
                    </p>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => setModalEdit(event)}
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setModalDelete(event)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL Crear */}
      <Modal
        open={modalCreate}
        onClose={() => setModalCreate(false)}
        title="Crear Evento"
        maxWidth="560px"
      >
        <EventForm
          onSave={handleCreate}
          onCancel={() => setModalCreate(false)}
          saveLabel="Crear Evento"
        />
      </Modal>

      {/* MODAL Editar */}
      <Modal
        open={!!modalEdit}
        onClose={() => setModalEdit(null)}
        title="Editar Evento"
        maxWidth="560px"
      >
        {modalEdit && (
          <EventForm
            initial={modalEdit}
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
              ¿Estás seguro de que deseas eliminar el evento
            </p>
            <p className="text-lg font-bold text-[#1a1a1a]">
              {modalDelete.title}?
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
