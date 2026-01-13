/**
 * Daily.co Video Call Integration
 *
 * This module handles the integration with Daily.co for in-platform video calls.
 * Daily.co provides embedded video call functionality with room management.
 *
 * Environment variables required:
 * - DAILY_API_KEY: Your Daily.co API key
 * - DAILY_DOMAIN: Your Daily.co domain (e.g., nivaesa.daily.co)
 */

const DAILY_API_URL = 'https://api.daily.co/v1';

interface DailyRoom {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config: {
    max_participants?: number;
    exp?: number;
    eject_at_room_exp?: boolean;
    enable_chat?: boolean;
    enable_screenshare?: boolean;
    start_video_off?: boolean;
    start_audio_off?: boolean;
  };
}

interface DailyMeetingToken {
  token: string;
}

interface CreateRoomOptions {
  name?: string;
  /** Room expiry in seconds from now (default: 1 hour) */
  expirySeconds?: number;
  maxParticipants?: number;
  enableChat?: boolean;
  enableScreenshare?: boolean;
}

interface CreateTokenOptions {
  roomName: string;
  userId: string;
  userName: string;
  /** Token expiry in seconds from now (default: 1 hour) */
  expirySeconds?: number;
  isOwner?: boolean;
}

/**
 * Get Daily API headers
 */
function getHeaders(): HeadersInit {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) {
    throw new Error('DAILY_API_KEY environment variable is not set');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
}

/**
 * Create a new Daily.co room for a video call
 */
export async function createRoom(options: CreateRoomOptions = {}): Promise<DailyRoom> {
  const {
    name,
    expirySeconds = 3600, // 1 hour default
    maxParticipants = 2,
    enableChat = true,
    enableScreenshare = true,
  } = options;

  const exp = Math.floor(Date.now() / 1000) + expirySeconds;

  const response = await fetch(`${DAILY_API_URL}/rooms`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      name,
      properties: {
        max_participants: maxParticipants,
        exp,
        eject_at_room_exp: true,
        enable_chat: enableChat,
        enable_screenshare: enableScreenshare,
        start_video_off: false,
        start_audio_off: false,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Failed to create Daily room: ${error.error || response.statusText}`);
  }

  return response.json();
}

/**
 * Get a Daily.co room by name
 */
export async function getRoom(roomName: string): Promise<DailyRoom | null> {
  const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Failed to get Daily room: ${error.error || response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a Daily.co room
 */
export async function deleteRoom(roomName: string): Promise<void> {
  const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok && response.status !== 404) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Failed to delete Daily room: ${error.error || response.statusText}`);
  }
}

/**
 * Create a meeting token for a user to join a room
 *
 * Tokens are used to authenticate users and can include permissions
 */
export async function createMeetingToken(options: CreateTokenOptions): Promise<string> {
  const { roomName, userId, userName, expirySeconds = 3600, isOwner = false } = options;

  const exp = Math.floor(Date.now() / 1000) + expirySeconds;

  const response = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_id: userId,
        user_name: userName,
        exp,
        is_owner: isOwner,
        enable_screenshare: true,
        start_video_off: false,
        start_audio_off: false,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Failed to create meeting token: ${error.error || response.statusText}`);
  }

  const data: DailyMeetingToken = await response.json();
  return data.token;
}

/**
 * Generate a unique room name based on conversation or connection
 */
export function generateRoomName(contextType: string, contextId: string): string {
  const timestamp = Date.now().toString(36);
  const sanitizedType = contextType.replace(/[^a-z0-9]/gi, '');
  const sanitizedId = contextId.replace(/[^a-z0-9]/gi, '').substring(0, 8);
  return `${sanitizedType}-${sanitizedId}-${timestamp}`;
}

/**
 * Get the full room URL for embedding or sharing
 */
export function getRoomUrl(roomName: string): string {
  const domain = process.env.DAILY_DOMAIN || 'nivaesa';
  return `https://${domain}.daily.co/${roomName}`;
}

/**
 * Check if Daily.co is configured
 */
export function isDailyConfigured(): boolean {
  return !!process.env.DAILY_API_KEY;
}
