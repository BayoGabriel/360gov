import type { ApexOptions } from 'apexcharts';
import { List } from 'lucide-react';
import Chart from 'react-apexcharts';
import { Link } from 'react-router';
import type { MonthlyReport } from '../types/reporting.types';
import styles from '../reporting.module.css';
import { PanelCard } from './PanelCard';

export function OfficerProductivityPanel({
  report,
}: {
  report: MonthlyReport;
}) {
  const options: ApexOptions = {
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
    colors: ['#2f6df0', '#6f9bf5', '#aec4fa'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.25, opacityTo: 0.02 },
    },
    xaxis: {
      categories: report.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#98a2b3' } },
    },
    yaxis: { labels: { show: false } },
    grid: { borderColor: '#f2f4f7' },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: { shape: 'circle', size: 6 },
    },
  };

  return (
    <PanelCard
      title="Officer Productivity"
      headerAction={
        <Link to="/reports/turnaround" className={styles.viewAll}>
          <List size={14} aria-hidden="true" />
          View More
        </Link>
      }
    >
      <Chart
        type="area"
        series={report.series}
        options={options}
        height={290}
      />
    </PanelCard>
  );
}
