import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Mic,
  Video,
  Phone,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Flame,
  Flag,
  Sparkles,
  ArrowLeft,
  Check,
  CheckCheck,
  Users,
  User as UserIcon,
  Plus,
  Search,
  Info,
  X,
  Hash,
  Crown
} from 'lucide-react';
import { Conversation, Message, User, GroupConversation, GroupMessage } from '../../types';
import { INITIAL_GROUPS } from '../../data/mockData';

interface ChatTabProps {
  currentUser: User;
  conversations: Conversation[];
  groups?: GroupConversation[];
  activeConversationId?: string;
  onSendMessage: (conversationId: string, message: Message) => void;
  onSendGroupMessage?: (groupId: string, message: GroupMessage) => void;
  onJoinGroup?: (groupId: string) => void;
  onCreateGroup?: (newGroup: Omit<GroupConversation, 'id' | 'messages' | 'membersCount' | 'isJoined' | 'unreadCount' | 'lastMessage' | 'lastMessageSender' | 'lastMessageTime'>) => void;
  onStartCall: (participant: User, type: 'audio' | 'video') => void;
  onRevealBlindMatch: (conversationId: string) => void;
  onOpenReport: (user: User) => void;
}

export function ChatTab({
  currentUser,
  conversations,
  groups = INITIAL_GROUPS,
  activeConversationId,
  onSendMessage,
  onSendGroupMessage,
  onJoinGroup,
  onCreateGroup,
  onStartCall,
  onRevealBlindMatch,
  onOpenReport,
}: ChatTabProps) {
  // Main view mode: 'direct' (1 a 1) or 'groups' (em grupos)
  const [chatMode, setChatMode] = useState<'direct' | 'groups'>('direct');

  // Selected items
  const [selectedConvId, setSelectedConvId] = useState<string | null>(
    activeConversationId || (conversations.length > 0 ? conversations[0].id : null)
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    groups.length > 0 ? groups[0].id : null
  );

  // Mobile navigation: shows conversation/group or list
  const [isMobileViewingChat, setIsMobileViewingChat] = useState(false);

  // Direct Message states
  const [textInput, setTextInput] = useState('');
  const [isSelfDestructActive, setIsSelfDestructActive] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [revealedEphemeralMedia, setRevealedEphemeralMedia] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Group search & filters
  const [groupCategoryFilter, setGroupCategoryFilter] = useState<string>('Todos');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showGroupRulesModal, setShowGroupRulesModal] = useState(false);

  // New Group Form State
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<GroupConversation['category']>('Clube Exclusivo');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupTags, setNewGroupTags] = useState('Privado, VIP');
  const [newGroupRules, setNewGroupRules] = useState('Respeito irrestrito a limites e privacidade.\nProibido capturas de tela.');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, activeGroup?.messages, chatMode]);

  useEffect(() => {
    let timer: any;
    if (isRecordingAudio) {
      setRecordingSeconds(0);
      timer = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingAudio]);

  // Handlers for Direct Messages
  const handleSendTextMessage = () => {
    if (!textInput.trim()) return;

    if (chatMode === 'direct') {
      if (!activeConversation) return;
      const newMsg: Message = {
        id: `m_${Date.now()}`,
        senderId: currentUser.id,
        text: textInput.trim(),
        mediaType: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        e2eeVerified: true,
      };
      onSendMessage(activeConversation.id, newMsg);
    } else {
      if (!activeGroup) return;
      const newGroupMsg: GroupMessage = {
        id: `gm_${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatarUrl,
        senderRole: currentUser.isVip ? 'Black VIP' : 'Membro',
        text: textInput.trim(),
        mediaType: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        e2eeVerified: true,
      };
      if (onSendGroupMessage) {
        onSendGroupMessage(activeGroup.id, newGroupMsg);
      }
    }
    setTextInput('');
  };

  const handleSendMedia = (mediaType: 'image' | 'video') => {
    const url =
      mediaType === 'image'
        ? '/src/assets/images/liberal_moment_art_1790885781551.jpg'
        : '/src/assets/images/venue_lounge_meet_1790885792094.jpg';

    if (chatMode === 'direct') {
      if (!activeConversation) return;
      const newMsg: Message = {
        id: `media_${Date.now()}`,
        senderId: currentUser.id,
        mediaUrl: url,
        mediaType,
        isSelfDestruct: isSelfDestructActive,
        destructTimerSec: isSelfDestructActive ? 10 : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        e2eeVerified: true,
      };
      onSendMessage(activeConversation.id, newMsg);
      setIsSelfDestructActive(false);
    } else {
      if (!activeGroup) return;
      const newGroupMsg: GroupMessage = {
        id: `gm_media_${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatarUrl,
        senderRole: 'Membro',
        mediaUrl: url,
        mediaType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        e2eeVerified: true,
      };
      if (onSendGroupMessage) {
        onSendGroupMessage(activeGroup.id, newGroupMsg);
      }
    }
  };

  const handleSendAudioNote = () => {
    setIsRecordingAudio(false);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (chatMode === 'direct') {
      if (!activeConversation) return;
      const newMsg: Message = {
        id: `audio_${Date.now()}`,
        senderId: currentUser.id,
        mediaType: 'audio',
        durationSec: Math.max(recordingSeconds, 3),
        timestamp: time,
        e2eeVerified: true,
      };
      onSendMessage(activeConversation.id, newMsg);
    } else {
      if (!activeGroup) return;
      const newGroupMsg: GroupMessage = {
        id: `gm_audio_${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatarUrl,
        senderRole: 'Membro',
        mediaType: 'audio',
        timestamp: time,
        e2eeVerified: true,
      };
      if (onSendGroupMessage) {
        onSendGroupMessage(activeGroup.id, newGroupMsg);
      }
    }
    setRecordingSeconds(0);
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim() || !onCreateGroup) return;

    onCreateGroup({
      title: newGroupTitle.trim(),
      category: newGroupCategory,
      description: newGroupDescription.trim() || 'Comunidade privada com criptografia de ponta a ponta.',
      avatarUrl: '/src/assets/images/venue_lounge_meet_1790885792094.jpg',
      isPrivate: true,
      tags: newGroupTags.split(',').map((t) => t.trim()).filter(Boolean),
      rules: newGroupRules.split('\n').map((r) => r.trim()).filter(Boolean),
    });

    setShowCreateGroupModal(false);
    setNewGroupTitle('');
    setNewGroupDescription('');
  };

  // Filtered lists
  const filteredConversations = conversations.filter((c) => {
    const name = c.isBlindMatch && !c.isUnmasked ? c.participant.blindMatchInfo.maskedAlias : c.participant.name;
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredGroups = groups.filter((g) => {
    const matchesCategory = groupCategoryFilter === 'Todos' || g.category === groupCategoryFilter;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalDirectUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const totalGroupUnread = groups.reduce((acc, g) => acc + (g.isJoined ? g.unreadCount || 0 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8.5rem)] md:h-[calc(100vh-5.5rem)] flex flex-col bg-[#0b0d13] border-x border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header & Sub-Tab Switcher: Conversas Privadas vs Grupos */}
      <div className="bg-[#10131d] border-b border-slate-800 p-2.5 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setChatMode('direct');
              setIsMobileViewingChat(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              chatMode === 'direct'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Conversas Privadas (1 a 1)</span>
            {totalDirectUnread > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                {totalDirectUnread}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setChatMode('groups');
              setIsMobileViewingChat(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              chatMode === 'groups'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Grupos & Comunidades</span>
            {totalGroupUnread > 0 && (
              <span className="bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                {totalGroupUnread}
              </span>
            )}
          </button>
        </div>

        {chatMode === 'groups' && (
          <button
            type="button"
            onClick={() => setShowCreateGroupModal(true)}
            className="px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-200 border border-violet-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Criar Grupo Privado</span>
            <span className="sm:hidden">Criar</span>
          </button>
        )}
      </div>

      {/* Main Split Layout: Left List Column + Right Active Chat Column */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: LIST OF CONVERSATIONS OR GROUPS */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-800/80 flex flex-col bg-[#0d1018] shrink-0 ${
            isMobileViewingChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-800/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={chatMode === 'direct' ? 'Buscar conversas privadas...' : 'Buscar grupos privados...'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Category Filter Chips for Groups */}
            {chatMode === 'groups' && (
              <div className="flex items-center gap-1 overflow-x-auto pt-2 no-scrollbar">
                {['Todos', 'Clube Exclusivo', 'BDSM & Fetiche', 'Encontros & Lifestyle', 'Gastronomia & Vinhos'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGroupCategoryFilter(cat)}
                    className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border transition-all ${
                      groupCategoryFilter === cat
                        ? 'bg-violet-500/20 border-violet-500 text-violet-200 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* List Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {chatMode === 'direct' ? (
              /* DIRECT CONVERSATIONS LIST */
              filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  Nenhuma conversa privada encontrada.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedConvId;
                  const isMasked = conv.isBlindMatch && !conv.isUnmasked;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => {
                        setSelectedConvId(conv.id);
                        setIsMobileViewingChat(true);
                      }}
                      className={`w-full p-3.5 flex items-start gap-3 transition-colors text-left ${
                        isSelected
                          ? 'bg-rose-950/20 border-l-2 border-rose-500'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                          {isMasked ? (
                            <div className="w-full h-full bg-violet-950/80 flex items-center justify-center text-violet-300">
                              <EyeOff className="w-5 h-5" />
                            </div>
                          ) : (
                            <img
                              src={conv.participant.avatarUrl}
                              alt={conv.participant.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        {conv.participant.isVerified && (
                          <span className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 text-black">
                            <ShieldCheck className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-bold text-white truncate">
                            {isMasked ? conv.participant.blindMatchInfo.maskedAlias : conv.participant.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 truncate">
                          {conv.lastMessage}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-800/40">
                            {conv.matchScore}% afinidade
                          </span>
                          {isMasked && (
                            <span className="text-[9px] text-violet-300 bg-violet-950/50 px-1.5 py-0.2 rounded border border-violet-800/40">
                              Às Cegas
                            </span>
                          )}
                          {conv.unreadCount > 0 && (
                            <span className="ml-auto bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )
            ) : (
              /* GROUPS LIST */
              filteredGroups.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  Nenhum grupo encontrado nesta categoria.
                </div>
              ) : (
                filteredGroups.map((grp) => {
                  const isSelected = grp.id === selectedGroupId;
                  return (
                    <button
                      key={grp.id}
                      type="button"
                      onClick={() => {
                        setSelectedGroupId(grp.id);
                        setIsMobileViewingChat(true);
                      }}
                      className={`w-full p-3.5 flex items-start gap-3 transition-colors text-left ${
                        isSelected
                          ? 'bg-violet-950/20 border-l-2 border-violet-500'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                        <img
                          src={grp.avatarUrl}
                          alt={grp.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <span className="truncate">{grp.title}</span>
                            <Lock className="w-2.5 h-2.5 text-violet-400 shrink-0" />
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            {grp.lastMessageTime}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 truncate">
                          <strong className="text-slate-300">{grp.lastMessageSender}: </strong>
                          {grp.lastMessage}
                        </p>

                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-violet-300 bg-violet-950/60 px-1.5 py-0.2 rounded border border-violet-800/40">
                              {grp.category}
                            </span>
                            <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                              <Users className="w-2.5 h-2.5" />
                              {grp.membersCount}
                            </span>
                          </div>

                          {grp.isJoined ? (
                            <span className="text-[9px] text-emerald-400 font-bold">Participando</span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onJoinGroup) onJoinGroup(grp.id);
                              }}
                              className="text-[9px] px-2 py-0.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-md shadow"
                            >
                              Entrar
                            </button>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT CONVERSATION OR GROUP */}
        <div
          className={`flex-1 flex flex-col bg-[#0b0d13] ${
            !isMobileViewingChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {chatMode === 'direct' ? (
            /* DIRECT CHAT VIEW */
            activeConversation ? (
              <>
                {/* Direct Chat Header */}
                <div className="p-3 bg-[#10131d] border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <button
                      type="button"
                      onClick={() => setIsMobileViewingChat(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                        {activeConversation.isBlindMatch && !activeConversation.isUnmasked ? (
                          <div className="w-full h-full bg-violet-950 flex items-center justify-center text-violet-300">
                            <EyeOff className="w-4 h-4" />
                          </div>
                        ) : (
                          <img
                            src={activeConversation.participant.avatarUrl}
                            alt={activeConversation.participant.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {activeConversation.participant.isVerified && (
                        <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 text-black">
                          <ShieldCheck className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-white">
                          {activeConversation.isBlindMatch && !activeConversation.isUnmasked
                            ? activeConversation.participant.blindMatchInfo.maskedAlias
                            : activeConversation.participant.name}
                        </h3>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {activeConversation.matchScore}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Lock className="w-2.5 h-2.5 text-emerald-400" />
                        <span>E2EE ponta a ponta</span>
                        <span>·</span>
                        <span>{activeConversation.participant.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Audio, Video, Report */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onStartCall(activeConversation.participant, 'audio')}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Chamada de Voz E2EE"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartCall(activeConversation.participant, 'video')}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Chamada de Vídeo E2EE"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenReport(activeConversation.participant)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      title="Denunciar"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Blind Match Unmask Banner */}
                {activeConversation.isBlindMatch && !activeConversation.isUnmasked && (
                  <div className="bg-violet-950/40 border-b border-violet-800/40 p-2.5 px-4 flex items-center justify-between text-xs shrink-0">
                    <div className="flex items-center gap-2 text-violet-300">
                      <EyeOff className="w-4 h-4 shrink-0" />
                      <span className="text-[11px]">
                        Conexão às Cegas: fotos ocultas. Deseja revelar mutuamente?
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRevealBlindMatch(activeConversation.id)}
                      className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-[11px] shrink-0 ml-2"
                    >
                      Revelar Mútuo
                    </button>
                  </div>
                )}

                {/* Direct Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="text-center py-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      Canal Privado 1:1 protegido com Criptografia E2EE
                    </span>
                  </div>

                  {activeConversation.messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    const isRevealed = revealedEphemeralMedia.includes(msg.id);

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs relative ${
                            isMe
                              ? 'bg-rose-600 text-white rounded-tr-sm'
                              : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-sm'
                          }`}
                        >
                          {/* Ephemeral self-destruct media */}
                          {msg.isSelfDestruct && msg.mediaUrl ? (
                            <div className="space-y-1.5">
                              {!isRevealed ? (
                                <button
                                  type="button"
                                  onClick={() => setRevealedEphemeralMedia((prev) => [...prev, msg.id])}
                                  className="flex items-center gap-2 p-2 bg-black/40 rounded-xl text-rose-300 border border-rose-500/30"
                                >
                                  <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                                  <span className="font-semibold text-[11px]">
                                    Toque para ver foto efêmera (10s)
                                  </span>
                                </button>
                              ) : (
                                <div className="space-y-1">
                                  <img
                                    src={msg.mediaUrl}
                                    alt="Mídia efêmera"
                                    className="rounded-xl max-h-48 w-full object-cover"
                                  />
                                  <span className="text-[9px] text-rose-200 flex items-center gap-1 font-mono">
                                    <Flame className="w-3 h-3" /> Auto-destruição em 10s
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : msg.mediaUrl ? (
                            <img
                              src={msg.mediaUrl}
                              alt="Mídia compartilhada"
                              className="rounded-xl max-h-48 w-full object-cover mb-1.5"
                            />
                          ) : null}

                          {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                          {msg.mediaType === 'audio' && (
                            <div className="flex items-center gap-2 py-1">
                              <Mic className="w-4 h-4" />
                              <span className="font-mono text-[11px]">Mensagem de voz ({msg.durationSec}s)</span>
                            </div>
                          )}

                          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-75 font-mono">
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-500 text-xs">
                Selecione uma conversa ao lado para iniciar.
              </div>
            )
          ) : (
            /* GROUP CHAT VIEW */
            activeGroup ? (
              <>
                {/* Group Chat Header */}
                <div className="p-3 bg-[#10131d] border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back */}
                    <button
                      type="button"
                      onClick={() => setIsMobileViewingChat(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                      <img
                        src={activeGroup.avatarUrl}
                        alt={activeGroup.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{activeGroup.title}</span>
                          <Lock className="w-3 h-3 text-violet-400" />
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="text-violet-300">{activeGroup.category}</span>
                        <span>·</span>
                        <span>{activeGroup.membersCount} participantes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowGroupRulesModal(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5 text-violet-400" />
                      <span className="hidden sm:inline">Regras & Membros</span>
                    </button>
                    {!activeGroup.isJoined && (
                      <button
                        type="button"
                        onClick={() => onJoinGroup && onJoinGroup(activeGroup.id)}
                        className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow"
                      >
                        Participar
                      </button>
                    )}
                  </div>
                </div>

                {/* Group Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  <div className="text-center py-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-800/40 text-[10px] text-violet-300 font-mono">
                      <Lock className="w-3 h-3 text-violet-400" />
                      Grupo com Encriptação E2EE Multilateral e Sigilo
                    </span>
                  </div>

                  {activeGroup.messages.map((gmsg) => {
                    const isMe = gmsg.senderId === currentUser.id;

                    return (
                      <div
                        key={gmsg.id}
                        className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Member Avatar */}
                        {!isMe && (
                          <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                            <img
                              src={gmsg.senderAvatar}
                              alt={gmsg.senderName}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className={`max-w-[85%] sm:max-w-md space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                          {/* Sender name & role badge */}
                          {!isMe && (
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="font-bold text-slate-300">{gmsg.senderName}</span>
                              {gmsg.senderRole && (
                                <span className="px-1.5 py-0.2 rounded bg-violet-950/80 border border-violet-800/40 text-[9px] text-violet-300 font-mono">
                                  {gmsg.senderRole}
                                </span>
                              )}
                            </div>
                          )}

                          <div
                            className={`p-3 rounded-2xl text-xs ${
                              isMe
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm'
                                : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-sm'
                            }`}
                          >
                            {gmsg.mediaUrl && (
                              <img
                                src={gmsg.mediaUrl}
                                alt="Mídia de grupo"
                                className="rounded-xl max-h-48 w-full object-cover mb-1.5"
                              />
                            )}

                            {gmsg.text && <p className="leading-relaxed">{gmsg.text}</p>}

                            {gmsg.mediaType === 'audio' && (
                              <div className="flex items-center gap-2 py-1">
                                <Mic className="w-4 h-4" />
                                <span className="font-mono text-[11px]">Áudio no Grupo</span>
                              </div>
                            )}

                            <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-75 font-mono">
                              <span>{gmsg.timestamp}</span>
                              <Lock className="w-2.5 h-2.5 text-emerald-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-500 text-xs">
                Selecione um grupo ao lado para abrir.
              </div>
            )
          )}

          {/* Bottom Input Bar (Shared by Direct & Groups) */}
          <div className="p-3 bg-[#10131d] border-t border-slate-800 shrink-0">
            {isRecordingAudio ? (
              <div className="flex items-center justify-between bg-rose-950/40 border border-rose-500/40 rounded-2xl p-2.5 px-4 text-xs">
                <div className="flex items-center gap-2 text-rose-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono font-bold">Gravando Áudio E2EE... 0:0{recordingSeconds}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRecordingAudio(false)}
                    className="px-3 py-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSendAudioNote}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Self-destruct toggle (active in direct) */}
                {chatMode === 'direct' && (
                  <button
                    type="button"
                    onClick={() => setIsSelfDestructActive(!isSelfDestructActive)}
                    className={`p-2 rounded-xl border transition-all ${
                      isSelfDestructActive
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Mídia de Visualização Única"
                  >
                    <Flame className="w-4 h-4" />
                  </button>
                )}

                {/* Media button */}
                <button
                  type="button"
                  onClick={() => handleSendMedia('image')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Enviar Mídia Criptografada"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTextMessage()}
                  placeholder={
                    chatMode === 'direct'
                      ? 'Mensagem privada ponta a ponta...'
                      : `Conversar em "${activeGroup?.title || 'Grupo'}"...`
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                />

                {/* Mic */}
                <button
                  type="button"
                  onClick={() => setIsRecordingAudio(true)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Gravar Áudio Protegido"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Send */}
                <button
                  type="button"
                  onClick={handleSendTextMessage}
                  disabled={!textInput.trim()}
                  className={`p-2.5 rounded-xl transition-all shadow-md ${
                    chatMode === 'direct'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/20'
                  } disabled:opacity-40`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: CRIAR NOVO GRUPO PRIVADO */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10131d] border border-violet-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" />
                <h3 className="text-sm font-bold text-white font-display">Criar Grupo ou Confraria Privada</h3>
              </div>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Título do Grupo:</label>
                <input
                  type="text"
                  required
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="Ex: Confraria do Vinho & Jazz SP"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Categoria:</label>
                <select
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="Clube Exclusivo">Clube Exclusivo</option>
                  <option value="BDSM & Fetiche">BDSM & Fetiche</option>
                  <option value="Encontros & Lifestyle">Encontros & Lifestyle</option>
                  <option value="Gastronomia & Vinhos">Gastronomia & Vinhos</option>
                  <option value="Artes & Festas">Artes & Festas</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Descrição & Propósito:</label>
                <textarea
                  rows={2}
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Explique o tema do grupo e critérios de acolhimento..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Regras & Diretrizes (1 por linha):</label>
                <textarea
                  rows={2}
                  value={newGroupRules}
                  onChange={(e) => setNewGroupRules(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 resize-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Tags (separadas por vírgula):</label>
                <input
                  type="text"
                  value={newGroupTags}
                  onChange={(e) => setNewGroupTags(e.target.value)}
                  placeholder="SP-Jardins, Rooftop, E2EE"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow"
                >
                  Criar e Abrir Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGRAS E MEMBROS DO GRUPO */}
      {showGroupRulesModal && activeGroup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10131d] border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-violet-400" />
                <h3 className="text-sm font-bold text-white font-display">Sobre o Grupo</h3>
              </div>
              <button
                onClick={() => setShowGroupRulesModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Descrição
                </span>
                <p className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                  {activeGroup.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Regras de Convivência & Segurança
                </span>
                <ul className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 list-disc list-inside text-[11px] text-slate-300">
                  {activeGroup.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Tags & Afinidades
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeGroup.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-violet-950/60 text-violet-300 border border-violet-800/40 text-[10px] font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGroupRulesModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
