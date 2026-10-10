import { useState } from 'react';
import { useAiAssist } from '../../../shared/ai/useAiAssist';
import type { AiAssistRequest, AiTask } from '../../../shared/ai/ai.types';
import type { AiCapability } from '../ai-capabilities';

export interface AiHistoryEntry {
  id: string;
  task: AiTask;
  label: string;
  subject: string;
  text: string;
  /** ISO 8601 timestamp. */
  ranAt: string;
}

const TASK_LABELS: Record<AiTask, string> = {
  summarize: 'Summary',
  draft: 'Draft',
  describe: 'Description',
  reply: 'Reply',
  improve: 'Rewrite',
};

export const CONSOLE_TASKS: { id: AiTask; label: string }[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'summarize', label: 'Summarize' },
  { id: 'improve', label: 'Improve' },
  { id: 'reply', label: 'Reply' },
  { id: 'describe', label: 'Describe' },
];

/**
 * Orchestrates the AI hub: the freeform console, capability run dialogs and
 * the session history of everything the officer has generated here.
 */
export function useAiHub() {
  const ai = useAiAssist();
  const [task, setTask] = useState<AiTask>('draft');
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const [capability, setCapability] = useState<AiCapability | null>(null);
  const [history, setHistory] = useState<AiHistoryEntry[]>([]);
  const [viewing, setViewing] = useState<AiHistoryEntry | null>(null);

  const record = (
    request: AiAssistRequest,
    label: string,
    text: string,
  ) => {
    setHistory((prev) =>
      [
        {
          id: `run-${Date.now()}-${prev.length}`,
          task: request.task,
          label,
          subject: request.subject,
          text,
          ranAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 20),
    );
  };

  const run = (request: AiAssistRequest, label?: string) => {
    ai.generate(request, (result) =>
      record(request, label ?? TASK_LABELS[request.task], result.text),
    );
  };

  const runConsole = () => {
    const trimmedSubject = subject.trim();
    if (!trimmedSubject) return;
    run({
      task,
      purpose: `console-${task}`,
      subject: trimmedSubject,
      context: context.trim() || undefined,
    });
  };

  return {
    ai,
    task,
    setTask,
    subject,
    setSubject,
    context,
    setContext,
    runConsole,
    capability,
    openCapability: setCapability,
    closeCapability: () => setCapability(null),
    run,
    history,
    viewing,
    viewEntry: setViewing,
    closeViewing: () => setViewing(null),
  };
}
