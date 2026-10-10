import { useId } from 'react';

/**
 * Folder illustration used on the department files grids: light back panel
 * with a tab, gradient front body, and the white handle notch from the mock.
 */
export function FolderArt() {
  const gradientId = useId();
  return (
    <svg
      viewBox="0 0 96 76"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#4f86f7" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <path
        d="M8 22 a8 8 0 0 1 8-8 h16 l9 9 h39 a8 8 0 0 1 8 8 v10 H8 z"
        fill="#a9c2ff"
      />
      <path
        d="M4 38 a8 8 0 0 1 8-8 h72 a8 8 0 0 1 8 8 v22 a12 12 0 0 1-12 12 H16 a12 12 0 0 1-12-12 z"
        fill={`url(#${gradientId})`}
      />
      <rect x="38" y="47" width="20" height="7" rx="3.5" fill="#ffffff" />
    </svg>
  );
}
