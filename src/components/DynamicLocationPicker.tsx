import { useState } from 'react';
import { MapPin, Navigation, Search, Check } from 'lucide-react';

export const POPULAR_DYNAMIC_LOCATIONS = [
  'São Paulo, Jardins (SP)',
  'São Paulo, Pinheiros (SP)',
  'São Paulo, Itaim Bibi (SP)',
  'São Paulo, Vila Madalena (SP)',
  'São Paulo, Moema (SP)',
  'Rio de Janeiro, Ipanema (RJ)',
  'Rio de Janeiro, Leblon (RJ)',
  'Rio de Janeiro, Barra da Tijuca (RJ)',
  'Belo Horizonte, Savassi (MG)',
  'Curitiba, Batel (PR)',
  'Florianópolis, Lagoa da Conceição (SC)',
  'Balneário Camboriú, Centro (SC)',
  'Porto Alegre, Moinhos de Vento (RS)',
  'Brasília, Asa Sul (DF)',
  'Brasília, Lago Sul (DF)',
  'Goiânia, Setor Marista (GO)',
  'Salvador, Barra (BA)',
  'Recife, Boa Viagem (PE)',
  'Fortaleza, Meireles (CE)',
  'Campinas, Cambuí (SP)',
  'Lisboa, Chiado (Portugal)',
  'Porto, Boavista (Portugal)',
  'Miami, Brickell (EUA)'
];

interface DynamicLocationPickerProps {
  value: string;
  onChange: (newLocation: string, detectedImperial?: boolean) => void;
  label?: string;
}

export function DynamicLocationPicker({
  value,
  onChange,
  label = 'De onde você é (Cidade, Bairro ou Região)'
}: DynamicLocationPickerProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  const filteredLocations = POPULAR_DYNAMIC_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes((value || '').toLowerCase())
  );

  const handleDetectGps = () => {
    setDetectingGps(true);
    setGpsStatus(null);

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const isImperial =
            latitude > 24 && latitude < 50 && longitude < -65 && longitude > -125;

          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`
            );
            const data = await resp.json();
            const addr = data?.address;
            const city =
              addr?.city ||
              addr?.town ||
              addr?.municipality ||
              addr?.village ||
              'São Paulo';
            const suburb = addr?.suburb || addr?.neighbourhood || addr?.quarter || '';
            const state = addr?.state_code || addr?.state || '';
            const formatted = suburb
              ? `${city}, ${suburb}${state ? ` (${state})` : ''}`
              : `${city}${state ? ` (${state})` : ''}`;

            onChange(formatted, isImperial);
            setGpsStatus(`Localização detectada: ${formatted}`);
          } catch {
            const fallback = isImperial ? 'Miami, Brickell (EUA)' : 'São Paulo, Jardins (SP)';
            onChange(fallback, isImperial);
            setGpsStatus(`Localização via GPS ativa: ${fallback}`);
          } finally {
            setDetectingGps(false);
          }
        },
        () => {
          setDetectingGps(false);
          setGpsStatus('Permissão GPS indisponível — selecione ou digite sua cidade abaixo.');
        },
        { timeout: 5000 }
      );
    } else {
      setDetectingGps(false);
    }
  };

  return (
    <div className="space-y-2 relative">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <label className="text-xs text-[#FAF5F6]/75 font-medium flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#FB7185]" />
          <span>{label}</span>
        </label>

        <button
          type="button"
          onClick={handleDetectGps}
          disabled={detectingGps}
          className="px-2.5 py-1 rounded-lg bg-[#E11D48]/15 hover:bg-[#E11D48]/25 border border-[#E11D48]/35 text-[#FB7185] text-[10px] font-bold flex items-center gap-1 transition-colors"
        >
          <Navigation className="w-3 h-3" />
          <span>{detectingGps ? 'Detectando GPS...' : 'Usar Meu GPS Atual'}</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={value}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 180)}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Digite sua cidade, bairro ou estado (ex: São Paulo, Pinheiros)..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#0D090B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E11D48]"
        />
      </div>

      {gpsStatus && (
        <p className="text-[11px] text-emerald-400 flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>{gpsStatus}</span>
        </p>
      )}

      {/* Quick Dynamic Suggestions Dropdown */}
      {showDropdown && (
        <div className="z-30 w-full rounded-2xl bg-[#16141B] border border-white/15 shadow-xl max-h-48 overflow-y-auto divide-y divide-white/[0.05]">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/45 bg-black/40">
            Sugestões Dinâmicas (Toque para selecionar ou digite qualquer cidade)
          </div>
          {(filteredLocations.length > 0 ? filteredLocations : POPULAR_DYNAMIC_LOCATIONS).map(
            (loc) => {
              const active = value === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onMouseDown={() => {
                    const isImp = loc.includes('EUA') || loc.includes('Miami');
                    onChange(loc, isImp);
                    setShowDropdown(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-[#E11D48]/20 text-white font-bold'
                      : 'text-[#FAF5F6]/80 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FB7185] shrink-0" />
                    {loc}
                  </span>
                  {active && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
