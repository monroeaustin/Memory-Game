import Logo from '../assets/logo.png';
import { MdOutlineInfo } from "react-icons/md";
import { GoUnmute, GoMute } from "react-icons/go";
import Tutorial from './Tutorial';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [tutorialWindow, setTutorialWindow] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.warn('Autoplay failed:', err);
      }
    };
    playAudio();
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused || audioRef.current.muted) {
      audioRef.current.muted = false;
      audioRef.current.play();
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <nav>
      <div className="nav-left">
        <button onClick={toggleAudio}>
          {isMuted ? <GoMute /> : <GoUnmute />}
        </button>
        <audio ref={audioRef} loop autoPlay muted>
          <source src="/rick-morty-song.mp3" type="audio/mpeg" />
        </audio>
      </div>

      <h1>Rick and Morty Memory Game</h1>
      <img src={Logo} alt="Logo Text" className="img" />

      <div>
        <button onClick={() => setTutorialWindow(prev => !prev)}>
          <MdOutlineInfo />
        </button>
      </div>

      {tutorialWindow && (
        <Tutorial state={tutorialWindow} changeState={setTutorialWindow} />
      )}
    </nav>
  );
}