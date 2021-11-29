import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-vista-conferencia-talleres',
  templateUrl: './vista-conferencia-talleres.component.html',
  styleUrls: ['./vista-conferencia-talleres.component.css']
})
export class VistaConferenciaTalleresComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  @Input() isCollaps = false;



}
