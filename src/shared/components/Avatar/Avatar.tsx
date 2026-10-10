import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({ name, src, size = 40 }: AvatarProps) {
  if (src) {
    return (
      <img
        className={styles.avatar}
        src={src}
        alt=""
        width={size}
        height={size}
      />
    );
  }
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
