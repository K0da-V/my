/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  TabType,
  User,
  LiberalMoment,
  MeetupVenue,
  Conversation,
  Message,
  VipTier,
  BdsmTestResult,
  GroupConversation,
  GroupMessage,
  AuthProviderType,
  VerificationDetails,
  GroupMemberRole,
  UserStatusStory,
  LiveStreamSession,
  AdultContentItem
} from './types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_PROFILES,
  INITIAL_MOMENTS,
  INITIAL_VENUES,
  INITIAL_CONVERSATIONS,
  ALL_HOBBIES,
  INITIAL_GROUPS,
  INITIAL_STORIES,
  INITIAL_LIVES
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StealthCamouflage } from './components/StealthCamouflage';
import { VerificationModal } from './components/VerificationModal';
import { VipSubscriptionModal } from './components/VipSubscriptionModal';
import { BdsmTestModal } from './components/BdsmTestModal';
import { ReportModal } from './components/ReportModal';
import { AuthScreen } from './components/AuthScreen';
import { StatusAndLiveBar } from './components/StatusAndLiveBar';
import { ConnectTab } from './components/tabs/ConnectTab';
import { LiberalMomentsTab } from './components/tabs/LiberalMomentsTab';
import { EncontrosTab } from './components/tabs/EncontrosTab';
import { ChatTab } from './components/tabs/ChatTab';
import { ProfileTab } from './components/tabs/ProfileTab';

