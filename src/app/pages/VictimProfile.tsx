import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Search,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockVictims } from "../data/mock-data";

export function VictimProfile() {
  const { id } = useParams();
  const victim = mockVictims.find((v) => v.id === id);

  if (!victim) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Víctima no encontrada</h1>
          <Link to="/victimas">
            <Button>Volver a la galería</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    searching: {
      label: "En búsqueda",
      icon: Search,
      color: "bg-[#2d4a5c] text-white",
      description: "La búsqueda continúa activamente",
    },
    found: {
      label: "Encontrado",
      icon: AlertCircle,
      color: "bg-[#4a7c59] text-white",
      description: "Se ha localizado información relevante",
    },
    identified: {
      label: "Identificado",
      icon: CheckCircle,
      color: "bg-[#d4af37] text-[#1a1a1a]",
      description: "Identificación confirmada",
    },
  };

  const status = statusConfig[victim.searchStatus];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/victimas">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a la galería
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-[#1a1a1a] to-[#2d4a5c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="relative">
                <img
                  src={victim.photo}
                  alt={victim.name}
                  className="w-full aspect-[3/4] object-cover rounded-lg shadow-2xl"
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    className={`${status.color} flex items-center gap-2 text-sm px-3 py-1`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                  </Badge>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col justify-center"
            >
              <h1 className="font-display text-5xl mb-6">{victim.name}</h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="w-6 h-6 text-[#d4af37]" />
                  <div>
                    <span className="text-gray-300">
                      Fecha de desaparición:{" "}
                    </span>
                    <span className="text-white">
                      {new Date(victim.dateOfDisappearance).toLocaleDateString(
                        "es-CO",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-lg">
                  <MapPin className="w-6 h-6 text-[#d4af37]" />
                  <div>
                    <span className="text-gray-300">Municipio: </span>
                    <span className="text-white">{victim.municipality}</span>
                  </div>
                </div>

                {victim.age && (
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-6 h-6 flex items-center justify-center text-[#d4af37]">
                      👤
                    </div>
                    <div>
                      <span className="text-gray-300">
                        Edad al momento de la desaparición:{" "}
                      </span>
                      <span className="text-white">{victim.age} años</span>
                    </div>
                  </div>
                )}
              </div>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <h3 className="font-display text-xl mb-2 text-[#d4af37]">
                  Estado de Búsqueda
                </h3>
                <p className="text-gray-200">{status.description}</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biography */}
      {victim.biography && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl text-[#1a1a1a] mb-6">
                Historia de Vida
              </h2>
              <Card className="p-8 bg-white shadow-lg">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {victim.biography}
                </p>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {victim.gallery && victim.gallery.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl text-[#1a1a1a] mb-8">
                Galería de Fotos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {victim.gallery.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg"
                  >
                    <img
                      src={photo}
                      alt={`${victim.name} - Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Location Map */}
      {victim.location && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl text-[#1a1a1a] mb-8">
                Lugar de Desaparición
              </h2>
              <Card className="p-6 bg-white shadow-lg">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-[#2d4a5c] mx-auto mb-4" />
                    <p className="text-gray-600">
                      Coordenadas: {victim.location.lat}, {victim.location.lng}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {victim.municipality}, Caldas
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#1a1a1a] to-[#2d4a5c] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl mb-6">
            ¿Tienes información sobre este caso?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Tu información podría ser clave para ayudar a esta familia a
            encontrar la verdad.
          </p>
          <Link to="/login">
            <Button
              size="lg"
              className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f]"
            >
              Login
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
