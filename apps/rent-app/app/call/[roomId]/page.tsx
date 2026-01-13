'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getVideoCallTokenAction, startVideoCallAction, endVideoCallAction, getVideoCallAction } from '@/actions/video-call';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MessageSquare, Users } from 'lucide-react';
import styles from './call.module.css';

declare global {
  interface Window {
    DailyIframe: {
      createFrame: (container: HTMLElement, options?: object) => DailyCall;
    };
  }
}

interface DailyCall {
  join: (options: { url: string; token: string }) => Promise<void>;
  leave: () => void;
  destroy: () => void;
  participants: () => Record<string, DailyParticipant>;
  setLocalVideo: (enabled: boolean) => void;
  setLocalAudio: (enabled: boolean) => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
  on: (event: string, callback: (event?: DailyEvent) => void) => void;
}

interface DailyParticipant {
  user_id: string;
  user_name: string;
  local: boolean;
  video: boolean;
  audio: boolean;
  screen: boolean;
}

interface DailyEvent {
  participant?: DailyParticipant;
  action?: string;
}

type CallStatus = 'loading' | 'joining' | 'in-call' | 'ended' | 'error';

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const callId = params.roomId as string;

  const [status, setStatus] = useState<CallStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [callFrame, setCallFrame] = useState<DailyCall | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [callDetails, setCallDetails] = useState<{
    isHost: boolean;
    conversationId: string;
  } | null>(null);

  // Load Daily.co script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize the call
  useEffect(() => {
    let frame: DailyCall | null = null;

    const initCall = async () => {
      try {
        // Get call details
        const detailsResult = await getVideoCallAction(callId);
        if (!detailsResult.success) {
          setError(detailsResult.error);
          setStatus('error');
          return;
        }

        setCallDetails({
          isHost: detailsResult.data!.isHost,
          conversationId: detailsResult.data!.conversationId,
        });

        // Get meeting token
        const tokenResult = await getVideoCallTokenAction(callId);
        if (!tokenResult.success) {
          setError(tokenResult.error);
          setStatus('error');
          return;
        }

        // Wait for Daily script to load
        while (!window.DailyIframe) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setStatus('joining');

        // Create the call frame
        const container = document.getElementById('call-container');
        if (!container) {
          setError('Call container not found');
          setStatus('error');
          return;
        }

        frame = window.DailyIframe.createFrame(container, {
          showLeaveButton: false,
          showFullscreenButton: true,
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '12px',
          },
        });

        // Set up event listeners
        frame.on('joined-meeting', () => {
          setStatus('in-call');
          // If host, mark call as started
          if (detailsResult.data!.isHost) {
            startVideoCallAction(callId);
          }
        });

        frame.on('participant-joined', () => {
          updateParticipantCount(frame);
        });

        frame.on('participant-left', () => {
          updateParticipantCount(frame);
        });

        frame.on('left-meeting', () => {
          setStatus('ended');
        });

        frame.on('error', () => {
          setError('An error occurred during the call');
          setStatus('error');
        });

        // Join the call
        await frame.join({
          url: tokenResult.data!.roomUrl,
          token: tokenResult.data!.token,
        });

        setCallFrame(frame);
        updateParticipantCount(frame);
      } catch (err) {
        console.error('Failed to initialize call:', err);
        setError('Failed to join the video call');
        setStatus('error');
      }
    };

    const updateParticipantCount = (f: DailyCall | null) => {
      if (f) {
        const participants = f.participants();
        setParticipantCount(Object.keys(participants).length);
      }
    };

    initCall();

    return () => {
      if (frame) {
        frame.destroy();
      }
    };
  }, [callId]);

  const toggleVideo = useCallback(() => {
    if (callFrame) {
      const newState = !isVideoOn;
      callFrame.setLocalVideo(newState);
      setIsVideoOn(newState);
    }
  }, [callFrame, isVideoOn]);

  const toggleAudio = useCallback(() => {
    if (callFrame) {
      const newState = !isAudioOn;
      callFrame.setLocalAudio(newState);
      setIsAudioOn(newState);
    }
  }, [callFrame, isAudioOn]);

  const toggleScreenShare = useCallback(() => {
    if (callFrame) {
      if (isScreenSharing) {
        callFrame.stopScreenShare();
      } else {
        callFrame.startScreenShare();
      }
      setIsScreenSharing(!isScreenSharing);
    }
  }, [callFrame, isScreenSharing]);

  const handleLeave = useCallback(async () => {
    if (callFrame) {
      callFrame.leave();
    }

    // End the call if host
    if (callDetails?.isHost) {
      await endVideoCallAction(callId);
    }

    setStatus('ended');
  }, [callFrame, callDetails, callId]);

  const goToMessages = useCallback(() => {
    if (callDetails?.conversationId) {
      router.push(`/messages/${callDetails.conversationId}`);
    } else {
      router.push('/messages');
    }
  }, [router, callDetails]);

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Preparing your video call...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.errorContainer}>
        <h2>Unable to Join Call</h2>
        <p>{error || 'An unexpected error occurred'}</p>
        <button onClick={goToMessages} className={styles.returnBtn}>
          Return to Messages
        </button>
      </div>
    );
  }

  if (status === 'ended') {
    return (
      <div className={styles.endedContainer}>
        <h2>Call Ended</h2>
        <p>Thank you for using Nivaesa video calls.</p>
        <button onClick={goToMessages} className={styles.returnBtn}>
          Return to Messages
        </button>
      </div>
    );
  }

  return (
    <div className={styles.callPage}>
      {/* Call Container */}
      <div id="call-container" className={styles.callContainer}>
        {status === 'joining' && (
          <div className={styles.joiningOverlay}>
            <div className={styles.spinner}></div>
            <p>Joining call...</p>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.controlsLeft}>
          <span className={styles.participantCount}>
            <Users size={18} />
            {participantCount}
          </span>
        </div>

        <div className={styles.controlsCenter}>
          <button
            onClick={toggleAudio}
            className={`${styles.controlBtn} ${!isAudioOn ? styles.off : ''}`}
            title={isAudioOn ? 'Mute' : 'Unmute'}
          >
            {isAudioOn ? <Mic size={22} /> : <MicOff size={22} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`${styles.controlBtn} ${!isVideoOn ? styles.off : ''}`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`${styles.controlBtn} ${isScreenSharing ? styles.active : ''}`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            <Monitor size={22} />
          </button>

          <button onClick={handleLeave} className={`${styles.controlBtn} ${styles.leaveBtn}`} title="Leave call">
            <PhoneOff size={22} />
          </button>
        </div>

        <div className={styles.controlsRight}>
          <button onClick={goToMessages} className={styles.chatBtn} title="Open chat">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
