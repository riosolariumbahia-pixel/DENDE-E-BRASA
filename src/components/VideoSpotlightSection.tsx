import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  Flame,
  Users,
  Tv,
  MessageCircle,
  MapPin,
  Utensils,
  Upload,
  RefreshCw,
  Info,
  Smartphone,
  CheckCircle2,
  Film
} from 'lucide-react';
import { RestaurantConfig } from '../types';
import { saveVideoFile, getSavedVideoUrl, clearSavedVideo } from '../lib/videoStorage';

interface VideoSpotlightSectionProps {
  config: RestaurantConfig;
  onUpdateVideoUrl?: (newUrl: string) => void;
  onScrollToMenu: () => void;
  onScrollToLocation: () => void;
}

export const VideoSpotlightSection: React.FC<VideoSpotlightSectionProps> = ({
  config,
  onUpdateVideoUrl,
  onScrollToMenu,
  onScrollToLocation
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(28);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isVerticalMode, setIsVerticalMode] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(
    config.videoUrl || '/dende-e-brasa-espaco.mp4'
  );

  // Check if there is a saved video in IndexedDB
  useEffect(() => {
    getSavedVideoUrl().then((savedUrl) => {
      if (savedUrl) {
        setCurrentVideoSrc(savedUrl);
        if (onUpdateVideoUrl) {
          onUpdateVideoUrl(savedUrl);
        }
      }
    });
  }, []);

  // Update if prop changes and no local override
  useEffect(() => {
    if (config.videoUrl && config.videoUrl !== currentVideoSrc) {
      setCurrentVideoSrc(config.videoUrl);
    }
  }, [config.videoUrl]);

  const chapters = [
    {
      id: 0,
      time: 0,
      title: 'Parrilla Brava & Espetinhos',
      desc: 'Brasas vivas, queijo coalho e espetinhos suculentos na grelha',
      icon: Flame,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 1,
      time: 4,
      title: 'Mesas ao Ar Livre',
      desc: 'Clima agradável, famílias, amigos e cerveja trincando de gelada',
      icon: Users,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 2,
      time: 16,
      title: 'Telão, Futebol & Luzes Bistrô',
      desc: 'Tenda coberta com torcida baiana assistindo ao jogo ao vivo',
      icon: Tv,
      color: 'from-red-500 to-amber-600'
    }
  ];

  // Sync state with HTML video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (bgVideoRef.current && Math.abs(bgVideoRef.current.currentTime - video.currentTime) > 0.3) {
        bgVideoRef.current.currentTime = video.currentTime;
      }
      // Determine active chapter
      if (video.currentTime >= 16) {
        setActiveChapter(2);
      } else if (video.currentTime >= 4) {
        setActiveChapter(1);
      } else {
        setActiveChapter(0);
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
      // Detect if video is portrait
      if (video.videoHeight > video.videoWidth) {
        setIsVerticalMode(true);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      bgVideoRef.current?.play().catch(() => {});
    };
    const handlePause = () => {
      setIsPlaying(false);
      bgVideoRef.current?.pause();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Attempt autoplay muted
    video.muted = true;
    video.play().catch(() => {
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentVideoSrc]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      bgVideoRef.current?.pause();
    } else {
      videoRef.current.play().catch(console.error);
      bgVideoRef.current?.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      if (bgVideoRef.current) bgVideoRef.current.currentTime = time;
    }
  };

  const jumpToChapter = (chapterTime: number, chapterIndex: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = chapterTime;
      if (bgVideoRef.current) bgVideoRef.current.currentTime = chapterTime;
      if (!isPlaying) {
        videoRef.current.play().catch(console.error);
        bgVideoRef.current?.play().catch(() => {});
      }
      setActiveChapter(chapterIndex);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(console.error);
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(console.error);
    }
  };

  // Process file upload from file input or drag-and-drop
  const processVideoFile = async (file: File) => {
    try {
      const persistentUrl = await saveVideoFile(file);
      setCurrentVideoSrc(persistentUrl);
      if (onUpdateVideoUrl) {
        onUpdateVideoUrl(persistentUrl);
      }
      setUploadNotice(`Vídeo real "${file.name}" carregado e salvo com sucesso!`);
      setTimeout(() => setUploadNotice(null), 6000);
    } catch (err) {
      console.error(err);
      // Fallback to object URL
      const localUrl = URL.createObjectURL(file);
      setCurrentVideoSrc(localUrl);
      if (onUpdateVideoUrl) {
        onUpdateVideoUrl(localUrl);
      }
      setUploadNotice(`Vídeo "${file.name}" carregado!`);
      setTimeout(() => setUploadNotice(null), 6000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      processVideoFile(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="espaco-video" className="relative py-12 lg:py-20 bg-gradient-to-b from-[#FFF8E7] via-[#FFF3D6] to-[#FFF8E7] overflow-hidden border-y border-[#FDE68A]">
      {/* Decorative fire and sun glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-orange-400/20 via-red-500/10 to-yellow-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping inline-block mr-0.5" />
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>Vídeo Real do Espaço • Stella Maris</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#4A2C2A] font-['Outfit'] tracking-tight">
            Sinta o Clima do <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Dendê e Brasa</span>
          </h2>

          <p className="text-base sm:text-lg text-[#4A2C2A]/90 font-medium leading-relaxed">
            {config.videoDescription || 'Carnes e espetinhos suculentos na Parrilla Brava com brasa viva, mesas ao ar livre, telão com jogos de futebol ao vivo e resenha baiana no Empório Greco.'}
          </p>

          {uploadNotice && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadNotice}</span>
            </div>
          )}
        </div>

        {/* Cinematic Video Player Container with Drag-and-Drop */}
        <div
          ref={containerRef}
          onMouseEnter={() => setShowControls(true)}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(74,44,42,0.25)] border-4 ${
            isDragging ? 'border-orange-500 ring-4 ring-orange-300' : 'border-white'
          } bg-stone-950 group transition-all`}
        >
          {/* Ambient Video Background (blurred fill for vertical videos) */}
          <div className="relative aspect-[9/16] sm:aspect-[16/10] md:aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
            {isVerticalMode && (
              <video
                ref={bgVideoRef}
                src={currentVideoSrc}
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                playsInline
                loop
                muted
              />
            )}

            {/* Main Video Element */}
            <video
              ref={videoRef}
              src={currentVideoSrc}
              className={`relative z-10 w-full h-full ${
                isVerticalMode ? 'object-contain' : 'object-cover'
              } cursor-pointer`}
              playsInline
              loop
              muted={isMuted}
              onClick={togglePlay}
            />

            {/* Video overlay ambient gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none z-10" />

            {/* Top Bar inside Video */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span>ESPAÇO REAL • SALVADOR / STELLA MARIS</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVerticalMode(!isVerticalMode)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-orange-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  title={isVerticalMode ? 'Mudar para formato cheio' : 'Mudar para formato vertical'}
                >
                  <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{isVerticalMode ? 'Modo Reel' : 'Ajustar'}</span>
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-full bg-black/70 hover:bg-orange-600 backdrop-blur-md text-white border border-white/20 transition-all cursor-pointer shadow-md"
                  title={isMuted ? 'Ativar Áudio' : 'Desativar Áudio'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-yellow-300" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-yellow-300" />
                  )}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2.5 rounded-full bg-black/70 hover:bg-orange-600 backdrop-blur-md text-white border border-white/20 transition-all cursor-pointer shadow-md"
                  title="Tela Cheia"
                >
                  <Maximize className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Drag overlay feedback */}
            {isDragging && (
              <div className="absolute inset-0 bg-orange-600/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white">
                <Upload className="w-16 h-16 animate-bounce mb-2" />
                <span className="text-xl font-black">Solte seu vídeo aqui</span>
                <span className="text-xs text-yellow-200">Arquivo de vídeo MP4 / MOV</span>
              </div>
            )}

            {/* Big Central Play/Pause Button */}
            {!isPlaying && !isDragging && (
              <button
                onClick={togglePlay}
                className="absolute z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-600/90 hover:bg-orange-600 text-white border-4 border-yellow-300 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Reproduzir Vídeo"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 fill-yellow-300 ml-1.5" />
              </button>
            )}

            {/* Bottom Controls Bar inside Video */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Progress Slider */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-white text-xs font-mono font-bold">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 28}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-white/80 text-xs font-mono font-bold">
                  {formatTime(duration || 28)}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all cursor-pointer flex items-center gap-2 text-xs px-3 shadow-sm"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-white" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Assistir</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs px-3"
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Ativar Áudio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Mutar</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-yellow-300 text-xs font-black">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>Dendê e Brasa • Empório Greco</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chapter Navigation Bar */}
          <div className="bg-[#4A2C2A] p-4 sm:p-6 border-t border-[#FDE68A]/30">
            <div className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Momentos do Vídeo Real (Clique para navegar):</span>
              <span className="text-white/70 font-normal">Empório Greco • Stella Maris</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {chapters.map((ch, idx) => {
                const Icon = ch.icon;
                const isActive = activeChapter === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => jumpToChapter(ch.time, idx)}
                    className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-orange-600/30 border-yellow-400 text-white shadow-md'
                        : 'bg-black/30 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        isActive
                          ? 'bg-yellow-400 text-orange-950'
                          : 'bg-white/10 text-yellow-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black font-['Outfit']">
                          {ch.title}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                        )}
                      </div>
                      <p className="text-[11px] text-white/70 leading-snug mt-0.5">
                        {ch.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons & Direct Upload Dropzone */}
        <div className="mt-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <a
            href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
              'Olá Dendê e Brasa! Vi o vídeo do espaço do restaurante e gostaria de saber sobre mesas e reservas.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-sm shadow-[4px_4px_0px_0px_rgba(74,44,42,1)] hover:shadow-lg transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Reservar Mesa no WhatsApp</span>
          </a>

          <button
            onClick={onScrollToLocation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-orange-950 border-2 border-orange-300 font-black text-sm shadow-xs transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Ver Como Chegar (Mapa)</span>
          </button>

          <button
            onClick={onScrollToMenu}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-sm transition-all cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-yellow-300" />
            <span>Pedir no Cardápio</span>
          </button>

          {/* Hidden File Input for owner to load/select custom video file directly */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-stone-50 text-[#4A2C2A] border-2 border-orange-300 text-xs font-black shadow-xs transition-all cursor-pointer"
            title="Selecione o arquivo de vídeo do seu celular ou computador"
          >
            <Upload className="w-3.5 h-3.5 text-orange-600" />
            <span>Carregar Vídeo do Celular/PC</span>
          </button>
        </div>

        {/* Helper Note for Owner */}
        <div className="mt-4 text-center max-w-xl mx-auto">
          <p className="text-[11px] text-[#4A2C2A]/70 font-medium">
            💡 <strong>Dica para o proprietário:</strong> Você pode clicar em <em>"Carregar Vídeo do Celular/PC"</em> ou arrastar o arquivo de vídeo diretamente sobre o reprodutor para aplicar e salvar o vídeo real imediatamente.
          </p>
        </div>
      </div>
    </section>
  );
};

