import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  User as UserIcon,
  ArrowRight,
  Fingerprint,
  Smartphone,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { AuraPriveLogo } from './AuraPriveLogo';

interface AuthScreenProps {
  onAuthenticated: (authData: {
    name: string;
    email: string;
    phone?: string;
    provider: 'email' | 'google' | 'apple';
    isNewRegistration: boolean;
  }) => void;
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alexandre.prive@auraprive.com');
  const [password, setPassword] = useState('••••••••••••');
  const [phone, setPhone] = useState('(11) 99812-4490');
  const [ageConfirm, setAgeConfirm] = useState(true);
  const [enable2FAOnAccount, setEnable2FAOnAccount] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isIphoneOrIos, setIsIphoneOrIos] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<'email' | 'google' | 'apple' | null>(null);

  // 2FA & Registration Code Verification State
  const [step, setStep] = useState<'credentials' | 'verify_code'>('credentials');
  const [verificationChannel, setVerificationChannel] = useState<'email' | 'sms'>('email');
  const [generatedOtp, setGeneratedOtp] = useState<string>('849201');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [pendingProvider, setPendingProvider] = useState<'email' | 'google' | 'apple'>('email');

  useEffect(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isApple = /iPhone|iPad|iPod|Macintosh/i.test(ua);
    setIsIphoneOrIos(isApple);
  }, []);

  const triggerOtpChallenge = (provider: 'email' | 'google' | 'apple') => {
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(newCode);
    setEnteredOtp('');
    setPendingProvider(provider);
    setVerificationChannel(phone.trim() ? 'sms' : 'email');
    setStep('verify_code');
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError('Por favor, preencha seu e-mail e senha para continuar.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setAuthError('Informe seu nome ou pseudônimo para criar seu perfil.');
      return;
    }

    if (mode === 'register' && !ageConfirm) {
      setAuthError('Você precisa confirmar que possui 18 anos ou mais para entrar na plataforma.');
      return;
    }

    // Registration ALWAYS verifies email or phone code; Login verifies 2FA if enabled
    if (mode === 'register' || enable2FAOnAccount) {
      triggerOtpChallenge('email');
      return;
    }

    setLoadingProvider('email');
    setTimeout(() => {
      onAuthenticated({
        name: name.trim() || 'Alexandre P.',
        email: email.trim(),
        phone: phone.trim() || undefined,
        provider: 'email',
        isNewRegistration: false
      });
    }, 400);
  };

  const handleQuickSocialLogin = (provider: 'google' | 'apple') => {
    setAuthError(null);
    if (mode === 'register' || enable2FAOnAccount) {
      triggerOtpChallenge(provider);
      return;
    }
    setLoadingProvider(provider);
    setTimeout(() => {
      onAuthenticated({
        name: provider === 'apple' ? 'Alexandre (Apple ID)' : 'Alexandre (Google)',
        email:
          provider === 'apple'
            ? 'alexandre@privaterelay.appleid.com'
            : 'alexandre.prive@gmail.com',
        phone: phone.trim() || undefined,
        provider,
        isNewRegistration: false
      });
    }, 400);
  };

  const handleConfirmOtpCode = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (enteredOtp.trim().length < 4) {
      setAuthError('Digite o código de 6 dígitos enviado ou clique em "Preencher Código Automaticamente".');
      return;
    }

    setLoadingProvider(pendingProvider);
    setTimeout(() => {
      onAuthenticated({
        name:
          pendingProvider === 'apple'
            ? 'Alexandre (Apple ID)'
            : pendingProvider === 'google'
            ? 'Alexandre (Google)'
            : mode === 'register'
            ? name.trim()
            : 'Alexandre P.',
        email:
          pendingProvider === 'apple'
            ? 'alexandre@privaterelay.appleid.com'
            : pendingProvider === 'google'
            ? 'alexandre.prive@gmail.com'
            : email.trim(),
        phone: phone.trim() || undefined,
        provider: pendingProvider,
        isNewRegistration: mode === 'register'
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0D090B] text-[#FAF5F6] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient Sensual Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[540px] h-[340px] bg-[#E11D48]/18 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[300px] bg-[#F59E0B]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Top Brand Header with New Custom Logo */}
      <header className="w-full max-w-5xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between z-10">
        <AuraPriveLogo size="md" showSubtitle />

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#FAF5F6]/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>2FA Ativo • Criptografia Ponta a Ponta • +18</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Pitch Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/15 border border-[#E11D48]/35 text-[#FB7185] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rede Privada de Encontros, Status, Lives & Criadores +18</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1] font-display text-white">
            Desejo, liberdade e conexões reais com{' '}
            <span className="text-gradient-ruby italic">discrição absoluta.</span>
          </h1>

          <p className="text-sm text-[#FAF5F6]/70 leading-relaxed">
            Converse com criptografia real, publique Status e Momentos Liberais, participe de Encontros Reais com entrada automática no grupo do evento e monetize seu conteúdo exclusivo com taxas justas por nível.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl velvet-card flex items-start gap-3">
              <Fingerprint className="w-5 h-5 text-[#FB7185] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-white">Verificação 2FA & Biometria 3D</h3>
                <p className="text-[11px] text-[#FAF5F6]/60 mt-0.5">
                  Proteção em duas etapas por SMS ou E-mail no cadastro e login, mais validação de RG/CNH.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl velvet-card flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-white">Estúdio de Vendas em 3 Níveis</h3>
                <p className="text-[11px] text-[#FAF5F6]/60 mt-0.5">
                  Vendedores ganham VIP Cortesia, fazem Lives e pagam taxas reduzidas conforme sobem de nível.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-6">
          <div className="velvet-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {step === 'credentials' ? (
              <>
                {/* Login / Cadastro Switch */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/50 border border-white/10 mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setAuthError(null);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      mode === 'login'
                        ? 'bg-[#E11D48] text-white shadow'
                        : 'text-[#FAF5F6]/60 hover:text-white'
                    }`}
                  >
                    Fazer Login (Entrar)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setAuthError(null);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      mode === 'register'
                        ? 'bg-[#E11D48] text-white shadow'
                        : 'text-[#FAF5F6]/60 hover:text-white'
                    }`}
                  >
                    Criar Nova Conta
                  </button>
                </div>

                {mode === 'register' && (
                  <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-[#FAF5F6]/75 leading-relaxed">
                    <strong className="text-white">Conta Pessoal Padrão:</strong> Ao criar sua conta, você entra como membro da comunidade (sem selo de vendedor). Caso queira vender conteúdo +18, poderá ativar o <span className="text-[#FB7185] font-semibold">Selo de Vendedor</span> depois na aba Vendas +18 mediante verificação, aceite dos termos e taxa única de R$ 50,00.
                  </div>
                )}

                {/* Quick Social Auth Buttons */}
                <div className="space-y-2.5 mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#FAF5F6]/50">
                    Acesso Rápido Verificado
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickSocialLogin('google')}
                      disabled={loadingProvider !== null}
                      className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white text-[#0D090B] hover:bg-white/90 font-bold text-xs transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5L1.6 17c1.9 3.9 5.8 7 10.4 7z"
                        />
                      </svg>
                      <span>Continuar com Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickSocialLogin('apple')}
                      disabled={loadingProvider !== null}
                      className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl font-bold text-xs transition-all border ${
                        isIphoneOrIos
                          ? 'bg-white text-black border-white shadow-md'
                          : 'bg-white/[0.06] text-white border-white/15 hover:bg-white/[0.12]'
                      }`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      <span>{isIphoneOrIos ? 'Apple ID (iPhone)' : 'Continuar com Apple'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex py-2 items-center mb-4">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="flex-shrink mx-3 text-[11px] text-[#FAF5F6]/45 uppercase tracking-wider">
                    ou e-mail e celular
                  </span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                {/* Standard Form */}
                <form onSubmit={handleStandardSubmit} className="space-y-3.5">
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-medium text-[#FAF5F6]/80 mb-1">
                        Nome ou Pseudônimo Social *
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-[#FAF5F6]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Casal J&M, Valentina, Alexandre..."
                          className="w-full bg-black/50 border border-white/15 focus:border-[#E11D48] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#FAF5F6]/80 mb-1">
                      E-mail Privado *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#FAF5F6]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.email@dominio.com"
                        className="w-full bg-black/50 border border-white/15 focus:border-[#E11D48] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-[#FAF5F6]/80">
                        Celular para Código SMS / 2FA
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#FAF5F6]/65 font-medium">
                        Opcional (Recomendado p/ 2FA)
                      </span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#FAF5F6]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999 — Não obrigatório"
                        className="w-full bg-black/50 border border-white/15 focus:border-[#E11D48] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#FAF5F6]/80 mb-1">
                      Senha Criptografada *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#FAF5F6]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo de 8 caracteres"
                        className="w-full bg-black/50 border border-white/15 focus:border-[#E11D48] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF5F6]/50 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 2FA Toggle */}
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enable2FAOnAccount}
                      onChange={(e) => setEnable2FAOnAccount(e.target.checked)}
                      className="mt-0.5 accent-[#E11D48] rounded"
                    />
                    <span className="text-[11px] text-[#FAF5F6]/75 leading-relaxed">
                      Ativar <strong>Autenticação de 2 Fatores (2FA)</strong> com verificação por código (SMS no celular ou E-mail).
                    </span>
                  </label>

                  {mode === 'register' && (
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ageConfirm}
                        onChange={(e) => setAgeConfirm(e.target.checked)}
                        className="mt-0.5 accent-[#E11D48] rounded"
                      />
                      <span className="text-[11px] text-[#FAF5F6]/75 leading-relaxed">
                        Declaro ter <strong>18 anos ou mais</strong> e concordo com a verificação por código antes de acessar a plataforma.
                      </span>
                    </label>
                  )}

                  {authError && (
                    <div className="p-3 rounded-xl bg-[#E11D48]/15 border border-[#E11D48]/40 text-xs text-[#FB7185]">
                      {authError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loadingProvider !== null}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#E11D48]/25 flex items-center justify-center gap-2 mt-2"
                  >
                    <span>
                      {mode === 'login'
                        ? enable2FAOnAccount
                          ? 'Continuar c/ Verificação 2FA'
                          : 'Entrar no Aura Privé'
                        : 'Receber Código de Verificação & Cadastrar'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              /* STEP 2: 2FA / REGISTRATION CODE VERIFICATION */
              <form onSubmit={handleConfirmOtpCode} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {mode === 'register'
                      ? 'Verificação de Segurança do Cadastro'
                      : 'Autenticação de Dois Fatores (2FA)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="text-xs text-[#FAF5F6]/60 hover:text-white underline"
                  >
                    Voltar
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Confirme seu Código de 6 Dígitos
                  </h3>
                  <p className="text-xs text-[#FAF5F6]/65 mt-0.5">
                    Escolha por onde deseja validar seu código de segurança única (OTP):
                  </p>
                </div>

                {/* Channel Switcher: Email vs SMS */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationChannel('email')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      verificationChannel === 'email'
                        ? 'bg-[#E11D48]/15 border-[#E11D48] text-white'
                        : 'bg-black/40 border-white/10 text-[#FAF5F6]/65'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Mail className="w-3.5 h-3.5 text-[#FB7185]" />
                      <span>Código por E-mail</span>
                    </div>
                    <p className="text-[10px] text-[#FAF5F6]/55 truncate mt-0.5">{email}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerificationChannel('sms')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      verificationChannel === 'sms'
                        ? 'bg-[#E11D48]/15 border-[#E11D48] text-white'
                        : 'bg-black/40 border-white/10 text-[#FAF5F6]/65'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Código por SMS Celular</span>
                    </div>
                    <p className="text-[10px] text-[#FAF5F6]/55 truncate mt-0.5">
                      {phone.trim() || '(11) 99812-4490'}
                    </p>
                  </button>
                </div>

                {/* Instant Demo Code Box so user never gets stuck */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/35 border border-emerald-500/35 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">
                      Código Enviado ({verificationChannel === 'sms' ? 'SMS Celular' : 'E-mail'})
                    </p>
                    <p className="text-base font-mono font-bold text-white tracking-widest mt-0.5">
                      {generatedOtp}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnteredOtp(generatedOtp)}
                    className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold transition-colors"
                  >
                    Preencher Código
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#FAF5F6]/80 mb-1.5">
                    Digite o código de verificação de 6 dígitos
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full bg-black/60 border border-white/20 focus:border-[#E11D48] rounded-2xl px-4 py-3 text-center font-mono text-xl tracking-[0.4em] text-white focus:outline-none"
                  />
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-[#E11D48]/15 border border-[#E11D48]/40 text-xs text-[#FB7185]">
                    {authError}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-[#FAF5F6]/60">
                  <button
                    type="button"
                    onClick={() => triggerOtpChallenge(pendingProvider)}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reenviar novo código</span>
                  </button>
                  <span>Validade: 05:00 min</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E11D48]/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Código 2FA e Acessar</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer Security */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#FAF5F6]/45 z-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Autenticação 2FA Obrigatória • TLS 1.3 + Signal Protocol • LGPD Art. 46</span>
        </div>
        <span>Aura Privé © Plataforma Exclusiva para Adultos (+18)</span>
      </footer>
    </div>
  );
}
