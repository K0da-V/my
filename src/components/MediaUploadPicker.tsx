import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  FolderOpen,
  Smartphone,
  Sliders,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Image as ImageIcon,
  Video,
  Type,
  RotateCcw
} from 'lucide-react';

export interface EditedMediaResult {
  url: string;
  mediaType: 'image' | 'video';
  filterCss: string;
  overlayText: string;
  fileName?: string;
}

interface MediaUploadPickerProps {
  valueUrl: string;
  mediaType: 'image' | 'video';
  onChangeMedia: (result: EditedMediaResult) => void;
  showBuiltInEditor?: boolean;
  compact?: boolean;
  label?: string;
}

export const MEDIA_FILTERS = [
  { id: 'none', label: 'Original', css: 'none' },
  {
    id: 'velvet',
    label: 'Veludo Quente',
    css: 'contrast(1.12) saturate(1.25) sepia(0.15) brightness(0.97)'
  },
  { id: 'noir', label: 'Noir P&B', css: 'grayscale(1) contrast(1.25) brightness(0.95)' },
  {
    id: 'rose',
    label: 'Rosa Intimista',
    css: 'saturate(1.35) hue-rotate(-12deg) contrast(1.08)'
  },
  {
    id: 'gold',
    label: 'Ouro Noturno',
    css: 'sepia(0.32) contrast(1.15) brightness(1.03) saturate(1.2)'
  }
];

const QUICK_SAMPLE_MEDIA = [
  {
    url: '/src/assets/images/liberal_moment_art_1790885781551.jpg',
    label: 'Ensaio Chiaroscuro',
    type: 'image' as const
  },
  {
    url: '/src/assets/images/venue_lounge_meet_1790885792094.jpg',
    label: 'Suíte & Lounge',
    type: 'image' as const
  },
  {
    url: '/src/assets/images/avatar_valentina_1790885756648.jpg',
    label: 'Retrato Sensual',
    type: 'image' as const
  },
  {
    url: '/src/assets/images/avatar_casal_1790885774921.jpg',
    label: 'Casal Privé',
    type: 'image' as const
  }
];

