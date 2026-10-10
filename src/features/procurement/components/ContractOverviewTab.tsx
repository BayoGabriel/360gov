import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { Contract } from '../types/procurement.types';
import { categoryLabel, methodLabel } from '../utils/procurement-formatters';
import { ContractDocumentRow } from './ContractDocumentRow';
import styles from './procurement.module.css';

export function ContractOverviewTab({ contract }: { contract: Contract }) {
  const meta: { label: string; value: string }[] = [
    { label: 'Category', value: categoryLabel(contract.category) },
    { label: 'Procurement Method', value: methodLabel(contract.method) },
    { label: 'Department', value: contract.department },
    {
      label: 'Visibility',
      value:
        contract.visibility === 'public'
          ? 'Public notice board'
          : 'Restricted vendors',
    },
    { label: 'Created By', value: contract.createdBy.name },
    {
      label: 'Published',
      value: contract.publishedAt
        ? formatListTimestamp(contract.publishedAt)
        : 'Not published yet',
    },
  ];

  return (
    <div className={styles.tabBody}>
      <div className={styles.metaGrid}>
        {meta.map((item) => (
          <div key={item.label}>
            <span className={styles.metaLabel}>{item.label}</span>
            <span className={styles.metaValue}>{item.value}</span>
          </div>
        ))}
      </div>
      <h2 className={styles.sectionTitle}>Requirements</h2>
      <p className={styles.description}>{contract.description}</p>
      <h2 className={styles.sectionTitle}>Deliverables &amp; Scope</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Quantity</th>
              <th scope="col">Unit</th>
            </tr>
          </thead>
          <tbody>
            {contract.items.map((item) => (
              <tr key={item.id}>
                <td className={styles.refCell}>{item.description}</td>
                <td>{item.quantity.toLocaleString()}</td>
                <td>{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className={`${styles.sectionTitle} ${styles.spaced}`}>
        Tender Documents
      </h2>
      <ul className={styles.docList}>
        {contract.documents
          .filter((doc) => doc.kind !== 'agreement')
          .map((doc) => (
            <ContractDocumentRow key={doc.id} document={doc} />
          ))}
      </ul>
    </div>
  );
}
