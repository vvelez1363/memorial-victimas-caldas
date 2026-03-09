import { useState, useMemo, useRef } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Video,
  FileText,
  Mic,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Modal } from "@/app/components/ui/modal";
import { uploadFile } from "@/services/fileService";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type TestimonyType = "text" | "video" | "audio" | "document";
type TestimonyStatus = "Publicado" | "Pendiente";

interface Testimony {
  id: number;
  author: string;
  relation: string;
  type: TestimonyType;
  victim: string;
  date: string;
  status: TestimonyStatus;
  content: string;
  fileUrl: string | null;
  fileName: string | null;
}

type TestimonyFormData = Omit<Testimony, "id">;

const EMPTY_FORM: TestimonyFormData = {
  author: "",
  relation: "",
  type: "text",
  victim: "",
  date: "",
  status: "Pendiente",
  content: "",
  fileUrl: null,
  fileName: null,
};

const INITIAL_TESTIMONIES: Testimony[] = [
  {
    id: 1,
    author: "María Martínez",
    relation: "Hermana",
    type: "text",
    victim: "Carlos Andrés Martínez",
    date: "2025-01-15",
    status: "Publicado",
    content: "Mi hermano era una persona llena de vida...",
    fileUrl: null,
    fileName: null,
  },
  {
    id: 2,
    author: "Juan Gómez",
    relation: "Padre",
    type: "video",
    victim: "Ana María Gómez",
    date: "2025-02-20",
    status: "Publicado",
    content: "",
    fileUrl: null,
    fileName: "testimonio_juan.mp4",
  },
  {
    id: 3,
    author: "Rosa Sánchez",
    relation: "Madre",
    type: "audio",
    victim: "Pedro Luis Sánchez",
    date: "2025-03-01",
    status: "Pendiente",
    content: "",
    fileUrl: null,
    fileName: "testimonio_rosa.mp3",
  },
];

// ── Configuración de tipos de archivo aceptados por tipo de testimonio ────────
const ACCEPTED_FILES: Record<TestimonyType, { accept: string; label: string }> =
  {
    text: { accept: "", label: "" }, // sin archivo, usa textarea
    video: {
      accept: "video/mp4,video/quicktime,video/x-msvideo",
      label: "MP4 · máx. 100 MB",
    },
    audio: {
      accept: "audio/mpeg,audio/wav,audio/ogg,audio/mp3",
      label: "MP3, WAV · máx. 50 MB",
    },
    document: {
      accept:
        "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain",
      label: "PDF, Word (.doc/.docx), TXT · máx. 20 MB",
    },
  };

const MAX_SIZE: Record<TestimonyType, number> = {
  text: 0,
  video: 100 * 1024 * 1024,
  audio: 50 * 1024 * 1024,
  document: 20 * 1024 * 1024,
};

// ── Helpers visuales ──────────────────────────────────────────────────────────
const labelClass =
  "block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1";

const inputClass = (hasError: boolean) =>
  [
    "w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors",
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-500"
      : "border-gray-300 focus:border-[#d4af37]",
  ].join(" ");

const typeLabel: Record<TestimonyType, string> = {
  text: "Texto",
  video: "Video",
  audio: "Audio",
  document: "Documento",
};

function TypeIcon({
  type,
  className = "w-4 h-4",
}: {
  type: TestimonyType;
  className?: string;
}) {
  switch (type) {
    case "video":
      return <Video className={className} />;
    case "audio":
      return <Mic className={className} />;
    case "document":
      return <FileText className={className} />;
    default:
      return <FileText className={className} />;
  }
}

