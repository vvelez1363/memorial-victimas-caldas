import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items split for centered logo layout
  const leftNavigation = [
    { name: "Inicio", href: "/" },
    { name: "Víctimas", href: "/victimas" },
    { name: "Mapa de Memoria", href: "/mapa" },
  ];

  const rightNavigation = [
    { name: "Santuario Digital", href: "/santuario" },
    { name: "Eventos", href: "/eventos" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#2E4739]/95 backdrop-blur-md shadow-lg"
            : "bg-[#2E4739] shadow-md"
        }`}
        style={{
          borderBottom: scrolled
            ? "1px solid rgba(178, 145, 111, 0.2)"
            : "1px solid rgba(178, 145, 111, 0.15)",
        }}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left Navigation */}
            <div className="hidden lg:flex lg:gap-x-6 lg:items-center lg:flex-1">
              {leftNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-white border-b-2 border-[#B2916F] pb-1"
                      : "text-white/90 hover:text-[#B2916F]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Centered Logo */}
            <Link to="/" className="flex items-center gap-3 lg:flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B2916F] to-[#9a7d5f] flex items-center justify-center shadow-lg ring-2 ring-white/20">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div className="hidden xl:block">
                <div className="font-display text-xl tracking-wide text-white">
                  Santuarios de la Memoria
                </div>
                <div className="text-xs text-white/70">Samaná, Caldas</div>
              </div>
            </Link>

            {/* Right Navigation */}
            <div className="hidden lg:flex lg:gap-x-6 lg:items-center lg:flex-1 lg:justify-end">
              {rightNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-white border-b-2 border-[#B2916F] pb-1"
                      : "text-white/90 hover:text-[#B2916F]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/login">
                <Button className="ml-2 bg-[#B2916F] text-white hover:bg-[#9a7d5f] shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 pt-2 space-y-1 bg-[#2E4739]/95 backdrop-blur-md border-t border-white/15">
              {[...leftNavigation, ...rightNavigation].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-white bg-[#B2916F]/20 border-l-2 border-[#B2916F]"
                      : "text-white/90 hover:bg-white/10 hover:text-[#B2916F]"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mt-2 bg-[#B2916F] text-white hover:bg-[#9a7d5f]">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#2E4739] to-[#254032] text-white mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display text-xl mb-4 text-[#B2916F]">
                Santuarios de la Memoria
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Preservando la memoria histórica y honrando la dignidad de las
                víctimas de desaparición en Samaná, Caldas.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4 text-white">Contacto</h4>
              <p className="text-white/80 text-sm">Universidad de Caldas</p>
              <p className="text-white/80 text-sm">Proyecto PRY-335 (2025)</p>
              <p className="text-white/80 text-sm mt-2">
                contacto@santuariosdelamemoria.edu.co
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4 text-white">Enlaces</h4>
              <div className="space-y-2">
                <Link
                  to="/victimas"
                  className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
                >
                  Galería de Víctimas
                </Link>
                <Link
                  to="/login"
                  className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/seguimiento"
                  className="block text-white/80 text-sm hover:text-[#B2916F] transition-colors"
                >
                  Seguimiento de Reporte
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
            © 2026 Universidad de Caldas. Proyecto PRY-335. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
