import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { createCase } from "@/services/casesService";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";

export function ReportCase() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [trackingToken, setTrackingToken] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "",
    municipality: "",
    victimName: "",
    details: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCase = await createCase({
      reporter: formData.name,
      email: formData.email,
      phone: formData.phone,
      relationship: formData.relationship,
      municipality: formData.municipality,
      victimName: formData.victimName,
      details: formData.details,
    });

    setTrackingToken(newCase.trackingCode);
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="font-display text-3xl text-[#1a1a1a] mb-4">
              Reporte Recibido
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Gracias por tu valentía al compartir esta información. Tu reporte
              ha sido recibido y será revisado con la mayor confidencialidad y
              respeto.
            </p>

            <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Tu código de seguimiento es:
              </p>
              <p className="font-mono text-2xl text-[#1a1a1a] mb-4">
                {trackingToken}
              </p>
              <p className="text-sm text-gray-600">
                Guarda este código para consultar el estado de tu reporte
              </p>
            </div>

            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Recibirás una respuesta por correo electrónico en un plazo
                máximo de 5 días hábiles.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate("/seguimiento")}
                className="bg-[#2d4a5c] text-white hover:bg-[#234158]"
              >
                Ir a Seguimiento
              </Button>
              <Button onClick={() => navigate("/")} variant="outline">
                Volver al Inicio
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

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
            <Shield className="w-16 h-16 mx-auto mb-6 text-[#d4af37]" />
            <h1 className="font-display text-5xl mb-6">Reportar un Caso</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tu información puede ayudar a las familias a encontrar la verdad.
              Todos los reportes son confidenciales y seguros.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert className="bg-green-50 border-green-200">
            <Shield className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Confidencialidad garantizada:</strong> Tu información será
              tratada con total confidencialidad y únicamente será compartida
              con las autoridades competentes cuando sea necesario.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <Card className="p-8">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="font-display text-2xl text-[#1a1a1a] mb-6">
                  Tu Información
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Ingresa tu nombre completo"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Correo Electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="tu@correo.com"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="(+57) 300 123 4567"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="relationship">
                      Relación con la Víctima *
                    </Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(v) => handleChange("relationship", v)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecciona tu relación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="familiar">Familiar</SelectItem>
                        <SelectItem value="amigo">Amigo/a</SelectItem>
                        <SelectItem value="vecino">Vecino/a</SelectItem>
                        <SelectItem value="testigo">Testigo</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Case Information */}
              <div className="mb-8">
                <h3 className="font-display text-2xl text-[#1a1a1a] mb-6">
                  Información del Caso
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="victimName">Nombre de la Víctima</Label>
                    <Input
                      id="victimName"
                      value={formData.victimName}
                      onChange={(e) =>
                        handleChange("victimName", e.target.value)
                      }
                      placeholder="Nombre completo de la víctima (si lo conoces)"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="municipality">Municipio *</Label>
                    <Select
                      value={formData.municipality}
                      onValueChange={(v) => handleChange("municipality", v)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecciona el municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="samana">Samaná</SelectItem>
                        <SelectItem value="victoria">La Victoria</SelectItem>
                        <SelectItem value="norcasia">Norcasia</SelectItem>
                        <SelectItem value="otro">
                          Otro municipio de Caldas
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="details">Detalles del Caso *</Label>
                    <Textarea
                      id="details"
                      required
                      value={formData.details}
                      onChange={(e) => handleChange("details", e.target.value)}
                      placeholder="Describe con el mayor detalle posible la información que conoces sobre el caso. Incluye fechas, lugares, circunstancias, y cualquier dato que consideres relevante."
                      rows={8}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Toda información, por pequeña que parezca, puede ser
                      valiosa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <Alert className="mb-6 bg-gray-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Al enviar este formulario, aceptas que tu información sea
                  utilizada únicamente para fines de búsqueda de verdad y
                  memoria histórica. Tus datos personales serán protegidos según
                  la ley de protección de datos vigente.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f]"
                >
                  Enviar Reporte
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </section>

      {/* Support Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-2xl text-center text-[#1a1a1a] mb-8">
            ¿Necesitas Ayuda?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="font-display text-lg mb-2">
                Acompañamiento Psicosocial
              </h4>
              <p className="text-gray-600 text-sm">
                Si necesitas apoyo emocional o acompañamiento, contáctanos al:
                <strong className="block mt-1">+57 300 123 4567</strong>
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-display text-lg mb-2">Asesoría Legal</h4>
              <p className="text-gray-600 text-sm">
                Ofrecemos orientación legal gratuita para familias de víctimas.
                <strong className="block mt-1">
                  asesoria@santuariosdelamemoria.edu.co
                </strong>
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
