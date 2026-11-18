import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, PenLine } from 'lucide-react';
import { useAuth } from '../../../app/providers/auth-context';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';
import { Modal } from '../../../shared/components/Modal';
import {
  SignaturePad,
  type SignatureDraft,
} from '../../../shared/components/SignaturePad';
import { useToast } from '../../../shared/components/Toast';
import { useCreateSignature } from '../../settings/queries/settings.mutations';
import { useSignatures } from '../../settings/queries/settings.queries';
import { useApproveFile } from '../queries/documents.mutations';
import type {
  FileRecord,
  Person,
  SignDocumentInput,
} from '../types/documents.types';
import {
  DEFAULT_STAMP_WIDTH,
  moveStamp,
  stampAtPoint,
  type StampGeometry,
} from '../utils/signature-geometry';
import { approveSuccessMessage } from '../utils/workflow-actions';
import { pageCountFor } from './viewer/page-count';
import { PdfPageCanvas } from './viewer/PdfPageCanvas';
import { SignatureStamp } from './viewer/SignatureStamp';
import styles from './documents.module.css';

interface SignDocumentDialogProps {
  document: FileRecord;
  onClose: () => void;
}

interface Placement {
  geometry: StampGeometry;
  page: number;
}

/**
 * Sign-off flow for files that require a signature before approval: pick a
 * stored signature (or capture a new one), place it on a page, then the
 * stamp is applied and the approval submitted in a single action.
 */
