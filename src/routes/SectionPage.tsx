import styles from './SectionPage.module.css';

interface SectionPageProps {
  title: string;
  description?: string;
}

/**
 * Minimal route screen used until each section is implemented.
 */
export function SectionPage({ title, description }: SectionPageProps) {
  return (
    <section>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.note}>
        {description ?? 'This section has not been implemented yet.'}
      </p>
    </section>
  );
}
