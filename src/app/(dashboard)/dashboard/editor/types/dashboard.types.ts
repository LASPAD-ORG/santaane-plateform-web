/**
 * Type definitions for Editor Dashboard
 * Aligned with backend schemas from /app/modules/dashboards/schemas.py
 * Note: EditorDashboardResponse has the same structure as SuperAdminDashboardResponse
 */

/**
 * System-wide statistics for editor
 */
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

  // Rates (calculated fields)
  rejection_rate: number;
  acceptance_rate: number;
  publication_rate: number;
  evaluation_rate: number;
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
 * Bar chart data
 */
export interface BarChartResponse {
  title: string;
  data: BarChartDataPoint[];
}

/**
 * Data point for category distribution (theme, section, language)
 */
export interface CategoryDistributionDataPoint {
  label: string;
  count: number;
}

/**
 * Category distribution for bar chart
 */
export interface CategoryDistributionResponse {
  title: string;
  category_type: 'theme' | 'section' | 'language';
  data: CategoryDistributionDataPoint[];
}

/**
 * Single data point for time series (line chart)
 */
export interface TimeSeriesDataPoint {
  period: string;
  count: number;
}

/**
 * Time series data
 */
export interface TimeSeriesResponse {
  period_type: 'week' | 'month' | 'year';
  title: string;
  data: TimeSeriesDataPoint[];
}

/**
 * Complete dashboard response for editor
 */
export interface EditorDashboardResponse {
  // Core stats
  stats: SystemStatsResponse;

  // Distribution bar charts
  status_bar_chart: BarChartResponse;
  theme_bar_chart: CategoryDistributionResponse;
  section_bar_chart: CategoryDistributionResponse;
  language_bar_chart: CategoryDistributionResponse;

  // Time series for submissions
  weekly_submissions: TimeSeriesResponse;
  monthly_submissions: TimeSeriesResponse;
  yearly_submissions: TimeSeriesResponse;

  // Time series for authors
  weekly_authors: TimeSeriesResponse;
  monthly_authors: TimeSeriesResponse;
  yearly_authors: TimeSeriesResponse;
}
