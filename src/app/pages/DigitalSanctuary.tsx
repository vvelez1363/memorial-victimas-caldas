import { motion } from "motion/react";
import { Heart, Sparkles, Flower2, Flame } from "lucide-react";
import { Card } from "../components/ui/card";
import { ParticleEffect } from "../components/ParticleEffect";
import { mockVictims } from "../data/mock-data";

export function DigitalSanctuary() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2E4739] via-[#3d5a49] to-[#2E4739]">
      {/* Hero - Entrance */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1767301140209-6158da670c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMGdhcmRlbiUyMG1lbW9yaWFsJTIwZmxvd2Vyc3xlbnwxfHx8fDE3NzI3MzAzNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Jardín de memoria"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        </div>

        <ParticleEffect />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#B2916F]/20 backdrop-blur-sm mb-8">
              <Heart className="w-12 h-12 text-[#B2916F]" fill="currentColor" />
            </div>
            
            <h1 className="font-display text-6xl text-white mb-6">
              Santuario Digital
            </h1>
            
            <p className="text-2xl text-white/90 mb-12 leading-relaxed">
              Un espacio sagrado para honrar la memoria, 
              <br />
              celebrar la vida y encontrar esperanza
            </p>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#B2916F]"
            >
              <p className="text-sm mb-2">Comienza el recorrido</p>
              <div className="w-6 h-10 border-2 border-[#B2916F]/50 rounded-full mx-auto flex items-start justify-center p-2">
                <div className="w-1 h-2 bg-[#B2916F]/50 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Garden of Memory */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#2E4739]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Flower2 className="w-16 h-16 mx-auto mb-6 text-[#5a6d5e]" />
            <h2 className="font-display text-5xl text-white mb-6">Jardín de las Almas</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Cada flor representa una vida, un sueño, una esperanza. 
              En este jardín digital, florecen las memorias que nunca se marchitarán.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {mockVictims.map((victim, index) => (
              <motion.div
                key={victim.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <div className="relative mb-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 mx-auto"
                  >
                    <img
                      src={victim.photo}
                      alt={victim.name}
                      className="w-full h-full rounded-full object-cover border-4 border-[#B2916F]/30 group-hover:border-[#B2916F] transition-colors"
                    />
                  </motion.div>
                  <Flower2 className="w-6 h-6 text-[#5a6d5e] absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-white text-sm font-display group-hover:text-[#B2916F] transition-colors">
                  {victim.name.split(' ')[0]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Light Wall */}
      <section className="py-20 bg-[#2E4739]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Flame className="w-16 h-16 mx-auto mb-6 text-[#B2916F]" />
            <h2 className="font-display text-5xl text-white mb-6">Muro de Luz</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Cada vela encendida es una oración, un recuerdo, una promesa de no olvidar. 
              La luz vence a la oscuridad del olvido.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4">
            {Array.from({ length: 48 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0.3, 1, 0.3] }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.05,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2
                }}
                className="aspect-square bg-gradient-to-t from-[#B2916F]/20 to-transparent rounded-lg flex items-center justify-center group cursor-pointer hover:from-[#B2916F]/40 transition-all"
              >
                <Flame className="w-6 h-6 text-[#B2916F] group-hover:scale-110 transition-transform" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="text-center mt-12"
          >
            <p className="text-white/70 italic">
              "La memoria es la luz que ilumina el camino hacia la verdad"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sacred Symbols */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-[#B2916F]" />
            <h2 className="font-display text-5xl text-white mb-6">Símbolos Sagrados</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Elementos espirituales que representan esperanza, dignidad y paz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 bg-white/5 backdrop-blur-sm border-[#B2916F]/20 text-center h-full hover:bg-white/10 transition-colors">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#B2916F] to-[#9a7d5f] rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" fill="currentColor" />
                </div>
                <h3 className="font-display text-2xl text-white mb-4">Amor</h3>
                <p className="text-white/80 leading-relaxed">
                  El amor de las familias que nunca abandonan la búsqueda. 
                  El amor que trasciende el tiempo y la ausencia.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 bg-white/5 backdrop-blur-sm border-[#B2916F]/20 text-center h-full hover:bg-white/10 transition-colors">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#5a6d5e] to-[#4a5d4e] rounded-full flex items-center justify-center">
                  <Flower2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-2xl text-white mb-4">Esperanza</h3>
                <p className="text-white/80 leading-relaxed">
                  Como una flor que renace en primavera, la esperanza florece 
                  en cada día de búsqueda y memoria.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8 bg-white/5 backdrop-blur-sm border-[#B2916F]/20 text-center h-full hover:bg-white/10 transition-colors">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#3d5a49] to-[#2E4739] rounded-full flex items-center justify-center">
                  <Flame className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-2xl text-white mb-4">Paz</h3>
                <p className="text-white/80 leading-relaxed">
                  La luz de la verdad trae paz a los corazones. 
                  La memoria nos guía hacia la reconciliación.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reflection Space */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#2E4739]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="p-12 bg-white/5 backdrop-blur-sm border-[#B2916F]/20">
              <h2 className="font-display text-4xl text-white mb-8">Espacio de Reflexión</h2>
              <div className="space-y-6 text-white/90 text-lg leading-relaxed">
                <p className="italic">
                  "En la memoria habita la esperanza. En la verdad, la dignidad. 
                  En el amor, la paz que sana."
                </p>
                <p>
                  Este santuario digital es un lugar sagrado donde las historias viven, 
                  donde los nombres resuenan, donde la luz nunca se apaga.
                </p>
                <p>
                  Cada visita es un acto de memoria. Cada recuerdo compartido es un paso 
                  hacia la verdad. Cada vela encendida es una promesa de no olvidar.
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-[#B2916F]/20">
                <p className="text-[#B2916F] font-display text-xl">
                  Que la memoria sea eterna
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}