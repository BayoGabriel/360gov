import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from './ai-api';
import type { AiAssistRequest, AiAssistResult } from './ai.types';

/**
 * Shared hook behind every AI affordance in the app. Keeps generation state
 * (thinking / done / error) local to the invoking surface; nothing is cached
 * globally and nothing executes actions — output is text for a human to review.
 */
export function useAiAssist() {
  const [text, setText] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<AiAssistRequest | null>(null);

  const mutation = useMutation({
    mutationFn: (request: AiAssistRequest) => aiApi.assist(request),
    onSuccess: (result) => setText(result.text),
  });

  const generate = (
    request: AiAssistRequest,
    onSuccess?: (result: AiAssistResult) => void,
  ) => {
    setLastRequest(request);
    setText(null);
    mutation.mutate(request, { onSuccess });
  };

  const regenerate = () => {
    if (lastRequest) {
      setText(null);
      mutation.mutate(lastRequest);
    }
  };

  return {
    generate,
    regenerate,
    text,
    isPending: mutation.isPending,
    isError: mutation.isError,
    retry: () => lastRequest && generate(lastRequest),
    reset: () => setText(null),
  };
}
