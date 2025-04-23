import React, { useEffect, useRef, useState } from 'react';

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
  const recognitionRef = useRef<any>(null);

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

  // Greet and introduce on first load
  useEffect(() => {
    if (!greeted) {
      setTimeout(() => {
        speak('Hello! Welcome to EcoCart, your one-stop platform for sustainable shopping. I am Eco Voicy, your AI voice assistant. You can ask me to navigate, fill forms, or learn more about eco-friendly shopping. Click the mic to start!');
        setFeedback('Hello! Welcome to EcoCart. I am Eco Voicy, your AI voice assistant.');
        setGreeted(true);
      }, 1200);
    }
  }, [greeted]);

  const speak = (text: string) => {
    if (synth.speaking) synth.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    synth.speak(utter);
  };

  const handleVoiceCommand = (speech: string) => {
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
    setFeedback('Sorry, I did not understand. Try saying a tab name or fill your info.');
    speak('Sorry, I did not understand. Try saying a tab name or fill your info.');
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

  return (
    <div className="fixed bottom-8 left-8 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-3 border border-green-300">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-green-700">ECO VOICY</span>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">AI Voice Assistant</span>
      </div>
      <div className="flex gap-2">
        <button
          className={`rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center text-3xl transition-all shadow-lg ${listening ? 'animate-pulse' : ''}`}
          onClick={startListening}
          aria-label="Activate voice assistant"
        >
          <span role="img" aria-label="microphone">🎤</span>
        </button>
        <button
          className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-3xl transition-all shadow-lg"
          onClick={stopListening}
          aria-label="Stop voice assistant"
        >
          <span role="img" aria-label="stop">■</span>
        </button>
      </div>
      <div className="text-xs text-gray-700 dark:text-gray-200 min-h-[24px]">
        {feedback || 'Click the mic and speak!'}
      </div>
      {transcript && (
        <div className="w-48 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded p-2 mt-2">You said: {transcript}</div>
      )}
      <div className="text-[10px] text-gray-400 mt-2">Try: "Go to Learn tab", "My name is John", etc.</div>
    </div>
  );
}

