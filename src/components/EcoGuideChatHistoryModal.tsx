import React from 'react';

import type { Message } from "./EcoGuideChat";

interface ChatSession {
  id: string;
  started: number;
  messages: Message[];
  name?: string;
}

interface Props {
  sessions: ChatSession[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDownloadAll: () => void;
  onClose: () => void;
}

const EcoGuideChatHistoryModal: React.FC<Props> = ({ sessions, onRestore, onDelete, onRename, onDownloadAll, onClose }) => {
  return (
    <div className="ecoguide-chat-history-modal">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg">✕</button>
        <h2 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
          Chat History
          <button onClick={onDownloadAll} className="ml-auto px-2 py-1 rounded bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium border border-green-200">Export All</button>
        </h2>
        {sessions.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No chat history found.</div>
        ) : (
          <ul className="divide-y divide-green-100 mb-2 max-h-80 overflow-y-auto">
            {sessions.map(session => (
              <li key={session.id} className="py-3 flex items-center justify-between group">
                <div className="flex-1 min-w-0">
                  <input
                    className="font-semibold text-green-800 bg-transparent border-b border-green-100 focus:border-green-400 outline-none w-full text-sm mb-1"
                    value={session.name || ''}
                    onChange={e => onRename(session.id, e.target.value)}
                    placeholder={`Session ${session.id.slice(-5)}`}
                  />

                  <div className="text-xs text-gray-400">{session.messages.length} messages</div>
                </div>
                <div className="flex flex-col gap-2 items-end ml-2">
                  <button className="px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-800 text-xs font-medium" onClick={() => onRestore(session.id)}>Restore</button>
                  <button className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium" onClick={() => onDelete(session.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EcoGuideChatHistoryModal;
