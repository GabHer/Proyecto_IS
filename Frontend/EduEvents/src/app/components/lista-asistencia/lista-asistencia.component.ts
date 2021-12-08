import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControlName, Validators, FormControl} from '@angular/forms';
import { ConferenciasService } from 'src/app/services/conferencias.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { DiplomaService } from 'src/app/services/diploma.service';
import { MatListOption } from '@angular/material/list';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlowAssignment } from 'typescript';
import { DomSanitizer } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfMakeWrapper, Table, Img, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
type TableRow = [string, string];

@Component({
  selector: 'app-lista-asistencia',
  templateUrl: './lista-asistencia.component.html',
  styleUrls: ['./lista-asistencia.component.css']
})
export class ListaAsistenciaComponent implements OnInit {

  organizador = false;
  encargado = false;
  inscritos : any;
  mensajeNoInscritos = false;
  idUsuarioSeleccionado: any;
  asistencias: any;
  listaAsistencia:any;
  boolOrganizador: any;
  boolEncargado: any;
  jsonGenerarDiplomas: any;
  boolEmisionAsistencia = false;
  boolEmisionFirmas = false;
  deshabilitar=true;
  archivoFirma:any;
  formularioFirma = new FormGroup(
    {
      inputFirma:new FormControl("", [Validators.required]),
      inputReadOnly: new FormControl("")
    }
  );

  @Output() verConferencias = new EventEmitter<any>();
  @Input() idConferencia:number;
  vistaActual = {
    vistaUsuario:false,
    vistaLista: true
  }

  constructor(private sanitizer: DomSanitizer, private serviceConferencia:ConferenciasService, private serviceAsistencia:AsistenciaService, private serviceDiploma:DiplomaService, private modalService:NgbModal ) { }

  ngOnInit(  ): void {
    this.obtenerInscripcionesConferencias();
    this.emisionAsistencias();
    this.emisionFirmas();
  };

