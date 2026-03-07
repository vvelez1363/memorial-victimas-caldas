import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, Video, Mic, FileText, Play } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { mockTestimonies } from "../data/mock-data";

export function Testimonies() {
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'audio' | 'text'>('all');

  const filteredTestimonies = selectedType === 'all' 
    ? mockTestimonies 
    : mockTestimonies.filter(t => t.type === selectedType);

  const typeIcons = {
    video: Video,
    audio: Mic,
    text: FileText
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
            <MessageSquare className="w-16 h-16 mx-auto mb-6 text-[#d4af37]" />
            <h1 className="font-display text-5xl mb-6">Testimonios de Verdad</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Las voces de quienes buscan justicia, verdad y paz. 
              Historias que no deben olvidarse.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="video">
                <Video className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="audio">
                <Mic className="w-4 h-4 mr-2" />
                Audios
              </TabsTrigger>
              <TabsTrigger value="text">
                <FileText className="w-4 h-4 mr-2" />
                Textos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Testimonies Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonies.map((testimony, index) => {
              const TypeIcon = typeIcons[testimony.type];
              
              return (
                <motion.div
                  key={testimony.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-shadow bg-white group">
                    {/* Media Preview */}
                    {testimony.type !== 'text' && (
                      <div className="relative aspect-video bg-gradient-to-br from-[#2d4a5c] to-[#1a1a1a] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                        <Play className="w-16 h-16 text-white opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all z-10" />
                        <TypeIcon className="absolute top-3 right-3 w-6 h-6 text-white/80" />
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#c49d2f] flex items-center justify-center text-white text-lg">
                          {testimony.author.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-display text-lg text-[#1a1a1a]">{testimony.author}</h3>
                          <p className="text-sm text-gray-600">{testimony.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <TypeIcon className="w-3 h-3" />
                        {testimony.type === 'video' && 'Video'}
                        {testimony.type === 'audio' && 'Audio'}
                        {testimony.type === 'text' && 'Texto'}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <p className="text-gray-700 italic leading-relaxed line-clamp-4">
                        "{testimony.content}"
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                      <span>
                        {new Date(testimony.date).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredTestimonies.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg">No hay testimonios de este tipo disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-[#2d4a5c] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl mb-6">¿Quieres Compartir tu Testimonio?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Tu voz es importante. Si eres familiar de una víctima o tienes información relevante, 
            tu testimonio puede ayudar a construir memoria y verdad.
          </p>
          <div className="space-y-4 max-w-2xl mx-auto text-left">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <h3 className="font-display text-lg mb-2 text-[#d4af37]">Confidencialidad</h3>
              <p className="text-gray-200">
                Todos los testimonios son manejados con total confidencialidad y respeto.
              </p>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <h3 className="font-display text-lg mb-2 text-[#d4af37]">Acompañamiento</h3>
              <p className="text-gray-200">
                Ofrecemos acompañamiento psicosocial durante todo el proceso.
              </p>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <h3 className="font-display text-lg mb-2 text-[#d4af37]">Preservación</h3>
              <p className="text-gray-200">
                Los testimonios son preservados como parte del archivo histórico del conflicto.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
