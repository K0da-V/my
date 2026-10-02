import { useState } from 'react';
import { Lock, Calculator, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface StealthCamouflageProps {
  onUnlock: () => void;
}

export function StealthCamouflage({ onUnlock }: StealthCamouflageProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [calcInput, setCalcInput] = useState('1,450.00');

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin === '1234') {
        onUnlock();
      } else if (newPin.length === 4) {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 800);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090b10] text-slate-200 flex flex-col items-center justify-between p-6 select-none animate-in fade-in duration-150">
      {/* Camouflage Header */}
      <div className="w-full max-w-sm flex items-center justify-between pt-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-semibold tracking-wide text-slate-300">Vault Calculator & Balances</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Seguro</span>
        </div>
      </div>

      {/* Screen Display */}
      <div className="w-full max-w-sm my-auto flex flex-col items-center">
        <div className="w-full bg-[#12151e] border border-slate-800 rounded-2xl p-5 mb-6 text-right shadow-inner">
          <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">Total Liquid Assets</span>
          <div className="text-3xl font-mono font-medium text-slate-100">
            R$ {calcInput}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>PIN de emergência:</span>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    error
                      ? 'bg-rose-500'
                      : pin.length > idx
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Keypad */}
        <div className="w-full max-w-xs grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                if (item === 'C') {
                  setPin('');
                  setError(false);
                } else if (item === 'OK') {
                  if (pin === '1234') {
                    onUnlock();
                  } else {
                    setError(true);
                    setTimeout(() => {
                      setPin('');
                      setError(false);
                    }, 600);
                  }
                } else {
                  handleDigit(item);
                  setCalcInput((prev) => (prev.length < 9 ? prev + item : prev));
                }
              }}
              className="h-14 rounded-xl bg-[#171b26] hover:bg-[#202534] active:scale-95 transition-all text-lg font-mono font-medium text-slate-200 border border-slate-800 flex items-center justify-center focus:outline-none"
            >
              {item === 'OK' ? <ArrowRight className="w-5 h-5 text-emerald-400" /> : item}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 mt-6 text-center max-w-xs leading-relaxed">
          Modo Camuflagem ativo. Digite <strong className="text-slate-300">1234</strong> no teclado para retornar ao app com segurança.
        </p>
      </div>

      {/* Quick unlock button for dev/user convenience */}
      <button
        onClick={onUnlock}
        className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4 py-2"
      >
        Desbloquear agora (Acesso Rápido)
      </button>
    </div>
  );
}
