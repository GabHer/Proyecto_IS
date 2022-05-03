import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ConferenciasService } from 'src/app/services/conferencias.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { EventosService } from 'src/app/services/eventos.service';
import { ListaBlancaService } from 'src/app/services/lista-blanca.service';
import { Conferencia } from 'src/app/models/conferencia.interface'
import { DiplomaService } from 'src/app/services/diploma.service';
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfMakeWrapper, Table, Img, Txt, Canvas, Line } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
type TableRow = [string, string];

@Component({
  selector: 'app-card-conferencia',
  templateUrl: './card-conferencia.component.html',
  styleUrls: ['./card-conferencia.component.css']
})
export class CardConferenciaComponent implements OnInit {

  @Input() conferencia:Conferencia;
  @Input() isOrganizador = false;
  @Output() onVerEncargado = new EventEmitter<any>();
  @Output() onRegistrarConferencia = new EventEmitter<any>();
  @Output() onVerDetalleEvento = new EventEmitter<any>();
  constructor(private serviceDiploma:DiplomaService, private usuarioService:UsuariosService, private listaBlancaService:ListaBlancaService, private eventoService:EventosService, private conferenciaService:ConferenciasService, private spinner:SpinnerService, private modalService:NgbModal  ) { }
  @Input() eventoSeleccionado:any = {
    id: "",
    descripcion: "",
    nombre: "",
    fechaInicio: "",
    fechaFinal: "",
    institucion: "",
    imagenes: "",
    idOrganizador:-1

  }

  @Input() todoDetalles = false;
  @Input() subscribeEventoSeleccionado:any;

