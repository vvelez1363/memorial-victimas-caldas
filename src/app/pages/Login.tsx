import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Heart, Lock, Mail, AlertCircle } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Credenciales inválidas. Por favor, intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E4739]/90 via-[#3d5a49]/80 to-[#2E4739]/90" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#2E4739] to-[#254032] p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B2916F] to-[#9a7d5f] flex items-center justify-center shadow-lg ring-4 ring-white/20">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
            </div>
            <h1 className="font-display text-3xl text-white mb-2">Acceso Administrativo</h1>
            <p className="text-white/70 text-sm">Santuarios de la Memoria</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-[#2E4739] mb-2 block">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b6b5b]" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@santuarios.edu.co"
                    className="pl-10 h-12 border-[#2E4739]/20 focus:border-[#B2916F] focus:ring-[#B2916F]"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-[#2E4739] mb-2 block">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b6b5b]" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 h-12 border-[#2E4739]/20 focus:border-[#B2916F] focus:ring-[#B2916F]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-[#6b6b5b] cursor-pointer"
                  >
                    Recordar sesión
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[#2E4739] hover:text-[#B2916F] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#B2916F] to-[#9a7d5f] text-white hover:from-[#9a7d5f] hover:to-[#8a6d4f] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-[#F6F3ED] rounded-lg border border-[#2E4739]/10">
              <p className="text-xs text-[#2E4739] mb-2 font-medium">Credenciales de demostración:</p>
              <p className="text-xs text-[#6b6b5b]">Email: admin@santuarios.edu.co</p>
              <p className="text-xs text-[#6b6b5b]">Contraseña: admin123</p>
            </div>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-white/90 hover:text-white text-sm transition-colors"
          >
            ← Volver al sitio principal
          </button>
        </div>
      </div>
    </div>
  );
}