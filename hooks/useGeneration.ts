
import { useState, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import type { Generation, GenerationRequest } from '../types';
import { MAX_RETRIES } from '../constants';

type GenerationStatus = 'idle' | 'loading' | 'retrying' | 'success' | 'error' | 'aborted';

interface GenerationState {
    status: GenerationStatus;
    error: string | null;
    result: Generation | null;
    retryCount: number;
}

export const useGeneration = () => {
    const [state, setState] = useState<GenerationState>({
        status: 'idle',
        error: null,
        result: null,
        retryCount: 0,
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const reset = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setState({
            status: 'idle',
            error: null,
            result: null,
            retryCount: 0,
        });
    }, []);
    
    const generate = useCallback(async (data: GenerationRequest) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        
        const attemptGeneration = async (attempt: number) => {
            setState(prev => ({ 
                ...prev, 
                status: attempt > 1 ? 'retrying' : 'loading', 
                retryCount: attempt - 1,
                error: null 
            }));

            try {
                const result = await apiService.createGeneration(data, abortControllerRef.current!.signal);
                setState({ status: 'success', result, error: null, retryCount: attempt - 1 });
                return result;
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    setState(prev => ({ ...prev, status: 'aborted', error: 'Generation was aborted.'}));
                    throw error;
                }
                
                if (error.message === 'Model overloaded' && attempt <= MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // simple backoff
                    return attemptGeneration(attempt + 1);
                } else {
                    const errorMessage = attempt > MAX_RETRIES ? `Failed after ${MAX_RETRIES} retries.` : error.message;
                    setState({ status: 'error', error: errorMessage, result: null, retryCount: attempt - 1 });
                    throw new Error(errorMessage);
                }
            }
        };

        return attemptGeneration(1);

    }, []);

    const abort = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setState(prev => ({...prev, status: 'aborted'}));
        }
    }, []);

    return { ...state, generate, abort, reset };
};
