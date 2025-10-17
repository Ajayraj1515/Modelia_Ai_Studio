
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import type { Generation } from '../types';
import Spinner from './Spinner';

interface HistoryPanelProps {
  onRestore: (generation: Generation) => void;
  newGeneration: Generation | null;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onRestore, newGeneration }) => {
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const generations = await apiService.getGenerations();
        setHistory(generations);
      } catch (err) {
        setError('Failed to load generation history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (newGeneration) {
        setHistory(prev => {
            const exists = prev.some(item => item.id === newGeneration.id);
            if (!exists) {
                const updatedHistory = [newGeneration, ...prev];
                return updatedHistory.slice(0, 5);
            }
            return prev;
        });
    }
  }, [newGeneration]);

  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold text-brand-text mb-4">Recent Generations</h2>
      {loading ? (
        <div className="flex justify-center items-center h-48"><Spinner /></div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-brand-text-secondary">No generations yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map(gen => (
            <li
              key={gen.id}
              onClick={() => onRestore(gen)}
              className="flex items-center space-x-4 p-2 rounded-md hover:bg-brand-primary cursor-pointer transition-colors duration-200"
              role="button"
              tabIndex={0}
              aria-label={`Restore generation with prompt: ${gen.prompt}`}
            >
              <img src={gen.imageUrl} alt={gen.prompt} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-brand-text truncate">{gen.prompt}</p>
                <p className="text-xs text-brand-text-secondary">{gen.style} - {new Date(gen.createdAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPanel;
