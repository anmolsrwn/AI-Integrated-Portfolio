"use client";

import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");       
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function processStream(query) {
    const newMessages = [...messages, { role: "user", text: query }];
    // Instantly show user message. Don't add AI message yet so 'thinking...' sits directly underneath.
    setMessages(newMessages); 
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunkText = decoder.decode(value, { stream: true });
        
        if (firstChunk) {
          setIsLoading(false); // Hide "thinking..." once stream starts
          firstChunk = false;
          // Add the AI message object to the array now
          setMessages((prev) => [...prev, { role: "ai", text: "" }]);
        }

        // Print character by character for smooth "alphabet by alphabet" streaming
        for (let i = 0; i < chunkText.length; i++) {
          aiText += chunkText[i];
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "ai", text: aiText };
            return updated;
          });
          // 5ms delay per character for faster streaming
          await new Promise(r => setTimeout(r, 2));
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "ai", text: "Oops, something went wrong connecting to the backend!" };
        return updated;
      });
    }

    setIsLoading(false);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input) return;
    const currentInput = input;
    setInput("");
    await processStream(currentInput);
  }

  async function sendQuickQuery(query) {
    await processStream(query);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`
        @keyframes aiLogoGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes aiLogoPulse {
          0% { box-shadow: 0 0 10px rgba(66, 133, 244, 0.4); transform: scale(1); }
          50% { box-shadow: 0 0 25px rgba(155, 114, 203, 0.8), 0 0 10px rgba(217, 101, 112, 0.6); transform: scale(1.05); }
          100% { box-shadow: 0 0 10px rgba(66, 133, 244, 0.4); transform: scale(1); }
        }
        .ai-dynamic-logo {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(270deg, #4285F4, #9B72CB, #D96570, #4285F4);
          background-size: 300% 300%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: aiLogoGradient 4s ease infinite, aiLogoPulse 2.5s ease-in-out infinite;
        }
      `}</style>
      
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div className="ai-dynamic-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600' }}>AI Assistant</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>powered by groq</p>
        </div>
      </div>
      
      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px' 
      }}>
        {messages.length === 0 && (
          <div style={{ margin: 'auto', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start', padding: '0 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px' }}>👋</span>
              <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>Ask me anything!</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', width: '100%' }}>
              {["Tell me about yourself", "Projects you have made", "Why should I hire you?", "What's your tech stack?"].map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendQuickQuery(q)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  • {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} style={{ 
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            maxWidth: '75%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === "user" ? "flex-end" : "flex-start"
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', marginLeft: '4px', marginRight: '4px' }}>
              {msg.role === "user" ? "You" : "AI Assistant"}
            </span>
            <div style={{
              backgroundColor: msg.role === "user" ? "var(--ios-blue)" : "rgba(255, 255, 255, 0.1)",
              color: msg.role === "user" ? "#fff" : "var(--text-primary)",
              padding: '12px 16px',
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              fontSize: '15px',
              lineHeight: '1.4'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ alignSelf: "flex-start", maxWidth: '75%' }}>
            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: '12px 16px',
              borderRadius: "18px 18px 18px 4px",
              color: 'var(--text-secondary)',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div className="chat-spinner" />
              thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (iMessage style) */}
      <form onSubmit={sendMessage} style={{ 
        padding: '20px', 
        borderTop: '1px solid var(--glass-border)',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        gap: '12px'
      }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask your queries here.."
          style={{ 
            flex: 1, 
            padding: '12px 16px', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)', 
            background: 'rgba(255,255,255,0.05)', 
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '15px'
          }}
        />
        <button type="submit" disabled={isLoading || !input.trim()} style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '50%', 
          backgroundColor: input.trim() ? 'var(--ios-blue)' : 'rgba(255,255,255,0.1)', 
          color: 'white', 
          border: 'none', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: input.trim() ? 'pointer' : 'default',
          transition: 'background-color 0.2s'
        }}>
          ↑
        </button>
      </form>

    </div>
  );
}
