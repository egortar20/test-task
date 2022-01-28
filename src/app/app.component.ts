import { Component, OnInit} from '@angular/core';
import { ChartData } from './models/chart-data.model';
import { DataService } from './services/data.service';
import * as shape from 'd3-shape';
import { LegendPosition } from '@swimlane/ngx-charts';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeSeries } from './models/time-series.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  public title = 'test-task';

  public view: [number, number] = [1000, 700];
  public data: ChartData[] = [];
  public legend: boolean = true;
  public showLabels: boolean = true;
  public animations: boolean = true;
  public xAxis: boolean = true;
  public yAxis: boolean = true;
  public showYAxisLabel: boolean = true;
  public showXAxisLabel: boolean = true;
  public xAxisLabel: string = 'Time';
  public yAxisLabel: string = 'Price';
  public timeline: boolean = true;
  public legendPosition: LegendPosition = LegendPosition.Below;
  public autoScale: boolean = false;
  public referenceLine: TimeSeries[] = [];

  public settingsForm!: FormGroup;

  private get autoScaleControl(): FormControl {
    return this.settingsForm.get('autoScale') as FormControl;
  }

  public get refLines(): FormArray {
    return this.settingsForm.get('refLines') as FormArray;
  }

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {}

  public ngOnInit() {
    this.settingsForm = this.fb.group({
      autoScale: [this.autoScale],
      refLines: this.fb.array([]),
    });

    this.autoScaleControl.valueChanges
      .subscribe((value) => {
        this.autoScale = value;
      });

    this.refLines.valueChanges
      .subscribe(() =>{
        this.referenceLine = [];
        this.refLines.controls.forEach((control) => {
          if (control.valid){
            this.referenceLine.push({
              name: `Line ${this.referenceLine.length + 1}`,
              value: Number((control as FormControl).value)
            });
          } else {
            this.referenceLine.push({
              name: `Line ${this.referenceLine.length + 1}`,
              value: 0
            });
          }
        });
        this.data = [...this.data];
      })
    
    this.dataService.getData()
      .subscribe(resp => {
        resp.ranges.forEach((range, index) => {
          this.data.push({
            name: `${range.country} ${range.source_id}`,
            series: []
          });
          range.data.forEach(item => {
            this.data[index].series.push({
              name: new Date(item.date_time_w_tz),
              value: Number(item.rate)
            });
          });
        });
        this.data = [...this.data];
      });
  }

  public isRuleValid(id: number): boolean {
    return (this.refLines.controls[id] as FormControl).value;
  }

  public addRefLine(): void {
    this.refLines.push(this.fb.control('', Validators.pattern(/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/)));
  }

  public deleteRefLine(id: number): void {
    this.refLines.removeAt(id);
  }

}
