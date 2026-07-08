/**
 * Type definitions for Evaluator Dashboard
 * Aligned with backend schemas from /app/modules/dashboards/schemas.py
 */

/**
 * Statistics for evaluator's assigned manuscripts
 */
export interface EvaluatorStatsResponse {
  awaiting_evaluation: number;
  in_progress: number;
  evaluated: number;
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
 * Bar chart data for evaluation status distribution
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
 * Time series data for evaluations over time
 */
export interface TimeSeriesResponse {
  period_type: 'week' | 'month' | 'year';
  title: string;
  data: TimeSeriesDataPoint[];
}

/**
 * Complete dashboard response for evaluator
 */
export interface EvaluatorDashboardResponse {
  stats: EvaluatorStatsResponse;
  status_bar_chart: BarChartResponse;
  weekly_evaluations: TimeSeriesResponse;
  monthly_evaluations: TimeSeriesResponse;
  yearly_evaluations: TimeSeriesResponse;
}
