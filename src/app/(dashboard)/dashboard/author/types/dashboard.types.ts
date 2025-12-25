/**
 * Type definitions for Author Dashboard
 * Aligned with backend schemas from /app/modules/dashboards/schemas.py
 */

/**
 * Statistics for author's manuscripts
 */
export interface ManuscriptStatsResponse {
  total_submitted: number;
  total_rejected: number;
  total_accepted: number;
  total_published: number;
}

/**
 * Single data point for bar chart
 */
export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/**
 * Bar chart data for manuscript status distribution
 */
export interface BarChartResponse {
  title: string;
  data: BarChartDataPoint[];
}

/**
 * Single data point for time series (line chart)
 */
export interface TimeSeriesDataPoint {
  period: string;
  count: number;
}

/**
 * Time series data for submissions over time
 */
export interface TimeSeriesResponse {
  period_type: 'week' | 'month' | 'year';
  title: string;
  data: TimeSeriesDataPoint[];
}

/**
 * Complete dashboard response for author
 */
export interface AuthorDashboardResponse {
  stats: ManuscriptStatsResponse;
  bar_chart: BarChartResponse;
  weekly_submissions: TimeSeriesResponse;
  monthly_submissions: TimeSeriesResponse;
  yearly_submissions: TimeSeriesResponse;
}