export default function App() {
  // Authentication & Stealth Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isStealthActive, setIsStealthActive] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<TabType>('connect');
  const [profileSubTab, setProfileSubTab] = useState<'overview' | 'edit' | 'seller' | 'privacy'>(
    'edit'
  );

  // Modals
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState<boolean>(false);
  const [isBdsmTestOpen, setIsBdsmTestOpen] = useState<boolean>(false);
  const [reportTargetUser, setReportTargetUser] = useState<User | null>(null);

  // Core App Data
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_CURRENT_USER);
  const [profiles, setProfiles] = useState<User[]>(INITIAL_PROFILES);
  const [moments, setMoments] = useState<LiberalMoment[]>(INITIAL_MOMENTS);
  const [venues, setVenues] = useState<MeetupVenue[]>(INITIAL_VENUES);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [groups, setGroups] = useState<GroupConversation[]>(INITIAL_GROUPS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    INITIAL_CONVERSATIONS[0]?.id || null
  );
  const [likedUserIds, setLikedUserIds] = useState<string[]>([]);
  const [reservedVenueIds, setReservedVenueIds] = useState<string[]>([]);
  const [stories, setStories] = useState<UserStatusStory[]>(INITIAL_STORIES);
  const [liveStreams, setLiveStreams] = useState<LiveStreamSession[]>(INITIAL_LIVES);

  // Login / Signup handler
  const handleAuthenticate = (authData: {
    name?: string;
    email: string;
    phone?: string;
    provider: AuthProviderType;
    isNewRegistration?: boolean;
  }) => {
    setCurrentUser((prev) => ({
      ...prev,
      name: authData.name && authData.name.trim() ? authData.name.trim() : prev.name,
      email: authData.email,
      phone: authData.phone || prev.phone,
      authProvider: authData.provider,
      isSellerVerified: authData.isNewRegistration ? false : prev.isSellerVerified,
      sellerProfile: prev.sellerProfile
        ? {
            ...prev.sellerProfile,
            isSellerVerified: authData.isNewRegistration
              ? false
              : prev.sellerProfile.isSellerVerified
          }
        : undefined
    }));
    setIsAuthenticated(true);
  };

  // Verification completion handler (RG/CNH + 3D Facial Liveness)
  const handleVerificationSuccess = (hash: string, details?: VerificationDetails) => {
    setCurrentUser((prev) => ({
      ...prev,
      isVerified: true,
      verificationHash: hash,
      verificationDetails: details || prev.verificationDetails
    }));
    setIsVerificationOpen(false);
  };

  // Like a profile silently without annoying toast notifications
  const handleLikeUser = (targetUser: User) => {
    if (likedUserIds.includes(targetUser.id)) return;

    if (currentUser.vipTier === 'free') {
      const currentLikes = currentUser.quotas?.dailyLikesRemaining ?? 20;
      if (currentLikes <= 0) {
        setIsVipModalOpen(true);
        return;
      }
      setCurrentUser((prev) => ({
        ...prev,
        quotas: {
          dailyLikesRemaining: currentLikes - 1,
          maxDailyLikes: 20,
          dailyFirstMessagesRemaining: prev.quotas?.dailyFirstMessagesRemaining ?? 4,
          maxDailyFirstMessages: 4,
          resetTimeLabel: prev.quotas?.resetTimeLabel ?? '23h 59m'
        }
      }));
    }

    setLikedUserIds((prev) => [...prev, targetUser.id]);
  };

  // Start or open a conversation silently without toast notifications
  const handleStartChat = (targetUser: User) => {
    const existingConv = conversations.find((c) => c.participant.id === targetUser.id);
    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setCurrentTab('chat');
      return;
    }

    if (currentUser.vipTier === 'free') {
      const remainingFirstMsgs = currentUser.quotas?.dailyFirstMessagesRemaining ?? 4;
      if (remainingFirstMsgs <= 0) {
        setIsVipModalOpen(true);
        return;
      }
      setCurrentUser((prev) => ({
        ...prev,
        quotas: {
          dailyLikesRemaining: prev.quotas?.dailyLikesRemaining ?? 20,
          maxDailyLikes: 20,
          dailyFirstMessagesRemaining: remainingFirstMsgs - 1,
          maxDailyFirstMessages: 4,
          resetTimeLabel: prev.quotas?.resetTimeLabel ?? '23h 59m'
        }
      }));
    }

    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      participant: targetUser,
      lastMessage: 'Conexão iniciada. Envie sua mensagem!',
      lastMessageTime: 'Agora',
      unreadCount: 0,
      isBlindMatch: false,
      isUnmasked: true,
      matchScore: targetUser.matchScore || 92,
      commonHobbies: targetUser.hobbies.slice(0, 2),
      messages: [
        {
          id: `sys_${Date.now()}`,
          senderId: targetUser.id,
          text: `Olá! Que bom conectar com você por aqui.`,
          mediaType: 'text',
          timestamp: 'Agora',
          e2eeVerified: true
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setCurrentTab('chat');
  };

  // Send direct message silently without annoying notifications
  const handleSendMessage = (
    conversationId: string,
    text: string,
    isSelfDestruct: boolean,
    mediaOptions?: {
      mediaUrl?: string;
      mediaType?: 'text' | 'image' | 'video' | 'audio';
      destructTimerSec?: number;
    }
  ) => {
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text,
      mediaUrl: mediaOptions?.mediaUrl,
      mediaType: mediaOptions?.mediaType || 'text',
      isSelfDestruct,
      destructTimerSec: mediaOptions?.destructTimerSec,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      e2eeVerified: true
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          lastMessage: text,
          lastMessageTime: 'Agora',
          unreadCount: 0,
          messages: [...conv.messages, newMsg]
        };
      })
    );
  };

  // Group Chat & Community Handlers (Create, Delete, Roles, Remove Member)
  const handleSendGroupMessage = (groupId: string, text: string, mediaUrl?: string) => {
    const newGroupMsg: GroupMessage = {
      id: `gm_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatarUrl,
      senderRole: 'Fundador(a)',
      text,
      mediaUrl,
      mediaType: mediaUrl ? 'image' : 'text',
      timestamp: 'Agora',
      e2eeVerified: true
    };

    setGroups((prev) =>
      prev.map((grp) =>
        grp.id === groupId
          ? {
              ...grp,
              isJoined: true,
              lastMessage: text,
              lastMessageSender: currentUser.name,
              lastMessageTime: 'Agora',
              messages: [...grp.messages, newGroupMsg]
            }
          : grp
      )
    );
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((grp) =>
        grp.id === groupId
          ? { ...grp, isJoined: true, membersCount: grp.membersCount + 1 }
          : grp
      )
    );
  };

  const handleCreateGroup = (groupData: {
    title: string;
    description: string;
    category: GroupConversation['category'];
    isPrivate: boolean;
    subscriptionFee?: number;
  }) => {
    const newGroup: GroupConversation = {
      id: `grp_${Date.now()}`,
      title: groupData.title,
      description: groupData.description,
      avatarUrl: currentUser.avatarUrl,
      category: groupData.category,
      membersCount: 1,
      isPrivate: groupData.isPrivate,
      isFreeGroup: !groupData.subscriptionFee,
      subscriptionFee: groupData.subscriptionFee,
      isJoined: true,
      unreadCount: 0,
      lastMessage: `Comunidade ${groupData.title} criada!`,
      lastMessageSender: currentUser.name,
      lastMessageTime: 'Agora',
      tags: [groupData.category],
      rules: ['Respeito mútuo e sigilo absoluto'],
      members: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatarUrl: currentUser.avatarUrl,
          role: 'Fundador(a)',
          joinedAt: 'Agora'
        }
      ],
      messages: [
        {
          id: `gm_init_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatarUrl,
          senderRole: 'Fundador(a)',
          text: `Bem-vindos à comunidade ${groupData.title}!`,
          mediaType: 'text',
          timestamp: 'Agora',
          e2eeVerified: true
        }
      ]
    };

    setGroups((prev) => [newGroup, ...prev]);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleUpdateGroupMemberRole = (
    groupId: string,
    memberId: string,
    role: GroupMemberRole
  ) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          members: (grp.members || []).map((m) =>
            m.id === memberId ? { ...m, role } : m
          )
        };
      })
    );
  };

  const handleRemoveGroupMember = (groupId: string, memberId: string) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp;
        const nextMembers = (grp.members || []).filter((m) => m.id !== memberId);
        return {
          ...grp,
          members: nextMembers,
          membersCount: Math.max(1, grp.membersCount - 1)
        };
      })
    );
  };

  // Moments Handlers
  const handleAddMoment = (moment: LiberalMoment) => {
    setMoments((prev) => [moment, ...prev]);
  };

  const handleUnlockMomentSale = (momentId: string) => {
    setMoments((prev) =>
      prev.map((m) => (m.id === momentId ? { ...m, isUnlockedByMe: true } : m))
    );
  };

  const handleDeleteMoment = (momentId: string) => {
    setMoments((prev) => prev.filter((m) => m.id !== momentId));
  };

  const handleReserveVenue = (
    venue: MeetupVenue,
    registrationInfo?: {
      attendanceType: 'single' | 'couple';
      braceletColor: 'Verde' | 'Âmbar' | 'Vermelha';
      paymentMethod: 'pix' | 'card' | 'wallet' | 'free_vip';
      amountPaid: number;
    }
  ) => {
    if (!reservedVenueIds.includes(venue.id)) {
      setReservedVenueIds((prev) => [...prev, venue.id]);
      setVenues((prev) =>
        prev.map((v) => (v.id === venue.id ? { ...v, isBookedByMe: true } : v))
      );
    }

    // Automatically add user to the official group of this Meetup Venue
    const groupTitle = `Encontro Oficial: ${venue.name}`;
    setGroups((prev) => {
      const existing = prev.find(
        (g) => g.id === `grp_venue_${venue.id}` || g.title === groupTitle
      );
      const joinText = `Inscrição confirmada no evento ${venue.meetupEventTitle || venue.name}! Pulseira escolhida: ${
        registrationInfo?.braceletColor || 'Verde'
      }. Nos vemos lá! 🥂`;

      const joinMessage: GroupMessage = {
        id: `gm_${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatarUrl,
        senderRole: 'Membro',
        text: joinText,
        mediaType: 'text',
        timestamp: 'Agora',
        e2eeVerified: true
      };

      if (existing) {
        return prev.map((g) =>
          g.id === existing.id
            ? {
                ...g,
                isJoined: true,
                membersCount: g.isJoined ? g.membersCount : g.membersCount + 1,
                lastMessage: joinText,
                lastMessageSender: currentUser.name,
                lastMessageTime: 'Agora',
                messages: [...g.messages, joinMessage]
              }
            : g
        );
      }

      const newMeetupGroup: GroupConversation = {
        id: `grp_venue_${venue.id}`,
        title: groupTitle,
        description: `Grupo privado exclusivo dos participantes confirmados em ${venue.name} (${venue.neighborhood}). Vídeo em grupo liberado.`,
        avatarUrl: venue.imageUrl,
        category: 'Encontros & Lifestyle',
        membersCount: 19,
        isPrivate: true,
        isFreeGroup: !venue.isPaidMeetup,
        isJoined: true,
        unreadCount: 0,
        lastMessage: joinText,
        lastMessageSender: currentUser.name,
        lastMessageTime: 'Agora',
        tags: [venue.category, venue.neighborhood, 'Encontro Real'],
        rules: [
          'Respeite rigorosamente a cor da pulseira de cada participante.',
          'Proibido compartilhar prints ou lista de presença fora do grupo.'
        ],
        members: [
          {
            id: currentUser.id,
            name: `${currentUser.name} (Você)`,
            avatarUrl: currentUser.avatarUrl,
            role: 'Membro',
            joinedAt: 'Confirmado Agora'
          },
          {
            id: 'user_1',
            name: 'Valentina Rossi',
            avatarUrl: '/src/assets/images/avatar_valentina_1790885756752.jpg',
            role: 'Fundador(a)',
            joinedAt: 'Organizadora'
          },
          {
            id: 'user_2',
            name: 'Casal J&M',
            avatarUrl: '/src/assets/images/liberal_moment_art_1790885781551.jpg',
            role: 'Criador VIP',
            joinedAt: 'Confirmados'
          }
        ],
        messages: [
          {
            id: `gm_welcome_${venue.id}`,
            senderId: 'user_1',
            senderName: 'Valentina Rossi (Host)',
            senderAvatar: '/src/assets/images/avatar_valentina_1790885756752.jpg',
            senderRole: 'Fundador(a)',
            text: `Bem-vindos ao grupo oficial do encontro em ${venue.name}! Apresentem-se ou iniciem uma chamada de vídeo com a galera antes do evento.`,
            mediaType: 'text',
            timestamp: 'Hoje',
            e2eeVerified: true
          },
          joinMessage
        ]
      };

      return [newMeetupGroup, ...prev];
    });
  };

  const handleAddSellerItemFromStatus = (item: AdultContentItem) => {
    setCurrentUser((prev) => {
      if (!prev.sellerProfile) return prev;
      return {
        ...prev,
        sellerProfile: {
          ...prev.sellerProfile,
          items: [item, ...(prev.sellerProfile.items || [])]
        }
      };
    });
  };

  const handleUpgradeVip = (tier: VipTier) => {
    setCurrentUser((prev) => ({
      ...prev,
      isVip: tier !== 'free',
      vipTier: tier,
      quotas: {
        dailyLikesRemaining: tier === 'vip' ? 100 : 9999,
        maxDailyLikes: tier === 'vip' ? 100 : 9999,
        dailyFirstMessagesRemaining: tier === 'vip' ? 30 : 9999,
        maxDailyFirstMessages: tier === 'vip' ? 30 : 9999,
        resetTimeLabel: 'Ilimitado'
      }
    }));
    setIsVipModalOpen(false);
  };

  const handleSaveBdsmResult = (result: BdsmTestResult, primaryRole: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      bdsm: {
        ...prev.bdsm,
        enabled: true,
        role: (primaryRole as User['bdsm']['role']) || prev.bdsm.role,
        testResult: result
      }
    }));
    setIsBdsmTestOpen(false);
  };

  const totalUnreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  if (isStealthActive) {
    return <StealthCamouflage onUnlock={() => setIsStealthActive(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={handleAuthenticate} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#E11D48] selection:text-white">
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onSuccess={handleVerificationSuccess}
      />

      <VipSubscriptionModal
        isOpen={isVipModalOpen}
        currentTier={currentUser.vipTier}
        onClose={() => setIsVipModalOpen(false)}
        onUpgrade={handleUpgradeVip}
        isSellerVerified={Boolean(
          currentUser.isSellerVerified || currentUser.sellerProfile?.isSellerVerified
        )}
      />

      <BdsmTestModal
        isOpen={isBdsmTestOpen}
        onClose={() => setIsBdsmTestOpen(false)}
        onSaveResults={handleSaveBdsmResult}
        existingResult={currentUser.bdsm?.testResult}
      />

      <ReportModal
        isOpen={Boolean(reportTargetUser)}
        onClose={() => setReportTargetUser(null)}
        targetUser={reportTargetUser}
        onReportComplete={(userId, blocked) => {
          if (blocked) {
            setProfiles((prev) => prev.filter((p) => p.id !== userId));
          }
          setReportTargetUser(null);
        }}
      />

      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'profile') setProfileSubTab('edit');
        }}
        onTriggerStealth={() => setIsStealthActive(true)}
        onOpenVip={() => setIsVipModalOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
        vipTier={currentUser.vipTier}
        isGhostMode={Boolean(currentUser.privacySettings?.ghostMode)}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-20 md:pb-12">
        {(currentTab === 'connect' || currentTab === 'moments') && (
          <StatusAndLiveBar
            currentUser={currentUser}
            stories={stories}
            liveStreams={liveStreams}
            onAddStory={(newStory) => setStories((prev) => [newStory, ...prev])}
            onAddMomentFromStatus={handleAddMoment}
            onAddSellerItemFromStatus={handleAddSellerItemFromStatus}
            onStartLiveStream={(newLive) => setLiveStreams((prev) => [newLive, ...prev])}
            onOpenVip={() => setIsVipModalOpen(true)}
            onOpenSellerSetup={() => {
              setProfileSubTab('seller');
              setCurrentTab('profile');
            }}
          />
        )}

        {currentTab === 'connect' && (
          <ConnectTab
            profiles={profiles}
            allHobbies={ALL_HOBBIES}
            currentUser={currentUser}
            likedUserIds={likedUserIds}
            onLikeUser={handleLikeUser}
            onStartChat={handleStartChat}
            onStartVerify={() => setIsVerificationOpen(true)}
            onOpenVip={() => setIsVipModalOpen(true)}
            onOpenBdsmTest={() => setIsBdsmTestOpen(true)}
          />
        )}

        {currentTab === 'moments' && (
          <LiberalMomentsTab
            moments={moments}
            currentUser={currentUser}
            onAddMoment={handleAddMoment}
            onUnlockMomentSale={handleUnlockMomentSale}
            onOpenVip={() => setIsVipModalOpen(true)}
            onOpenSellerHub={() => {
              setProfileSubTab('seller');
              setCurrentTab('profile');
            }}
            onOpenReport={(author) => setReportTargetUser(author)}
          />
        )}

        {currentTab === 'venues' && (
          <EncontrosTab
            venues={venues}
            onInviteVenue={handleReserveVenue}
            onOpenMeetupGroup={() => setCurrentTab('chat')}
            currentUser={currentUser}
            onOpenVip={() => setIsVipModalOpen(true)}
          />
        )}

        {currentTab === 'chat' && (
          <ChatTab
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => {
              setActiveConversationId(id);
              setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
              );
            }}
            onSendMessage={handleSendMessage}
            currentUser={currentUser}
            groups={groups}
            onSendGroupMessage={handleSendGroupMessage}
            onJoinGroup={handleJoinGroup}
            onCreateGroup={handleCreateGroup}
            onDeleteGroup={handleDeleteGroup}
            onUpdateGroupMemberRole={handleUpdateGroupMemberRole}
            onRemoveGroupMember={handleRemoveGroupMember}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab
            user={currentUser}
            allHobbies={ALL_HOBBIES}
            userMoments={moments.filter((m) => m.authorId === currentUser.id)}
            groups={groups}
            initialSubTab={profileSubTab}
            onToggleGhostMode={() =>
              setCurrentUser((prev) => ({
                ...prev,
                privacySettings: {
                  ...prev.privacySettings,
                  ghostMode: !prev.privacySettings?.ghostMode
                }
              }))
            }
            onStartVerify={() => setIsVerificationOpen(true)}
            onOpenVip={() => setIsVipModalOpen(true)}
            onOpenBdsmTest={() => setIsBdsmTestOpen(true)}
            onUpdateProfile={(updated) =>
              setCurrentUser((prev) => ({
                ...prev,
                ...updated
              }))
            }
            onCreateMoment={handleAddMoment}
            onDeleteMoment={handleDeleteMoment}
            onCreateGroup={handleCreateGroup}
            onDeleteGroup={handleDeleteGroup}
            onUpdateGroupMemberRole={handleUpdateGroupMemberRole}
            onRemoveGroupMember={handleRemoveGroupMember}
            onDeleteAccount={() => {
              setIsAuthenticated(false);
              setCurrentTab('connect');
            }}
            stories={stories}
            onAddStory={(newStory) => setStories((prev) => [newStory, ...prev])}
          />
        )}
      </main>

      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'profile') setProfileSubTab('edit');
        }}
        unreadChatCount={totalUnreadCount}
      />
    </div>
  );
}