  emisionFirmas(){
    this.serviceDiploma.seleccionFirmas(this.idConferencia).subscribe(
      (res:any) => {
        if(res.data[0]['Seleccionado_Firmas']==1){
          this.boolEmisionFirmas = true;
        }

      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          console.log("No se pudo obtener");
        }
      }

    );
  }

  onGroupsChange(options: MatListOption[]) {
    this.listaAsistencia = options.map(o => o.value);

    if(this.listaAsistencia.length == 0){
      this.listaAsistencia = null;
    }
  }

  onOrganizador(options: MatListOption[]){
    this.boolOrganizador = options.map(o => o.value);
    this.boolOrganizador.push(0);
    if(this.boolEmisionAsistencia==true && this.archivoFirma != null){
      this.deshabilitar = false;
    }
    if(this.boolEncargado[0]==0 && this.boolOrganizador[0]==0){
      this.deshabilitar = true;
    }
    if(this.boolOrganizador[0]!=null && this.archivoFirma == null){
      this.deshabilitar = true;
    }
    if(this.boolOrganizador[0]==0 && this.archivoFirma != null){
      this.deshabilitar = true;
    }
    if(this.boolEmisionAsistencia==true && this.boolOrganizador[0]==0 && this.boolEncargado[0] != 0){
      this.deshabilitar = false;
    }
    if(this.boolOrganizador[0]==0 && this.boolEncargado[0]==0){
      this.deshabilitar = true;
    }
  }

  onEncargado(options: MatListOption[]){
    this.boolEncargado = options.map(o => o.value);
    this.boolEncargado.push(0);
    if(this.boolEmisionAsistencia==true && this.boolOrganizador==null){
      this.deshabilitar = false;
    }
    if(this.boolEmisionAsistencia==true && this.boolOrganizador!=null && this.archivoFirma != null){
      this.deshabilitar = false;
    }else if(this.boolEmisionAsistencia==true && this.boolEncargado!=null &&  this.boolOrganizador[0]==0 && this.archivoFirma == null){
      this.deshabilitar = false;
    }
    if(this.boolEmisionAsistencia==true &&  this.boolOrganizador[0]==0 && this.boolEncargado[0]!=0){
      this.deshabilitar = false;
    }
    if(this.boolOrganizador[0]==0 && this.boolEncargado[0]==0){
      this.deshabilitar = true;
    }
    if(this.boolEmisionAsistencia==true && this.boolEncargado[0]==0 && this.boolOrganizador[0]!=0 && this.archivoFirma != null){
      this.deshabilitar = false;
    }
  }

  onChangeArchivo(event){
    console.log(event);
    if(event.target.files.length != 0){
      this.extraerBase64(event.target.files[0]).then((contenido:any)=>{
        this.archivoFirma = contenido.base;
      });
    }

    if(this.boolEmisionAsistencia==true && this.boolOrganizador!=null){
      this.deshabilitar = false;
    }
  }

  obtenerInscripcionesConferencias(){
    this.serviceConferencia.obtenerParticipantesConferencia(this.idConferencia).subscribe(
      (res:any) => {
        console.log(res.data);
        this.inscritos = res.data
      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          this.mensajeNoInscritos = true;
          console.log("No se encontró asistentes para esta conferencia");
        }
      }
    );
  }

  emisionAsistencias(){
    this.serviceAsistencia.emisionAsistencias(this.idConferencia).subscribe(
      (res:any) => {
        console.log(res.data[0]['Emision_Asistencia']);

        if(res.data[0]['Emision_Asistencia'] == 1){
          this.boolEmisionAsistencia = true
        }
      },
      err => console.log(err)
    );
  }

  enviarAsistencias(modalDialogoExito){
    this.asistencias = {
      "idConferencia": this.idConferencia,
      "listaAsistencia": this.listaAsistencia
    }

    this.serviceAsistencia.enviarAsistencias( this.asistencias ).subscribe(

      (res:any) => {
        this.abrirModal(modalDialogoExito);
        this.listaAsistencia = null;
        this.boolEmisionAsistencia= true;
        console.log(res.mensaje);
      },

      (err:any) => {
        if( err.error.codigo == 404 ) {
          console.log("No se pudo guardar asistencias");
        }
      }

    );
  }

  abrirModal( modal:any ){
    this.modalService.open(
      modal,
      {
        size: 'xs',
        centered: true
      }
    );
  }

  generarDiplomas(modal){
    if(this.boolEncargado == undefined){
      this.jsonGenerarDiplomas ={
        "idConferencia" : this.idConferencia,
        "firmaOrganizador" : this.boolOrganizador[0],
        "firmaEncargado": this.boolOrganizador[1],
        "imagenFirma": this.archivoFirma
      }
    }else if(this.boolOrganizador == undefined){
      this.jsonGenerarDiplomas ={
        "idConferencia" : this.idConferencia,
        "firmaEncargado": this.boolEncargado[0],
        "firmaOrganizador": this.boolEncargado[1],
        "imagenFirma": ""
      }
    }else{
      this.jsonGenerarDiplomas ={
        "idConferencia" : this.idConferencia,
        "firmaOrganizador" : this.boolOrganizador[0],
        "firmaEncargado": this.boolEncargado[0],
        "imagenFirma": this.archivoFirma
      }
    }

    this.serviceDiploma.enviarFirmas(this.jsonGenerarDiplomas).subscribe(
      (res:any) => {
        console.log(res.mensaje);
        this.abrirModal(modal);
        this.deshabilitar = true;

      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          console.log("No se pudo guardar firmas");
        }
      }

    );

    console.log(this.jsonGenerarDiplomas);
  }

  obtenerAsistencias(){

  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeFile = window.URL.createObjectURL($event);
      const contenido = this.sanitizer.bypassSecurityTrustUrl(unsafeFile);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({

          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          contenido,
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  verUsuario(idUsuario){
    console.log(idUsuario);
    this.vistaActual.vistaUsuario = !this.vistaActual.vistaUsuario
    this.vistaActual.vistaLista = !this.vistaActual.vistaLista
    this.idUsuarioSeleccionado = idUsuario;
  }

  verGestionarAsistentes(){
    this.vistaActual.vistaUsuario = !this.vistaActual.vistaUsuario
    this.vistaActual.vistaLista = !this.vistaActual.vistaLista
  }

  regresar(){
    this.verConferencias.emit(null);
  }

  async createPDF(data){

    PdfMakeWrapper.setFonts(pdfFonts);

    /* Definición elementos */
    const tabla= new Table([
      [ 'Fecha', 'Hora Inicio', 'Hora Final', 'Nombre', 'Modalidad'],
      ...this.extraerDatos(data)
    ])
    .layout('lightHorizontalLines')
    .widths([70, 60 ,60,'*','*'])
    .end;

    const tablaEvento= new Table([
      [ 'Descripción', `` ],
      [ 'Fecha', ``],
      [ 'Institución', ``],
      [ 'Estado', ``]


    ])
    .layout('lightHorizontalLines')
    .widths(['*', '*' ])
    .alignment('center')
    .end;

    const pdf = new PdfMakeWrapper();
    pdf.background(await new Img(`../../../assets/img/BackgroundPdf.png`).alignment('center').build());

    const textConferencias = new Txt('Conferencias o talleres').bold().color('#F19F4D').fontSize(15).end;

    /*Colocación elementos en el pdf*/
    pdf.add( await new Img(`../../../assets/img/EncabezadoPdf.jpg`).alignment('center').width(50).height(50).build() );
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add(tablaEvento);
    pdf.add('\n');
    pdf.add('\n');
    pdf.add('\n');
    pdf.add(textConferencias);
    pdf.add('\n');
    pdf.add(tabla);
    pdf.create().open();
    }

    extraerDatos(datos): TableRow[]{
    console.log(datos);

    return datos.map(row => [row.Fecha_Inicio.substr(0,10), row.Hora_Inicio, row.Hora_Final, row.Nombre])
    }
}
