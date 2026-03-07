import { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter } from "lucide-react";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { VictimCard } from "../components/VictimCard";
import { mockVictims } from "../data/mock-data";

export function VictimGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVictims = mockVictims.filter(victim => {
    const matchesSearch = victim.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || victim.searchStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="font-display text-5xl mb-6">Galería de Víctimas</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Cada rostro es una historia de vida, esperanza y dignidad. 
              Honramos su memoria y continuamos la búsqueda de la verdad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-[#FFFDF8] border-b border-[#2E4739]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b6b5b] w-5 h-5" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Estado de búsqueda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="searching">En búsqueda</SelectItem>
                  <SelectItem value="found">Encontrado</SelectItem>
                  <SelectItem value="identified">Identificado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-[#6b6b5b]">
            Mostrando {filteredVictims.length} de {mockVictims.length} víctimas
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredVictims.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredVictims.map((victim, index) => (
                <motion.div
                  key={victim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VictimCard victim={victim} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#6b6b5b] text-lg">No se encontraron víctimas con los criterios seleccionados</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}