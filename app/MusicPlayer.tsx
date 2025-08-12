'use client'

import React, { useState, useRef, useEffect } from "react";
import { FaStepBackward, FaPlay, FaPause, FaStepForward } from "react-icons/fa";

// Accept tracks as a prop from the Navbar
interface MusicPlayerProps {
  tracks: string[];
}

const MusicPlayer = ({ tracks }: MusicPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src={tracks[currentTrack]} onEnded={handleNext} />
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <FaStepBackward size={24} />
        </button>
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <FaStepForward size={24} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;