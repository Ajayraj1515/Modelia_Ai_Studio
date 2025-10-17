
export interface User {
  id: string;
  email: string;
}

export type StyleOption = 'Photorealistic' | 'Anime' | 'Vintage' | 'Cyberpunk' | 'Fantasy';

export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: StyleOption;
  createdAt: string;
}

export interface GenerationRequest {
    prompt: string;
    style: StyleOption;
    image: File;
}