  srcListaBlanca:any = null;
  listaBlanca:any = null;
  usuarioActual:any;
  usuarioEncargado:any;
  usuarioOrganizador:any;
  isParticipante = false;
  fecha: any;
  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Eliminar?", titulo2:"La conferencia o taller se eliminaran del evento", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
    {tipo:"confirmacion", titulo1:"¿Desinscribirse?", titulo2:"Se eliminara su inscripción de este evento", icono:"quiz"},
  ]
  ngOnInit(): void {
    if( this.todoDetalles ){
      this.obtenerEventoActual()
    }else {
      this.obtenerUsuarioEncargado()
      this.obtenerUsuarioOrganizador()
      this.obtenerUsuarioActual()
      this.obtenerArchivoListaBlanca()

    }



  }

  obtenerFormatoFecha( date:any){

    return date.split('T')[0]
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



  mostrarUsuarioEncargado(){
    this.onVerEncargado.emit(this.usuarioEncargado);
  }

  mostrarUsuarioOrganizador(){
    this.onVerEncargado.emit(this.usuarioOrganizador);
  }

  obtenerCorreoUsuarioActual(){
    let tokenUsuario = localStorage.getItem("token");

    if( tokenUsuario ){

       return JSON.parse(tokenUsuario).id;

    }
    return ""
  }

  isEncargado(){
    let correo = this.obtenerCorreoUsuarioActual();
    if(correo == this.conferencia.Correo_Encargado){
      return true;
    }
    return false;
  }

  obtenerUsuarioActual(){
    this.spinner.mostrarSpinner();
    let correo = this.obtenerCorreoUsuarioActual()
    this.usuarioService.obtenerUsuario( correo ).subscribe(
      (res:any) => {

        this.usuarioActual = res.data
        this.validarSiEsParticipante()
        this.spinner.ocultarSpinner()
      },
      (err:any) => {
        this.spinner.ocultarSpinner()
      }
    );

  }


  obtenerUsuarioEncargado(){
    this.spinner.mostrarSpinner()
    this.usuarioService.obtenerUsuario( this.conferencia.Correo_Encargado ).subscribe(
      (res:any) => {

        this.usuarioEncargado = res.data
        this.spinner.ocultarSpinner()
      },
      (err:any) => {
        this.spinner.ocultarSpinner()
      }
    );
  }

  obtenerUsuarioOrganizador(){

    this.spinner.mostrarSpinner()
    this.usuarioService.obtenerUsuarioPorId( this.eventoSeleccionado.idOrganizador ).subscribe(
      (res:any) => {

        this.usuarioOrganizador = res.data
        this.spinner.ocultarSpinner()
      },
      (err:any) => {
        console.log(err)
        this.spinner.ocultarSpinner()
      }
    );
  }


  validarSiEsParticipante(){


    for( let i = 0; i < this.conferencia.Lista_Participantes.length; i++ ){

      if( this.conferencia.Lista_Participantes[i].Id == this.usuarioActual.Id ){

        this.isParticipante = true;

        return;
      }
    }

    this.isParticipante = false;

  }

  desInscribirme(modalExito:any, modalError:any, letmodal:any){
    letmodal.close('Close click')
    this.spinner.mostrarSpinner()
    if( this.usuarioActual.Correo == this.conferencia.Correo_Encargado ){
      this.mensajeModal[1].titulo2 = "No se puede eliminar la inscripción en el evento porque usted es el encargado de dicho evento."
      this.abrirModal(modalError)
      this.spinner.ocultarSpinner()
      return;
    }

    this.conferenciaService.eliminarInscripcion( this.usuarioActual.Id, this.conferencia.Id).subscribe(
      (res:any) => {
        if( res.codigo == 200 ){
          this.abrirModal(modalExito);
          this.isParticipante = false;
        }else {
          this.mensajeModal[1].titulo2 = "No se pudo eliminar su subscripción"
          this.abrirModal(modalError);
        }
        this.spinner.ocultarSpinner()

      },
      (err:any) => {
        if(err.error.codigo == 404){
          this.mensajeModal[1].titulo2 = err.error.mensaje
        }
        this.abrirModal(modalError);
        this.spinner.ocultarSpinner();
      }
    );


  }

  obtenerArchivoListaBlanca(){

    this.spinner.mostrarSpinner();
    if( this.eventoSeleccionado.estadoParticipantes == 0 ){

      this.eventoService.obtenerListaBlanca( this.eventoSeleccionado.id ).subscribe(
        (res:any) => {
          if(res.codigo == 200 ) {
            this.srcListaBlanca = res.data[0].Lista_Blanca;

            this.obtenerListaBlancaDesdeArchivo()
          }
          this.spinner.ocultarSpinner()
        },
        (err:any) => {
          this.spinner.ocultarSpinner()
        }
      );
    }
  }

  obtenerListaBlancaDesdeArchivo(){
    if( this.srcListaBlanca ) {
      this.listaBlancaService.getInfo( this.srcListaBlanca ).subscribe(
        (res:any) => {
          let csvToRowArray = res.split("\n");
          let header = csvToRowArray[0];
          let body = csvToRowArray.slice(1)

          let arrayLista = [];
          for(let index=0; index < body.length -1 ; index++){
            let row = body[index].split(',');
            arrayLista.push({nombre: row[0].trim(), correo: row[1].trim()});
          }
          this.listaBlanca = arrayLista;
        },
        (err:any) => {
          this.listaBlanca = null;
        }
      );
    }
  }

  buscarEnListaBlanca(){
    let correoUsuario = this.usuarioActual.Correo;

    for( let i = 0; i < this.listaBlanca.length; i++ ){
      if( this.listaBlanca[i].correo == correoUsuario ){
        return true;
      }
    }

    return false;

  }

  inscribirme(modlExito:any, modalError:any){

    this.spinner.mostrarSpinner();

    let objInscripcion =  {
     idPersona: this.usuarioActual.Id ,
     idConferencia: this.conferencia.Id
    };

    if( this.eventoSeleccionado.estadoParticipantes == 0 ){
      if( !this.buscarEnListaBlanca() ) {
        this.mensajeModal[1].titulo1 = `No permitido`;
        this.mensajeModal[1].titulo2 = 'Este es un evento privado, no tienes permitido inscribirte en sus conferencias o talleres';
        this.abrirModal(modalError);
        this.spinner.ocultarSpinner()
        return;
      }
    }

    this.conferenciaService.registrarEnConferencia( objInscripcion ).subscribe(

      (res:any) => {
        if(res.codigo == 200){
          this.abrirModal(modlExito);
          this.isParticipante = true;
        }

        if(res.codigo == 400){
          this.mensajeModal[1].titulo1 = res.estado;
          this.mensajeModal[1].titulo2 = res.mensaje;
          this.abrirModal(modalError);
        }
        this.spinner.ocultarSpinner()

      },

      (err:any) => {
        this.mensajeModal[1].titulo1 = `Error: ${err.error.codigo}_${err.error.estado}`;
        this.mensajeModal[1].titulo2 = err.error.mensaje;
        this.abrirModal(modalError);
        this.spinner.ocultarSpinner();
      },
      () => {
        this.spinner.ocultarSpinner();
      }

    );

  }

  obtenerEventoActual(){
    this.subscribeEventoSeleccionado.subscribe(
      (res:any) => {

        this.eventoSeleccionado = {
          caratula: res.data.Caratula,
          descripcion: res.data.Descripcion,
          estadoEvento: res.data.Estado_Evento,
          estadoParticipantes: res.data.Estado_Participantes,
          fechaFinal: res.data.Fecha_Final,
          fechaInicio: res.data.Fecha_Final,
          id: res.data.Id,
          idOrganizador: res.data.Id_Organizador,
          institucion: res.data.Institucion,
          nombre: res.data.Nombre,
          imagenes: res.data.Imagenes
        }
        this.obtenerUsuarioEncargado()
        this.obtenerUsuarioOrganizador()
        this.obtenerUsuarioActual()
        this.obtenerArchivoListaBlanca()
      },
      (err:any) => {
        console.log(err)
      }
    );
  }

  verEvento(){
    this.onVerDetalleEvento.emit(this.conferencia.Id_Evento);
  }

  descargarDiploma(){
    this.serviceDiploma.obtenerDatosDiploma(this.conferencia.Id, this.usuarioActual.Id).subscribe(
      (res:any) => {

        this.createPDF(res.data);

      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          console.log("No se pudo obtener");
        }
      }

    );
  }

  async createPDF(data){
    console.log(data.Firmas);
    PdfMakeWrapper.setFonts(pdfFonts);
    this.fecha = new Date();
    this.fecha = this.fecha.toISOString().split("T")[0]

    if(data.Firmas.length == 1){

      const pdf = new PdfMakeWrapper();
      pdf.pageOrientation('landscape');

      const  textTitulo1= new Txt("Diploma de asistencia").bold().color('#4484CE').alignment('center').fontSize(25).end;
      const  textTitulo2= new Txt("a " + this.obtenerTipo(data.Conferencia.Tipo) + " " + data.Conferencia.Nombre).bold().color('#4484CE').alignment('center').fontSize(25).end;
      const  textTitulo3= new Txt("Otorgado a:").bold().color('#F19F4D').alignment('center').fontSize(15).end;
      const  textNombre= new Txt(`${data.Asistente.Nombre} ${data.Asistente.Apellido}`).bold().color('black').alignment('center').fontSize(25).end;
      const  fecha = new Txt(`entregado en ${this.fecha}`).bold().color('#4484CE').alignment('center').fontSize(13).end;
      const  textNombreOrganizador= new Txt(`${data.Firmas[0].Nombre_Completo}`).bold().color('#4484CE').alignment('center').fontSize(10).end;
      const  textRol= new Txt(`${data.Firmas[0].Rol}`).bold().color('black').alignment('center').fontSize(10).end;

      /*Colocación elementos en el pdf*/
      pdf.add( await new Img(`../../../assets/img/EncabezadoPdf.jpg`).alignment('center').width(50).height(50).build() );
      pdf.add('\n');
      pdf.add('\n');
      pdf.add(textTitulo1);
      pdf.add(textTitulo2);
      pdf.add('\n');
      pdf.add('\n');
      pdf.add(textTitulo3);
      //pdf.add( await new Img(`${data.firmas[0].Imagen}`).alignment('center').width(150).height(150).build() );
      pdf.add('\n');
      pdf.add('\n');
      pdf.add(textNombre);
      pdf.add('\n');
      pdf.add(fecha);
      pdf.add('\n');
      pdf.add('\n');
      pdf.add('\n');
      pdf.add( await new Img(`${data.Firmas[0].Firma}`).alignment('center').width(180).height(120).build() );

      pdf.add(textNombreOrganizador);
      pdf.add(textRol);
      pdf.add('\n');
      pdf.add('\n');
      pdf.create().download();
    }else{


      const pdf = new PdfMakeWrapper();
      pdf.pageOrientation('landscape');

      const  textTitulo1= new Txt("Diploma de asistencia").bold().color('#4484CE').alignment('center').fontSize(25).end;
      const  textTitulo2= new Txt("a " + this.obtenerTipo(data.Conferencia.Tipo) + " " + data.Conferencia.Nombre).bold().color('#4484CE').alignment('center').fontSize(25).end;
      const  textTitulo3= new Txt("Otorgado a:").bold().color('#F19F4D').alignment('center').fontSize(15).end;
      const  textNombre= new Txt(`${data.Asistente.Nombre} ${data.Asistente.Apellido}`).bold().color('black').alignment('center').fontSize(25).end;
      const  fecha = new Txt(`entregado en ${this.fecha}`).bold().color('#4484CE').alignment('center').fontSize(13).end;
      const  textNombreOrganizador= new Txt(`${data.Firmas[0].Nombre_Completo}`).bold().color('#4484CE').alignment('center').fontSize(10).end;
      const  textRol= new Txt(`${data.Firmas[0].Rol}`).bold().color('black').alignment('center').fontSize(10).end;

      const tabla= new Table([
        [await new Img(`${data.Firmas[0].Firma}`).alignment('center').width(180).height(120).build() ,await new Img(`${data.Firmas[1].Firma}`).alignment('center').width(180).height(120).build() ],
        [`${data.Firmas[0].Nombre_Completo}` ,`${data.Firmas[1].Nombre_Completo}`],
        [`${data.Firmas[0].Rol}` ,`${data.Firmas[1].Rol}`],
      ])
      .layout('lightHorizontalLines')
      .widths(['*','*'])
      .alignment('center')
      .end;

      /*Colocación elementos en el pdf*/
      pdf.add( await new Img(`../../../assets/img/EncabezadoPdf.jpg`).alignment('center').width(50).height(50).build() );
      pdf.add('\n');
      pdf.add('\n');
      pdf.add(textTitulo1);
      pdf.add(textTitulo2);
      pdf.add('\n');
      pdf.add('\n');
      pdf.add(textTitulo3);
      //pdf.add( await new Img(`${data.firmas[0].Imagen}`).alignment('center').width(150).height(150).build() );
      pdf.add('\n');
      pdf.add('\n');
      pdf.add(textNombre);
      pdf.add('\n');
      pdf.add(fecha);
      pdf.add('\n');
      pdf.add('\n');

      pdf.add(tabla);
      pdf.create().download();
    }

    }


    obtenerTipo(tipo){
      if(tipo ==1){
        return "conferencia"
      }else{
        return "taller"
      }
    }

}
