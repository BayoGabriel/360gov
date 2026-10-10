import { ChevronRight } from 'lucide-react';
import { formatLongDate } from '../../../shared/lib/format-date';
import type { Contract } from '../types/procurement.types';
import {
  categoryLabel,
  formatMoney,
} from '../utils/procurement-formatters';
import { ContractStatusBadge } from './ContractStatusBadge';
import styles from './procurement.module.css';

interface ContractsTableProps {
  rows: Contract[];
  onOpenContract: (contract: Contract) => void;
}

export function ContractsTable({ rows, onOpenContract }: ContractsTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Reference No</th>
            <th scope="col">Contract Title</th>
            <th scope="col">Category</th>
            <th scope="col">Est. Value</th>
            <th scope="col">Deadline</th>
            <th scope="col">Bids</th>
            <th scope="col">Status</th>
            <th scope="col" className={styles.chevronCell}>
              <span className={styles.visuallyHidden}>Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((contract) => (
            <tr
              key={contract.id}
              className={styles.clickable}
              onClick={() => onOpenContract(contract)}
            >
              <td className={styles.refCell}>{contract.referenceNo}</td>
              <td>
                <span className={styles.titleCell}>{contract.title}</span>
                <span className={styles.subCell}>{contract.department}</span>
              </td>
              <td>{categoryLabel(contract.category)}</td>
              <td className={styles.moneyCell}>
                {formatMoney(contract.budget, contract.currency)}
              </td>
              <td className={styles.dateCell}>
                {formatLongDate(contract.submissionDeadline)}
              </td>
              <td>
                <span className={styles.countChip}>
                  {contract.applicationCount}
                </span>
              </td>
              <td>
                <ContractStatusBadge status={contract.status} />
              </td>
              <td className={styles.chevronCell}>
                <ChevronRight size={16} aria-hidden="true" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
