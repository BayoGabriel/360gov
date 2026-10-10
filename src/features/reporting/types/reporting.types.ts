export type ReportStatIcon = 'turnaround' | 'activity' | 'productivity';

export interface ReportStat {
  id: string;
  label: string;
  value: number;
  icon: ReportStatIcon;
  href: string;
}

export interface ReportDepartment {
  id: string;
  name: string;
}

export interface ReportSeries {
  name: string;
  data: number[];
}

/** A month-keyed chart payload (categories are month labels). */
export interface MonthlyReport {
  categories: string[];
  series: ReportSeries[];
}

export interface RadialReport {
  total: number;
  series: number[];
  labels: string[];
}

export interface ReportingOverview {
  stats: ReportStat[];
  activeNow: RadialReport;
  officerProductivity: MonthlyReport;
  activitiesLog: MonthlyReport;
}

export interface ReportingApi {
  getOverview(signal?: AbortSignal): Promise<ReportingOverview>;
  listDepartments(signal?: AbortSignal): Promise<ReportDepartment[]>;
  getTurnaround(
    departmentId: string,
    signal?: AbortSignal,
  ): Promise<MonthlyReport>;
}
