import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyALx_rQCk-Mmk9DRfdIB4-jughu_WuhFos`,
        { contents: [{ parts: [{ text: input }] }] }
      );
      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse, timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error occurred', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden">
     
     
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full animate-orbit-ring"></div>
        <div className="absolute inset-10 border border-purple-500/10 rounded-full animate-orbit-ring-reverse"></div>
      </div>

      

      <div className="relative bg-gray-900/90 rounded-lg w-full max-w-2xl h-[80vh] flex flex-col z-10 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
       

        <header className="p-4 bg-purple-900/50 text-center">
          <h1 className="text-xl font-bold text-purple-400 animate-orbit-title">AYAN ai</h1>
        </header>

       


        <main className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-purple-300 animate-spin-slow">
              <p className="text-lg">Ask A Question Ayan AI</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs animate-orbit-pop ${
                      msg.role === 'user' ? 'bg-purple-700' : 'bg-gray-800/80 border border-purple-500/50'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap break-words text-sm">{msg.content}</pre>
                    <span className="text-xs text-purple-300/50 block mt-1">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/80 p-3 rounded-lg border border-purple-500/50 flex items-center gap-2 animate-orbit-pop">
                    <ClipLoader color="#A855F7" size={16} />
                    <span className="text-purple-300 text-sm"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

       
        <footer className="p-4 bg-purple-900/50">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 bg-gray-800 rounded-lg border border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-400 text-white placeholder-purple-300/50 text-sm"
              placeholder="How Can Ayan AI Help...?"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-all duration-200 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            >
              Send
            </button>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes orbit-ring {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1.05); }
        }
        @keyframes orbit-ring-reverse {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(-360deg) scale(0.95); }
        }
        
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit-pop {
          0% { transform: scale(0.9) rotate(2deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-orbit-ring { animation: orbit-ring 20s linear infinite; }
        .animate-orbit-ring-reverse { animation: orbit-ring-reverse 25s linear infinite; }
        .animate-orbit-title { animation: orbit-title 3s infinite ease-in-out; }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .animate-orbit-pop { animation: orbit-pop 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default App;