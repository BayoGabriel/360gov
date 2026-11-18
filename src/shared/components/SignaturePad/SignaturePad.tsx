import { useEffect, useRef, useState } from 'react';
import { Eraser } from 'lucide-react';
import type { SignatureSource } from '../../../features/settings/types/settings.types';
import { canvasToPngDataUrl, trimCanvas } from '../../lib/image-trim';
import styles from './SignaturePad.module.css';

/** A captured signature, ready to store via the settings API. */
export interface SignatureDraft {
  imageDataUrl: string;
  source: SignatureSource;
  label: string;
}

type PadTab = 'draw' | 'type' | 'upload';

const CANVAS_WIDTH = 560;
const CANVAS_HEIGHT = 200;
const INK_COLOR = '#1d2939';

const SCRIPT_FONTS: { id: string; label: string; stack: string }[] = [
  {
    id: 'script',
    label: 'Script',
    stack: "'Segoe Script','Lucida Handwriting',cursive",
  },
  {
    id: 'brush',
    label: 'Brush',
    stack: "'Brush Script MT','Segoe Script',cursive",
  },
  {
    id: 'classic',
    label: 'Classic',
    stack: "'Edwardian Script ITC','Palace Script MT',serif",
  },
];

interface SignaturePadProps {
  /**
   * Emits the captured signature (or null when the pad is empty) whenever
   * the user draws, types, uploads, or clears.
   */
  onChange: (draft: SignatureDraft | null) => void;
}

/**
 * Three-way signature capture: freehand drawing on canvas, a typed name
 * rendered in a script face, or an uploaded image. Every mode produces a
 * transparent-margin-trimmed PNG so the stamp sits cleanly on documents.
 */
export function SignaturePad({ onChange }: SignaturePadProps) {
  const [tab, setTab] = useState<PadTab>('draw');
  const [typedText, setTypedText] = useState('');
  const [fontId, setFontId] = useState(SCRIPT_FONTS[0].id);
  const [hasInk, setHasInk] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const fileInputId = 'signature-upload-input';

  const emitCanvas = (source: SignatureSource, label: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const trimmed = trimCanvas(canvas);
    onChange(
      trimmed
        ? { imageDataUrl: canvasToPngDataUrl(trimmed), source, label }
        : null,
    );
  };

  /* Drawing */

  const pointFor = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    };
  };

  const startStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    context.strokeStyle = INK_COLOR;
    context.lineWidth = 2.5;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    const point = pointFor(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    // A dot counts as ink (tap without drag).
    context.lineTo(point.x + 0.01, point.y + 0.01);
    context.stroke();
    setHasInk(true);
  };

  const continueStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    const point = pointFor(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const endStroke = () => {
    if (!drawing.current) return;
    drawing.current = false;
    emitCanvas('drawn', 'Drawn signature');
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas?.getContext('2d')?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setHasInk(false);
    onChange(null);
  };

  /* Typing */

  useEffect(() => {
    if (tab !== 'type') return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const text = typedText.trim();
    if (!text) {
      onChange(null);
      return;
    }
    const font = SCRIPT_FONTS.find((f) => f.id === fontId) ?? SCRIPT_FONTS[0];
    context.fillStyle = INK_COLOR;
    context.font = `italic 64px ${font.stack}`;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    emitCanvas('typed', text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, typedText, fontId]);

  /* Upload */

  const uploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const scale = Math.min(
          CANVAS_WIDTH / image.width,
          CANVAS_HEIGHT / image.height,
          1,
        );
        const width = image.width * scale;
        const height = image.height * scale;
        context.drawImage(
          image,
          (CANVAS_WIDTH - width) / 2,
          (CANVAS_HEIGHT - height) / 2,
          width,
          height,
        );
        emitCanvas('uploaded', file.name);
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const selectTab = (next: PadTab) => {
    setTab(next);
    onChange(null);
  };

  return (
    <div className={styles.pad}>
      <div className={styles.tabs} role="tablist" aria-label="Signature method">
        {(['draw', 'type', 'upload'] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`${styles.tab} ${tab === id ? styles.tabActive : ''}`}
            onClick={() => selectTab(id)}
          >
            {id === 'draw' ? 'Draw' : id === 'type' ? 'Type' : 'Upload'}
          </button>
        ))}
      </div>
      {tab === 'draw' ? (
        <>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className={styles.canvas}
            aria-label="Draw your signature"
            onPointerDown={startStroke}
            onPointerMove={continueStroke}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
          />
          <div className={styles.canvasFooter}>
            <span className={styles.hint}>Sign inside the box</span>
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearCanvas}
              disabled={!hasInk}
            >
              <Eraser size={14} aria-hidden="true" />
              Clear
            </button>
          </div>
        </>
      ) : tab === 'type' ? (
        <div className={styles.typePane}>
          <input
            type="text"
            className={styles.typeInput}
            placeholder="Type your name"
            aria-label="Type your name"
            value={typedText}
            onChange={(event) => setTypedText(event.target.value)}
          />
          <div className={styles.fontChoices}>
            {SCRIPT_FONTS.map((font) => (
              <label key={font.id} className={styles.fontChoice}>
                <input
                  type="radio"
                  name="signature-font"
                  checked={fontId === font.id}
                  onChange={() => setFontId(font.id)}
                />
                <span style={{ fontFamily: font.stack }}>{font.label}</span>
              </label>
            ))}
          </div>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className={styles.canvas}
            aria-label="Typed signature preview"
          />
        </div>
      ) : (
        <div className={styles.uploadPane}>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className={styles.canvas}
            aria-label="Uploaded signature preview"
          />
          <label className={styles.uploadButton} htmlFor={fileInputId}>
            Choose image…
          </label>
          <input
            id={fileInputId}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className={styles.hiddenInput}
            aria-label="Upload signature image"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadImage(file);
              event.target.value = '';
            }}
          />
          <span className={styles.hint}>
            PNG with a transparent background works best.
          </span>
        </div>
      )}
    </div>
  );
}
