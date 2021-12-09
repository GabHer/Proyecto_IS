import { Component, Input, OnInit } from '@angular/core';
import { Data_BAR_CHAR } from 'src/app/models/barChar';
import { IBarChart } from 'src/app/models/charts.interface';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() evento:any;
  data: IBarChart[] = [];
  view: [number,number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition:any = 'below';

  colorScheme:any = {
    domain: ['#4484CE', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() { }

  ngOnInit(): void {
    this.obtenerData();
  }

  obtenerData(){
    setTimeout(() => {
      this.data = Data_BAR_CHAR;
    }, 300);

  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
