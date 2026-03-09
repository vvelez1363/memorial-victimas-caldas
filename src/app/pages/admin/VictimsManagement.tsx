import { useState, useMemo, useRef } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  User,
  Calendar,
  Phone,
  FileText,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useMemoryPlaces } from "@/app/context/MemoryPlacesContext";
import type { Victim } from "@/app/context/MemoryPlacesContext";
import { Modal } from "@/app/components/ui/modal";
import { uploadFile } from "@/services/fileService";

// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<Victim, "id"> = {
  name: "",
  dateOfDisappearance: "",
  location: "",
  status: "Documentado",
  photo: false,
  photoUrl: null,
  familyContact: "",
  phone: "",
  notes: "",
  age: null,
};

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase" as const,
          color: "#444",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid rgba(46,71,57,0.18)",
  borderRadius: "9px",
  padding: "10px 14px",
  fontSize: "14px",
  color: "#111",
  background: "#fafafa",
  outline: "none",
};
const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none" as any,
};

// ── PhotoUploader ─────────────────────────────────────────────────────────────
// Solo acepta imágenes — pensado exclusivamente para foto de víctima.
// Si en otra vista necesitas otros tipos de archivo, crea un uploader distinto.
function PhotoUploader({
  photoUrl,
  onPhotoChange,
}: {
  photoUrl: string | null;
  onPhotoChange: (hasPhoto: boolean, url: string | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(photoUrl);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Solo se permiten imágenes JPG, PNG o WebP.");
      setUploadState("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("El archivo no puede superar 5 MB.");
      setUploadState("error");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploadState("uploading");
    setErrorMsg("");

    try {
      const url = await uploadFile(file);
      setUploadState("success");
      onPhotoChange(true, url);
    } catch (err) {
      // Microservicio no disponible aún → guardamos preview local
      console.warn(
        "Microservicio no disponible, guardando localmente:",
        (err as Error).message,
      );
      setUploadState("success");
      onPhotoChange(true, localPreview);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setUploadState("idle");
    setErrorMsg("");
    onPhotoChange(false, null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      {previewUrl ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "14px",
            background: "rgba(46,71,57,0.05)",
            borderRadius: "12px",
            border: "1.5px solid rgba(46,71,57,0.15)",
          }}
        >
          <img
            src={previewUrl}
            alt="Vista previa"
            style={{
              width: 72,
              height: 72,
              borderRadius: "10px",
              objectFit: "cover",
              flexShrink: 0,
            }}
            onError={() => setPreviewUrl(null)}
          />
          <div style={{ flex: 1 }}>
            {uploadState === "uploading" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#2E4739",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <Loader2
                  size={15}
                  style={{ animation: "spin 1s linear infinite" }}
                />{" "}
                Subiendo al servidor...
              </div>
            )}
            {uploadState === "success" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#276749",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={15} /> Fotografía cargada correctamente
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              style={{
                marginTop: "8px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#b03a1a",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Eliminar fotografía
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "2px dashed rgba(46,71,57,0.25)",
            borderRadius: "12px",
            padding: "28px",
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
              "rgba(46,71,57,0.25)";
          }}
        >
          <Camera
            size={28}
            color="#2E4739"
            style={{ marginBottom: "10px", opacity: 0.7 }}
          />
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#333",
              marginBottom: "4px",
            }}
          >
            Haz clic para seleccionar una foto
          </div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            JPG, PNG o WebP · máx. 5 MB
          </div>
        </div>
      )}

      {uploadState === "error" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "8px",
            padding: "10px 14px",
            background: "rgba(176,58,26,0.08)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#b03a1a",
            fontWeight: 600,
          }}
        >
          <AlertCircle size={14} /> {errorMsg}
        </div>
      )}

      {/* Solo acepta imágenes — para testimonios usa otro uploader */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── VictimForm ────────────────────────────────────────────────────────────────
function VictimForm({
  initial = EMPTY_FORM,
  onSave,
  onCancel,
  saveLabel = "Guardar",
}: {
  initial?: Omit<Victim, "id">;
  onSave: (form: Omit<Victim, "id">) => void;
  onCancel: () => void;
  saveLabel?: string;
}) {
  const [form, setForm] = useState<Omit<Victim, "id">>({ ...initial });
  const set =
    (k: keyof Omit<Victim, "id">) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0 20px",
        }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Nombre completo">
            <input
              style={inputStyle}
              value={form.name}
              onChange={set("name")}
              placeholder="Ej. Carlos Andrés Martínez"
            />
          </Field>
        </div>
        <Field label="Fecha de desaparición">
          <input
            style={inputStyle}
            type="date"
            value={form.dateOfDisappearance}
            onChange={set("dateOfDisappearance")}
          />
        </Field>
        <Field label="Edad al desaparecer">
          <input
            style={inputStyle}
            type="number"
            value={form.age ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                age: e.target.value ? Number(e.target.value) : null,
              }))
            }
            placeholder="Ej. 34"
          />
        </Field>
        <Field label="Estado">
          <select
            style={selectStyle}
            value={form.status}
            onChange={set("status") as any}
          >
            <option>Documentado</option>
            <option>En investigación</option>
          </select>
        </Field>
        <Field label="Contacto familiar">
          <input
            style={inputStyle}
            value={form.familyContact}
            onChange={set("familyContact")}
            placeholder="Nombre del familiar"
          />
        </Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Teléfono de contacto">
            <input
              style={inputStyle}
              value={form.phone}
              onChange={set("phone")}
              placeholder="Ej. 314 555 0000"
            />
          </Field>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Notas / observaciones">
            <textarea
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              value={form.notes}
              onChange={set("notes")}
              placeholder="Información adicional sobre el caso..."
            />
          </Field>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Fotografía de la víctima">
            <PhotoUploader
              photoUrl={form.photoUrl}
              onPhotoChange={(hasPhoto, url) =>
                setForm((f) => ({ ...f, photo: hasPhoto, photoUrl: url }))
              }
            />
          </Field>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
          marginTop: "8px",
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: "10px 22px",
            borderRadius: "9px",
            border: "1.5px solid rgba(46,71,57,0.2)",
            background: "transparent",
            fontSize: "14px",
            fontWeight: 600,
            color: "#555",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={() => onSave(form)}
          style={{
            padding: "10px 26px",
            borderRadius: "9px",
            border: "none",
            background: "#2E4739",
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
}

// ── InfoRow ───────────────────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        padding: "12px 0",
        borderBottom: "1px solid rgba(46,71,57,0.08)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "9px",
          background: "rgba(46,71,57,0.09)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={17} color="#2E4739" strokeWidth={2} />
      </div>
      <div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase" as const,
            color: "#888",
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function VictimsManagement() {
  const { victims, addVictim, updateVictim, deleteVictim } = useMemoryPlaces();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterPhoto, setFilterPhoto] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalView, setModalView] = useState<Victim | null>(null);
  const [modalEdit, setModalEdit] = useState<Victim | null>(null);
  const [modalDelete, setModalDelete] = useState<Victim | null>(null);

  const filtered = useMemo(() => {
    return victims.filter((v) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        (v.location || "").toLowerCase().includes(q) ||
        v.dateOfDisappearance.includes(q) ||
        (v.familyContact || "").toLowerCase().includes(q);
      const matchStatus = filterStatus === "Todos" || v.status === filterStatus;
      const matchPhoto =
        filterPhoto === "Todos" ||
        (filterPhoto === "Con foto" ? v.photo : !v.photo);
      return matchSearch && matchStatus && matchPhoto;
    });
  }, [victims, searchTerm, filterStatus, filterPhoto]);

  const handleCreate = (form: Omit<Victim, "id">) => {
    if (!form.name.trim()) return;
    addVictim(form);
    setModalCreate(false);
  };

  const handleEdit = (form: Omit<Victim, "id">) => {
    if (!modalEdit) return;
    updateVictim(modalEdit.id, form);
    setModalEdit(null);
  };

  const handleDelete = () => {
    if (!modalDelete) return;
    deleteVictim(modalDelete.id);
    setModalDelete(null);
  };

  const documented = victims.filter((v) => v.status === "Documentado").length;
  const investigating = victims.filter(
    (v) => v.status === "En investigación",
  ).length;
  const withPhoto = victims.filter((v) => v.photo).length;

  const statCards = [
    { label: "Total Registrados", value: victims.length, color: "#111" },
    { label: "Documentados", value: documented, color: "#276749" },
    { label: "En Investigación", value: investigating, color: "#b45309" },
    { label: "Con Fotografía", value: withPhoto, color: "#1d4ed8" },
  ];

  return (
    <div className="space-y-6">
      <style>{`
        .vm-th { font-size: 13px !important; font-weight: 800 !important; color: #111 !important; text-align: center !important; letter-spacing: 0.3px; }
        .vm-td { font-size: 14px; color: #222; text-align: center; vertical-align: middle; }
        .vm-td-left { text-align: left !important; }
        .vm-action-btn { background: transparent; border: none; padding: 6px; border-radius: 7px; cursor: pointer; transition: background 0.15s; display: inline-flex; align-items: center; justify-content: center; }
        .vm-action-btn:hover { background: rgba(46,71,57,0.08); }
        .vm-action-btn.del:hover { background: rgba(176,58,26,0.10); }
        .vm-filter-tag { padding: 5px 14px; border-radius: 20px; border: 1.5px solid rgba(46,71,57,0.18); background: transparent; font-size: 13px; font-weight: 600; color: #444; cursor: pointer; transition: all 0.15s; }
        .vm-filter-tag.active { background: #2E4739; border-color: #2E4739; color: #fff; }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "30px",
              fontWeight: 900,
              color: "#111",
              margin: 0,
            }}
          >
            Gestión de Víctimas
          </h2>
          <p style={{ fontSize: "15px", color: "#555", marginTop: "4px" }}>
            Administra los registros de víctimas de desaparición
          </p>
        </div>
        <button
          onClick={() => setModalCreate(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 22px",
            background: "#2E4739",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <Plus size={17} strokeWidth={2.5} /> Nuevo Registro
        </button>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
        }}
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "1.5px solid rgba(46,71,57,0.12)",
              borderRadius: "13px",
              padding: "22px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                fontWeight: 900,
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#111",
                marginTop: "6px",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search & filters */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid rgba(46,71,57,0.12)",
          borderRadius: "13px",
          padding: "20px 22px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search
              size={16}
              color="#888"
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              style={{
                width: "100%",
                border: "1.5px solid rgba(46,71,57,0.18)",
                borderRadius: "9px",
                padding: "10px 14px 10px 38px",
                fontSize: "14px",
                color: "#111",
                background: "#fafafa",
                outline: "none",
              }}
              placeholder="Buscar por nombre, fecha, ubicación o familiar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters((f) => !f)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 18px",
              border: "1.5px solid rgba(46,71,57,0.18)",
              borderRadius: "9px",
              background: showFilters ? "rgba(46,71,57,0.07)" : "transparent",
              fontSize: "14px",
              fontWeight: 600,
              color: "#333",
              cursor: "pointer",
            }}
          >
            <Filter size={15} /> Filtros {showFilters ? "▲" : "▼"}
          </button>
        </div>
        {showFilters && (
          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(46,71,57,0.08)",
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: "8px",
                }}
              >
                Estado
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Todos", "Documentado", "En investigación"].map((s) => (
                  <button
                    key={s}
                    className={`vm-filter-tag${filterStatus === s ? " active" : ""}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: "8px",
                }}
              >
                Fotografía
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Todos", "Con foto", "Sin foto"].map((s) => (
                  <button
                    key={s}
                    className={`vm-filter-tag${filterPhoto === s ? " active" : ""}`}
                    onClick={() => setFilterPhoto(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid rgba(46,71,57,0.12)",
          borderRadius: "13px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 22px 14px",
            borderBottom: "1px solid rgba(46,71,57,0.08)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#111",
              margin: 0,
            }}
          >
            Registros de Víctimas
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#888",
                marginLeft: "10px",
              }}
            >
              ({filtered.length} resultados)
            </span>
          </h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "rgba(46,71,57,0.05)" }}>
              <tr>
                {[
                  "Nombre Completo",
                  "Fecha Desaparición",
                  "Estado",
                  "Contacto Familiar",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="vm-th"
                    style={{ padding: "13px 16px" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      fontSize: "15px",
                      color: "#888",
                    }}
                  >
                    No se encontraron registros.
                  </td>
                </tr>
              )}
              {filtered.map((v, i) => (
                <tr
                  key={v.id}
                  style={{
                    borderTop: "1px solid rgba(46,71,57,0.07)",
                    background: i % 2 === 0 ? "#fff" : "rgba(46,71,57,0.02)",
                  }}
                >
                  <td
                    className="vm-td vm-td-left"
                    style={{ padding: "13px 16px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "11px",
                      }}
                    >
                      {v.photoUrl ? (
                        <img
                          src={v.photoUrl}
                          alt={v.name}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            objectFit: "cover",
                            flexShrink: 0,
                            border: "2px solid rgba(46,71,57,0.15)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: v.photo
                              ? "rgba(46,71,57,0.12)"
                              : "rgba(0,0,0,0.07)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {v.photo ? (
                            <Camera size={16} color="#2E4739" />
                          ) : (
                            <User size={16} color="#888" />
                          )}
                        </div>
                      )}
                      <span style={{ fontWeight: 700 }}>{v.name}</span>
                    </div>
                  </td>
                  <td className="vm-td" style={{ padding: "13px 16px" }}>
                    {v.dateOfDisappearance}
                  </td>
                  <td className="vm-td" style={{ padding: "13px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                        background:
                          v.status === "Documentado"
                            ? "rgba(39,103,73,0.12)"
                            : "rgba(180,83,9,0.12)",
                        color:
                          v.status === "Documentado" ? "#276749" : "#b45309",
                      }}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="vm-td" style={{ padding: "13px 16px" }}>
                    {v.familyContact}
                  </td>
                  <td className="vm-td" style={{ padding: "13px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        className="vm-action-btn"
                        title="Ver detalle"
                        onClick={() => setModalView(v)}
                      >
                        <Eye size={16} color="#2E4739" />
                      </button>
                      <button
                        className="vm-action-btn"
                        title="Editar"
                        onClick={() => setModalEdit(v)}
                      >
                        <Edit size={16} color="#1d4ed8" />
                      </button>
                      <button
                        className="vm-action-btn del"
                        title="Eliminar"
                        onClick={() => setModalDelete(v)}
                      >
                        <Trash2 size={16} color="#b03a1a" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL Crear */}
      <Modal
        open={modalCreate}
        onClose={() => setModalCreate(false)}
        title="Nuevo Registro de Víctima"
        maxWidth="680px"
      >
        <VictimForm
          onSave={handleCreate}
          onCancel={() => setModalCreate(false)}
          saveLabel="Crear Registro"
        />
      </Modal>

      {/* MODAL Ver */}
      <Modal
        open={!!modalView}
        onClose={() => setModalView(null)}
        title="Detalle de la Víctima"
        maxWidth="560px"
      >
        {modalView && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "20px",
                padding: "16px",
                background: "rgba(46,71,57,0.06)",
                borderRadius: "12px",
              }}
            >
              {modalView.photoUrl ? (
                <img
                  src={modalView.photoUrl}
                  alt={modalView.name}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(46,71,57,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User size={24} color="#2E4739" />
                </div>
              )}
              <div>
                <div
                  style={{ fontSize: "20px", fontWeight: 800, color: "#111" }}
                >
                  {modalView.name}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "4px",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background:
                      modalView.status === "Documentado"
                        ? "rgba(39,103,73,0.12)"
                        : "rgba(180,83,9,0.12)",
                    color:
                      modalView.status === "Documentado"
                        ? "#276749"
                        : "#b45309",
                  }}
                >
                  {modalView.status}
                </span>
              </div>
            </div>
            <InfoRow
              icon={Calendar}
              label="Fecha de desaparición"
              value={modalView.dateOfDisappearance}
            />
            <InfoRow
              icon={User}
              label="Edad al desaparecer"
              value={modalView.age ? `${modalView.age} años` : null}
            />
            <InfoRow
              icon={User}
              label="Contacto familiar"
              value={modalView.familyContact}
            />
            <InfoRow icon={Phone} label="Teléfono" value={modalView.phone} />
            <InfoRow icon={FileText} label="Notas" value={modalView.notes} />
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setModalView(null);
                  setModalEdit(modalView);
                }}
                style={{
                  padding: "10px 22px",
                  borderRadius: "9px",
                  border: "none",
                  background: "#2E4739",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Editar este registro
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL Editar */}
      <Modal
        open={!!modalEdit}
        onClose={() => setModalEdit(null)}
        title="Editar Registro"
        maxWidth="680px"
      >
        {modalEdit && (
          <VictimForm
            initial={{
              name: modalEdit.name,
              dateOfDisappearance: modalEdit.dateOfDisappearance,
              location: modalEdit.location,
              status: modalEdit.status,
              photo: modalEdit.photo,
              photoUrl: modalEdit.photoUrl,
              familyContact: modalEdit.familyContact,
              phone: modalEdit.phone,
              notes: modalEdit.notes,
              age: modalEdit.age,
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
        maxWidth="440px"
      >
        {modalDelete && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(176,58,26,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <Trash2 size={26} color="#b03a1a" />
            </div>
            <p style={{ fontSize: "16px", color: "#333", marginBottom: "8px" }}>
              ¿Estás seguro de que deseas eliminar el registro de
            </p>
            <p
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#111",
                marginBottom: "20px",
              }}
            >
              {modalDelete.name}?
            </p>
            <p
              style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}
            >
              Esta acción no se puede deshacer.
            </p>
            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={() => setModalDelete(null)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "9px",
                  border: "1.5px solid rgba(46,71,57,0.2)",
                  background: "transparent",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 24px",
                  borderRadius: "9px",
                  border: "none",
                  background: "#b03a1a",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
