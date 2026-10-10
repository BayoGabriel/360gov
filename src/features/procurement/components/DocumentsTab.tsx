import { PenLine, Upload } from 'lucide-react';
import { useToast } from '../../../shared/components/Toast';
import {
  useSendForSignature,
  useSignDocument,
} from '../queries/procurement.mutations';
import type { Contract, ContractDocument } from '../types/procurement.types';
import { ContractDocumentRow } from './ContractDocumentRow';
import styles from './procurement.module.css';

interface DocumentsTabProps {
  contract: Contract;
  onUploadClick: () => void;
}

export function DocumentsTab({ contract, onUploadClick }: DocumentsTabProps) {
  const toast = useToast();
  const sendForSignature = useSendForSignature(contract.id);
  const sign = useSignDocument(contract.id);
  const busy = sendForSignature.isPending || sign.isPending;

  const signAs = (document: ContractDocument, party: 'ministry' | 'vendor') => {
    sign.mutate(
      { documentId: document.id, party },
      {
        onSuccess: () =>
          toast.success(`Signature recorded on ${document.title}.`),
        onError: () => toast.error('The signature could not be recorded.'),
      },
    );
  };

  const requestSignature = (document: ContractDocument) => {
    sendForSignature.mutate(document.id, {
      onSuccess: () =>
        toast.success(`Signature requested on ${document.title}.`),
      onError: () => toast.error('The signature request could not be sent.'),
    });
  };

  const actionsFor = (document: ContractDocument) => {
    if (document.signature) {
      if (document.signature.status === 'complete') return undefined;
      const unsigned = document.signature.parties.filter((p) => !p.signedAt);
      return (
        <>
          {unsigned.map((party) => (
            <button
              key={party.role}
              type="button"
              className={styles.outlineButton}
              disabled={busy}
              onClick={() => signAs(document, party.role)}
            >
              <PenLine size={14} aria-hidden="true" />
              Sign as {party.role === 'ministry' ? 'Ministry' : 'Vendor'}
            </button>
          ))}
        </>
      );
    }
    if (contract.awardedBidId) {
      return (
        <button
          type="button"
          className={styles.outlineButton}
          disabled={busy}
          onClick={() => requestSignature(document)}
        >
          <PenLine size={14} aria-hidden="true" />
          Send for Signature
        </button>
      );
    }
    return undefined;
  };

  return (
    <div className={styles.tabBody}>
      <div className={styles.tabHeaderRow}>
        <h2 className={styles.sectionTitle}>Contract Documents</h2>
        <button
          type="button"
          className={styles.outlineButton}
          onClick={onUploadClick}
        >
          <Upload size={14} aria-hidden="true" />
          Upload Document
        </button>
      </div>
      {contract.documents.length === 0 ? (
        <p className={styles.status}>No documents attached yet.</p>
      ) : (
        <ul className={styles.docList}>
          {contract.documents.map((doc) => (
            <ContractDocumentRow
              key={doc.id}
              document={doc}
              actions={actionsFor(doc)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
