'use client';
import { useState } from 'react';
import styles from '../dashboard/dashboard.module.css';
import { HOST_MESSAGES } from '@/lib/host-demo-data';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';

export default function MessagesPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selectedMessage = HOST_MESSAGES.find(m => m.id === selectedId);

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: '#fff' }}>

            {/* LEFT SIDEBAR: Conversation List */}
            <div style={{ width: '350px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
                    <h1 className={styles.title} style={{ fontSize: '24px' }}>Messages</h1>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {HOST_MESSAGES.map(msg => (
                        <div
                            key={msg.id}
                            onClick={() => setSelectedId(msg.id)}
                            style={{
                                padding: '16px 24px',
                                borderBottom: '1px solid #f9fafb',
                                cursor: 'pointer',
                                background: selectedId === msg.id ? '#f0f9ff' : 'transparent',
                                borderLeft: selectedId === msg.id ? '4px solid #000' : '4px solid transparent'
                            }}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                                <div className={styles.avatar} style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                                    {msg.avatar ? (
                                        <img src={msg.avatar} alt={msg.renterName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        msg.renterName.charAt(0)
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{msg.renterName}</span>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{msg.time}</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {msg.listingTitle}
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '14px', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                                {msg.snippet}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT MAIN AREA: Conversation Detail */}
            <div style={{ flex: 1, background: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
                {selectedMessage ? (
                    <>
                        {/* Chat Header */}
                        <div style={{ height: '73px', background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className={styles.avatar} style={{ width: '40px', height: '40px' }}>
                                    {selectedMessage.avatar ? (
                                        <img src={selectedMessage.avatar} alt={selectedMessage.renterName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        selectedMessage.renterName.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{selectedMessage.renterName}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Inquiry for: {selectedMessage.listingTitle}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', color: '#6b7280' }}>
                                <button><Phone size={20} /></button>
                                <button><Video size={20} /></button>
                                <button><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Chat Content (Scrollable) */}
                        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Mock Message Bubbles */}
                            <div style={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
                                <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '12px 12px 12px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontSize: '15px', color: '#1f2937', lineHeight: '1.5' }}>
                                    {selectedMessage.snippet}
                                </div>
                                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', marginLeft: '4px' }}>{selectedMessage.time}</div>
                            </div>

                            {/* Mock Reply if needed */}
                            {selectedMessage.status !== 'New' && (
                                <div style={{ alignSelf: 'flex-end', maxWidth: '70%' }}>
                                    <div style={{ background: '#000', color: '#fff', padding: '12px 16px', borderRadius: '12px 12px 0 12px', fontSize: '15px', lineHeight: '1.5' }}>
                                        Thanks for reaching out! Yes, it is still available. Would you like to schedule a viewing?
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', textAlign: 'right', marginRight: '4px' }}>Just now</div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div style={{ padding: '24px', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', background: '#f3f4f6', padding: '12px', borderRadius: '12px' }}>
                                <textarea
                                    placeholder="Type a message..."
                                    style={{ flex: 1, background: 'transparent', border: 'none', resize: 'none', height: '24px', maxHeight: '100px', padding: 0, outline: 'none', fontSize: '15px' }}
                                />
                                <button style={{ color: '#000' }}><Send size={20} /></button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Send size={24} color="#d1d5db" />
                        </div>
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
