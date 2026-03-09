import { useState } from "react";
import { Plus, Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Modal } from "@/app/components/ui/modal";

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
}

const INITIAL_EVENTS: TimelineEvent[] = [
  {
    id: 1,
    date: "2002-03-15",
    title: "Inicio del conflicto armado en la región",
    description:
      "Primer registro documentado de presencia de grupos armados en la zona de Samaná.",
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

// ── TimelineForm ──────────────────────────────────────────────────────────────
function TimelineForm({
  form,
  setForm,
  onSave,
}: {
  form: { date: string; title: string; description: string };
  setForm: (f: any) => void;
  onSave: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    date: !form.date.trim(),
    title: !form.title.trim(),
    description: !form.description.trim(),
  };

  const isValid = !errors.date && !errors.title && !errors.description;

  const handleSave = () => {
    setSubmitted(true);
    if (!isValid) return;
    onSave();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>
          Fecha <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className={inputClass(submitted && errors.date)}
        />
        {submitted && errors.date && (
          <p className="text-xs text-red-500 mt-1">La fecha es obligatoria.</p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          Título <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Ej. Inicio del conflicto armado en la región"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass(submitted && errors.title)}
        />
        {submitted && errors.title && (
          <p className="text-xs text-red-500 mt-1">El título es obligatorio.</p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Describe el hito histórico..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputClass(submitted && errors.description)} resize-vertical min-h-[80px]`}
        />
        {submitted && errors.description && (
          <p className="text-xs text-red-500 mt-1">
            La descripción es obligatoria.
          </p>
        )}
      </div>

      {submitted && !isValid && (
        <p className="text-xs text-red-500 font-semibold">
          Por favor completa los campos obligatorios marcados con{" "}
          <span className="text-red-500">*</span>.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f]"
          onClick={handleSave}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function TimelineManagement() {
  const [events, setEvents] = useState<TimelineEvent[]>(INITIAL_EVENTS);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState<TimelineEvent | null>(null);
  const [modalDelete, setModalDelete] = useState<TimelineEvent | null>(null);

  const [form, setForm] = useState({ date: "", title: "", description: "" });

  const resetForm = () =>
    setForm({
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
    });

  const sortEvents = (list: TimelineEvent[]) =>
    [...list].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  const createEvent = () => {
    if (!form.date || !form.title || !form.description) return;
    setEvents(sortEvents([...events, { id: Date.now(), ...form }]));
    setModalCreate(false);
    resetForm();
  };

  const updateEvent = () => {
    if (!modalEdit || !form.date || !form.title || !form.description) return;
    setEvents(
      sortEvents(
        events.map((e) =>
          e.id === modalEdit.id ? { ...modalEdit, ...form } : e,
        ),
      ),
    );
    setModalEdit(null);
    resetForm();
  };

  const deleteEvent = () => {
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
            Línea de Tiempo
          </h2>
          <p className="text-gray-600 mt-1">
            Hitos históricos del conflicto en la región
          </p>
        </div>
        <Button
          className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2"
          onClick={() => {
            resetForm();
            setModalCreate(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Nuevo Hito
        </Button>
      </div>

      {/* Stat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold text-[#1a1a1a]">
                {events.length}
              </div>
            </div>
            <p className="text-sm text-gray-600">Hitos Registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Hitos Históricos</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              No hay hitos registrados aún.
            </p>
          )}
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative pl-8 pb-8 border-l-2 border-gray-200 animate-fade-in"
              >
                <div className="absolute left-0 top-0 w-4 h-4 -ml-[9px] rounded-full bg-[#d4af37] border-4 border-white ring-2 ring-gray-200" />
                <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{event.date}</p>
                      <h3 className="font-semibold text-[#1a1a1a]">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setForm({
                          date: event.date,
                          title: event.title,
                          description: event.description,
                        });
                        setModalEdit(event);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => setModalDelete(event)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MODAL Crear */}
      <Modal
        open={modalCreate}
        onClose={() => setModalCreate(false)}
        title="Nuevo Hito Histórico"
      >
        <TimelineForm form={form} setForm={setForm} onSave={createEvent} />
      </Modal>

      {/* MODAL Editar */}
      <Modal
        open={!!modalEdit}
        onClose={() => setModalEdit(null)}
        title="Editar Hito"
      >
        <TimelineForm form={form} setForm={setForm} onSave={updateEvent} />
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
              ¿Estás seguro de que deseas eliminar el hito
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
                onClick={deleteEvent}
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
