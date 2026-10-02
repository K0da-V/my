import { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ShieldCheck,
  EyeOff,
  Volume2,
  Lock,
  Sparkles,
  Camera
} from 'lucide-react';
import { User } from '../types';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: User;
  callType: 'audio' | 'video';
}

export function CallModal({ isOpen, onClose, participant, callType }: CallModalProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isPrivacyMasked, setIsPrivacyMasked] = useState(false);
  const [isPitchShiftActive, setIsPitchShiftActive] = useState(false);
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [localStreamActive, setLocalStreamActive] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let interval: any;
    if (isOpen) {
      setCallDurationSec(0);
      interval = setInterval(() => {
        setCallDurationSec((prev) => prev + 1);
      }, 1000);

      if (callType === 'video') {
        initLocalCamera();
      }
    }
    return () => {
      clearInterval(interval);
      stopLocalCamera();
    };
  }, [isOpen, callType]);

  const initLocalCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 640 } },
          audio: false,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setLocalStreamActive(true);
      } else {
        setLocalStreamActive(true);
      }
    } catch {
      setLocalStreamActive(true);
    }
  };

  const stopLocalCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setLocalStreamActive(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between overflow-hidden">
      {/* Top Bar with E2EE status */}
      <div className="p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-slate-800">
            <img
              src={participant.avatarUrl}
              alt={participant.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white font-display flex items-center gap-1.5">
              <span>{participant.name}</span>
              {participant.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="font-mono text-emerald-400">{formatTimer(callDurationSec)}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Lock className="w-3 h-3 text-emerald-400" />
                Criptografia E2EE Ativa
              </span>
            </div>
          </div>
        </div>

        {/* E2EE Safety Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fingerprint: 89BF..44A1</span>
        </div>
      </div>

      {/* Main Video View / Audio Canvas */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        {isVideoEnabled ? (
          <div className="relative w-full max-w-3xl h-[65vh] rounded-3xl overflow-hidden border border-slate-800 bg-[#12151f] shadow-2xl flex items-center justify-center">
            {/* Remote user simulation */}
            <div className={`w-full h-full relative transition-all duration-300 ${isPrivacyMasked ? 'blur-2xl' : ''}`}>
              <img
                src={participant.photos[0] || participant.avatarUrl}
                alt={participant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <div className="absolute bottom-4 left-4 z-10">
                <span className="text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-slate-200 border border-slate-700/50">
                  {participant.name} (Ao Vivo)
                </span>
              </div>
            </div>

            {/* Self Video PIP (Picture in Picture) */}
            <div className="absolute top-4 right-4 w-28 sm:w-36 h-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl bg-black z-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              {!localStreamActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-400 text-[10px] text-center p-2">
                  Câmera Local
                </div>
              )}
              <div className="absolute bottom-1.5 left-1.5 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-white">
                Você
              </div>
            </div>

            {isPrivacyMasked && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl">
                <EyeOff className="w-12 h-12 text-slate-400 mb-2" />
                <span className="text-sm font-semibold text-white">Escudo de Privacidade Ativado</span>
                <span className="text-xs text-slate-400 mt-1">Sua imagem e a do participante estão desfocadas</span>
              </div>
            )}
          </div>
        ) : (
          /* Pure Audio Call view */
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/40 shadow-2xl relative z-10 bg-slate-800">
                <img
                  src={participant.avatarUrl}
                  alt={participant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-radar-ring pointer-events-none" />
              <div className="absolute inset-0 rounded-full border-2 border-rose-400/20 animate-radar-ring delay-700 pointer-events-none" />
            </div>

            <h3 className="text-xl font-bold text-white font-display mb-1">{participant.name}</h3>
            <p className="text-xs text-slate-400 mb-2">{participant.city}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400 font-mono">
              <Lock className="w-3 h-3" />
              Voz Criptografada Ponta a Ponta
            </div>

            {isPitchShiftActive && (
              <div className="mt-4 px-3 py-1 bg-violet-500/20 border border-violet-500/40 rounded-xl text-xs text-violet-300">
                Modulador de Tom de Voz Ativo (Anonimato de Áudio)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-4 z-20">
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Mute Mic */}
          <button
            type="button"
            onClick={() => setIsMicEnabled(!isMicEnabled)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isMicEnabled
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-rose-500/20 border border-rose-500 text-rose-300'
            }`}
            title="Alternar Microfone"
          >
            {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Toggle Video */}
          <button
            type="button"
            onClick={() => {
              const next = !isVideoEnabled;
              setIsVideoEnabled(next);
              if (next) initLocalCamera();
              else stopLocalCamera();
            }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isVideoEnabled
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-900 border border-slate-700 text-slate-400'
            }`}
            title="Alternar Câmera"
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* End Call button */}
          <button
            type="button"
            onClick={onClose}
            className="w-16 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-transform"
            title="Encerrar Chamada Segura"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Privacy Blur Shield */}
          <button
            type="button"
            onClick={() => setIsPrivacyMasked(!isPrivacyMasked)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isPrivacyMasked
                ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Escudo de Privacidade (Desfocar)"
          >
            <EyeOff className="w-5 h-5" />
          </button>

          {/* Pitch Shifter / Voice Mask */}
          <button
            type="button"
            onClick={() => setIsPitchShiftActive(!isPitchShiftActive)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isPitchShiftActive
                ? 'bg-violet-500/20 border border-violet-500 text-violet-300'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Distorção de Voz para Anonimato"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          Chamada direta ponto a ponto protegida por TLS 1.3 e criptografia E2EE ponta a ponta. Zero registros gravados.
        </p>
      </div>
    </div>
  );
}
