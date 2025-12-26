/**
 * TypeScript types for Super Admin Dashboard
 * Mirrors the backend Pydantic schemas
 */

export interface TimeSeriesDataPoint {
  period: string;
  value: number;
}

export interface TimeSeriesResponse {
  period_type: string;
  title: string;
  data: TimeSeriesDataPoint[];
}

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartResponse {
  title: string;
  data: BarChartDataPoint[];
}

export interface CategoryDistributionDataPoint {
  label: string;
  count: number;
}

export interface CategoryDistributionResponse {
  title: string;
  category_type: string;
  data: CategoryDistributionDataPoint[];
}

export interface SystemStatsResponse {
  // Manuscript stats
  total_manuscripts: number;
  in_evaluation: number;
  total_submitted: number;
  total_rejected: number;
  total_accepted: number;
  total_published: number;
  awaiting_evaluators: number;

  // User stats
  total_authors: number;
  total_editors: number;
  total_evaluators: number;

  // Rates (percentages)
  rejection_rate: number;
  acceptance_rate: number;
  publication_rate: number;
  evaluation_rate: number;
}

export interface SuperAdminDashboardResponse {
  stats: SystemStatsResponse;
  status_bar_chart: BarChartResponse;
  theme_bar_chart: CategoryDistributionResponse;
  section_bar_chart: CategoryDistributionResponse;
  language_bar_chart: CategoryDistributionResponse;
  weekly_submissions: TimeSeriesResponse;
  monthly_submissions: TimeSeriesResponse;
  yearly_submissions: TimeSeriesResponse;
  weekly_authors: TimeSeriesResponse;
  monthly_authors: TimeSeriesResponse;
  yearly_authors: TimeSeriesResponse;
}
