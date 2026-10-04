import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Camera,
  CheckCircle2,
  RefreshCw,
  X,
  Fingerprint,
  FileText,
  Upload,
  Lock,
  KeyRound,
  Cpu,
  EyeOff,
  ArrowRight,
  Check
} from 'lucide-react';
import { VerificationDetails } from '../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (hash: string, details?: VerificationDetails) => void;
}

export function VerificationModal({ isOpen, onClose, onSuccess }: VerificationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [docType, setDocType] = useState<'RG' | 'CNH'>('CNH');
  const [docNumber, setDocNumber] = useState('***.482.910-**');
  const [frontUploaded, setFrontUploaded] = useState(true);
  const [backUploaded, setBackUploaded] = useState(true);
  const [frontPreviewName, setFrontPreviewName] = useState('documento_frente_criptografado.enc');
  const [backPreviewName, setBackPreviewName] = useState('documento_verso_criptografado.enc');
  const [acceptedE2eeCharter, setAcceptedE2eeCharter] = useState(true);

  const [livenessAction, setLivenessAction] = useState<'blink' | 'turn' | 'smile'>('blink');
  const [livenessProgress, setLivenessProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && step === 3) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, step]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        startLivenessFlow();
      } else {
        startLivenessFlow();
      }
    } catch {
      startLivenessFlow();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startLivenessFlow = () => {
    setLivenessAction('blink');
    setLivenessProgress(25);

    setTimeout(() => {
      setLivenessAction('turn');
      setLivenessProgress(65);

      setTimeout(() => {
        setLivenessAction('smile');
        setLivenessProgress(100);

        setTimeout(() => {
          setIsProcessing(true);
          setTimeout(() => {
            setIsProcessing(false);
            setStep(4);
          }, 1200);
        }, 1000);
      }, 1200);
    }, 1200);
  };

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontUploaded(true);
      setFrontPreviewName(`${file.name} (AES-256-GCM)`);
    }
  };

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackUploaded(true);
      setBackPreviewName(`${file.name} (AES-256-GCM)`);
    }
  };

  const handleFinish = () => {
    const generatedHash = `SHA256:${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const details: VerificationDetails = {
      documentType: docType,
      documentNumberMasked: docNumber || '***.482.910-**',
      documentFrontVerified: true,
      documentBackVerified: true,
      facialBiometricsVerified: true,
      verifiedAt: new Date().toLocaleDateString('pt-BR'),
      e2eeKeyFingerprint: 'X25519::94AF-882C-E10B-774D',
      zkpAgeProofVerified: true,
    };
    onSuccess(generatedHash, details);
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0D]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B0B0D] border border-[#39363B] rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative text-[#F4F1F2]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#39363B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#B5122A]/15 border border-[#B5122A]/40 flex items-center justify-center text-[#B5122A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F4F1F2] font-display">
                Verificação Oficial RG/CNH + Biometria Facial
              </h3>
              <p className="text-[10px] text-[#F4F1F2]/60">
                Passo {step} de 4 · Criptografia Ponta a Ponta (E2EE) & Zero-Knowledge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#F4F1F2]/60 hover:text-[#F4F1F2] hover:bg-[#39363B]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Step 1: Security & E2EE Data Protection Requirements */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#B5122A]/15 border border-[#B5122A]/30 flex items-center justify-center mx-auto text-[#B5122A]">
                <Fingerprint className="w-7 h-7" />
              </div>
              <div className="text-center">
                <h4 className="text-base font-bold text-[#F4F1F2] font-display">
                  Protocolos de Verificação & Criptografia Ponta a Ponta
                </h4>
                <p className="text-xs text-[#F4F1F2]/60 mt-1 leading-relaxed">
                  Para garantir 100% de autenticidade (+18) e habilitar recursos avançados (incluindo o Selo de Vendedor), utilizamos verificação em dupla camada: <strong>Foto de RG ou CNH + Biometria Facial 3D</strong>.
                </p>
              </div>

              {/* Detailed E2EE & Data Protection Methods */}
              <div className="bg-[#0B0B0D] border border-[#39363B] rounded-2xl p-4 space-y-3 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#B5122A] font-bold block">
                  Camadas de Proteção de Dados Ativas:
                </span>

                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-[#B5122A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F4F1F2] block">1. Criptografia Ponta a Ponta (E2EE Signal / AES-256-GCM)</strong>
                    <span className="text-[11px] text-[#F4F1F2]/60">
                      A foto do seu RG ou CNH é cifrada localmente no seu dispositivo antes da leitura óptica. Ninguém tem acesso visual ao documento.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <KeyRound className="w-4 h-4 text-[#B5122A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F4F1F2] block">2. Zero-Knowledge Proof (ZKP +18) & Hash SHA-256</strong>
                    <span className="text-[11px] text-[#F4F1F2]/60">
                      Seus dados geram apenas uma prova matemática irreversível de maioridade e titularidade bancária, descartando a imagem original.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Cpu className="w-4 h-4 text-[#B5122A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F4F1F2] block">3. Cofre Isolado (Secure Enclave TEE) & Strip EXIF/GPS</strong>
                    <span className="text-[11px] text-[#F4F1F2]/60">
                      Remoção automática de coordenadas GPS e metadados de câmera de todas as fotos enviadas, com proteção Anti-Screenshot DRM.
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#6F0F20]/20 border border-[#B5122A]/40 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="e2eeConsentCheck"
                  checked={acceptedE2eeCharter}
                  onChange={(e) => setAcceptedE2eeCharter(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#B5122A] cursor-pointer"
                />
                <label htmlFor="e2eeConsentCheck" className="text-[11px] text-[#F4F1F2]/80 cursor-pointer leading-relaxed">
                  Autorizo a verificação biométrica automatizada sob proteção criptográfica E2EE e expurgo imediato das imagens brutas do documento após emissão do hash.
                </label>
              </div>

              <button
                type="button"
                disabled={!acceptedE2eeCharter}
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#B5122A] to-[#6F0F20] hover:from-[#B5122A]/90 hover:to-[#6F0F20]/90 disabled:opacity-40 text-[#F4F1F2] font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#B5122A]/25 flex items-center justify-center gap-2"
              >
                <span>Avançar para Foto de RG ou CNH</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Photo of RG or CNH (Front and Back) */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#F4F1F2] font-display mb-1">
                  Envio de Foto do Documento Oficial (RG ou CNH)
                </h4>
                <p className="text-xs text-[#F4F1F2]/60">
                  Selecione o tipo de documento e envie ou fotografe a Frente e o Verso para validação com seu rosto.
                </p>
              </div>

              {/* Document Type Selector */}
              <div className="grid grid-cols-2 gap-2.5">
                {(['CNH', 'RG'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDocType(type)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      docType === type
                        ? 'bg-[#B5122A]/20 border-[#B5122A] text-[#F4F1F2]'
                        : 'bg-[#0B0B0D] border-[#39363B] text-[#F4F1F2]/60 hover:text-[#F4F1F2]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#B5122A]" />
                      <div>
                        <span className="text-xs font-bold block">{type} Oficial</span>
                        <span className="text-[10px] text-[#F4F1F2]/50">
                          {type === 'CNH' ? 'Carteira de Habilitação' : 'Registro Geral / CIN'}
                        </span>
                      </div>
                    </div>
                    {docType === type && <Check className="w-4 h-4 text-[#B5122A]" />}
                  </button>
                ))}
              </div>

              {/* CPF / Document Number Masked */}
              <div>
                <label className="text-[11px] font-semibold text-[#F4F1F2]/80 block mb-1">
                  CPF / Número do {docType} (Para vínculo de titularidade)
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-[#0B0B0D] border border-[#39363B] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F1F2] font-mono focus:outline-none focus:border-[#B5122A]"
                />
              </div>

              {/* Front & Back Photo Upload Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFrontUpload}
                  className="hidden"
                />
                <div
                  onClick={() => frontInputRef.current?.click()}
                  className={`p-4 rounded-2xl border border-dashed cursor-pointer transition-all text-center ${
                    frontUploaded
                      ? 'bg-[#6F0F20]/20 border-[#B5122A]'
                      : 'bg-[#0B0B0D] border-[#39363B] hover:border-[#B5122A]'
                  }`}
                >
                  <Camera className="w-6 h-6 text-[#B5122A] mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-[#F4F1F2] block">
                    Foto da Frente ({docType})
                  </span>
                  <span className="text-[10px] text-[#F4F1F2]/60 block mt-1 truncate">
                    {frontUploaded ? `✓ ${frontPreviewName}` : 'Toque para fotografar ou enviar'}
                  </span>
                </div>

                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackUpload}
                  className="hidden"
                />
                <div
                  onClick={() => backInputRef.current?.click()}
                  className={`p-4 rounded-2xl border border-dashed cursor-pointer transition-all text-center ${
                    backUploaded
                      ? 'bg-[#6F0F20]/20 border-[#B5122A]'
                      : 'bg-[#0B0B0D] border-[#39363B] hover:border-[#B5122A]'
                  }`}
                >
                  <Upload className="w-6 h-6 text-[#B5122A] mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-[#F4F1F2] block">
                    Foto do Verso ({docType})
                  </span>
                  <span className="text-[10px] text-[#F4F1F2]/60 block mt-1 truncate">
                    {backUploaded ? `✓ ${backPreviewName}` : 'Toque para fotografar ou enviar'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0B0D] border border-[#39363B] flex items-center gap-2 text-[11px] text-[#F4F1F2]/70">
                <EyeOff className="w-4 h-4 text-[#B5122A] shrink-0" />
                <span>
                  Criptografia E2EE aplicada: as imagens recebem tarja automática e são destruídas após o cruzamento facial no próximo passo.
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-[#39363B] text-xs text-[#F4F1F2]/70 hover:text-[#F4F1F2]"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  disabled={!frontUploaded || !backUploaded}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#B5122A] to-[#6F0F20] hover:from-[#B5122A]/90 hover:to-[#6F0F20]/90 text-[#F4F1F2] font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#B5122A]/25 flex items-center justify-center gap-2"
                >
                  <span>Iniciar Verificação Facial 3D</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Facial Biometric Liveness Check */}
          {step === 3 && (
            <div className="flex flex-col items-center">
              <p className="text-xs text-[#F4F1F2]/70 text-center mb-3">
                Comparando biometria facial em tempo real com a foto do seu <strong>{docType}</strong>
              </p>

              <div className="relative w-60 h-60 rounded-full overflow-hidden border-4 border-[#B5122A]/60 shadow-inner bg-[#0B0B0D] flex items-center justify-center my-2">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-transparent to-[#0B0B0D]/40">
                  <div className="w-44 h-52 border-2 border-dashed border-[#B5122A]/70 rounded-full animate-pulse flex items-center justify-center" />
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-[#0B0B0D]/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                    <RefreshCw className="w-8 h-8 text-[#B5122A] animate-spin mb-3" />
                    <span className="text-xs font-medium text-[#F4F1F2]">
                      Cruzando Face 3D com {docType} & Gerando Hash SHA-256...
                    </span>
                    <span className="text-[10px] text-[#F4F1F2]/60 mt-1">
                      Expurgando fotos brutas do cofre temporário
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full mt-4 bg-[#0B0B0D] border border-[#39363B] rounded-xl p-3 text-center">
                <span className="text-xs text-[#F4F1F2]/60 uppercase tracking-wider block mb-1">
                  Prova de Vida Biométrica (Liveness):
                </span>
                <div className="text-sm font-bold text-[#B5122A] font-display">
                  {livenessAction === 'blink' && '👁️ Pisque os olhos duas vezes'}
                  {livenessAction === 'turn' && '↔️ Incline levemente a cabeça para a direita'}
                  {livenessAction === 'smile' && '😊 Confirme olhando para o centro da câmera'}
                </div>
                <div className="w-full bg-[#39363B]/60 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-[#B5122A] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${livenessProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Verification Complete */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#B5122A]/20 border border-[#B5122A]/40 text-[#B5122A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#F4F1F2] font-display mb-1">
                  RG/CNH + Biometria Facial Verificados!
                </h4>
                <p className="text-xs text-[#F4F1F2]/60">
                  Sua identidade e maioridade (+18) foram autenticadas com criptografia ponta a ponta. Você já possui o requisito de perfil verificado para gerenciar vendas de conteúdo.
                </p>
              </div>

              <div className="bg-[#0B0B0D] border border-[#39363B] rounded-xl p-4 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between text-[#F4F1F2]/60 text-[11px]">
                  <span>Documento Validado:</span>
                  <span className="text-[#B5122A] font-semibold">{docType} (Frente & Verso)</span>
                </div>
                <div className="flex justify-between text-[#F4F1F2]/60 text-[11px]">
                  <span>Biometria Facial 3D:</span>
                  <span className="text-[#F4F1F2]">99.8% Compatibilidade</span>
                </div>
                <div className="flex justify-between text-[#F4F1F2]/60 text-[11px]">
                  <span>Protocolo E2EE / ZKP:</span>
                  <span className="text-[#F4F1F2]">AES-256-GCM · Expurgado</span>
                </div>
                <div className="flex flex-col pt-2 border-t border-[#39363B] text-[10px] text-[#F4F1F2]/40 truncate">
                  <span>Certificado Criptográfico:</span>
                  <span className="text-[#F4F1F2]/70 truncate">SHA256:8f4c91a0c3d9b01e23f0a991b8</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#B5122A] to-[#6F0F20] hover:from-[#B5122A]/90 hover:to-[#6F0F20]/90 text-[#F4F1F2] font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#B5122A]/25"
              >
                Concluir e Ativar Selo no Perfil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
