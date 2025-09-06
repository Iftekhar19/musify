import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/AuthProvider";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// interface MusicPlayerProps {
//   title: string;
//   artist: string;
//   thumbnail: string;
//   src: string;
// }

const MusicPlayer: React.FC = (
  // {
//   title,
//   artist,
//   thumbnail,
//   src,
// }
) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const {prevSong,nextSong,song,setIsPlaying,isPlaying}=useAuth()

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setProgress(audio.currentTime);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    if(isPlaying && audioRef)
    {
      audio?.play()
    }
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };

  }, [song,isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setProgress(value[0]);
  };

  const handleVolume = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value[0];
    setVolume(value[0]);
    setMuted(value[0] === 0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <Card className="w-full bg-transparent shadow-lg rounded-t-2xl rounded-b-none py-0">
      <CardContent className="px-3 py-2">
        <div className="flex flex-col  md:items-center gap-4">
          {/* Thumbnail + Title */}
          <div className="flex items-center gap-3 w-full ">
            <img
              src={song?.thumbnail}
              alt={song?.title}
              className="w-16 h-16   object-cover"
            />
            <div className="truncate">
              <h3 className="text-base md:text-lg font-semibold truncate">
                {song?.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {song?.description}
              </p>
            </div>
          </div>

          {/* Seekbar + Controls */}
          <div className="flex flex-col w-full gap-1">
            {/* Seekbar */}
            <div>
              <Slider
                value={[progress]}
                min={0}
                max={duration}
                step={1}
                onValueChange={handleSeek}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls + Volume */}
            <div className="flex items-center justify-between gap-3  ">
              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="" onClick={prevSong}>
                  <SkipBack className="w-5 h-5" />
                </Button>

                <Button
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>

                <Button variant="ghost" size="icon" onClick={nextSong}>
                  <SkipForward className="w-5 h-5"  />
                </Button>
              </div>

              {/* Volume (hidden on very small screens) */}
              <div className="flex items-center space-x-2 w-28 md:w-40">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const audio = audioRef.current;
                    if (!audio) return;
                    setMuted(!muted);
                    audio.muted = !audio.muted;
                  }}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <Slider
                  value={[muted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolume}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={song?.audio} preload="metadata" />
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
