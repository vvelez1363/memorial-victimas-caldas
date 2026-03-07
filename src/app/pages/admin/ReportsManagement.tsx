import { useMemo, useState } from "react";
import { Search, Eye, Check, X, Archive } from "lucide-react";
import { useCases } from "@/hooks/useCases";
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

export function ReportsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { cases, loading, stats, changeStatus, removeCase } = useCases();

  const reports = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return cases;
    }

    return cases.filter((item) => {
      return (
        item.reporter.toLowerCase().includes(normalized) ||
        item.email.toLowerCase().includes(normalized) ||
        item.municipality.toLowerCase().includes(normalized) ||
        item.trackingCode.toLowerCase().includes(normalized)
      );
    });
  }, [cases, searchTerm]);

  const statusClassMap: Record<string, string> = {
    Pendiente: "bg-amber-100 text-amber-800",
    "En Revisión": "bg-blue-100 text-blue-800",
    Aprobado: "bg-green-100 text-green-800",
    Archivado: "bg-gray-200 text-gray-800",
  };

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
            <p className="text-sm text-gray-600">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {stats.inReview}
            </div>
            <p className="text-sm text-gray-600">En Revisión</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <p className="text-sm text-gray-600">Aprobados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {stats.archived}
            </div>
            <p className="text-sm text-gray-600">Archivados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, municipio o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reportado por</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Municipio</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500 py-10"
                    >
                      Cargando reportes...
                    </TableCell>
                  </TableRow>
                ) : null}

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
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-green-600"
                          title="Aprobar"
                          onClick={() => changeStatus(report.id, "Aprobado")}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-600"
                          title="Archivar"
                          onClick={() => changeStatus(report.id, "Archivado")}
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600"
                          title="Eliminar"
                          onClick={() => removeCase(report.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && reports.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500 py-10"
                    >
                      No hay reportes con ese criterio de búsqueda.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
