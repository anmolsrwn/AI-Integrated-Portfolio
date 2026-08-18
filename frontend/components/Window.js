"use client";

import { useState, useRef, useEffect } from "react";

export default function Window({ title, icon = "💻", onClose, children, width = "600px", height = "400px", top = "10%", left = "20%" }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (isMaximized) return; // Disable drag if maximized
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const windowStyle = isMaximized 
    ? {
        position: 'fixed',
        top: '32px', // below menu bar
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 32px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }
    : {
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        width, 
        height, 
        maxWidth: '95vw',
        maxHeight: '85vh',
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        display: 'flex', 
        flexDirection: 'column',
        zIndex: isDragging ? 50 : 10,
        boxShadow: isDragging ? '0 30px 60px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
      };

  return (
    <div className="mac-window" style={windowStyle}>
      {/* Titlebar */}
      <div 
        className="mac-titlebar" 
        style={{ cursor: isMaximized ? 'default' : (isDragging ? 'grabbing' : 'grab'), display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
        onMouseDown={handleMouseDown}
      >
        {/* Logo */}
        <div style={{ position: 'absolute', left: '16px', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
          {icon}
        </div>
        
        {/* Window Title */}
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {title}
        </div>

        {/* Window Controls (moved to top right) */}
        <div style={{ display: 'flex', gap: '8px', position: 'absolute', right: '16px' }}>
          <div 
            onClick={onClose}
            title="Minimize"
            style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FFBD2E', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'rgba(0,0,0,0.6)' }}
          >
            −
          </div>
          <div 
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? "Restore Down" : "Maximize"}
            style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#27C93F', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'rgba(0,0,0,0.6)' }}
          >
            {isMaximized ? '❐' : '□'}
          </div>
          <div 
            onClick={onClose}
            title="Close"
            style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FF5F56', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: 'rgba(0,0,0,0.6)' }}
          >
            ✕
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
        {/* Invisible overlay while dragging to prevent text/iframes from stealing mouse events */}
        {isDragging && <div style={{position: 'absolute', inset: 0, zIndex: 9999}} />}
        {children}
      </div>
    </div>
  );
}
