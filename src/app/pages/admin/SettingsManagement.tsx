import { Save, Upload, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

export function SettingsManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display text-[#1a1a1a]">Configuración del Sitio</h2>
        <p className="text-gray-600 mt-1">Administra la configuración general del sitio web</p>
      </div>

      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sitio</CardTitle>
          <CardDescription>Configuración general y textos principales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="site-title">Título del Sitio</Label>
            <Input id="site-title" defaultValue="Santuarios de la Memoria" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="site-subtitle">Subtítulo</Label>
            <Input id="site-subtitle" defaultValue="Samaná, Caldas" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="site-description">Descripción</Label>
            <Textarea
              id="site-description"
              defaultValue="Preservando la memoria histórica y honrando la dignidad de las víctimas de desaparición en Samaná, Caldas."
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo and Images */}
      <Card>
        <CardHeader>
          <CardTitle>Logo e Imágenes</CardTitle>
          <CardDescription>Gestiona el logo y las imágenes del banner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Logo del Sitio</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#c49d2f] flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Cambiar Logo
              </Button>
            </div>
          </div>
          <div>
            <Label>Imagen del Banner Principal</Label>
            <div className="mt-2">
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Subir Nueva Imagen
              </Button>
              <p className="text-xs text-gray-500 mt-2">Recomendado: 1920x1080px, formato JPG o PNG</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
          <CardDescription>Correo y datos de contacto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact-email">Correo de Contacto</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="contact-email"
                type="email"
                defaultValue="contacto@santuariosdelamemoria.edu.co"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" defaultValue="+57 (6) 123 4567" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" defaultValue="Universidad de Caldas, Manizales" className="mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
          <CardDescription>Enlaces a redes sociales del proyecto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <div className="relative mt-2">
              <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="facebook"
                placeholder="https://facebook.com/santuariosmemoria"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <div className="relative mt-2">
              <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="instagram"
                placeholder="https://instagram.com/santuariosmemoria"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="twitter">Twitter / X</Label>
            <div className="relative mt-2">
              <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="twitter"
                placeholder="https://twitter.com/santuariosmemoria"
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Proyecto</CardTitle>
          <CardDescription>Detalles académicos del proyecto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="university">Universidad</Label>
            <Input id="university" defaultValue="Universidad de Caldas" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="project-code">Código del Proyecto</Label>
            <Input id="project-code" defaultValue="PRY-335 (2025)" className="mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button className="bg-[#d4af37] text-[#1a1a1a] hover:bg-[#c49d2f] gap-2">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