export function SignDocumentDialog({
  document,
  onClose,
}: SignDocumentDialogProps) {
  const { session } = useAuth();
  const toast = useToast();
  const role =
    session.status === 'authenticated'
      ? (session.user.role ?? DEFAULT_ROLE)
      : DEFAULT_ROLE;
  const signer: Person =
    session.status === 'authenticated'
      ? { name: session.user.displayName, email: session.user.email }
      : { name: 'Unknown signer', email: '' };

  const signaturesQuery = useSignatures();
  const signatures = signaturesQuery.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected =
    signatures.find((s) => s.id === selectedId) ??
    signatures.find((s) => s.isDefault) ??
    signatures[0];

  // Explicit user choice wins; otherwise default to the pad when the
  // user has no stored signature yet.
  const [creatingChoice, setCreatingChoice] = useState<boolean | null>(
    null,
  );
  const creating =
    creatingChoice ??
    (signaturesQuery.data !== undefined &&
      signaturesQuery.data.length === 0);
  const setCreating = (value: boolean) => setCreatingChoice(value);
  const [draft, setDraft] = useState<SignatureDraft | null>(null);
  const createSignature = useCreateSignature();

  const totalPages = pageCountFor(document);
  const [page, setPage] = useState(1);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const pageRef = useRef<HTMLElement>(null);
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const aspect = selected ? aspects[selected.id] : undefined;

  const approve = useApproveFile();

  // Signature images are data/HTTP URLs; their aspect is needed to size
  // the stamp, so record it as each preview loads.
  const recordAspect = (id: string, image: HTMLImageElement) => {
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      setAspects((prev) =>
        prev[id]
          ? prev
          : { ...prev, [id]: image.naturalWidth / image.naturalHeight },
      );
    }
  };

  const pageRect = () => pageRef.current?.getBoundingClientRect();

  const fracPoint = (event: PointerEvent<HTMLElement>) => {
    const rect = pageRect();
    if (!rect || rect.width === 0 || rect.height === 0) return null;
    return {
      fx: (event.clientX - rect.left) / rect.width,
      fy: (event.clientY - rect.top) / rect.height,
      aspect: rect.width / rect.height,
    };
  };

  const onPagePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!selected || !aspect) return;
    const point = fracPoint(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const onStamp =
      event.target instanceof Element &&
      event.target.closest('[data-stamp]') !== null;
    if (onStamp && placement && placement.page === page) {
      dragOffset.current = {
        dx: point.fx - placement.geometry.x,
        dy: point.fy - placement.geometry.y,
      };
      return;
    }
    setPlacement({
      page,
      geometry: stampAtPoint(
        point.fx,
        point.fy,
        DEFAULT_STAMP_WIDTH,
        aspect,
        point.aspect,
      ),
    });
  };

  const onPagePointerMove = (event: PointerEvent<HTMLElement>) => {
    const offset = dragOffset.current;
    if (!offset || !placement) return;
    const point = fracPoint(event);
    if (!point) return;
    setPlacement({
      page,
      geometry: moveStamp(
        placement.geometry,
        point.fx - offset.dx,
        point.fy - offset.dy,
      ),
    });
  };

  const endDrag = () => {
    dragOffset.current = null;
  };

  const saveDraft = () => {
    if (!draft) return;
    createSignature.mutate(draft, {
      onSuccess: (signature) => {
        toast.success('Signature saved.');
        setSelectedId(signature.id);
        const image = new Image();
        image.onload = () => recordAspect(signature.id, image);
        image.src = signature.imageDataUrl;
        setCreating(false);
        setDraft(null);
      },
      onError: () => toast.error('The signature could not be saved.'),
    });
  };

  const signAndApprove = () => {
    if (!selected || !placement) return;
    const signature: SignDocumentInput = {
      signatureId: selected.id,
      signer,
      page: placement.page,
      x: placement.geometry.x,
      y: placement.geometry.y,
      width: placement.geometry.width,
    };
    approve.mutate(
      { fileId: document.id, signature },
      {
        onSuccess: () => {
          toast.success(approveSuccessMessage({ role }, document.fileNo));
          onClose();
        },
        onError: () =>
          toast.error('The file could not be signed and approved.'),
      },
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Sign ${document.fileNo}`}
      className={styles.signDialog}
    >
      <div className={styles.signLayout}>
        <div className={styles.signStageCol}>
          <div className={styles.signPager}>
            <button
              type="button"
              className={styles.pageButton}
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageButton}
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
          <div className={styles.signStage}>
            <PdfPageCanvas
              file={document}
              page={page}
              scale={1}
              pageRef={pageRef}
              onPointerDown={onPagePointerDown}
              onPointerMove={onPagePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {placement && placement.page === page && selected ? (
                <SignatureStamp
                  pending
                  placement={{
                    x: placement.geometry.x,
                    y: placement.geometry.y,
                    width: placement.geometry.width,
                    imageDataUrl: selected.imageDataUrl,
                    signer,
                    signedAt: new Date().toISOString(),
                  }}
                  caption={`${signer.name} — drag to position`}
                />
              ) : null}
            </PdfPageCanvas>
          </div>
          <p className={styles.signHint}>
            This file requires a signature before approval. Select a
            signature, then click on the page to place it — drag to adjust.
          </p>
        </div>
        <aside className={styles.signSide}>
          {creating ? (
            <>
              <SignaturePad onChange={setDraft} />
              <div className={styles.dialogActions}>
                {signatures.length > 0 ? (
                  <button
                    type="button"
                    className={styles.outlineButton}
                    onClick={() => setCreating(false)}
                  >
                    Back
                  </button>
                ) : null}
                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={!draft || createSignature.isPending}
                  onClick={saveDraft}
                >
                  Save signature
                </button>
              </div>
            </>
          ) : (
            <>
              <ul
                className={styles.signatureOptions}
                aria-label="Your signatures"
              >
                {signaturesQuery.isPending ? (
                  <li className={styles.recipientMeta}>
                    Loading signatures…
                  </li>
                ) : signaturesQuery.isError ? (
                  <li className={styles.errorText} role="alert">
                    Signatures could not be loaded.
                  </li>
                ) : (
                  signatures.map((signature) => (
                    <li key={signature.id}>
                      <label className={styles.signatureOption}>
                        <input
                          type="radio"
                          name="sign-signature"
                          checked={selected?.id === signature.id}
                          onChange={() => setSelectedId(signature.id)}
                        />
                        <span className={styles.signatureOptionPreview}>
                          <img
                            src={signature.imageDataUrl}
                            alt=""
                            onLoad={(event) =>
                              recordAspect(
                                signature.id,
                                event.currentTarget,
                              )
                            }
                          />
                        </span>
                        <span className={styles.signatureOptionLabel}>
                          {signature.label}
                          {signature.isDefault ? ' · Default' : ''}
                        </span>
                      </label>
                    </li>
                  ))
                )}
              </ul>
              <button
                type="button"
                className={styles.outlineButton}
                onClick={() => setCreating(true)}
              >
                <PenLine size={14} aria-hidden="true" />
                New signature
              </button>
            </>
          )}
          {approve.isError ? (
            <p className={styles.errorText} role="alert">
              The file could not be signed. Please try again.
            </p>
          ) : null}
          <div className={styles.dialogActions}>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={!selected || !placement || approve.isPending}
              onClick={signAndApprove}
            >
              {role === 'evc' ? 'Sign & Approve' : 'Sign & Submit'}
            </button>
          </div>
        </aside>
      </div>
    </Modal>
  );
}
