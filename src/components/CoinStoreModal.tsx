import { useState } from 'react';
import {
  Coins,
  X,
  Check,
  Sparkles,
  Gift,
  Radio,
  Lock,
  QrCode,
  CreditCard,
  Copy,
  ShieldCheck
} from 'lucide-react';

export interface CoinPackage {
  id: string;
  name: string;
  baseCoins: number;
  bonusCoins: number;
  totalCoins: number;
  priceBrl: number;
  badge?: string;
  popular?: boolean;
}

export const FAIR_COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'pack_starter',
    name: 'Pacote Descoberta',
    baseCoins: 50,
    bonusCoins: 0,
    totalCoins: 50,
    priceBrl: 25.0,
    badge: 'R$ 0,50 / moeda'
  },
  {
    id: 'pack_popular',
    name: 'Pacote Sensual',
    baseCoins: 120,
    bonusCoins: 20,
    totalCoins: 140,
    priceBrl: 59.9,
    badge: '+20 Moedas Bônus',
    popular: true
  },
  {
    id: 'pack_desire',
    name: 'Pacote Privé Club',
    baseCoins: 300,
    bonusCoins: 60,
    totalCoins: 360,
    priceBrl: 139.9,
    badge: '+60 Moedas Bônus'
  },
  {
    id: 'pack_black',
    name: 'Pacote Black Royal',
    baseCoins: 700,
    bonusCoins: 200,
    totalCoins: 900,
    priceBrl: 299.9,
    badge: '+200 Moedas Bônus'
  }
];

interface CoinStoreModalProps {
  isOpen: boolean;
  currentBalance: number;
  onClose: () => void;
  onPurchaseCoins: (coinsAdded: number, amountPaidBrl: number) => void;
  reasonMessage?: string | null;
  customPackages?: CoinPackage[];
}

export function CoinStoreModal({
  isOpen,
  currentBalance,
  onClose,
  onPurchaseCoins,
  reasonMessage,
  customPackages
}: CoinStoreModalProps) {
  const packagesList =
    customPackages && customPackages.length > 0 ? customPackages : FAIR_COIN_PACKAGES;
  const [selectedPackId, setSelectedPackId] = useState<string>('pack_popular');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9912');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('734');
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedPack =
    packagesList.find((p) => p.id === selectedPackId) || packagesList[0];

  const handleConfirmPurchase = () => {
    onPurchaseCoins(selectedPack.totalCoins, selectedPack.priceBrl);
    setPurchaseSuccess(
      `+${selectedPack.totalCoins} Moedas creditadas na sua carteira com sucesso!`
    );
    setTimeout(() => {
      setPurchaseSuccess(null);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl velvet-card border border-white/15 p-5 sm:p-7 max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                  Carteira de Moedas Aura
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold font-mono">
                  Saldo: {currentBalance} Moedas
                </span>
              </div>
              <p className="text-xs text-[#FAF5F6]/65 mt-0.5">
                Sistema justo e transparente: compre moedas para desbloquear mídias +18 de vendedores e enviar presentes em posts e Lives Ao Vivo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.06] text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {reasonMessage && (
          <div className="p-3.5 rounded-2xl bg-[#E11D48]/15 border border-[#E11D48]/40 text-xs text-[#FB7185] font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{reasonMessage}</span>
          </div>
        )}

        {/* How Coins Work Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-[#0F0E11] border border-white/10 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#FB7185] shrink-0" />
            <div>
              <strong className="text-white block">Comprar Mídias +18</strong>
              <span className="text-[11px] text-[#FAF5F6]/60">
                Desbloqueie fotos e vídeos de vendedores na hora
              </span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#0F0E11] border border-white/10 flex items-center gap-2.5">
            <Gift className="w-4 h-4 text-amber-300 shrink-0" />
            <div>
              <strong className="text-white block">Presentear Posts</strong>
              <span className="text-[11px] text-[#FAF5F6]/60">
                Mande presentes nas mídias postadas por criadores
              </span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#0F0E11] border border-white/10 flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block">Presentes em Lives</strong>
              <span className="text-[11px] text-[#FAF5F6]/60">
                Destaque seu nome no chat das transmissões ao vivo
              </span>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-2.5">
            Escolha um Pacote Justo de Moedas (Sem Expiração)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packagesList.map((pack) => {
              const isSelected = pack.id === selectedPack.id;
              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => setSelectedPackId(pack.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#E11D48]/15 border-[#E11D48] ring-1 ring-[#E11D48]/40'
                      : 'bg-[#0F0E11] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{pack.name}</span>
                      {pack.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pack.popular
                              ? 'bg-[#E11D48] text-white'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <Coins className="w-4 h-4 text-amber-300 self-center" />
                      <span className="text-xl font-extrabold text-white font-mono">
                        {pack.totalCoins}
                      </span>
                      <span className="text-xs text-amber-200 font-semibold">Moedas</span>
                    </div>
                    {pack.bonusCoins > 0 && (
                      <span className="text-[10px] text-emerald-400 block mt-0.5">
                        ({pack.baseCoins} moedas + {pack.bonusCoins} bônus grátis)
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-white block">
                      R$ {pack.priceBrl.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] text-white/50">Pagamento único</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-4 rounded-2xl bg-[#0F0E11] border border-white/10 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Forma de Pagamento Discreta</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                  paymentMethod === 'pix'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : 'bg-white/[0.04] border-white/10 text-white/65'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                PIX Instantâneo
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                  paymentMethod === 'card'
                    ? 'bg-[#E11D48]/20 border-[#E11D48] text-white'
                    : 'bg-white/[0.04] border-white/10 text-white/65'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Cartão de Crédito
              </button>
            </div>
          </div>

          {paymentMethod === 'pix' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#16141C] border border-white/10">
              <div className="text-xs space-y-1 min-w-0 w-full">
                <span className="text-emerald-400 font-semibold block">
                  PIX Copia e Cola ({selectedPack.totalCoins} Moedas · R${' '}
                  {selectedPack.priceBrl.toFixed(2).replace('.', ',')}):
                </span>
                <code className="block p-2 rounded-lg bg-black/50 text-[10px] text-white/75 font-mono truncate">
                  00020126580014BR.GOV.BCB.PIX0136auraprive-coins-{selectedPack.totalCoins}520400005303986
                </code>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `00020126580014BR.GOV.BCB.PIX0136auraprive-coins-${selectedPack.totalCoins}520400005303986`
                  );
                  setCopiedPix(true);
                  setTimeout(() => setCopiedPix(false), 2000);
                }}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedPix ? 'Copiado!' : 'Copiar PIX'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Número do Cartão"
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-[#16141C] border border-white/15 text-xs text-white font-mono"
              />
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/AA"
                className="px-3 py-2 rounded-xl bg-[#16141C] border border-white/15 text-xs text-white font-mono"
              />
              <input
                type="text"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                placeholder="CVV"
                className="px-3 py-2 rounded-xl bg-[#16141C] border border-white/15 text-xs text-white font-mono"
              />
            </div>
          )}
        </div>

        {purchaseSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{purchaseSuccess}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-white/55 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Cobrança sigilosa na fatura como “AP DIGITAL” • Repasse justo aos criadores
          </span>

          <button
            type="button"
            onClick={handleConfirmPurchase}
            className="px-6 py-3 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all"
          >
            <Coins className="w-4 h-4 text-amber-300" />
            <span>
              Confirmar Compra de +{selectedPack.totalCoins} Moedas (R${' '}
              {selectedPack.priceBrl.toFixed(2).replace('.', ',')})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
