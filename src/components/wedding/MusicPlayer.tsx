import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Disc3 } from 'lucide-react';

interface MusicPlayerProps {
  customAudioUrl?: string;
  autoplay?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  customAudioUrl = '/audio/kusuma-wijaya.mp3',
  autoplay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const youtubeVideoId = customAudioUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]+)/
  )?.[1];

  useEffect(() => {
    if (youtubeVideoId) {
      setIsPlaying(autoplay);
      return;
    }

    const audio = new Audio(customAudioUrl);
    audio.loop = true;
    audioRef.current = audio;

    if (autoplay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
    };
  }, [customAudioUrl, autoplay, youtubeVideoId]);

  const togglePlay = () => {
    if (youtubeVideoId) {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: isPlaying ? 'pauseVideo' : 'playVideo',
          args: [],
        }),
        'https://www.youtube.com'
      );
      setIsPlaying((playing) => !playing);
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
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <div id="audio-container" className="fixed bottom-5 right-5 z-40 safe-bottom">
      {youtubeVideoId && (
        <iframe
          ref={iframeRef}
          title="Wedding background music"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&autoplay=${autoplay ? 1 : 0}&loop=1&playlist=${youtubeVideoId}&playsinline=1`}
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
};