// ── FileUploader ──────────────────────────────────────────────────────────────
// Acepta video, audio y documentos (PDF, Word, TXT) según el tipo de testimonio.
// Para testimonio de texto no se renderiza.
function FileUploader({
  testimonyType,
  currentFileName,
  onUpload,
}: {
  testimonyType: TestimonyType;
  currentFileName: string | null;
  onUpload: (url: string | null, fileName: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<
    "idle" | "uploading" | "success" | "error"
  >(currentFileName ? "success" : "idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState<string | null>(currentFileName);

  if (testimonyType === "text") return null;

  const config = ACCEPTED_FILES[testimonyType];

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE[testimonyType]) {
      setErrorMsg(`El archivo supera el tamaño máximo permitido.`);
      setState("error");
      return;
    }

    setFileName(file.name);
    setState("uploading");
    setErrorMsg("");

    try {
      const url = await uploadFile(file);
      setState("success");
      onUpload(url, file.name);
    } catch {
      // Microservicio no disponible aún → guardamos nombre localmente
      setState("success");
      onUpload(null, file.name);
    }
  };

  const handleRemove = () => {
    setFileName(null);
    setState("idle");
    setErrorMsg("");
    onUpload(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {fileName && state !== "idle" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 14px",
            background: "rgba(46,71,57,0.04)",
            borderRadius: "10px",
            border: "1.5px solid rgba(46,71,57,0.14)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              background: "rgba(46,71,57,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TypeIcon type={testimonyType} className="w-4 h-4" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {state === "uploading" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "13px",
                  color: "#2E4739",
                  fontWeight: 600,
                }}
              >
                <Loader2
                  size={13}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Subiendo archivo...
              </div>
            )}
            {state === "success" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "13px",
                  color: "#276749",
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={13} /> Archivo cargado
              </div>
            )}
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#b03a1a",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
            }}
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: "2px dashed rgba(46,71,57,0.22)",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            background: "rgba(46,71,57,0.02)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background =
              "rgba(46,71,57,0.06)";
            (e.currentTarget as HTMLDivElement).style.borderColor = "#2E4739";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background =
              "rgba(46,71,57,0.02)";
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "rgba(46,71,57,0.22)";
          }}
        >
          <Upload
            size={22}
            color="#2E4739"
            style={{ marginBottom: "7px", opacity: 0.6 }}
          />
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#333",
              marginBottom: "3px",
            }}
          >
            Haz clic para seleccionar un archivo
          </div>
          <div style={{ fontSize: "12px", color: "#aaa" }}>{config.label}</div>
        </div>
      )}

      {state === "error" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "8px",
            padding: "9px 13px",
            background: "rgba(176,58,26,0.08)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#b03a1a",
            fontWeight: 600,
          }}
        >
          <AlertCircle size={13} /> {errorMsg}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        style={{ display: "none" }}
        onChange={handleSelect}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── TestimonyForm ─────────────────────────────────────────────────────────────
