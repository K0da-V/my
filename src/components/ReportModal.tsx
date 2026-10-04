import { useState } from 'react';
import { AlertTriangle, ShieldX, X, CheckCircle2, UserX } from 'lucide-react';
import { User } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User | null;
  onReportComplete: (userId: string, blocked: boolean) => void;
}

const REPORT_REASONS = [
  { id: 'consent_breach', label: 'Violação de consentimento ou desrespeito a limite acordado' },
  { id: 'harassment', label: 'Comportamento abusivo, assédio ou insistência agressiva' },
  { id: 'underage', label: 'Suspeita de usuário menor de 18 anos (Tolerância Zero)' },
  { id: 'privacy_leak', label: 'Vazamento ou ameaça de compartilhamento de mídias privadas' },
  { id: 'fake_profile', label: 'Perfil falso, golpe financeiro ou fotos roubadas' },
  { id: 'commercial', label: 'Spam, venda de serviços não autorizados ou bots' },
];

export function ReportModal({ isOpen, onClose, targetUser, onReportComplete }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0].id);
  const [details, setDetails] = useState('');
  const [blockUser, setBlockUser] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onReportComplete(targetUser.id, blockUser);
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0D]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B0B0D] border border-[#39363B] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-[#F4F1F2]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#39363B] flex items-center justify-between bg-[#0B0B0D]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#B5122A]/15 border border-[#B5122A]/30 flex items-center justify-center text-[#B5122A]">
              <ShieldX className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F4F1F2] font-display">Denúncia Rápida de Perfil</h3>
              <p className="text-[10px] text-[#F4F1F2]/60">Moderação ativa 24/7 e proteção ao usuário</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#F4F1F2]/60 hover:text-[#F4F1F2] hover:bg-[#39363B]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#B5122A] mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#F4F1F2] font-display mb-1">Denúncia Registrada</h4>
            <p className="text-xs text-[#F4F1F2]/60 mb-4">
              Nossa equipe de segurança e moderação já recebeu o relatório criptografado. Se você optou por bloquear, o perfil foi ocultado da sua experiência.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4 text-xs text-[#F4F1F2]/80">
            <div>
              <span className="text-[#F4F1F2]/60 block text-[11px] mb-1">Denunciando:</span>
              <div className="flex items-center gap-2.5 p-2 bg-[#0B0B0D] border border-[#39363B] rounded-xl">
                <img
                  src={targetUser.avatarUrl}
                  alt={targetUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <span className="font-semibold text-[#F4F1F2] block text-xs">{targetUser.name}, {targetUser.age}</span>
                  <span className="text-[10px] text-[#F4F1F2]/60">{targetUser.city}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#F4F1F2] text-xs block mb-1.5">
                Selecione o motivo principal da infração:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {REPORT_REASONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.id)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      selectedReason === r.id
                        ? 'bg-[#B5122A]/20 border-[#B5122A] text-[#F4F1F2] font-medium'
                        : 'bg-[#0B0B0D] border-[#39363B] text-[#F4F1F2]/70 hover:border-[#39363B]/80 hover:text-[#F4F1F2]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#F4F1F2] text-xs block mb-1">
                Detalhes adicionais (opcional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Descreva o que ocorreu para que a equipe de auditoria possa agir com precisão..."
                rows={3}
                className="w-full bg-[#0B0B0D] border border-[#39363B] rounded-xl p-3 text-xs text-[#F4F1F2] placeholder:text-[#F4F1F2]/40 focus:outline-none focus:border-[#B5122A] resize-none"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="blockUserCheck"
                checked={blockUser}
                onChange={(e) => setBlockUser(e.target.checked)}
                className="w-4 h-4 rounded text-[#B5122A] bg-[#0B0B0D] border-[#39363B] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="blockUserCheck" className="text-xs text-[#F4F1F2]/80 cursor-pointer select-none">
                Bloquear este usuário e impedir qualquer contato futuro
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#F4F1F2]/60 hover:text-[#F4F1F2] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B5122A] to-[#6F0F20] hover:from-[#B5122A]/90 hover:to-[#6F0F20]/90 text-[#F4F1F2] font-semibold text-xs transition-all shadow-lg shadow-[#B5122A]/20"
              >
                Enviar Denúncia & Proteger
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
