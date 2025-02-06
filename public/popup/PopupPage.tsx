import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    chrome?: {
      storage: {
        sync: {
          get: (key: string, callback: (data: any) => void) => void;
          set: (items: Record<string, any>, callback?: () => void) => void;
        };
      };
    };
  }
}

const PopupPage: React.FC = () => {
  const [phraseList, setPhraseList] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (window.chrome?.storage) {
      window.chrome.storage.sync.get("filterPhrases", (data: { filterPhrases?: string[] }) => {
        setPhraseList(data.filterPhrases || []);
      });
    }
  }, []);

  const addNewPhrase = () => {
    const trimmedPhrase = newPhrase.trim();
    if (trimmedPhrase && !phraseList.includes(trimmedPhrase)) {
      const updatedPhrases = [...phraseList, trimmedPhrase];
      setPhraseList(updatedPhrases);
      setNewPhrase('');

      if (window.chrome?.storage) {
        window.chrome.storage.sync.set({ filterPhrases: updatedPhrases });
      }
    }
  };

  const deletePhrase = (phraseToDelete: string) => {
    const updatedPhrases = phraseList.filter(phrase => phrase !== phraseToDelete);
    setPhraseList(updatedPhrases);

    if (window.chrome?.storage) {
      window.chrome.storage.sync.set({ filterPhrases: updatedPhrases });
    }
  };

  return (
    <div className="w-80 p-4 bg-white">
      <div className="rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="FilterX Logo" 
              className="h-6 w-6"
            />
            <h3 className="text-xl font-semibold leading-none tracking-tight">
              FilterX
            </h3>
          </div>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Filter Phrases
            </label>
            <div className="border rounded-lg p-3 min-h-[60px] bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                {phraseList.length > 0 ? (
                  phraseList.map((phrase) => (
                    <div 
                      key={phrase} 
                      className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-md shadow-sm break-words flex justify-between items-center text-xs"
                    >
                      <span className="truncate mr-2">
                        {phrase}
                      </span>
                      <button 
                        onClick={() => deletePhrase(phrase)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label={`Delete ${phrase}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm text-center py-2 col-span-2">
                    No phrases added
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Add New Phrase
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNewPhrase()}
                placeholder="Enter phrase to filter"
                className="flex-1 h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={addNewPhrase}
                style={{ backgroundColor: '#2563eb' }}
                className="text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupPage;