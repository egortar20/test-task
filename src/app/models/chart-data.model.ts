import { TimeSeries } from "./time-series.model";

export interface ChartData {
    name: string;
    series: TimeSeries[]
}