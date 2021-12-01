import { Component, Input, OnInit, Output , EventEmitter } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { SpinnerService } from 'src/app/services/spinner.service';
import { PdfMakeWrapper, Table, Img, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { ConferenciasService } from 'src/app/services/conferencias.service'

export interface Conferencia {
  Correo_Encargado:string
  Descripcion:string
  Emision_Diplomas:number
  Estado_Conferencia:string
  Fecha_Inicio:Date
  Firma_Encargado:any
  Firma_Organizador:any
  Hora_Final:string
  Hora_Inicio:Date
  Id:number
  Id_Evento:number
  Imagen:string
  Limite_Participantes:number
  Medio:string
  Modalidad:number
  Nombre:string
  Tipo:number

}
type TableRow = [string, string];

@Component({
  selector: 'app-card-evento',
  templateUrl: './card-evento.component.html',
  styleUrls: ['./card-evento.component.css']
})
export class CardEventoComponent implements OnInit {

  @Input() evento:any;
  @Output() onClickCardEvento = new EventEmitter<number>();
  conferencias:Conferencia[] = []


  constructor( private serviceConferencia:ConferenciasService, private spinner:SpinnerService) { }

  ngOnInit(): void {

  }

  async createPDF(data){
        console.log(this.evento);

        PdfMakeWrapper.setFonts(pdfFonts);

        /* Definición elementos */
        const tabla= new Table([
          [ 'Fecha', 'Hora Inicio', 'Hora Final', 'Nombre', 'Descripción'],
          ...this.extraerDatos(data)
        ])
        .layout('lightHorizontalLines')
        .widths(['*', '*' ,'*',100,100])
        .end;
        const pdf = new PdfMakeWrapper();
        const textTitulo = new Txt(this.evento.Nombre).alignment('center').bold().end;
        const textDescripcion = new Txt(this.evento.Descripcion).alignment('justify').bold().end;

        /*Colocación elementos en el pdf*/
        pdf.add(textTitulo);
        pdf.add('\n');
        pdf.add(textDescripcion);
        pdf.add('\n');
        pdf.add(`Institución: ${this.evento.Institucion}`);
        pdf.add('\n');
        pdf.add(`Fechas: ${this.evento.Fecha_Inicio.substr(0,10)} al ${this.evento.Fecha_Final.substr(0,10)}`);
        pdf.add('\n');
        pdf.add(`Estado: ${this.evento.Estado_Evento}`);
        pdf.add('\n');
        pdf.add( await new Img(`${this.evento.Caratula}`).build() );
        pdf.add('\n');
        pdf.add('\n');
        pdf.add('Conferencias:');
        pdf.add(tabla);
        pdf.create().download();
  }

  extraerDatos(datos): TableRow[]{
    return datos.map(row => [row.Fecha_Inicio.substr(0,10), row.Hora_Inicio, row.Hora_Final, row.Nombre,  row.Descripcion])
  }

  obtenerConferencias(){
    this.serviceConferencia.obtenerConferencias( this.evento.Id ).subscribe(
      (res:any) => {
        this.createPDF(res.data);
      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          this.conferencias = [];
          console.log("No se encontro conferencias para este evento")
        }
        this.spinner.ocultarSpinner()
      },
      () => {
        this.spinner.ocultarSpinner()

      }
    );
  }

  seleccionarEvento(idEvento:number){
    this.onClickCardEvento.emit(idEvento);
  }

}
