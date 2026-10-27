import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Volume2, VolumeX, Disc3 } from 'lucide-react';

interface MusicPlayerProps {
  customAudioUrl?: string;
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
}

interface YouTubePlayerEvent {
  data: number;
}

interface YouTubeApi {
  Player: new (
    element: HTMLIFrameElement,
    options: {
      events: {
        onReady: () => void;
        onStateChange: (event: YouTubePlayerEvent) => void;
        onError: (event: YouTubePlayerEvent) => void;
      };
    }
  ) => YouTubePlayer;
}

type YouTubeWindow = Window & {
  YT?: YouTubeApi;
  onYouTubeIframeAPIReady?: () => void;
};

export interface MusicPlayerHandle {
  play: () => void;
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  ({ customAudioUrl = '/audio/kusuma-wijaya.mp3' }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const pendingYouTubePlayRef = useRef(false);
  const youtubeVideoId = customAudioUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]+)/
  )?.[1];

  const sendYouTubeCommand = (func: 'playVideo' | 'pauseVideo') => {
    if (func === 'playVideo') {
      youtubePlayerRef.current?.playVideo();
    } else {
      youtubePlayerRef.current?.pauseVideo();
    }
  };

  useEffect(() => {
    const audio = youtubeVideoId ? null : new Audio(customAudioUrl);
    if (audio) {
      audio.loop = true;
      audio.preload = 'auto';
    }
    audioRef.current = audio;
    pendingYouTubePlayRef.current = false;
    setIsPlaying(false);

    return () => {
      audio?.pause();
      audioRef.current = null;
    };
  }, [customAudioUrl, youtubeVideoId]);

  useEffect(() => {
    if (!youtubeVideoId) return;

    const youtubeWindow = window as YouTubeWindow;
    let cancelled = false;
    const previousReadyCallback = youtubeWindow.onYouTubeIframeAPIReady;

    const createPlayer = () => {
      if (cancelled || !iframeRef.current || !youtubeWindow.YT || youtubePlayerRef.current) return;

      youtubePlayerRef.current = new youtubeWindow.YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            if (pendingYouTubePlayRef.current) {
              sendYouTubeCommand('playVideo');
            }
          },
          onStateChange: (event) => {
            if (event.data === 1) {
              pendingYouTubePlayRef.current = false;
              setIsPlaying(true);
            } else if (event.data === 0 || event.data === 2 || event.data === -1) {
              pendingYouTubePlayRef.current = false;
              setIsPlaying(false);
            }
          },
          onError: (event) => {
            console.error('YouTube wedding music player failed:', event.data);
            pendingYouTubePlayRef.current = false;
            setIsPlaying(false);
          },
        },
      });
    };

    const handleApiReady = () => {
      previousReadyCallback?.();
      createPlayer();
    };

    youtubeWindow.onYouTubeIframeAPIReady = handleApiReady;
    if (youtubeWindow.YT) {
      createPlayer();
    } else if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        console.error('Unable to load the YouTube IFrame API.');
      };
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (youtubeWindow.onYouTubeIframeAPIReady === handleApiReady) {
        youtubeWindow.onYouTubeIframeAPIReady = previousReadyCallback;
      }
      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;
    };
  }, [youtubeVideoId]);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (youtubeVideoId) {
        pendingYouTubePlayRef.current = true;
        if (youtubePlayerRef.current) {
          sendYouTubeCommand('playVideo');
        }
        return;
      }

      const audio = audioRef.current;
      if (!audio) return;

      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error: unknown) => {
          setIsPlaying(false);
          console.error('Unable to play wedding music:', error);
        });
    },
  }), [youtubeVideoId]);

  const togglePlay = () => {
    if (youtubeVideoId) {
      if (isPlaying) {
        pendingYouTubePlayRef.current = false;
        sendYouTubeCommand('pauseVideo');
        setIsPlaying(false);
      } else {
        pendingYouTubePlayRef.current = true;
        if (youtubePlayerRef.current) {
          sendYouTubeCommand('playVideo');
        }
      }
      return;
    }

    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error: unknown) => {
          setIsPlaying(false);
          console.error('Unable to play wedding music:', error);
        });
    }
  };

  return (
    <div id="audio-container" className="fixed bottom-5 right-5 z-40 safe-bottom">
      {youtubeVideoId && (
        <iframe
          ref={iframeRef}
          id="wedding-youtube-player"
          title="Wedding background music"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&autoplay=0&loop=1&playlist=${youtubeVideoId}&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`}
          allow="autoplay; encrypted-media"
          className="absolute h-px w-px opacity-0 pointer-events-none"
        />
      )}
      <button
        onClick={togglePlay}
        className="relative w-11 h-11 rounded-full bg-[#632321] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-[#A05C57]"
        aria-label={isPlaying ? 'Pause song' : 'Play song'}
      >
        <Disc3
          className={`w-6 h-6 text-white ${isPlaying ? 'animate-wdp-spin' : ''}`}
        />
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[#632321] text-[9px] flex items-center justify-center shadow-xs"
        >
          {isPlaying ? <Volume2 className="w-2.5 h-2.5" /> : <VolumeX className="w-2.5 h-2.5" />}
        </span>
      </button>
    </div>
  );
  }
);

MusicPlayer.displayName = 'MusicPlayer';
