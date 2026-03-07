import { useState } from "react";
import { motion } from "motion/react";
import { Search, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";

export function TrackReport() {
  const [token, setToken] = useState("");
  const [searched, setSearched] = useState(false);
  const [reportStatus, setReportStatus] = useState<'pending' | 'reviewing' | 'approved' | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    // Simulate status (in real app, this would be an API call)
    const statuses = ['pending', 'reviewing', 'approved'];
    setReportStatus(statuses[Math.floor(Math.random() * statuses.length)] as any);
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Pendiente de Revisión',
      color: 'bg-yellow-500',
      description: 'Tu reporte ha sido recibido y está en la cola de revisión.'
    },
    reviewing: {
      icon: FileText,
      label: 'En Revisión',
      color: 'bg-blue-500',
      description: 'Nuestro equipo está analizando la información proporcionada.'
    },
    approved: {
      icon: CheckCircle,
      label: 'Procesado',
      color: 'bg-green-500',
      description: 'Tu reporte ha sido procesado y la información ha sido incorporada a nuestra base de datos.'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1a1a1a] to-[#2d4a5c] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Search className="w-16 h-16 mx-auto mb-6 text-[#d4af37]" />
            <h1 className="font-display text-5xl mb-6">Seguimiento de Reporte</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Consulta el estado de tu reporte usando el código que recibiste al enviarlo
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <form onSubmit={handleSearch}>
              <div className="mb-6">
                <Label htmlFor="token">Código de Seguimiento</Label>
                <Input
                  id="token"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="MEM-1234567890-XXXXXX"
                  className="mt-2 font-mono text-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Ingresa el código que recibiste al enviar tu reporte
                </p>
              </div>

              <Button 
                type="submit"
                size="lg" 
                className="w-full bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f]"
              >
                <Search className="w-5 h-5 mr-2" />
                Consultar Estado
              </Button>
            </form>
          </Card>

          {/* Results */}
          {searched && reportStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <Card className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`${statusConfig[reportStatus].color} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                    {(() => {
                      const Icon = statusConfig[reportStatus].icon;
                      return <Icon className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl text-[#1a1a1a] mb-2">
                      Estado: {statusConfig[reportStatus].label}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {statusConfig[reportStatus].description}
                    </p>
                    <Badge className={`${statusConfig[reportStatus].color} text-white`}>
                      Código: {token}
                    </Badge>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-display text-lg text-[#1a1a1a] mb-6">Línea de Tiempo</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-0.5 h-12 bg-gray-300" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-display text-sm text-[#1a1a1a]">Reporte Recibido</p>
                        <p className="text-xs text-gray-500">6 de marzo, 2026 - 10:30 AM</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full ${reportStatus !== 'pending' ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                          {reportStatus !== 'pending' ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        {reportStatus === 'approved' && <div className="w-0.5 h-12 bg-gray-300" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-display text-sm text-[#1a1a1a]">En Revisión</p>
                        {reportStatus !== 'pending' ? (
                          <p className="text-xs text-gray-500">7 de marzo, 2026 - 2:15 PM</p>
                        ) : (
                          <p className="text-xs text-gray-500">Pendiente</p>
                        )}
                      </div>
                    </div>

                    {reportStatus === 'approved' && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-display text-sm text-[#1a1a1a]">Procesado</p>
                          <p className="text-xs text-gray-500">8 de marzo, 2026 - 11:00 AM</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-display text-lg text-[#1a1a1a] mb-4">Próximos Pasos</h4>
                  {reportStatus === 'pending' && (
                    <p className="text-gray-600">
                      Tu reporte será revisado en los próximos días. Recibirás una notificación 
                      por correo electrónico cuando cambie el estado.
                    </p>
                  )}
                  {reportStatus === 'reviewing' && (
                    <p className="text-gray-600">
                      Nuestro equipo está verificando la información. Si necesitamos más detalles, 
                      nos pondremos en contacto contigo por correo electrónico.
                    </p>
                  )}
                  {reportStatus === 'approved' && (
                    <p className="text-gray-600">
                      Gracias por tu colaboración. La información ha sido incorporada a nuestra 
                      base de datos y será utilizada para los procesos de búsqueda y memoria histórica.
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {searched && !reportStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">
                  No se encontró ningún reporte con este código. 
                  Verifica que hayas ingresado el código correctamente.
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-2xl text-center text-[#1a1a1a] mb-8">
            ¿Tienes Preguntas?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="font-display text-lg mb-2">¿Perdiste tu Código?</h4>
              <p className="text-gray-600 text-sm mb-3">
                El código fue enviado a tu correo electrónico. Revisa tu bandeja de entrada 
                y la carpeta de spam.
              </p>
              <p className="text-gray-600 text-sm">
                Si no lo encuentras, escríbenos a: 
                <strong className="block mt-1">ayuda@santuariosdelamemoria.edu.co</strong>
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-display text-lg mb-2">Tiempos de Respuesta</h4>
              <p className="text-gray-600 text-sm">
                Los reportes son revisados en un plazo máximo de 5 días hábiles. 
                En casos urgentes, contáctanos directamente al: 
                <strong className="block mt-1">+57 300 123 4567</strong>
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
