import { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Star,
  Navigation,
  Sparkles,
  Calendar,
  Lock,
  ChevronRight,
  Coffee,
  Wine,
  Share2
} from 'lucide-react';
import { MeetupVenue, User } from '../../types';

interface EncontrosTabProps {
  venues: MeetupVenue[];
  currentUser: User;
  onInviteVenue: (venue: MeetupVenue) => void;
}

export function EncontrosTab({ venues, currentUser, onInviteVenue }: EncontrosTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [activeVenue, setActiveVenue] = useState<MeetupVenue | null>(venues[0]);
  const [showAngelCodeModal, setShowAngelCodeModal] = useState(false);

  const filteredVenues = venues.filter((v) => {
    if (v.distanceKm > maxDistance) return false;
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 md:pb-8">
      {/* Geolocation Radar Header */}
      <div className="bg-[#10131d] border border-slate-800 rounded-2xl p-4 mb-4 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-display">
                Encontros Reais & Pontos Seguros
              </h2>
              <p className="text-[11px] text-slate-400">
                Geolocalização precisa · Ambientes auditados com privacidade
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAngelCodeModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Código Angelical</span>
          </button>
        </div>

        {/* Radar Distance Slider */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span>Raio de Busca:</span>
            <span className="font-mono text-emerald-400 font-bold">{maxDistance} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-32 accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 text-xs">
        {['all', 'Rooftop Bar', 'Café & Bistrô', 'Clube Privado & Lifestyle'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'Todos os Espaços' : cat}
          </button>
        ))}
      </div>

      {/* Venues Grid / List */}
      <div className="space-y-4">
        {filteredVenues.map((venue) => (
          <div
            key={venue.id}
            className="bg-[#111420] border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all"
          >
            {/* Venue Image */}
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
              <img
                src={venue.imageUrl}
                alt={venue.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111420] via-black/30 to-transparent" />

              {/* Rating and Distance Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span>{venue.distanceKm} km de você</span>
                </span>
                <span className="px-2 py-1 rounded-xl bg-black/60 backdrop-blur-md text-amber-300 font-mono text-xs font-bold border border-white/10 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{venue.rating}</span>
                </span>
              </div>

              {/* Category */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-300 block mb-0.5">
                    {venue.category}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">
                    {venue.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{venue.address} · {venue.neighborhood}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {venue.perks}
              </p>

              {/* Safety notice */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-start gap-2 text-[11px] text-emerald-300/90">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{venue.securityNotice}</span>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onInviteVenue(venue)}
                  className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Propor Encontro Seguro Aqui</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Angel Code Modal (Safety in Real Meetups) */}
      {showAngelCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#10131c] border border-emerald-500/30 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-base font-bold text-white font-display">
                Protocolo Código Angelical Aura
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Todos os estabelecimentos parceiros possuem equipes treinadas para sua segurança em encontros presenciais.
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-200">
              <div className="font-semibold text-emerald-300">Como funciona:</div>
              <p>
                Se em algum momento você se sentir desconfortável ou em risco durante o encontro, aproxime-se do bartender ou gerente e peça pelo drink:
              </p>
              <div className="p-2.5 bg-black/40 rounded-xl font-mono text-center text-sm font-bold text-white border border-emerald-500/40">
                &quot;Martini Angelical Aura&quot;
              </div>
              <p className="text-[11px] text-slate-400">
                A equipe chamará um transporte discreto para você e providenciará saída segura por área privativa, sem confrontos.
              </p>
            </div>
            <button
              onClick={() => setShowAngelCodeModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl"
            >
              Compreendi as Diretrizes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
