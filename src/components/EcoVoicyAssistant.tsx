import React, { useEffect, useRef, useState } from 'react';
import './chatbot-animations.css';

// For speech recognition and synthesis
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const synth = window.speechSynthesis;

const tabs = [
  { label: 'Search Results', value: 'search' },
  { label: 'Greener Alternatives', value: 'alternatives' },
  { label: 'My Eco-Impact', value: 'impact' },
  { label: 'Learn', value: 'learn' },
  { label: 'Contact Us', value: 'contact' }
];

export default function EcoVoicyAssistant({ onTabSelect, onFillForm }: {
  onTabSelect: (tab: string) => void,
  onFillForm?: (form: { name?: string; email?: string; message?: string }) => void
}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [greeted, setGreeted] = useState(false);
  const [open, setOpen] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Placeholder for Supernormal API integration
  async function getSupernormalResponse(userText: string): Promise<string> {
    // Example: Replace this with actual API integration
    // You'd POST userText to your backend or directly to Supernormal API and return the AI's response
    // For now, return a friendly, fine-tone response
    return `Hi! I heard: "${userText}". How can I help you further?`;
  }


  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const speech = event.results[0][0].transcript.toLowerCase();
      setTranscript(speech);
      handleVoiceCommand(speech);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (e: any) => setFeedback('Sorry, I did not catch that. Please try again.');
  }, []);

  // Greet and introduce when assistant is opened
  useEffect(() => {
    if (open && !greeted) {
      setTimeout(() => {
        speak('Hello! Welcome to EcoCart, your one-stop platform for sustainable shopping. I am Eco Voicy, your AI voice assistant. You can ask me to navigate, fill forms, or learn more about eco-friendly shopping. Click the mic to start!');
        setFeedback('Hello! Welcome to EcoCart. I am Eco Voicy, your AI voice assistant.');
        setGreeted(true);
      }, 600);
    }
  }, [open, greeted]);

  const speak = (text: string) => {
    if (synth.speaking) synth.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    synth.speak(utter);
  };

  const handleVoiceCommand = async (speech: string) => {
    // Close assistant by voice
    if (speech.includes('close')) {
      setOpen(false);
      stopListening();
      return;
    }
    // Tab navigation
    for (const tab of tabs) {
      if (speech.includes(tab.label.toLowerCase()) || speech.includes(tab.value)) {
        setFeedback(`Switching to ${tab.label}`);
        speak(`Switching to ${tab.label}`);
        onTabSelect(tab.value);
        return;
      }
    }
    // Form filling (Contact Us)
    if (speech.includes('my name is')) {
      const name = speech.split('my name is')[1]?.trim().split(' ')[0];
      if (name && onFillForm) {
        setFeedback(`Filling name as ${name}`);
        speak(`Filling your name as ${name}`);
        onFillForm({ name });
        return;
      }
    }
    if (speech.includes('my email is')) {
      const email = speech.split('my email is')[1]?.trim().split(' ')[0];
      if (email && onFillForm) {
        setFeedback(`Filling email as ${email}`);
        speak(`Filling your email as ${email}`);
        onFillForm({ email });
        return;
      }
    }
    if (speech.includes('my message is')) {
      const message = speech.split('my message is')[1]?.trim();
      if (message && onFillForm) {
        setFeedback('Filling your message');
        speak('Filling your message');
        onFillForm({ message });
        return;
      }
    }
    if (speech.includes('stop')) {
      stopListening();
      return;
    }
    // Fallback: Use Supernormal API for friendly, fine-tone response
    const aiResponse = await getSupernormalResponse(speech);
    setFeedback(aiResponse);
    speak(aiResponse);
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      setFeedback('Voice recognition not supported in this browser.');
      speak('Voice recognition not supported in this browser.');
      return;
    }
    setFeedback('Listening... Please say a command, tab name, or fill your info.');
    speak('How can I help you? You can say a tab name, like Search Results, Greener Alternatives, My Eco Impact, Learn, or Contact Us. Or say: My name is..., My email is..., My message is... You can also say stop to end my listening.');
    setListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setListening(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    setFeedback('Voice assistant stopped.');
    speak('Voice assistant stopped.');
  };

  if (!open) {
    return (
      <button
        className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg chatbot-float"
        onClick={() => setOpen(true)}
        aria-label="Open Eco Voicy"
      >
        <span role="img" aria-label="eco voicy">🗣️</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-3 flex flex-col items-center gap-2 border border-green-300 min-w-[220px] max-w-[260px] chatbot-fade-in">
      <div className="flex items-center justify-between w-full mb-1">
        <span className="font-bold text-base text-green-700">ECO VOICY</span>
        <button
          className="text-gray-400 hover:text-red-500 text-lg font-bold ml-2"
          onClick={() => { setOpen(false); stopListening(); }}
          aria-label="Close Eco Voicy"
        >
          ×
        </button>
      </div>
      <div className="flex gap-1 w-full justify-center">
        <button
          className={`rounded-full w-10 h-10 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center text-xl transition-all shadow-lg ${listening ? 'animate-pulse' : ''}`}
          onClick={startListening}
          aria-label="Activate voice assistant"
        >
          <span role="img" aria-label="microphone">🎤</span>
        </button>
        <button
          className="rounded-full w-10 h-10 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xl transition-all shadow-lg"
          onClick={stopListening}
          aria-label="Stop voice assistant"
        >
          <span role="img" aria-label="stop">■</span>
        </button>
      </div>
      <div className="text-xs text-gray-700 dark:text-gray-200 min-h-[18px] text-center w-full">
        {feedback || 'Click the mic and speak!'}
      </div>
      {transcript && (
        <div className="w-full text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded p-1 mt-1 text-center">You said: {transcript}</div>
      )}
      <div className="text-[10px] text-gray-400 mt-1 text-center">Try: "Go to Learn tab", "My name is John", "Stop", "Close"</div>
    </div>
  );
}
