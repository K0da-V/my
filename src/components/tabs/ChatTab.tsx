import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Lock,
  ShieldCheck,
  Flame,
  Eye,
  Clock,
  CheckCheck,
  Image as ImageIcon,
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Users,
  Plus,
  X,
  Trash2,
  RefreshCw,
  Volume2,
  VolumeX,
  Settings,
  PhoneCall,
  ArrowLeft,
  Smile,
  Upload,
  Film
} from 'lucide-react';
import {
  Conversation,
  User,
  GroupConversation,
  GroupMemberRole
} from '../../types';
import { callAudio } from '../../utils/callAudio';

interface ChatTabProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onSendMessage: (
    conversationId: string,
    text: string,
    isSelfDestruct: boolean,
    mediaOptions?: {
      mediaUrl?: string;
      mediaType?: 'text' | 'image' | 'video' | 'audio';
      destructTimerSec?: number;
    }
  ) => void;
  currentUser: User;
  groups?: GroupConversation[];
  onSendGroupMessage?: (
    groupId: string,
    text: string,
    mediaUrl?: string
  ) => void;
  onJoinGroup?: (groupId: string) => void;
  onCreateGroup?: (groupData: {
    title: string;
    description: string;
    category: GroupConversation['category'];
    isPrivate: boolean;
    subscriptionFee?: number;
  }) => void;
  onDeleteGroup?: (groupId: string) => void;
  onUpdateGroupMemberRole?: (
    groupId: string,
    memberId: string,
    role: GroupMemberRole
  ) => void;
  onRemoveGroupMember?: (groupId: string, memberId: string) => void;
}

const DEMO_MEDIA_VAULT = [
  {
    label: 'Ensaio Sensual Noturno',
    url: '/src/assets/images/liberal_moment_art_1790885781551.jpg',
    type: 'image' as const
  },
  {
    label: 'Bastidores Suíte Privé',
    url: '/src/assets/images/venue_lounge_meet_1790885792094.jpg',
    type: 'image' as const
  },
  {
    label: 'Retrato Intimista',
    url: '/src/assets/images/avatar_valentina_1790885756752.jpg',
    type: 'image' as const
  }
];

const CHAT_EMOJIS = [
  '🔥', '😍', '😈', '💋', '🍷', '🥂', '✨', '❤️',
  '🥵', '👀', '😏', '🖤', '🌹', '🍑', '🍒', '🎉',
  '💃', '🕺', '🎭', '⛓️', '🕯️', '🍓', '🍫', '🌙',
  '💎', '👑', '🤭', '🥰', '👅', '💦', '⚡', '🎶'
];

const EXPRESSIVE_GIFS = [
  {
    id: 'gif_1',
    title: 'Brinde de Champagne 🥂',
    caption: '[GIF] Brindando à nossa noite! 🥂✨',
    url: '/src/assets/images/venue_lounge_meet_1790885792094.jpg'
  },
  {
    id: 'gif_2',
    title: 'Clima Quente 🔥',
    caption: '[GIF] Química lá no alto... 🔥😈',
    url: '/src/assets/images/liberal_moment_art_1790885781551.jpg'
  },
  {
    id: 'gif_3',
    title: 'Olhar Provocante 👀',
    caption: '[GIF] Te esperando sem pressa... 👀💋',
    url: '/src/assets/images/avatar_valentina_1790885756752.jpg'
  },
  {
    id: 'gif_4',
    title: 'Noite no Lounge 🍸',
    caption: '[GIF] Nos vemos no lounge mais tarde? 🍸🌙',
    url: '/src/assets/images/avatar_marcos_1790885768293.jpg'
  }
];

type CallStatus = 'idle' | 'calling' | 'connected' | 'reconnecting' | 'ended';

