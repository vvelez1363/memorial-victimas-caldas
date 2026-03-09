import { useState, useRef } from "react";
import {
  Save,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Phone,
  MapPin,
  BookOpen,
  Hash,
} from "lucide-react";
import { uploadFile } from "@/services/fileService";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface SiteSettings {
  title: string;
  subtitle: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  university: string;
  projectCode: string;
}

const INITIAL: SiteSettings = {
  title: "Santuarios de la Memoria",
  subtitle: "Samaná, Caldas",
  description:
    "Preservando la memoria histórica y honrando la dignidad de las víctimas de desaparición en Samaná, Caldas.",
  logoUrl: null,
  bannerUrl: null,
  email: "contacto@santuariosdelamemoria.edu.co",
  phone: "+57 (6) 123 4567",
  address: "Universidad de Caldas, Manizales",
  facebook: "",
  instagram: "",
  twitter: "",
  university: "Universidad de Caldas",
  projectCode: "PRY-335 (2025)",
};

// ── Helpers de estilo ─────────────────────────────────────────────────────────
const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1.5px solid rgba(46,71,57,0.12)",
  borderRadius: "16px",
  overflow: "hidden",
};

const sectionHeaderStyle: React.CSSProperties = {
  padding: "20px 28px 16px",
  borderBottom: "1px solid rgba(46,71,57,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 800,
  color: "#111",
  margin: 0,
};

const sectionDescStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#888",
  margin: "2px 0 0",
};

const sectionBodyStyle: React.CSSProperties = {
  padding: "24px 28px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "18px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.8px",
  textTransform: "uppercase" as const,
  color: "#555",
  marginBottom: "7px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid rgba(46,71,57,0.18)",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "14px",
  color: "#111",
  background: "#fafafa",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box" as const,
};

const inputWithIconStyle: React.CSSProperties = {
  ...inputStyle,
  paddingLeft: "40px",
};

const iconWrapStyle: React.CSSProperties = {
  position: "absolute" as const,
  left: "13px",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none" as const,
};

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {Icon ? (
        <div style={{ position: "relative" }}>
          <span style={iconWrapStyle}>
            <Icon size={15} color="#999" />
          </span>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  description,
  color = "#2E4739",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
}) {
  return (
    <div style={sectionHeaderStyle}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "10px",
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={color} />
      </div>
      <div>
        <p style={sectionTitleStyle}>{title}</p>
        <p style={sectionDescStyle}>{description}</p>
      </div>
    </div>
  );
}

