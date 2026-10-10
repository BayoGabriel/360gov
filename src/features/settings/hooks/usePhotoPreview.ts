import { useEffect, useMemo, useState } from 'react';

/**
 * Holds a locally chosen photo File and exposes an object-URL preview.
 * The preview falls back to the stored photo URL until a file is picked.
 */
export function usePhotoPreview(fallbackUrl?: string) {
  const [file, setFile] = useState<File | null>(null);

  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file],
  );

  // Revoke the previous object URL when it is replaced or on unmount.
  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    [objectUrl],
  );

  return {
    file,
    setFile,
    clear: () => setFile(null),
    previewUrl: objectUrl ?? fallbackUrl,
  };
}
