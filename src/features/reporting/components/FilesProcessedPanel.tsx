import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import type {
  MonthlyReport,
  ReportDepartment,
} from '../types/reporting.types';
import styles from '../reporting.module.css';
import { PanelCard } from './PanelCard';

interface FilesProcessedPanelProps {
  departments: ReportDepartment[];
  selected: string;
  report?: MonthlyReport;
  loading: boolean;
  onSelect: (departmentId: string) => void;
}

export function FilesProcessedPanel({
  departments,
  selected,
  report,
  loading,
  onSelect,
}: FilesProcessedPanelProps) {
  const options: ApexOptions = {
    chart: { type: 'bar', stacked: true, toolbar: { show: false } },
    colors: ['#1e40c9', '#0f2a63', '#aec4fa'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { columnWidth: '55%', borderRadius: 3 },
    },
    xaxis: {
      categories: report?.categories ?? [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#98a2b3' } },
      title: { text: 'Month', style: { fontSize: '12px', color: '#98a2b3' } },
    },
    yaxis: { labels: { style: { colors: '#98a2b3' } } },
    grid: { borderColor: '#f2f4f7' },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: { shape: 'circle', size: 6 },
    },
    tooltip: { shared: true, intersect: false },
  };

  return (
    <PanelCard
      title="Files Processed Per Department"
      headerAction={
        <select
          className={styles.deptSelect}
          value={selected}
          onChange={(event) => onSelect(event.target.value)}
          aria-label="Department"
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      }
    >
      {loading || !report ? (
        <p className={styles.status} role="status">
          Loading department data…
        </p>
      ) : (
        <Chart
          type="bar"
          series={report.series}
          options={options}
          height={360}
        />
      )}
    </PanelCard>
  );
}
