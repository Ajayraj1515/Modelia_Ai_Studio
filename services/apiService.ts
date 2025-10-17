
import type { Generation, GenerationRequest, StyleOption } from '../types';

// --- In-memory database simulation ---
let generations: Generation[] = [
    { id: '1', imageUrl: 'https://picsum.photos/seed/1/512', prompt: 'A stylish model in a futuristic city', style: 'Cyberpunk', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: '2', imageUrl: 'https://picsum.photos/seed/2/512', prompt: 'Vintage polaroid of a 70s rockstar', style: 'Vintage', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: '3', imageUrl: 'https://picsum.photos/seed/3/512', prompt: 'Detailed portrait of an elven queen', style: 'Fantasy', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: '4', imageUrl: 'https://picsum.photos/seed/4/512', prompt: 'A highly detailed photograph of a designer dress', style: 'Photorealistic', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: '5', imageUrl: 'https://picsum.photos/seed/5/512', prompt: 'Dynamic anime character in action pose', style: 'Anime', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API Simulation ---

export const apiService = {
  login: async (email: string, _password: string) => {
    await simulateDelay(500);
    const user = { id: 'user-123', email };
    const token = 'fake-jwt-token';
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  },

  signup: async (email: string, _password: string) => {
    await simulateDelay(800);
    const user = { id: 'user-123', email };
    const token = 'fake-jwt-token';
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  },

  logout: async () => {
    await simulateDelay(200);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getGenerations: async (): Promise<Generation[]> => {
    await simulateDelay(700);
    return [...generations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  },

  createGeneration: async (data: GenerationRequest, signal: AbortSignal): Promise<Generation> => {
    const delay = 1000 + Math.random() * 1000;
    
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            // Simulate 20% error chance
            if (Math.random() < 0.2) {
                reject(new Error('Model overloaded'));
                return;
            }

            const newGeneration: Generation = {
                id: Math.random().toString(36).substring(2, 9),
                imageUrl: `https://picsum.photos/seed/${Math.random()}/512`,
                prompt: data.prompt,
                style: data.style,
                createdAt: new Date().toISOString(),
            };

            generations.unshift(newGeneration);
            generations = generations.slice(0, 10); // Keep memory usage down

            resolve(newGeneration);
        }, delay);
        
        signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new DOMException('Aborted', 'AbortError'));
        });
    });
  }
};