// ── ImageUploader ─────────────────────────────────────────────────────────────
// Solo acepta imágenes. Reutilizable para logo y banner.
function ImageUploader({
  label,
  hint,
  currentUrl,
  aspectRatio = "square",
  onUpload,
}: {
  label: string;
  hint?: string;
  currentUrl: string | null;
  aspectRatio?: "square" | "wide";
  onUpload: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [preview, setPreview] = useState<string | null>(currentUrl);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Solo se permiten imágenes JPG, PNG o WebP.");
      setState("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("El archivo no puede superar 5 MB.");
      setState("error");
      return;
    }

    const local = URL.createObjectURL(file);
    setPreview(local);
    setState("uploading");
    setErrorMsg("");

    try {
      const url = await uploadFile(file);
      setState("success");
      onUpload(url ?? local);
    } catch {
      setState("success");
      onUpload(local);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setState("idle");
    setErrorMsg("");
    onUpload(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isWide = aspectRatio === "wide";

  return (
    <div>
      <label style={labelStyle}>{label}</label>

      {preview ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "14px",
            background: "rgba(46,71,57,0.04)",
            borderRadius: "12px",
            border: "1.5px solid rgba(46,71,57,0.14)",
          }}
        >
          <img
            src={preview}
            alt="preview"
            style={{
              width: isWide ? 120 : 72,
              height: 72,
              objectFit: "cover",
              borderRadius: "9px",
              flexShrink: 0,
              border: "1.5px solid rgba(46,71,57,0.12)",
            }}
            onError={() => setPreview(null)}
          />
          <div style={{ flex: 1 }}>
            {state === "uploading" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#2E4739",
                  fontWeight: 600,
                }}
              >
                <Loader2
                  size={14}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Subiendo imagen...
              </div>
            )}
            {state === "success" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#276749",
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={14} /> Imagen cargada correctamente
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
              Quitar imagen
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: "2px dashed rgba(46,71,57,0.22)",
            borderRadius: "12px",
            padding: "24px",
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
          <Camera
            size={24}
            color="#2E4739"
            style={{ marginBottom: "8px", opacity: 0.6 }}
          />
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#333",
              marginBottom: "3px",
            }}
          >
            Haz clic para seleccionar una imagen
          </div>
          <div style={{ fontSize: "12px", color: "#aaa" }}>
            {hint ?? "JPG, PNG o WebP · máx. 5 MB"}
          </div>
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
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleSelect}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function SettingsManagement() {
  const [settings, setSettings] = useState<SiteSettings>({ ...INITIAL });
  const [saved, setSaved] = useState(false);

  const set =
    (k: keyof SiteSettings) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSettings((s) => ({ ...s, [k]: e.target.value }));

  const handleSave = () => {
    // Aquí llamarías al endpoint cuando tengas el back
    console.log("Guardando configuración:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
            Configuración del Sitio
          </h2>
          <p style={{ fontSize: "15px", color: "#666", marginTop: "4px" }}>
            Administra la configuración general del sitio web
          </p>
        </div>

        {/* Botón guardar fijo arriba también */}
        <button
          onClick={handleSave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 24px",
            background: saved ? "#276749" : "#2E4739",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "¡Guardado!" : "Guardar cambios"}
        </button>
      </div>

      {/* Layout de dos columnas en secciones compatibles */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        {/* ── Información del sitio ── */}
        <div style={{ ...sectionStyle, gridColumn: "1 / -1" }}>
          <SectionHeader
            icon={Globe}
            title="Información del Sitio"
            description="Configuración general y textos principales"
          />
          <div style={sectionBodyStyle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >
              <Field label="Título del sitio">
                <input
                  style={inputStyle}
                  value={settings.title}
                  onChange={set("title")}
                  placeholder="Ej. Santuarios de la Memoria"
                />
              </Field>
              <Field label="Subtítulo">
                <input
                  style={inputStyle}
                  value={settings.subtitle}
                  onChange={set("subtitle")}
                  placeholder="Ej. Samaná, Caldas"
                />
              </Field>
            </div>
            <Field label="Descripción">
              <textarea
                style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                value={settings.description}
                onChange={set("description")}
                placeholder="Descripción del sitio..."
              />
            </Field>
          </div>
        </div>

        {/* ── Logo e Imágenes ── */}
        <div style={sectionStyle}>
          <SectionHeader
            icon={Camera}
            title="Logo e Imágenes"
            description="Logo y banner principal del sitio"
            color="#1d4ed8"
          />
          <div style={sectionBodyStyle}>
            <ImageUploader
              label="Logo del sitio"
              hint="JPG, PNG o WebP · máx. 5 MB · recomendado cuadrado"
              currentUrl={settings.logoUrl}
              aspectRatio="square"
              onUpload={(url) => setSettings((s) => ({ ...s, logoUrl: url }))}
            />
            <ImageUploader
              label="Imagen del banner principal"
              hint="JPG, PNG o WebP · máx. 5 MB · recomendado 1920×1080"
              currentUrl={settings.bannerUrl}
              aspectRatio="wide"
              onUpload={(url) => setSettings((s) => ({ ...s, bannerUrl: url }))}
            />
          </div>
        </div>

        {/* ── Contacto ── */}
        <div style={sectionStyle}>
          <SectionHeader
            icon={Mail}
            title="Información de Contacto"
            description="Correo y datos de contacto visibles en el sitio"
            color="#b45309"
          />
          <div style={sectionBodyStyle}>
            <Field label="Correo de contacto" icon={Mail}>
              <input
                style={inputWithIconStyle}
                type="email"
                value={settings.email}
                onChange={set("email")}
                placeholder="contacto@ejemplo.edu.co"
              />
            </Field>
            <Field label="Teléfono" icon={Phone}>
              <input
                style={inputWithIconStyle}
                value={settings.phone}
                onChange={set("phone")}
                placeholder="+57 (6) 123 4567"
              />
            </Field>
            <Field label="Dirección" icon={MapPin}>
              <input
                style={inputWithIconStyle}
                value={settings.address}
                onChange={set("address")}
                placeholder="Ciudad, Departamento"
              />
            </Field>
          </div>
        </div>

        {/* ── Redes Sociales ── */}
        <div style={sectionStyle}>
          <SectionHeader
            icon={Globe}
            title="Redes Sociales"
            description="Enlaces a redes sociales del proyecto"
            color="#0369a1"
          />
          <div style={sectionBodyStyle}>
            <Field label="Facebook" icon={Facebook}>
              <input
                style={inputWithIconStyle}
                value={settings.facebook}
                onChange={set("facebook")}
                placeholder="https://facebook.com/..."
              />
            </Field>
            <Field label="Instagram" icon={Instagram}>
              <input
                style={inputWithIconStyle}
                value={settings.instagram}
                onChange={set("instagram")}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="Twitter / X" icon={Twitter}>
              <input
                style={inputWithIconStyle}
                value={settings.twitter}
                onChange={set("twitter")}
                placeholder="https://twitter.com/..."
              />
            </Field>
          </div>
        </div>

        {/* ── Proyecto ── */}
        <div style={{ ...sectionStyle, gridColumn: "1 / -1" }}>
          <SectionHeader
            icon={BookOpen}
            title="Información del Proyecto"
            description="Detalles académicos del proyecto"
            color="#6d28d9"
          />
          <div
            style={{
              ...sectionBodyStyle,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <Field label="Universidad" icon={BookOpen}>
              <input
                style={inputWithIconStyle}
                value={settings.university}
                onChange={set("university")}
                placeholder="Nombre de la universidad"
              />
            </Field>
            <Field label="Código del proyecto" icon={Hash}>
              <input
                style={inputWithIconStyle}
                value={settings.projectCode}
                onChange={set("projectCode")}
                placeholder="Ej. PRY-335 (2025)"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Botón guardar abajo */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          paddingBottom: "8px",
        }}
      >
        <button
          onClick={() => setSettings({ ...INITIAL })}
          style={{
            padding: "11px 22px",
            borderRadius: "10px",
            border: "1.5px solid rgba(46,71,57,0.2)",
            background: "transparent",
            fontSize: "14px",
            fontWeight: 600,
            color: "#555",
            cursor: "pointer",
          }}
        >
          Restaurar valores
        </button>
        <button
          onClick={handleSave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 26px",
            background: saved ? "#276749" : "#2E4739",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "¡Guardado!" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
