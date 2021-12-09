import { Component, OnInit, NgModule, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Data_BAR_CHAR } from 'src/app/models/barChar';
import { IBarChart } from 'src/app/models/charts.interface';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @Input() evento:any;
  data: IBarChart[] = [];
  view: [number,number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Conferencia';
  showYAxisLabel = true;
  yAxisLabel = 'Asistentes';

  colorScheme:any = {
    domain: ['#4484CE', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {

   }

   onSelect(event) {
    console.log(event);
  }

  ngOnInit(): void {
    this.obtenerData()
  }

  obtenerData(){
    setTimeout(() => {
      this.data = Data_BAR_CHAR;
    }, 300);
  }
}
