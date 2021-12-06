import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ConferenciasService } from 'src/app/services/conferencias.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { EventosService } from 'src/app/services/eventos.service';
import { ListaBlancaService } from 'src/app/services/lista-blanca.service';
export interface Conferencia {
  Asistencia: null
  Correo_Encargado:string
  Descripcion:string
  Emision_Diplomas:number
  Estado_Conferencia:string
  Fecha_Inicio:Date
  Fecha_Inscripcion:Date
  Firma_Encargado:any
  Firma_Organizador:any
  Hora_Final:string
  Hora_Inicio:Date
  Id:number
  Id_Conferencia:number
  Id_Evento:number
  Id_Persona:number
  Imagen:string
  Limite_Participantes:number
  Medio:string
  Modalidad:number
  Nombre:string
  Tipo:number,
  Lista_Participantes:any
}


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
  constructor( private usuarioService:UsuariosService, private listaBlancaService:ListaBlancaService, private eventoService:EventosService, private conferenciaService:ConferenciasService, private spinner:SpinnerService, private modalService:NgbModal  ) { }
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

  
  srcListaBlanca:any = null;
  listaBlanca:any = null;
  usuarioActual:any;
  usuarioEncargado:any;
  isParticipante = false;
  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Eliminar?", titulo2:"La conferencia o taller se eliminaran del evento", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
  ]
  ngOnInit(): void {
    this.obtenerUsuarioEncargado()
    this.obtenerUsuarioActual()
    this.obtenerArchivoListaBlanca()


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


  validarSiEsParticipante(){


    for( let i = 0; i < this.conferencia.Lista_Participantes.length; i++ ){

      if( this.conferencia.Lista_Participantes[i].Id == this.usuarioActual.Id ){

        this.isParticipante = true;

        return;
      }
    }

    this.isParticipante = false;

  }

  desInscribirme(modalExito:any, modalError:any){
    console.log("No programado...")
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




}
