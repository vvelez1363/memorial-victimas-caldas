import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Filter, X } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { mockMemoryPlaces, mockVictims } from "../data/mock-data";

export function MemoryMap() {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredPlaces = mockMemoryPlaces.filter(place => 
    typeFilter === "all" || place.type === typeFilter
  );

  const selectedPlaceData = selectedPlace 
    ? mockMemoryPlaces.find(p => p.id === selectedPlace) 
    : null;

  const typeConfig = {
    disappearance: { label: 'Desaparición', color: 'bg-red-500' },
    encounter: { label: 'Encuentro', color: 'bg-[#2E4739]' },
    memorial: { label: 'Memorial', color: 'bg-[#B2916F]' }
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
            <MapPin className="w-16 h-16 mx-auto mb-6 text-[#B2916F]" />
            <h1 className="font-display text-5xl mb-6">Mapa de Memoria</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Cada lugar cuenta una historia. Explora los sitios que preservan la memoria 
              de las víctimas en Samaná, Caldas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#B2916F]" />
                  Filtrar por Tipo
                </h3>
                <div className="space-y-2">
                  <Button
                    variant={typeFilter === "all" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setTypeFilter("all")}
                  >
                    Todos los lugares
                  </Button>
                  <Button
                    variant={typeFilter === "disappearance" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setTypeFilter("disappearance")}
                  >
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    Desaparición
                  </Button>
                  <Button
                    variant={typeFilter === "encounter" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setTypeFilter("encounter")}
                  >
                    <div className="w-3 h-3 rounded-full bg-[#2E4739] mr-2" />
                    Encuentro
                  </Button>
                  <Button
                    variant={typeFilter === "memorial" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setTypeFilter("memorial")}
                  >
                    <div className="w-3 h-3 rounded-full bg-[#B2916F] mr-2" />
                    Memorial
                  </Button>
                </div>
              </Card>

              {/* Places List */}
              <div className="space-y-3">
                <h3 className="font-display text-xl">Lugares ({filteredPlaces.length})</h3>
                {filteredPlaces.map((place) => (
                  <Card
                    key={place.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPlace === place.id ? 'border-[#B2916F] border-2' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedPlace(place.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${typeConfig[place.type].color}`} />
                      <div className="flex-1">
                        <h4 className="font-display text-lg">{place.name}</h4>
                        <Badge className="mt-1 text-xs">{typeConfig[place.type].label}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map Container */}
            <div className="lg:col-span-2">
              <Card className="p-0 overflow-hidden h-[600px] relative">
                {/* Map Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                  
                  {/* Map Markers */}
                  <div className="absolute inset-0 p-8">
                    {filteredPlaces.map((place, index) => (
                      <motion.div
                        key={place.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="absolute cursor-pointer"
                        style={{
                          left: `${20 + (index * 15) % 60}%`,
                          top: `${30 + (index * 20) % 40}%`,
                        }}
                        onClick={() => setSelectedPlace(place.id)}
                      >
                        <div className={`relative ${selectedPlace === place.id ? 'scale-125' : ''} transition-transform`}>
                          <MapPin
                            className={`w-8 h-8 ${typeConfig[place.type].color.replace('bg-', 'text-')} drop-shadow-lg`}
                            fill="currentColor"
                          />
                          {selectedPlace === place.id && (
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Info Text */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
                    <p className="text-sm text-gray-700">
                      <strong>Samaná, Caldas</strong><br />
                      {filteredPlaces.length} lugares de memoria documentados
                    </p>
                  </div>
                </div>

                {/* Place Details Overlay */}
                {selectedPlaceData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 right-4 left-4 md:left-auto md:w-96 bg-white rounded-lg shadow-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full mt-1 ${typeConfig[selectedPlaceData.type].color}`} />
                        <div>
                          <h3 className="font-display text-xl">{selectedPlaceData.name}</h3>
                          <Badge className="mt-1">{typeConfig[selectedPlaceData.type].label}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPlace(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-gray-700 mb-4">{selectedPlaceData.description}</p>

                    {selectedPlaceData.victims && selectedPlaceData.victims.length > 0 && (
                      <div>
                        <h4 className="font-display text-sm text-gray-500 mb-2">
                          Víctimas asociadas ({selectedPlaceData.victims.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedPlaceData.victims.slice(0, 3).map(victimId => {
                            const victim = mockVictims.find(v => v.id === victimId);
                            return victim ? (
                              <div key={victimId} className="flex items-center gap-2 text-sm">
                                <img
                                  src={victim.photo}
                                  alt={victim.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <span>{victim.name}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-12 bg-[#F6F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <h3 className="font-display text-2xl mb-6 text-[#2E4739]">Simbología del Mapa</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-8 h-8 text-red-500" fill="currentColor" />
                <div>
                  <h4 className="font-display text-lg text-[#2E4739]">Puntos de Desaparición</h4>
                  <p className="text-sm text-[#6b6b5b]">Últimos lugares donde fueron vistas las víctimas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-8 h-8 text-[#2E4739]" fill="currentColor" />
                <div>
                  <h4 className="font-display text-lg text-[#2E4739]">Lugares de Encuentro</h4>
                  <p className="text-sm text-[#6b6b5b]">Espacios de diálogo y construcción de memoria</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-8 h-8 text-[#B2916F]" fill="currentColor" />
                <div>
                  <h4 className="font-display text-lg text-[#2E4739]">Memoriales</h4>
                  <p className="text-sm text-[#6b6b5b]">Lugares de homenaje y conmemoración</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}