import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Users,
  MapPin,
  Calendar,
  MessageSquare,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { VictimCard } from "../components/VictimCard";
import { ParticleEffect } from "../components/ParticleEffect";
import {
  mockVictims,
  mockTestimonies,
  mockEvents,
  memoryStats,
} from "../data/mock-data";

export function Home() {
  const featuredVictims = mockVictims.slice(0, 3);
  const upcomingEvents = mockEvents.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1700748876498-d8c841684f69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbnMlMjBkcmFtYXRpYyUyMGxhbmRzY2FwZSUyMGNpbmVtYXRpYyUyMHN1bnJpc2UlMjBjb2xvbWJpYSUyMG5hdHVyZSUyMGJlYXV0aWZ1bHxlbnwxfHx8fDE3NzI4MDcxODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Paisaje cinematográfico de Samaná, Caldas"
            className="w-full h-full object-cover"
          />
          {/* Natural overlay with mountain green and earth tones */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2E4739]/40 via-transparent to-[#254032]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#5a6d5e]/20 via-transparent to-[#B2916F]/15" />
        </div>

        {/* Particle Effect - Golden Light */}
        <ParticleEffect />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-white mb-8 leading-tight drop-shadow-2xl">
              Santuarios de la Memoria
            </h1>

            <p className="text-xl sm:text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              Diálogos para la verdad y la reparación simbólica
              <br className="hidden sm:block" />
              de las víctimas de desaparición en Samaná, Caldas
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/victimas">
                <Button
                  size="lg"
                  className="bg-[#C9A227] text-white hover:bg-[#b89020] text-lg px-10 py-7 shadow-2xl hover:shadow-[#C9A227]/50 transition-all"
                >
                  Conocer las Historias
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/santuario">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#4A5D3F] text-lg px-10 py-7 backdrop-blur-sm bg-white/10 shadow-xl transition-all"
                >
                  Visitar Santuario Digital
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#B2916F]/70 rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-white/10">
            <div className="w-1 h-2 bg-[#B2916F] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-[#F6F3ED] to-[#e8e5da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-5xl font-display text-[#2E4739] mb-2">
                {memoryStats.victimsRegistered}
              </div>
              <div className="text-[#6b6b5b] flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Víctimas Registradas
              </div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl font-display text-[#2E4739] mb-2">
                {memoryStats.testimonies}
              </div>
              <div className="text-[#6b6b5b] flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Testimonios
              </div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-5xl font-display text-[#2E4739] mb-2">
                {memoryStats.memoryPlaces}
              </div>
              <div className="text-[#6b6b5b] flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                Lugares de Memoria
              </div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-5xl font-display text-[#2E4739] mb-2">
                {memoryStats.events}
              </div>
              <div className="text-[#6b6b5b] flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Eventos
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl text-[#2E4739] mb-6">
                Un Espacio de Memoria Viva
              </h2>
              <p className="text-[#6b6b5b] text-lg mb-4 leading-relaxed">
                Este proyecto de la Universidad de Caldas (PRY-335) preserva y
                honra la memoria histórica de las víctimas de desaparición
                forzada en Samaná, Caldas, manteniendo viva su historia y
                dignificando su legado.
              </p>
              <p className="text-[#6b6b5b] text-lg mb-6 leading-relaxed">
                A través de diálogos, testimonios y espacios simbólicos,
                construimos memoria colectiva que ilumina el camino hacia la
                verdad, la justicia y la reconciliación.
              </p>
              <Link to="/santuario">
                <Button className="bg-[#5a6d5e] text-white hover:bg-[#4a5d4e] shadow-md">
                  Explorar el Santuario Digital
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="relative h-96 rounded-lg overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1762636927320-373ce79cdb67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxtZW1vcmlhbCUyMGZsb3dlcnMlMjBob3BlJTIwbGlnaHQlMjBjYW5kbGVzJTIwcmVtZW1icmFuY2V8ZW58MXx8fHwxNzcyODA2MjMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Flores y velas memorial"
                className="w-full h-full object-cover filter sepia-[.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Victims */}
      <section className="py-20 bg-gradient-to-b from-[#e8e5da] to-[#F6F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-[#2E4739] mb-4">
              Voces que Permanecen
            </h2>
            <p className="text-[#6b6b5b] text-lg max-w-2xl mx-auto">
              Cada rostro cuenta una historia de vida. Cada nombre representa
              sueños, legado y esperanza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredVictims.map((victim, index) => (
              <motion.div
                key={victim.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <VictimCard victim={victim} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/victimas">
              <Button
                variant="outline"
                size="lg"
                className="border-[#2E4739] text-[#2E4739] hover:bg-[#2E4739] hover:text-white"
              >
                Ver todas las víctimas
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonies */}
      <section className="py-20 bg-gradient-to-br from-[#5a6d5e]/15 to-[#e8e5da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-[#2E4739] mb-4">
              Testimonios de Verdad
            </h2>
            <p className="text-[#6b6b5b] text-lg max-w-2xl mx-auto">
              Las voces de quienes mantienen viva la memoria y la esperanza
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {mockTestimonies.map((testimony, index) => (
              <motion.div
                key={testimony.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-[#FFFDF8] border-[#B2916F]/20 h-full hover:shadow-xl transition-shadow rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B2916F] to-[#9a7d5f] flex items-center justify-center text-white shadow-lg">
                      {testimony.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-display text-[#2E4739]">
                        {testimony.author}
                      </div>
                      <div className="text-sm text-[#6b6b5b]">
                        {testimony.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#6b6b5b] italic leading-relaxed">
                    "{testimony.content.substring(0, 150)}..."
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/testimonios">
              <Button
                size="lg"
                className="bg-[#B2916F] text-white hover:bg-[#9a7d5f]"
              >
                Ver todos los testimonios
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Map Preview */}
      <section className="py-20 bg-[#fefdfb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl text-[#4A5D3F] mb-6">
                Geografía de la Memoria
              </h2>
              <p className="text-[#6b6b5b] text-lg mb-6 leading-relaxed">
                Explora los lugares donde habita la memoria. Cada punto
                representa un sitio de recordación, un espacio de homenaje y
                encuentro comunitario.
              </p>
              <Link to="/mapa">
                <Button className="bg-[#7A8B6F] text-white hover:bg-[#6a7a5f]">
                  Explorar mapa interactivo
                  <MapPin className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="relative h-96 rounded-lg overflow-hidden shadow-2xl bg-[#D4D9C5]"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-20 h-20 text-[#4A5D3F]" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-sm text-[#4A5D3F]">
                  <strong>12 lugares de memoria</strong> documentados en Samaná,
                  Caldas
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-[#F6F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-[#2E4739] mb-4">
              Próximos Eventos
            </h2>
            <p className="text-[#6b6b5b] text-lg max-w-2xl mx-auto">
              Espacios de encuentro, conmemoración y diálogo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-[#FFFDF8] h-full hover:shadow-lg transition-shadow rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#B2916F]" />
                    <span className="text-sm text-[#6b6b5b]">
                      {new Date(event.date).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-[#2E4739] mb-2">
                    {event.title}
                  </h3>
                  <p className="text-[#6b6b5b] mb-4">{event.description}</p>
                  <div className="flex items-center gap-2 text-sm text-[#6b6b5b]">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/eventos">
              <Button
                variant="outline"
                size="lg"
                className="border-[#2E4739] text-[#2E4739] hover:bg-[#2E4739] hover:text-white"
              >
                Ver agenda completa
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2E4739] to-[#3d5a49]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl text-white mb-6">
              ¿Tienes Información que Pueda Ayudar?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Tu voz es importante. Ayúdanos a construir la memoria y encontrar
              la verdad. Reporta de forma segura y confidencial.
            </p>
            <Link to="/login">
              <Button
                size="lg"
                className="bg-[#B2916F] text-white hover:bg-[#9a7d5f] text-lg px-8 py-6 shadow-2xl hover:shadow-[#B2916F]/50 transition-all"
              >
                Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
