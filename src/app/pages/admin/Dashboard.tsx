import { useNavigate } from "react-router";
import {
  Users,
  FileText,
  MapPin,
  Flag,
  TrendingUp,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Víctimas Registradas",
      value: "24",
      description: "Total de casos documentados",
      icon: Users,
      trend: "+2 este mes",
      accent: "#2E4739",
      bg: "rgba(46,71,57,0.13)",
      href: "/admin/victims",
    },
    {
      title: "Testimonios Publicados",
      value: "18",
      description: "Historias compartidas",
      icon: FileText,
      trend: "+5 nuevos",
      accent: "#3a7a54",
      bg: "rgba(58,122,84,0.13)",
      href: "/admin/testimonies",
    },
    {
      title: "Lugares de Memoria",
      value: "12",
      description: "Puntos en el mapa",
      icon: MapPin,
      trend: "3 regiones",
      accent: "#96703a",
      bg: "rgba(150,112,58,0.13)",
      href: "/admin/map",
    },
    {
      title: "Casos Reportados",
      value: "7",
      description: "Pendientes de revisión",
      icon: Flag,
      trend: "Requieren atención",
      accent: "#b03a1a",
      bg: "rgba(176,58,26,0.12)",
      href: "/admin/reports",
    },
    {
      title: "Eventos Programados",
      value: "5",
      description: "Próximas actividades",
      icon: Calendar,
      trend: "2 este mes",
      accent: "#4a6e38",
      bg: "rgba(74,110,56,0.12)",
      href: "/admin/events",
    },
    {
      title: "Visitas al Sitio",
      value: "1,234",
      description: "Este mes",
      icon: TrendingUp,
      trend: "+15% vs mes anterior",
      accent: "#7a5c2e",
      bg: "rgba(122,92,46,0.12)",
      href: null,
    },
  ];

  const quickActions = [
    {
      label: "Revisar 7 casos reportados",
      sub: "Pendientes de aprobación",
      icon: Flag,
      color: "#b03a1a",
      bg: "rgba(176,58,26,0.12)",
      urgent: true,
      href: "/admin/reports",
    },
    {
      label: "Actualizar línea de tiempo",
      sub: "Agregar eventos de 2025",
      icon: Calendar,
      color: "#2E4739",
      bg: "rgba(46,71,57,0.12)",
      urgent: false,
      href: "/admin/timeline",
    },
    {
      label: "Verificar testimonios nuevos",
      sub: "5 testimonios sin revisar",
      icon: FileText,
      color: "#3a7a54",
      bg: "rgba(58,122,84,0.12)",
      urgent: false,
      href: "/admin/testimonies",
    },
  ];

  const activity = [
    {
      action: "Nuevo testimonio publicado",
      time: "Hace 2 horas",
      user: "Admin Principal",
      type: "success",
    },
    {
      action: "Víctima actualizada: María López",
      time: "Hace 5 horas",
      user: "Editor 1",
      type: "info",
    },
    {
      action: "Caso reportado aprobado",
      time: "Hace 1 día",
      user: "Moderador",
      type: "success",
    },
    {
      action: "Evento creado: Conmemoración Anual",
      time: "Hace 2 días",
      user: "Admin Principal",
      type: "info",
    },
  ];

  return (
    <div className="space-y-6">
      <style>{`
        .dash-hero {
          background: linear-gradient(135deg, #2E4739 0%, #1d3028 100%);
          border-radius: 16px;
          padding: 40px 48px;
          position: relative;
          overflow: hidden;
        }
        .dash-hero::before {
          content: ''; position: absolute; top: -80px; right: -60px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(178,145,111,0.25) 0%, transparent 70%);
          border-radius: 50%;
        }
        .dash-hero-eyebrow {
          font-size: 11px; font-weight: 700;
          letter-spacing: 4px; text-transform: uppercase;
          color: #B2916F; margin-bottom: 12px;
        }
        .dash-hero-title {
          font-size: 36px; font-weight: 900;
          color: #ffffff; line-height: 1.15; margin-bottom: 10px;
        }
        .dash-hero-sub {
          font-size: 16px; color: rgba(255,255,255,0.6); font-weight: 400;
        }

        .dash-stats-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
        }
        .dash-stat-card {
          background: #ffffff;
          border: 1.5px solid rgba(46,71,57,0.12);
          border-radius: 14px; padding: 24px 20px;
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .dash-stat-card[data-clickable="true"] { cursor: pointer; }
        .dash-stat-card[data-clickable="true"]:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(46,71,57,0.16);
          border-color: var(--accent);
        }
        .dash-stat-card[data-clickable="true"]:hover .dash-stat-hint { opacity: 1; transform: translateX(0); }
        .dash-stat-card[data-clickable="false"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(46,71,57,0.10);
        }
        .dash-stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 4px; border-radius: 14px 14px 0 0;
          background: var(--accent);
        }
        .dash-stat-hint {
          position: absolute; top: 14px; right: 14px;
          opacity: 0; transform: translateX(4px);
          transition: opacity 0.2s, transform 0.2s;
          color: var(--accent);
        }
        .dash-stat-icon {
          width: 52px; height: 52px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .dash-stat-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #444; margin-bottom: 6px;
        }
        .dash-stat-value {
          font-size: 48px; font-weight: 900;
          color: #111; line-height: 1; margin-bottom: 6px;
        }
        .dash-stat-desc {
          font-size: 14px; color: #333;
        }
        .dash-stat-trend {
          margin-top: 12px; display: inline-flex; align-items: center;
          font-size: 12px; font-weight: 700;
          padding: 4px 11px; border-radius: 20px;
        }

        .dash-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .dash-panel {
          background: #ffffff;
          border: 1.5px solid rgba(46,71,57,0.12);
          border-radius: 14px; padding: 26px;
        }
        .dash-panel-title {
          font-size: 20px; font-weight: 800; color: #111; margin-bottom: 4px;
        }
        .dash-panel-sub {
          font-size: 13px; color: #666; margin-bottom: 20px;
        }

        .dash-activity-item {
          display: flex; gap: 13px; padding: 12px 0;
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }
        .dash-activity-item:last-child { border-bottom: none; }
        .dash-activity-dot {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }
        .dash-activity-action {
          font-size: 14px; font-weight: 700; color: #111; margin-bottom: 3px;
        }
        .dash-activity-meta {
          font-size: 12px; color: #666;
          display: flex; gap: 5px; align-items: center;
        }

        .dash-qa-btn {
          width: 100%; background: transparent;
          border: 1.5px solid rgba(46,71,57,0.12);
          border-radius: 11px; padding: 16px 18px;
          display: flex; align-items: center; gap: 14px;
          cursor: pointer; transition: all 0.18s;
          margin-bottom: 10px; text-align: left;
        }
        .dash-qa-btn:last-child { margin-bottom: 0; }
        .dash-qa-btn:hover {
          background: rgba(46,71,57,0.04);
          border-color: #2E4739;
          transform: translateX(4px);
          box-shadow: 0 4px 14px rgba(46,71,57,0.10);
        }
        .dash-qa-btn:hover .dash-qa-arrow { color: #2E4739; transform: translateX(3px); }
        .dash-qa-icon {
          width: 44px; height: 44px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dash-qa-label {
          font-size: 14px; font-weight: 700; color: #111; margin-bottom: 2px;
        }
        .dash-qa-sub { font-size: 13px; color: #555; }
        .dash-qa-arrow { color: #aaa; flex-shrink: 0; transition: color 0.18s, transform 0.18s; }
        .dash-urgent {
          font-size: 10px; font-weight: 800; letter-spacing: 1px;
          text-transform: uppercase; color: #b03a1a;
          background: rgba(176,58,26,0.12);
          padding: 2px 7px; border-radius: 10px;
          margin-left: 8px; vertical-align: middle;
        }

        @media (max-width: 900px) {
          .dash-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-bottom { grid-template-columns: 1fr; }
        }
        @media (max-width: 580px) {
          .dash-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <div className="dash-hero">
        <div className="dash-hero-eyebrow">Panel Administrativo</div>
        <h2 className="dash-hero-title">Santuarios de la Memoria</h2>
        <p className="dash-hero-sub">
          Samaná, Caldas — Gestión y seguimiento del proyecto
        </p>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const clickable = !!stat.href;
          return (
            <div
              key={stat.title}
              className="dash-stat-card"
              data-clickable={String(clickable)}
              style={{ "--accent": stat.accent }}
              onClick={() => stat.href && navigate(stat.href)}
              title={clickable ? `Ir a ${stat.title}` : undefined}
            >
              {clickable && (
                <span className="dash-stat-hint">
                  <ChevronRight size={17} strokeWidth={2.5} />
                </span>
              )}
              <div className="dash-stat-icon" style={{ background: stat.bg }}>
                <Icon size={26} color={stat.accent} strokeWidth={1.75} />
              </div>
              <div className="dash-stat-label">{stat.title}</div>
              <div className="dash-stat-value">{stat.value}</div>
              <div className="dash-stat-desc">{stat.description}</div>
              <div
                className="dash-stat-trend"
                style={{ color: stat.accent, background: stat.bg }}
              >
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="dash-bottom">
        <div className="dash-panel">
          <div className="dash-panel-title">Actividad Reciente</div>
          <div className="dash-panel-sub">Últimas acciones en el sistema</div>
          {activity.map((item, idx) => (
            <div key={idx} className="dash-activity-item">
              <div
                className="dash-activity-dot"
                style={{
                  background:
                    item.type === "success"
                      ? "rgba(46,71,57,0.12)"
                      : "rgba(178,145,111,0.15)",
                }}
              >
                {item.type === "success" ? (
                  <CheckCircle2 size={17} color="#2E4739" strokeWidth={2.2} />
                ) : (
                  <Clock size={17} color="#96703a" strokeWidth={2.2} />
                )}
              </div>
              <div>
                <div className="dash-activity-action">{item.action}</div>
                <div className="dash-activity-meta">
                  <span>{item.time}</span>
                  <span>·</span>
                  <span>{item.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-title">Acciones Rápidas</div>
          <div className="dash-panel-sub">Tareas pendientes y sugerencias</div>
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                className="dash-qa-btn"
                onClick={() => navigate(action.href)}
                title={`Ir a ${action.label}`}
              >
                <div className="dash-qa-icon" style={{ background: action.bg }}>
                  <Icon size={21} color={action.color} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="dash-qa-label">
                    {action.label}
                    {action.urgent && (
                      <span className="dash-urgent">Urgente</span>
                    )}
                  </div>
                  <div className="dash-qa-sub">{action.sub}</div>
                </div>
                <ChevronRight size={17} className="dash-qa-arrow" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
