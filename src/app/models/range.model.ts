import { DataItem } from "./data-item.model";

export interface Range {
    source_id: string;
    country: string;
    data: DataItem[];
}