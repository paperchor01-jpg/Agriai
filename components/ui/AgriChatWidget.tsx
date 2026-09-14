'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { ChatMessage } from '@/types';
import { getChatResponse, SUGGESTED_QUESTIONS } from '@/lib/chat-service';
import { getSelectedFarm, DEFAULT_FARMS } from '@/lib/mock-data';
import { i18nService } from '@/lib/i18n-service';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'bot',
  text: "Namaste! I am AgriAI, your smart farming copilot. Ask me about your crops, soil, weather, irrigation schedules, or mandi prices.",
  timestamp: 'Just now',
};

export function AgriChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleSend = useCallback((textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const farm = typeof window !== 'undefined' ? getSelectedFarm() : null;
    const responseText = getChatResponse(text, farm);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          text: responseText,
          timestamp: 'Just now',
        },
      ]);
    }, 450);
  }, [input]);

  // Speech to Text (Voice Assistant)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setVoiceError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice recognition is not supported in this browser. Please type your question.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      const currentLang = i18nService.getCurrentLanguage();
      const langMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        pa: 'pa-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        gu: 'gu-IN',
        ml: 'ml-IN',
        or: 'or-IN',
      };
      recognition.lang = langMap[currentLang] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setVoiceError(`Voice recognition: ${event.error || 'Permission denied'}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceError("Could not access microphone. Please check browser permissions.");
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Global event listener to open chat from any card
  useEffect(() => {
    const handleOpenChat = (e: CustomEvent<{ query?: string }>) => {
      setIsOpen(true);
      if (e.detail?.query) {
        setTimeout(() => {
          handleSend(e.detail.query);
        }, 150);
      }
    };
    window.addEventListener('agriai:open-chat', handleOpenChat as EventListener);
    return () => window.removeEventListener('agriai:open-chat', handleOpenChat as EventListener);
  }, [handleSend]);

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setInput('');
    setVoiceError(null);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* 1. Floating Assistant Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-lg shadow-emerald-700/25 hover:shadow-emerald-600/35 transition-all duration-200 cursor-pointer"
          aria-label="Open AgriAI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-600"></span>
          </div>
          <span className="font-bold text-sm tracking-tight">
            AgriAI Assistant
          </span>
        </button>
      )}

      {/* 2. Floating Chat Panel */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[calc(100dvh-6.5rem)] sm:max-h-[84vh] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 dark:border-zinc-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 text-left">
          {/* Header */}
          <div className="bg-emerald-700/95 dark:bg-emerald-800/95 backdrop-blur-md text-white px-5 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-2xs">
                <Bot className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm tracking-tight">AgriAI Assistant</h3>
                  <span className="text-[10px] bg-emerald-500/40 text-emerald-100 px-1.5 py-0.2 rounded-md font-bold">
                    Online
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 font-medium">
                  Your smart farming copilot (Voice & Text)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear chat history"
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voice Listening Banner */}
          {isListening && (
            <div className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 animate-bounce" />
                <span>Listening... Speak in your language</span>
              </div>
              <button
                onClick={toggleListening}
                className="text-xs underline font-bold"
              >
                Cancel
              </button>
            </div>
          )}

          {voiceError && (
            <div className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-b border-rose-200 dark:border-rose-800 px-4 py-1.5 text-xs">
              {voiceError}
            </div>
          )}

          {/* Messages Body */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-50/70 dark:bg-zinc-950/40"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs font-medium'
                      : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/90 dark:border-zinc-700/80 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 font-medium ${
                      msg.sender === 'user' ? 'text-emerald-100' : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs pl-9">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                </div>
                <span className="text-[11px] font-medium">AgriAI is analyzing farm telemetry...</span>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="px-3.5 py-2.5 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
              Suggested Questions
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED_QUESTIONS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="shrink-0 text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-800 dark:hover:text-emerald-300 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form with Microphone Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
              }`}
              title="Speak in your language"
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder="Ask or speak about crops, soil, water..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl disabled:opacity-40 transition-all shadow-2xs cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Subtle Disclaimer */}
          <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 dark:text-zinc-500 text-center font-medium leading-tight">
            AgriAI provides intelligent agronomic advice. Always verify with local agricultural extension officers for critical farm decisions.
          </div>
        </div>
      )}
    </div>
  );
}
