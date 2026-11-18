import { useState } from 'react';
import { useToast } from '../../../shared/components/Toast';
import type { SignatureDraft } from '../../../shared/components/SignaturePad';
import {
  useCreateSignature,
  useDeleteSignature,
  useSetDefaultSignature,
} from '../queries/settings.mutations';
import { useSignatures } from '../queries/settings.queries';

/** State for the Signature settings section: list, create, default, delete. */
export function useSignatureSection() {
  const query = useSignatures();
  const create = useCreateSignature();
  const remove = useDeleteSignature();
  const setDefault = useSetDefaultSignature();
  const toast = useToast();
  const [padOpen, setPadOpen] = useState(false);

  const save = (draft: SignatureDraft) => {
    create.mutate(draft, {
      onSuccess: () => {
        toast.success('Signature saved.');
        setPadOpen(false);
      },
      onError: () => toast.error('The signature could not be saved.'),
    });
  };

  return {
    signatures: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    padOpen,
    openPad: () => setPadOpen(true),
    closePad: () => setPadOpen(false),
    save,
    saving: create.isPending,
    remove: (id: string) =>
      remove.mutate(id, {
        onError: () => toast.error('The signature could not be removed.'),
      }),
    makeDefault: (id: string) =>
      setDefault.mutate(id, {
        onError: () =>
          toast.error('The default signature could not be updated.'),
      }),
  };
}