function TestimonyForm({
  initial = EMPTY_FORM,
  onSave,
  onCancel,
  saveLabel = "Guardar",
}: {
  initial?: TestimonyFormData;
  onSave: (data: TestimonyFormData) => void;
  onCancel: () => void;
  saveLabel?: string;
}) {
  const [form, setForm] = useState<TestimonyFormData>({ ...initial });
  const [submitted, setSubmitted] = useState(false);

  const needsFile = form.type !== "text";
  const needsContent = form.type === "text";

  const errors = {
    author: !form.author.trim(),
    relation: !form.relation.trim(),
    victim: !form.victim.trim(),
    date: !form.date.trim(),
    content: needsContent && !form.content.trim(),
    file: needsFile && !form.fileName,
  };

  const isValid = !Object.values(errors).some(Boolean);

  const handleSave = () => {
    setSubmitted(true);
    if (!isValid) return;
    onSave(form);
  };

  // Al cambiar tipo, limpiar archivo o contenido según corresponda
  const handleTypeChange = (t: TestimonyType) => {
    setForm((f) => ({
      ...f,
      type: t,
      content: t !== "text" ? "" : f.content,
      fileUrl: t === "text" ? null : f.fileUrl,
      fileName: t === "text" ? null : f.fileName,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Autor + Relación */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <div>
          <label className={labelClass}>
            Autor <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Nombre del autor"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            className={inputClass(submitted && errors.author)}
          />
          {submitted && errors.author && (
            <p className="text-xs text-red-500 mt-1">
              El autor es obligatorio.
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Relación con la víctima <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Ej. Madre, Hermano..."
            value={form.relation}
            onChange={(e) =>
              setForm((f) => ({ ...f, relation: e.target.value }))
            }
            className={inputClass(submitted && errors.relation)}
          />
          {submitted && errors.relation && (
            <p className="text-xs text-red-500 mt-1">
              La relación es obligatoria.
            </p>
          )}
        </div>
      </div>

      {/* Víctima asociada */}
      <div>
        <label className={labelClass}>
          Víctima asociada <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Nombre de la víctima"
          value={form.victim}
          onChange={(e) => setForm((f) => ({ ...f, victim: e.target.value }))}
          className={inputClass(submitted && errors.victim)}
        />
        {submitted && errors.victim && (
          <p className="text-xs text-red-500 mt-1">
            La víctima asociada es obligatoria.
          </p>
        )}
      </div>

      {/* Tipo + Fecha + Estado */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <label className={labelClass}>
            Tipo <span className="text-red-500">*</span>
          </label>
          <select
            value={form.type}
            onChange={(e) => handleTypeChange(e.target.value as TestimonyType)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4af37] transition-colors"
          >
            <option value="text">Texto</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="document">Documento</option>
          </select>
        </div>
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
                status: e.target.value as TestimonyStatus,
              }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4af37] transition-colors"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Publicado">Publicado</option>
          </select>
        </div>
      </div>

      {/* Contenido de texto — solo si type === "text" */}
      {needsContent && (
        <div>
          <label className={labelClass}>
            Contenido del testimonio <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Escribe el testimonio aquí..."
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            className={`${inputClass(submitted && errors.content)} resize-vertical`}
            style={{ minHeight: "110px" }}
          />
          {submitted && errors.content && (
            <p className="text-xs text-red-500 mt-1">
              El contenido del testimonio es obligatorio.
            </p>
          )}
        </div>
      )}

      {/* Archivo adjunto — solo si type !== "text" */}
      {needsFile && (
        <div>
          <label className={labelClass}>
            Archivo adjunto <span className="text-red-500">*</span>
          </label>
          <FileUploader
            testimonyType={form.type}
            currentFileName={form.fileName}
            onUpload={(url, name) =>
              setForm((f) => ({ ...f, fileUrl: url, fileName: name }))
            }
          />
          {submitted && errors.file && (
            <p className="text-xs text-red-500 mt-1">
              Debes adjuntar un archivo.
            </p>
          )}
        </div>
      )}

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
export function TestimoniesManagement() {
  const [testimonies, setTestimonies] =
    useState<Testimony[]>(INITIAL_TESTIMONIES);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalCreate, setModalCreate] = useState(false);
  const [modalView, setModalView] = useState<Testimony | null>(null);
  const [modalEdit, setModalEdit] = useState<Testimony | null>(null);
  const [modalDelete, setModalDelete] = useState<Testimony | null>(null);

  // Stats dinámicas
  const stats = {
    total: testimonies.length,
    text: testimonies.filter((t) => t.type === "text").length,
    video: testimonies.filter((t) => t.type === "video").length,
    audio: testimonies.filter((t) => t.type === "audio").length,
    document: testimonies.filter((t) => t.type === "document").length,
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return testimonies.filter(
      (t) =>
        !q ||
        t.author.toLowerCase().includes(q) ||
        t.victim.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.relation.toLowerCase().includes(q),
    );
  }, [testimonies, searchTerm]);

  const handleCreate = (form: TestimonyFormData) => {
    setTestimonies((prev) => [...prev, { id: Date.now(), ...form }]);
    setModalCreate(false);
  };

  const handleEdit = (form: TestimonyFormData) => {
    if (!modalEdit) return;
    setTestimonies((prev) =>
      prev.map((t) => (t.id === modalEdit.id ? { ...t, ...form } : t)),
    );
    setModalEdit(null);
  };

  const handleDelete = () => {
    if (!modalDelete) return;
    setTestimonies((prev) => prev.filter((t) => t.id !== modalDelete.id));
    setModalDelete(null);
  };

  const tableHeads: { label: string; right?: boolean }[] = [
    { label: "Autor" },
    { label: "Relación" },
    { label: "Tipo" },
    { label: "Víctima" },
    { label: "Fecha" },
    { label: "Estado" },
    { label: "Acciones", right: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-[#1a1a1a]">
            Gestión de Testimonios
          </h2>
          <p className="text-gray-600 mt-1">
            Administra testimonios de familiares y comunidad
          </p>
        </div>
        <Button
          className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2"
          onClick={() => setModalCreate(true)}
        >
          <Plus className="w-4 h-4" />
          Nuevo Testimonio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#1a1a1a]">
              {stats.total}
            </div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">
                {stats.text}
              </div>
            </div>
            <p className="text-sm text-gray-600">Texto</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">
                {stats.video}
              </div>
            </div>
            <p className="text-sm text-gray-600">Video</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {stats.audio}
              </div>
            </div>
            <p className="text-sm text-gray-600">Audio</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <div className="text-2xl font-bold text-amber-600">
                {stats.document}
              </div>
            </div>
            <p className="text-sm text-gray-600">Documento</p>
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
              placeholder="Buscar por autor, víctima, relación o tipo..."
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
                      colSpan={7}
                      className="text-center py-10 text-gray-500"
                    >
                      No se encontraron testimonios.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.author}</TableCell>
                    <TableCell>{t.relation}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <TypeIcon type={t.type} />
                        <span className="text-sm">{typeLabel[t.type]}</span>
                      </div>
                    </TableCell>
                    <TableCell>{t.victim}</TableCell>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          t.status === "Publicado"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Ver detalle"
                          onClick={() => setModalView(t)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Editar"
                          onClick={() => setModalEdit(t)}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600"
                          title="Eliminar"
                          onClick={() => setModalDelete(t)}
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

      {/* MODAL Crear */}
      <Modal
        open={modalCreate}
        onClose={() => setModalCreate(false)}
        title="Nuevo Testimonio"
        maxWidth="660px"
      >
        <TestimonyForm
          onSave={handleCreate}
          onCancel={() => setModalCreate(false)}
          saveLabel="Crear Testimonio"
        />
      </Modal>

      {/* MODAL Ver */}
      <Modal
        open={!!modalView}
        onClose={() => setModalView(null)}
        title="Detalle del Testimonio"
        maxWidth="520px"
      >
        {modalView && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-[#2E4739]/10 flex items-center justify-center">
                <TypeIcon
                  type={modalView.type}
                  className="w-5 h-5 text-[#2E4739]"
                />
              </div>
              <div>
                <p className="font-bold text-base text-[#1a1a1a]">
                  {modalView.author}
                </p>
                <p className="text-gray-500 text-xs">
                  {modalView.relation} · {typeLabel[modalView.type]}
                </p>
              </div>
              <Badge
                className={`ml-auto ${modalView.status === "Publicado" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
              >
                {modalView.status}
              </Badge>
            </div>
            <div className="space-y-3">
              <ViewRow label="Víctima asociada" value={modalView.victim} />
              <ViewRow label="Fecha" value={modalView.date} />
              {modalView.content && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                    Contenido
                  </p>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
                    {modalView.content}
                  </p>
                </div>
              )}
              {modalView.fileName && (
                <ViewRow label="Archivo adjunto" value={modalView.fileName} />
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button
                className="bg-[#2E4739] text-white hover:bg-[#1e3228]"
                onClick={() => {
                  setModalView(null);
                  setModalEdit(modalView);
                }}
              >
                Editar este testimonio
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL Editar */}
      <Modal
        open={!!modalEdit}
        onClose={() => setModalEdit(null)}
        title="Editar Testimonio"
        maxWidth="660px"
      >
        {modalEdit && (
          <TestimonyForm
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
              ¿Estás seguro de que deseas eliminar el testimonio de
            </p>
            <p className="text-lg font-bold text-[#1a1a1a]">
              {modalDelete.author}?
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

function ViewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-0.5">
        {label}
      </p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}
