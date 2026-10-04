import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Star,
  Calendar,
  Ticket,
  CheckCircle2,
  Crown,
  Lock,
  QrCode,
  CreditCard,
  Wallet,
  Copy,
  Check,
  Users,
  MessageCircle,
  X,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { MeetupVenue, User } from '../../types';

interface EncontrosTabProps {
  venues: MeetupVenue[];
  currentUser: User;
  onInviteVenue: (venue: MeetupVenue, registrationInfo?: {
    attendanceType: 'single' | 'couple';
    braceletColor: 'Verde' | 'Âmbar' | 'Vermelha';
    paymentMethod: 'pix' | 'card' | 'wallet' | 'free_vip';
    amountPaid: number;
  }) => void;
  onOpenMeetupGroup?: (venue: MeetupVenue) => void;
  onOpenVip?: () => void;
}

export function EncontrosTab({
  venues,
  currentUser,
  onInviteVenue,
  onOpenMeetupGroup,
  onOpenVip
}: EncontrosTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [showAngelCodeModal, setShowAngelCodeModal] = useState(false);
  const [reservedVenueIds, setReservedVenueIds] = useState<string[]>(
    venues.filter((v) => v.isBookedByMe).map((v) => v.id)
  );

  // Registration & Checkout Modal State
  const [checkoutVenue, setCheckoutVenue] = useState<MeetupVenue | null>(null);
  const [attendanceType, setAttendanceType] = useState<'single' | 'couple'>('couple');
  const [discreetAlias, setDiscreetAlias] = useState(currentUser.name);
  const [braceletColor, setBraceletColor] = useState<'Verde' | 'Âmbar' | 'Vermelha'>('Verde');
  const [acceptedSafetyRules, setAcceptedSafetyRules] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'wallet'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const [cardName, setCardName] = useState(currentUser.name.toUpperCase());
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('842');
  const [installments, setInstallments] = useState('1');
  const [completedVenue, setCompletedVenue] = useState<MeetupVenue | null>(null);

  const isSellerOrVip =
    currentUser.vipTier === 'vip' ||
    currentUser.isSellerVerified ||
    currentUser.sellerProfile?.isSellerVerified;
  const isBlackVip =
    currentUser.vipTier === 'black_vip' || currentUser.vipTier === 'diamond_club';

  const filteredVenues = venues.filter((v) => {
    if (v.distanceKm > maxDistance) return false;
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (priceFilter === 'free' && v.isPaidMeetup) return false;
    if (priceFilter === 'paid' && !v.isPaidMeetup) return false;
    return true;
  });

  const calculateFinalPrice = (venue: MeetupVenue): number => {
    if (!venue.isPaidMeetup || !venue.meetupPrice) return 0;
    if (isBlackVip) return 0;
    if (isSellerOrVip) return Number((venue.meetupPrice * 0.7).toFixed(2));
    return venue.meetupPrice;
  };

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutVenue || !acceptedSafetyRules) return;

    const finalAmount = calculateFinalPrice(checkoutVenue);
    const chosenMethod = finalAmount === 0 ? 'free_vip' : paymentMethod;

    setReservedVenueIds((prev) =>
      prev.includes(checkoutVenue.id) ? prev : [...prev, checkoutVenue.id]
    );

    onInviteVenue(checkoutVenue, {
      attendanceType,
      braceletColor,
      paymentMethod: chosenMethod,
      amountPaid: finalAmount
    });

    setCompletedVenue(checkoutVenue);
    setCheckoutVenue(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Hero Banner */}
      <div className="velvet-card rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E11D48]/20 border border-[#E11D48]/40 text-[#FB7185] text-[10px] font-bold uppercase tracking-wider">
                Experiências Presenciais Certificadas
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold">
                Entrada Automática no Grupo do Evento
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              Encontros Reais, Lounges & Festas Privé
            </h1>
            <p className="text-xs sm:text-sm text-[#FAF5F6]/65 max-w-2xl">
              Inscreva-se em encontros gratuitos ou exclusivos, escolha sua pulseira de consentimento e entre automaticamente no grupo privado dos participantes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAngelCodeModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Protocolo Código Ângela</span>
            </button>

            {onOpenVip && currentUser.vipTier === 'free' && !isSellerOrVip && (
              <button
                type="button"
                onClick={onOpenVip}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>30% OFF a 100% Free com VIP</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-4 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Todos os Encontros' },
              { id: 'free', label: 'Gratuitos' },
              { id: 'paid', label: 'Eventos Pagos / VIP' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPriceFilter(tab.id as 'all' | 'free' | 'paid')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  priceFilter === tab.id
                    ? 'bg-[#E11D48] text-white border-[#E11D48]'
                    : 'bg-white/[0.04] text-[#FAF5F6]/70 border-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-[#FAF5F6]/70">
            <span>Distância máx: <strong>{maxDistance} km</strong></span>
            <input
              type="range"
              min={2}
              max={30}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-28 accent-[#E11D48]"
            />
          </div>
        </div>
      </div>

      {/* Venues & Meetups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVenues.map((venue) => {
          const isPaid = Boolean(venue.isPaidMeetup && venue.meetupPrice);
          const isReserved =
            reservedVenueIds.includes(venue.id) || Boolean(venue.isBookedByMe);
          const finalPrice = calculateFinalPrice(venue);

          return (
            <div
              key={venue.id}
              className="velvet-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={venue.imageUrl}
                    alt={venue.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D090B] via-[#0D090B]/30 to-black/30" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-semibold text-white border border-white/15">
                      {venue.category}
                    </span>

                    {isPaid ? (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white text-xs font-bold shadow-md flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5" />
                        {isBlackVip
                          ? 'VIP Pass Grátis (Black)'
                          : isSellerOrVip
                          ? `R$ ${finalPrice.toFixed(0)} (30% OFF VIP)`
                          : `R$ ${venue.meetupPrice?.toFixed(2).replace('.', ',')}`}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                        Entrada Gratuita
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-white font-display">
                        {venue.name}
                      </h3>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        {venue.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-[#FAF5F6]/75 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FB7185]" />
                      {venue.neighborhood} • {venue.distanceKm} km
                    </p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5 space-y-3">
                  {venue.meetupEventTitle && (
                    <div className="p-3 rounded-2xl bg-[#161013] border border-[#E11D48]/30 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#FB7185] block">
                          Próximo Encontro Confirmado
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                          {venue.meetupEventTitle}
                        </p>
                      </div>
                      {venue.meetupDate && (
                        <span className="px-2.5 py-1 rounded-xl bg-black/50 text-[11px] text-amber-300 font-medium flex items-center gap-1 shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                          {venue.meetupDate}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-[#FAF5F6]/80 leading-relaxed">{venue.perks}</p>

                  <div className="flex items-center gap-2 text-[11px] text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{venue.securityNotice}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-5 pb-5 pt-2 flex items-center gap-2.5">
                {isReserved ? (
                  <>
                    <div className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Inscrito · No Grupo</span>
                    </div>
                    {onOpenMeetupGroup && (
                      <button
                        type="button"
                        onClick={() => onOpenMeetupGroup(venue)}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Abrir Grupo do Encontro</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutVenue(venue);
                      setDiscreetAlias(currentUser.name);
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#E11D48]/25 transition-all"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>
                      {isPaid && finalPrice > 0
                        ? `Inscrever-se & Pagar (R$ ${finalPrice.toFixed(2).replace('.', ',')}) + Entrar no Grupo`
                        : 'Inscrever-se Grátis & Entrar no Grupo do Encontro'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: INSCRIÇÃO, PROTEÇÕES DE SEGURANÇA & FORMAS DE PAGAMENTO */}
      {checkoutVenue && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl velvet-card border border-white/15 p-5 sm:p-6 max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FB7185]">
                  Passaporte de Encontro Real + Acesso ao Grupo
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  {checkoutVenue.meetupEventTitle || checkoutVenue.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutVenue(null)}
                className="p-1.5 rounded-xl bg-white/[0.06] text-[#FAF5F6]/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRegistration} className="space-y-4">
              {/* Step 1: Attendance Format & Discreet Alias */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1.5">
                    Formato de Participação
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAttendanceType('single')}
                      className={`py-2 rounded-xl text-xs font-semibold border ${
                        attendanceType === 'single'
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceType('couple')}
                      className={`py-2 rounded-xl text-xs font-semibold border ${
                        attendanceType === 'couple'
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                      }`}
                    >
                      Casal / Dupla
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1.5">
                    Apelido na Lista Sigilosa
                  </label>
                  <input
                    type="text"
                    required
                    value={discreetAlias}
                    onChange={(e) => setDiscreetAlias(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              {/* Step 2: Consent Bracelet Selector */}
              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">
                  Pulseira de Consentimento no Local (Recebida no Check-in)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      color: 'Verde' as const,
                      desc: 'Aberto(a) a novas conexões',
                      cls: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200'
                    },
                    {
                      color: 'Âmbar' as const,
                      desc: 'Converse antes de abordar',
                      cls: 'border-amber-400/50 bg-amber-500/15 text-amber-200'
                    },
                    {
                      color: 'Vermelha' as const,
                      desc: 'Apenas a dois / observando',
                      cls: 'border-rose-400/50 bg-rose-500/15 text-rose-200'
                    }
                  ].map((b) => (
                    <button
                      key={b.color}
                      type="button"
                      onClick={() => setBraceletColor(b.color)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        braceletColor === b.color
                          ? b.cls
                          : 'bg-[#0D090B] border-white/10 text-[#FAF5F6]/60'
                      }`}
                    >
                      <p className="text-xs font-bold">Pulseira {b.color}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">{b.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Payment Methods (if paid meetup and finalPrice > 0) */}
              {calculateFinalPrice(checkoutVenue) > 0 ? (
                <div className="p-4 rounded-2xl bg-[#140D11] border border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Escolha a Forma de Pagamento Sigiloso
                    </span>
                    <span className="text-sm font-bold text-emerald-400">
                      Total: R$ {calculateFinalPrice(checkoutVenue).toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'pix'
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      PIX Discreto
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Cartão
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'wallet'
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                      }`}
                    >
                      <Wallet className="w-4 h-4" />
                      Saldo / ApplePay
                    </button>
                  </div>

                  {paymentMethod === 'pix' && (
                    <div className="p-3.5 rounded-xl bg-[#0D090B] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          Nome neutro no comprovante: AP EVENTOS LTDA
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              '00020126580014BR.GOV.BCB.PIX0136auraprive-evento-seguro-2026'
                            );
                            setCopiedPix(true);
                            setTimeout(() => setCopiedPix(false), 2000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-semibold flex items-center gap-1"
                        >
                          {copiedPix ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              Código Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copiar PIX
                            </>
                          )}
                        </button>
                      </div>
                      <code className="block text-[10px] text-[#FAF5F6]/60 truncate font-mono bg-black/40 p-2 rounded-lg">
                        00020126580014BR.GOV.BCB.PIX0136auraprive-evento-seguro-2026520400005303986
                      </code>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-2.5 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] text-[#FAF5F6]/60 block mb-1">
                            Número do Cartão
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#FAF5F6]/60 block mb-1">
                            Nome Impresso
                          </label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        <div>
                          <label className="text-[10px] text-[#FAF5F6]/60 block mb-1">
                            Validade
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#FAF5F6]/60 block mb-1">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#FAF5F6]/60 block mb-1">
                            Parcelamento
                          </label>
                          <select
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                          >
                            <option value="1">1x sem juros</option>
                            <option value="2">2x sem juros</option>
                            <option value="3">3x sem juros</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div className="p-3 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-[#FAF5F6]/80 flex items-center justify-between">
                      <span>Usar Saldo da Carteira Aura Privé / Apple Pay</span>
                      <span className="text-emerald-400 font-bold">Aprovação Imediata</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-xs text-emerald-200 flex items-center justify-between">
                  <span>Inscrição 100% Gratuita garantida para seu perfil</span>
                  <strong>R$ 0,00</strong>
                </div>
              )}

              {/* Step 4: Security & Discretion Protections Confirmation */}
              <div className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Proteções Garantidas neste Encontro:</span>
                </div>
                <ul className="text-[11px] text-[#FAF5F6]/70 space-y-1 pl-6 list-disc">
                  <li>Check-in com QR Code criptografado (documento validado sem expor seu nome)</li>
                  <li>Proibição de fotos/filmagens não autorizadas nas áreas reservadas</li>
                  <li>Entrada automática no Grupo Oficial do Encontro (com chamada de vídeo e voz)</li>
                </ul>
                <label className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedSafetyRules}
                    onChange={(e) => setAcceptedSafetyRules(e.target.checked)}
                    className="accent-[#E11D48]"
                  />
                  <span>Concordo com as normas de consentimento, sigilo e respeito do encontro</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutVenue(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] text-xs text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-bold shadow-lg shadow-[#E11D48]/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar Inscrição & Entrar no Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMAÇÃO DE PASSAPORTE + REDIRECIONAMENTO AUTOMÁTICO PARA O GRUPO DO ENCONTRO */}
      {completedVenue && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl velvet-card border border-emerald-400/40 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white font-display">
              Inscrição Confirmada & Você Entrou no Grupo!
            </h3>
            <p className="text-xs text-[#FAF5F6]/75 leading-relaxed">
              Seu passaporte criptografado para <strong>{completedVenue.name}</strong> foi emitido e você já foi adicionado automaticamente ao <strong>Grupo Oficial do Encontro</strong>.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 text-xs space-y-1">
              <p className="text-amber-300 font-bold">
                Código QR Check-in: #AP-{completedVenue.id.toUpperCase()}-2026
              </p>
              <p className="text-[11px] text-[#FAF5F6]/60">
                Pulseira selecionada: {braceletColor} · Apelido: {discreetAlias}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCompletedVenue(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.07] text-xs font-semibold text-white"
              >
                Continuar nos Encontros
              </button>
              {onOpenMeetupGroup && (
                <button
                  type="button"
                  onClick={() => {
                    const v = completedVenue;
                    setCompletedVenue(null);
                    onOpenMeetupGroup(v);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <Users className="w-4 h-4" />
                  Ir para o Grupo Agora
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PROTOCOLO CÓDIGO ÂNGELA */}
      {showAngelCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl velvet-card border border-white/15 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Protocolo Código Ângela
              </h3>
              <button
                type="button"
                onClick={() => setShowAngelCodeModal(false)}
                className="p-1.5 rounded-xl bg-white/[0.06] text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#FAF5F6]/75 leading-relaxed">
              Em todos os locais parceiros do Aura Privé, caso você se sinta desconfortável em um encontro, basta pedir um <strong>“Drink Ângela”</strong> no bar ou recepção. A equipe fará sua escolta discreta até seu veículo ou táxi sem fazer perguntas.
            </p>
            <button
              type="button"
              onClick={() => setShowAngelCodeModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
