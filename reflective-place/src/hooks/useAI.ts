import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';
import type { AIMessage, AIResponse, ChatOptions } from '../services/aiService';

export interface UseAIOptions {
  readonly onSuccess?: (response: string) => void;
  readonly onError?: (error: string) => void;
}

export interface UseAIReturn {
  readonly response: string;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly chat: (messages: ReadonlyArray<AIMessage>, options?: ChatOptions) => Promise<void>;
  readonly clear: () => void;
}

export function useAI(options?: UseAIOptions): UseAIReturn {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const chat = useCallback(async (
    messages: ReadonlyArray<AIMessage>,
    chatOptions?: ChatOptions
  ) => {
    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const result: AIResponse = await aiService.chat(messages, chatOptions);
      
      if (result.error) {
        setError(result.error);
        options?.onError?.(result.error);
      } else {
        setResponse(result.content);
        options?.onSuccess?.(result.content);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clear = useCallback(() => {
    setResponse('');
    setError(null);
  }, []);

  return {
    response,
    isLoading,
    error,
    chat,
    clear,
  };
}
