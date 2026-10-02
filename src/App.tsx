/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TabType, User, LiberalMoment, MeetupVenue, Conversation, Message, VipTier, BdsmProfile, BdsmTestResult, GroupConversation, GroupMessage } from './types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_PROFILES,
  INITIAL_MOMENTS,
  INITIAL_VENUES,
  INITIAL_CONVERSATIONS,
  INITIAL_GROUPS
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StealthCamouflage } from './components/StealthCamouflage';
import { VerificationModal } from './components/VerificationModal';
import { ConsentAgreementModal } from './components/ConsentAgreementModal';
import { BdsmTestModal } from './components/BdsmTestModal';
import { CallModal } from './components/CallModal';
import { VipSubscriptionModal } from './components/VipSubscriptionModal';
import { ReportModal } from './components/ReportModal';
import { ConnectTab } from './components/tabs/ConnectTab';
import { LiberalMomentsTab } from './components/tabs/LiberalMomentsTab';
import { EncontrosTab } from './components/tabs/EncontrosTab';
import { ChatTab } from './components/tabs/ChatTab';
import { ProfileTab } from './components/tabs/ProfileTab';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('connect');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_CURRENT_USER);
  const [profiles, setProfiles] = useState<User[]>(INITIAL_PROFILES);
  const [moments, setMoments] = useState<LiberalMoment[]>(INITIAL_MOMENTS);
  const [venues, setVenues] = useState<MeetupVenue[]>(INITIAL_VENUES);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [groups, setGroups] = useState<GroupConversation[]>(INITIAL_GROUPS);

  // Modals
  const [isStealthActive, setIsStealthActive] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isBdsmConsentOpen, setIsBdsmConsentOpen] = useState(false);
  const [isBdsmTestOpen, setIsBdsmTestOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTargetUser, setReportTargetUser] = useState<User | null>(null);

  // Calls
  const [activeCall, setActiveCall] = useState<{
    isOpen: boolean;
    participant: User;
    type: 'audio' | 'video';
  } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleStartChat = (target: User, isBlindMatch: boolean) => {
    let existing = conversations.find((c) => c.participant.id === target.id);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        participant: target,
        lastMessage: isBlindMatch ? 'Conexão às Cegas iniciada!' : 'Conexão iniciada pelo Radar!',
        lastMessageTime: 'Agora',
        unreadCount: 0,
        isBlindMatch,
        isUnmasked: false,
        matchScore: target.matchScore || 85,
        commonHobbies: target.hobbies.filter((h) => currentUser.hobbies.includes(h)),
        messages: [
          {
            id: `m_init_${Date.now()}`,
            senderId: target.id,
            text: isBlindMatch
              ? `Conexão às Cegas estabelecida! Adorei seus interesses comuns: ${target.hobbies.slice(0, 2).join(' e ')}. ${target.blindMatchInfo.icebreaker}`
              : `Olá ${currentUser.name}! Que prazer conectar com você pelo Radar de Afinidades.`,
            mediaType: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            e2eeVerified: true,
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(existing.id);
    }
    setCurrentTab('chat');
    showToast(`Conectado com ${target.name}! Mensagens criptografadas prontas.`);
  };

  const handleSendMessage = (convId: string, message: Message) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: message.text || (message.mediaType === 'audio' ? 'Mensagem de voz' : 'Mídia privada'),
            lastMessageTime: message.timestamp,
            messages: [...c.messages, message],
          };
        }
        return c;
      })
    );
  };

  const handleRevealBlindMatch = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isUnmasked: true } : c))
    );
    showToast('Identidades reveladas mutuamente com consentimento!');
  };

  const handleSendGroupMessage = (groupId: string, message: GroupMessage) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            lastMessage: message.text || (message.mediaType === 'audio' ? 'Mensagem de áudio' : 'Mídia privada enviada'),
            lastMessageSender: message.senderName,
            lastMessageTime: message.timestamp,
            messages: [...g.messages, message],
          };
        }
        return g;
      })
    );
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newStatus = !g.isJoined;
          showToast(newStatus ? `Você entrou no grupo "${g.title}"!` : `Você saiu do grupo "${g.title}".`);
          return {
            ...g,
            isJoined: newStatus,
            membersCount: newStatus ? g.membersCount + 1 : Math.max(1, g.membersCount - 1),
          };
        }
        return g;
      })
    );
  };

  const handleCreateGroup = (newGroup: Omit<GroupConversation, 'id' | 'messages' | 'membersCount' | 'isJoined' | 'unreadCount' | 'lastMessage' | 'lastMessageSender' | 'lastMessageTime'>) => {
    const created: GroupConversation = {
      ...newGroup,
      id: `grp_${Date.now()}`,
      membersCount: 1,
      isJoined: true,
      unreadCount: 0,
      lastMessage: 'Grupo privado criado. Criptografia E2EE ativa.',
      lastMessageSender: currentUser.name,
      lastMessageTime: 'Agora',
      messages: [
        {
          id: `gm_init_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatarUrl,
          senderRole: 'Criador(a) / Host',
          text: `Grupo privado criado: ${newGroup.title}. Todas as mensagens e mídias são protegidas com chave E2EE.`,
          mediaType: 'text',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          e2eeVerified: true,
        },
      ],
    };
    setGroups((prev) => [created, ...prev]);
    showToast(`Grupo privado "${created.title}" criado com sucesso!`);
  };

  const handleInviteVenue = (venue: MeetupVenue) => {
    if (conversations.length > 0) {
      const targetConv = conversations[0];
      const inviteMsg: Message = {
        id: `venue_inv_${Date.now()}`,
        senderId: currentUser.id,
        text: `📍 Sugestão de encontro presencial: que tal nos conhecermos no ${venue.name} (${venue.category}) em ${venue.neighborhood}? Local seguro certificado pela Aura Privé.`,
        mediaType: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        e2eeVerified: true,
      };
      handleSendMessage(targetConv.id, inviteMsg);
      setActiveConversationId(targetConv.id);
      setCurrentTab('chat');
      showToast(`Convite para ${venue.name} enviado no chat!`);
    } else {
      showToast(`Local ${venue.name} selecionado. Conecte com alguém para propor o encontro.`);
    }
  };

  const handleReportComplete = (userId: string, blocked: boolean) => {
    if (blocked) {
      setProfiles((prev) => prev.filter((p) => p.id !== userId));
      setConversations((prev) => prev.filter((c) => c.participant.id !== userId));
      setMoments((prev) => prev.filter((m) => m.authorId !== userId));
      showToast('Perfil denunciado e bloqueado permanentemente da sua conta.');
    } else {
      showToast('Denúncia enviada à moderação para análise imediata.');
    }
  };

  const handleVerificationSuccess = (hash: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      isVerified: true,
      verificationHash: hash,
    }));
    showToast('Identidade verificada com sucesso! Selo de autenticidade emitido.');
  };

  const handleSaveBdsm = (updatedBdsm: BdsmProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      bdsm: updatedBdsm,
    }));
    showToast('Preferências e filtros de consentimento BDSM atualizados.');
  };

  const handleSaveBdsmTestResults = (result: BdsmTestResult, topRole: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      bdsm: {
        ...prev.bdsm,
        enabled: true,
        role: topRole as any,
        testResult: result,
      },
    }));
    showToast(`Teste BDSM concluído! Seu arquétipo diagnosticado é: ${topRole}.`);
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updated,
    }));
    showToast('Configurações e informações do perfil salvas com sucesso!');
  };

  const handleUpgradeVip = (tier: VipTier) => {
    setCurrentUser((prev) => ({
      ...prev,
      isVip: true,
      vipTier: tier,
    }));
    showToast(
      tier === 'diamond_club'
        ? 'Parabéns! Assinatura Diamond Club ativada com todos os benefícios.'
        : 'Assinatura Black VIP ativada com sucesso!'
    );
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Camouflage / Decoy Screen */}
      {isStealthActive && (
        <StealthCamouflage onUnlock={() => setIsStealthActive(false)} />
      )}

      {/* Top Bar with 3-Zone Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onTriggerStealth={() => setIsStealthActive(true)}
        onOpenVip={() => setIsVipOpen(true)}
        vipTier={currentUser.vipTier}
        isGhostMode={currentUser.privacySettings.ghostMode}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-[#161a26]/95 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {currentTab === 'connect' && (
          <ConnectTab
            currentUser={currentUser}
            profiles={profiles}
            onStartChat={handleStartChat}
            onOpenReport={(user) => {
              setReportTargetUser(user);
              setIsReportOpen(true);
            }}
            onOpenVip={() => setIsVipOpen(true)}
          />
        )}

        {currentTab === 'moments' && (
          <LiberalMomentsTab
            currentUser={currentUser}
            moments={moments}
            onAddMoment={(m) => {
              setMoments((prev) => [m, ...prev]);
              showToast('Momento Liberal cifrado e publicado com sucesso!');
            }}
            onOpenVip={() => setIsVipOpen(true)}
            onOpenReport={(author) => {
              setReportTargetUser(author);
              setIsReportOpen(true);
            }}
          />
        )}

        {currentTab === 'venues' && (
          <EncontrosTab
            venues={venues}
            currentUser={currentUser}
            onInviteVenue={handleInviteVenue}
          />
        )}

        {currentTab === 'chat' && (
          <ChatTab
            currentUser={currentUser}
            conversations={conversations}
            groups={groups}
            activeConversationId={activeConversationId}
            onSendMessage={handleSendMessage}
            onSendGroupMessage={handleSendGroupMessage}
            onJoinGroup={handleJoinGroup}
            onCreateGroup={handleCreateGroup}
            onStartCall={(participant, type) =>
              setActiveCall({ isOpen: true, participant, type })
            }
            onRevealBlindMatch={handleRevealBlindMatch}
            onOpenReport={(user) => {
              setReportTargetUser(user);
              setIsReportOpen(true);
            }}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onUpdatePrivacy={(newSettings) => {
              setCurrentUser((prev) => ({ ...prev, privacySettings: newSettings }));
              showToast('Configurações de privacidade salvas.');
            }}
            onOpenVerification={() => setIsVerificationOpen(true)}
            onOpenBdsmConsent={() => setIsBdsmConsentOpen(true)}
            onOpenBdsmTest={() => setIsBdsmTestOpen(true)}
            onOpenVip={() => setIsVipOpen(true)}
            onTriggerStealth={() => setIsStealthActive(true)}
          />
        )}
      </main>

      {/* Ergonomic Mobile Bottom Nav Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unreadChatCount={
          conversations.reduce((acc, c) => acc + c.unreadCount, 0) +
          groups.reduce((acc, g) => acc + (g.isJoined ? g.unreadCount : 0), 0)
        }
      />

      {/* Modals */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onSuccess={handleVerificationSuccess}
      />

      <ConsentAgreementModal
        isOpen={isBdsmConsentOpen}
        onClose={() => setIsBdsmConsentOpen(false)}
        currentBdsm={currentUser.bdsm}
        onSave={handleSaveBdsm}
        onOpenTestQuiz={() => setIsBdsmTestOpen(true)}
      />

      <BdsmTestModal
        isOpen={isBdsmTestOpen}
        onClose={() => setIsBdsmTestOpen(false)}
        onSaveResults={handleSaveBdsmTestResults}
        existingResult={currentUser.bdsm.testResult}
      />

      <VipSubscriptionModal
        isOpen={isVipOpen}
        onClose={() => setIsVipOpen(false)}
        currentTier={currentUser.vipTier}
        onUpgrade={handleUpgradeVip}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => {
          setIsReportOpen(false);
          setReportTargetUser(null);
        }}
        targetUser={reportTargetUser}
        onReportComplete={handleReportComplete}
      />

      {activeCall && activeCall.isOpen && (
        <CallModal
          isOpen={activeCall.isOpen}
          onClose={() => setActiveCall(null)}
          participant={activeCall.participant}
          callType={activeCall.type}
        />
      )}
    </div>
  );
}
