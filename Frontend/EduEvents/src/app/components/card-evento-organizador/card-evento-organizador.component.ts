import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-card-evento-organizador',
  templateUrl: './card-evento-organizador.component.html',
  styleUrls: ['./card-evento-organizador.component.css']
})
export class CardEventoOrganizadorComponent implements OnInit {
  @Input() evento:any;
  @Output() onClickEliminarEvento = new EventEmitter<number>();
  @Output() onClickNuevaConferencia = new EventEmitter<number>();
  @Output() onClickDetallesEvento = new EventEmitter<number>();
  @Output() onClickMostrarEstadisticas = new EventEmitter<any>();
  conferencias:Conferencia[] = []
  constructor(private serviceConferencia:ConferenciasService, private spinner:SpinnerService) { }

  ngOnInit(): void {
  }

  eliminarEvento(){
    this.onClickEliminarEvento.emit(this.evento.Id);
  }

  mostrarFormularioConferencia(){
    this.onClickNuevaConferencia.emit(this.evento.Id);
  }

  mostrarDetallesEvento(){
    this.onClickDetallesEvento.emit(this.evento.Id);
  }

  async createPDF(data){


    PdfMakeWrapper.setFonts(pdfFonts);

    /* Definición elementos */
    const tabla= new Table([
      [ 'Fecha', 'Hora Inicio', 'Hora Final', 'Nombre', 'Medio'],
      ...this.extraerDatos(data)
    ])
    .layout('lightHorizontalLines')
    .widths([70, 60 ,60,'*','*'])
    .end;

    const tablaEvento= new Table([
      [ 'Descripción', `${this.evento.Descripcion}` ],
      [ 'Fecha', `${this.evento.Fecha_Inicio.substr(0,10)} al ${this.evento.Fecha_Final.substr(0,10)}`],
      [ 'Institución', `${this.evento.Institucion}`],
      [ 'Estado', `${this.evento.Estado_Evento}`]
    ])
    .layout('lightHorizontalLines')
    .widths(['*', '*' ])
    .alignment('center')
    .end;

    const pdf = new PdfMakeWrapper();
    pdf.background(await new Img(`../../../assets/img/BackgroundPdf.png`).alignment('center').build());

    const textTitulo = new Txt(this.evento.Nombre).alignment('center').bold().color('#4484CE').fontSize(20).end;
    const textConferencias = new Txt('Conferencias o talleres').bold().color('#F19F4D').fontSize(15).end;

    /*Colocación elementos en el pdf*/
    pdf.add( await new Img(`../../../assets/img/EncabezadoPdf.jpg`).alignment('center').width(50).height(50).build() );
    pdf.add('\n');
    pdf.add(textTitulo);
    pdf.add('\n');
    pdf.add( await new Img(`${this.evento.Caratula}`).alignment('center').build() );
    pdf.add('\n');
    pdf.add(tablaEvento);
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add(textConferencias);
    pdf.add('\n');
    pdf.add(tabla);
    pdf.create().download();
}

extraerDatos(datos): TableRow[]{

return datos.map(row => [row.Fecha_Inicio.substr(0,10), row.Hora_Inicio, row.Hora_Final, row.Nombre,  row.Medio])
}

async createPDFSinConferencias(){

  PdfMakeWrapper.setFonts(pdfFonts);

  const tablaEvento= new Table([
    [ 'Descripción', `${this.evento.Descripcion}` ],
    [ 'Fecha', `${this.evento.Fecha_Inicio.substr(0,10)} al ${this.evento.Fecha_Final.substr(0,10)}`],
    [ 'Institución', `${this.evento.Institucion}`],
    [ 'Estado', `${this.evento.Estado_Evento}`]
    ])
    .layout('lightHorizontalLines')
    .widths(['*', '*' ])
    .alignment('center')
    .end;

    const pdf = new PdfMakeWrapper();
    pdf.background(await new Img(`../../../assets/img/BackgroundPdf.png`).alignment('center').build());

    const textTitulo = new Txt(this.evento.Nombre).alignment('center').bold().color('#4484CE').fontSize(20).end;
    const textConferencias = new Txt('¡Aún no hay conferencias o talleres!').bold().alignment('center').color('#F19F4D').fontSize(15).end;

    /*Colocación elementos en el pdf*/
    pdf.add( await new Img(`../../../assets/img/EncabezadoPdf.jpg`).alignment('center').width(50).height(50).build() );
    pdf.add('\n');
    pdf.add(textTitulo);
    pdf.add('\n');
    pdf.add( await new Img(`${this.evento.Caratula}`).alignment('center').build() );
    pdf.add('\n');
    pdf.add(tablaEvento);
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add(textConferencias);
    pdf.add('\n');
    pdf.create().download();
}

obtenerConferencias(){
  this.serviceConferencia.obtenerConferencias( this.evento.Id ).subscribe(
    (res:any) => {
      this.createPDF(res.data);
    },
    (err:any) => {
      if( err.error.codigo == 404 ) {
        this.createPDFSinConferencias();
        this.conferencias = [];
        console.log("No se encontro conferencias para este evento")
      }
    }
  );
}

mostrarEstadisticas(){
  this.onClickMostrarEstadisticas.emit(this.evento);
}

}