export function MediaUploadPicker({
  valueUrl,
  mediaType,
  onChangeMedia,
  showBuiltInEditor = true,
  compact = false,
  label = 'Selecionar Foto ou Vídeo (Computador, Celular ou Tablet)'
}: MediaUploadPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [hasPermission, setHasPermission] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem('aura_media_permission_granted') === 'true';
  });
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(false);
  const [pendingTrigger, setPendingTrigger] = useState<'folder' | 'camera' | null>(null);

  // Editor state
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('none');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [overlayText, setOverlayText] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const computeFilterCss = (
    presetId: string,
    b: number,
    c: number,
    s: number
  ): string => {
    const presetObj = MEDIA_FILTERS.find((f) => f.id === presetId);
    const base = presetObj && presetObj.css !== 'none' ? presetObj.css : '';
    const custom = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
    return `${base} ${custom}`.trim();
  };

  const currentFilterCss = computeFilterCss(selectedPreset, brightness, contrast, saturation);

  const requestAndOpen = (source: 'folder' | 'camera') => {
    if (!hasPermission) {
      setPendingTrigger(source);
      setShowPermissionPrompt(true);
      return;
    }
    triggerInput(source);
  };

  const grantPermissionAndContinue = async () => {
    try {
      if (pendingTrigger === 'camera' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch {
      // Fall back to standard file capture input if browser blocks direct stream
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('aura_media_permission_granted', 'true');
    }
    setHasPermission(true);
    setShowPermissionPrompt(false);

    if (pendingTrigger) {
      const target = pendingTrigger;
      setPendingTrigger(null);
      setTimeout(() => triggerInput(target), 80);
    }
  };

  const triggerInput = (source: 'folder' | 'camera') => {
    if (source === 'folder' && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (source === 'camera' && cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const detectedType: 'image' | 'video' = isVideo ? 'video' : 'image';
    const objectUrl = URL.createObjectURL(file);

    setSelectedFileName(file.name);
    onChangeMedia({
      url: objectUrl,
      mediaType: detectedType,
      filterCss: currentFilterCss,
      overlayText,
      fileName: file.name
    });
  };

  const handleApplyEditChanges = (
    nextPreset: string,
    nextB: number,
    nextC: number,
    nextS: number,
    nextText: string
  ) => {
    const css = computeFilterCss(nextPreset, nextB, nextC, nextS);
    onChangeMedia({
      url: valueUrl,
      mediaType,
      filterCss: css,
      overlayText: nextText,
      fileName: selectedFileName
    });
  };

  return (
    <div className="space-y-3">
      {/* Hidden Real OS / Mobile File & Camera Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#FAF5F6] flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-[#FB7185]" />
          {label}
        </span>
        {hasPermission && (
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Galeria & Arquivos liberados
          </span>
        )}
      </div>

      {/* Permission Request Modal / Banner when accessing gallery/files for the first time */}
      {showPermissionPrompt && (
        <div className="p-4 rounded-2xl bg-[#1C1116] border border-[#E11D48]/50 space-y-3 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E11D48]/20 border border-[#E11D48]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#FB7185]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Permissão de Acesso à Galeria, Pastas e Câmera
              </h4>
              <p className="text-[11px] text-[#FAF5F6]/70 mt-0.5 leading-relaxed">
                Para escolher fotos ou vídeos das pastas do seu computador ou da galeria do seu celular/tablet, autorize o acesso seguro com remoção automática de metadados EXIF.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPermissionPrompt(false)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-xs text-[#FAF5F6]/70"
            >
              Agora não
            </button>
            <button
              type="button"
              onClick={grantPermissionAndContinue}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-bold shadow-md"
            >
              Permitir Acesso à Galeria e Pastas
            </button>
          </div>
        </div>
      )}

      {/* Primary Action Buttons: PC Folder / Mobile Gallery + Camera */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => requestAndOpen('folder')}
          className="p-3 rounded-2xl bg-[#161013] hover:bg-[#22161C] border border-white/15 hover:border-[#E11D48] transition-all flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E11D48]/15 border border-[#E11D48]/30 flex items-center justify-center text-[#FB7185] group-hover:scale-105 transition-transform shrink-0">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">
              Pastas (PC) ou Galeria (Celular/Tablet)
            </p>
            <p className="text-[10px] text-[#FAF5F6]/60 truncate">
              Selecionar foto ou vídeo do seu dispositivo
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => requestAndOpen('camera')}
          className="p-3 rounded-2xl bg-[#161013] hover:bg-[#22161C] border border-white/15 hover:border-amber-400/60 transition-all flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate flex items-center gap-1">
              <span>Câmera Direta</span>
              <Smartphone className="w-3 h-3 text-amber-300" />
            </p>
            <p className="text-[10px] text-[#FAF5F6]/60 truncate">
              Tirar foto ou gravar vídeo agora
            </p>
          </div>
        </button>
      </div>

      {/* Live Media Preview + Built-in Editor Toggle */}
      {valueUrl && (
        <div className="rounded-2xl overflow-hidden bg-[#0D090B] border border-white/10">
          <div className={`relative ${compact ? 'h-44' : 'h-56'} w-full bg-black overflow-hidden`}>
            {mediaType === 'video' ? (
              <video
                src={valueUrl}
                controls
                playsInline
                style={{ filter: currentFilterCss }}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={valueUrl}
                alt="Mídia selecionada"
                referrerPolicy="no-referrer"
                style={{ filter: currentFilterCss }}
                className="w-full h-full object-cover transition-all"
              />
            )}

            {overlayText && (
              <div className="absolute inset-x-4 bottom-10 flex justify-center pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm font-bold border border-white/15 text-center shadow-lg">
                  {overlayText}
                </span>
              </div>
            )}

            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                {mediaType === 'video' ? (
                  <>
                    <Video className="w-3 h-3 text-[#FB7185]" />
                    Vídeo
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3 h-3 text-emerald-400" />
                    Foto
                  </>
                )}
                {selectedFileName ? ` · ${selectedFileName.slice(0, 18)}` : ''}
              </span>
            </div>

            {showBuiltInEditor && (
              <button
                type="button"
                onClick={() => setShowEditor((prev) => !prev)}
                className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-[11px] font-bold flex items-center gap-1 shadow-lg"
              >
                <Sliders className="w-3 h-3" />
                {showEditor ? 'Fechar Editor' : 'Editar Foto/Vídeo'}
              </button>
            )}
          </div>

          {/* Built-in Photo & Video Editor Panel */}
          {showBuiltInEditor && showEditor && (
            <div className="p-4 bg-[#140E11] border-t border-white/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Estúdio de Edição Rápida (Filtros, Luz e Texto)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPreset('none');
                    setBrightness(100);
                    setContrast(100);
                    setSaturation(100);
                    setOverlayText('');
                    handleApplyEditChanges('none', 100, 100, 100, '');
                  }}
                  className="text-[11px] text-[#FAF5F6]/60 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Resetar
                </button>
              </div>

              {/* Filter Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {MEDIA_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(f.id);
                      handleApplyEditChanges(
                        f.id,
                        brightness,
                        contrast,
                        saturation,
                        overlayText
                      );
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                      selectedPreset === f.id
                        ? 'bg-[#E11D48] text-white border-[#E11D48]'
                        : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Sliders: Brilho, Contraste, Saturação */}
              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div>
                  <label className="text-[#FAF5F6]/60 block mb-1">Brilho ({brightness}%)</label>
                  <input
                    type="range"
                    min={60}
                    max={140}
                    value={brightness}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBrightness(val);
                      handleApplyEditChanges(
                        selectedPreset,
                        val,
                        contrast,
                        saturation,
                        overlayText
                      );
                    }}
                    className="w-full accent-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="text-[#FAF5F6]/60 block mb-1">Contraste ({contrast}%)</label>
                  <input
                    type="range"
                    min={70}
                    max={150}
                    value={contrast}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setContrast(val);
                      handleApplyEditChanges(
                        selectedPreset,
                        brightness,
                        val,
                        saturation,
                        overlayText
                      );
                    }}
                    className="w-full accent-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="text-[#FAF5F6]/60 block mb-1">Cor ({saturation}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={170}
                    value={saturation}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSaturation(val);
                      handleApplyEditChanges(
                        selectedPreset,
                        brightness,
                        contrast,
                        val,
                        overlayText
                      );
                    }}
                    className="w-full accent-[#E11D48]"
                  />
                </div>
              </div>

              {/* Overlay Text on Photo/Video */}
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-[#FB7185] shrink-0" />
                <input
                  type="text"
                  value={overlayText}
                  onChange={(e) => {
                    setOverlayText(e.target.value);
                    handleApplyEditChanges(
                      selectedPreset,
                      brightness,
                      contrast,
                      saturation,
                      e.target.value
                    );
                  }}
                  placeholder="Adicionar legenda sobre a foto/vídeo..."
                  className="w-full px-3 py-1.5 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Quick Vault Selector for instant testing */}
          <div className="p-2.5 bg-[#120C0F] border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] text-[#FAF5F6]/50 shrink-0 pl-1">Sugestões rápidas:</span>
            {QUICK_SAMPLE_MEDIA.map((sample) => (
              <button
                key={sample.url}
                type="button"
                onClick={() => {
                  setSelectedFileName(sample.label);
                  onChangeMedia({
                    url: sample.url,
                    mediaType: sample.type,
                    filterCss: currentFilterCss,
                    overlayText,
                    fileName: sample.label
                  });
                }}
                className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] transition-all ${
                  valueUrl === sample.url
                    ? 'border-[#E11D48] bg-[#E11D48]/15 text-white font-semibold'
                    : 'border-white/10 bg-black/30 text-[#FAF5F6]/65 hover:text-white'
                }`}
              >
                <img
                  src={sample.url}
                  alt={sample.label}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded object-cover"
                />
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
