import type { ApexOptions } from 'apexcharts';
import { MoreVertical } from 'lucide-react';
import Chart from 'react-apexcharts';
import type { DashboardData } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { PanelCard } from './PanelCard';

type TaskProcessed = Extract<DashboardData, { role: 'permanent-secretary' }>[
  'taskProcessed'];

export function TaskProcessedCard({
  taskProcessed,
}: {
  taskProcessed: TaskProcessed;
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
      categories: taskProcessed.categories,
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
      title="Task Processed Overtime"
      headerAction={
        <button
          type="button"
          className={styles.menuButton}
          aria-label="More options"
        >
          <MoreVertical size={18} aria-hidden="true" />
        </button>
      }
    >
      <Chart
        type="area"
        series={taskProcessed.series}
        options={options}
        height={290}
      />
    </PanelCard>
  );
}
