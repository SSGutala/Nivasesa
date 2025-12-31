'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageCircle, Search, User, ChevronLeft } from 'lucide-react'
import {
  getConversationsAction,
  getMessagesAction,
  sendMessageAction,
  markMessagesReadAction,
  type ConversationWithDetails,
  type MessageWithSender,
} from '@/actions/messaging'
import styles from './page.module.css'

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationParam = searchParams.get('conversation')

  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    conversationParam
  )
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      const result = await getConversationsAction()
      if (result.success && result.conversations) {
        setConversations(result.conversations)
      }
      setLoading(false)
    }
    loadConversations()
  }, [])

  // Load messages when conversation changes
  useEffect(() => {
    async function loadMessages() {
      if (!selectedConversation) {
        setMessages([])
        return
      }

      const result = await getMessagesAction(selectedConversation)
      if (result.success && result.messages) {
        setMessages(result.messages)
        // Mark messages as read
        await markMessagesReadAction(selectedConversation)
        // Update unread count in conversation list
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConversation ? { ...c, unreadCount: 0 } : c))
        )
      }
    }
    loadMessages()
  }, [selectedConversation])

  // Handle send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConversation || !newMessage.trim() || sending) return

    setSending(true)
    const result = await sendMessageAction(selectedConversation, newMessage)
    if (result.success && result.message) {
      setMessages((prev) => [...prev, result.message!])
      setNewMessage('')
      // Update last message in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation
            ? {
                ...c,
                lastMessage: {
                  content: result.message!.content,
                  createdAt: result.message!.createdAt,
                  senderId: result.message!.senderId,
                },
                lastMessageAt: result.message!.createdAt,
              }
            : c
        )
      )
    }
    setSending(false)
  }

  // Filter conversations by search
  const filteredConversations = conversations.filter(
    (c) =>
      c.otherParticipant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.otherParticipant.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get selected conversation details
  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  const formatTime = (date: Date) => {
    const now = new Date()
    const d = new Date(date)
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return d.toLocaleDateString([], { weekday: 'short' })
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading messages...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.messagesLayout}>
        {/* Conversation List */}
        <div
          className={`${styles.sidebar} ${selectedConversation ? styles.hideMobile : ''}`}
        >
          <div className={styles.sidebarHeader}>
            <h1>Messages</h1>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.conversationList}>
            {filteredConversations.length === 0 ? (
              <div className={styles.empty}>
                <MessageCircle size={48} />
                <p>No conversations yet</p>
                <span>Start a conversation by contacting a realtor</span>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`${styles.conversationItem} ${selectedConversation === conv.id ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedConversation(conv.id)
                    router.push(`/messages?conversation=${conv.id}`, { scroll: false })
                  }}
                >
                  <div className={styles.avatar}>
                    {conv.otherParticipant.image ? (
                      <img
                        src={conv.otherParticipant.image}
                        alt={conv.otherParticipant.name || ''}
                      />
                    ) : (
                      <User size={24} />
                    )}
                    {conv.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>{conv.unreadCount}</span>
                    )}
                  </div>
                  <div className={styles.conversationInfo}>
                    <div className={styles.nameRow}>
                      <span className={styles.name}>
                        {conv.otherParticipant.name || conv.otherParticipant.email}
                      </span>
                      {conv.lastMessage && (
                        <span className={styles.time}>
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className={styles.roleRow}>
                      <span className={styles.role}>
                        {conv.otherParticipant.role === 'REALTOR' ? 'Realtor' : 'Buyer'}
                      </span>
                    </div>
                    {conv.lastMessage && (
                      <p className={styles.preview}>{conv.lastMessage.content}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Area */}
        <div
          className={`${styles.messageArea} ${!selectedConversation ? styles.hideMobile : ''}`}
        >
          {selectedConversation && currentConversation ? (
            <>
              <div className={styles.messageHeader}>
                <button
                  className={styles.backButton}
                  onClick={() => {
                    setSelectedConversation(null)
                    router.push('/messages', { scroll: false })
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <div className={styles.headerAvatar}>
                  {currentConversation.otherParticipant.image ? (
                    <img
                      src={currentConversation.otherParticipant.image}
                      alt={currentConversation.otherParticipant.name || ''}
                    />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className={styles.headerInfo}>
                  <span className={styles.headerName}>
                    {currentConversation.otherParticipant.name ||
                      currentConversation.otherParticipant.email}
                  </span>
                  <span className={styles.headerRole}>
                    {currentConversation.otherParticipant.role === 'REALTOR'
                      ? 'Realtor'
                      : 'Buyer'}
                  </span>
                </div>
              </div>

              <div className={styles.messageList}>
                {messages.map((msg, index) => {
                  const isOwn = msg.senderId !== currentConversation.otherParticipant.id
                  const showDate =
                    index === 0 ||
                    new Date(msg.createdAt).toDateString() !==
                      new Date(messages[index - 1].createdAt).toDateString()

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className={styles.dateDivider}>
                          <span>
                            {new Date(msg.createdAt).toLocaleDateString([], {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                      <div
                        className={`${styles.message} ${isOwn ? styles.ownMessage : styles.otherMessage}`}
                      >
                        <div className={styles.messageContent}>{msg.content}</div>
                        <div className={styles.messageTime}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <form className={styles.messageInput} onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <button type="submit" disabled={!newMessage.trim() || sending}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.noSelection}>
              <MessageCircle size={64} />
              <h2>Select a conversation</h2>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
