"use client";

import { useState, useEffect } from "react";
import Icon from "../components/Icon";
import Window from "../components/Window";
import Chat from "../components/Chat";

const GeminiIcon = () => (
  <div style={{
    width: '1em',
    height: '1em',
    background: 'linear-gradient(135deg, #c605fbff 0%, #05fa84ff 45%, #00ffeaff 100%)',
    borderRadius: '22%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.3)',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, height: '45%',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
    }} />
    <svg width="0.6em" height="0.6em" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 1, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}>
      <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
    </svg>
  </div>
);

export default function Home() {
  // State to track which windows are open
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isProj1Open, setIsProj1Open] = useState(false);
  const [isProj2Open, setIsProj2Open] = useState(false);
  const [isProj3Open, setIsProj3Open] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("Mon 9:41 AM");
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [showBootScreen, setShowBootScreen] = useState(true); // To completely unmount it after fade
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [hueRotate, setHueRotate] = useState(0);
  
  // Spotlight State
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleContextMenu = (e: any) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.pageX, y: e.pageY });
    if (isProjectsMenuOpen) setIsProjectsMenuOpen(false);
  };

  const handleClick = () => {
    if (contextMenu.show) setContextMenu({ ...contextMenu, show: false });
  };

  const changeWallpaper = () => {
    setHueRotate(prev => prev + 60);
  };

  useEffect(() => {
    // Boot Sequence Simulation
    const bootInterval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(bootInterval);
          setIsBooting(false); // Trigger fade out
          setTimeout(() => setShowBootScreen(false), 600); // Unmount after fade
          return 100;
        }
        // Randomize loading speed slightly for realism
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 150);

    return () => clearInterval(bootInterval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = new Intl.DateTimeFormat('en-US', { 
        weekday: 'short', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }).format(now).replace(',', '');
      setCurrentTime(timeString);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000); // update every 10s
    return () => clearInterval(timer);
  }, []);

  // Spotlight Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
        setSearchQuery('');
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openWindow = (windowName: string) => {
    setIsResumeOpen(windowName === 'resume');
    setIsProj1Open(windowName === 'proj1');
    setIsProj2Open(windowName === 'proj2');
    setIsProj3Open(windowName === 'proj3');
    setIsChatOpen(windowName === 'chat');
  };

  const spotlightItems = [
    { name: 'Resume', action: () => openWindow('resume'), icon: '📄' },
    { name: 'ReturnAI', action: () => openWindow('proj1'), icon: '🤖' },
    { name: 'SketchSpace', action: () => openWindow('proj2'), icon: '🎨' },
    { name: 'InsightEd', action: () => openWindow('proj3'), icon: '🎓' },
    { name: 'Ask me', action: () => openWindow('chat'), icon: <GeminiIcon /> },
    { name: 'GitHub', action: () => window.open('https://github.com/anmolsrwn', '_blank'), icon: '💻' },
    { name: 'Email', action: () => window.location.href = 'mailto:anmolsarwan2@gmail.com', icon: '✉️' }
  ];

  const filteredSpotlight = spotlightItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      
      {/* Dynamic Background Layer */}
      <div style={{
        position: 'absolute', 
        inset: 0, 
        zIndex: -1, 
        backgroundImage: "url('/bg.png')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        filter: `hue-rotate(${hueRotate}deg)`, 
        transition: 'filter 0.5s ease'
      }} />

      {/* Funky TV Animations */}
      <style>{`
        @keyframes tvGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes tvGridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        @keyframes tvTextFlicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; text-shadow: 0 0 10px #05fa84, 0 0 20px #05fa84, 0 0 40px #c605fb; }
          20%, 24%, 55% { opacity: 0.7; text-shadow: none; }
        }
      `}</style>

      {/* Funky TV Layer */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {/* TV Outer Bezel */}
        <div style={{
          width: 'min(90vw, 500px)',
          height: 'min(60vw, 340px)',
          background: '#2a2a2a',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '2px solid #111'
        }}>
          {/* TV Screen */}
          <div style={{
            width: '100%',
            height: '100%',
            background: '#0d0d0d',
            borderRadius: '32px', // CRT curvature
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,1), 0 0 10px rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '6px solid #1a1a1a'
          }}>
            {/* Screen Graphics (Animated Gradient + Grid) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(45deg, #10001f, #001f15, #00101f)',
              backgroundSize: '400% 400%',
              animation: 'tvGradient 8s ease infinite',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(0, 255, 234, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 234, 0.15) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              animation: 'tvGridScroll 10s linear infinite'
            }} />
            
            {/* The Text */}
            <h1 style={{
              position: 'relative',
              zIndex: 2,
              fontSize: 'clamp(24px, 6vw, 42px)',
              fontWeight: 900,
              color: '#fff',
              textAlign: 'center',
              lineHeight: 1.2,
              fontFamily: '"Courier New", Courier, monospace',
              letterSpacing: '-1px',
              animation: 'tvTextFlicker 5s infinite alternate'
            }}>
              Hi<br/>this is Anmol's<br/>portfolio
            </h1>

            {/* Scanlines Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
              zIndex: 3,
              pointerEvents: 'none'
            }} />
            
            {/* Glass Curve Reflection */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.15) 0%, transparent 60%)',
              zIndex: 4,
              pointerEvents: 'none'
            }} />
          </div>
          
          {/* TV Bottom Panel (Knobs/Buttons) */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', alignSelf: 'flex-end', paddingRight: '30px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff3b30', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(255,59,48,0.5)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#555', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }} />
          </div>
        </div>
      </div>

      {/* Spotlight Overlay */}
      {isSpotlightOpen && (
        <div 
          style={{ position: 'absolute', inset: 0, zIndex: 10000, display: 'flex', justifyContent: 'center', paddingTop: '15vh', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={() => setIsSpotlightOpen(false)}
        >
          <div 
            style={{ width: '600px', height: 'fit-content', background: 'rgba(30, 30, 30, 0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '24px', marginRight: '16px', opacity: 0.5 }}>🔍</span>
              <input 
                autoFocus
                placeholder="Spotlight Search" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', outline: 'none', width: '100%', fontWeight: 300 }}
              />
            </div>
            
            {searchQuery && (
              <div style={{ padding: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {filteredSpotlight.length > 0 ? filteredSpotlight.map(item => (
                  <div 
                    key={item.name}
                    onClick={() => { item.action(); setIsSpotlightOpen(false); }}
                    style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--ios-blue)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '20px', marginRight: '16px' }}>{item.icon}</span>
                    <span style={{ fontSize: '16px' }}>{item.name}</span>
                  </div>
                )) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.show && (
        <div style={{
          position: 'absolute',
          top: contextMenu.y,
          left: contextMenu.x,
          background: 'rgba(30, 30, 30, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '6px',
          minWidth: '220px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 999,
          color: 'white',
          fontSize: '13.5px'
        }}>
          <div 
            style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
            onClick={changeWallpaper}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--ios-blue)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            🎨 Change Wallpaper Color
          </div>
          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />
          <div 
            style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
            onClick={() => window.open('https://github.com/anmolsrwn', '_blank')}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--ios-blue)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            💻 View GitHub Profile
          </div>
          <div 
            style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
            onClick={() => window.location.href = 'mailto:anmolsarwan2@gmail.com'}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--ios-blue)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ✉️ Contact Anmol
          </div>
        </div>
      )}

      {/* Boot Screen Overlay */}
      {showBootScreen && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'black',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          opacity: isBooting ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
          pointerEvents: isBooting ? 'all' : 'none'
        }}>
          {/* Welcome Message */}
          <div style={{ fontSize: '42px', marginBottom: '60px', fontWeight: 'bold', letterSpacing: '2px' }}>Welcome</div>
          
          {/* Loading Bar Container */}
          <div style={{ width: '220px', height: '4px', background: '#333', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
            {/* Progress Fill */}
            <div style={{ 
              width: `${bootProgress}%`, 
              height: '100%', 
              background: 'white',
              borderRadius: '4px',
              transition: 'width 0.2s ease-out'
            }} />
          </div>
          
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', fontWeight: '500' }}>
            Loading Portfolio...
          </div>
        </div>
      )}

      {/* Top Menu Bar */}
      <div 
        className="mac-menubar"
        style={{
          height: '32px',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          fontSize: '13px',
          color: '#fff',
          zIndex: 1000,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <style>{`.mac-menubar::-webkit-scrollbar { display: none; }`}</style>
        <strong style={{ marginRight: '16px', fontSize: '15px', cursor: 'default' }}> Anmol's Portfolio</strong>
        
        <div style={{ position: 'relative', marginRight: '4px' }}>
          <span 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '4px 10px', borderRadius: '4px', transition: 'background 0.2s' }} 
            onClick={() => setIsProjectsMenuOpen(!isProjectsMenuOpen)}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Projects
          </span>
          {isProjectsMenuOpen && (
            <div style={{ 
              position: 'absolute', 
              top: '24px', 
              left: 0, 
              background: 'rgba(30, 30, 30, 0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: '6px',
              padding: '6px 0',
              minWidth: '160px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              border: '1px solid var(--glass-border)',
              zIndex: 200,
              color: 'white'
            }}>
              <div 
                style={{ padding: '6px 16px', cursor: 'pointer', transition: 'background 0.2s' }} 
                onClick={() => { openWindow('proj1'); setIsProjectsMenuOpen(false); }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--ios-blue)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >🤖 ReturnAI</div>
              <div 
                style={{ padding: '6px 16px', cursor: 'pointer', transition: 'background 0.2s' }} 
                onClick={() => { openWindow('proj2'); setIsProjectsMenuOpen(false); }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--ios-blue)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >🎨 SketchSpace</div>
              <div 
                style={{ padding: '6px 16px', cursor: 'pointer', transition: 'background 0.2s' }} 
                onClick={() => { openWindow('proj3'); setIsProjectsMenuOpen(false); }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--ios-blue)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >🎓 InsightEd</div>
            </div>
          )}
        </div>

        <span 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px', cursor: 'pointer', padding: '4px 10px', borderRadius: '4px', transition: 'background 0.2s' }} 
          onClick={() => { openWindow('resume'); setIsProjectsMenuOpen(false); }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Resume
        </span>

        <a 
          href="https://github.com/anmolsrwn"
          target="_blank"
          rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px', color: 'inherit', textDecoration: 'none', padding: '4px 10px', borderRadius: '4px', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>

        <a 
          href="https://leetcode.com/u/anmolsrwn"
          target="_blank"
          rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px', color: 'inherit', textDecoration: 'none', padding: '4px 10px', borderRadius: '4px', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.665 2.665 0 0 1 .614-1.164L9.86 8.614l4.195-4.428a3.014 3.014 0 0 1 4.25-.017l2.853 2.72c.563.535 1.459.507 1.99-.063.533-.571.509-1.467-.052-2.003L20.244 2.1A5.762 5.762 0 0 0 16.14.041 5.645 5.645 0 0 0 13.483 0zm2.006 9.77a1.38 1.38 0 0 0-.964.444L9.043 15.992a1.383 1.383 0 0 0 0 1.944 1.383 1.383 0 0 0 1.944 0l5.482-5.778a1.383 1.383 0 0 0 0-1.944 1.38 1.38 0 0 0-.98-.444z"/>
          </svg>
          LeetCode
        </a>

        <a 
          href="mailto:anmolsarwan2@gmail.com" 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '16px', color: 'inherit', textDecoration: 'none', padding: '4px 10px', borderRadius: '4px', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          Email
        </a>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ cursor: 'default' }}>100% 🔋</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '16px', cursor: 'pointer' }} onClick={() => setIsSpotlightOpen(true)}>🔍</span>
            <span style={{ cursor: 'default', padding: '2px 8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }} suppressHydrationWarning>
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Icons Grid */}
      <div style={{ 
        padding: '40px 20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px', 
        alignItems: 'flex-start',
        position: 'absolute',
        left: 0,
        top: '32px'
      }}>
        <Icon name="Resume" emoji="📄" onClick={() => openWindow('resume')} />
        <Icon name="ReturnAI" emoji="🤖" onClick={() => openWindow('proj1')} />
        <Icon name="SketchSpace" emoji="🎨" onClick={() => openWindow('proj2')} />
        <Icon name="InsightEd" emoji="🎓" onClick={() => openWindow('proj3')} />
        <Icon name="Ask me" emoji={<GeminiIcon />} onClick={() => openWindow('chat')} />
      </div>

      {/* Click-outside overlay for Windows */}
      {(isResumeOpen || isProj1Open || isProj2Open || isProj3Open || isChatOpen) && (
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 5 
          }} 
          onClick={() => {
            setIsResumeOpen(false);
            setIsProj1Open(false);
            setIsProj2Open(false);
            setIsProj3Open(false);
            setIsChatOpen(false);
          }} 
        />
      )}

      {/* WINDOWS */}

      {/* Resume Window */}
      {isResumeOpen && (
        <Window icon="📄" title="Anmol_Sarwan_Resume.pdf" onClose={() => setIsResumeOpen(false)} width="800px" height="85vh" left="5%" top="2%">
          <div style={{ padding: '40px', color: 'var(--text-primary)', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '36px', margin: '0 0 10px 0', letterSpacing: '1px' }}>ANMOL SARWAN</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Bhilai, Chhattisgarh, India | +91 9340641769 | anmolsarwan2@gmail.com
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                <a href="#" style={{ color: 'var(--ios-blue)', textDecoration: 'none' }}>LinkedIn</a>
                <a href="#" style={{ color: 'var(--ios-blue)', textDecoration: 'none' }}>GitHub</a>
                <a href="#" style={{ color: 'var(--ios-blue)', textDecoration: 'none' }}>LeetCode</a>
              </div>
            </div>

            <hr style={{ borderColor: 'var(--glass-border)', marginBottom: '20px' }} />

            {/* Summary */}
            <section style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--ios-blue)', marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>Professional Summary</h3>
              <p style={{ fontSize: '14.5px' }}>
                Software Engineering student with hands-on full-stack experience across React, Node.js, FastAPI, and Python, building and deploying production systems end-to-end. Strong foundation in DSA, System Design, and OOP (500+ problems solved). Comfortable with the full SDLC and with AI coding assistants and agentic IDEs.
              </p>
            </section>

            {/* Skills */}
            <section style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--ios-blue)', marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>Technical Skills</h3>
              <ul style={{ listStyleType: 'none', padding: 0, fontSize: '14.5px' }}>
                <li style={{ marginBottom: '6px' }}><strong>Languages:</strong> C++, JavaScript (Node.js), Python</li>
                <li style={{ marginBottom: '6px' }}><strong>Frontend & Backend:</strong> React.js, HTML, CSS, Express.js, FastAPI</li>
                <li style={{ marginBottom: '6px' }}><strong>Databases & Real-Time:</strong> MongoDB, MySQL, Redis, Socket.io</li>
                <li style={{ marginBottom: '6px' }}><strong>Cloud & Deployment:</strong> Vercel, Render, S3, TTL caching, RESTful API, JWT</li>
                <li><strong>AI/ML & Tools:</strong> Google Gemini API, scikit-learn, SHAP, Git, VS Code, Agentic IDEs</li>
              </ul>
            </section>

            {/* Note about Projects */}
            <section style={{ marginBottom: '24px', padding: '12px', background: 'rgba(10, 132, 255, 0.1)', borderRadius: '8px', border: '1px dashed var(--ios-blue)' }}>
              <p style={{ margin: 0, fontSize: '14.5px', textAlign: 'center' }}>
                <strong>Note:</strong> Detailed project information and live demos (ReturnAI, SketchSpace, InsightEd) can be viewed by clicking their respective app icons on the desktop!
              </p>
            </section>

            {/* Education */}
            <section style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--ios-blue)', marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>Education</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong>National Institute of Technology, Raipur</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>2023 – 2027</span>
              </div>
              <div style={{ fontSize: '14.5px', marginBottom: '12px' }}>
                <em>B.Tech, Mechanical Engineering — CGPA: 6.52</em>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong>M.G.M Senior Secondary School, Bhilai</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>2022</span>
              </div>
              <div style={{ fontSize: '14.5px' }}>
                <em>Senior Secondary (CBSE) — 78.6%</em>
              </div>
            </section>

            {/* Achievements & Roles */}
            <section style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--ios-blue)', marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>Achievements & Leadership</h3>
              <ul style={{ paddingLeft: '20px', fontSize: '14.5px' }}>
                <li style={{ marginBottom: '8px' }}>Solved 500+ Data Structures & Algorithms problems across LeetCode, CodeChef, and GeeksforGeeks.</li>
                <li><strong>Head Coordinator</strong> at Technocracy (Technical Club, NIT Raipur). Led planning and execution of technical events, workshops, and competitions.</li>
              </ul>
            </section>

          </div>
        </Window>
      )}

      {/* Project 1 Window */}
      {isProj1Open && (
        <Window icon="🤖" title="ReturnAI" onClose={() => setIsProj1Open(false)} width="700px" height="500px" top="15%" left="15%">
          <div style={{ padding: '40px', color: 'var(--text-primary)', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginBottom: '10px' }}>ReturnAI Marketplace</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontStyle: 'italic' }}>AI-Powered Reverse Commerce & Fraud Defence</p>
            <hr style={{ borderColor: 'var(--glass-border)', marginBottom: '20px' }} />
            <p style={{ lineHeight: '1.6' }}>
              An AI-powered extension to an e-commerce marketplace that turns returns and used-item listings into recovered value, while defending against return fraud.
            </p>
            <br/>
            <p style={{ lineHeight: '1.6' }}>
              <strong>Key Features:</strong>
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>AI vision grading from photos</li>
              <li>Trust model & scoring</li>
              <li>Geo-demand matching to nearby buyers</li>
              <li>Deterministic disposition engine</li>
            </ul>
            <br />
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <a href="https://github.com/anmolsrwn/ReturnAI" target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--ios-blue)', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                View on GitHub
              </a>
              <a href="https://returnai-five.vercel.app/" target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--text-primary)', color: 'var(--glass-bg)', textDecoration: 'none', fontWeight: 'bold' }}>
                Live Demo
              </a>
            </div>
          </div>
        </Window>
      )}

      {/* Project 2 Window */}
      {isProj2Open && (
        <Window icon="🎨" title="SketchSpace" onClose={() => setIsProj2Open(false)} width="700px" height="500px" top="20%" left="20%">
          <div style={{ padding: '40px', color: 'var(--text-primary)', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginBottom: '10px' }}>SketchSpace</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontStyle: 'italic' }}>Real-time Collaborative AI Whiteboard</p>
            <hr style={{ borderColor: 'var(--glass-border)', marginBottom: '20px' }} />
            <p style={{ lineHeight: '1.6' }}>
              A real-time, collaborative whiteboard application built with the MERN stack, WebSockets, Redis, and React Konva.
            </p>
            <br/>
            <p style={{ lineHeight: '1.6' }}>
              <strong>Key Features:</strong>
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Real-Time Collaboration using WebSockets</li>
              <li>High-Performance Canvas (React Konva)</li>
              <li>AI-powered diagram generation (Google Gemini)</li>
              <li>Redis caching for extreme speed</li>
            </ul>
            <br />
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <a href="https://github.com/anmolsrwn/SketchSpace" target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--ios-blue)', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                View on GitHub
              </a>
              <a href="https://sketchspace-frontend-pc9j.onrender.com" target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--text-primary)', color: 'var(--glass-bg)', textDecoration: 'none', fontWeight: 'bold' }}>
                Live Demo
              </a>
            </div>
          </div>
        </Window>
      )}

      {/* Project 3 Window */}
      {isProj3Open && (
        <Window icon="🎓" title="InsightEd" onClose={() => setIsProj3Open(false)} width="700px" height="500px" top="25%" left="25%">
          <div style={{ padding: '40px', color: 'var(--text-primary)', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginBottom: '10px' }}>InsightEd</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontStyle: 'italic' }}>AI-Powered Student Dropout Prediction Dashboard</p>
            <hr style={{ borderColor: 'var(--glass-border)', marginBottom: '20px' }} />
            <p style={{ lineHeight: '1.6' }}>
              A full-stack machine learning web application designed for university counselors and administrators to identify students at risk of dropping out.
            </p>
            <br/>
            <p style={{ lineHeight: '1.6' }}>
              <strong>Tech Stack & Features:</strong>
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Predictive Modeling (Scikit-Learn)</li>
              <li>Interactive Dashboard (Streamlit & Python)</li>
              <li>Data Management (SQLite)</li>
              <li>Actionable Intervention Strategies</li>
            </ul>
            <br />
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <a href="https://github.com/anmolsrwn/insighted-app" target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--ios-blue)', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                View on GitHub
              </a>
              <a href="https://insightedweb.streamlit.app/" target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--text-primary)', color: 'var(--glass-bg)', textDecoration: 'none', fontWeight: 'bold' }}>
                Live Demo
              </a>
            </div>
          </div>
        </Window>
      )}

      {/* Ask me Window */}
      {isChatOpen && (
        <Window icon={<GeminiIcon /> as any} title="Ask me" onClose={() => setIsChatOpen(false)} width="400px" height="600px" left="60%" top="15%">
          <Chat />
        </Window>
      )}

      {/* macOS Dock */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '10px 20px',
        display: 'flex',
        gap: '16px',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '40px', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => openWindow('resume')} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>📄</div>
        <div style={{ fontSize: '40px', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center' }} onClick={() => openWindow('chat')} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}><GeminiIcon /></div>
      </div>

    </div>
  );
}
