import { motion } from "motion/react";
import { Clock, Circle } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockTimelineEvents } from "../data/mock-data";

export function Timeline() {
  const categoryConfig = {
    historical: { label: 'Histórico', color: 'bg-red-500' },
    search: { label: 'Búsqueda', color: 'bg-blue-500' },
    sanctuary: { label: 'Santuario', color: 'bg-[#d4af37]' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1a1a1a] to-[#2d4a5c] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Clock className="w-16 h-16 mx-auto mb-6 text-[#d4af37]" />
            <h1 className="font-display text-5xl mb-6">Línea de Tiempo Histórica</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Un recorrido por los hitos que han marcado el camino hacia la verdad, 
              la memoria y la reparación simbólica.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">Eventos Históricos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Procesos de Búsqueda</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#d4af37]" />
              <span className="text-sm">Santuario de la Memoria</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#d4af37] via-[#2d4a5c] to-[#4a7c59]" />

            {/* Timeline Events */}
            <div className="space-y-12">
              {mockTimelineEvents.map((event, index) => {
                const isLeft = index % 2 === 0;
                const category = categoryConfig[event.category];

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative flex items-center ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    } flex-col md:gap-8`}
                  >
                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right' : 'md:text-left'} mb-4 md:mb-0`}>
                      <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <Badge className={`${category.color} text-white mb-3`}>
                          {category.label}
                        </Badge>
                        <h3 className="font-display text-2xl text-[#1a1a1a] mb-2">
                          {event.title}
                        </h3>
                        <p className="text-[#d4af37] mb-3">{event.date}</p>
                        <p className="text-gray-700 leading-relaxed">
                          {event.description}
                        </p>
                      </Card>
                    </div>

                    {/* Center Dot */}
                    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center z-10">
                      <div className={`w-6 h-6 rounded-full ${category.color} border-4 border-white shadow-lg`}>
                        <Circle className="w-full h-full p-1 text-white" fill="currentColor" />
                      </div>
                    </div>

                    {/* Spacer for desktop */}
                    <div className="hidden md:block w-5/12" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#1a1a1a] to-[#2d4a5c] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl mb-6">Cada Día es un Paso hacia la Verdad</h2>
          <p className="text-xl text-gray-300 mb-8">
            El camino hacia la memoria, la verdad y la reparación continúa. 
            Tu participación es fundamental.
          </p>
        </div>
      </section>
    </div>
  );
}
