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
  VolumeX,
  Lock,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { User } from '../types';
import { callAudio } from '../utils/callAudio';

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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [callState, setCallState] = useState<'calling' | 'connected' | 'reconnecting' | 'ending'>(
    'calling'
  );
  const [callDurationSec, setCallDurationSec] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const connectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      callAudio.stopAll();
      if (connectTimerRef.current) window.clearTimeout(connectTimerRef.current);
      stopLocalCamera();
      return;
    }

    setCallDurationSec(0);
    setCallState('calling');
    setIsVideoEnabled(callType === 'video');

    if (soundEnabled) {
      callAudio.startCallingTone();
    }

    connectTimerRef.current = window.setTimeout(() => {
      if (soundEnabled) {
        callAudio.playConnectedTone();
      }
      setCallState('connected');
    }, 4200);

    if (callType === 'video') {
      initLocalCamera();
    }

    return () => {
      callAudio.stopAll();
      if (connectTimerRef.current) window.clearTimeout(connectTimerRef.current);
      stopLocalCamera();
    };
  }, [isOpen, callType]);

  useEffect(() => {
    if (!isOpen || callState !== 'connected') return;
    const interval = window.setInterval(() => {
      setCallDurationSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isOpen, callState]);

  const initLocalCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 640 } },
          audio: false
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch {
      // Fallback if camera permission is declined
    }
  };

  const stopLocalCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
  };

  const handleSimulateReconnect = () => {
    if (connectTimerRef.current) window.clearTimeout(connectTimerRef.current);
    setCallState('reconnecting');
    if (soundEnabled) {
      callAudio.startReconnectingTone();
    }
    connectTimerRef.current = window.setTimeout(() => {
      if (soundEnabled) {
        callAudio.playConnectedTone();
      }
      setCallState('connected');
    }, 3200);
  };

  const handleHangUp = () => {
    if (connectTimerRef.current) window.clearTimeout(connectTimerRef.current);
    setCallState('ending');
    if (soundEnabled) {
      callAudio.playHangupTone();
    } else {
      callAudio.stopAll();
    }
    window.setTimeout(() => {
      onClose();
    }, 750);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!next) {
      callAudio.stopAll();
    } else if (callState === 'calling') {
      callAudio.startCallingTone();
    } else if (callState === 'reconnecting') {
      callAudio.startReconnectingTone();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0D090B]/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-[#FAF5F6]">
      {/* Top Bar */}
      <div className="p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <img
            src={participant.avatarUrl}
            alt={participant.name}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-2xl object-cover border border-white/15"
          />
          <div>
            <h4 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
              <span>{participant.name}</span>
              {participant.isVerified && (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
            </h4>
            <div className="flex items-center gap-2 text-xs text-[#FAF5F6]/70 mt-0.5">
              {callState === 'calling' && (
                <span className="text-amber-300 animate-pulse font-medium">
                  Ligando... (som de chamada ativo)
                </span>
              )}
              {callState === 'connected' && (
                <span className="text-emerald-400 font-mono font-semibold">
                  Em chamada · {formatTimer(callDurationSec)}
                </span>
              )}
              {callState === 'reconnecting' && (
                <span className="text-amber-400 animate-pulse font-medium">
                  Reconectando sinal... (som de reconexão)
                </span>
              )}
              {callState === 'ending' && (
                <span className="text-rose-400 font-medium">Desligando chamada...</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-medium flex items-center gap-1.5"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Som Ativo</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span>Sem Som</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Center Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative">
          {(callState === 'calling' || callState === 'reconnecting') && (
            <>
              <div className="absolute -inset-4 rounded-full border-2 border-[#E11D48]/50 animate-ping" />
              <div className="absolute -inset-8 rounded-full border border-[#FB7185]/30 animate-pulse" />
            </>
          )}
          <img
            src={participant.avatarUrl}
            alt={participant.name}
            referrerPolicy="no-referrer"
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-[#E11D48] shadow-2xl transition-all ${
              isPrivacyMasked ? 'blur-xl' : ''
            }`}
          />
        </div>

        <h3 className="text-2xl font-bold text-white font-display mt-6">
          {participant.name}, {participant.age}
        </h3>
        <p className="text-xs sm:text-sm text-[#FAF5F6]/65 mt-1">{participant.city}</p>

        {callType === 'video' && isVideoEnabled && (
          <div className="mt-6 w-36 h-48 rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-xl">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isPrivacyMasked ? 'blur-lg' : ''}`}
            />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-wrap items-center justify-center gap-3 z-20">
        <button
          type="button"
          onClick={() => setIsMicEnabled(!isMicEnabled)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
            !isMicEnabled
              ? 'bg-amber-500/25 border-amber-400 text-amber-200'
              : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
          }`}
          title="Microfone"
        >
          {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {callType === 'video' && (
          <button
            type="button"
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              !isVideoEnabled
                ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
            }`}
            title="Câmera"
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsPrivacyMasked(!isPrivacyMasked)}
          className={`px-3.5 h-12 rounded-2xl flex items-center gap-1.5 border text-xs font-semibold transition-all ${
            isPrivacyMasked
              ? 'bg-[#E11D48]/30 border-[#E11D48] text-white'
              : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
          }`}
          title="Máscara de Desfoque"
        >
          <EyeOff className="w-4 h-4" />
          <span>Desfoque</span>
        </button>

        <button
          type="button"
          onClick={handleSimulateReconnect}
          className="px-3.5 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-amber-200 flex items-center gap-1.5"
          title="Simular reconexão de chamada com som"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reconectar</span>
        </button>

        {callState !== 'connected' && callState !== 'ending' && (
          <button
            type="button"
            onClick={() => {
              if (connectTimerRef.current) window.clearTimeout(connectTimerRef.current);
              if (soundEnabled) callAudio.playConnectedTone();
              setCallState('connected');
            }}
            className="px-3.5 h-12 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 text-xs font-semibold text-emerald-200 flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Atender</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleHangUp}
          className="px-5 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/40"
          title="Desligar chamada (com som de encerramento)"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Desligar</span>
        </button>
      </div>
    </div>
  );
}
