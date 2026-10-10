import type { ApexOptions } from 'apexcharts';
import { List } from 'lucide-react';
import Chart from 'react-apexcharts';
import { Link } from 'react-router';
import type { MonthlyReport } from '../types/reporting.types';
import styles from '../reporting.module.css';
import { PanelCard } from './PanelCard';

export function ActivitiesLogPanel({ report }: { report: MonthlyReport }) {
  const options: ApexOptions = {
    chart: { type: 'bar', stacked: true, toolbar: { show: false } },
    colors: ['#1e40c9', '#0f2a63', '#aec4fa'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { columnWidth: '55%', borderRadius: 3 },
    },
    xaxis: {
      categories: report.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#98a2b3' } },
      title: { text: 'Month', style: { fontSize: '12px', color: '#98a2b3' } },
    },
    yaxis: {
      labels: { style: { colors: '#98a2b3' } },
      title: { text: 'Active users', style: { fontSize: '12px' } },
    },
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
      title="Activities Log"
      headerAction={
        <Link to="/documents?view=processed" className={styles.viewAll}>
          <List size={14} aria-hidden="true" />
          View More
        </Link>
      }
    >
      <Chart
        type="bar"
        series={report.series}
        options={options}
        height={300}
      />
    </PanelCard>
  );
}
