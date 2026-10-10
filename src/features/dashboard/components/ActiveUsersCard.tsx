import type { ApexOptions } from 'apexcharts';
import { MoreVertical } from 'lucide-react';
import Chart from 'react-apexcharts';
import type { DashboardData } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { PanelCard } from './PanelCard';

type ActiveUsers = Extract<DashboardData, { role: 'permanent-secretary' }>[
  'activeUsers'];

export function ActiveUsersCard({ activeUsers }: { activeUsers: ActiveUsers }) {
  const options: ApexOptions = {
    chart: { type: 'radialBar' },
    colors: ['#2f6df0', '#6f9bf5', '#aec4fa'],
    labels: activeUsers.labels,
    stroke: { lineCap: 'round' },
    plotOptions: {
      radialBar: {
        hollow: { size: '32%' },
        track: { background: '#eef2f6' },
        dataLabels: {
          name: { show: false },
          value: { show: false },
          total: {
            show: true,
            label: 'Active users',
            fontSize: '13px',
            color: '#667085',
            formatter: () => activeUsers.total.toLocaleString(),
          },
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      markers: { shape: 'circle', size: 6 },
      itemMargin: { horizontal: 8 },
    },
  };

  return (
    <PanelCard
      title="Active now"
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
        type="radialBar"
        series={activeUsers.series}
        options={options}
        height={280}
      />
    </PanelCard>
  );
}