export function ChatTab({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  currentUser,
  groups = [],
  onSendGroupMessage,
  onJoinGroup,
  onCreateGroup,
  onDeleteGroup,
  onUpdateGroupMemberRole,
  onRemoveGroupMember
}: ChatTabProps) {
  const [chatMode, setChatMode] = useState<'direct' | 'groups'>('direct');
  const [activeGroupId, setActiveGroupId] = useState<string>(groups[0]?.id || 'grp_1');
  // WhatsApp-style mobile navigation: false = conversation list, true = open chat thread
  const [mobileChatOpen, setMobileChatOpen] = useState<boolean>(false);

  const [messageText, setMessageText] = useState('');
  const [isEphemeral, setIsEphemeral] = useState(false);
  const [revealedEphemeralIds, setRevealedEphemeralIds] = useState<string[]>([]);
  const [expiredMessageIds, setExpiredMessageIds] = useState<string[]>([]);
  const [ephemeralCountdowns, setEphemeralCountdowns] = useState<Record<string, number>>({});

  // Rich Composer Popovers: Emojis, GIFs, and Photo/Video Upload
  const [activeTray, setActiveTray] = useState<'none' | 'emoji' | 'gif' | 'media'>('none');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>('');
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video'>('image');
  const [selectedMediaName, setSelectedMediaName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Interactive Call State + Web Audio Synthesizer
  const [activeCall, setActiveCall] = useState<{
    type: 'voice' | 'video';
    participantName: string;
    participantAvatar: string;
    status: CallStatus;
    isMuted: boolean;
    isCameraOff: boolean;
    soundEnabled: boolean;
    seconds: number;
  } | null>(null);

  const callConnectTimeoutRef = useRef<number | null>(null);

  // Create Group Modal
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupCategory, setNewGroupCategory] =
    useState<GroupConversation['category']>('Encontros & Lifestyle');
  const [newGroupPrivate, setNewGroupPrivate] = useState(false);
  const [newGroupFee, setNewGroupFee] = useState('0');

  // Group Roles & Deletion Modal
  const [showManageGroupModal, setShowManageGroupModal] = useState(false);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  // Call duration timer
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected') return;
    const interval = window.setInterval(() => {
      setActiveCall((prev) => (prev ? { ...prev, seconds: prev.seconds + 1 } : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCall?.status]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      callAudio.stopAll();
      if (callConnectTimeoutRef.current) {
        window.clearTimeout(callConnectTimeoutRef.current);
      }
    };
  }, []);

  const startCall = (type: 'voice' | 'video', name: string, avatar: string) => {
    callAudio.startCallingTone();
    setActiveCall({
      type,
      participantName: name,
      participantAvatar: avatar,
      status: 'calling',
      isMuted: false,
      isCameraOff: false,
      soundEnabled: true,
      seconds: 0
    });

    if (callConnectTimeoutRef.current) {
      window.clearTimeout(callConnectTimeoutRef.current);
    }
    callConnectTimeoutRef.current = window.setTimeout(() => {
      callAudio.playConnectedTone();
      setActiveCall((prev) =>
        prev && prev.status === 'calling' ? { ...prev, status: 'connected' } : prev
      );
    }, 3600);
  };

  const triggerReconnectSimulation = () => {
    if (!activeCall) return;
    if (activeCall.soundEnabled) {
      callAudio.startReconnectingTone();
    }
    setActiveCall((prev) => (prev ? { ...prev, status: 'reconnecting' } : null));

    if (callConnectTimeoutRef.current) {
      window.clearTimeout(callConnectTimeoutRef.current);
    }
    callConnectTimeoutRef.current = window.setTimeout(() => {
      if (activeCall.soundEnabled) {
        callAudio.playConnectedTone();
      }
      setActiveCall((prev) =>
        prev && prev.status === 'reconnecting' ? { ...prev, status: 'connected' } : prev
      );
    }, 2800);
  };

  const endCallWithHangupTone = () => {
    if (callConnectTimeoutRef.current) {
      window.clearTimeout(callConnectTimeoutRef.current);
    }
    if (activeCall?.soundEnabled) {
      callAudio.playHangupTone();
    } else {
      callAudio.stopAll();
    }
    setActiveCall((prev) => (prev ? { ...prev, status: 'ended' } : null));
    window.setTimeout(() => {
      setActiveCall(null);
    }, 650);
  };

  const toggleCallSound = () => {
    if (!activeCall) return;
    const nextSound = !activeCall.soundEnabled;
    if (!nextSound) {
      callAudio.stopAll();
    } else if (activeCall.status === 'calling') {
      callAudio.startCallingTone();
    } else if (activeCall.status === 'reconnecting') {
      callAudio.startReconnectingTone();
    }
    setActiveCall({ ...activeCall, soundEnabled: nextSound });
  };

  const formatCallSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const revealEphemeralWithCountdown = (msgId: string, durationSec = 10) => {
    if (revealedEphemeralIds.includes(msgId)) return;
    setRevealedEphemeralIds((prev) => [...prev, msgId]);
    setEphemeralCountdowns((prev) => ({ ...prev, [msgId]: durationSec }));

    const timer = window.setInterval(() => {
      setEphemeralCountdowns((prev) => {
        const current = prev[msgId];
        if (current === undefined || current <= 1) {
          window.clearInterval(timer);
          setExpiredMessageIds((exp) => [...exp, msgId]);
          return prev;
        }
        return { ...prev, [msgId]: current - 1 };
      });
    }, 1000);
  };

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const isVid = file.type.startsWith('video/');
    setSelectedMediaUrl(objectUrl);
    setSelectedMediaType(isVid ? 'video' : 'image');
    setSelectedMediaName(file.name);
    setActiveTray('media');
  };

  const handleSendGif = (gif: (typeof EXPRESSIVE_GIFS)[0]) => {
    if (chatMode === 'direct' && activeConversation) {
      onSendMessage(activeConversation.id, gif.caption, isEphemeral, {
        mediaUrl: gif.url,
        mediaType: 'image',
        destructTimerSec: isEphemeral ? 10 : undefined
      });
    } else if (chatMode === 'groups' && activeGroup && onSendGroupMessage) {
      onSendGroupMessage(activeGroup.id, gif.caption, gif.url);
    }
    setActiveTray('none');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !selectedMediaUrl) return;

    if (chatMode === 'direct' && activeConversation) {
      onSendMessage(
        activeConversation.id,
        messageText.trim() ||
          (selectedMediaType === 'video' ? '📹 Vídeo enviado' : '📷 Foto enviada'),
        isEphemeral,
        selectedMediaUrl
          ? {
              mediaUrl: selectedMediaUrl,
              mediaType: selectedMediaType,
              destructTimerSec: isEphemeral ? 10 : undefined
            }
          : undefined
      );
      setMessageText('');
      setSelectedMediaUrl('');
      setSelectedMediaName('');
      setActiveTray('none');
    } else if (chatMode === 'groups' && activeGroup && onSendGroupMessage) {
      onSendGroupMessage(
        activeGroup.id,
        messageText.trim() ||
          (selectedMediaType === 'video' ? '📹 Vídeo compartilhado' : '📷 Foto compartilhada'),
        selectedMediaUrl || undefined
      );
      setMessageText('');
      setSelectedMediaUrl('');
      setSelectedMediaName('');
      setActiveTray('none');
    }
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !onCreateGroup) return;
    const fee = parseFloat(newGroupFee.replace(',', '.')) || 0;
    onCreateGroup({
      title: newGroupName.trim(),
      description: newGroupDesc.trim() || 'Grupo exclusivo da comunidade Aura Privé.',
      category: newGroupCategory,
      isPrivate: newGroupPrivate,
      subscriptionFee: fee > 0 ? fee : undefined
    });
    setNewGroupName('');
    setNewGroupDesc('');
    setShowCreateGroupModal(false);
  };

  // Shared Composer Component for both Direct and Group Chats
  const renderComposerBar = (placeholderText: string) => (
    <div className="bg-[#141218] border-t border-white/[0.08]">
      {/* Hidden Native File Input for Photos & Videos from Phone Gallery or PC */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUploadChange}
        className="hidden"
      />

      {/* Selected Media Preview Banner */}
      {selectedMediaUrl && (
        <div className="px-4 py-2.5 bg-[#1B1720] border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {selectedMediaType === 'video' ? (
              <video
                src={selectedMediaUrl}
                className="w-11 h-11 rounded-xl object-cover border border-[#E11D48]"
                muted
              />
            ) : (
              <img
                src={selectedMediaUrl}
                alt="Anexo"
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-xl object-cover border border-[#E11D48]"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {selectedMediaName ||
                  (selectedMediaType === 'video' ? 'Vídeo pronto para enviar' : 'Foto pronta para enviar')}
              </p>
              <span className="text-[10px] text-emerald-400">
                Clique no botão enviar para compartilhar na conversa
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedMediaUrl('');
              setSelectedMediaName('');
            }}
            className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* EMOJI TRAY */}
      {activeTray === 'emoji' && (
        <div className="p-3.5 bg-[#18151C] border-b border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80">
              Toque em um emoji para adicionar
            </span>
            <button
              type="button"
              onClick={() => setActiveTray('none')}
              className="text-[11px] text-white/50 hover:text-white"
            >
              Fechar
            </button>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
            {CHAT_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setMessageText((prev) => prev + emoji)}
                className="h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] flex items-center justify-center text-lg transition-transform active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GIF TRAY */}
      {activeTray === 'gif' && (
        <div className="p-3.5 bg-[#18151C] border-b border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-[#FB7185]" />
              Enviar GIF Expressivo na Conversa
            </span>
            <button
              type="button"
              onClick={() => setActiveTray('none')}
              className="text-[11px] text-white/50 hover:text-white"
            >
              Fechar
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EXPRESSIVE_GIFS.map((gif) => (
              <button
                key={gif.id}
                type="button"
                onClick={() => handleSendGif(gif)}
                className="group relative h-20 rounded-xl overflow-hidden border border-white/15 text-left"
              >
                <img
                  src={gif.url}
                  alt={gif.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2 flex flex-col justify-end">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E11D48] text-white font-bold self-start mb-0.5">
                    GIF
                  </span>
                  <span className="text-[10px] font-semibold text-white truncate">
                    {gif.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PHOTO & VIDEO UPLOAD TRAY */}
      {activeTray === 'media' && (
        <div className="p-3.5 bg-[#18151C] border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#FB7185]" />
              Enviar Foto ou Vídeo
            </span>
            <button
              type="button"
              onClick={() => setActiveTray('none')}
              className="text-[11px] text-white/50 hover:text-white"
            >
              Fechar
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Abrir Galeria / Computador (Foto ou Vídeo)</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {DEMO_MEDIA_VAULT.map((item) => (
              <button
                key={item.url}
                type="button"
                onClick={() => {
                  setSelectedMediaUrl(item.url);
                  setSelectedMediaType(item.type);
                  setSelectedMediaName(item.label);
                }}
                className={`p-1.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  selectedMediaUrl === item.url
                    ? 'border-[#E11D48] bg-[#E11D48]/15'
                    : 'border-white/10 bg-black/30'
                }`}
              >
                <img
                  src={item.url}
                  alt={item.label}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
                <span className="text-[11px] text-[#FAF5F6] truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Row */}
      <form onSubmit={handleSubmit} className="p-2.5 sm:p-3.5 flex items-center gap-1.5 sm:gap-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setActiveTray(activeTray === 'emoji' ? 'none' : 'emoji')}
          title="Emojis"
          className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
            activeTray === 'emoji'
              ? 'bg-[#E11D48]/20 border-[#E11D48] text-[#FB7185]'
              : 'bg-white/[0.04] border-white/10 text-[#FAF5F6]/70 hover:text-white'
          }`}
        >
          <Smile className="w-4 h-4" />
        </button>

        {/* GIF Button */}
        <button
          type="button"
          onClick={() => setActiveTray(activeTray === 'gif' ? 'none' : 'gif')}
          title="Enviar GIF"
          className={`px-2.5 py-2 rounded-xl border text-[11px] font-extrabold transition-colors shrink-0 ${
            activeTray === 'gif'
              ? 'bg-[#E11D48]/20 border-[#E11D48] text-[#FB7185]'
              : 'bg-white/[0.04] border-white/10 text-[#FAF5F6]/70 hover:text-white'
          }`}
        >
          GIF
        </button>

        {/* Photo / Video Upload Button */}
        <button
          type="button"
          onClick={() => setActiveTray(activeTray === 'media' ? 'none' : 'media')}
          title="Enviar Foto ou Vídeo da Galeria / Computador"
          className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
            activeTray === 'media' || Boolean(selectedMediaUrl)
              ? 'bg-[#E11D48]/20 border-[#E11D48] text-[#FB7185]'
              : 'bg-white/[0.04] border-white/10 text-[#FAF5F6]/70 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {chatMode === 'direct' && (
          <button
            type="button"
            onClick={() => setIsEphemeral(!isEphemeral)}
            title="Mensagem autodestrutiva"
            className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
              isEphemeral
                ? 'bg-[#E11D48]/20 border-[#E11D48] text-[#FB7185]'
                : 'bg-white/[0.04] border-white/10 text-[#FAF5F6]/60 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
          </button>
        )}

        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={placeholderText}
          className="flex-1 min-w-0 bg-[#0F0E11] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF5F6] placeholder-[#FAF5F6]/40 focus:outline-none focus:border-[#E11D48]"
        />

        <button
          type="submit"
          className="p-2.5 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white transition-all shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );

  return (
    <div className="space-y-4 pb-10">
      {/* Top Mode Switcher (Hidden on mobile when inside an open chat so it feels 100% like WhatsApp) */}
      <div
        className={`${
          mobileChatOpen ? 'hidden md:flex' : 'flex'
        } flex-wrap items-center justify-between gap-2.5 velvet-card p-3 rounded-2xl`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setChatMode('direct');
              setMobileChatOpen(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              chatMode === 'direct'
                ? 'bg-[#E11D48] text-white shadow-sm'
                : 'text-[#FAF5F6]/65 hover:text-[#FAF5F6]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Conversas ({conversations.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setChatMode('groups');
              setMobileChatOpen(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              chatMode === 'groups'
                ? 'bg-[#E11D48] text-white shadow-sm'
                : 'text-[#FAF5F6]/65 hover:text-[#FAF5F6]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Grupos & Comunidades ({groups.length})</span>
          </button>
        </div>

        {chatMode === 'groups' && (
          <button
            type="button"
            onClick={() => setShowCreateGroupModal(true)}
            className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#FAF5F6] border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#FB7185]" />
            <span>Novo Grupo</span>
          </button>
        )}
      </div>

      {/* Main Split View (WhatsApp-style on Mobile, Split View on Desktop) */}
      <div className="velvet-card rounded-3xl overflow-hidden min-h-[580px] grid grid-cols-1 md:grid-cols-12">
        {/* Left Sidebar: Conversation / Group List */}
        <div
          className={`${
            mobileChatOpen ? 'hidden md:flex' : 'flex'
          } md:col-span-4 border-b md:border-b-0 md:border-r border-white/[0.07] flex-col bg-[#141218]`}
        >
          <div className="p-4 border-b border-white/[0.07] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#FAF5F6]">
                {chatMode === 'direct' ? 'Suas Conversas' : 'Grupos & Comunidades'}
              </h2>
              <p className="text-[11px] text-[#FAF5F6]/50 mt-0.5">
                Toque em uma conversa para abrir o chat completo
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.05] overflow-y-auto max-h-[520px]">
            {chatMode === 'direct'
              ? conversations.map((conv) => {
                  const isSelected = activeConversation?.id === conv.id;
                  const p = conv.participant;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => {
                        onSelectConversation(conv.id);
                        setMobileChatOpen(true);
                      }}
                      className={`w-full p-3.5 sm:p-4 flex items-center gap-3 text-left transition-colors ${
                        isSelected ? 'md:bg-[#E11D48]/15' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border border-white/10"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#141218]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-sm text-[#FAF5F6] truncate flex items-center gap-1">
                            {p.name}
                            {p.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                          </span>
                          <span className="text-[10px] text-[#FAF5F6]/45 shrink-0">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        <p className="text-xs text-[#FAF5F6]/60 truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E11D48] text-white text-[10px] font-bold shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              : groups.map((grp) => {
                  const isSelected = activeGroup?.id === grp.id;
                  return (
                    <button
                      key={grp.id}
                      type="button"
                      onClick={() => {
                        setActiveGroupId(grp.id);
                        setMobileChatOpen(true);
                      }}
                      className={`w-full p-3.5 sm:p-4 flex items-center gap-3 text-left transition-colors ${
                        isSelected ? 'md:bg-[#E11D48]/15' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <img
                        src={grp.avatarUrl}
                        alt={grp.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-sm text-[#FAF5F6] truncate">
                            {grp.title}
                          </span>
                          {grp.subscriptionFee ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold shrink-0">
                              R$ {grp.subscriptionFee.toFixed(0)}
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 shrink-0">
                              Grátis
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#FAF5F6]/50 mt-0.5 truncate">
                          {grp.membersCount} membros · {grp.category}
                        </p>
                        <p className="text-xs text-[#FAF5F6]/65 truncate mt-0.5">
                          {grp.lastMessage || grp.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
          </div>
        </div>

        {/* Right Panel: Active Direct Conversation or Group Thread */}
        {chatMode === 'direct' && activeConversation ? (
          <div
            className={`${
              mobileChatOpen ? 'flex' : 'hidden md:flex'
            } md:col-span-8 flex-col justify-between bg-[#0F0E11]`}
          >
            {/* WhatsApp-style Direct Conversation Header */}
            <div className="px-3.5 py-3 border-b border-white/[0.08] flex items-center justify-between gap-2 bg-[#17151A]">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileChatOpen(false)}
                  className="md:hidden p-1.5 -ml-1 rounded-xl text-[#FAF5F6]/80 hover:text-white hover:bg-white/10 shrink-0"
                  aria-label="Voltar para conversas"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={activeConversation.participant.avatarUrl}
                  alt={activeConversation.participant.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-[#FAF5F6] truncate">
                      {activeConversation.participant.name}
                    </h3>
                    {activeConversation.participant.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-400 truncate">
                    Online · {activeConversation.participant.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    startCall(
                      'voice',
                      activeConversation.participant.name,
                      activeConversation.participant.avatarUrl
                    )
                  }
                  className="px-2.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-[#FAF5F6] border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-medium whitespace-nowrap"
                  title="Chamada de voz"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">Voz</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    startCall(
                      'video',
                      activeConversation.participant.name,
                      activeConversation.participant.avatarUrl
                    )
                  }
                  className="px-2.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-[#FAF5F6] border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-medium whitespace-nowrap"
                  title="Chamada de vídeo"
                >
                  <Video className="w-3.5 h-3.5 text-[#FB7185] shrink-0" />
                  <span className="hidden sm:inline">Vídeo</span>
                </button>
              </div>
            </div>

            {/* Direct Messages Thread */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px] md:max-h-[450px]">
              {activeConversation.messages.map((msg) => {
                const isMine = msg.senderId === currentUser.id || msg.senderId === 'me';
                const isRevealed = revealedEphemeralIds.includes(msg.id);
                const isExpired = expiredMessageIds.includes(msg.id);
                const remainingSecs = ephemeralCountdowns[msg.id];

                if (isExpired) {
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="px-3.5 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-[11px] text-[#FAF5F6]/40 italic flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#FB7185]" />
                        Mídia temporária autodestruída
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] sm:max-w-[70%] rounded-2xl p-3.5 ${
                        isMine
                          ? 'bg-[#BE123C] text-white rounded-br-xs shadow-sm'
                          : 'bg-[#1B1821] text-[#FAF5F6] border border-white/[0.08] rounded-bl-xs'
                      }`}
                    >
                      {msg.mediaUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-white/10">
                          {msg.mediaType === 'video' ? (
                            <video
                              src={msg.mediaUrl}
                              controls
                              playsInline
                              className="w-full max-h-60 object-cover"
                            />
                          ) : (
                            <img
                              src={msg.mediaUrl}
                              alt="Mídia"
                              referrerPolicy="no-referrer"
                              className="w-full max-h-60 object-cover"
                            />
                          )}
                        </div>
                      )}

                      {msg.isSelfDestruct && !isRevealed && !isMine ? (
                        <button
                          type="button"
                          onClick={() =>
                            revealEphemeralWithCountdown(msg.id, msg.destructTimerSec || 10)
                          }
                          className="flex items-center gap-2 text-xs text-white py-1 px-2 rounded-lg bg-black/25 hover:bg-black/40 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#FB7185]" />
                          <span>Toque para abrir mensagem autodestrutiva</span>
                        </button>
                      ) : (
                        <div>
                          <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                          {msg.isSelfDestruct && remainingSecs !== undefined && (
                            <span className="inline-block mt-1 text-[10px] font-mono text-amber-300">
                              Autodestruição em {remainingSecs}s
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-1.5 mt-1 opacity-65">
                        {msg.isSelfDestruct && <Clock className="w-3 h-3" />}
                        <span className="text-[10px]">{msg.timestamp}</span>
                        {isMine && <CheckCheck className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {renderComposerBar(
              isEphemeral
                ? 'Mensagem autodestrutiva...'
                : `Mensagem para ${activeConversation.participant.name}...`
            )}
          </div>
        ) : chatMode === 'groups' && activeGroup ? (
          <div
            className={`${
              mobileChatOpen ? 'flex' : 'hidden md:flex'
            } md:col-span-8 flex-col justify-between bg-[#0F0E11]`}
          >
            {/* Clean, Well-Aligned Group Header (Fixes Image 5) */}
            <div className="px-3.5 py-3 border-b border-white/[0.08] flex items-center justify-between gap-2 bg-[#17151A]">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileChatOpen(false)}
                  className="md:hidden p-1.5 -ml-1 rounded-xl text-[#FAF5F6]/80 hover:text-white hover:bg-white/10 shrink-0"
                  aria-label="Voltar para grupos"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={activeGroup.avatarUrl}
                  alt={activeGroup.title}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#FAF5F6] truncate">
                    {activeGroup.title}
                  </h3>
                  <p className="text-[11px] text-[#FAF5F6]/55 truncate">
                    {activeGroup.members?.length || activeGroup.membersCount} membros ativos ·{' '}
                    <span className="text-[#FB7185]">{activeGroup.category}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowManageGroupModal(true)}
                  className="px-2.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-xs font-medium text-[#FAF5F6] border border-white/10 flex items-center gap-1.5 whitespace-nowrap transition-colors"
                  title="Gerenciar Membros, Cargos e Apagar Grupo"
                >
                  <Settings className="w-3.5 h-3.5 text-[#FB7185] shrink-0" />
                  <span className="hidden lg:inline">Cargos & Grupo</span>
                </button>

                {!activeGroup.isJoined ? (
                  <button
                    type="button"
                    onClick={() => onJoinGroup && onJoinGroup(activeGroup.id)}
                    className="px-3 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold whitespace-nowrap"
                  >
                    Entrar
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startCall('voice', activeGroup.title, activeGroup.avatarUrl)}
                      className="px-2.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-[#FAF5F6] border border-white/10 flex items-center gap-1.5 text-xs font-medium whitespace-nowrap transition-colors"
                      title="Chamada de Voz no Grupo"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="hidden sm:inline">Voz</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startCall('video', activeGroup.title, activeGroup.avatarUrl)}
                      className="px-3 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap shadow-sm transition-all"
                      title="Chamada de Vídeo em Grupo"
                    >
                      <Video className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">Vídeo</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Group Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px] md:max-h-[450px]">
              {activeGroup.messages.map((gmsg) => {
                const isMine = gmsg.senderId === currentUser.id || gmsg.senderId === 'me';
                const memberObj = activeGroup.members?.find((m) => m.id === gmsg.senderId);
                const roleLabel = memberObj?.role || gmsg.senderRole;
                return (
                  <div
                    key={gmsg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] sm:max-w-[70%] rounded-2xl p-3.5 ${
                        isMine
                          ? 'bg-[#BE123C] text-white rounded-br-xs'
                          : 'bg-[#1B1821] text-[#FAF5F6] border border-white/[0.08] rounded-bl-xs'
                      }`}
                    >
                      {!isMine && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px] font-bold text-[#FB7185]">
                            {gmsg.senderName}
                          </span>
                          {roleLabel && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/10 text-amber-200 font-semibold">
                              {roleLabel}
                            </span>
                          )}
                        </div>
                      )}
                      {gmsg.mediaUrl && (
                        <img
                          src={gmsg.mediaUrl}
                          alt="Mídia do grupo"
                          referrerPolicy="no-referrer"
                          className="w-full max-h-56 object-cover rounded-xl mb-2"
                        />
                      )}
                      <p className="text-xs sm:text-sm leading-relaxed">{gmsg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                        <span className="text-[10px]">{gmsg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {renderComposerBar(`Mensagem em ${activeGroup.title}...`)}
          </div>
        ) : null}
      </div>

      {/* Interactive Voice / Video Call Modal (1:1 or Multi-Member Group/Community Video Call) */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl velvet-card border border-white/15 p-6 text-center space-y-5 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-[#FAF5F6]/60">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                {chatMode === 'groups'
                  ? `Sala de ${activeCall.type === 'video' ? 'Vídeo' : 'Voz'} da Comunidade / Grupo`
                  : 'Chamada Privada Aura Privé'}
              </span>
              <button
                type="button"
                onClick={toggleCallSound}
                className="px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#FAF5F6] flex items-center gap-1 text-[11px]"
              >
                {activeCall.soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    Som Ativo
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    Mudo
                  </>
                )}
              </button>
            </div>

            {chatMode === 'groups' && activeGroup ? (
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="relative h-36 rounded-2xl overflow-hidden bg-[#161013] border border-[#E11D48]/50">
                  {!activeCall.isCameraOff && activeCall.type === 'video' ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-xs text-[#FAF5F6]/60">
                      <VideoOff className="w-6 h-6 text-[#FB7185] mb-1" />
                      <span>Câmera Desativada</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-white">
                    <span className="font-bold truncate">Você ({currentUser.name})</span>
                    {activeCall.isMuted ? (
                      <MicOff className="w-3 h-3 text-rose-400 shrink-0" />
                    ) : (
                      <Mic className="w-3 h-3 text-emerald-400 shrink-0" />
                    )}
                  </div>
                </div>

                {(activeGroup.members || []).slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className="relative h-36 rounded-2xl overflow-hidden bg-[#161013] border border-white/15"
                  >
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover ${
                        activeCall.type === 'voice' ? 'blur-md scale-110 opacity-60' : ''
                      }`}
                    />
                    {activeCall.type === 'voice' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
                        />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-white">
                      <span className="font-bold truncate">{member.name}</span>
                      <span className="text-[9px] text-amber-300 shrink-0">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative w-28 h-28 mx-auto">
                {(activeCall.status === 'calling' || activeCall.status === 'reconnecting') && (
                  <div className="absolute inset-0 rounded-full border-2 border-[#E11D48] animate-ping opacity-40" />
                )}
                <img
                  src={activeCall.participantAvatar}
                  alt={activeCall.participantName}
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 rounded-full object-cover border-2 border-[#E11D48] relative z-10 mx-auto"
                />
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-white font-display">
                {activeCall.participantName}
              </h3>
              <p className="text-xs sm:text-sm font-medium mt-1.5">
                {activeCall.status === 'calling' && (
                  <span className="text-amber-300 animate-pulse">
                    Ligando... (som de chamada ativo)
                  </span>
                )}
                {activeCall.status === 'connected' && (
                  <span className="text-emerald-400">
                    Conectado · {formatCallSeconds(activeCall.seconds)}
                  </span>
                )}
                {activeCall.status === 'reconnecting' && (
                  <span className="text-amber-400 animate-pulse">
                    Reconectando sinal... (som de reconexão ativo)
                  </span>
                )}
                {activeCall.status === 'ended' && (
                  <span className="text-rose-400">Desligando chamada...</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() =>
                  setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
                }
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
                  activeCall.isMuted
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/15'
                }`}
                title="Silenciar microfone"
              >
                {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {activeCall.type === 'video' && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveCall((prev) =>
                      prev ? { ...prev, isCameraOff: !prev.isCameraOff } : null
                    )
                  }
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
                    activeCall.isCameraOff
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/15'
                  }`}
                  title="Alternar câmera"
                >
                  {activeCall.isCameraOff ? (
                    <VideoOff className="w-5 h-5" />
                  ) : (
                    <Video className="w-5 h-5" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={triggerReconnectSimulation}
                className="px-3.5 h-12 rounded-2xl bg-white/[0.06] hover:bg-white/15 border border-white/10 text-xs font-medium text-amber-200 flex items-center gap-1.5"
                title="Testar som de reconexão"
              >
                <RefreshCw className="w-4 h-4" />
                Reconectar
              </button>

              {activeCall.status !== 'connected' && activeCall.status !== 'ended' && (
                <button
                  type="button"
                  onClick={() => {
                    if (callConnectTimeoutRef.current) {
                      window.clearTimeout(callConnectTimeoutRef.current);
                    }
                    if (activeCall.soundEnabled) callAudio.playConnectedTone();
                    setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
                  }}
                  className="px-3.5 h-12 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-xs font-semibold text-emerald-300 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4" />
                  Atender
                </button>
              )}

              <button
                type="button"
                onClick={endCallWithHangupTone}
                className="px-4 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
                title="Desligar chamada"
              >
                <PhoneOff className="w-4 h-4" />
                Desligar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Group Modal: Assign Member Roles & Delete Group */}
      {showManageGroupModal && activeGroup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl velvet-card border border-white/15 p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Gerenciar Grupo: {activeGroup.title}
                </h3>
                <p className="text-xs text-[#FAF5F6]/60">
                  Defina cargos para membros ou apague o grupo permanentemente
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowManageGroupModal(false)}
                className="p-1.5 rounded-xl bg-white/[0.06] text-[#FAF5F6]/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FAF5F6]/60">
                Membros & Atribuição de Cargos ({(activeGroup.members || []).length})
              </span>

              {(activeGroup.members || []).map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-2xl bg-[#0F0E11] border border-white/[0.08] flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{member.name}</p>
                      <span className="text-[10px] text-[#FAF5F6]/50">{member.joinedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) =>
                        onUpdateGroupMemberRole &&
                        onUpdateGroupMemberRole(
                          activeGroup.id,
                          member.id,
                          e.target.value as GroupMemberRole
                        )
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-[#18151C] border border-white/15 text-xs text-amber-200 focus:outline-none focus:border-[#E11D48]"
                    >
                      <option value="Fundador(a)">Fundador(a)</option>
                      <option value="Administrador(a)">Administrador(a)</option>
                      <option value="Moderador(a)">Moderador(a)</option>
                      <option value="Criador VIP">Criador VIP</option>
                      <option value="Membro">Membro</option>
                    </select>

                    {member.id !== currentUser.id && member.id !== 'me' && onRemoveGroupMember && (
                      <button
                        type="button"
                        onClick={() => onRemoveGroupMember(activeGroup.id, member.id)}
                        className="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300"
                        title="Remover membro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {onDeleteGroup && (
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-400">Zona de Exclusão</p>
                  <p className="text-[11px] text-[#FAF5F6]/55">
                    Apagar este grupo removerá todas as mensagens e membros.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteGroup(activeGroup.id);
                    setShowManageGroupModal(false);
                    const remaining = groups.filter((g) => g.id !== activeGroup.id);
                    if (remaining[0]) setActiveGroupId(remaining[0].id);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Apagar Grupo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateGroupSubmit}
            className="w-full max-w-md rounded-3xl velvet-card border border-white/15 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Criar Comunidade ou Grupo</h3>
              <button
                type="button"
                onClick={() => setShowCreateGroupModal(false)}
                className="text-[#FAF5F6]/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-[#FAF5F6]/70 block mb-1">Nome do Grupo</label>
              <input
                type="text"
                required
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Ex: Casais & Vinhos SP"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0E11] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-[#FAF5F6]/70 block mb-1">Descrição</label>
              <textarea
                rows={2}
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                placeholder="Sobre o que é esta comunidade..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#0F0E11] border border-white/10 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#FAF5F6]/70 block mb-1">Categoria</label>
                <select
                  value={newGroupCategory}
                  onChange={(e) =>
                    setNewGroupCategory(e.target.value as GroupConversation['category'])
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0E11] border border-white/10 text-xs text-white"
                >
                  <option value="Encontros & Lifestyle">Encontros & Lifestyle</option>
                  <option value="BDSM & Fetiche">BDSM & Fetiche</option>
                  <option value="Comunidade de Criador">Comunidade de Criador</option>
                  <option value="Clube Exclusivo">Clube Exclusivo</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#FAF5F6]/70 block mb-1">Mensalidade (R$)</label>
                <input
                  type="text"
                  value={newGroupFee}
                  onChange={(e) => setNewGroupFee(e.target.value)}
                  placeholder="0 = Grátis"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0E11] border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-[#FAF5F6]/80 cursor-pointer">
              <input
                type="checkbox"
                checked={newGroupPrivate}
                onChange={(e) => setNewGroupPrivate(e.target.checked)}
                className="accent-[#E11D48]"
              />
              Grupo privado (somente convidados ou assinantes)
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateGroupModal(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] text-xs text-[#FAF5F6]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#E11D48] text-xs font-semibold text-white"
              >
                Criar Agora
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
