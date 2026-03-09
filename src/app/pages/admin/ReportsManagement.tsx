import { useMemo, useState } from "react";
import { Search, Eye, Check, X, Archive, Clock } from "lucide-react";
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

export function ReportsManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const [cases, setCases] = useState([
    {
      id: 1,
      reporter: "María Fernanda López",
      email: "maria.lopez@email.com",
      municipality: "Samaná",
      reportDate: "2024-03-10",
      trackingCode: "CALDAS-001",
      priority: "Alta",
      status: "Pendiente",
      description:
        "Mi padre desapareció en 2002 en la vereda La Esperanza. Fue visto por última vez cuando salía hacia el trabajo.",
    },
    {
      id: 2,
      reporter: "Carlos Andrés Ríos",
      email: "carlos.rios@email.com",
      municipality: "Pensilvania",
      reportDate: "2024-02-22",
      trackingCode: "CALDAS-002",
      priority: "Media",
      status: "En Revisión",
      description:
        "Estamos buscando información sobre la desaparición de mi hermano ocurrida durante el conflicto armado.",
    },
    {
      id: 3,
      reporter: "Ana Lucía Martínez",
      email: "ana.martinez@email.com",
      municipality: "Manzanares",
      reportDate: "2024-01-15",
      trackingCode: "CALDAS-003",
      priority: "Baja",
      status: "Aprobado",
      description:
        "Caso documentado por la familia para incluir en el memorial de víctimas del municipio.",
    },
    {
      id: 4,
      reporter: "José David Torres",
      email: "jose.torres@email.com",
      municipality: "Marquetalia",
      reportDate: "2024-03-01",
      trackingCode: "CALDAS-004",
      priority: "Alta",
      status: "Archivado",
      description:
        "Información recopilada sobre desaparición forzada reportada por la comunidad.",
    },
  ]);

  const loading = false;

  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const [actionModal, setActionModal] = useState<{
    type: "review" | "approve" | "archive" | "delete" | null;
    report: any | null;
  }>({ type: null, report: null });

  const reports = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return cases;
    return cases.filter(
      (item) =>
        item.reporter.toLowerCase().includes(normalized) ||
        item.email.toLowerCase().includes(normalized) ||
        item.municipality.toLowerCase().includes(normalized) ||
        item.trackingCode.toLowerCase().includes(normalized),
    );
  }, [cases, searchTerm]);

  const changeStatus = (id: number, status: string) => {
    setCases((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const removeCase = (id: number) => {
    setCases((prev) => prev.filter((item) => item.id !== id));
  };

  const stats = {
    pending: cases.filter((c) => c.status === "Pendiente").length,
    inReview: cases.filter((c) => c.status === "En Revisión").length,
    approved: cases.filter((c) => c.status === "Aprobado").length,
    archived: cases.filter((c) => c.status === "Archivado").length,
  };

  const statusClassMap: Record<string, string> = {
    Pendiente: "bg-amber-100 text-amber-800",
    "En Revisión": "bg-blue-100 text-blue-800",
    Aprobado: "bg-green-100 text-green-800",
    Archivado: "bg-gray-200 text-gray-800",
  };

  const actionLabels: Record<string, string> = {
    review: "poner en revisión",
    approve: "aprobar",
    archive: "archivar",
    delete: "eliminar",
  };

  const confirmAction = () => {
    if (!actionModal.report) return;
    if (actionModal.type === "review")
      changeStatus(actionModal.report.id, "En Revisión");
    if (actionModal.type === "approve")
      changeStatus(actionModal.report.id, "Aprobado");
    if (actionModal.type === "archive")
      changeStatus(actionModal.report.id, "Archivado");
    if (actionModal.type === "delete") removeCase(actionModal.report.id);
    setActionModal({ type: null, report: null });
  };

  const tableHeads: { label: string; right?: boolean }[] = [
    { label: "Reportado por" },
    { label: "Correo" },
    { label: "Municipio" },
    { label: "Fecha" },
    { label: "Prioridad" },
    { label: "Estado" },
    { label: "Acciones", right: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display text-[#1a1a1a]">
          Casos Reportados
        </h2>
        <p className="text-gray-600 mt-1">
          Gestiona los casos reportados por la comunidad
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Pendientes"
          value={stats.pending}
          color="text-amber-600"
        />
        <StatCard
          title="En Revisión"
          value={stats.inReview}
          color="text-blue-600"
        />
        <StatCard
          title="Aprobados"
          value={stats.approved}
          color="text-green-600"
        />
        <StatCard
          title="Archivados"
          value={stats.archived}
          color="text-gray-600"
        />
      </div>

      {/* BUSCADOR */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, municipio o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLA */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Reportes</CardTitle>
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
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Cargando reportes...
                    </TableCell>
                  </TableRow>
                )}

                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {report.reporter}
                    </TableCell>
                    <TableCell>{report.email}</TableCell>
                    <TableCell>{report.municipality}</TableCell>
                    <TableCell>{report.reportDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          report.priority === "Alta"
                            ? "bg-red-100 text-red-800"
                            : report.priority === "Media"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {report.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusClassMap[report.status] ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Ver detalle */}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Ver detalle"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {/* Poner en revisión */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600"
                          title="Poner en revisión"
                          onClick={() =>
                            setActionModal({ type: "review", report })
                          }
                        >
                          <Clock className="w-4 h-4" />
                        </Button>

                        {/* Aprobar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          title="Aprobar"
                          onClick={() =>
                            setActionModal({ type: "approve", report })
                          }
                        >
                          <Check className="w-4 h-4" />
                        </Button>

                        {/* Archivar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600"
                          title="Archivar"
                          onClick={() =>
                            setActionModal({ type: "archive", report })
                          }
                        >
                          <Archive className="w-4 h-4" />
                        </Button>

                        {/* Eliminar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          title="Eliminar"
                          onClick={() =>
                            setActionModal({ type: "delete", report })
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && reports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No hay reportes con ese criterio de búsqueda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DETALLES */}
      <Modal
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Detalles del Reporte"
      >
        {selectedReport && (
          <div className="space-y-3 text-sm">
            <Detail label="Reportado por" value={selectedReport.reporter} />
            <Detail label="Correo" value={selectedReport.email} />
            <Detail label="Municipio" value={selectedReport.municipality} />
            <Detail label="Fecha" value={selectedReport.reportDate} />
            <Detail
              label="Código de seguimiento"
              value={selectedReport.trackingCode}
            />
            <Detail label="Descripción" value={selectedReport.description} />
          </div>
        )}
      </Modal>

      {/* MODAL CONFIRMACION */}
      <Modal
        open={!!actionModal.type}
        onClose={() => setActionModal({ type: null, report: null })}
        title="Confirmar acción"
      >
        <div className="text-center space-y-4">
          <p>
            ¿Seguro que deseas{" "}
            <strong>
              {actionModal.type ? actionLabels[actionModal.type] : ""}
            </strong>{" "}
            este reporte?
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setActionModal({ type: null, report: null })}
            >
              Cancelar
            </Button>
            <Button className="bg-[#d4af37] text-black" onClick={confirmAction}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({ title, value, color }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <p className="text-sm text-gray-600">{title}</p>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: any) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
