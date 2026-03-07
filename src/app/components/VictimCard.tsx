import { Link } from "react-router";
import { Calendar, MapPin, Search, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Victim } from "../data/mock-data";

interface VictimCardProps {
  victim: Victim;
}

export function VictimCard({ victim }: VictimCardProps) {
  const statusConfig = {
    searching: {
      label: 'En búsqueda',
      icon: Search,
      color: 'bg-[#2d4a5c] text-white'
    },
    found: {
      label: 'Encontrado',
      icon: AlertCircle,
      color: 'bg-[#4a7c59] text-white'
    },
    identified: {
      label: 'Identificado',
      icon: CheckCircle,
      color: 'bg-[#d4af37] text-[#1a1a1a]'
    }
  };

  const status = statusConfig[victim.searchStatus];
  const StatusIcon = status.icon;

  return (
    <Link to={`/victimas/${victim.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-white">
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={victim.photo}
            alt={victim.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`${status.color} flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              <span className="text-xs">{status.label}</span>
            </Badge>
          </div>

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-display text-xl mb-2">{victim.name}</h3>
            <div className="space-y-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(victim.dateOfDisappearance).toLocaleDateString('es-CO', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{victim.municipality}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card footer - always visible */}
        <div className="p-4 bg-gradient-to-b from-white to-gray-50">
          <h3 className="font-display text-lg text-[#1a1a1a]">{victim.name}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {new Date(victim.dateOfDisappearance).getFullYear()}
          </p>
        </div>
      </Card>
    </Link>
  );
}
