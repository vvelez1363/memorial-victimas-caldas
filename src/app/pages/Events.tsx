import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { mockEvents } from "../data/mock-data";

export function Events() {
  const [selectedType, setSelectedType] = useState<'all' | 'commemoration' | 'workshop' | 'dialogue'>('all');

  const filteredEvents = selectedType === 'all' 
    ? mockEvents 
    : mockEvents.filter(e => e.type === selectedType);

  const typeConfig = {
    commemoration: { label: 'Conmemoración', color: 'bg-[#B2916F]' },
    workshop: { label: 'Taller', color: 'bg-[#2E4739]' },
    dialogue: { label: 'Diálogo', color: 'bg-[#5a6d5e]' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F3ED] to-[#FFFDF8]">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#2E4739] to-[#3d5a49] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Calendar className="w-16 h-16 mx-auto mb-6 text-[#B2916F]" />
            <h1 className="font-display text-5xl mb-6">Agenda de Eventos</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Espacios de encuentro, memoria y diálogo para construir juntos 
              un camino hacia la verdad y la reconciliación.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-[#FFFDF8] border-b border-[#2E4739]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="commemoration">Conmemoraciones</TabsTrigger>
              <TabsTrigger value="workshop">Talleres</TabsTrigger>
              <TabsTrigger value="dialogue">Diálogos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Calendar View */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Events List */}
          <div className="space-y-6">
            {filteredEvents.map((event, index) => {
              const eventDate = new Date(event.date);
              const config = typeConfig[event.type];
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      {/* Date Section */}
                      <div className={`${config.color} text-white p-6 md:w-48 flex flex-col items-center justify-center text-center`}>
                        <div className="text-5xl font-display mb-2">
                          {eventDate.getDate()}
                        </div>
                        <div className="text-xl font-display">
                          {eventDate.toLocaleDateString('es-CO', { month: 'long' })}
                        </div>
                        <div className="text-sm mt-1 opacity-90">
                          {eventDate.getFullYear()}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <Badge className={`${config.color} text-white mb-3`}>
                              {config.label}
                            </Badge>
                            <h3 className="font-display text-2xl text-[#1a1a1a] mb-2">
                              {event.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-[#6b6b5b]">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#B2916F]" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#B2916F]" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg">No hay eventos programados de este tipo</p>
            </div>
          )}
        </div>
      </section>

      {/* Event Types Info */}
      <section className="py-16 bg-[#F6F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-center text-[#2E4739] mb-12">
            Tipos de Eventos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 text-center h-full">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#B2916F] rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-[#2E4739] mb-3">Conmemoraciones</h3>
                <p className="text-[#6b6b5b]">
                  Encuentros para honrar la memoria de las víctimas y sus familias. 
                  Espacios de homenaje y dignificación.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 text-center h-full">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#2E4739] rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-[#2E4739] mb-3">Talleres</h3>
                <p className="text-[#6b6b5b]">
                  Espacios de formación y acompañamiento psicosocial para familias 
                  y comunidades afectadas.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 text-center h-full">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#5a6d5e] rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl text-[#2E4739] mb-3">Diálogos</h3>
                <p className="text-[#6b6b5b]">
                  Círculos de diálogo para la construcción de memoria colectiva 
                  y procesos de verdad.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#2E4739] to-[#3d5a49] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl mb-6">¿Quieres Participar?</h2>
          <p className="text-xl text-white/90 mb-8">
            Todos los eventos están abiertos a la comunidad. Tu presencia y apoyo 
            son importantes para las familias y el proceso de memoria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-left">
              <h3 className="font-display text-lg mb-2 text-[#B2916F]">Gratuitos</h3>
              <p className="text-white/90 text-sm">
                Todos los eventos son gratuitos y de libre acceso
              </p>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-left">
              <h3 className="font-display text-lg mb-2 text-[#B2916F]">Abiertos</h3>
              <p className="text-white/90 text-sm">
                Abiertos a toda la comunidad de Samaná y alrededores
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}